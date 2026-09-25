import React, { useState, useEffect } from 'react';

const MaterialLedger = () => {
  const [logs, setLogs] = useState([]);
  const [itemName, setItemName] = useState('');
  const [type, setType] = useState('IN');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('https://ganesh-erp.onrender.com/api/material-logs');
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
      const res = await fetch('https://ganesh-erp.onrender.com/api/material-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, type, quantity: Number(quantity), notes })
      });
      if (res.ok) {
        setItemName('');
        setQuantity('');
        setNotes('');
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Log Material Movement</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
          <input type="text" placeholder="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} required className="border p-2 rounded" />
          <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded">
            <option value="IN">Material Came In</option>
            <option value="OUT">Material Went Out</option>
          </select>
          <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required className="border p-2 rounded" />
          <input type="text" placeholder="Notes (e.g. Sent to Forging)" value={notes} onChange={e => setNotes(e.target.value)} className="border p-2 rounded flex-grow" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Log Movement</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Material Ledger</h2>
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Item</th>
              <th className="p-3">Type</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Notes</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} className="border-b">
                <td className="p-3">{log.itemName}</td>
                <td className={`p-3 font-bold ${log.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                  {log.type === 'IN' ? 'IN' : 'OUT'}
                </td>
                <td className="p-3">{log.quantity}</td>
                <td className="p-3">{log.notes}</td>
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

export default MaterialLedger;
