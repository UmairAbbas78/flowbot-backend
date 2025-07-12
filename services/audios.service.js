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
    // Get both video and audio durations
    Promise.all([
      new Promise((resolveVideo, rejectVideo) => {
        ffmpeg.ffprobe(videoPath, (err, videoMetadata) => {
          if (err) {
            console.error('❌ Error getting video metadata:', err);
            rejectVideo(err);
            return;
          }
          const videoDuration = videoMetadata.format.duration;
          console.log('Video duration:', videoDuration, 'seconds');
          resolveVideo(videoDuration);
        });
      }),
      new Promise((resolveAudio, rejectAudio) => {
        ffmpeg.ffprobe(audioPath, (err, audioMetadata) => {
          if (err) {
            console.error('❌ Error getting audio metadata:', err);
            rejectAudio(err);
            return;
          }
          const audioDuration = audioMetadata.format.duration;
          console.log('Audio duration:', audioDuration, 'seconds');
          resolveAudio(audioDuration);
        });
      })
    ]).then(([videoDuration, audioDuration]) => {
      // Use the longest duration
      const longestDuration = Math.max(videoDuration, audioDuration);
      console.log('Using longest duration:', longestDuration, 'seconds');
      
      // Now merge with video looped for the longest duration
      ffmpeg()
        .input(videoPath)
        .input(audioPath)
        .outputOptions([
          '-c:v libx264',
          '-c:a aac',
          '-strict experimental',
          '-loop 1',  // Loop the video frame
          `-t ${longestDuration}`  // Set duration to match the longest duration
        ])
        .on('end', () => resolve(outputPath))
        .on('error', err => {
          console.log('❌ ------->', err);
          console.error('❌ FFmpeg merge failed:', err.message);
          reject(err);
        })
        .save(outputPath);
    }).catch(err => {
      console.error('❌ Error getting media durations:', err);
      reject(err);
    });
  });
}


module.exports = {
  generateTTS,
  mergeAudioWithVideo,
  AUDIO_DIR
};
