import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientName: '',
    clientCompanyName: '',
    invoiceNumber: '',
    baseAmount: '',
    destinationState: '',
    date: '',
    status: 'Pending'
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bills');
      if (response.ok) {
        const data = await response.json();
        setBills(data);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Calculate GST based on destination state (assuming Haryana is home state)
    const base = Number(formData.baseAmount) || 0;
    let cgst = 0, sgst = 0, igst = 0;
    if (formData.destinationState.toLowerCase() === 'haryana') {
      cgst = base * 0.09;
      sgst = base * 0.09;
    } else {
      igst = base * 0.18;
    }
    const totalAmount = base + cgst + sgst + igst;
    
    const payload = {
      ...formData,
      baseAmount: base,
      cgst,
      sgst,
      igst,
      totalAmount
    };

    try {
      const response = await fetch('http://localhost:5000/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const newBill = await response.json();
        setBills([...bills, newBill]);
        setFormData({ clientName: '', clientCompanyName: '', invoiceNumber: '', baseAmount: '', destinationState: '', date: '', status: 'Pending' });
      }
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bills/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setBills(bills.filter(bill => bill._id !== id));
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Paid' : 'Pending';
    try {
      const response = await fetch(`http://localhost:5000/api/bills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updatedBill = await response.json();
        setBills(bills.map(bill => bill._id === id ? updatedBill : bill));
      }
    } catch (error) {
      console.error('Error updating bill status:', error);
    }
  }

  const handleDownloadPDF = async (bill) => {
    const invoiceDiv = document.createElement('div');
    invoiceDiv.style.width = '800px';
    invoiceDiv.style.padding = '40px';
    invoiceDiv.style.backgroundColor = 'white';
    invoiceDiv.style.color = 'black';
    invoiceDiv.style.fontFamily = 'sans-serif';
    
    invoiceDiv.innerHTML = `
      <div style="border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; color: #333;">INVOICE</h1>
        <p style="margin: 5px 0 0 0; color: #666;">Invoice #: ${bill.invoiceNumber}</p>
        <p style="margin: 5px 0 0 0; color: #666;">Date: ${new Date(bill.date).toLocaleDateString()}</p>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h3 style="margin: 0 0 10px 0; color: #333;">Billed To:</h3>
          <p style="margin: 0; font-weight: bold;">${bill.clientName}</p>
          ${bill.clientCompanyName ? `<p style="margin: 0;">${bill.clientCompanyName}</p>` : ''}
          <p style="margin: 0;">State: ${bill.destinationState}</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Status:</h3>
          <p style="margin: 0; font-weight: bold; color: ${bill.status === 'Paid' ? 'green' : 'orange'};">${bill.status}</p>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left;">Description</th>
            <th style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">Base Amount</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">₹${bill.baseAmount.toFixed(2)}</td>
          </tr>
          ${bill.cgst > 0 ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">CGST (9%)</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">₹${bill.cgst.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">SGST (9%)</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">₹${bill.sgst.toFixed(2)}</td>
          </tr>
          ` : ''}
          ${bill.igst > 0 ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">IGST (18%)</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">₹${bill.igst.toFixed(2)}</td>
          </tr>
          ` : ''}
        </tbody>
        <tfoot>
          <tr style="background-color: #f8f9fa; font-weight: bold;">
            <td style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">Total Amount</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; text-align: right; color: #2563eb;">₹${bill.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <div style="margin-top: 40px; text-align: center; color: #777; font-size: 12px;">
        <p>Thank you for your business!</p>
      </div>
    `;
    
    invoiceDiv.style.position = 'absolute';
    invoiceDiv.style.left = '-9999px';
    invoiceDiv.style.top = '-9999px';
    document.body.appendChild(invoiceDiv);

    try {
      const canvas = await html2canvas(invoiceDiv, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${bill.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      document.body.removeChild(invoiceDiv);
    }
  };

  // Preview Calculations for UI
  const previewBase = Number(formData.baseAmount) || 0;
  const isHaryana = formData.destinationState.toLowerCase() === 'haryana';
  const previewCGST = isHaryana ? previewBase * 0.09 : 0;
  const previewSGST = isHaryana ? previewBase * 0.09 : 0;
  const previewIGST = !isHaryana && formData.destinationState ? previewBase * 0.18 : 0;
  const previewTotal = previewBase + previewCGST + previewSGST + previewIGST;

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Create New Invoice</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="clientName"
            placeholder="Client Name"
            value={formData.clientName}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="clientCompanyName"
            placeholder="Client Company Name"
            value={formData.clientCompanyName}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="invoiceNumber"
            placeholder="Invoice Number"
            value={formData.invoiceNumber}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="destinationState"
            placeholder="Destination State (e.g., Haryana)"
            value={formData.destinationState}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="baseAmount"
            placeholder="Base Amount (₹)"
            value={formData.baseAmount}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
          
          <div className="lg:col-span-4 bg-gray-50 p-4 rounded mt-2 border">
            <h3 className="font-semibold text-gray-700 mb-2">Tax Preview (18% GST)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              <div><span className="block text-gray-500">Base</span>₹{previewBase.toFixed(2)}</div>
              <div><span className="block text-gray-500">CGST (9%)</span>₹{previewCGST.toFixed(2)}</div>
              <div><span className="block text-gray-500">SGST (9%)</span>₹{previewSGST.toFixed(2)}</div>
              <div><span className="block text-gray-500">IGST (18%)</span>₹{previewIGST.toFixed(2)}</div>
              <div className="font-bold text-blue-600"><span className="block text-gray-500">Total</span>₹{previewTotal.toFixed(2)}</div>
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 lg:col-span-4 mt-2">
            Add Invoice
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Billing & Invoices</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Invoice #</th>
                  <th className="p-2">Client (Company)</th>
                  <th className="p-2">State</th>
                  <th className="p-2">Base</th>
                  <th className="p-2">Tax</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id} className="border-b">
                    <td className="p-2 font-medium">{bill.invoiceNumber}</td>
                    <td className="p-2">
                      {bill.clientName}
                      {bill.clientCompanyName && <span className="block text-xs text-gray-500">{bill.clientCompanyName}</span>}
                    </td>
                    <td className="p-2">{bill.destinationState}</td>
                    <td className="p-2">₹{bill.baseAmount?.toFixed(2)}</td>
                    <td className="p-2 text-xs text-gray-600">
                      {bill.cgst > 0 && <span>CGST: ₹{bill.cgst.toFixed(2)}<br/>SGST: ₹{bill.sgst.toFixed(2)}</span>}
                      {bill.igst > 0 && <span>IGST: ₹{bill.igst.toFixed(2)}</span>}
                      {!bill.cgst && !bill.igst && <span>-</span>}
                    </td>
                    <td className="p-2 font-bold text-blue-600">₹{bill.totalAmount?.toFixed(2)}</td>
                    <td className="p-2">{new Date(bill.date).toLocaleDateString()}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleDownloadPDF(bill)} className="text-green-600 hover:text-green-800" title="Export PDF">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        PDF
                      </button>
                      <button onClick={() => handleStatusToggle(bill._id, bill.status)} className="text-blue-500 hover:text-blue-700">Toggle</button>
                      <button onClick={() => handleDelete(bill._id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
                {bills.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">No invoices found.</td>
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

export default Billing;
