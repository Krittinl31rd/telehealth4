import {
  CalendarDays,
  CalendarDaysIcon,
  FolderPen,
  LayoutDashboard,
  Users
} from "lucide-react";

export const getMenuItemsAdmin = () => [
  {
    path: `/admin`,
    label: "Dashboard",
    icon: <LayoutDashboard />,
  },
    {
    path: `/usermanagement`,
    label: "Users Management",
    icon: <Users />,
  },
];

export const getMenuItemsDoctor = () => [
  {
    path: `/doctor`,
    label: "Dashboard",
    icon: <LayoutDashboard />,
  },
];

export const getMenuItemsPatient = () => [
  {
    path: `/patient`,
    label: "Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    path: `/patient/appointments`,
    label: "Appointments",
    icon: <CalendarDays />,
  },
  {
    path: `/patient/measurement_records`,
    label: "Measurement Records",
    icon: <FolderPen />,
  },
];
