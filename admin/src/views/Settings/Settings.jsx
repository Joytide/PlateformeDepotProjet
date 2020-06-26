import React from "react";
import ReactMarkdown from "react-markdown/with-html";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";

import ChangePassword from "../../components/ChangePassword/ChangePassword"
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import AuthService from "components/AuthService"
import { withUser } from "../../providers/UserProvider/UserProvider"
import { api } from "../../config"
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler";
import { hasPermission } from "components/PermissionHandler";
import { Settings as Permissions } from "../../permissions"

const styles = {
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
    }
};

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            platformOpen: true,
            description: "",
            description_old: "",
            homeTextEn: "",
            homeTextFr: "",
            canEditPlatform: hasPermission(Permissions.EditPlatform, props.user.user)
        };

        this.loadPlatformState = this.loadPlatformState.bind(this);
        this.changePlatformState = this.changePlatformState.bind(this);
        this.saveText = this.saveText.bind(this);
    }

    componentWillMount() {
        this.loadPlatformState();
        this.loadHomeText();
    }

    componentWillReceiveProps(nextProps) {
        const canEditPlatform = hasPermission(Permissions.EditPlatform, nextProps.user.user);

        if (canEditPlatform !== this.state.canEditPlatform)
            this.setState({
                canEditPlatform
            });
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    loadPlatformState() {
        AuthService.fetch(api.host + ":" + api.port + "/api/open")
            .then(res => {
                if (res.ok)
                    return res.json();
                else
                    throw res;
            })
            .then(data => {
                this.setState({ platformOpen: data.open, description: data.description || "", description_old: data.description || "" });
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    changePlatformState = open => () => {
        let data = { open };
        AuthService.fetch(api.host + ":" + api.port + "/api/open", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok)
                    this.setState({ platformOpen: open })
                else
                    throw res;
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    saveText = () => {
        let data = { description: this.state.description_old };
        console.log("data : ", data)
        AuthService.fetch(api.host + ":" + api.port + "/api/open", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => {
                if (res.ok)
                    this.setState({ description: this.state.description_old })
                else
                    throw res;
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    cancelChanges = () => {
        this.setState({ description_old: this.state.description });
    }

    loadHomeText = () => {
        AuthService.fetch(api.host + ":" + api.port + "/api/settings/home")
            .then(res => {
                if (res.ok)
                    return res.json();
                else
                    throw res;
            })
            .then(data => {
                this.setState({
                    homeTextEn: data.homeTextEn,
                    homeTextFr: data.homeTextFr
                });
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    saveHomeText = () => {
        let data = {
            homeTextFr: this.state.homeTextFr,
            homeTextEn: this.state.homeTextEn
        };
        
        AuthService.fetch(api.host + ":" + api.port + "/api/settings/home", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => {
                if (res.ok)
                    this.props.snackbar.success("Modification(s) enregistrée(s) avec succès")
                else
                    throw res;
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    cancelHomeText = () => {
        this.loadHomeText();
    }

    render() {
        const { classes } = this.props;

        return (
            <GridContainer>
                <GridItem xs={12}>
                    <ChangePassword user={this.props.user.user}></ChangePassword>
                </GridItem>
                {this.state.canEditPlatform &&
                    <GridItem xs={12}>
                        <GridContainer>

                            <GridItem xs={12}>
                                <Card>
                                    <CardHeader color="primary">
                                        <h4 className={classes.cardTitleWhite}>Ouverture de la plateforme</h4>
                                    </CardHeader>
                                    <CardBody>

                                    </CardBody>
                                    <CardFooter>
                                        <GridContainer >
                                            <GridItem xs={12} sm={12} md={12}>
                                                <Typography>
                                                    La plateforme est actuellement {this.state.platformOpen ? "ouverte" : "fermée"}
                                                </Typography>
                                                <Button disabled={false} size="sm" color="success" onClick={this.changePlatformState(true)}>Ouvrir la plateforme</Button>
                                                <Button disabled={false} size="sm" color="danger" onClick={this.changePlatformState(false)}>Fermer la plateforme</Button>
                                            </GridItem>
                                            <GridItem xs={12} md={6}>
                                                <TextField
                                                    id="description_old"
                                                    label="Texte d'accueil lorsque la plateforme est fermée (rédaction en Markdown)"
                                                    fullWidth={true}
                                                    multiline={true}
                                                    value={this.state.description_old}
                                                    onChange={this.handleChange}
                                                />
                                            </GridItem>
                                            <GridItem xs={12} md={6}>
                                                <ReactMarkdown source={this.state.description_old} />
                                            </GridItem>
                                            <Button disabled={false} size="sm" color="success" onClick={this.saveText}>Sauvegarder les changements</Button>
                                            <Button disabled={false} size="sm" color="warning" onClick={this.cancelChanges}>Annuler les changements</Button>
                                        </GridContainer>
                                    </CardFooter>
                                </Card>
                            </GridItem>
                            <GridItem xs={12}>
                                <Card>
                                    <CardHeader color="primary">
                                        <h4 className={classes.cardTitleWhite}>Texte de la page d'accueil</h4>
                                    </CardHeader>
                                    <CardBody>

                                    </CardBody>
                                    <CardFooter>
                                        <GridContainer >
                                            <GridItem xs={12} md={6}>
                                                <TextField
                                                    id="homeTextFr"
                                                    label="Texte de la page d'accueil française (rédaction en Markdown)"
                                                    fullWidth={true}
                                                    multiline={true}
                                                    value={this.state.homeTextFr}
                                                    onChange={this.handleChange}
                                                />
                                            </GridItem>
                                            <GridItem xs={12} md={6}>
                                                <ReactMarkdown source={this.state.homeTextFr}  escapeHtml={false}/>
                                            </GridItem>
                                            <GridItem xs={12} md={6}>
                                                <TextField
                                                    id="homeTextEn"
                                                    label="Texte de la page d'accueil anglaise (rédaction en Markdown)"
                                                    fullWidth={true}
                                                    multiline={true}
                                                    value={this.state.homeTextEn}
                                                    onChange={this.handleChange}
                                                />
                                            </GridItem>
                                            <GridItem xs={12} md={6}>
                                                <ReactMarkdown source={this.state.homeTextEn} escapeHtml={false} />
                                            </GridItem>
                                            <Button disabled={false} size="sm" color="success" onClick={this.saveHomeText}>Sauvegarder les changements</Button>
                                            <Button disabled={false} size="sm" color="warning" onClick={this.cancelHomeText}>Annuler les changements</Button>
                                        </GridContainer>
                                    </CardFooter>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                }
            </GridContainer>
        );
    }
}

export default withUser(withSnackbar(withStyles(styles)(Settings)));
