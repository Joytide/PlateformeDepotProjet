import React from "react";
import { Link } from 'react-router-dom';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import Visibility from "@material-ui/icons/Visibility"

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import Button from "components/CustomButtons/Button.jsx";

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

class SpecializationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            specializations: []
        };
    }

    componentWillMount() {
        fetch(api.host + ":" + api.port + "/api/specialization", { crossDomain: true })
            .then(res => res.json())
            .then(data => {
                let specializationsData = data.map(specialization => [
                    specialization.abbreviation, 
                    specialization.name.fr, 
                    specialization.name.en, 
                    (<Link to={"/specialization/" + specialization._id}><Button size="sm" type="button" color="info"><Visibility /> Voir la majeure</Button></Link>)
                ]);

                this.setState({ specializations: specializationsData, loading: false });
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
                                <h4 className={classes.cardTitleWhite}>Liste des majeures</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Liste de toutes les majeures existantes sur la plateforme
            </p>
                            </CardHeader>
                            <CardBody>
                                <Table
                                    tableHeaderColor="primary"
                                    tableHead={["Abbréviation", "Nom (fr)", "Nom (en)", "Actions"]}
                                    tableData={this.state.specializations}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            );
        }
    }
}

export default withStyles(styles)(SpecializationList);