"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Pill, BookOpen, LogOut, Menu, X, Home, ChevronRight } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/"); // redirect to login if not logged in
    }
  }, [user]);

  // Sidebar links based on role
  const getLinks = () => {
    const baseLinks = [{ href: '/dashboard', label: 'Dashboard', icon: Home }];
    
    if (user?.role === 'admin') {
      baseLinks.push(
        { href: '/dashboard/users', label: 'Manage Users', icon: Users },
        { href: '/dashboard/medicines', label: 'Manage Medicines', icon: Pill }
      );
    }
    if (user?.role === 'doctor') {
      baseLinks.push({ href: '/dashboard/medicines', label: 'Manage Medicines', icon: Pill });
    }
    if (user?.role === 'staff') {
      baseLinks.push({ href: '/dashboard/medicines', label: 'View Medicines', icon: BookOpen });
    }
    
    return baseLinks;
  };

  const links = getLinks();

  const handleLogout = () => {
    logout();                                // clear user + localStorage
    window.location.href = "/";              // redirect to login
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl transition-all duration-300 flex flex-col justify-between hidden lg:flex h-screen sticky top-0 z-40`}>
        
        {/* Top Section */}
        <div>
          {/* Header */}
          <div className="p-6 border-b border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                {sidebarOpen && <span className="text-xl font-bold text-white">MediCare</span>}
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:bg-white/10 p-1 rounded"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* User Info */}
          {user && sidebarOpen && (
            <div className="p-4 mx-4 mt-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Logged in as</p>
              <p className="text-sm font-bold text-white truncate">{user.username}</p>
              <span className="inline-block mt-2 px-2.5 py-1 text-xs font-semibold bg-blue-500/30 text-blue-100 rounded-full capitalize border border-blue-400/50">
                {user.role}
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className={`${sidebarOpen ? 'p-4 space-y-2' : 'p-2 space-y-1'} mt-6`}>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${
                    sidebarOpen 
                      ? 'px-4 py-3 text-white hover:bg-white/10 active:bg-white/20' 
                      : 'px-2 py-2 justify-center hover:bg-white/10'
                  }`}
                  title={!sidebarOpen ? link.label : ''}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-sm font-medium">{link.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - Logout */}
        <div className={`${sidebarOpen ? 'p-4 space-y-3' : 'p-2'} border-t border-blue-500/30`}>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500/80 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-600/20"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          )}
          {!sidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed left-0 top-0 w-64 h-screen bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl transition-transform duration-300 flex flex-col justify-between lg:hidden z-40`}>
        
        {/* Top Section */}
        <div>
          {/* Header */}
          <div className="p-6 border-b border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MediCare</span>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:bg-white/10 p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 mx-4 mt-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Logged in as</p>
              <p className="text-sm font-bold text-white truncate">{user.username}</p>
              <span className="inline-block mt-2 px-2.5 py-1 text-xs font-semibold bg-blue-500/30 text-blue-100 rounded-full capitalize border border-blue-400/50">
                {user.role}
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-2 mt-6">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 active:bg-white/20 rounded-lg transition-all duration-200"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 text-sm font-medium">{link.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - Logout */}
        <div className="p-4 space-y-3 border-t border-blue-500/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/80 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-600/20"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Welcome,</span>
                <span className="font-semibold text-gray-900">{user?.username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[calc(100vh-180px)]">
            <div className="text-center text-gray-500">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}