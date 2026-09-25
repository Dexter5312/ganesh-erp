import React from 'react';

function Home({ onEnter }) {
  const modules = [
    {
      id: "inventory",
      title: "Inventory",
      description: "Track raw materials and monitor stock levels."
    },
    {
      id: "workers",
      title: "Worker & HR",
      description: "Manage worker profiles, attendance, and payroll."
    },
    {
      id: "processes",
      title: "Processes",
      description: "Monitor production and track machine utilization."
    },
    {
      id: "materials",
      title: "Material Ledger",
      description: "Detailed tracking of material flow and balances."
    },
    {
      id: "purchase-orders",
      title: "Purchase Orders",
      description: "Create and manage supply purchase orders."
    },
    {
      id: "billing",
      title: "Billing",
      description: "Log and track client bills and payments."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-10 px-6">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Simple Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-600">
          <h1 className="text-2xl font-bold text-gray-800">Ganesh Engineering Industries</h1>
          <p className="text-gray-600 mt-2">Enterprise Resource Planning (ERP) System</p>
          <p className="text-sm text-gray-500 mt-1">Please select a module below to log in and continue.</p>
        </div>

        {/* Simple Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod, index) => (
            <div 
              key={index}
              onClick={() => onEnter(mod.id)}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-colors flex flex-col h-full"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">{mod.title}</h3>
              <p className="text-gray-600 text-sm flex-grow">{mod.description}</p>
              
              <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                <span className="text-sm text-blue-600 font-medium">Open Module &rarr;</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;
