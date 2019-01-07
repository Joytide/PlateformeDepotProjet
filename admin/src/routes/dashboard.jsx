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

// Specialization related things
import SpecializationList from "views/SpecializationList/SpecializationList.jsx";
import CreateSpecialization from "views/CreateSpecialization/CreateSpecialization.jsx";

// Others
import Icons from "views/Icons/Icons.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";
import Settings from "views/Settings/Settings.jsx"

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Accueil",
    navbarName: "Accueil",
    icon: Dashboard,
    component: DashboardPage
  },/*
  {
    path: "/user",
    sidebarName: "User Profile",
    navbarName: "Profile",
    icon: Person,
    component: UserProfile
  },*/
  {
    path: "/users",
    sidebarName: "Liste utilisateurs",
    navbarName: "Liste des utilisateurs",
    icon: People,
    component: UserList
  },
  {
    path: "/createUser",
    sidebarName: "Ajouter utilisateur",
    navbarName: "Ajouter un utilisateur",
    icon: PersonAdd,
    component: CreateUser
  },
  {
    path: "/specializations",
    sidebarName: "Liste majeures",
    navbarName: "Liste des majeures",
    icon: "list",
    component: SpecializationList
  },
  {
    path: "/createSpecialization",
    sidebarName: "Créer majeure",
    navbarName: "Créer une majeure",
    icon: "add",
    component: CreateSpecialization
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
