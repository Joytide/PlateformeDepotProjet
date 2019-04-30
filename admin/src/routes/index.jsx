import Dashboard from "layouts/Dashboard/Dashboard.jsx";
import Login from "views/Login/Login.jsx"

const indexRoutes = [
    { 
        path: "/",
        component: Login, 
        exact: true
    }, 
    { 
        component: Dashboard,
        private: true
    }
];

export default indexRoutes;
