import React from "react";
import PropTypes from 'prop-types';

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

const styles = {
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
};

class ProjectInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            project: this.props.project,
            modifiedProject: this.props.project
        }
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
            _id: this.state.modifiedProject._id,
            title: this.state.modifiedProject.title,
            description: this.state.modifiedProject.description,
            skills: this.state.modifiedProject.skills,
            infos: this.state.modifiedProject.infos,
            maxTeams: this.state.modifiedProject.maxTeams,
        }

        AuthService.fetch(api.host + ":" + api.port + "/api/projects", {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ edit: false, project: this.state.modifiedProject });
            });
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
                            {this.state.project.title}
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

                        <Button
                            size="sm"
                            color="warning"
                            onClick={this.startEditing}>
                            Editer les informations
                                </Button>
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

export default withStyles(styles)(ProjectInfo);
