"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import {
  getDashboardStats,
  getExpiringSoonMedicines,
  getTopStockMedicines,
  getRecentActivities,
} from "../../utils/api";

import DashboardLayout from "../../components/DashboardLayout";

import { Activity, Users, Pill, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';


export default function DashboardPage() {
  const [statsData, setStatsData] = useState(null);
  const [expiringList, setExpiringList] = useState([]);
  const [topStock, setTopStock] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      async function loadDashboard() {
        const stats = await getDashboardStats();
        const expiring = await getExpiringSoonMedicines();
        const top5 = await getTopStockMedicines();
        const activities = await getRecentActivities();
        
        setRecentActivities(activities);
        setStatsData(stats);
        setExpiringList(expiring);
        setTopStock(top5);
      }
      loadDashboard();
    }
  }, [user, loading]);


  const medicineUsageData = [
    { name: 'Jan', usage: 400, stock: 300 },
    { name: 'Feb', usage: 450, stock: 350 },
    { name: 'Mar', usage: 380, stock: 420 },
    { name: 'Apr', usage: 520, stock: 390 },
    { name: 'May', usage: 480, stock: 460 },
    { name: 'Jun', usage: 550, stock: 480 },
  ];

  const stats = statsData
  ? [
      {
        title: 'Total Medicines',
        value: statsData.totalMedicines,
        icon: Pill,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
      },
      {
        title: 'Active Users',
        value: statsData.activeUsers,
        icon: Users,
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600'
      },
      {
        title: 'Expiring Soon',
        value: statsData.expiringSoonCount,
        icon: AlertCircle,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600'
      },
      {
        title: 'System Status',
        value: 'Healthy',
        icon: CheckCircle,
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600'
      },
    ]
  : [];


  

  const expiringSoon = expiringList;


  

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-blue-100 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            You are logged in as <span className="font-semibold capitalize">{user.role}</span>
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medicine Usage Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Medicine Usage & Stock</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={medicineUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Usage"
                />
                <Line 
                  type="monotone" 
                  dataKey="stock" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Stock"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Medicines by Category */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Top Medicines by Stock</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topStock.map(m => ({
                name: m.name,
                stock: m.quantity,
              }))}>

                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="stock" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          {user.role === "admin" && (
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                      {activity.type === "medicine" && <Pill className="h-5 w-5 text-blue-600" />}
                      {activity.type === "user" && <Users className="h-5 w-5 text-indigo-600" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {activity.type === "medicine"
                          ? `${activity.action === "created" ? "Added" : "Updated"} medicine`
                          : `${activity.action === "created" ? "Created user" : "Updated user"}`}
                      </p>

                      <p className="text-sm text-gray-600">
                        {activity.type === "medicine" ? activity.name : activity.username}
                      </p>

                      {activity.user && (
                        <p className="text-xs text-gray-500">By: {activity.user}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs whitespace-nowrap">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Expiring Soon */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Expiring Soon
            </h2>
            <div className="space-y-3">
              {expiringSoon.map((medicine) => (
                <div key={medicine.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">{medicine.name}</p>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full">
                      {medicine.daysLeft}d
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Expires: {new Date(medicine.expiryDate).toDateString()}
                  </p>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(medicine.daysLeft / 30) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{medicine.quantity} units in stock</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
