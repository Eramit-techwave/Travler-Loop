import React from 'react';
import { Plane, Plus, MapPin, Calendar } from 'lucide-react';

const Dashboard = () => {
  // Dummy data - baad mein hum isse backend se layenge
  const trips = [
    { id: 1, destination: 'Goa', date: 'Oct 2025', status: 'Upcoming' },
    { id: 2, destination: 'Manali', date: 'Dec 2025', status: 'Planned' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Plane /> Traveloop
        </div>
        <button className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
          <button className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 shadow-lg">
            <Plus size={20} /> Plan New Trip
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <div key={trip.id} className="rounded-xl bg-white p-6 shadow-md border border-gray-100 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                  <MapPin size={24} />
                </div>
                <span className="text-xs font-bold uppercase text-blue-500 bg-blue-50 px-2 py-1 rounded">{trip.status}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{trip.destination}</h3>
              <div className="mt-2 flex items-center gap-2 text-gray-500">
                <Calendar size={16} />
                <span>{trip.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;