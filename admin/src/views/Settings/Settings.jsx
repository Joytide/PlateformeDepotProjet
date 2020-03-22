import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ChangePassword from "../../components/ChangePassword/ChangePassword"
import { UserContext } from "../../providers/UserProvider/UserProvider"
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Typography from "@material-ui/core/Typography";
import GridContainer from "components/Grid/GridContainer.jsx";

import { api } from "config.json"
import AuthService from "../../components/AuthService";

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
            platformOpen: true
        };

        this.loadPlatformState = this.loadPlatformState.bind(this);
        this.changePlatformState = this.changePlatformState.bind(this);
    }
    componentWillMount() {
        this.loadPlatformState();
    }

    loadPlatformState() {
        AuthService.fetch(api.host + ":" + api.port + "/api/open")
            .then(res => res.json())
            .then(data => {
                this.setState({ platformOpen: data.open });
            });
    }

    changePlatformState = state => () => {
        let data = { newState: state };
        AuthService.fetch(api.host + ":" + api.port + "/api/open", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                this.loadPlatformState();
            });
    }

    render() {
        const { classes } = this.props;

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
                                    <Button disabled={false} color="success" onClick={this.changePlatformState("open")}>Ouvrir la plateforme</Button>
                                    <Button disabled={false} color="danger" onClick={this.changePlatformState("lock")}>Fermer la plateforme</Button>
                                </GridItem>
                            </GridContainer>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    }
}

export default withStyles(styles)(Settings);
