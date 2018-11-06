import React, { Component } from 'react';
import {Redirect} from 'react-router';
import Navs from '../components/nav/Navs.js';
import { Link } from 'react-router';
//import ProjectGrid from '../components/ProjectGrid';
import ProjectsListCard from '../components/Projects/ProjectsListCard';
import Carousel from '../components/Carousel.js'
class Projects extends Component {

    render() {
        if(sessionStorage.getItem("Connected") != null){
            return(<Redirect to='/'/>); 
        } else {
            return (
                <div>
                    <ProjectsListCard lng={this.props.lng} />
                </div>
            );
        }
    }
}

export default Projects;
