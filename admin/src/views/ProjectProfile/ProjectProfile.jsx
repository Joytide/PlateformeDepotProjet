import React from "react";
import { Link } from 'react-router-dom';

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { Input } from '@material-ui/core'
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import Visibility from "@material-ui/icons/Visibility"
import Add from "@material-ui/icons/Add"
import Remove from "@material-ui/icons/Remove"
import Cached from "@material-ui/icons/Cached"
import FormControl from '@material-ui/core/FormControl';

// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Table from "components/Table/Table.jsx";
import Modal from "components/Modal/Modal.jsx";

import { withUser } from "../../providers/UserProvider/UserProvider"
import AuthService from "components/AuthService"
import { api } from "../../config"

import PartnerInfo from "./PartnerInfo";
import ProjectInfo from "./ProjectInfo";
import Keywords from "./Keywords";
import Files from "./Files";
import Years from "./Years";

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

class ProjectProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            success: false,
            message: "",
            loadingProject: true,
            loadingSpecialization: true,
            specializations: [],
            project: {},
            specializations_concerned: [],
            color: "primary",
            openValidationModal: false,
        }

        this.loadProjectData = this.loadProjectData.bind(this);
        this.loadStaticData = this.loadStaticData.bind(this);
        this.addSpecialization = this.addSpecialization.bind(this);
    }

    componentWillMount() {
        this.loadProjectData();
        this.loadStaticData();
    }

    loadProjectData() {
        fetch(api.host + ":" + api.port + "/api/project/" + this.props.match.params.id)
            .then(res => res.json())
            .then(data => {
                let color = data.status === "pending" ? "warning" : (data.status === "validated" ? "success" : "danger");
                this.setState({
                    project: data,
                    loadingProject: false,
                    specializations_concerned: data.specializations.map(spe => spe.specialization),
                    color: color
                });
            });
    }

    loadStaticData() {
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

    handleProjectStatus = action => () => {
        const data = {
            _id: this.state.project._id,
            status: action
        }

        fetch(api.host + ":" + api.port + "/api/projects", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (!res.ok) throw res;
                else return res.json()
            })
            .then(data => {
                let color = data.status === "pending" ? "warning" : (data.status === "validated" ? "success" : "danger");
                this.setState({
                    project: data,
                    color: color
                });
            })
            .catch(err => {
                this.setState({
                    error: true,
                    message: "Une erreur est survenue lors de la sauvegarde des données."
                });
                console.error(err);
            });
    }

    addSpecialization = id => () => {
        let data = {
            speId: id,
            projectId: this.state.project._id
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/project/validation", {
            method: "PUT",
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                this.loadProjectData();
            });
    }

    specializationValidation = (status, speId) => () => {
        function sendValidation() {
            let data = {
                speId,
                status,
                projectId: this.state.project._id
            };

            AuthService.fetch(api.host + ":" + api.port + "/api/project/validation", {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ openValidationModal: false });
                    this.loadProjectData();
                });
        }

        let pendingProject = this.state.project.specializations.filter(spe => spe.status === "pending").length + (status === "pending" ? 1 : -1);

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

    validModal = () => {
        this.state.callbackValidation();
    }

    regeneratePDF = () => {
        let data = {
            _id: this.state.project._id
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/pdf", {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then(res => {
                if (!res.ok) throw res;
                else return res.json();
            })
            .then(data => {
                this.setState({
                    success: true,
                    message: "Votre demande a bien été traité."
                });

                setTimeout(() => this.loadProjectData(), 2500);
            })
            .catch(err => {
                console.error(err)
                this.setState({
                    error: true,
                    message: "Une erreur est survenue lors de la regénération du PDF. Merci de réessayer."
                })
            });

    }

    render() {
        const { classes } = this.props;

        let partnerInfo, projectInfo, years, files, specializations, other, keywords;

        if (!this.state.loadingProject) {
            partnerInfo = (
                <PartnerInfo color={this.state.color} partner={this.state.project.partner} />
            );

            projectInfo = (
                <ProjectInfo color={this.state.color} project={this.state.project} />
            );

            keywords = (
                <Keywords color={this.state.color} projectKeywords={this.state.project.keywords} projectId={this.props.match.params.id} />
            );

            files = (
                <Files
                    color={this.state.color}
                    projectFiles={this.state.project.files}
                    projectStatus={this.state.project.status}
                    projectId={this.props.match.params.id}
                    partnerId={this.state.project.partner._id}
                />
            );

            years = (
                <Years
                    color={this.state.color}
                    projectStatus={this.state.project.status}
                    projectId={this.props.match.params.id}
                    studyYears={this.state.project.study_year}
                />
            );
        }

        if (!this.state.loadingSpecialization && !this.state.loadingProject) {
            let speData = this.state.specializations.map(spe => {
                let arr = [spe.name.fr, "", "", ""];
                let i = 0;

                do {
                    if (this.state.project.specializations.length > 0 && this.state.project.specializations[i].specialization._id === spe._id) {
                        if (this.state.project.specializations[i].status === "validated")
                            arr[1] = <Chip
                                label="Validé"
                                className={classes.chip}
                                style={{ backgroundColor: "#4caf50", color: "white" }}
                            />;
                        else if (this.state.project.specializations[i].status === "rejected")
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
                        if (this.state.project.status === "pending") {
                            if (this.props.user.user.admin
                                || this.props.user.user.EPGE
                                || spe.referent.map(r => r._id).indexOf(this.props.user.user._id) !== -1)
                                arr[3] = (
                                    <div>
                                        <Button
                                            size="sm"
                                            disabled={this.state.project.specializations[i].status === "validated"}
                                            color="success"
                                            name="validated"
                                            onClick={this.specializationValidation("validated", spe._id)}>
                                            Valider le projet
                                </Button>
                                        <Button
                                            size="sm"
                                            disabled={this.state.project.specializations[i].status === "pending"}
                                            color="warning"
                                            name="pending"
                                            onClick={this.specializationValidation("pending", spe._id)}>
                                            Mettre en attente
                                </Button>
                                        <Button
                                            size="sm"
                                            disabled={this.state.project.specializations[i].status === "rejected"}
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
                        if (this.state.project.status === "pending")
                            arr[2] = (
                                <Tooltip title="Ajouter la majeure comme concernée par le projet" placement="top">
                                    <Button component="span" size="sm" color="info" onClick={this.addSpecialization(spe._id)}><Add />Ajouter</Button>
                                </Tooltip>);
                    }
                    i++
                } while (i < this.state.project.specializations.length);

                return arr;
            });

            specializations = (
                <Card>
                    <CardHeader color={this.state.color}>
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
            )
        }

        other = <Card>
            <CardHeader color={this.state.color}>
                <h4 className={classes.cardTitleWhite}>Autre options</h4>
                <p className={classes.cardCategoryWhite}></p>
            </CardHeader>
            <CardBody>
                {this.state.project.pdf &&
                    <a href={api.host + ":" + api.port + "/api/project/file/" + this.state.project.pdf}>
                        <Button size="sm" color="info">
                            <Add />Exporter au format PDF
                        </Button>
                    </a>
                }
                <Button size="sm" color="info" onClick={this.regeneratePDF}>
                    <Cached />(re)Générer le PDF
                        </Button>
            </CardBody>
        </Card>

        return (
            <GridContainer>
                <Snackbar
                    place="tc"
                    color="success"
                    message={this.state.message}
                    open={this.state.success}
                    closeNotification={() => this.setState({ success: false })}
                    close
                />
                <Snackbar
                    place="tc"
                    color="danger"
                    message={this.state.message}
                    open={this.state.error}
                    closeNotification={() => this.setState({ error: false })}
                    close
                />
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

                <GridItem xs={12} sm={12} md={12}>
                    {partnerInfo}

                    {projectInfo}

                    {keywords}

                    {files}

                    {years}

                    {specializations}

                    {this.state.project.status === "validated" && other}
                </GridItem>
            </GridContainer >);
    }
}

export default withUser(withStyles(styles)(ProjectProfile));