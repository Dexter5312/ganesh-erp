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
    <div>
      {/* Quick Stats Header */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600 flex-1 min-w-[200px]">
          <h3 className="text-gray-500 text-sm font-semibold">Total Timesheets</h3>
          <p className="text-2xl font-bold">{totalLogs}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600 flex-1 min-w-[200px]">
          <h3 className="text-gray-500 text-sm font-semibold">Total Hours Logged</h3>
          <p className="text-2xl font-bold">{totalHours} hrs</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600 flex-1 min-w-[200px]">
          <h3 className="text-gray-500 text-sm font-semibold">Excellent Ratings</h3>
          <p className="text-2xl font-bold">{excellentCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Log Daily Timesheet</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap items-center">
          <input 
            type="text" 
            placeholder="Worker Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            className="border p-2 rounded flex-grow" 
          />
          <input 
            type="number" 
            placeholder="Hours Worked" 
            value={hoursWorked} 
            onChange={e => setHoursWorked(e.target.value)} 
            required 
            className="border p-2 rounded w-32" 
          />
          <select 
            value={dailyEfficiency} 
            onChange={e => setDailyEfficiency(e.target.value)} 
            className="border p-2 rounded w-40"
          >
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Poor">Poor</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap">
            Save Timesheet
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Timesheet Records</h2>
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Name</th>
              <th className="p-3">Hours Worked</th>
              <th className="p-3">Efficiency</th>
              <th className="p-3">Date</th>
              {userRole === 'admin' && <th className="p-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {workers.map(w => (
              <tr key={w._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{w.name}</td>
                <td className="p-3">{w.hoursWorked} hrs</td>
                <td className="p-3 font-medium">
                  {w.dailyEfficiency}
                </td>
                <td className="p-3">{new Date(w.date).toLocaleDateString()}</td>
                {userRole === 'admin' && (
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleDelete(w._id)}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {workers.length === 0 && (
              <tr>
                <td colSpan={userRole === 'admin' ? "5" : "4"} className="p-3 text-center text-gray-500">
                  No timesheets recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerManagement;
