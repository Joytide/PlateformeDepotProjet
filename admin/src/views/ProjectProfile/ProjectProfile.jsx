import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import Add from "@material-ui/icons/Add"
import Cached from "@material-ui/icons/Cached"

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";

import AuthService from "components/AuthService"
import { hasPermission } from "components/PermissionHandler";
import { withUser } from "../../providers/UserProvider/UserProvider"
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler";

import { ProjectProfile as Permissions } from "../../permissions"
import { api } from "../../config"

import PartnerInfo from "./PartnerInfo";
import ProjectInfo from "./ProjectInfo";
import Keywords from "./Keywords";
import Files from "./Files";
import Years from "./Years";
import Specializations from "./Specializations";
import Comments from "./Comments";

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
    confidential: {
        backgroundColor: "red"
    },
    fab: {
        margin: theme.spacing.unit,
        position: "fixed",
        bottom: 2 * theme.spacing.unit,
        right: 2 * theme.spacing.unit,
        zIndex: 9999
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    bottomGrid: {
        margin: theme.spacing.unit,
        position: "fixed",
        bottom: 2 * theme.spacing.unit,
        right: 2 * theme.spacing.unit,
        zIndex: 9999,
        width: "200px"
    }
});

class ProjectProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            success: false,
            message: "",
            loadingProject: true,
            project: {},
            color: "primary",
            canEditProject: false,
            canManageKeywords: false,
            canManageFiles: false,
            canManageYears: false,
            canManageSpecializations: false,
            canRegeneratePDF: false,
            canChangeConfidentiality: false
        }

        this.loadProjectData = this.loadProjectData.bind(this);
    }

    componentWillMount() {
        this.loadProjectData();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.loadingProject)
            this.setPermissions(nextProps);
    }

    setPermissions(nextProps) {
        let specializations = this.state.project.specializations.map(spe => spe.specialization);
        let user = this.props.user.user;
        if (nextProps)
            user = nextProps.user.user;

        const canEditProject = hasPermission(Permissions.EditProject, user, specializations);
        const canManageKeywords = hasPermission(Permissions.ManageKeywords, user, specializations);
        const canManageFiles = hasPermission(Permissions.ManageFiles, user, specializations);
        const canManageYears = hasPermission(Permissions.ManageYears, user, specializations);
        const canManageSpecializations = hasPermission(Permissions.ManageSpecializations, user, specializations);
        const canRegeneratePDF = hasPermission(Permissions.RegeneratePDF, user, specializations);
        const canChangeConfidentiality = hasPermission(Permissions.ChangeConfidentiality, user, specializations);

        this.setState({
            canEditProject,
            canManageKeywords,
            canManageFiles,
            canManageYears,
            canManageSpecializations,
            canRegeneratePDF,
            canChangeConfidentiality
        }, this.loadData);
    }

    loadProjectData() {
        AuthService.fetch(api.host + ":" + api.port + "/api/project/" + this.props.match.params.id)
            .then(res => {
                if (res.ok)
                    return res.json();
                else
                    throw res;
            })
            .then(data => {
                let color = data.status === "pending" ? "warning" : (data.status === "validated" ? "success" : "danger");
                this.setState({
                    project: data,
                    loadingProject: false,
                    color: color
                });
                this.setPermissions();
            })
            .catch(handleXhrError(this.props.snackbar));
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
                this.props.snackbar.notification("danger", "Votre demande a bien été traité.");
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    changeConfidentiality = newState => () => {
        let data = {
            id: this.state.project._id,
            confidential: newState
        }

        AuthService.fetch(api.host + ":" + api.port + "/api/project", {
            method: "PUT",
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok)
                    this.setState({ project: { ...this.state.project, confidential: newState } });
                else
                    throw res;
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    render() {
        const { classes } = this.props;

        let partnerInfo, projectInfo, years, files, specializations, other, keywords;

        if (!this.state.loadingProject) {
            partnerInfo = (
                <PartnerInfo
                    color={this.state.color}
                    partner={this.state.project.partner}
                />
            );

            projectInfo = (
                <ProjectInfo
                    color={this.state.color}
                    project={this.state.project}
                    editable={this.state.canEditProject && this.state.project.status === "pending"}
                />
            );

            keywords = (
                <Keywords
                    color={this.state.color}
                    projectKeywords={this.state.project.keywords}
                    projectId={this.props.match.params.id}
                    editable={this.state.canManageKeywords}
                />
            );

            files = (
                <Files
                    color={this.state.color}
                    projectFiles={this.state.project.files}
                    projectStatus={this.state.project.status}
                    projectId={this.props.match.params.id}
                    partnerId={this.state.project.partner._id}
                    editable={this.state.canManageFiles && this.state.project.status === "pending"}
                />
            );

            years = (
                <Years
                    color={this.state.color}
                    projectStatus={this.state.project.status}
                    projectId={this.props.match.params.id}
                    studyYears={this.state.project.study_year}
                    editable={this.state.canManageYears && this.state.project.status === "pending"}
                />
            );

            specializations = (
                <Specializations
                    color={this.state.color}
                    projectStatus={this.state.project.status}
                    projectId={this.props.match.params.id}
                    projectSpecializations={this.state.project.specializations}
                    reloadProject={this.loadProjectData}
                />
            );
        }

        let changeConfidentialityText = this.state.project.confidential ? "Retirer le status confidentiel" : "Ajouter le status confidentiel";
        other = <Card>
            <CardHeader color={this.state.color}>
                <h4 className={classes.cardTitleWhite}>Autre options</h4>
                <p className={classes.cardCategoryWhite}></p>
            </CardHeader>
            <CardBody>
                {this.state.project.pdf && this.state.project.status === "validated" &&
                    <a href={api.host + ":" + api.port + "/api/project/file/" + this.state.project.pdf + "?token=" + this.props.user.getToken()}>
                        <Button size="sm" color="info">
                            <Add />Exporter au format PDF
                        </Button>
                    </a>
                }
                {this.state.canRegeneratePDF && this.state.project.status === "validated" &&
                    <Button size="sm" color="info" onClick={this.regeneratePDF}>
                        <Cached />(re)Générer le PDF
                        </Button>
                }
                {this.state.canChangeConfidentiality &&
                    <Button size="sm" color="danger" onClick={this.changeConfidentiality(!this.state.project.confidential)}>
                        {changeConfidentialityText}
                    </Button>
                }
            </CardBody>
        </Card>

        return (
            <div>
                <Comments projectId={this.props.match.params.id} />
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        {this.state.project.confidential &&
                            <Card>
                                <CardHeader color="danger">
                                    <h4 className={classes.cardTitleWhite}>Ce projet est confidentiel</h4>
                                    <p className={classes.cardCategoryWhite}></p>
                                </CardHeader>
                                <CardBody>
                                    <Button size="sm" color="danger" onClick={this.changeConfidentiality(false)}>
                                        Retirer le status confidentiel
                                </Button>
                                </CardBody>
                            </Card>
                        }
                        {partnerInfo}

                        {projectInfo}

                        {keywords}

                        {files}

                        {years}

                        {specializations}

                        {other}
                    </GridItem>
                </GridContainer >
            </div >
        );
    }
}

export default withSnackbar(withUser(withStyles(styles)(ProjectProfile)));