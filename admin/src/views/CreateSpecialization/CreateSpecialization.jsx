import React from "react";
import { Redirect } from 'react-router'

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from '@material-ui/core/FormControl';

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import AuthService from "components/AuthService"

import { api } from "config.json"

const styles = theme => ({
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF"
        }
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1"
        }
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    }
});

class CreateSpecialization extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            labelWidth: 0,
            abbreviation: "",
            nameEn: "",
            nameFr: "",
            descriptionEn: "",
            descriptionFr: "",
            error: false,
            success: false,
            message: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.createSpecialization = this.createSpecialization.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    };

    handleCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    createSpecialization() {
        this.setState({ error: false, success: false });
        if (this.state.nameFr === "")
            this.setState({
                error: true,
                message: "Veuillez remplir le champ nom en français."
            });

        else if (this.state.nameEn === "")
            this.setState({
                error: true,
                message: "Veuillez remplir le champ nom en anglais."
            });

        else if (this.state.descriptionEn === "")
            this.setState({
                error: true,
                message: "Veuillez remplir le champ description en anglais."
            });
        else if (this.state.descriptionFr === "")
            this.setState({
                error: true,
                message: "Veuillez remplir le champ description en français."
            });

        else if (this.state.abbreviation === "")
            this.setState({
                error: true,
                message: "Veuillez remplir le champ Abbréviation."
            });
        else {
            let data = {
                nameFr: this.state.nameFr,
                nameEn: this.state.nameEn,
                descriptionFr: this.state.descriptionFr,
                descriptionEn: this.state.descriptionEn,
                abbreviation: this.state.abbreviation
            };

            AuthService.fetch(api.host + ":" + api.port + "/api/specialization", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        success: true,
                        message: "Majeure créée avec succès. Vous allez être redirigé vers la liste des majeures."
                    });

                    setTimeout(() => {
                        this.setState({ redirect: true });
                    }, 500);
                })
                .catch(err => {
                    this.setState({
                        error: true,
                        message: "Une erreur est survenue lors de la création de la majeure."
                    });
                    console.error(err);
                });;
        }
    }

    render() {
        const { classes } = this.props;
        let redirect;

        if (this.state.redirect) {
            redirect = <Redirect to="/specializations" />
        }
        return (
            <GridContainer>
                {redirect}
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
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Créer une majeure</h4>
                            <p className={classes.cardCategoryWhite}></p>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={4}>
                                    <FormControl className={classes.formControl} fullWidth={true}>
                                        <CustomInput
                                            labelText="Nom (fr)"
                                            id="nameFr"
                                            inputProps={{
                                                value: this.state.nameFr,
                                                onChange: this.handleChange
                                            }}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    <FormControl className={classes.formControl} fullWidth={true}>
                                        <CustomInput
                                            labelText="Nom (en)"
                                            id="nameEn"
                                            inputProps={{
                                                value: this.state.nameEn,
                                                onChange: this.handleChange
                                            }}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </FormControl>
                                </GridItem>
                            </GridContainer>

                            <GridContainer>
                                <GridItem xs={12} sm={12} md={4}>
                                    <FormControl className={classes.formControl} fullWidth={true}>
                                        <CustomInput
                                            labelText="Description (fr)"
                                            id="descriptionFr"
                                            inputProps={{
                                                value: this.state.descriptionFr,
                                                onChange: this.handleChange
                                            }}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    <FormControl className={classes.formControl} fullWidth={true}>
                                        <CustomInput
                                            labelText="Description (en)"
                                            id="descriptionEn"
                                            inputProps={{
                                                value: this.state.descriptionEn,
                                                onChange: this.handleChange
                                            }}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </FormControl>
                                </GridItem>
                            </GridContainer>

                            <GridContainer>
                                <GridItem xs={12} sm={12} md={8}>
                                    <FormControl className={classes.formControl} fullWidth={true}>
                                        <CustomInput
                                            labelText="Abbréviation"
                                            id="abbreviation"
                                            inputProps={{
                                                value: this.state.abbreviation,
                                                onChange: this.handleChange
                                            }}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </FormControl>
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                            <Button color="primary" onClick={this.createSpecialization}>Créer la majeure</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer >
        );
    }
}

export default withStyles(styles)(CreateSpecialization);
