import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  Users,
  ShieldCheck,
  Map,
  Camera,
  LineChart,
  BrainCircuit,
  History,
  Settings,
  Hotel
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Smart Resort User',
    email: 'user@smartresort360.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Smart Resort 360',
      logo: Hotel,
      plan: 'Manager View',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        {
          title: 'Complaints',
          url: '/complaints',
          icon: ClipboardList,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: CheckSquare,
        },
        {
          title: 'Staff',
          url: '/staff',
          icon: Users,
        },
        {
          title: 'Verification',
          url: '/verification',
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: 'Guest Experience',
      items: [
        {
          title: 'Recommendations',
          url: '/recommendations',
          icon: Map,
        },
        {
          title: '360° Rooms',
          url: '/rooms-360',
          icon: Camera,
        },
      ],
    },
    {
      title: 'Revenue & AI',
      items: [
        {
          title: 'Pricing Intelligence',
          url: '/pricing',
          icon: LineChart,
        },
        {
          title: 'AI Insights',
          url: '/insights',
          icon: BrainCircuit,
        },
        {
          title: 'Audit Trail',
          url: '/audit',
          icon: History,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
