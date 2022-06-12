import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";


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
import Contact from './pages/Contact';
import Closed from './pages/Closed';
import NotFound from './pages/NotFound';

import Nav from './components/nav/Navs'

import Grid from '@material-ui/core/Grid';

import UserProvider from "./providers/UserProvider/UserProvider";
import SnackbarProvider from "./providers/SnackbarProvider/SnackbarProvider";

import { api } from "./config.json"

class App extends Component {
	constructor(props) {
		super(props)
		this.state = { lng: 'fr', isOpen: true, isLoaded: false}
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
		fetch(api.host + ":" + api.port +"/api/open", { crossDomain: true })
			.then(res => res.json())
			.then(data => {
				this.setState({ isLoaded: true, isOpen: data.open, description: data.description });
			});
	}

	render() {
		const lng = this.state.lng;
        if (this.state.isLoaded){
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
                                            <Route render={(routeProps) => (<NotFound lng={lng} {...routeProps} />)} />
                                        </Switch>
                                    </Grid>
                                    <div style={{
                                        color: "#F3F3F3",
                                        position: "fixed",
                                        bottom: "15px",
                                        right: "15px"
                                    }}>
                                        v2.5.0
                                    </div>
                                </div>
                            </BrowserRouter>
                        </UserProvider>
                    </SnackbarProvider>
                )
            }
            else {
                /*
                
                */
                return (
                    <SnackbarProvider>
                        <UserProvider>
                            <BrowserRouter>
                                <div>
                                    <Nav lng={lng} handleLngChange={this.handleLngChange} />
                                    <Grid style={{ marginTop: 85 }}>
                                        <Switch>
                                            {<Route exact path="/contact" render={(routeProps) => (<Contact lng={lng} {...routeProps} />)} />}
                                            <Route render={(routeProps) => (<Closed lng={lng} {...routeProps} />)} />
                                        </Switch>
                                    </Grid>
                                    <div style={{
                                        color: "#F3F3F3",
                                        position: "fixed",
                                        bottom: "15px",
                                        right: "15px"
                                    }}>
                                        v2.5.0
                                    </div>
                                </div>
                            </BrowserRouter>
                        </UserProvider>
                    </SnackbarProvider>
                )
            }
        }
        else{
            return null
        }
	}
}

export default App;
