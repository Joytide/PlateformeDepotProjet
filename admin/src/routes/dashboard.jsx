// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import People from "@material-ui/icons/People";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Assignment from "@material-ui/icons/Assignment";
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
		children: [
			{
				path: "/dashboard",
				sidebarName: "Accueil",
				navbarName: "Accueil",
				icon: Dashboard,
				component: DashboardPage,
				permissions: Permissions.Dashboard.value
			}
		]
	},
	{
		name: "Projets",
		children: [
			{
				path: "/project/:id",
				component: ProjectProfile,
				invisible: true,
				exact: true,
				permissions: Permissions.ProjectProfile.value
			},
			{
				path: "/project/",
				sidebarName: "Lister",
				navbarName: "Lister",
				icon: Assignment,
				component: ProjectList,
				exact: true,
				permissions: Permissions.ProjectList.value
			},
		]
	},
	{
		name: "Utilisateurs",
		children: [
			{
				path: "/user/:id([a-zA-Z0-9]{24})",
				component: UserProfile,
				invisible: true,
				exact: true,
				permissions: Permissions.UserProfile.value
			},
			{
				path: "/user",
				sidebarName: "Lister",
				navbarName: "Lister",
				icon: People,
				component: UserList,
				exact: true,
				permissions: Permissions.UserList.value
			},
			{
				path: "/createUser",
				sidebarName: "Créer",
				navbarName: "Créer",
				icon: PersonAdd,
				component: CreateUser,
				permissions: Permissions.CreateUser.value
			},
		]
	},
	{
		name: "Majeures",
		children: [
			{
				path: "/specialization/:id([a-zA-Z0-9]{24})",
				component: SpecializationProfile,
				invisible: true,
				exact: true,
				permissions: Permissions.SpecializationProfile.value
			},
			{
				path: "/specialization",
				sidebarName: "Lister",
				navbarName: "Lister",
				icon: "list",
				component: SpecializationList,
				exact: true,
				permissions: Permissions.SpecializationList.value
			},
			{
				path: "/createSpecialization",
				sidebarName: "Créer",
				navbarName: "Créer",
				icon: "add",
				component: CreateSpecialization,
				permissions: Permissions.CreateSpecialization.value
			},
		]
	},
	{
		name: "Années",
		children: [
			{
				path: "/year/:id([a-zA-Z0-9]{24})",
				component: YearProfile,
				invisible: true,
				exact: true,
				permissions: Permissions.YearProfile.value
			},
			{
				path: "/year",
				sidebarName: "Lister",
				navbarName: "Lister",
				icon: "list",
				component: YearList,
				exact: true,
				permissions: Permissions.YearList.value
			},
			{
				path: "/createYear",
				sidebarName: "Créer",
				navbarName: "Créer",
				icon: "add",
				component: CreateYear,
				permissions: Permissions.CreateYear.value
			}
		]
	},
	{
		name: "PRMs",
		children: [
			{
				path: "/prm",
				sidebarName: "Lister",
				navbarName: "Lister",
				icon: "list",
				component: PRMList,
				permissions: Permissions.PRMList.value
			},
			{
				path: "/createPrm",
				sidebarName: "Créer",
				navbarName: "Créer",
				icon: "add",
				component: CreatePRM,
				permissions: Permissions.CreatePRM.value
			}
		]
	},
	{
		name: "Équipes",
		children: [
			{
				path: "/team",
				sidebarName: "Lister",
				navbarName: "Lister",
				icon: "list",
				component: TeamList,
				permissions: Permissions.TeamList.value
			},
			{
				path: "/createTeam",
				sidebarName: "Créer",
				navbarName: "Créer",
				icon: "add",
				component: CreateTeam,
				permissions: Permissions.CreateTeam.value
			}
		]
	},
	{
		name: "Réglagles",
		children: [
			{
				path: "/settings",
				sidebarName: "Compte",
				navbarName: "Compte",
				icon: "settings",
				component: Settings,
				permissions: Permissions.Settings.value
			},
		]
	}
];

export default dashboardRoutes;
