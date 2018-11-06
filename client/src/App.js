import React, { Component } from 'react';
import { Route, Router, Switch, BrowserRouter } from "react-router-dom";
import Home from './pages/Home';
import Projects from './pages/Projects';
import Deposit from './pages/Deposit';
import Connection from './pages/Connection';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Protected from './pages/Protected';
import EditDeposit from './pages/EditDeposit';
import ForgetPass from './pages/ForgetPass';
import ProjectValidation from './pages/ProjectValidation';
import Nav from './components/nav/Navs'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { lng: 'fr' }
    this.handleLngChange = this.handleLngChange.bind(this);
  }

  handleLngChange(event) {
    this.setState({ lng: event.target.className.toLowerCase() });
  }

  render() {
    const lng = this.state.lng
    return (
      <BrowserRouter>
        <div>
          <Nav lng={lng} handleLngChange={this.handleLngChange} />
          <Switch>
            <Route exact path="/" render={(routeProps) => (<Home lng={lng} {...routeProps} />)} />
            <Route exact path="/Projects" render={(routeProps) => (<Projects lng={lng} {...routeProps} />)} />
            <Route exact path="/Deposit" render={(routeProps) => (<Deposit lng={lng} {...routeProps} />)} />
            <Route exact path="/Connection" render={(routeProps) => (<Connection lng={lng} {...routeProps} />)} />
            <Route exact path="/Admin" render={(routeProps) => (<Admin lng={lng} {...routeProps} />)} />
            <Route exact path="/Edit/:editKey" render={(routeProps) => (<EditDeposit lng={lng} {...routeProps} />)}/>
            <Route exact path="/Forgot" render={(routeProps) => (<ForgetPass lng={lng} {...routeProps} />)}/>
            <Route exact path="/Admin/Validation" render={(routeProps) => (<ProjectValidation lng={lng} {...routeProps} />)}/>
            <Route exact path="/login" render={(routeProps) => (<Login lng={lng} {...routeProps} />)}/>
            <Route exact path="/protected" render={(routeProps) => (<Protected lng={lng} {...routeProps} />)}/>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
