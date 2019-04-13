import React, { Component } from 'react';
//import ProjectGrid from '../components/ProjectGrid';
import ProjectsListCard from '../components/Projects/ProjectsListCard';
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
    }
    render() {
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
