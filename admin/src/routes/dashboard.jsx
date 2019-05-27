// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import People from "@material-ui/icons/People";
import PersonAdd from "@material-ui/icons/PersonAdd";
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
    path: "/user/:id([a-zA-Z0-9]{24})",
    component: UserProfile,
    invisible: true,
    exact: true
  },
  {
    path: "/project/:id",
    component: ProjectProfile,
    invisible: true,
    exact: true
  },
  {
    path: "/specialization/:id([a-zA-Z0-9]{24})",
    component: SpecializationProfile,
    invisible: true,
    exact: true
  },
  {
    path: "/year/:id([a-zA-Z0-9]{24})",
    component: YearProfile,
    invisible: true,
    exact: true
  },
  {
    path: "/project/",
    sidebarName: "Liste projets",
    navbarName: "Liste des projets",
    icon: PersonAdd,
    component: ProjectList,
    exact: true
  },
  {
    path: "/user",
    sidebarName: "Liste utilisateurs",
    navbarName: "Liste des utilisateurs",
    icon: People,
    component: UserList,
    exact: true
  },
  {
    path: "/year",
    sidebarName: "Liste années",
    navbarName: "Liste des années",
    icon: "list",
    component: YearList,
    exact: true
  },
  {
    path: "/specialization",
    sidebarName: "Liste majeures",
    navbarName: "Liste des majeures",
    icon: "list",
    component: SpecializationList,
    exact: true
  },
  {
    path: "/settings",
    sidebarName: "Réglages",
    navbarName: "Réglages",
    icon: "settings",
    component: Settings,
    adminOnly: false
  },
  {
    path: "/createUser",
    sidebarName: "Ajouter utilisateur",
    navbarName: "Ajouter un utilisateur",
    icon: PersonAdd,
    component: CreateUser,
    adminOnly: true
  },
  {
    path: "/createSpecialization",
    sidebarName: "Créer majeure",
    navbarName: "Créer une majeure",
    icon: "add",
    component: CreateSpecialization,
    adminOnly: true
  },
  {
    path: "/createYear",
    sidebarName: "Créer année",
    navbarName: "Créer une année",
    icon: "add",
    component: CreateYear,
    adminOnly: true
  },
];

export default dashboardRoutes;
