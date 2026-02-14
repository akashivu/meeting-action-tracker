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
      {/* Show action items only after extraction result is available */}
      {result?.action_items && (
  <div>
    <h3>Action Items</h3>

    {result.action_items.map((item) => (
      <div
        key={item.id}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "6px",
        }}
      >
        <div>
          <input
            type="checkbox"
            checked={item.done || false}
            onChange={async (e) => {
  const updatedDone = e.target.checked;

  await fetch(
    `http://127.0.0.1:8000/tasks/${item.id}/done?done=${updatedDone}`,
    { method: "PATCH" }
  );

  setResult((prev) => ({
    ...prev,
    action_items: prev.action_items.map((t) =>
      t.id === item.id ? { ...t, done: updatedDone } : t
    ),
  }));
}}

          />
          <strong style={{ marginLeft: "8px" }}>{item.task}</strong>
        </div>

        <div>Owner: {item.owner || "—"}</div>
        <div>Due: {item.due_date || "—"}</div>
        <button
  onClick={async () => {
    await fetch(`http://127.0.0.1:8000/tasks/${item.id}`, {
      method: "DELETE",
    });

    setResult((prev) => ({
      ...prev,
      action_items: prev.action_items.filter((t) => t.id !== item.id),
    }));
  }}
>
  Delete
</button>

      </div>
    ))}
  </div>
)}


    </div>
  );
}

export default App;
