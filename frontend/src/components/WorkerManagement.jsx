import React, { useState, useEffect } from 'react';

const WorkerManagement = () => {
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

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Worker Timesheet</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input type="text" placeholder="Worker Name" value={name} onChange={e => setName(e.target.value)} required className="border p-2 rounded" />
          <input type="number" placeholder="Hours Worked" value={hoursWorked} onChange={e => setHoursWorked(e.target.value)} required className="border p-2 rounded" />
          <select value={dailyEfficiency} onChange={e => setDailyEfficiency(e.target.value)} className="border p-2 rounded">
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Log</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Worker Timesheets</h2>
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Name</th>
              <th className="p-3">Hours Worked</th>
              <th className="p-3">Daily Efficiency</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(w => (
              <tr key={w._id} className="border-b">
                <td className="p-3">{w.name}</td>
                <td className="p-3">{w.hoursWorked}</td>
                <td className="p-3">{w.dailyEfficiency}</td>
                <td className="p-3">{new Date(w.date).toLocaleDateString()}</td>
              </tr>
            ))}
            {workers.length === 0 && <tr><td colSpan="4" className="p-3 text-center">No logs found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerManagement;
