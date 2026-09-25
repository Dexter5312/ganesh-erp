import React from 'react';

function Home({ onEnter }) {
  const modules = [
    {
      id: "inventory",
      title: "Inventory",
      description: "Track raw materials and monitor stock levels.",
      icon: "📦",
      color: "from-blue-400 to-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      id: "workers",
      title: "Worker & HR",
      description: "Manage worker profiles, attendance, and payroll.",
      icon: "👥",
      color: "from-purple-400 to-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100"
    },
    {
      id: "processes",
      title: "Processes",
      description: "Monitor production and track machine utilization.",
      icon: "⚙️",
      color: "from-orange-400 to-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100"
    },
    {
      id: "materials",
      title: "Material Ledger",
      description: "Detailed tracking of material flow and balances.",
      icon: "📊",
      color: "from-emerald-400 to-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      id: "billing",
      title: "Billing",
      description: "Log and track client bills and payments.",
      icon: "💵",
      color: "from-rose-400 to-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mb-16 text-center space-y-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-sm mb-4 tracking-wide shadow-sm">
          Enterprise Portal
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-900 tracking-tight drop-shadow-sm pb-2">
          Ganesh Engineering Industries
        </h1>
        <h2 className="text-xl font-medium text-slate-500 mt-2">
          Select a module to manage your operations
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full max-w-7xl">
        {modules.map((mod, index) => (
          <div 
            key={index}
            onClick={() => onEnter(mod.id)}
            className={`group relative bg-white p-8 rounded-3xl shadow-sm border ${mod.border} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center overflow-hidden z-10`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${mod.color} transition-opacity duration-300 -z-10`}></div>
            
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner ${mod.bg} group-hover:scale-110 transition-transform duration-300 border ${mod.border}`}>
              {mod.icon}
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">{mod.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{mod.description}</p>
            
            <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1">
                Access Module 
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
