const { runDemo } = require('../services/demoRecorder.service');
const Demo = require('../models/Demo.model');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateTTS, mergeAudioWithVideo, AUDIO_DIR } = require('../services/audios.service');
const path = require('path');
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.triggerDemo = async (req, res) => {
  const { url, prompt } = req.body;

  console.log("Generating your demo....")

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    if(!result.response) throw new Error('Demo generation failed');
    console.log("Waiting for the ai response...")
    const explanation = result.response.text();

    const demoDoc = new Demo({ prompt, explanation, url });
    await demoDoc.save();

    const videoPath = await runDemo({ url, prompt, demoId: demoDoc._id });

    demoDoc.videoPath = videoPath;
    await demoDoc.save();

    res.json({
      id: demoDoc._id,
      prompt,
      explanation,
      video: `/videos/${demoDoc._id}.webm`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Demo generation failed' });
  }
};

exports.recordManualDemo = async (req, res) => {
  const { url, explanation, steps } = req.body;

  if (!url || !explanation || !Array.isArray(steps)) {
    return res.status(400).json({ error: 'url, explanation, and steps[] are required' });
  }

  try {
    // Save base demo entry
    const demoDoc = new Demo({ url, explanation, steps });
    await demoDoc.save();

    // Step 1: Record video
    const rawVideoPath = await runDemo({ url, steps });

    // Step 2: Generate audio from explanation
    const audioPath = path.join(AUDIO_DIR, `${demoDoc._id}.mp3`);
    await generateTTS(explanation, audioPath);

    // Step 3: Merge audio + video into final .mp4
    const finalVideoPath = path.join(path.dirname(rawVideoPath), `${demoDoc._id}.mp4`);
    await mergeAudioWithVideo(rawVideoPath, audioPath, finalVideoPath);

    // Update demo entry
    demoDoc.videoPath = `/videos/${path.basename(finalVideoPath)}`;
    await demoDoc.save();

    res.json({
      id: demoDoc._id,
      video: demoDoc.videoPath,
      steps,
      explanation
    });
  } catch (err) {
    console.error('❌ Error in manual demo:', err);
    res.status(500).json({ error: 'Failed to record demo' });
  }
};
