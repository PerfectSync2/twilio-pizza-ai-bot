# 900 Degrees Pizza AI Voice Bot (Twilio)

## How to Deploy on Render

1. Go to https://render.com and log in
2. Click "New" > "Web Service"
3. Choose "Public Git Repository" and paste the GitHub repo link
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
  - Add these Environment Variables:
    - `EMAIL_USER`: your Gmail address (e.g. la.martinezsalom@gmail.com)
    - `EMAIL_PASS`: your Gmail app password (NOT your actual password — generate one at https://myaccount.google.com/apppasswords)
    - `OPENAI_API_KEY` *(optional)*: your OpenAI API key for AI order confirmations
5. After deploy, go to Twilio Console > Phone Numbers > Active Number
   - Set **Voice > A Call Comes In > Webhook**
   - Paste your Render URL + `/voice` (e.g. `https://yourapp.onrender.com/voice`)
6. Done!

This bot:
- Answers with a female voice
- Records and transcribes the call
- Repeats the order to the caller
- Sends a formatted email to your inbox with the order
- Uses ChatGPT to confirm the order in a natural way
- Falls back to a basic confirmation if no OpenAI key is provided
