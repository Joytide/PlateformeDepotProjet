import React from 'react';
import i18n from '../components/i18n';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import nl2br from 'react-newline-to-break';
import Icon from '@material-ui/core/Icon';
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
        }
        this.DownloadFile = this.DownloadFile.bind(this);
    }


    componentDidMount() {
        fetch('/api/project/'+this.props.match.params.key)
            .then(res => res.json())
            .then(project => {
                this.setState({ project: project, loaded: true });
            });
    }

    handleChange = () => {
        this.setState({ isLiked : this.state.isLiked ? false : true });
        console.log(this.setState);
      };

    DownloadFile = () => {
        fetch('/files', {
            method: 'GET',
        })
            .then((res) => {
                res.json()
            })
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

                                <hr></hr>

                                <Grid container spacing={8} xs>
                                    {
                                        project.media_files.sort().map(file => {
                                            return(
                                                <Grid item>
                                                    {file.filename}
                                                    <IconButton
                                                        onClick={this.DownloadFile}>
                                                        {<img src="/file_download.png" height="18" width="18" alt="Download"/>}
                                                    </IconButton>
                                                </Grid>
                                            )
                                        })
                                    }
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