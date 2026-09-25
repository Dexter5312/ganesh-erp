import React, { useState, useEffect } from 'react';

const ProcessManagement = () => {
  const [logs, setLogs] = useState([]);
  const [processType, setProcessType] = useState('Cold Forging');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [operatorName, setOperatorName] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/process-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/process-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processType, itemName, quantity: Number(quantity), operatorName })
      });
      if (res.ok) {
        setItemName('');
        setQuantity('');
        setOperatorName('');
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Log Manufacturing Process</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
          <select value={processType} onChange={e => setProcessType(e.target.value)} className="border p-2 rounded">
            <option value="Cold Forging">Cold Forging</option>
            <option value="Thread Rolling">Thread Rolling</option>
            <option value="Machining">Machining</option>
            <option value="Heat Treatment">Heat Treatment</option>
          </select>
          <input type="text" placeholder="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} required className="border p-2 rounded" />
          <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required className="border p-2 rounded" />
          <input type="text" placeholder="Operator Name" value={operatorName} onChange={e => setOperatorName(e.target.value)} className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Log Process</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Process Logs</h2>
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Process</th>
              <th className="p-3">Item</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Operator</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} className="border-b">
                <td className="p-3">{log.processType}</td>
                <td className="p-3">{log.itemName}</td>
                <td className="p-3">{log.quantity}</td>
                <td className="p-3">{log.operatorName}</td>
                <td className="p-3">{new Date(log.date).toLocaleDateString()}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan="5" className="p-3 text-center">No logs found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessManagement;
