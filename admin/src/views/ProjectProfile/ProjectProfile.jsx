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
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Button from "components/CustomButtons/Button.jsx";

import { withUser } from "../../providers/UserProvider/UserProvider"
import AuthService from "components/AuthService"
import { api } from "../../config"

import PartnerInfo from "./PartnerInfo";
import ProjectInfo from "./ProjectInfo";
import Keywords from "./Keywords";
import Files from "./Files";
import Years from "./Years";
import Specializations from "./Specializations";

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
            project: {},
            color: "primary",
        }

        this.loadProjectData = this.loadProjectData.bind(this);
    }

    componentWillMount() {
        this.loadProjectData();
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
            })
            .catch(err => console.error(err));
    }

    /* handleProjectStatus = action => () => {
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
     }*/

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
                <PartnerInfo
                    color={this.state.color}
                    partner={this.state.project.partner}
                />
            );

            projectInfo = (
                <ProjectInfo
                    color={this.state.color}
                    project={this.state.project}
                />
            );

            keywords = (
                <Keywords
                    color={this.state.color}
                    projectKeywords={this.state.project.keywords}
                    projectId={this.props.match.params.id}
                />
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

            specializations = (
                <Specializations
                    color={this.state.color}
                    projectStatus={this.state.project.status}
                    projectId={this.props.match.params.id}
                    projectSpecializations={this.state.project.specializations}
                />
            );
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