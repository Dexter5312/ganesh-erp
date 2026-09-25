import React, { useState, useEffect, useRef } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'worker' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://ganesh-erp.onrender.com/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('https://ganesh-erp.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('User created successfully');
        setFormData({ username: '', password: '', role: 'worker' });
        fetchUsers();
      } else {
        setError(data.message || 'Error creating user');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      if (lines.length <= 1) return;

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const usersToImport = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const userObj = {};
        headers.forEach((header, index) => {
          userObj[header] = values[index];
        });
        if (userObj.username && userObj.password) {
          if (!userObj.role) userObj.role = 'worker';
          usersToImport.push(userObj);
        }
      }

      setError('');
      setSuccess('');
      try {
        const response = await fetch('https://ganesh-erp.onrender.com/api/users/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: usersToImport })
        });
        const data = await response.json();
        
        if (response.ok) {
          setSuccess(data.message || 'Users imported successfully');
          fetchUsers();
        } else {
          setError(data.message || 'Error importing users');
        }
      } catch (err) {
        setError('Network error during bulk import');
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin User Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Create New User</h3>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-3 rounded mb-4">{success}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 px-3 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 px-3 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 px-3 py-2 border"
              >
                <option value="admin">Admin</option>
                <option value="worker">Worker</option>
                <option value="billing">Billing</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Create User
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition text-sm flex items-center justify-center text-center"
              >
                Upload CSV (Bulk Import)
              </button>
              <input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Registered Users</h3>
          <div className="bg-gray-50 rounded-lg border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'billing' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
