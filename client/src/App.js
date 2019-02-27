import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";

import Home from './pages/Home';
import Projects from './pages/Projects';
import Deposit from './pages/Deposit';
import Connection from './pages/Connection';
//import Admin from './pages/Admin';
import Partner from './pages/Partner'
import Login from './pages/Login';
//import LoginPartner from './pages/LoginPartner';
import Protected from './pages/Protected';
import EditDeposit from './pages/EditDeposit';
import ForgetPass from './pages/ForgetPass';
//import ProjectValidation from './pages/ProjectValidation';
import ProjectPage from './pages/ProjectPage';

import Nav from './components/nav/Navs'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class App extends Component {
	constructor(props) {
		super(props)
		this.state = { lng: 'fr' }
		this.handleLngChange = this.handleLngChange.bind(this);
	}

	handleLngChange(event) {
		//this.setState({ lng: event.target.className.toLowerCase() });
		if (this.state.lng === 'fr') this.setState({ lng: 'en' });
		if (this.state.lng === 'en') this.setState({ lng: 'fr' });

		console.log("la langue du bouton est : " + event.target.className.toLowerCase());
		//event.target.className.toLowerCase() =
		//muibuttonbase-root-76 muiiconbutton-root-79 fr
		//muibuttonbase-root-76 muiiconbutton-root-79 en
	}

	render() {
		const lng = this.state.lng
		return (
			<BrowserRouter>
				<div>
					<Nav lng={lng} handleLngChange={this.handleLngChange} />
					<Grid style={{marginTop:85}}>
						<Switch>
							<Route exact path="/" render={(routeProps) => (<Home lng={lng} {...routeProps} />)} />
							<Route exact path="/Projects" render={(routeProps) => (<Projects lng={lng} {...routeProps} />)} />
							<Route exact path="/Projects/:key" render={(routeProps) => (<ProjectPage lng={lng} {...routeProps} />)} />
							<Route exact path="/deposit" render={(routeProps) => (<Deposit lng={lng} {...routeProps} />)} />
							<Route exact path="/Connection" render={(routeProps) => (<Connection lng={lng} {...routeProps} />)} />
							{/*<Route exact path="/Admin" render={(routeProps) => (<Admin lng={lng} {...routeProps} />)} />*/}
							<Route exact path="/partner" render={(routeProps) => (<Partner lng={lng} {...routeProps} />)} />
							<Route exact path="/Edit/:editKey" render={(routeProps) => (<EditDeposit lng={lng} {...routeProps} />)} />
							<Route exact path="/Forgot" render={(routeProps) => (<ForgetPass lng={lng} {...routeProps} />)} />
							{/*<Route exact path="/Admin/Validation" render={(routeProps) => (<ProjectValidation lng={lng} {...routeProps} />)} />*/}
							<Route exact path="/login" render={(routeProps) => (<Login lng={lng} {...routeProps} />)} />
							{/*<Route exact path="/login/partner/:key([a-zA-Z0-9]{16})" render={(routeProps) => (<LoginPartner lng={lng} {...routeProps} />)} />*/}
							<Route exact path="/protected" render={(routeProps) => (<Protected lng={lng} {...routeProps} />)} />
							<Route component={NoMatch} />
						</Switch>
					</Grid>
				</div>
			</BrowserRouter>
		)
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