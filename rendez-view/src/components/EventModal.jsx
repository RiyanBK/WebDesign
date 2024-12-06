import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EventModal = ({ isOpen, onClose, onSave, selectedDate, eventData }) => {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    date: selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '',
    startTime: '',
    endTime: '',
    location: ''
  });

  useEffect(() => {
    if (eventData) {
      setEventDetails({
        title: eventData.title || '',
        date: eventData.date || '',
        startTime: eventData.startTime || '',
        endTime: eventData.endTime || '',
        location: eventData.location || ''
      });
    } else if (selectedDate) {
      setEventDetails((prev) => ({
        ...prev,
        date: new Date(selectedDate).toISOString().split('T')[0],
      }));
    }
  }, [eventData, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...eventDetails, meeting_id: eventData?.id || null });
    onClose();
    setEventDetails({ title: '', date: '', startTime: '', endTime: '', location: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{eventData ? 'Edit Event' : 'Add New Event'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                required
                value={eventDetails.title}
                onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                value={eventDetails.date}
                onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  required
                  value={eventDetails.startTime}
                  onChange={(e) => setEventDetails({ ...eventDetails, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  required
                  value={eventDetails.endTime}
                  onChange={(e) => setEventDetails({ ...eventDetails, endTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={eventDetails.location}
                onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-400 rounded-md hover:bg-red-500"
              >
                {eventData ? 'Update Event' : 'Save Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
