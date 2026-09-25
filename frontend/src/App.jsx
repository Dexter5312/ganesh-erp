import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import WorkerManagement from './components/WorkerManagement';
import ProcessManagement from './components/ProcessManagement';
import MaterialLedger from './components/MaterialLedger';
import Billing from './components/Billing';
import Home from './components/Home';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import UserManagement from './components/UserManagement';
import PurchaseOrders from './components/PurchaseOrders';

function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isEntered, setIsEntered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userRole, setUserRole] = useState(null);

  if (!isEntered) {
    return <Home onEnter={(tabId) => { setActiveTab(tabId || 'inventory'); setIsEntered(true); }} />;
  }

  if (!isLoggedIn) {
    if (showForgotPassword) {
      return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
    }
    return (
      <Login 
        onLogin={(role) => {
          setIsLoggedIn(true);
          setUserRole(role);
          // Set initial tab based on role
          if (role !== 'admin' && role !== 'worker') {
            setActiveTab(role);
          } else {
            setActiveTab('inventory');
          }
        }} 
        onForgotPassword={() => setShowForgotPassword(true)}
        onBack={() => setIsEntered(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ganesh Engineering Industries - ERP</h1>
        <div className="space-x-4 flex items-center">
          { (userRole === 'admin' || userRole === 'inventory' || userRole === 'worker') && (
            <button type="button" onClick={() => setActiveTab('inventory')} className={activeTab === 'inventory' ? 'underline font-bold' : ''}>Inventory</button>
          )}
          { (userRole === 'admin' || userRole === 'processes' || userRole === 'worker') && (
            <button type="button" onClick={() => setActiveTab('processes')} className={activeTab === 'processes' ? 'underline font-bold' : ''}>Processes</button>
          )}
          { (userRole === 'admin' || userRole === 'materials' || userRole === 'worker') && (
            <button type="button" onClick={() => setActiveTab('materials')} className={activeTab === 'materials' ? 'underline font-bold' : ''}>Material Ledger</button>
          )}
          { (userRole === 'admin' || userRole === 'purchase-orders' || userRole === 'worker') && (
            <button type="button" onClick={() => setActiveTab('purchase-orders')} className={activeTab === 'purchase-orders' ? 'underline font-bold' : ''}>Purchase Orders</button>
          )}
          { (userRole === 'admin' || userRole === 'workers') && (
            <button type="button" onClick={() => setActiveTab('workers')} className={activeTab === 'workers' ? 'underline font-bold' : ''}>Workers</button>
          )}
          { (userRole === 'admin' || userRole === 'billing') && (
            <button type="button" onClick={() => setActiveTab('billing')} className={activeTab === 'billing' ? 'underline font-bold' : ''}>Billing</button>
          )}
          { userRole === 'admin' && (
            <button type="button" onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'underline font-bold text-yellow-300' : 'text-yellow-100'}>Manage Logins</button>
          )}
          <div className="border-l border-white/30 h-6 mx-2"></div>
          <button 
            onClick={() => { setIsLoggedIn(false); setIsEntered(false); setUserRole(null); }} 
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Home
          </button>
        </div>
      </nav>
      
      <main className="p-8">
        {activeTab === 'inventory' && <Dashboard />}
        {activeTab === 'workers' && <WorkerManagement userRole={userRole} />}
        {activeTab === 'processes' && <ProcessManagement />}
        {activeTab === 'materials' && <MaterialLedger userRole={userRole} />}
        {activeTab === 'billing' && <Billing />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'purchase-orders' && <PurchaseOrders />}
      </main>
    </div>
  );
}

export default App;
