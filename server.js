const express = require("express");
const bodyParser = require("body-parser");
const { twiml: { VoiceResponse } } = require("twilio");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/voice", (req, res) => {
  console.log("🔊 Incoming voice call from Twilio");
  console.log("📨 Request body:", req.body);
  const response = new VoiceResponse();
  response.say("Hi! Thank you for calling 900 Degrees Woodfired Pizza. What can I get started for you today?");
  response.record({
    timeout: 5,
    transcribe: true,
    transcribeCallback: "https://twilio-pizza-ai-bot.onrender.com/transcription"
    action: "https://twilio-pizza-ai-bot.onrender.com/voice",
    method: "POST",
    playBeep: true
  });
  res.type("text/xml");
  res.send(response.toString());
});

app.post("/transcription", (req, res) => {
  console.log("✉️ Reached transcription endpoint");
console.log("📄 Transcription text:", req.body.TranscriptionText);
  const orderText = req.body.TranscriptionText || "No transcription available.";
  const response = new VoiceResponse();

  response.say(`Great! You ordered: ${orderText}. We’ll start prepping that right away. A confirmation will be sent shortly. Thanks for choosing 900 Degrees.`);

  // Send email with the order details
  const mailOptions = {
    from: '"900 Degrees Bot" <no-reply@900degrees.com>',
    to: "masterofluck2018@gmail.com",
    subject: "📦 New Pizza Order from Phone Bot",
    html: `<h2>🔥 New Order Received</h2><p><strong>Order:</strong> ${orderText}</p><p><em>Received via voice call transcription.</em></p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email failed:", error);
    } else {
      console.log("Order emailed successfully:", info.response);
    }
  });

  res.type("text/xml");
  res.send(response.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
