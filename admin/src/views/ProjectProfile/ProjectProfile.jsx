import React from "react";
import { Link } from 'react-router-dom';

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { FormControl, InputLabel, Select, Input, MenuItem } from '@material-ui/core'
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Visibility from "@material-ui/icons/Visibility"

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Button from "components/CustomButtons/Button.jsx";

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
            checkedYears: {},
            years: [],
            specializations: [],
            project: {},
            specializations_concerned: [],
            color: "primary"
        }

        this.handleChange = this.handleChange.bind(this);
        this.loadProjectData = this.loadProjectData.bind(this);
        this.loadStaticData = this.loadStaticData.bind(this);
        this.checkboxMapping = this.checkboxMapping.bind(this);
    }

    loadProjectData() {
        fetch(api.host + ":" + api.port + "/api/project/" + this.props.match.params.id)
            .then(res => res.json())
            .then(data => {
                let color = data.status === "pending" ? "warning" : (data.status === "validated" ? "success" : "danger");
                this.setState({
                    project: data,
                    loadingProject: false,
                    specializations_concerned: data.majors_concerned.map(spe => spe._id),
                    color: color
                }, this.checkboxMapping);
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

    // Check or uncheck checkbox when both project and years are loaded
    checkboxMapping() {
        if (!this.state.loadingProject && !this.state.loadingYear) {
            let checkedYears = {};

            let yearsConcerned = this.state.project.study_year.map(year => year._id);
            this.state.years.forEach(year => {
                if (yearsConcerned.indexOf(year._id) != -1) checkedYears[year._id] = true;
                else checkedYears[year._id] = false;
            });

            this.setState({
                checkedYears: checkedYears
            });
        }
    }

    componentDidMount() {
        this.loadProjectData();
        this.loadStaticData();
    }

    handleChange = event => {
        const value = event.target.value;
        const id = event.target.id;
        this.setState(prevState => ({
            modificated: true,
            specialization: {
                ...prevState.specialization,
                [id]: value
            }
        }));
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

    handleSelect = event => {
        if (event.target.value.length > 0) {
            let data = {
                _id: this.state.project._id,
                majors_concerned: event.target.value
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
                        project: data,
                        specializations_concerned: data.majors_concerned.map(spe => spe._id)
                    });
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
                message: "Le projet doit à minima concerner à une majeure."
            }, () => {
                setTimeout(() => {
                    this.setState({
                        error: false
                    });
                }, 2500);
            });
        }
    }

    handleProjectStatus = event => {
        const data = {
            _id: this.state.project._id,
            status: event.target.name
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

    render() {
        const { classes } = this.props;
        const { specialization } = this.state;

        let partnerInfo, projectInfo, classification, actions;

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
                                <Typography variant="body2" gutterBottom>
                                    Entreprise :
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {this.state.project.partner.company}
                                </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography variant="body2" gutterBottom>
                                    Mail :
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <a href={"mailto:" + this.state.project.partner.email}>{this.state.project.partner.email}</a>
                                </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography variant="body2" gutterBottom>
                                    Nom :
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {this.state.project.partner.last_name}
                                </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography variant="body2" gutterBottom>
                                    Prénom :
                        </Typography>
                                <Typography variant="body1" gutterBottom>
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
                        <Typography variant="body2">
                            Pitch du projet :
                                </Typography>
                        <Typography variant="body1">
                            ...
                        </Typography>
                        <br />
                        <Typography variant="body2">
                            Description :
                        </Typography>
                        <Typography variant="body1" className={classes.displayLineBreak}>
                            {this.state.project.description}
                        </Typography>
                        <br />
                        <Divider />
                        <br />
                        <Typography variant="body2">
                            Fichier(s) joint(s) :
                        </Typography>
                    </CardBody>
                </Card>
            );

            actions = (
                <Card>
                    <CardFooter>
                        <GridContainer >
                            <GridItem xs={12} sm={12} md={12}>
                                <Button disabled={this.state.project.status === "validated"} color="success" name="validated" onClick={this.handleProjectStatus}>Valider le projet</Button>
                                <Button disabled={this.state.project.status === "pending"} color="warning" name="pending" onClick={this.handleProjectStatus}>Mettre en attente</Button>
                                <Button disabled={this.state.project.status === "rejected"} color="danger" name="rejected" onClick={this.handleProjectStatus}>Rejeter le projet</Button>
                            </GridItem>
                        </GridContainer>
                    </CardFooter>
                </Card>
            );
        }
        if (!this.state.loadingYear && !this.state.loadingSpecialization) {
            classification = (
                <Card>
                    <CardHeader color={this.state.color}>
                        <h4 className={classes.cardTitleWhite}>Classification</h4>
                        <p className={classes.cardCategoryWhite}>Informations sur les éléments permettant la classification du projet</p>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12} md={6}>
                                <Typography variant="body2" align="center">
                                    Année(s) concernée(s) par le projet :
                                </Typography>

                                <GridContainer alignItesm="center" justify="center">
                                    {this.state.years.map(year =>
                                        <GridItem xs={12} md={4} key={year._id}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={this.handleCheckboxChange}
                                                        checked={this.state.checkedYears[year._id]}
                                                        id={year._id}
                                                        color="primary"
                                                    />
                                                }
                                                label={year.name.fr}
                                            />
                                        </GridItem>
                                    )}
                                </GridContainer>
                            </GridItem>

                            <GridItem xs={12} md={6}>
                                <Typography variant="body2" align="center">
                                    Majeure(s) concernée(s) par le projet :
                                </Typography>

                                <FormControl fullWidth>
                                    <InputLabel htmlFor="select-multiple">Majeure(s) ciblé(s)</InputLabel>
                                    <Select
                                        multiple
                                        required
                                        fullWidth
                                        value={this.state.specializations_concerned}
                                        onChange={this.handleSelect}
                                        input={<Input id="select-multiple" />}
                                    >
                                        {this.state.specializations.map(specialization => (
                                            <MenuItem key={specialization._id} value={specialization._id}>
                                                {specialization.name.fr}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </GridItem>
                        </GridContainer>
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </Card >
            );
        }

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

                    {classification}

                    {actions}
                </GridItem>
            </GridContainer >);

    }
}

export default withStyles(styles)(ProjectProfile);
