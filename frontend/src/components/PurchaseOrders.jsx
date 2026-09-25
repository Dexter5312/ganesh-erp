import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    supplierName: '',
    materialName: '',
    quantity: '',
    expectedDelivery: '',
    totalCost: ''
  });

  useEffect(() => {
    fetchPOs();
    fetchInventory();
  }, []);

  const fetchPOs = async () => {
    try {
      const res = await axios.get('https://ganesh-erp.onrender.com/api/purchase-orders');
      setPurchaseOrders(res.data);
    } catch (error) {
      console.error('Error fetching purchase orders', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await axios.get('https://ganesh-erp.onrender.com/api/inventory');
      setInventoryItems(res.data);
    } catch (error) {
      console.error('Error fetching inventory', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://ganesh-erp.onrender.com/api/purchase-orders', formData);
      setFormData({ supplierName: '', materialName: '', quantity: '', expectedDelivery: '', totalCost: '' });
      fetchPOs();
    } catch (error) {
      console.error('Error creating purchase order', error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`https://ganesh-erp.onrender.com/api/purchase-orders/${id}/status`, { status: newStatus });
      fetchPOs();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading Purchase Orders...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Purchase Orders</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Create New Purchase Order</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="supplierName"
            placeholder="Supplier Name"
            value={formData.supplierName}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <div className="flex">
            <select
              name="materialName"
              value={formData.materialName}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            >
              <option value="">Select Material from Inventory</option>
              {inventoryItems.map(item => (
                <option key={item._id} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="expectedDelivery"
            value={formData.expectedDelivery}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="totalCost"
            placeholder="Total Cost"
            value={formData.totalCost}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-2 lg:col-span-1 font-semibold"
          >
            Create PO
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm border-b">
              <th className="p-4">Supplier</th>
              <th className="p-4">Material</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Expected</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">No Purchase Orders found.</td>
              </tr>
            ) : (
              purchaseOrders.map((po) => (
                <tr key={po._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">{po.supplierName}</td>
                  <td className="p-4">{po.materialName}</td>
                  <td className="p-4">{po.quantity}</td>
                  <td className="p-4">₹{po.totalCost}</td>
                  <td className="p-4">{new Date(po.expectedDelivery).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      po.status === 'Received' ? 'bg-green-100 text-green-800' :
                      po.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2 flex">
                    {po.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(po._id, 'Approved')}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Approve
                      </button>
                    )}
                    {(po.status === 'Pending' || po.status === 'Approved') && (
                      <button
                        onClick={() => handleUpdateStatus(po._id, 'Received')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Mark Received
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;
