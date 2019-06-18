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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';

import Visibility from "@material-ui/icons/Visibility"
import Add from "@material-ui/icons/Add"
import Cached from "@material-ui/icons/Cached"


// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Table from "components/Table/Table.jsx";

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

class ProjectProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            success: false,
            message: "",
            loadingProject: true,
            loadingYear: true,
            loadingSpecialization: true,
            loadingComments: true,
            checkedYears: {},
            years: [],
            specializations: [],
            project: {},
            comments: [],
            specializations_concerned: [],
            color: "primary",
            open: false,
            toDelete: ""
        }

        this.loadProjectData = this.loadProjectData.bind(this);
        this.loadProjectComments = this.loadProjectComments.bind(this);
        this.loadStaticData = this.loadStaticData.bind(this);
        this.addSpecialization = this.addSpecialization.bind(this);
        this.checkboxMapping = this.checkboxMapping.bind(this);
    }

    componentDidMount() {
        this.loadProjectData();
        this.loadStaticData();
        this.loadProjectComments();
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
                }, this.checkboxMapping);
            });
    }

    loadProjectComments() {
        fetch(api.host + ":" + api.port + "/api/comment/" + this.props.match.params.id)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    comments: data,
                    loadingComments: false,
                });
            });
    }

    loadStaticData() {
        fetch(api.host + ":" + api.port + "/api/year")
            .then(res => res.json())
            .then(years => {
                let checkedYears = {};

                years.forEach(year => {
                    checkedYears[year._id] = false;
                });

                this.setState({
                    years: years,
                    checkedYears: checkedYears,
                    loadingYear: false,
                }, this.checkboxMapping);
            });

        fetch(api.host + ":" + api.port + "/api/specialization")
            .then(res => res.json())
            .then(data => {
                this.setState({
                    specializations: data,
                    loadingSpecialization: false,
                })
            });
    }

    openModal = _id => () => {
        this.setState({ open: true, toDelete: _id });
    };

    closeModal = () => {
        this.setState({ open: false, toDelete: "" });

    };

    // Check or uncheck checkbox when both project and years are loaded
    checkboxMapping() {
        if (!this.state.loadingProject && !this.state.loadingYear) {
            let checkedYears = {};

            let yearsConcerned = this.state.project.study_year.map(year => year._id);

            this.state.years.forEach(year => {
                if (yearsConcerned.indexOf(year._id) !== -1) checkedYears[year._id] = true;
                else checkedYears[year._id] = false;
            });

            this.setState({
                checkedYears: checkedYears
            });
        }
    }

    handleCheckboxChange = event => {
        const checked = event.target.checked;
        const id = event.target.id;

        let checkedCount = 0;
        for (const id in this.state.checkedYears)
            if (this.state.checkedYears[id])
                checkedCount++;

        if (checkedCount >= 2 || checked) {
            let yearList = [];

            for (let yearId in this.state.checkedYears)
                if ((this.state.checkedYears[yearId] && yearId !== id) || (!this.state.checkedYears[yearId] && yearId === id))
                    yearList.push(yearId);

            const data = {
                _id: this.state.project._id,
                study_year: yearList
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
                    this.setState({
                        project: data
                    });
                    this.checkboxMapping();
                })
                .catch(err => {
                    this.setState({
                        error: true,
                        message: "Une erreur est survenue lors de la sauvegarde des données."
                    });
                    console.error(err);
                });
        } else {
            this.setState({
                error: true,
                message: "Le projet doit à minima concerner à une année."
            }, () => {
                setTimeout(() => {
                    this.setState({
                        error: false
                    });
                }, 2500);
            });
        }
    }

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

    deleteFile = () => {
        const data = {
            fileID: this.state.toDelete
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/project/file", {
            method: "DELETE",
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    this.setState({ open: false, toDelete: "" }, () => {
                        this.loadProjectData();
                        this.closeModal();
                    });
                }
            });
    }

    uploadFile = file => {
        var formData = new FormData();
        formData.append("partnerID", this.state.project.partner._id);
        formData.append("projectID", this.state.project._id)
        formData.append("file", new Blob([file], { type: file.type }), file.name || 'file');


        fetch(api.host + ":" + api.port + '/api/project/file', {
            method: "POST",
            headers: {
                "Authorization": AuthService.getToken()
            },
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                this.loadProjectData();
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
                this.loadProjectData();
            });
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
                })
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

        let partnerInfo, projectInfo, years, files, specializations, other;

        if (!this.state.loadingProject) {
            partnerInfo = (
                <Card>
                    <CardHeader color={this.state.color}>
                        <h4 className={classes.cardTitleWhite}>Information partenaire</h4>
                        <p className={classes.cardCategoryWhite}>Informations disponibles sur le partenaire</p>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography gutterBottom>
                                    Entreprise :
                                </Typography>
                                <Typography gutterBottom>
                                    {this.state.project.partner.company}
                                </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography gutterBottom>
                                    Mail :
                                </Typography>
                                <Typography gutterBottom>
                                    <a href={"mailto:" + this.state.project.partner.email}>{this.state.project.partner.email}</a>
                                </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography gutterBottom>
                                    Nom :
                                </Typography>
                                <Typography gutterBottom>
                                    {this.state.project.partner.last_name}
                                </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography variant="body2" gutterBottom>
                                    Prénom :
                        </Typography>
                                <Typography gutterBottom>
                                    {this.state.project.partner.first_name}
                                </Typography>
                            </GridItem>
                        </GridContainer>
                    </CardBody>
                    <CardFooter>
                        <GridContainer >
                            <GridItem xs={12} sm={12} md={12}>
                                <Link to={"/user/" + this.state.project.partner._id}>
                                    <Button size="sm" color="info"><Visibility />Profil du partenaire</Button>
                                </Link>
                            </GridItem>
                        </GridContainer>
                    </CardFooter>
                </Card>
            );

            projectInfo = (
                <Card>
                    <CardHeader color={this.state.color}>
                        <h4 className={classes.cardTitleWhite}>Information projet</h4>
                        <p className={classes.cardCategoryWhite}>Informations sur le projet proposé par le partenaire</p>
                    </CardHeader>
                    <CardBody>
                        <Typography variant="display2" align="center">
                            {this.state.project.title}
                        </Typography>
                        <br />
                        <Typography >
                            Pitch du projet :
                                </Typography>
                        <Typography >
                            ...
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
                            Mot(s) clé(s) :
                        </Typography>
                        <Typography>
                            {this.state.project.keywords.join(', ')}
                        </Typography>
                    </CardBody>
                </Card>
            );

            files = (
                <Card>
                    <CardHeader color={this.state.color}>
                        <h4 className={classes.cardTitleWhite}>Liste des fichiers</h4>
                        <p className={classes.cardCategoryWhite}>Fichiers proposés par le partenaire</p>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            {
                                this.state.project.files.map(file => {
                                    if (file != null)
                                        return (
                                            <GridItem xs={12} sm={12} md={6} key={file._id}>
                                                <Card style={{ width: "20rem" }}>
                                                    <CardBody>
                                                        <h4>{file.originalName}</h4>
                                                        <a download href={api.host + ":" + api.port + "/api/project/file/" + file._id}>
                                                            <Button size="sm" color="info">Télécharger</Button>
                                                        </a>
                                                        {(this.props.user.user.EPGE || this.props.user.user.admin) &&
                                                            <Button size="sm" color="danger" onClick={this.openModal(file._id)}>Supprimer</Button>
                                                        }
                                                    </CardBody>
                                                </Card>
                                            </GridItem>
                                        );
                                    else return <div></div>;
                                })
                            }

                        </GridContainer>
                    </CardBody>
                    {(this.props.user.user.EPGE || this.props.user.user.admin) &&
                        <CardFooter>
                            <GridContainer >
                                <GridItem xs={12} sm={12} md={12}>
                                    <Input
                                        className={classes.input}
                                        id="raised-button-file"
                                        type="file"
                                        onChange={e => this.uploadFile(e.target.files[0])}
                                        style={{ display: "none" }}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button component="span" size="sm" color="info"><Add />Ajouter un fichier</Button>
                                    </label>
                                </GridItem>
                            </GridContainer>
                        </CardFooter>
                    }
                </Card>
            )

        }
        if (!this.state.loadingYear) {
            years = (
                <Card>
                    <CardHeader color={this.state.color}>
                        <h4 className={classes.cardTitleWhite}>Années</h4>
                        <p className={classes.cardCategoryWhite}>Années concernées par le projet</p>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12} md={12}>
                                <GridContainer alignItems="center" justify="center">
                                    {this.state.years.map(year =>
                                        <GridItem xs={12} md={3} key={year._id}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={this.handleCheckboxChange}
                                                        checked={this.state.checkedYears[year._id]}
                                                        id={year._id}
                                                        disabled={this.state.project.status !== "pending"}
                                                        color="primary"
                                                    />
                                                }
                                                label={year.name.fr}
                                            />
                                        </GridItem>
                                    )}
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </Card >
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
                        console.log(spe);
                        if (this.state.project.status === "pending") {
                            if (this.props.user.user.admin
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

        /*if (!this.state.loadingComments) {
            let tableData = this.state.comments.map(comment => {
                let date = new Date(comment.date)
                return [
                    date.toLocaleDateString() + " à " + date.toLocaleTimeString(),
                    <Link to={"/user/" + comment.author._id}>{comment.author.last_name.toUpperCase() + " " + comment.author.first_name}</Link>,
                    comment.content
                ];
            });

            comments = (
                <Card>
                    <CardHeader color={this.state.color}>
                        <h4 className={classes.cardTitleWhite}>Commentaires sur le projet</h4>
                        <p className={classes.cardCategoryWhite}>Ces commentaires sont strictement privés et sont uniquement adressés aux membres de l'administration</p>
                    </CardHeader>
                    <CardBody>
                        <Table
                            tableHeaderColor="primary"
                            tableHead={['Date', 'Auteur', 'Contenu du commentaire']}
                            tableData={tableData}
                        />
                    </CardBody>
                </Card>
            );
        }*/

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

                <Dialog
                    open={this.state.open}
                    onClose={this.closeModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Supprimer ce fichier ?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Etes vous sûr de vouloir supprimer ce fichier ?
                            <br />
                            Toute suppression est définitive et aucun retour en arrière n'est possible.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.closeModal} size="sm" color="info" autoFocus>
                            Annuler
                        </Button>
                        <Button size="sm" color="danger" onClick={this.deleteFile}>
                            Supprimer
                        </Button>
                    </DialogActions>
                </Dialog>

                <GridItem xs={12} sm={12} md={12}>
                    {partnerInfo}

                    {projectInfo}

                    {files}

                    {years}

                    {specializations}

                    {this.state.project.status === "validated" && other}
                </GridItem>
            </GridContainer >);
    }
}

export default withUser(withStyles(styles)(ProjectProfile));