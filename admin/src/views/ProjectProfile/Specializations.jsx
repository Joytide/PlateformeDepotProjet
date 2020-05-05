import React from "react";
import PropTypes from 'prop-types';

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from '@material-ui/core/Chip';

import Add from "@material-ui/icons/Add";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Table from "components/Table/Table.jsx";
import Modal from "components/Modal/Modal.jsx";

import AuthService from "components/AuthService";
import { withUser } from "../../providers/UserProvider/UserProvider";
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler";
import { hasPermission } from "../../components/PermissionHandler";

import {ProjectProfile as Permissions} from "../../permissions"
import { api } from "../../config";

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
    }
};

class Specializations extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingSpecialization: true,
            specializations: [],
            projectSpecializations: this.props.projectSpecializations,
            callbackValidation: () => {},
            openValidationModal: false
        }
    }

    componentWillMount() {
        this.loadSpecializations();
    }

    loadProjectSpecializations() {
        AuthService.fetch(api.host + ":" + api.port + "/api/project/" + this.props.projectId + "/specializations")
            .then(res => {
                if (!res.ok)
                    throw res;
                return res.json();
            })
            .then(data => {
                this.setState({
                    projectSpecializations: data.specializations
                });
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    loadSpecializations() {
        fetch(api.host + ":" + api.port + "/api/specialization")
            .then(res => {
                if (!res.ok)
                    throw res;
                return res.json();
            })
            .then(data => {
                this.setState({
                    specializations: data,
                    loadingSpecialization: false,
                })
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    openValidationModal = _id => () => {
        this.setState({ openValidationModal: true });
    };

    closeValidationModal = () => {
        this.setState({ openValidationModal: false });
    };

    validModal = () => {
        this.state.callbackValidation();
    }

    specializationValidation = (status, speId) => () => {
        function sendValidation() {
            let data = {
                specializationId: speId,
                status,
                projectId: this.props.projectId
            };

            AuthService.fetch(api.host + ":" + api.port + "/api/project/validation", {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok)
                        throw res;
                    return res.json();
                })
                .then(data => {
                    this.setState({ openValidationModal: false });
                    this.props.reloadProject();
                    this.loadProjectSpecializations();
                })
                .catch(err => {
                    if(err.status === 409)
                        this.props.snackbar.error("Veuillez saisir à minima 2 mots clefs")
                    else 
                        handleXhrError(this.props.snackbar)(err);
                });
        }

        let pendingProject = this.state.projectSpecializations.filter(spe => spe.status === "pending").length + (status === "pending" ? 1 : -1);

        if (pendingProject === 0) {
            this.setState({
                openValidationModal: true,
                callbackValidation: sendValidation.bind(this)
            });
        }
        else {
            sendValidation.call(this);
        }
    }

    addSpecialization = id => () => {
        let data = {
            specializationId: id,
            projectId: this.props.projectId
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/project/validation", {
            method: "PUT",
            body: JSON.stringify(data)
        })
            .then(res => {
                if (!res.ok)
                    throw res;
                return res.json();
            })
            .then(data => {
                this.props.reloadProject();
                this.loadProjectSpecializations();
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    render() {
        const { classes, color } = this.props;


        if (!this.state.loadingSpecialization) {
            let speData = this.state.specializations.map(spe => {
                let arr = [spe.name.fr, "", "", ""];
                let i = 0;

                do {
                    // check if the project is concerned by the actual spe. Could have used filter function instead
                    if (this.state.projectSpecializations.length > 0 && this.state.projectSpecializations[i].specialization._id === spe._id) {
                        if (this.state.projectSpecializations[i].status === "validated")
                            arr[1] = <Chip
                                label="Validé"
                                className={classes.chip}
                                style={{ backgroundColor: "#4caf50", color: "white" }}
                            />;
                        else if (this.state.projectSpecializations[i].status === "rejected")
                            arr[1] = <Chip
                                label="Refusé"
                                className={classes.chip}
                                style={{ backgroundColor: "rgb(244, 67, 54)", color: "white" }}
                            />;
                        else
                            arr[1] = <Chip
                                label="En attente de validation"
                                className={classes.chip}
                                style={{ backgroundColor: "rgb(255, 152, 0)", color: "white" }}
                            />;
                        arr[2] = "";
                        if (this.props.projectStatus === "pending") {
                            if (hasPermission(Permissions.ManageSpecializations, this.props.user.user, [spe]))
                                arr[3] = (
                                    <div>
                                        <Button
                                            size="sm"
                                            disabled={this.state.projectSpecializations[i].status === "validated"}
                                            color="success"
                                            name="validated"
                                            onClick={this.specializationValidation("validated", spe._id)}>
                                            Valider le projet
                                </Button>
                                        <Button
                                            size="sm"
                                            disabled={this.state.projectSpecializations[i].status === "pending"}
                                            color="warning"
                                            name="pending"
                                            onClick={this.specializationValidation("pending", spe._id)}>
                                            Mettre en attente
                                </Button>
                                        <Button
                                            size="sm"
                                            disabled={this.state.projectSpecializations[i].status === "rejected"}
                                            color="danger"
                                            name="rejected"
                                            onClick={this.specializationValidation("rejected", spe._id)}>
                                            Refuser le projet
                                </Button>
                                    </div>
                                );
                        }
                        break;
                    } else {
                        arr[1] = "Non concerné";
                        if (this.props.projectStatus === "pending" && hasPermission(Permissions.ManageSpecializations, this.props.user.user, [spe]))
                            arr[2] = (
                                    <Button component="span" size="sm" color="info" onClick={this.addSpecialization(spe._id)}><Add />Ajouter</Button>
                            );
                    }
                    i++
                } while (i < this.state.projectSpecializations.length);

                return arr;
            });

            return (
                    <div>
                    <Modal
                        open={this.state.openValidationModal}
                        closeModal={this.closeValidationModal}
                        title="Valider/Refuser ce projet ?"
                        content={(<div>
                            Une fois ce projet validé/refusé, il ne sera plus possible d'effectuer de modification<br />
                            Si vous souhaitez ajouter une majeure, merci de le faire avant de valider/refuser le projet pour votre majeure
                        </div>)}
                        buttonColor="danger"
                        buttonContent="Continuer"
                        validation={this.validModal}
                    />
                    <Card>
                        <CardHeader color={color}>
                            <h4 className={classes.cardTitleWhite}>Majeures</h4>
                            <p className={classes.cardCategoryWhite}>Majeures concernées par le projet</p>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12}>
                                    <Table
                                        tableHeaderColor="primary"
                                        tableHead={["Majeure", "Status", "", "Validation"]}
                                        tableData={speData}
                                    />
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </Card >
                </div>
            );
        }
        else
            return (
                <Card>
                    <CardHeader color={color}>
                        <h4 className={classes.cardTitleWhite}>Majeures</h4>
                        <p className={classes.cardCategoryWhite}>Majeures concernées par le projet</p>
                    </CardHeader>
                    <CardBody>
                        <Typography>Loading ...</Typography>
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </Card >
            );
    }
}

Specializations.propTypes = {
    color: PropTypes.string.isRequired,
    projectSpecializations: PropTypes.array.isRequired,
    projectStatus: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
}

export default withSnackbar(withUser(withStyles(styles)(Specializations)));
