import React, { useState, useEffect } from 'react';
import AddItemForm from './AddItemForm';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('https://ganesh-erp.onrender.com/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (newItem) => {
    setInventory([...inventory, newItem]);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://ganesh-erp.onrender.com/api/inventory/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setInventory(inventory.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      <AddItemForm onAdd={handleAddItem} />
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Inventory Overview</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Part Number</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-3">{item.itemName}</td>
                    <td className="p-3">{item.partNumber}</td>
                    <td className="p-3 font-medium text-blue-600">{item.quantity}</td>
                    <td className="p-3">${item.pricePerUnit}</td>
                    <td className="p-3">{item.supplier}</td>
                    <td className="p-3">
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
                {inventory.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-3 text-center text-gray-500">No items found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
