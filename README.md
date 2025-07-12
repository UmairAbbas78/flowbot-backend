🧠 FlowBot: AI-Powered Interactive Demo Generator

FlowBot is a backend service that takes user-defined UI interaction steps and generates a video demo with narrated audio using Playwright and Text-to-Speech.

It’s perfect for auto-generating feature walkthroughs or tutorials for web apps using selectors like data-demoid, IDs, or classes.
🚀 Features

    🎥 Records real browser interactions using Playwright

    🎤 Generates natural voice narration from your explanation text

    🧠 Accepts multiple user-defined interaction steps (click, type, etc.)

    📼 Merges audio + video into a final MP4 output

    💾 Stores videos and metadata in MongoDB

📦 Installation
1. Clone the repo

git clone https://github.com/your-username/flowbot-backend.git
cd flowbot-backend

2. Install dependencies

npm install

3. Install FFmpeg

Ensure FFmpeg is installed and globally accessible.

choco install ffmpeg -y     # Windows (with Chocolatey)
brew install ffmpeg         # macOS
sudo apt install ffmpeg     # Ubuntu/Linux

Or use the fallback method in code via @ffmpeg-installer/ffmpeg.

🛠️ How It Works

    The user sends a url, a descriptive explanation, and a list of steps (like clicking and typing).

    The backend uses Playwright to simulate those steps on the provided URL.

    The explanation is converted into narration using Text-to-Speech (via gtts).

    The video and audio are merged using FFmpeg.

    Final MP4 video is saved and accessible via /videos/.

📁 Folder Structure

    /controllers       → Route handlers
    /services          → Playwright recorder, video logic, ffmpeg
    /videos            → Recorded videos
    /audios            → Generated narration audio
    /models            → Mongoose models (Demo)
