import React from 'react';
import {Jumbotron,Button,Row,Col, Container} from 'reactstrap';
import Paper from 'material-ui/Paper';
import i18n from './i18n';

console.log("Passed");
class JumbotronPresentation extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            videoURL: 'https://www.devinci.fr/wordpress/video/poleleonarddevinci.mp4'
        }

        this.style = {
            video : {
                height : 600+'px',
            },
        }
        
    }

  

	render() {
        const lng = this.props.lng;

        return(
            <Paper className="welcome"
            rounded = {true}>

                <h1  className="description display-3 text-center" lng={lng}>{i18n.t('welcomePlatform.h1', {lng})}</h1>
                 <video style = {this.style.video} className="background-video embed-responsive" loop autoPlay>
                    <source src={this.state.videoURL} type="video/mp4" />
                    <source src={this.state.videoURL} type="video/ogg" />
                    Your browser does not support the video tag.
                 </video>
            </Paper>
        );

    }
}

export default JumbotronPresentation;
