// server.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { analyzeMood } = require("./moodAnalyzer");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "https://mental-health-journal-new.vercel.app",
    "https://mental-health-journal-new-git-main-maitreyee-shendyes-projects.vercel.app",
    "https://mental-health-journal-azvtxa9v1-maitreyee-shendyes-projects.vercel.app"
  ],
  credentials: true
}));
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ DB connection error:", err));


const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

// --- Memory store for journals ---
const JournalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  mood: Object
});

const Journal = mongoose.model("Journal", JournalSchema);



// --- Middleware auth ---
const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "No token" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// --- Register ---
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash });
  res.json({ msg: "User registered" });
});

// --- Login ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "No user" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ msg: "Wrong password" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None"
}).json({ msg: "Logged in" });
});

// --- Logout ---
app.post("/logout", (req, res) => {
 res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "None"
}).json({ msg: "Logged out" });
});

// --- Get journals ---
app.get("/journals", auth, async (req, res) => {
  const userJournals = await Journal.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(userJournals);
});

// --- Add journal (now with mood analysis) ---
app.post("/journals", auth, async (req, res) => {
  const mood = analyzeMood(req.body.text);
  const entry = {
    id: Date.now(),
    text: req.body.text,
    createdAt: new Date(),
    mood: {
      level: mood.level,
      label: mood.label,
      emoji: mood.emoji,
      confidence: mood.confidence,
      message: mood.message,
      tips: mood.tips,
      color: mood.color,
      gradient: mood.gradient,
      bgColor: mood.bgColor
    }
  };

  const newEntry = await Journal.create({
  userId: req.userId,
  text: req.body.text,
  mood: entry.mood
});



res.json(newEntry);
});


// --- Analyze mood (standalone endpoint) ---
app.post("/analyze-mood", auth, (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ msg: "No text provided" });
  const mood = analyzeMood(text);
  res.json(mood);
});


// --- Delete journal ---
app.delete("/journals/:id", auth, async (req, res) => {
  await Journal.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});



app.listen(5000, () => console.log("Server running on http://localhost:5000"));