import React, { useState, useEffect } from 'react';

const WorkerManagement = ({ userRole }) => {
  const [workers, setWorkers] = useState([]);
  const [name, setName] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [dailyEfficiency, setDailyEfficiency] = useState('Excellent');

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('https://ganesh-erp.onrender.com/api/workers');
      if (res.ok) {
        const data = await res.json();
        setWorkers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://ganesh-erp.onrender.com/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, hoursWorked: Number(hoursWorked), dailyEfficiency })
      });
      if (res.ok) {
        setName('');
        setHoursWorked('');
        setDailyEfficiency('Excellent');
        fetchWorkers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this timesheet entry?")) return;
    try {
      const res = await fetch(`https://ganesh-erp.onrender.com/api/workers/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchWorkers();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Quick Stats
  const totalLogs = workers.length;
  const totalHours = workers.reduce((acc, curr) => acc + (curr.hoursWorked || 0), 0);
  const excellentCount = workers.filter(w => w.dailyEfficiency === 'Excellent').length;

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Quick Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Timesheets</p>
            <p className="text-2xl font-bold text-gray-800">{totalLogs}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Hours Logged</p>
            <p className="text-2xl font-bold text-gray-800">{totalHours} hrs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Excellent Ratings</p>
            <p className="text-2xl font-bold text-gray-800">{excellentCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Log Daily Timesheet</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Worker Name</label>
            <input type="text" placeholder="e.g. Ramesh Kumar" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
            <input type="number" placeholder="8" value={hoursWorked} onChange={e => setHoursWorked(e.target.value)} required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Efficiency</label>
            <select value={dailyEfficiency} onChange={e => setDailyEfficiency(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-4 flex justify-end mt-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5">
              Save Timesheet
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Timesheet Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-white border-b text-gray-500 text-sm">
                <th className="p-4 font-semibold uppercase tracking-wider">Name</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Hours Worked</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Efficiency</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Date</th>
                {userRole === 'admin' && <th className="p-4 font-semibold uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workers.map(w => (
                <tr key={w._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{w.name}</td>
                  <td className="p-4 text-gray-600">{w.hoursWorked} hrs</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      w.dailyEfficiency === 'Excellent' ? 'bg-green-100 text-green-700' :
                      w.dailyEfficiency === 'Good' ? 'bg-blue-100 text-blue-700' :
                      w.dailyEfficiency === 'Average' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {w.dailyEfficiency}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{new Date(w.date).toLocaleDateString()}</td>
                  {userRole === 'admin' && (
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(w._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                        title="Delete record"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {workers.length === 0 && (
                <tr>
                  <td colSpan={userRole === 'admin' ? "5" : "4"} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <p>No timesheets recorded yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerManagement;
