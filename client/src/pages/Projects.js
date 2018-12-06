import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Navs from '../components/nav/Navs.js';
import { Link } from 'react-router';
//import ProjectGrid from '../components/ProjectGrid';
import ProjectsListCard from '../components/Projects/ProjectsListCard';
import Carousel from '../components/Carousel.js'
class Projects extends Component {
    constructor(props) {
        super(props);

        this.state = { projects: {}, loaded: false };
    }
    componentDidMount() {
        fetch('/api/projects')
            .then(res => res.json())
            .then(projects => {
                this.setState({ projects: projects, loaded: true });
            });
        /*.then(res => {
            // Si on fait le filtre des projets visibles ici alors l'utilisateur récupère tous les projets lors de la requête même s'il n'est pas admin
            // Il faut donc faire le filtre côté serveur pour renvoyer les bonnes données en fonction de la personne qui fait la requête
            if (this.props.admin) {
                var pendingProjects = this.state.projects.filter(project => { if (project.status === "pending") return true })
                this.setState({ projectToDisplay: pendingProjects, loaded: true })
                this.setState({ projectSeen: pendingProjects, loaded: true })
            }
            else {
                var validateProjects = this.state.projects.filter(project => { if (project.status === "validate") return true })
                this.setState({ projectToDisplay: validateProjects, loaded: true })
                this.setState({ projectSeen: validateProjects, loaded: true })
            }
            console.log(this.state.projectToDisplay)
        })
        .catch((err) => { console.log("Error occured :" + err); })*/
    }
    render() {
        console.log(this.state.loaded, this.state.projects)
        if (!this.state.loaded) {
            return (<div></div>)
        } else {
            return (
                <ProjectsListCard lng={this.props.lng} projects={this.state.projects} showPartner={true}/>
            )
        }
    }
}

export default Projects;
