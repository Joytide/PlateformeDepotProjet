// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import People from "@material-ui/icons/People";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Notifications from "@material-ui/icons/Notifications";
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

// Others
import NotificationsPage from "views/Notifications/Notifications.jsx";
import Settings from "views/Settings/Settings.jsx"

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Accueil",
    navbarName: "Accueil",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/user/:id",
    component: UserProfile,
    invisible: true
  },
  {
    path: "/project/:id",
    component: ProjectProfile,
    invisible: true
  },
  {
    path: "/specialization/:id",
    component: SpecializationProfile,
    invisible: true
  },
  {
    path: "/year/:id",
    component: YearProfile,
    invisible: true
  },
  {
    path: "/projects",
    sidebarName: "Liste projets",
    navbarName: "Liste des projets",
    icon: PersonAdd,
    component: ProjectList
  },
  {
    path: "/createUser",
    sidebarName: "Ajouter utilisateur",
    navbarName: "Ajouter un utilisateur",
    icon: PersonAdd,
    component: CreateUser
  },
  {
    path: "/users",
    sidebarName: "Liste utilisateurs",
    navbarName: "Liste des utilisateurs",
    icon: People,
    component: UserList
  },
  {
    path: "/createSpecialization",
    sidebarName: "Créer majeure",
    navbarName: "Créer une majeure",
    icon: "add",
    component: CreateSpecialization
  },
  {
    path: "/specializations",
    sidebarName: "Liste majeures",
    navbarName: "Liste des majeures",
    icon: "list",
    component: SpecializationList
  },
  {
    path: "/createYear",
    sidebarName: "Créer année",
    navbarName: "Créer une anée",
    icon: "add",
    component: CreateYear
  },
  {
    path: "/years",
    sidebarName: "Liste années",
    navbarName: "Liste des années",
    icon: "list",
    component: YearList
  },
  {
    path: "/notifications",
    sidebarName: "Notifications",
    navbarName: "Notifications",
    icon: Notifications,
    component: NotificationsPage
  },
  {
    path: "/settings",
    sidebarName: "Réglages",
    navbarName: "Réglages",
    icon: "settings",
    component: Settings
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
