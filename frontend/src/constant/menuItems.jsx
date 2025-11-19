import {
  LayoutDashboard,
  Sun,
  Map,
  NotepadText,
  Atom,
  Users2,
  DoorClosed,
  MoveUpRight,
  ScrollText,
  Settings2,
  Building2,
  SlidersVertical,
  Microchip,
  Goal,
} from "lucide-react";

export const getMenuItemsAdmin = () => [];

export const getMenuItemsUser = () => [
  {
    path: `/test`,
    label: "Test",
    icon: <MoveUpRight />,
  },
];
