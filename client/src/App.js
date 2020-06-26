import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import Home from './pages/Home';
import Projects from './pages/Projects';
import Deposit from './pages/Deposit';
//import Connection from './pages/Connection';
//import Admin from './pages/Admin';
import Partner from './pages/Partner'
//import Login from './pages/Login';
import LoginPartner from './pages/LoginPartner';
import ForgetPass from './pages/ForgetPass';
//import ProjectValidation from './pages/ProjectValidation';
import ProjectPage from './pages/ProjectPage';

import Nav from './components/nav/Navs'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import UserProvider from "./providers/UserProvider/UserProvider";
import SnackbarProvider from "./providers/SnackbarProvider/SnackbarProvider";

class App extends Component {
	constructor(props) {
		super(props)
		this.state = { lng: 'fr', isOpen: true }
		this.handleLngChange = this.handleLngChange.bind(this);
	}

	handleLngChange(event) {
		//this.setState({ lng: event.target.className.toLowerCase() });
		if (this.state.lng === 'fr') this.setState({ lng: 'en' });
		if (this.state.lng === 'en') this.setState({ lng: 'fr' });

		//event.target.className.toLowerCase() =
		//muibuttonbase-root-76 muiiconbutton-root-79 fr
		//muibuttonbase-root-76 muiiconbutton-root-79 en
	}

	componentWillMount() {
		fetch("/api/open")
			.then(res => res.json())
			.then(data => {
				this.setState({ isOpen: data.open, description: data.description });
			});
	}

	render() {
		const lng = this.state.lng;
		if (this.state.isOpen) {
			return (
				<SnackbarProvider>
					<UserProvider>
						<BrowserRouter>
							<div>
								<Nav lng={lng} handleLngChange={this.handleLngChange} />
								<Grid style={{ marginTop: 85 }}>
									<Switch>
										<Route exact path="/" render={(routeProps) => (<Home lng={lng} {...routeProps} />)} />
										<Route exact path="/Projects" render={(routeProps) => (<Projects lng={lng} {...routeProps} />)} />
										<Route exact path="/Projects/:key" render={(routeProps) => (<ProjectPage lng={lng} {...routeProps} />)} />
										<Route exact path="/deposit" render={(routeProps) => (<Deposit lng={lng} {...routeProps} />)} />
										{/*<Route exact path="/Connection" render={(routeProps) => (<Connection lng={lng} {...routeProps} />)} />*/}
										{/*<Route exact path="/Admin" render={(routeProps) => (<Admin lng={lng} {...routeProps} />)} />*/}
										<Route exact path="/partner" render={(routeProps) => (<Partner lng={lng} {...routeProps} />)} />
										<Route exact path="/Forgot" render={(routeProps) => (<ForgetPass lng={lng} {...routeProps} />)} />
										{/*<Route exact path="/Admin/Validation" render={(routeProps) => (<ProjectValidation lng={lng} {...routeProps} />)} />*/}
										{/*<Route exact path="/login" render={(routeProps) => (<Login lng={lng} {...routeProps} />)} />*/}
										{<Route exact path="/login/partner/:key([a-zA-Z0-9]{16})" render={(routeProps) => (<LoginPartner lng={lng} {...routeProps} />)} />}
										<Route component={NoMatch} />
									</Switch>
								</Grid>
								<div style={{
									color: "#F3F3F3",
									position: "fixed",
									bottom: "15px",
									right: "15px"
								}}>
									v2.4.1
								</div>
							</div>
						</BrowserRouter>
					</UserProvider>
				</SnackbarProvider>
			)
		}
		else {
			return (
				<div>
					<Grid container justify="center">
						<Grid item xs={6}>
							<Paper elevation={1}>
								<Grid container justify="center">
									<Grid item xs={11}>
										<ReactMarkdown source={this.state.description} />
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</div>
			)
		}
	}
}

export default App;

function NoMatch({ location }) {
	return (
		<div>
			<Grid container justify="center">
				<Grid item xs={6}>
					<Paper elevation={1}>
						<Typography variant="h1" align="center">
							404 !
						</Typography>
						<Typography variant="h4" align="center">
							<span role="img" aria-labelledby="jsx-a11y/accessible-emoji" >😢</span>
						</Typography>
						<Typography variant="subtitle1" align="center">
							La page n'existe pas
						</Typography>
					</Paper>
				</Grid>
			</Grid>
		</div>
	);
}