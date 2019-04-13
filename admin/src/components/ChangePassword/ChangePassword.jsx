import React from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { sha256 } from 'js-sha256';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from "@material-ui/core/Checkbox";


// @material-ui/icons components
import Visibility from "@material-ui/icons/Visibility"
import Delete from "@material-ui/icons/Delete"

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

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

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newPassword: "",
            newPassword_2: ""
        }

        this.changePassword = this.changePassword.bind(this);
    }

    changePassword = () => {
        if (this.state.newPassword !== this.state.newPassword_2) {
            if (this.props.errorHandler) this.props.errorHandler('Les deux mots de passes doivent être identiques.');
        }
        else if (!isValidPassword(this.state.newPassword)) {
            if (this.props.errorHandler) this.props.errorHandler('Le mot de passe doit à minima être de 8 caractères et comporter une majuscule, une minuscule et un chiffre ou un charactère spécial.');
        }
        else {
            const data = {
                userID: this.props.user._id,
                newPassword: sha256(this.props.user.email + this.state.newPassword)
            }

            AuthService.fetch(api.host + ":" + api.port + "/api/user/password", {
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
                    if (data.name === "PasswordChanged") {
                        if (this.props.successHandler) this.props.successHandler("Mot de passe mis à jour avec succès.");

                        this.setState({
                            newPassword: "",
                            newPassword_2: ""
                        });
                    }
                })
                .catch(err => {
                    err.json().then(errMsg => {
                        if (errMsg.name === "EmailUsed") {
                            this.setState({
                                error: true,
                                message: "Cette adresse mail est déjà associée à autre un utilisateur."
                            });
                        } else {
                            console.error(errMsg);
                            this.setState({
                                error: true,
                                message: "Une erreur est survenue lors de la création de l'utilisateur."
                            });
                        }
                    })
                });
        }
    }

    handleChange = e => {
        const value = e.target.value;
        const id = e.target.id;
        this.setState({
            modified: true,
            [id]: value
        });
    }

    render() {
        const { classes } = this.props;

        if (this.props.user.__t !== "Partner") {
            return (
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Changer de mot de passe</h4>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Nouveau mot de passe"
                                            id="newPassword"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: "password",
                                                value: this.state.newPassword,
                                                onChange: this.handleChange
                                            }}
                                        />
                                    </GridItem>

                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Nouveau mot de passe (confirmation)"
                                            id="newPassword_2"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: "password",
                                                value: this.state.newPassword_2,
                                                onChange: this.handleChange
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter>
                                <GridContainer >
                                    <GridItem xs={12} sm={12} md={12}>
                                        <Button disabled={false} color="primary" onClick={this.changePassword}>Changer de mot de passe</Button>
                                    </GridItem>
                                </GridContainer>
                            </CardFooter>
                        </Card>
                    </GridItem>
                </GridContainer>
            )
        } else {
            return (<div></div>);
        }
    }
}

CustomInput.propTypes = {
    user: PropTypes.object,
    errorHandler: PropTypes.func,
    successHandler: PropTypes.func
};

export default withStyles(styles)(ChangePassword);

function isValidPassword(password) {
    if (password.length < 8) return false;

    let containsLowerCase, containsUpperCase, containsNumber, containsSpecialChar;
    containsLowerCase = containsUpperCase = containsNumber = containsSpecialChar = false;

    for (let i = 0; i < password.length; i++) {
        if (password[i] >= 'A' && password[i] <= 'Z') containsUpperCase = true;
        else if (password[i] >= 'a' && password[i] <= 'z') containsLowerCase = true;
        else if (password[i] >= '0' && password[i] <= '9') containsNumber = true;
        else containsSpecialChar = true;
    }

    return containsLowerCase && containsUpperCase && (containsNumber || containsSpecialChar);
}