import './Journal.css'; 
import { useEffect, useState } from "react";
import axios from "axios";
import MoodFeedback from "./MoodFeedback";

export default function Journal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [showMoodFeedback, setShowMoodFeedback] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/journals", { withCredentials: true });
      setEntries(res.data);
    } catch {
      window.location.href = "/";
    }
  };

  const addEntry = async () => {
    if (!text) return;
    const res = await axios.post("http://localhost:5000/journals", { text }, { withCredentials: true });
    setEntries([res.data, ...entries]);
    setText("");

    // Show mood feedback
    if (res.data.mood) {
      setCurrentMood(res.data.mood);
      setShowMoodFeedback(true);
    }
  };

  const deleteEntry = async (id) => {
    await axios.delete(`http://localhost:5000/journals/${id}`, { withCredentials: true });
    setEntries(entries.filter(e => e.id !== id));
  };

  const logout = async () => {
    await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
    window.location.href = "/";
  };

  const dismissMood = () => {
    setShowMoodFeedback(false);
    setCurrentMood(null);
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2 className="journal-title">📖 My Journal</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="journal-input-section">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="How are you feeling today? Write your thoughts here..."
          rows={5}
        />
        <button className="save-btn" onClick={addEntry}>
          ✨ Save & Analyze Mood
        </button>
      </div>

      <h3 className="entries-title">My Entries</h3>
      {entries.length === 0 && (
        <p className="no-entries">No entries yet. Start writing to see your mood analysis! 🧠</p>
      )}
      {entries.map(e => (
        <div className="entry" key={e.id}>
          <div className="entry-header">
            <span className="entry-date">
              📅 {new Date(e.createdAt).toLocaleString()}
            </span>
            <button className="delete-btn" onClick={() => deleteEntry(e.id)}>✕</button>
          </div>
          <p className="entry-text">{e.text}</p>
          {e.mood && (
            <span
              className="mood-badge"
              data-level={e.mood.level}
              title={`${e.mood.label} — ${Math.round(e.mood.confidence * 100)}% confidence`}
            >
              {e.mood.emoji} {e.mood.label}
            </span>
          )}
        </div>
      ))}

      {/* Mood Feedback Modal */}
      {showMoodFeedback && currentMood && (
        <MoodFeedback mood={currentMood} onDismiss={dismissMood} />
      )}
    </div>
  );
}
