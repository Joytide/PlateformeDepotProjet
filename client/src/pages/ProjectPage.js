import React from 'react';
import i18n from '../components/i18n';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import nl2br from 'react-newline-to-break';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';

import VerticalAlignBottom from '@material-ui/icons/VerticalAlignBottom';

import AuthService from '../components/AuthService';
import { withSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";
import { api } from "../config";

const styles = {
};

class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        let project = {};

        if (this.props.location.state)
            project = this.props.location.state.project

        console.log(Object.keys(project).length);

        this.state = {
            project: project,
            loaded: Object.keys(project).length > 0 ? true : false,
            isLiked: false,
        }
    }

    componentDidMount() {
        if (!this.state.loaded) {
            AuthService.fetch('/api/project/' + this.props.match.params.key)
                .then(res => {
                    if (res.ok)
                        return res.json()
                    else
                        throw res
                })
                .then(project => {

                    this.setState({ project: project, loaded: true });
                    if (project.likes.find((element) => { return element === this.state.userId; })) {
                        this.setState({ isLiked: true });
                    }
                    else {
                        this.setState({ isLiked: false });
                    }
                })
                .catch(err => {
                    console.error(err)
                    if (err.status)
                        this.props.snackbar.notification("danger", i18n.t("errors.unauthorized", { lng: this.props.lng }));

                });
        }
    }

    handleChange = () => {
        //this.setState({ isLiked : this.state.isLiked ? false : true }); // lecture directe de la réponse api à la place

        let data = {
            user: this.state.userId,
            project: this.props.match.params.key
        };

        AuthService.fetch('/api/project/like', {
            method: this.state.isLiked ? "DELETE" : "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.likes.find((element) => { return element === this.state.userId; })) {
                    this.setState({ isLiked: true });
                }
                else {
                    this.setState({ isLiked: false });
                }
            });
    }

    downloadFile = fileId => api.host + ":" + api.port + "/api/project/file/" + fileId + "?token=" + AuthService.getToken()

    render() {
        const project = this.state.project
        const lng = this.props.lng;

        if (this.state.loaded) {
            return (
                <div>
                    <Grid container style={{ marginTop: 12 }} justify="center">
                        <Grid item xs={11}>
                            <Paper style={{ padding: 12 }}>
                                <Typography align="center" variant="h3" paragraph>
                                    {project.number + " - " + project.title}
                                </Typography>

                                <Grid container justify="space-between">
                                    <Grid item xs={12}>
                                        {
                                            project.study_year.sort().map(year => {
                                                return <Chip
                                                    key={year._id}
                                                    label={year.abbreviation}
                                                    style={{ color: "white", backgroundColor: "#03a9f4", marginRight: "5px" }}
                                                />
                                            })
                                        }
                                        {
                                            project.specializations
                                                .filter(spe => spe.status !== "rejected")
                                                .map(spe => < Chip
                                                    key={spe._id}
                                                    label={spe.specialization.abbreviation}
                                                    color="secondary"
                                                    style={{ marginRight: "5px" }}
                                                />)
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">
                                            {i18n.t('partner.label', { lng })} {new Date(project.submissionDate).toLocaleDateString()}
                                        </Typography>

                                        {/*<Tooltip title="Like">
                                            <IconButton color={this.state.isLiked ? 'secondary' : 'default'} aria-label="Like" onClick={this.handleChange}>
                                                <FavoriteIcon />
                                            </IconButton>
                                    </Tooltip>*/}

                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={1} lg={2}></Grid>
                                    <Grid item xs={12} md={10} lg={8}>
                                        <hr></hr>
                                        <Typography align="justify">
                                            {nl2br(project.description)}
                                        </Typography>
                                        <br />
                                        <hr></hr>
                                        {project.skills &&
                                            <div>
                                                <Typography variant="display1">
                                                    Compétences développées :
                                                </Typography>
                                                <br />
                                                <Typography>
                                                    {nl2br(project.skills)}
                                                </Typography>
                                                <br /><br />
                                            </div>
                                        }
                                        {project.infos &&
                                            <div>
                                                <Typography variant="display1">
                                                    Informations complémentaires :
                                                </Typography>

                                                <Typography>
                                                    {nl2br(project.infos)}
                                                </Typography>
                                            </div>
                                        }
                                    </Grid>
                                </Grid>


                                <Grid container spacing={8} >
                                    {
                                        project.files.map(file => {
                                            return (
                                                <Grid item xs={2}>
                                                    <Typography style={{ wordBreak: "break-word" }}>
                                                        {file.originalName}
                                                    </Typography>
                                                    <IconButton href={this.downloadFile(file._id)}>
                                                        <VerticalAlignBottom />
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
        else {
            return (<div></div>)
        }
    }
}

export default withSnackbar(withStyles(styles)(ProjectPage));