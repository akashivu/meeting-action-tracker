import { useState } from "react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [history, setHistory] = useState([]);

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
const loadHistory = async () => {
  const res = await fetch("http://127.0.0.1:8000/history");
  const data = await res.json();
  setHistory(data);
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
      <button onClick={loadHistory} style={{ marginLeft: "10px" }}>
  Load History
</button>
{history.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h3>Last 5 Transcripts</h3>

    {history.map((t) => (
      <div
        key={t.id}
        style={{
          border: "1px solid #aaa",
          padding: "8px",
          marginBottom: "8px",
        }}
      >
        {t.content}
      </div>
    ))}
  </div>
)}

      <br />
      <br />
      {/* Show action items only after extraction result is available */}
      {result?.action_items && (
  <div>
    <h3>Action Items</h3>
    <div style={{ marginBottom: "20px" }}>
  <input
    placeholder="Add new task..."
    value={newTask}
    onChange={(e) => setNewTask(e.target.value)}
  />

  <button
    onClick={async () => {
      if (!newTask.trim()) return;

      const response = await fetch(
        `http://127.0.0.1:8000/tasks?task=${newTask}`,
        { method: "POST" }
      );

      const data = await response.json();

      setResult((prev) => ({
        ...prev,
        action_items: [...prev.action_items, data],
      }));

      setNewTask("");
    }}
  >
    Add Task
  </button>
</div>


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
