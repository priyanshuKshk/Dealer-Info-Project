import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function DealerDashboard() {
  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    api.get('/dealers')
      .then(({ data }) => {
        const dealerList = Array.isArray(data) ? data : data.dealers || [];
        setDealers(dealerList);
      })
      .catch(console.error);
  }, []);

  const activeCount = dealers.filter(d => d.status === 'active').length;
  const inactiveCount = dealers.length - activeCount;
  const uniqueStates = new Set(dealers.map(d => d.state)).size;

  const recentDealers = [...dealers].slice(-5).reverse();

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">📊 Dealer Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow text-center font-semibold">Total: {dealers.length}</div>
        <div className="bg-green-100 p-4 rounded shadow text-center font-semibold">Active: {activeCount}</div>
        <div className="bg-red-100 p-4 rounded shadow text-center font-semibold">Inactive: {inactiveCount}</div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center font-semibold">States: {uniqueStates}</div>
      </div>

      {/* Recent Dealers */}
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
  <h3 className="text-xl font-bold mb-3">🕑 Recent Dealers</h3>
  <div className="min-w-[600px]">
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">State</th>
          <th className="p-2 border">City</th>
          <th className="p-2 border">Contact</th>
          <th className="p-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {recentDealers.map(dealer => (
          <tr key={dealer._id} className="text-center">
            <td className="border p-1">{dealer.dealershipName}</td>
            <td className="border p-1">{dealer.state}</td>
            <td className="border p-1">{dealer.city}</td>
            <td className="border p-1">{dealer.contactNumber}</td>
            <td className="border p-1">
              <span className={`px-2 py-1 rounded text-white text-xs ${dealer.status === "active" ? "bg-green-500" : "bg-red-500"}`}>
                {dealer.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
}
