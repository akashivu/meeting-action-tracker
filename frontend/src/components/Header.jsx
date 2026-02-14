import { Activity, Clock } from 'lucide-react';

export default function Header({ onHistory, onStatus }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Meeting Action Tracker</h1>
        
        <div className="flex gap-3">
          <button
            onClick={onStatus}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white border border-white/30 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          >
            <Activity className="w-4 h-4" />
            Status
          </button>
          
          <button
            onClick={onHistory}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-blue-700 bg-white rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-md"
          >
            <Clock className="w-4 h-4" />
            History
          </button>
        </div>
      </div>
    </header>
  );
}