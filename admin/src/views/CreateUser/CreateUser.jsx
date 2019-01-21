import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from "@material-ui/core/Checkbox";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

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

class CreateUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: "",
            labelWidth: 0,
            admin: false,
            lastName: "",
            firstName: "",
            email: "",
            company: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    createUser() {
        let data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            admin: this.state.admin,
            email: this.state.email,
            company: this.state.company,
            type: this.state.type
        }

        fetch(api.host + ":" + api.port + "/api/user", {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
    }

    render() {
        const { classes } = this.props;
        let companyField;
        let adminCheckbox;
        if (this.state.type === "partner") {
            companyField = (
                <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                        <FormControl className={classes.formControl} fullWidth={true}>
                            <CustomInput
                                labelText="Entreprise"
                                inputProps={{
                                    value: this.state.company,
                                    onChange: this.handleChange,
                                    name: "company"
                                }}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </FormControl>
                    </GridItem>
                </GridContainer>);
        }

        if (this.state.type === "EPGE" || this.state.type === "administration") {
            adminCheckbox = (
                <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                        <FormControl className={classes.formControl} >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.admin}
                                        onChange={this.handleCheckboxChange('admin')}
                                        value="admin"
                                        color="primary"
                                    />
                                }
                                label="Administrateur"
                            />
                        </FormControl>
                    </GridItem>
                </GridContainer >
            );
        }
        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Créer un utilisateur</h4>
                            <p className={classes.cardCategoryWhite}>Complete your profile</p>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={3}>
                                    <FormControl className={classes.formControl} >
                                        <InputLabel htmlFor="type">Type</InputLabel>
                                        <Select
                                            value={this.state.type}
                                            onChange={this.handleChange}
                                            inputProps={{
                                                name: 'type',
                                                id: 'type',
                                            }}
                                        >
                                            <MenuItem value=""><em></em></MenuItem>
                                            <MenuItem value="student">Elève</MenuItem>
                                            <MenuItem value="partner">Partenaire</MenuItem>
                                            <MenuItem value="administration">Administration</MenuItem>
                                            <MenuItem value="EPGE">EPGE</MenuItem>
                                        </Select>
                                    </FormControl>
                                </GridItem>
                            </GridContainer>

                            {companyField}

                            <GridContainer>
                                <GridItem xs={12} sm={12} md={4}>
                                    <FormControl className={classes.formControl} fullWidth={true}>
                                        <CustomInput
                                            labelText="Nom"
                                            inputProps={{
                                                value: this.state.lastName,
                                                onChange: this.handleChange,
                                                name: "lastName"
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
                                            labelText="Prénom"
                                            inputProps={{
                                                value: this.state.firstName,
                                                onChange: this.handleChange,
                                                name: "firstName"
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
                                            labelText="Adresse mail"
                                            inputProps={{
                                                value: this.state.email,
                                                onChange: this.handleChange,
                                                name: "email"
                                            }}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </FormControl>
                                </GridItem>
                            </GridContainer>

                            {adminCheckbox}
                        </CardBody>
                        <CardFooter>
                            <Button color="primary" onClick={this.createUser}>Créer l'utilisateur</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer >
        );
    }
}

export default withStyles(styles)(CreateUser);
