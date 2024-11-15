import React, { useState } from 'react';
import { Calendar, Plus, Home, Search, Mail, User } from 'lucide-react';

const CalendarApp = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  // Navigation items
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'messages', icon: Mail, label: 'Messages' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  // Days of the week header
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const generateCalendarDays = () => {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Side Navigation */}
      <nav className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-3 rounded-lg transition-colors ${
              activeTab === item.id ? 'bg-red-400 text-white' : 'text-gray-500 hover:bg-red-100'
            }`}
          >
            <item.icon size={24} />
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 bg-red-400 text-white flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <button className="bg-white text-red-400 p-2 rounded-full hover:bg-red-50">
            <Plus size={24} />
          </button>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 p-6">
          {/* Week days header */}
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                className={`aspect-square border rounded-lg p-2 ${
                  day ? 'hover:bg-red-50 cursor-pointer' : ''
                }`}
              >
                {day && (
                  <span className={`text-sm ${
                    day === new Date().getDate() ? 'bg-red-400 text-white rounded-full px-2 py-1' : ''
                  }`}>
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;