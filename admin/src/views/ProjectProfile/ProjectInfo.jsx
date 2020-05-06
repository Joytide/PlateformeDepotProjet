import React from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

// core components
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";

import AuthService from "components/AuthService"
import { api } from "../../config"
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { withUser } from "../../providers/UserProvider/UserProvider";
import { handleXhrError } from "../../components/ErrorHandler";

const styles = theme => ({
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    },
    displayLineBreak: {
        "white-space": "pre-line"
    },
    separation: {
        marginTop: "35px"
    }
});

class ProjectInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            project: this.props.project,
            modifiedProject: this.props.project,
            editable: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.editable !== nextProps.editable)
            this.setState({ editable: nextProps.editable });
    }

    // Handle changes on the new keyword's textbox
    handleChange = event => {
        this.setState({
            modifiedProject: {
                ...this.state.modifiedProject,
                [event.target.id]: event.target.value
            }
        });
    };

    startEditing = () => {
        this.setState({
            edit: true
        });
    }

    saveChanges = () => {
        const data = {
            id: this.state.modifiedProject._id,
            title: this.state.modifiedProject.title,
            description: this.state.modifiedProject.description,
            skills: this.state.modifiedProject.skills,
            infos: this.state.modifiedProject.infos,
            maxTeams: this.state.modifiedProject.maxTeams,
            suggestedKeywords: this.state.modifiedProject.suggestedKeywords
        }

        AuthService.fetch(api.host + ":" + api.port + "/api/project", {
            method: "PUT",
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok)
                    return res.json();
                else
                    throw res;
            })
            .then(data => {
                this.setState({
                    edit: false,
                    project: {
                        ...this.state.modifiedProject,
                        lastUpdate: {
                            at: Date.now(),
                            by: this.props.user.user
                        }
                    }

                });
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    cancelChanges = () => {
        this.setState({
            edit: false,
            modifiedProject: this.state.project
        });
    }

    render() {
        const { classes, color } = this.props;
        if (this.state.edit) {
            return (
                <Card>
                    <CardHeader color={color}>
                        <h4 className={classes.cardTitleWhite}>Information projet</h4>
                        <p className={classes.cardCategoryWhite}>Informations sur le projet proposé par le partenaire</p>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12}>
                                <TextField
                                    id="title"
                                    label="Nom du projet"
                                    fullWidth={true}
                                    value={this.state.modifiedProject.title}
                                    onChange={this.handleChange}
                                />
                            </GridItem>

                            <GridItem xs={12} >
                                <TextField
                                    id="description"
                                    label="Description"
                                    fullWidth={true}
                                    multiline={true}
                                    value={this.state.modifiedProject.description}
                                    onChange={this.handleChange}
                                    className={classes.separation}
                                />
                            </GridItem>

                            <GridItem xs={12} >
                                <TextField
                                    id="skills"
                                    label="Compétences développées"
                                    fullWidth={true}
                                    multiline={true}
                                    value={this.state.modifiedProject.skills}
                                    onChange={this.handleChange}
                                    className={classes.separation}
                                />
                            </GridItem>

                            <GridItem xs={12} >
                                <TextField
                                    id="infos"
                                    label="Informations complémentaires"
                                    fullWidth={true}
                                    multiline={true}
                                    value={this.state.modifiedProject.infos}
                                    onChange={this.handleChange}
                                    className={classes.separation}
                                />
                            </GridItem>

                            <GridItem xs={12} >
                                <TextField
                                    id="maxTeams"
                                    label="Nombre maximal d'équipes"
                                    type="number"
                                    className={classes.separation}
                                    value={this.state.modifiedProject.maxTeams}
                                    onChange={this.handleChange}
                                />
                            </GridItem>

                            <GridItem xs={12} >
                                <TextField
                                    id="suggestedKeywords"
                                    label="Mots clefs suggérés par le partenaire"
                                    className={classes.separation}
                                    value={this.state.modifiedProject.suggestedKeywords}
                                    onChange={this.handleChange}
                                    fullWidth={true}
                                />
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} md={4} lg={2}>
                                <Button
                                    size="sm"
                                    color="success"
                                    name="validated"
                                    onClick={this.saveChanges}>
                                    Sauvegarder les changements
                                </Button>
                            </GridItem>

                            <GridItem xs={12} md={4} lg={2}>
                                <Button
                                    size="sm"
                                    color="danger"
                                    name="rejected"
                                    onClick={this.cancelChanges}>
                                    Annuler les changements
                                </Button>
                            </GridItem>

                        </GridContainer>
                    </CardBody>
                </Card>
            );
        } else {
            return (
                <Card>
                    <CardHeader color={color}>
                        <h4 className={classes.cardTitleWhite}>Information projet</h4>
                        <p className={classes.cardCategoryWhite}>Informations sur le projet proposé par le partenaire</p>
                    </CardHeader>
                    <CardBody>
                        <Typography variant="display2" align="center">
                            {this.state.project.number + " - " + this.state.project.title}
                        </Typography>
                        <br />
                        <Typography>
                            Description :
                         </Typography>
                        <Typography className={classes.displayLineBreak}>
                            {this.state.project.description}
                        </Typography>
                        <br />
                        <Divider />
                        <br />
                        <Typography >
                            Compétences développées :
                         </Typography>
                        <Typography>
                            {this.state.project.skills}
                        </Typography>
                        <br />
                        <Typography >
                            Informations supplémentaires :
                         </Typography>
                        <Typography>
                            {this.state.project.infos}
                        </Typography>
                        <br />
                        <Typography >
                            Nombre maximum d'équipes sur le projet :
                         </Typography>
                        <Typography>
                            {this.state.project.maxTeams}
                        </Typography>
                        <br />
                        <Typography >
                            Mots clefs suggérés par le partenaire :
                         </Typography>
                        <Typography>
                            {this.state.project.suggestedKeywords}
                        </Typography>
                        <br />
                        <Typography >
                            Déposé le {new Date(this.state.project.submissionDate).toLocaleDateString()}
                        </Typography>
                        {this.state.project.lastUpdate &&
                            <Typography>
                                Dernière mise à jour le {new Date(this.state.project.lastUpdate.at).toLocaleDateString()} par <Link to={"/user/" + this.state.project.lastUpdate.by._id} >{this.state.project.lastUpdate.by.first_name + " " + this.state.project.lastUpdate.by.last_name}</Link>
                            </Typography>
                        }

                        {this.props.editable &&
                            <Button
                                size="sm"
                                color="warning"
                                onClick={this.startEditing}>
                                Editer les informations
                                </Button>
                        }
                    </CardBody>
                </Card>
            );
        }
    }
}

ProjectInfo.propTypes = {
    color: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
}

export default withUser(withSnackbar(withStyles(styles)(ProjectInfo)));
