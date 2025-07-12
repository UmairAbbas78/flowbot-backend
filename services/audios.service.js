const gTTS = require('gtts');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '..', 'audios');
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR);

async function generateTTS(text, outputPath) {
  return new Promise((resolve, reject) => {
    const gtts = new gTTS(text, 'en');
    gtts.save(outputPath, err => {
      if (err) reject(err);
      else resolve(outputPath);
    });
  });
}

async function mergeAudioWithVideo(videoPath, audioPath, outputPath) {
  console.log('audioPath', audioPath);
  console.log('videoPath', videoPath);
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions([
        '-c:v libx264',
        '-c:a aac',
        '-strict experimental',
        '-shortest'
      ])
      .on('end', () => resolve(outputPath))
      .on('error', err => {
        console.error('❌ FFmpeg merge failed:', err.message);
        reject(err);
      })
      .save(outputPath);
  });
}


module.exports = {
  generateTTS,
  mergeAudioWithVideo,
  AUDIO_DIR
};
