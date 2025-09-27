'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Calendar, Store, Banknote, Building2, TrendingUp, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalClubs: 3,
    totalUsers: 24,
    totalEvents: 5,
    totalListings: 6,
    totalFunds: 3,
    recentEvents: [
      { id: 1, title: 'Loppemarked', club_name: 'Fritim Idrettslag', date: '2024-02-24', response_count: 15 },
      { id: 2, title: 'Vårrydding', club_name: 'Fritim Idrettslag', date: '2024-03-03', response_count: 12 },
      { id: 3, title: 'Skitrening', club_name: 'Fjellkameratene SK', date: '2024-02-25', response_count: 8 }
    ],
    recentUsers: [
      { id: 1, name: 'Erik Hansen', email: 'erik@example.com', role: 'user' },
      { id: 2, name: 'Maria Olsen', email: 'maria@example.com', role: 'user' },
      { id: 3, name: 'Lars Andersen', email: 'lars@example.com', role: 'club_admin' }
    ]
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const statCards = [
    {
      title: 'Total Clubs',
      value: stats.totalClubs,
      icon: Building2,
      color: 'bg-blue-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      change: '+12',
      changeType: 'positive'
    },
    {
      title: 'Active Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+5',
      changeType: 'positive'
    },
    {
      title: 'Marketplace Listings',
      value: stats.totalListings,
      icon: Store,
      color: 'bg-orange-500',
      change: '+8',
      changeType: 'positive'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Fritim Backend Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Events
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.club_name} • {event.date}</p>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">{event.response_count} responses</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Recent Users
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Create Event</p>
              <p className="text-sm text-gray-500">Add a new dugnad or event</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Add User</p>
              <p className="text-sm text-gray-500">Register a new user</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Building2 className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Add Club</p>
              <p className="text-sm text-gray-500">Register a new sports club</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
