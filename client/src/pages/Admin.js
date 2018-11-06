import React, { Component } from 'react';
import Navs from '../components/nav/Navs.js';
import Cards from '../components/Cards';
import {Route} from 'react-router';
import {Redirect} from 'react-router';
import { CardDeck, Container } from 'reactstrap';
/**
 * Admin page
 */
class Admin extends Component {

    render() {
        console.log(this.props.match.path)
        return (
            <div>
                <Container>
                    <CardDeck>
                        <Cards
                            titre = "Valider un projet"
                            image='./project_validation.png'
                            value = "Validation"
                            description = "Voir la liste des projets en attente de validation."
                            path = {this.props.match.path+"/Validation"}
                            />
                        <Cards
                            titre = "Modifier la home page"
                            image='./Update_home.png'
                            value = 'EditHome' 
                            description = "Modifier la page d'accueil du site."
                            />
                        <Cards
                            titre = "Exporter les projets"
                            image='./Project_exportation.png'
                            description = "Exportez tous les projets validé au format pdf."
                            value = "Export"
                            />
                    </CardDeck>
                </Container>
                <Route path = {this.props.match.path + "/test"} />
            </div>
        );
    }
}

export default Admin;