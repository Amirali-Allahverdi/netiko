import type { ReactNode } from "react"

import {
  InboxIcon,
  HomeAngleIcon,
  WidgetIcon,
  FolderIcon,
  ChecklistMinimalisticIcon,
  UsersGroupRoundedIcon,
  TagIcon,
  SettingsIcon,
  HistoryIcon,
  UserPlusIcon,
  LayersIcon,
} from "@solar-icons/react/bold-duotone"

export type NavSection = "main" | "workspace" | "management"

export type NavItem = {
  readonly label: string
  readonly href: string
  readonly icon: ReactNode
  readonly exact?: boolean
  readonly section: NavSection
}

export type TeamNavItem = Omit<NavItem, "section">

//? Routes

export const APP_ROUTES = {
  inbox: "/inbox",

  dashboard: "/",

  projects: "/projects",
  tasks: "/tasks",
  members: "/members",
  teams: "/teams",

  labels: "/labels",
  assignmentRules: "/assignment-rules",
  activity: "/activity",
  memberships: "/memberships",

  team: {
    home: (teamId: string) => `/teams/${encodeURIComponent(teamId)}`,
    tasks: (teamId: string) => `/teams/${encodeURIComponent(teamId)}/tasks`,
    projects: (teamId: string) =>
      `/teams/${encodeURIComponent(teamId)}/projects`,
  },
} as const

//? Workspace Navigation

export const navItems = [
  //? Main
  {
    label: "صندوق ورودی",
    href: APP_ROUTES.inbox,
    icon: <InboxIcon />,
    exact: true,
    section: "main",
  },

  //? Workspace
  {
    label: "نمای کلی",
    href: APP_ROUTES.dashboard,
    icon: <HomeAngleIcon />,
    exact: true,
    section: "workspace",
  },
  {
    label: "پروژه‌ها",
    href: APP_ROUTES.projects,
    icon: <FolderIcon />,
    section: "workspace",
  },
  {
    label: "وظایف",
    href: APP_ROUTES.tasks,
    icon: <ChecklistMinimalisticIcon />,
    section: "workspace",
  },
  {
    label: "اعضا",
    href: APP_ROUTES.members,
    icon: <UsersGroupRoundedIcon />,
    section: "workspace",
  },
  {
    label: "تیم‌ها",
    href: APP_ROUTES.teams,
    icon: <UsersGroupRoundedIcon />,
    section: "workspace",
  },

  //? Management
  {
    label: "برچسب‌ها",
    href: APP_ROUTES.labels,
    icon: <TagIcon />,
    section: "management",
  },
  {
    label: "قوانین تخصیص",
    href: APP_ROUTES.assignmentRules,
    icon: <SettingsIcon />,
    section: "management",
  },
  {
    label: "تاریخچه فعالیت‌ها",
    href: APP_ROUTES.activity,
    icon: <HistoryIcon />,
    section: "management",
  },
  {
    label: "عضویت‌ها",
    href: APP_ROUTES.memberships,
    icon: <UserPlusIcon />,
    section: "management",
  },
] as const satisfies readonly NavItem[]

//? Team Navigation

export const getTeamNavItems = (teamId: string) =>
  [
    {
      label: "خانه",
      href: APP_ROUTES.team.home(teamId),
      icon: <HomeAngleIcon />,
      exact: true,
    },
    {
      label: "وظایف",
      href: APP_ROUTES.team.tasks(teamId),
      icon: <ChecklistMinimalisticIcon />,
    },
    {
      label: "پروژه‌ها",
      href: APP_ROUTES.team.projects(teamId),
      icon: <FolderIcon />,
    },
  ] as const satisfies readonly TeamNavItem[]

//? Site Configuration

export const siteConfig = {
  name: "نتیکو",
  description: "پلتفرم مدیریت پروژه و همکاری تیمی",
  navItems,
  getTeamNavItems,
} as const

export type SiteConfig = typeof siteConfig
