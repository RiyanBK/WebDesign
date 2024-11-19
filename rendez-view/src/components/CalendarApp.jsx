import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Home, Search, Mail, User } from 'lucide-react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import EventModal from './EventModal';

const CalendarApp = ({ user }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Define navigation items within the component
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'messages', icon: Mail, label: 'Messages' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  // Define weekdays array
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.uid) {
        console.log('No user found, skipping fetch');
        return;
      }

      try {
        const eventsRef = collection(db, 'events');
        const q = query(
          eventsRef,
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const eventsList = [];
        querySnapshot.forEach((doc) => {
          eventsList.push({ id: doc.id, ...doc.data() });
        });

        console.log('Fetched events:', eventsList);
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [user, currentMonth]);

  const handleSaveEvent = async (eventDetails) => {
    if (!user?.uid) {
      console.error('No user logged in');
      return;
    }

    try {
      const eventData = {
        ...eventDetails,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        date: new Date(eventDetails.date).toISOString().split('T')[0]
      };

      console.log('Saving event:', eventData);

      const docRef = await addDoc(collection(db, 'events'), eventData);
      console.log('Event saved with ID:', docRef.id);

      setEvents(prevEvents => [...prevEvents, { id: docRef.id, ...eventData }]);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
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
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-red-500 rounded-full"
              >
                ←
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-red-500 rounded-full"
              >
                →
              </button>
            </div>
          </div>
          <button 
            onClick={() => {
              setSelectedDate(new Date());
              setShowModal(true);
            }}
            className="bg-white text-red-400 p-2 rounded-full hover:bg-red-50"
          >
            <Plus size={24} />
          </button>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 p-6 overflow-auto">
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
            {generateCalendarDays().map((date, index) => (
              <div
                key={index}
                onClick={() => {
                  if (date) {
                    setSelectedDate(date);
                    setShowModal(true);
                  }
                }}
                className={`min-h-[100px] border rounded-lg p-2 ${
                  date ? 'hover:bg-red-50 cursor-pointer' : ''
                }`}
              >
                {date && (
                  <>
                    <span className={`text-sm ${
                      date.getDate() === new Date().getDate() &&
                      date.getMonth() === new Date().getMonth() &&
                      date.getFullYear() === new Date().getFullYear()
                        ? 'bg-red-400 text-white rounded-full px-2 py-1'
                        : ''
                    }`}>
                      {date.getDate()}
                    </span>
                    <div className="mt-1 space-y-1">
                      {getEventsForDate(date).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="text-xs p-1 bg-red-100 rounded truncate"
                          title={`${event.title} (${event.startTime} - ${event.endTime})`}
                        >
                          {event.title}
                          <div className="text-xs text-gray-500">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarApp;