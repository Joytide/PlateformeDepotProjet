import React from "react";
import ReactDOM from "react-dom";
import { Redirect } from 'react-router'
import { createBrowserHistory } from "history";
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom'
import AuthService from "components/AuthService";
import "assets/css/material-dashboard-react.css?v=1.5.0";
import indexRoutes from "routes/index.jsx";
import UserProvider from "providers/UserProvider/UserProvider"
import SnackbarProvider from "./providers/SnackbarProvider/SnackbarProvider";

const hist = createBrowserHistory();

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={(props) => (
		AuthService.isLoggedIn() === true
			? <Component {...props} />
			: <Redirect to={{
				pathname: '/',
				state: { from: props.location }
			}} />
	)} />
);

ReactDOM.render(
	<SnackbarProvider>
		<UserProvider>
			<Router history={hist} basename="/admin">
				<Switch>
					{indexRoutes.map((prop, key) => {
						if (prop.exact)
							return <Route path={prop.path} exact component={prop.component} key={key} />;
						else if (prop.private && !AuthService.isLoggedIn())
							return <PrivateRoute path={prop.path} component={prop.component} key={key} />;
						else
							return <Route path={prop.path} component={prop.component} key={key} />;
					})}
				</Switch>
			</Router>
		</UserProvider>
	</SnackbarProvider>,
	document.getElementById("root")
);