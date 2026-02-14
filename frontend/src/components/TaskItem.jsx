import { useState } from "react";
import { User, Calendar, Trash2 } from "lucide-react";
import { api } from "../api/api";

export default function TaskItem({ item, onToggle, onDelete }) {
  // local edit state
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.task);

  // save edited task
  const saveEdit = async () => {
    if (!text.trim()) return setEditing(false);
    await api(`/tasks/${item.id}?task=${encodeURIComponent(text)}`, { method: "PUT" });
    item.task = text;
    setEditing(false);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex justify-between gap-4">
        
        {/* left section */}
        <div className="flex gap-3 flex-1">
          <input
            type="checkbox"
            checked={item.done}
            onChange={() => onToggle(item)}
            className="w-5 h-5 mt-1"
          />

          <div className="flex-1">
            {/* editable title */}
            <div className="flex items-center gap-2 mb-2">
              {editing ? (
                <input
                  className="border rounded px-2 py-1 text-sm flex-1"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onBlur={saveEdit}
                  autoFocus
                />
              ) : (
                <h3
                  className={`text-sm font-semibold flex-1 ${
                    item.done ? "line-through text-gray-400" : "text-gray-900"
                  }`}
                >
                  {item.task}
                </h3>
              )}

              <button
                onClick={() => setEditing(true)}
                className="text-xs text-blue-600"
              >
                Edit
              </button>
            </div>

            {/* metadata */}
            <div className="flex gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {item.owner || "Unassigned"}
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.due_date || "No due date"}
              </div>
            </div>
          </div>
        </div>

        {/* delete button */}
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-gray-400 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

