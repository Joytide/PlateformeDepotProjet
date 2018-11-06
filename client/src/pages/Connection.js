import React, { Component } from 'react';
import Cards from '../components/Cards';
import {CardDeck, Container} from 'reactstrap';
/**
 * Connection page
 */
class Connection extends Component {
  
  handleKeyChosen(key){
    if(key === "Student"){
      sessionStorage.setItem("Connected","True");
      sessionStorage.setItem("typePerson","3");
      this.props.history.push("/");
    } else{
      sessionStorage.setItem("typePerson","4");
      this.props.history.push("/Deposit");
    }
  }
  
  render() {
    if(sessionStorage.getItem("Connected") == null){       
      return(
        <div>
          <Container>
            <CardDeck>
                <Cards addKey={this.handleKeyChosen.bind(this)} value="Student" description="Connect to LeoID in order to look at projects." image="./student-with-graduation-cap.png" dimension="200x200"/> 
                <Cards addKey={this.handleKeyChosen.bind(this)} value="Partner" description="Give a project to our students." image="./partner.png" dimension="200x200"/>
                <Cards addKey={this.handleKeyChosen.bind(this)} value="Staff" description="Manage the projects." image="./staff.png" dimension="200x200"/>
            </CardDeck>
          </Container>
        </div>  
      );
    } 
    else{
      return(
        <div>
          Connecté
        </div>
      );
    } 
  }
}

export default Connection;