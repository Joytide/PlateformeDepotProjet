import React from "react";
import PropTypes from 'prop-types';

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import Add from "@material-ui/icons/Add"

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

import { withUser } from "../../providers/UserProvider/UserProvider"
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
        }
    }

    componentWillMount() {
        this.loadSpecializations();
    }

    loadProjectSpecializations() {
        fetch(api.host + ":" + api.port + "/api/project/" + this.props.projectId + "/specializations")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.setState({
                    projectSpecializations: data.specializations
                });
            });
    }

    loadSpecializations() {
        fetch(api.host + ":" + api.port + "/api/specialization")
            .then(res => res.json())
            .then(data => {
                this.setState({
                    specializations: data,
                    loadingSpecialization: false,
                })
            });
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
                speId,
                status,
                projectId: this.props.projectId
            };

            AuthService.fetch(api.host + ":" + api.port + "/api/project/validation", {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ openValidationModal: false });
                    this.loadProjectSpecializations();
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
            speId: id,
            projectId: this.props.projectId
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/project/validation", {
            method: "PUT",
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                this.loadProjectSpecializations();
            });
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
                            if (this.props.user.user.admin
                                || this.props.user.user.EPGE
                                || spe.referent.map(r => r._id).indexOf(this.props.user.user._id) !== -1)
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
                        if (this.props.projectStatus === "pending")
                            arr[2] = (
                                <Tooltip title="Ajouter la majeure comme concernée par le projet" placement="top">
                                    <Button component="span" size="sm" color="info" onClick={this.addSpecialization(spe._id)}><Add />Ajouter</Button>
                                </Tooltip>);
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
    projectSpecializations: PropTypes.object.isRequired,
    projectStatus: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
}

export default withUser(withStyles(styles)(Specializations));
