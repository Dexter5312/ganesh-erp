import React, { useState } from 'react';

const AddItemForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    partNumber: '',
    quantity: 0,
    pricePerUnit: 0,
    supplier: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const newItem = await response.json();
        onAdd(newItem);
        setFormData({
          itemName: '',
          partNumber: '',
          quantity: 0,
          pricePerUnit: 0,
          supplier: ''
        });
      } else {
        console.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">Add New Item</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Item Name</label>
          <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Part Number</label>
          <input type="text" name="partNumber" value={formData.partNumber} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price Per Unit</label>
          <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Supplier</label>
          <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Add Item</button>
    </form>
  );
};

export default AddItemForm;
