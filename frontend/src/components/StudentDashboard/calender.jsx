// components/Calendar.jsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0));
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async (year, month) => {
    try {
      setLoading(true);
      // Calculate start and end dates for the current month
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const response = await axios.get(
        `${import.meta.env.REACT_APP_BASE_URL}/job-events`,
        {
          withCredentials: true,
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      );

      if (response.data.success) {
        setEvents(response.data.events);
      } else {
        setError("Failed to fetch events");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const navigateMonth = (direction) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction)
    );
  };


  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };


  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 border border-custom-blue"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayEvents = events[dateString] || [];

      days.push(
        <div
          key={day}
          className="h-32 border border-custom-blue p-2 overflow-y-auto"
        >
          <div className="font-bold text-custom-blue mb-1">{day}</div>
          {dayEvents.map((event, idx) => (
            <div
              key={idx}
              className={`p-1 mb-1 rounded text-xs ${
                event.type === "internship"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              <div className="font-semibold">{event.company}</div>
              <div>{event.type}</div>
              <div>{event.role}</div>
              <div>{event.time}</div>
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Card className="max-w-6xl mx-auto border border-custom-blue">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-custom-blue" />
            <h2 className="text-2xl text-custom-blue font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-custom-blue text-white"
              onClick={() => navigateMonth(-1)}
              disabled={loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="bg-custom-blue text-white"
              size="sm"
              onClick={() => navigateMonth(1)}
              disabled={loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-center py-4">Loading events...</div>}

        {error && (
          <div className="text-red-500 text-center py-4">Error: {error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-custom-blue">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

            {/* Legend */}
            <div className="mt-4 flex gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-blue-100 mr-2"></div>
                <span className="text-sm">Internships</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-100 mr-2"></div>
                <span className="text-sm">Placements</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarComponent;