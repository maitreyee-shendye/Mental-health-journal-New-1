// moodAnalyzer.js — Naive Bayes-inspired Mood Classifier
// Classifies journal text into 5 mood levels with confidence scoring

/**
 * MOOD LEVELS:
 * 1 = Crisis / Severe Distress    (🔴)
 * 2 = Very Sad / Depressed        (🟠)
 * 3 = Mildly Low / Stressed       (🟡)
 * 4 = Neutral / Okay              (🟢)
 * 5 = Positive / Thriving         (🔵)
 */

// ============================================================
// TRAINING LEXICON — words/phrases mapped to mood levels
// Higher weight = stronger signal for that mood
// ============================================================

const LEXICON = {
  // ── LEVEL 1: Crisis / Severe Distress ──────────────────────
  1: {
    // Suicidal ideation
    "want to die": 10, "wanna die": 10, "kill myself": 10, "end my life": 10,
    "end it all": 10, "suicide": 10, "suicidal": 10, "self harm": 9,
    "self-harm": 9, "cut myself": 9, "cutting myself": 9, "hurt myself": 9,
    "no reason to live": 10, "better off dead": 10, "wish i was dead": 10,
    "wish i were dead": 10, "don't want to be alive": 10, "don't want to exist": 10,
    "can't take it anymore": 8, "can't do this anymore": 7,
    "nobody would care": 8, "no one would care": 8, "no one cares": 7,
    "nobody cares": 7, "want to disappear": 8, "rather die": 9,
    "overdose": 9, "jump off": 8, "slit": 8, "hang myself": 10,
    "ending it": 9, "final goodbye": 9, "goodbye forever": 9,
    "not worth living": 9, "life is meaningless": 7,
    "no point in living": 9, "can't survive": 7, "give up on life": 8,
    "i'm done": 5, "done with everything": 7, "can't breathe": 5,
    "panic attack": 5, "breaking down": 5, "mental breakdown": 6,
  },

  // ── LEVEL 2: Very Sad / Depressed ──────────────────────────
  2: {
    "hopeless": 6, "worthless": 6, "helpless": 5, "useless": 5,
    "empty inside": 6, "feel empty": 6, "feeling empty": 6,
    "numb": 5, "feel numb": 6, "feeling numb": 6,
    "broken": 5, "feel broken": 6, "shattered": 5,
    "depressed": 7, "depression": 7, "deeply sad": 6,
    "can't stop crying": 6, "crying all day": 6, "tears won't stop": 5,
    "hate myself": 7, "hate my life": 7, "disgusted with myself": 6,
    "can't get out of bed": 5, "stayed in bed all day": 5,
    "no energy": 4, "exhausted": 4, "drained": 4,
    "can't eat": 4, "not eating": 4, "lost appetite": 4,
    "can't sleep": 4, "insomnia": 4, "nightmares": 4,
    "no motivation": 5, "lost all motivation": 6, "zero motivation": 5,
    "feel like a failure": 6, "i'm a failure": 6, "total failure": 6,
    "no one understands": 5, "all alone": 5, "completely alone": 6,
    "abandoned": 5, "rejected": 4, "betrayed": 4,
    "miserable": 5, "suffering": 5, "agony": 5, "torment": 5,
    "trapped": 5, "stuck": 3, "lost": 3, "darkness": 4,
    "grief": 5, "mourning": 5, "heartbroken": 5, "devastated": 6,
    "ruined": 4, "destroyed": 4, "falling apart": 5,
    "can't function": 5, "barely surviving": 5, "just existing": 5,
    "don't care anymore": 5, "nothing matters": 6,
  },

  // ── LEVEL 3: Mildly Low / Stressed ─────────────────────────
  3: {
    "sad": 4, "feeling sad": 5, "a bit sad": 3, "kinda sad": 3,
    "unhappy": 4, "not happy": 4, "down": 3, "feeling down": 4,
    "low": 3, "feeling low": 4, "blue": 3, "feeling blue": 4,
    "anxious": 4, "anxiety": 4, "nervous": 3, "worried": 3,
    "worrying": 3, "overthinking": 4, "can't stop thinking": 4,
    "stressed": 4, "stress": 3, "overwhelmed": 4, "pressured": 3,
    "frustrated": 3, "irritated": 3, "annoyed": 3, "agitated": 3,
    "angry": 3, "furious": 4, "mad": 3, "rage": 4,
    "tired": 3, "fatigue": 3, "worn out": 3, "burnt out": 4,
    "burnout": 4, "exhausting": 3,
    "lonely": 4, "loneliness": 4, "isolated": 4, "disconnected": 3,
    "homesick": 3, "miss home": 3, "miss them": 3,
    "bored": 2, "restless": 3, "uneasy": 3, "uncomfortable": 3,
    "confused": 3, "uncertain": 3, "lost direction": 3, "unsure": 2,
    "disappointed": 3, "let down": 3, "upset": 3,
    "insecure": 3, "self doubt": 4, "self-doubt": 4, "not good enough": 5,
    "jealous": 3, "envious": 3, "comparing myself": 4,
    "struggling": 3, "hard day": 3, "tough day": 3, "bad day": 3,
    "rough day": 3, "difficult": 2, "challenging": 2,
    "headache": 2, "sick": 2, "unwell": 2, "pain": 2,
    "crying": 3, "cried": 3, "tears": 3,
    "regret": 3, "guilty": 3, "guilt": 3, "ashamed": 4, "shame": 4,
    "fear": 3, "scared": 3, "afraid": 3, "terrified": 4,
    "moody": 3, "mood swings": 3, "emotional": 2,
  },

  // ── LEVEL 4: Neutral / Okay ────────────────────────────────
  4: {
    "okay": 3, "ok": 3, "fine": 3, "alright": 3, "all right": 3,
    "normal": 3, "average": 2, "nothing special": 2,
    "usual": 2, "routine": 2, "ordinary": 2, "regular day": 3,
    "same as always": 3, "nothing new": 2, "meh": 3,
    "so-so": 3, "not bad": 3, "could be worse": 3,
    "managing": 3, "getting by": 3, "surviving": 2,
    "calm": 3, "peaceful": 3, "relaxed": 3, "at ease": 3,
    "content": 3, "settled": 2, "stable": 3, "steady": 2,
    "balanced": 3, "composed": 2, "collected": 2,
    "rested": 3, "slept well": 3, "good sleep": 3,
    "productive": 3, "focused": 2, "worked": 2, "studied": 2,
    "cooked": 2, "cleaned": 2, "organized": 2,
    "watched": 1, "read": 1, "walked": 2, "exercise": 2, "gym": 2,
  },

  // ── LEVEL 5: Positive / Thriving ───────────────────────────
  5: {
    "happy": 5, "joyful": 5, "joyous": 5, "elated": 6,
    "ecstatic": 7, "thrilled": 6, "delighted": 5,
    "wonderful": 5, "amazing": 5, "fantastic": 5, "incredible": 5,
    "awesome": 4, "great": 4, "excellent": 5, "brilliant": 5,
    "blessed": 5, "fortunate": 4, "lucky": 4,
    "grateful": 5, "thankful": 5, "gratitude": 5, "appreciate": 4,
    "loved": 5, "love": 4, "loving": 4, "beloved": 5,
    "proud": 5, "accomplished": 5, "achievement": 5, "succeeded": 5,
    "excited": 5, "enthusiasm": 4, "eager": 4, "can't wait": 4,
    "inspired": 5, "motivated": 4, "driven": 4, "passionate": 5,
    "hopeful": 4, "optimistic": 5, "positive": 4, "looking forward": 4,
    "confident": 4, "strong": 3, "empowered": 5, "brave": 4,
    "cheerful": 4, "upbeat": 4, "energetic": 4, "vibrant": 4,
    "alive": 4, "refreshed": 4, "rejuvenated": 5,
    "peaceful": 3, "serene": 4, "tranquil": 4, "blissful": 6,
    "fun": 3, "laughter": 4, "laughing": 4, "smiled": 4, "smiling": 4,
    "celebrate": 4, "celebration": 4, "party": 3,
    "best day": 5, "great day": 5, "good day": 4, "lovely day": 5,
    "beautiful": 4, "gorgeous": 3, "sunshine": 3,
    "friendship": 4, "friends": 3, "family": 3, "together": 3,
    "connected": 3, "belong": 4, "accepted": 4,
    "progress": 4, "growth": 4, "improving": 4, "getting better": 4,
    "recovered": 4, "healing": 4, "breakthrough": 5,
    "free": 3, "freedom": 4, "liberated": 5, "relieved": 4, "relief": 4,
  }
};

