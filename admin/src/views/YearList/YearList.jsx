import React from "react";
import { Link } from 'react-router-dom';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";

import Visibility from "@material-ui/icons/Visibility"

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

class YearList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            years: []
        };
    }

    componentWillMount() {
        fetch(api.host + ":" + api.port + "/api/year", { crossDomain: true })
            .then(res => res.json())
            .then(data => {
                let yearData = data.map(year => [
                    year.abbreviation,
                    year.name.fr, 
                    year.name.en, 
                    (<Link to={"/year/" + year._id}><Button size="sm" type="button" color="info"><Visibility /> Voir l'année</Button></Link>)
                ]);

                this.setState({ years: yearData, loading: false });
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
                                <h4 className={classes.cardTitleWhite}>Liste des années</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Liste de toutes les années existantes sur la plateforme
            </p>
                            </CardHeader>
                            <CardBody>
                                <Table
                                    tableHeaderColor="primary"
                                    tableHead={["Abbréviation", "Nom (fr)", "Nom (en)", "Actions"]}
                                    tableData={this.state.years}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            );
        }
    }
}

export default withStyles(styles)(YearList);
