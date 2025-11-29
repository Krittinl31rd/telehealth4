import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Plus,
  Eye,
  RefreshCw,
  XCircle,
} from "lucide-react";

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("day"); // 'day', 'month', 'year'
  const [appointments, setAppointments] = useState({
    "2024-10-25": [
      {
        id: 1,
        time: "2:00 PM",
        doctor: "Dr. Marcus Chen",
        specialty: "Dermatology",
        description:
          "Annual skin check-up and consultation about a new skin concern.",
        status: "status",
      },
    ],
    "2024-11-28": [
      {
        id: 2,
        time: "09:00 AM",
        doctor: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        description: "Regular heart check-up and blood pressure monitoring.",
        status: "status",
      },
      {
        id: 3,
        time: "2:30 PM",
        doctor: "Dr. Michael Wong",
        specialty: "Orthopedics",
        description: "Follow-up consultation for knee injury recovery.",
        status: "status",
      },
    ],
    "2024-11-30": [
      {
        id: 4,
        time: "10:15 AM",
        doctor: "Dr. Emily Rodriguez",
        specialty: "Pediatrics",
        description: "Child vaccination appointment and general health check.",
        status: "status",
      },
    ],
    "2024-12-05": [
      {
        id: 5,
        time: "3:00 PM",
        doctor: "Dr. James Park",
        specialty: "Neurology",
        description:
          "Consultation for recurring headaches and neurological assessment.",
        status: "status",
      },
    ],
    "2025-11-15": [
      {
        id: 6,
        time: "11:00 AM",
        doctor: "Dr. Lisa Chen",
        specialty: "General Practice",
        description: "Annual health screening and blood work.",
        status: "status",
      },
    ],
    "2025-11-10": [
      {
        id: 7,
        time: "9:30 AM",
        doctor: "Dr. Robert Kim",
        specialty: "Ophthalmology",
        description: "Eye examination and vision test.",
        status: "status",
      },
    ],
  });

  const months = [
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

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDisplayDate = (date) => {
    return `${
      monthsShort[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getAppointmentCountForMonth = (year, month) => {
    let count = 0;
    Object.keys(appointments).forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date.getFullYear() === year && date.getMonth() === month) {
        count += appointments[dateStr].length;
      }
    });
    return count;
  };

  const getAppointmentCountForYear = (year) => {
    let count = 0;
    Object.keys(appointments).forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date.getFullYear() === year) {
        count += appointments[dateStr].length;
      }
    });
    return count;
  };

  const changeMonth = (delta) => {
    setSelectedDate(new Date(year, month + delta, selectedDate.getDate()));
  };

  const changeYear = (delta) => {
    setSelectedDate(new Date(year + delta, month, selectedDate.getDate()));
  };

  const handleMonthClick = () => {
    setViewMode("month");
  };

  const handleYearClick = () => {
    setViewMode("year");
  };

  const selectMonth = (monthIndex) => {
    setSelectedDate(new Date(year, monthIndex, 1));
    setViewMode("day");
  };

  const selectYear = (selectedYear) => {
    setSelectedDate(new Date(selectedYear, month, 1));
    setViewMode("month");
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
    days.push({ day: prevMonthDays - firstDay + i + 1, isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  const selectedDateStr = formatDate(selectedDate);
  const dayAppointments = appointments[selectedDateStr] || [];

  const years = [];
  for (let y = year - 5; y <= year + 5; y++) {
    years.push(y);
  }

  return (
    <div className="w-full h-full p-4 bg-base-200 overflow-auto space-y-4">
      <div className="w-full mx-auto grid gap-4 lg:grid-cols-2 ">
        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            {viewMode === "day" && (
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {viewMode === "month" && (
              <button
                onClick={() => changeYear(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {viewMode === "year" && (
              <button
                onClick={() => changeYear(-5)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            <div className="flex items-center gap-2">
              {viewMode === "day" && (
                <>
                  <button
                    onClick={handleMonthClick}
                    className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {months[month]}
                  </button>
                  <button
                    onClick={handleYearClick}
                    className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {year}
                  </button>
                </>
              )}
              {viewMode === "month" && (
                <button
                  onClick={handleYearClick}
                  className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {year}
                </button>
              )}
              {viewMode === "year" && (
                <h2 className="text-xl font-bold text-gray-900">
                  Select Year {years[0]} - {years[10]}
                </h2>
              )}
            </div>

            {viewMode === "day" && (
              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {viewMode === "month" && (
              <button
                onClick={() => changeYear(1)}
                className="p-2 hover:bg-gray-100 rounded-lg shadow hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {viewMode === "year" && (
              <button
                onClick={() => changeYear(5)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Day View */}
          {viewMode === "day" && (
            <>
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-gray-700 text-sm py-2 "
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((dayInfo, index) => {
                  const dateStr = formatDate(
                    new Date(year, month, dayInfo.day)
                  );
                  const hasAppointments =
                    dayInfo.isCurrentMonth && appointments[dateStr];
                  const isSelected =
                    dayInfo.isCurrentMonth &&
                    dayInfo.day === selectedDate.getDate() &&
                    month === selectedDate.getMonth();

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        dayInfo.isCurrentMonth &&
                        setSelectedDate(new Date(year, month, dayInfo.day))
                      }
                      disabled={!dayInfo.isCurrentMonth}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-lg scale-105"
                          : dayInfo.isCurrentMonth
                          ? hasAppointments
                            ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                            : "text-gray-700 hover:bg-gray-50 cursor-pointer"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {dayInfo.day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Month View */}
          {viewMode === "month" && (
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
              {months.map((monthName, index) => {
                const appointmentCount = getAppointmentCountForMonth(
                  year,
                  index
                );
                const isSelected = index === month;

                return (
                  <button
                    key={index}
                    onClick={() => selectMonth(index)}
                    className={`p-6 rounded-xl transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-lg scale-105 cursor-pointer"
                        : appointmentCount > 0
                        ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    <div className="font-bold text-lg mb-2">{monthName}</div>
                    {appointmentCount > 0 && (
                      <div
                        className={`text-sm font-medium ${
                          isSelected ? "text-white" : "text-indigo-600"
                        }`}
                      >
                        {appointmentCount}{" "}
                        {appointmentCount === 1
                          ? "appointment"
                          : "appointments"}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Year View */}
          {viewMode === "year" && (
            <div className="grid sm:grid-cols-3 gap-4">
              {years.map((y) => {
                const appointmentCount = getAppointmentCountForYear(y);
                const isSelected = y === year;

                return (
                  <button
                    key={y}
                    onClick={() => selectYear(y)}
                    className={`p-6 rounded-xl transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-lg scale-105"
                        : appointmentCount > 0
                        ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    } cursor-pointer`}
                  >
                    <div className="font-bold text-xl mb-2">{y}</div>
                    {appointmentCount > 0 && (
                      <div
                        className={`text-sm font-medium ${
                          isSelected ? "text-white" : "text-indigo-600"
                        }`}
                      >
                        {appointmentCount}{" "}
                        {appointmentCount === 1
                          ? "appointment"
                          : "appointments"}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Appointment Details */}
        {viewMode === "day" && (
          <div className="w-full overflow-auto bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Appointment on {formatDisplayDate(selectedDate)}
            </h3>

            {dayAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">
                  No appointments scheduled for this date
                </p>
                <button className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium">
                  Book an appointment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {dayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors"
                  >
                    <div className="grid xl:grid-cols-10 gap-4 items-start justify-between mb-4">
                      <div className="col-span-7 flex items-start gap-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900">
                            {selectedDate.getDate()}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {formatDisplayDate(selectedDate).split(" ")[0]}{" "}
                            {selectedDate.getFullYear()}
                          </div>
                          <div className="text-sm font-medium text-gray-700 mt-2">
                            {appointment.time}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              <MapPin className="w-3 h-3" />
                              {appointment.status}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {appointment.doctor}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {appointment.specialty}
                          </p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {appointment.description}
                          </p>
                        </div>
                      </div>

                      <div className="xl:col-span-3 col-span-10 grid  xl:grid-cols-1 grid-cols-2  gap-4">
                        <button className="col-span-1 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button className="col-span-1 flex items-center gap-2 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium text-red-600">
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
