import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import { Typography, Divider } from "@material-ui/core";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { api } from "config.json"
import AuthService from "components/AuthService"

import PRMItem from './PRMItem';

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
    },
    textField: {
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "10px",
        fontWeight: 300
    },
    title: {
        color: "#9c27b0",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "10px",
        fontWeight: 300
    }
};

class PRMList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingPrms: true,
            loadingKeywords: true,
            prms: [],
            keywords: []
        };
    }

    componentWillMount() {
        AuthService.fetch(api.host + ":" + api.port + "/api/prm")
            .then(res => res.json())
            .then(data => {
                this.setState({ prms: data, loadingPrms: false });
            });
        AuthService.fetch(api.host + ":" + api.port + "/api/keyword")
            .then(res => res.json())
            .then(data => {
                this.setState({
                    keywords: data
                        .sort((ka, kb) => ka.lcName > kb.lcName ? 1 : -1),
                    loadingKeywords: false
                });
            });
    }

    render() {
        const { classes } = this.props;

        if (this.state.loadingKeywords || this.state.loadingPrms) {
            return (<div></div>);
        } else {
            let data = this.state.prms.map((prm, i) => <PRMItem gray={i % 2 === 0} prm={prm} keywords={this.state.keywords} key={prm._id}></PRMItem>)
            return (
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Liste des PRMs</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Liste de tous les PRMs existants sur la plateforme
                                </p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer >
                                    <GridItem xs={2}>
                                        <Typography className={classes.title}>Nom</Typography>
                                    </GridItem>
                                    <GridItem xs={2}>
                                        <Typography className={classes.title}>Prénom</Typography>
                                    </GridItem>
                                    <GridItem xs={4}>
                                        <Typography className={classes.title}>Email</Typography>
                                    </GridItem>
                                    <GridItem xs={2}>
                                        <Typography className={classes.title}>Nombre de projets</Typography>
                                    </GridItem>
                                    <GridItem xs={2}></GridItem>
                                </GridContainer>
                                <Divider />
                                {data}
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            );
        }
    }
}

export default withStyles(styles)(PRMList);
