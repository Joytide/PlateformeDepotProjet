import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import { api } from "config.json"

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

class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            users: []
        };
    }

    componentWillMount() {
        console.log(api);
        fetch(api.host + ":" + api.port + "/api/user", { crossDomain: true })
            .then(res => res.json())
            .then(data => {
                let userData = data.map(user => [user.EPGE ? "EPGE" : user.__t, user.company || "-", user.last_name, user.first_name, user.email]);

                this.setState({ users: userData, loading: false });
            });
    }

    render() {
        const { classes } = this.props;

        if (this.state.loading) {
            return (<div></div>);
        } else {
            return (
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Liste des utilisateurs</h4>
                                <p className={classes.cardCategoryWhite}>
                                Liste de tous les utilisateurs existants sur la plateforme
            </p>
                            </CardHeader>
                            <CardBody>
                                <Table
                                    tableHeaderColor="primary"
                                    tableHead={["Type", "Entreprise", "Nom", "Prénom", "Email", "Actions"]}
                                    tableData={this.state.users}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            );
        }
    }
}

export default withStyles(styles)(UserList);
