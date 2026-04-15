import './Journal.css'; 
import { useEffect, useState } from "react";
import axios from "axios";

export default function Journal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);

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
  };

  const deleteEntry = async (id) => {
    await axios.delete(`http://localhost:5000/journals/${id}`, { withCredentials: true });
    setEntries(entries.filter(e => e.id !== id));
  };

  const logout = async () => {
    await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
    window.location.href = "/";
  };

  return (
<div className="journal-container">
  <button className="logout-btn" onClick={logout}>Logout</button>
  <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write here..." />
  <button onClick={addEntry}>Save</button>

  <h3>Entries</h3>
  {entries.map(e => (
    <div className="entry" key={e.id}>
      <p><b>{new Date(e.createdAt).toLocaleString()}:</b></p>
      <p>{e.text}</p>
      <button onClick={() => deleteEntry(e.id)}>Delete</button>
    </div>
  ))}
</div>

  );
}
