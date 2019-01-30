import React from 'react';
import i18n from '../components/i18n';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import nl2br from 'react-newline-to-break';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Tooltip from '@material-ui/core/Tooltip';

import { withStyles } from '@material-ui/core/styles';

const styles = {
};

class ProjectPage extends React.Component {
	constructor(props) {
        super(props);
		this.state = {
            project: this.props.project,
            loaded : false,
            isLiked : false,
            userId : "5c51951431a7593170f310c6" // userId à récupérer lorsque la fonctionnalité connexion sera faite
		}
    }


    componentDidMount() {
        fetch('/api/project/' + this.props.match.params.key)
            .then(res => res.json())
            .then(project => {
                //console.log("this.state.userId:" + this.state.userId);
                //console.log(project);

                this.setState({ project: project, loaded: true });
                if (project.likes.find( (element) => { return element === this.state.userId; }) ){
                    this.setState({ isLiked: true });
                    console.log("BDDStart.isLiked: true");
                }
                else {
                    this.setState({ isLiked: false });
                    console.log("BDDStart.isLiked: false");
                }
            });
    }

    handleChange = () => {
        //this.setState({ isLiked : this.state.isLiked ? false : true }); // lecture directe de la réponse api à la place

        let data = {
            user : this.state.userId,
            project: this.props.match.params.key
        };
        console.log(data);

        fetch('/api/project/like', {
            method: this.state.isLiked ? "DELETE" : "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data");
                console.log(data);
                if (data.likes.find( (element) => { return element === this.state.userId; }) ){
                    this.setState({ isLiked: true });
                    console.log("BDD.isLiked: true");
                }
                else {
                    this.setState({ isLiked: false });
                    console.log("BDD.isLiked: false");
                }
            });

        
    }

    render () {
        const project = this.state.project
        const lng = this.props.lng;

        if (this.state.loaded) {
        return(
            <div>
                <Grid container style={{ marginTop: 12}} justify="center">
                    <Grid xs={11}>
                        <Paper style={{ padding: 12}}>
                                <Typography align="center" variant="h3" paragraph>
                                        {project.title}
                                </Typography>

                                <Grid container justify="space-between">
                                    <Grid container spacing={8} xs>
                                        {
                                            project.study_year.sort().map(major => {
                                                return <Grid item><Chip label={major} color="primary" /></Grid>
                                            })
                                        }
                                        {
                                            project.majors_concerned.sort().map(major => {
                                                return <Grid item><Chip label={major.abbreviation} color="secondary" /></Grid>
                                            }) 
                                        }
                                        {
                                            project.keywords.sort().map(keyword => {
                                                return <Grid item><Chip label={keyword} color="grey" /></Grid>
                                            }) 
                                        }
                                    </Grid>
                                    <Grid>
                                        <Typography variant="subtitle1">
                                            {i18n.t('partner.label', { lng })} : {project.partner.company}, {new Date(project.edit_date).toLocaleDateString()}
                                         </Typography>

                                        <Tooltip title="Like">
                                            <IconButton color={this.state.isLiked ? 'secondary' : 'default'} aria-label="Like" onClick={this.handleChange}>
                                                <FavoriteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        
                                    </Grid>
                                </Grid>
                                
                                <hr></hr>
                                
                                <Grid xs={8}>
                                    <Typography  component="body1">
                                            {nl2br(project.description)}
                                    </Typography>
                                </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
        }
        else{
            return (<div></div>)
        }
    }
}

export default withStyles(styles)(ProjectPage);