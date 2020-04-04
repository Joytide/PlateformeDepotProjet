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

import AuthService from "../../components/AuthService";
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler"
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

class CreateYear extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            labelWidth: 0,
            nameEn: "",
            nameFr: "",
            abbreviation: "",
            redirect: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.createYear = this.createYear.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    };

    handleCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    createYear() {
        this.setState({ error: false, success: false });
        if (this.state.nameFr === "")
            this.props.snackbar.error("Veuillez remplir le champ nom en français.");

        else if (this.state.nameEn === "")
            this.props.snackbar.error("Veuillez remplir le champ nom en anglais.");

        else if (this.state.abbreviation === "")
            this.props.snackbar.error("Veuillez remplir le champ Abbréviation.");

        else {
            let data = {
                nameFr: this.state.nameFr,
                nameEn: this.state.nameEn,
                abbreviation: this.state.abbreviation
            };

            AuthService.fetch(api.host + ":" + api.port + "/api/year", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok)
                        throw res;
                    else {
                        this.props.snackbar.success("Année créée avec succès. Vous allez être redirigé vers la liste des années.");

                        setTimeout(() => {
                            this.setState({ redirect: true });
                        }, 2500);
                    }
                })
                .catch(handleXhrError(this.props.snackbar));
        }
    }

    render() {
        const { classes } = this.props;

        if (this.state.redirect) 
            return <Redirect to="/years" />
        
        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Créer une année</h4>
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
                            <Button color="primary" onClick={this.createYear}>Créer l'année</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer >
        );
    }
}

export default withSnackbar(withStyles(styles)(CreateYear));