// ============================================================
// NEGATION WORDS — flip the sentiment of the next word
// ============================================================
const NEGATION_WORDS = new Set([
  "not", "no", "never", "neither", "nobody", "nothing",
  "nowhere", "nor", "cannot", "can't", "won't", "don't",
  "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't",
  "haven't", "hasn't", "hadn't", "wouldn't", "shouldn't",
  "couldn't", "barely", "hardly", "scarcely", "seldom", "rarely"
]);

// ============================================================
// INTENSIFIER WORDS — boost the weight of the next word
// ============================================================
const INTENSIFIERS = {
  "very": 1.5, "extremely": 2.0, "incredibly": 2.0, "absolutely": 1.8,
  "really": 1.4, "so": 1.3, "super": 1.5, "deeply": 1.6,
  "terribly": 1.7, "awfully": 1.5, "totally": 1.5, "completely": 1.6,
  "utterly": 1.8, "quite": 1.2, "pretty": 1.1, "too": 1.3,
};

// ============================================================
// MOOD METADATA — labels, emojis, messages, tips per level
// ============================================================
const MOOD_DATA = {
  1: {
    level: 1,
    label: "Crisis / Severe Distress",
    emoji: "🆘",
    message: "I can see you're going through an incredibly difficult time right now. Please know that you are not alone, and your life matters deeply. What you're feeling right now is temporary, even though it doesn't feel that way.",
    tips: [
      "🆘 Please reach out to a crisis helpline immediately — you deserve support right now",
      "📞 988 Suicide & Crisis Lifeline (US): Call or text 988",
      "📞 iCall (India): 9152987821",
      "📞 Vandrevala Foundation (India): 1860-2662-345",
      "💬 Crisis Text Line: Text HOME to 741741",
      "🏥 Go to your nearest emergency room if you feel unsafe",
      "🤝 Tell someone you trust — a friend, family member, teacher, anyone"
    ],
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626, #991b1b)",
    bgColor: "rgba(220, 38, 38, 0.08)"
  },
  2: {
    level: 2,
    label: "Feeling Very Low",
    emoji: "😢",
    message: "I hear you. What you're carrying sounds really heavy right now, and it's okay to not be okay. These feelings are valid, and you're incredibly brave for expressing them. Things can and do get better.",
    tips: [
      "💙 Consider talking to a therapist or counselor — professional help works",
      "📝 Try writing 3 tiny things you're grateful for, even if they seem small",
      "🚶 Step outside for just 5 minutes — sunlight and fresh air help more than you'd think",
      "📞 Call a friend or loved one — hearing a caring voice can make a difference",
      "🛁 Take care of your body: eat something warm, take a shower, drink water",
      "🎵 Listen to comforting music or a calming podcast"
    ],
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #ea580c, #c2410c)",
    bgColor: "rgba(234, 88, 12, 0.08)"
  },
  3: {
    level: 3,
    label: "Feeling a Bit Low",
    emoji: "😔",
    message: "It sounds like you're having a tough time. That's completely normal — everyone has days like this. Acknowledging your feelings is the first step, and you've already done that by writing here.",
    tips: [
      "🧘 Try a quick 5-minute breathing exercise: breathe in for 4, hold for 4, out for 6",
      "✍️ Write down what's bothering you specifically — naming it gives you power over it",
      "🏃 Move your body: a quick walk, stretching, or even dancing to one song",
      "☕ Make yourself a warm drink and take a mindful 10-minute break",
      "🎯 Pick ONE small task and complete it — small wins build momentum",
      "📵 Take a break from social media for a few hours"
    ],
    color: "#d97706",
    gradient: "linear-gradient(135deg, #d97706, #b45309)",
    bgColor: "rgba(217, 119, 6, 0.08)"
  },
  4: {
    level: 4,
    label: "Doing Okay",
    emoji: "🙂",
    message: "Sounds like a steady day — and that's perfectly good! Not every day needs to be extraordinary. Stability and calm are strengths.",
    tips: [
      "📖 Use this calm energy to plan something fun for the week ahead",
      "🎯 Set a small personal goal for tomorrow",
      "🤝 Reach out to someone you haven't spoken to in a while",
      "🧠 Try learning something new for 15 minutes — a skill, language, or hobby"
    ],
    color: "#16a34a",
    gradient: "linear-gradient(135deg, #16a34a, #15803d)",
    bgColor: "rgba(22, 163, 74, 0.08)"
  },
  5: {
    level: 5,
    label: "Feeling Great!",
    emoji: "✨",
    message: "This is wonderful to hear! Your positive energy shines through your words. Cherish this feeling and remember it — you can come back to this on harder days.",
    tips: [
      "🌟 Write down what made today great — save it for when you need a boost",
      "💌 Share your good energy: compliment someone or send a kind message",
      "🎉 Celebrate yourself — treat yourself to something you enjoy",
      "📸 Capture this moment: take a photo, write more about what made you happy"
    ],
    color: "#2563eb",
    gradient: "linear-gradient(135deg, #2563eb, #7c3aed)",
    bgColor: "rgba(37, 99, 235, 0.08)"
  }
};

