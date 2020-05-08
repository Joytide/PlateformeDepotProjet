// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import People from "@material-ui/icons/People";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Assignment from "@material-ui/icons/Assignment";
import DateRange from "@material-ui/icons/DateRange";
// core components/views

import DashboardPage from "views/Dashboard/Dashboard.jsx";

// User related things
import UserProfile from "views/UserProfile/UserProfile.jsx";
import UserList from "views/UserList/UserList.jsx";
import CreateUser from "views/CreateUser/CreateUser.jsx";

// Project related things
import ProjectProfile from "views/ProjectProfile/ProjectProfile.jsx";
import ProjectList from "views/ProjectList/ProjectList.jsx";

// Specialization related things
import SpecializationList from "views/SpecializationList/SpecializationList.jsx";
import CreateSpecialization from "views/CreateSpecialization/CreateSpecialization.jsx";
import SpecializationProfile from "views/SpecializationProfile/SpecializationProfile.jsx";

// Year related things
import YearList from "views/YearList/YearList.jsx";
import CreateYear from "views/CreateYear/CreateYear.jsx";
import YearProfile from "views/YearProfile/YearProfile.jsx";

// PRM
import PRMList from "views/PRMList/PRMList";
import CreatePRM from "views/CreatePRM/CreatePRM";

// Team
import CreateTeam from "views/CreateTeam/CreateTeam";
import TeamList from "views/TeamList/TeamList";

// Others
import Settings from "views/Settings/Settings.jsx"

import Permissions from "../permissions";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Accueil",
    navbarName: "Accueil",
    icon: Dashboard,
    component: DashboardPage,
    permissions: Permissions.Dashboard.value
  },
  {
    path: "/user/:id([a-zA-Z0-9]{24})",
    component: UserProfile,
    invisible: true,
    exact: true,
    permissions: Permissions.UserProfile.value
  },
  {
    path: "/project/:id",
    component: ProjectProfile,
    invisible: true,
    exact: true,
    permissions: Permissions.ProjectProfile.value
  },
  {
    path: "/specialization/:id([a-zA-Z0-9]{24})",
    component: SpecializationProfile,
    invisible: true,
    exact: true,
    permissions: Permissions.SpecializationProfile.value
  },
  {
    path: "/year/:id([a-zA-Z0-9]{24})",
    component: YearProfile,
    invisible: true,
    exact: true,
    permissions: Permissions.YearProfile.value
  },
  {
    path: "/project/",
    sidebarName: "Liste des projets",
    navbarName: "Liste des projets",
    icon: Assignment,
    component: ProjectList,
    exact: true,
    permissions: Permissions.ProjectList.value
  },
  {
    path: "/user",
    sidebarName: "Liste des utilisateurs",
    navbarName: "Liste des utilisateurs",
    icon: People,
    component: UserList,
    exact: true,
    permissions: Permissions.UserList.value
  },
  {
    path: "/createUser",
    sidebarName: "Ajouter un utilisateur",
    navbarName: "Ajouter un utilisateur",
    icon: PersonAdd,
    component: CreateUser,
    permissions: Permissions.CreateUser.value
  },
  {
    path: "/specialization",
    sidebarName: "Liste des majeures",
    navbarName: "Liste des majeures",
    icon: "list",
    component: SpecializationList,
    exact: true,
    permissions: Permissions.SpecializationList.value
  },
  {
    path: "/createSpecialization",
    sidebarName: "Créer une majeure",
    navbarName: "Créer une majeure",
    icon: "add",
    component: CreateSpecialization,
    permissions: Permissions.CreateSpecialization.value
  },
  {
    path: "/year",
    sidebarName: "Liste des années",
    navbarName: "Liste des années",
    icon: DateRange,
    component: YearList,
    exact: true,
    permissions: Permissions.YearList.value
  },
  {
    path: "/createYear",
    sidebarName: "Créer une année",
    navbarName: "Créer une année",
    icon: "add",
    component: CreateYear,
    permissions: Permissions.CreateYear.value
  },
  {
    path: "/settings",
    sidebarName: "Réglages",
    navbarName: "Réglages",
    icon: "settings",
    component: Settings,
    permissions: Permissions.Settings.value
  },
  {
    path: "/createPrm",
    sidebarName: "Créer PRM",
    navbarName: "Créer PRM",
    icon: "settings",
    component: CreatePRM,
    permissions: Permissions.CreatePRM.value
  },
  {
    path: "/prm",
    sidebarName: "Liste des PRM",
    navbarName: "Liste des PRM",
    icon: "settings",
    component: PRMList,
    permissions: Permissions.PRMList.value
  },
  {
    path: "/createTeam",
    sidebarName: "Créer équipes",
    navbarName: "Créer équipes",
    icon: "settings",
    component: CreateTeam,
    permissions: Permissions.CreateTeam.value
  },
  {
    path: "/team",
    sidebarName: "Liste des équipes",
    navbarName: "Liste des équipes",
    icon: "settings",
    component: TeamList,
    permissions: Permissions.TeamList.value
  },
];

export default dashboardRoutes;
