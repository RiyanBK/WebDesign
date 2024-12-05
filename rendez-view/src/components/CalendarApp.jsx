import React, { useState, useEffect, useRef } from "react";
import { Calendar, Plus, Home, Search, Mail, User } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import EventModal from "./EventModal";
import { default as UserModel } from '../classes/User';
import MeetingManager from '../classes/MeetingManager';
import Meeting from '../classes/Meeting';

const CalendarApp = ({ user: authUser }) => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "messages", icon: Mail, label: "Messages" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "profile", icon: User, label: "Profile" }
  ];
  const [friendEvents, setFriendEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [meetingManager, setMeetingManager] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventMenu, setShowEventMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const eventMenuRef = useRef(null);

  // Initialize user and meeting manager
  useEffect(() => {
    const initializeUser = async () => {
      if (authUser) {
        const userInstance = await UserModel.fromAuth(authUser);
        setUser(userInstance);
        const manager = new MeetingManager(userInstance);
        setMeetingManager(manager);
      }
    };
    initializeUser();
  }, [authUser]);

  // Days of the week header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch user's events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.uid) return;

      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        const eventsList = [];
        querySnapshot.forEach((doc) => {
          eventsList.push({ id: doc.id, ...doc.data() });
        });

        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [user, currentMonth]);

  // Fetch friend events
  useEffect(() => {
    const fetchFriendEvents = async () => {
      if (!user?.uid) return;

      try {
        const friendshipsQuery = query(
          collection(db, "friendships"),
          where("status", "==", "accepted"),
          where("senderId", "==", user.uid)
        );

        const receiverQuery = query(
          collection(db, "friendships"),
          where("status", "==", "accepted"),
          where("receiverId", "==", user.uid)
        );

        const [senderSnapshot, receiverSnapshot] = await Promise.all([
          getDocs(friendshipsQuery),
          getDocs(receiverQuery),
        ]);

        const friendIds = new Set();
        senderSnapshot.forEach((doc) => friendIds.add(doc.data().receiverId));
        receiverSnapshot.forEach((doc) => friendIds.add(doc.data().senderId));

        const allFriendEvents = [];
        for (const friendId of friendIds) {
          const eventsQuery = query(
            collection(db, "events"),
            where("userId", "==", friendId)
          );
          const eventSnapshot = await getDocs(eventsQuery);
          eventSnapshot.forEach((doc) => {
            allFriendEvents.push({
              id: doc.id,
              ...doc.data(),
              isFriendEvent: true,
            });
          });
        }

        setFriendEvents(allFriendEvents);
      } catch (error) {
        console.error("Error fetching friend events:", error);
      }
    };

    fetchFriendEvents();
  }, [user]);

  // Fetch friend requests
  const fetchFriendRequests = async () => {
    if (activeTab === "messages") {
      try {
        const q = query(
          collection(db, "friendships"),
          where("receiverId", "==", user.uid),
          where("status", "==", "pending")
        );

        const querySnapshot = await getDocs(q);
        const requests = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() });
        });
        setFriendRequests(requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    }
  };

  // Send friend request
  const sendFriendRequest = async (friendId) => {
    try {
      const existingRequestQuery = query(
        collection(db, "friendships"),
        where("senderId", "==", user.uid),
        where("receiverId", "==", friendId),
        where("status", "==", "pending")
      );

      const existingRequestDocs = await getDocs(existingRequestQuery);
      if (!existingRequestDocs.empty) {
        alert("Friend request already sent");
        return;
      }

      const receiverDoc = await getDoc(doc(db, "users", friendId));

      await addDoc(collection(db, "friendships"), {
        senderId: user.uid,
        senderEmail: user.email,
        receiverId: friendId,
        receiverEmail: receiverDoc.data().email,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      alert("Friend request sent!");
      setSearchResults((prev) =>
        prev.map((result) =>
          result.id === friendId ? { ...result, requestSent: true } : result
        )
      );
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    }
  };

  // Handle friend request
  const handleFriendRequest = async (requestId, action) => {
    try {
      const requestRef = doc(db, "friendships", requestId);
      await updateDoc(requestRef, {
        status: action === "accept" ? "accepted" : "rejected",
        updatedAt: new Date().toISOString(),
      });

      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );

      if (action === "accept") {
        // Refresh friend events after accepting
        const fetchFriendEvents = async () => {
          if (!user?.uid) return;

          try {
            const friendshipsQuery = query(
              collection(db, "friendships"),
              where("status", "==", "accepted"),
              where("senderId", "==", user.uid)
            );

            const receiverQuery = query(
              collection(db, "friendships"),
              where("status", "==", "accepted"),
              where("receiverId", "==", user.uid)
            );

            const [senderSnapshot, receiverSnapshot] = await Promise.all([
              getDocs(friendshipsQuery),
              getDocs(receiverQuery),
            ]);

            const friendIds = new Set();
            senderSnapshot.forEach((doc) => friendIds.add(doc.data().receiverId));
            receiverSnapshot.forEach((doc) => friendIds.add(doc.data().senderId));

            const allFriendEvents = [];
            for (const friendId of friendIds) {
              const eventsQuery = query(
                collection(db, "events"),
                where("userId", "==", friendId)
              );
              const eventSnapshot = await getDocs(eventsQuery);
              eventSnapshot.forEach((doc) => {
                allFriendEvents.push({
                  id: doc.id,
                  ...doc.data(),
                  isFriendEvent: true,
                });
              });
            }

            setFriendEvents(allFriendEvents);
          } catch (error) {
            console.error("Error fetching friend events:", error);
          }
        };
        fetchFriendEvents();
      }

      alert(`Friend request ${action}ed!`);
    } catch (error) {
      console.error("Error handling friend request:", error);
      alert("Failed to process friend request");
    }
  };

  // Watch for tab changes
  useEffect(() => {
    if (activeTab === "messages") {
      fetchFriendRequests();
    }
    if (activeTab === "search") {
      setSearchResults([]);
    }
  }, [activeTab]);

  // Close event menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eventMenuRef.current && !eventMenuRef.current.contains(event.target)) {
        setShowEventMenu(false);
        setSelectedEvent(null);
      }
    };
    if (showEventMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEventMenu]);

  const handleSaveEvent = async (eventDetails) => {
    try {
      if (!meetingManager) return;

      if (eventDetails.meeting_id) {
        // Update existing event
        const meeting = new Meeting({
          meeting_id: eventDetails.meeting_id,
          ...eventDetails,
          userId: user.uid
        });
        await meeting.save();
        setEvents(prevEvents =>
          prevEvents.map(ev => (ev.id === eventDetails.meeting_id ? { id: ev.id, ...eventDetails } : ev))
        );
      } else {
        // Create new event
        const meeting = await meetingManager.createMeeting(eventDetails);
        setEvents(prevEvents => [...prevEvents, { id: meeting.meeting_id, ...eventDetails }]);
      }
      setShowModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      const meeting = new Meeting({ meeting_id: selectedEvent.id });
      await meeting.delete();
      setEvents(prevEvents =>
        prevEvents.filter(event => event.id !== selectedEvent.id)
      );
      setShowEventMenu(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      // Check Firestore security rules for delete permissions
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    if (!date) return [];

    const dateString = date.toISOString().split("T")[0];
    const userEvents = events.filter((event) => event.date === dateString);
    const friendEventsForDate = friendEvents.filter(
      (event) => event.date === dateString
    );

    return [...userEvents, ...friendEventsForDate];
  };

  // Render active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Search Users</h2>
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Search by exact email..."
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                  onChange={async (e) => {
                    const searchTerm = e.target.value.toLowerCase().trim();
                    if (searchTerm) {
                      try {
                        const usersRef = collection(db, "users");
                        const q = query(
                          usersRef,
                          where("email", "==", searchTerm)
                        );

                        const querySnapshot = await getDocs(q);
                        const results = [];
                        querySnapshot.forEach((doc) => {
                          if (doc.id !== user.uid) {
                            results.push({ id: doc.id, ...doc.data() });
                          }
                        });

                        setSearchResults(results);
                      } catch (error) {
                        console.error("Error searching users:", error);
                      }
                    } else {
                      setSearchResults([]);
                    }
                  }}
                />
              </div>
            </div>
            {searchResults.map((searchUser) => (
              <div
                key={searchUser.id}
                className="flex items-center justify-between p-2 border rounded mb-2"
              >
                <span>{searchUser.email}</span>
                <button
                  onClick={() => sendFriendRequest(searchUser.id)}
                  className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                >
                  Add Friend
                </button>
              </div>
            ))}
            {searchResults.length === 0 && (
              <p className="text-gray-500 text-center">No users found</p>
            )}
          </div>
        );

      case "messages":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
            {friendRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-2 border rounded mb-2"
              >
                <span>From: {request.senderEmail}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFriendRequest(request.id, "accept")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleFriendRequest(request.id, "reject")}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {friendRequests.length === 0 && (
              <p className="text-gray-500 text-center">
                No pending friend requests
              </p>
            )}
          </div>
        );

      default:
        return (
          <div className="flex-1 p-6 relative">
            <div className="grid grid-cols-7 mb-4">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-gray-500 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDays().map((date, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (date && !selectedEvent) {
                      setSelectedDate(date);
                      setShowModal(true);
                    }
                  }}
                  className={`min-h-[100px] border rounded-lg p-2 ${
                    date ? "hover:bg-red-50 cursor-pointer" : ""
                  }`}
                >
                  {date && (
                    <>
                      <span
                        className={`text-sm ${
                          date.getDate() === new Date().getDate() &&
                          date.getMonth() === new Date().getMonth() &&
                          date.getFullYear() === new Date().getFullYear()
                            ? "bg-red-400 text-white rounded-full px-2 py-1"
                            : ""
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      <div className="mt-1 space-y-1">
                        {getEventsForDate(date).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (event.isFriendEvent) return; // Prevent editing friend events
                              setSelectedEvent(event);
                              // Position the menu next to the cursor
                              setMenuPosition({ x: e.clientX, y: e.clientY });
                              setShowEventMenu(true);
                            }}
                            className={`text-xs p-1 rounded truncate ${
                              event.isFriendEvent
                                ? "bg-purple-100"
                                : "bg-red-100"
                            }`}
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

            {showEventMenu && selectedEvent && (
              <div
                ref={eventMenuRef}
                className="fixed bg-white border rounded shadow-md p-2 z-10"
                style={{ top: menuPosition.y, left: menuPosition.x }}
              >
                <button
                  onClick={() => {
                    setShowModal(true);
                    setShowEventMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDeleteEvent();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowEventMenu(false);
                    setSelectedEvent(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        );
    }
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
              activeTab === item.id
                ? "bg-red-400 text-white"
                : "text-gray-500 hover:bg-red-100"
            }`}
          >
            <item.icon size={24} />
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === "calendar" && (
          <header className="p-6 bg-red-400 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1
                      )
                    )
                  }
                  className="p-2 hover:bg-red-500 rounded-full"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1
                      )
                    )
                  }
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
                setSelectedEvent(null);
              }}
              className="bg-white text-red-400 p-2 rounded-full hover:bg-red-50"
            >
              <Plus size={24} />
            </button>
          </header>
        )}

        {renderActiveTabContent()}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        eventData={selectedEvent}
      />
    </div>
  );
};

export default CalendarApp;
