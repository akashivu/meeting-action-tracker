import { useState } from "react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);

  const extractActionItems = async () => {
    if (!transcript.trim()) {
      alert("Please enter a transcript");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/extract?transcript_text=${encodeURIComponent(
        transcript
      )}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Meeting Action Items Tracker</h1>

      <textarea
        rows="8"
        cols="60"
        placeholder="Paste meeting transcript..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />

      <br />
      <br />

      <button onClick={extractActionItems}>Extract Action Items</button>

      <br />
      <br />

      {result?.action_items && (
  <div>
    <h3>Action Items</h3>

    {result.action_items.map((item, index) => (
      <div
        key={index}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "6px",
        }}
      >
        <div><strong>Task:</strong> {item.task}</div>
        <div><strong>Owner:</strong> {item.owner || "—"}</div>
        <div><strong>Due:</strong> {item.due_date || "—"}</div>
      </div>
    ))}
  </div>
)}

    </div>
  );
}

export default App;
