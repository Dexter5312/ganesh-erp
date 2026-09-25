import React, { useState, useEffect } from 'react';

const MaterialLedger = ({ userRole }) => {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ledger entry?")) return;
    try {
      const res = await fetch(`https://ganesh-erp.onrender.com/api/material-logs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (log) => {
    const newQty = window.prompt("Enter new quantity:", log.quantity);
    if (newQty === null) return;
    
    const newNotes = window.prompt("Enter new notes:", log.notes);
    if (newNotes === null) return;

    try {
      const res = await fetch(`https://ganesh-erp.onrender.com/api/material-logs/${log._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: Number(newQty), notes: newNotes })
      });
      if (res.ok) fetchLogs();
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
              {userRole === 'admin' && <th className="p-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{log.itemName}</td>
                <td className={`p-3 font-bold ${log.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                  {log.type === 'IN' ? 'IN' : 'OUT'}
                </td>
                <td className="p-3">{log.quantity}</td>
                <td className="p-3">{log.notes}</td>
                <td className="p-3">{new Date(log.date).toLocaleDateString()}</td>
                {userRole === 'admin' && (
                  <td className="p-3 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(log)}
                      className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(log._id)}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={userRole === 'admin' ? "6" : "5"} className="p-3 text-center text-gray-500">No logs found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialLedger;
