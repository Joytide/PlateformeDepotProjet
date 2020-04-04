/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import dashboardRoutes from "routes/dashboard.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";
import AuthService from "components/AuthService";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobileOpen: false,
			isAdmin: false
		};
		this.loadAdmin = this.loadAdmin.bind(this);
		this.resizeFunction = this.resizeFunction.bind(this);

		this.loadAdmin();
	}

	loadAdmin = () => {
		AuthService.isAdmin().then(isAdmin => {
			this.setState({ isAdmin: isAdmin.admin });
		});
	}

	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};

	getRoute() {
		return this.props.location.pathname !== "/maps";
	}

	resizeFunction() {
		if (window.innerWidth >= 960) {
			this.setState({ mobileOpen: false });
		}
	}

	componentDidMount() {
		if (navigator.platform.indexOf("Win") > -1) {
			const ps = new PerfectScrollbar(this.refs.mainPanel);
		}
		window.addEventListener("resize", this.resizeFunction);
	}

	componentDidUpdate(e) {
		if (e.history.location.pathname !== e.location.pathname) {
			this.refs.mainPanel.scrollTop = 0;
			if (this.state.mobileOpen) {
				this.setState({ mobileOpen: false });
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.resizeFunction);
	}

	render() {
		const { classes, ...rest } = this.props;

		const switchRoutes = dashboardRoutes.map((prop, key) => {
			if (prop.redirect)
				return <Redirect from={prop.path} to={prop.to} key={key} />;
			else
				return <Route path={prop.path} exact={prop.exact} component={prop.component} key={key} />;
		});

		return (
			<div className={classes.wrapper}>
				<Sidebar
					routes={dashboardRoutes}
					isAdmin={this.state.isAdmin}
					logoText={"Creative Tim"}
					logo={logo}
					image={image}
					handleDrawerToggle={this.handleDrawerToggle}
					open={this.state.mobileOpen}
					color="blue"
					{...rest}
				/>
				<div className={classes.mainPanel} ref="mainPanel">
					<Header
						routes={dashboardRoutes}
						handleDrawerToggle={this.handleDrawerToggle}
						{...rest}
					/>

					<div className={classes.content}>
						<Switch>
							{switchRoutes}
							<Redirect to="/dashboard" />
						</Switch>
					</div>
					<Footer />
				</div>
			</div>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(App);
