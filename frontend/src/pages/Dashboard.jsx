import { useState } from "react";
import toast from "react-hot-toast";
import { FileText, CheckSquare, Plus, Loader2 } from 'lucide-react';
import { api } from "../api/api";
import useApi from "../hooks/useApi";
import Header from "../components/Header";
import TaskItem from "../components/TaskItem";
import StatusItem from "../components/StatusItem";

export default function Dashboard() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState(null);
  const [newTask, setNewTask] = useState("");

  const extractApi = useApi((text) =>
    api(`/extract?transcript_text=${encodeURIComponent(text)}`, { method: "POST" })
  );

  const extract = async () => {
    if (!transcript.trim()) return toast.error("Enter transcript");
    const data = await extractApi.call(transcript);
    if (data) {
      setResult(data);
      toast.success("Tasks extracted");
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return toast.error("Enter task");
    const data = await api(`/tasks?task=${encodeURIComponent(newTask)}`, { method: "POST" });
    setResult((p) => ({ ...p, action_items: [...(p.action_items || []), data] }));
    setNewTask("");
    toast.success("Task added");
  };

  const toggleTask = async (item) => {
    await api(`/tasks/${item.id}/done?done=${!item.done}`, { method: "PATCH" });
    setResult((p) => ({
      ...p,
      action_items: p.action_items.map((t) => (t.id === item.id ? { ...t, done: !t.done } : t)),
    }));
  };

  const deleteTask = async (id) => {
    await api(`/tasks/${id}`, { method: "DELETE" });
    setResult((p) => ({ ...p, action_items: p.action_items.filter((t) => t.id !== id) }));
    toast.success("Deleted");
  };

  const loadHistory = async () => setHistory(await api("/history"));
  const checkStatus = async () => setStatus(await api("/status"));

  const completedCount = result?.action_items?.filter(t => t.done).length || 0;
  const totalCount = result?.action_items?.length || 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onHistory={loadHistory} onStatus={checkStatus} />

      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="col-span-2 space-y-6">
            
            {/* Transcript */}
            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900">Meeting Transcript</h2>
              </div>

              <textarea
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="6"
                placeholder="Paste meeting transcript..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />

              <div className="mt-3 flex justify-end">
                <button
                  onClick={extract}
                  disabled={extractApi.loading || !transcript.trim()}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {extractApi.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                  {extractApi.loading ? "Processing..." : "Extract Items"}
                </button>
              </div>
            </div>

            {/* Action Items */}
            {result?.action_items && (
              <div className="bg-white rounded-lg border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                  <h2 className="font-semibold text-gray-900">Action Items</h2>
                  <span className="ml-auto text-sm text-gray-500">{completedCount}/{totalCount} completed</span>
                </div>

                {/* Add Task */}
                <div className="bg-gray-50 rounded-lg border p-3 mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Add new task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    />
                    <button
                      onClick={addTask}
                      disabled={!newTask.trim()}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Task List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {totalCount === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-sm">No action items</div>
                  ) : (
                    result.action_items.map((item) => (
                      <TaskItem key={item.id} item={item} onToggle={toggleTask} onDelete={deleteTask} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Status */}
            <div className="bg-white rounded-lg border p-5">
              <h2 className="font-semibold text-gray-900 mb-4">System Status</h2>
              {status ? (
                <div className="space-y-2">
                  <StatusItem label="Backend" status={status.backend} />
                  <StatusItem label="Database" status={status.database} />
                  <StatusItem label="LLM" status={status.llm} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <button onClick={checkStatus} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Check Status
                  </button>
                </div>
              )}
            </div>

            {/* History */}
            <div className="bg-white rounded-lg border p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Recent History</h2>
              {history.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {history.slice(0, 5).map((h, i) => (
                    <div key={h.id} className="bg-gray-50 border rounded-lg p-3">
                      <div className="flex gap-2">
                        <span className="text-xs font-bold text-gray-500">{i + 1}</span>
                        <p className="text-xs text-gray-700 flex-1">{h.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <button onClick={loadHistory} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Load History
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}