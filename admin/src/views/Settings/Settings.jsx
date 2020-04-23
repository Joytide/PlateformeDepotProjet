import React from "react";
import ReactMarkdown from "react-markdown";
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
import { api } from "../../config"
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { UserContext } from "../../providers/UserProvider/UserProvider";
import { handleXhrError } from "../../components/ErrorHandler";

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
        };

        this.loadPlatformState = this.loadPlatformState.bind(this);
        this.changePlatformState = this.changePlatformState.bind(this);
        this.saveText = this.saveText.bind(this);
    }
    componentWillMount() {
        this.loadPlatformState();
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
            .catch(handleXhrError(this.props.snackbar));;
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

    render() {
        const { classes } = this.props;
        console.log(this.state);
        return (
            <GridContainer>
                <GridItem xs={12}>
                    <UserContext.Consumer>
                        {value => <ChangePassword user={value.user}></ChangePassword>}
                    </UserContext.Consumer>
                </GridItem>
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
            </GridContainer>
        );
    }
}

export default withSnackbar(withStyles(styles)(Settings));
