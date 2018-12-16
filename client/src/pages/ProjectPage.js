import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

class ProjectPage extends React.Component {
	constructor(props) {
        super(props);
		this.state = {
            project: this.props.project,
            loaded : false
		}
    }

    componentDidMount() {
        fetch('/api/project/'+this.props.match.params.key)
            .then(res => res.json())
            .then(project => {
                this.setState({ project: project, loaded: true });
            });
    }

    render () {
        const project = this.state.project

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
                                                return <Grid item><Chip label={major} color="secondary" /></Grid>
                                            }) 
                                        }
                                    </Grid>
                                    <Grid>
                                        <Typography variant="subtitle1">
                                            Proposé par : {project.partner.company}, le {new Date(project.edit_date).toLocaleDateString()}
                                         </Typography> 
                                    </Grid>
								</Grid>
                                
                                <hr></hr>
                                
                                <Grid xs={8}>
                                    <Typography  component="body1">
                                            {project.description}
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

export default ProjectPage;