// ============================================================
// CORE ANALYZER FUNCTION
// ============================================================

function analyzeMood(text) {
  if (!text || text.trim().length === 0) {
    return { ...MOOD_DATA[4], confidence: 0, rawScores: {} };
  }

  const cleaned = text.toLowerCase()
    .replace(/[^\w\s'-]/g, " ")  // keep apostrophes and hyphens
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ");

  // Build unigrams and bigrams
  const tokens = [];
  for (let i = 0; i < words.length; i++) {
    tokens.push(words[i]);
    if (i < words.length - 1) {
      tokens.push(words[i] + " " + words[i + 1]);
    }
    // Trigrams for key phrases
    if (i < words.length - 2) {
      tokens.push(words[i] + " " + words[i + 1] + " " + words[i + 2]);
    }
  }

  // Score each mood level
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalHits = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isNegated = (i > 0 && NEGATION_WORDS.has(words[i - 1]));
    const intensifier = (i > 0 && INTENSIFIERS[words[i - 1]]) || 1;

    // Check unigram
    for (const [level, lexicon] of Object.entries(LEXICON)) {
      if (lexicon[word]) {
        let targetLevel = parseInt(level);
        let weight = lexicon[word] * intensifier;

        // Negation flips positive ↔ negative (not crisis though)
        if (isNegated && targetLevel !== 1) {
          if (targetLevel === 5) targetLevel = 3;
          else if (targetLevel === 4) targetLevel = 3;
          else if (targetLevel === 2) targetLevel = 4;
          else if (targetLevel === 3) targetLevel = 4;
          weight *= 0.7; // negation weakens signal
        }

        scores[targetLevel] += weight;
        totalHits++;
      }
    }

    // Check bigrams
    if (i < words.length - 1) {
      const bigram = words[i] + " " + words[i + 1];
      for (const [level, lexicon] of Object.entries(LEXICON)) {
        if (lexicon[bigram]) {
          let targetLevel = parseInt(level);
          let weight = lexicon[bigram] * 1.5; // bigrams get a boost
          scores[targetLevel] += weight;
          totalHits++;
        }
      }
    }

    // Check trigrams
    if (i < words.length - 2) {
      const trigram = words[i] + " " + words[i + 1] + " " + words[i + 2];
      for (const [level, lexicon] of Object.entries(LEXICON)) {
        if (lexicon[trigram]) {
          let targetLevel = parseInt(level);
          let weight = lexicon[trigram] * 2.0; // trigrams get big boost
          scores[targetLevel] += weight;
          totalHits++;
        }
      }
    }
  }

  // If no emotional words detected, default to neutral
  if (totalHits === 0) {
    return { ...MOOD_DATA[4], confidence: 0.3, rawScores: scores };
  }

  // Find winning mood level
  let maxScore = 0;
  let winningLevel = 4;
  for (const [level, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      winningLevel = parseInt(level);
    }
  }

  // SAFETY: If crisis level has ANY score, heavily weight it
  // (false negatives for crisis are much worse than false positives)
  if (scores[1] > 0 && scores[1] >= maxScore * 0.3) {
    winningLevel = 1;
    maxScore = scores[1];
  }

  // Calculate confidence (0 to 1)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0
    ? Math.min(maxScore / totalScore, 1)
    : 0.3;

  return {
    ...MOOD_DATA[winningLevel],
    confidence: Math.round(confidence * 100) / 100,
    rawScores: scores
  };
}

module.exports = { analyzeMood, MOOD_DATA };
