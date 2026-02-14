import { Server, Database, Zap } from 'lucide-react';

export default function StatusItem({ label, status }) {
  const ok = ["ok", "healthy"].includes(status?.toLowerCase());
  
  const getIcon = () => {
    switch(label) {
      case 'Backend':
        return <Server className="w-5 h-5" />;
      case 'Database':
        return <Database className="w-5 h-5" />;
      case 'LLM':
        return <Zap className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
            ok 
              ? 'bg-green-50 text-green-600 group-hover:bg-green-100' 
              : 'bg-red-50 text-red-600 group-hover:bg-red-100'
          }`}>
            {getIcon()}
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
            <p className="text-xs text-gray-500">Service health</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
          <span className={`text-sm font-semibold ${ok ? 'text-green-700' : 'text-red-700'}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}