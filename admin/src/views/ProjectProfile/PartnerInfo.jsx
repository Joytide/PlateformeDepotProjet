import React from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import Visibility from "@material-ui/icons/Visibility"

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";

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

class PartnerInfo extends React.Component {
    render() {
        const { classes, color, partner } = this.props;
        return (
            <Card>
                <CardHeader color={color}>
                    <h4 className={classes.cardTitleWhite}>Information partenaire</h4>
                    <p className={classes.cardCategoryWhite}>Informations disponibles sur le partenaire</p>
                </CardHeader>
                <CardBody>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <Typography variant="body2" gutterBottom>
                                Entreprise :
                                </Typography>
                            <Typography gutterBottom>
                                {partner.company}
                            </Typography>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <Typography variant="body2" gutterBottom>
                                Mail :
                                </Typography>
                            <Typography gutterBottom>
                                <a href={"mailto:" + partner.email}>{partner.email}</a>
                            </Typography>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <Typography variant="body2" gutterBottom>
                                Nom :
                                </Typography>
                            <Typography gutterBottom>
                                {partner.last_name}
                            </Typography>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <Typography variant="body2" gutterBottom>
                                Prénom :
                        </Typography>
                            <Typography gutterBottom>
                                {partner.first_name}
                            </Typography>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <Typography variant="body2" gutterBottom>
                                Téléphone :
                        </Typography>
                            <Typography gutterBottom>
                                {partner.phone ? <a href={"tel:" + partner.phone}>{partner.phone}</a> : "N/A"}
                            </Typography>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <Typography variant="body2" gutterBottom>
                                Adresse :
                        </Typography>
                            <Typography gutterBottom>
                                {partner.address || "N/A"}
                            </Typography>
                        </GridItem>
                    </GridContainer>
                </CardBody>
                <CardFooter>
                    <GridContainer >
                        <GridItem xs={12} sm={12} md={12}>
                            <Link to={"/user/" + partner._id}>
                                <Button size="sm" color="info"><Visibility />Profil du partenaire</Button>
                            </Link>
                        </GridItem>
                    </GridContainer>
                </CardFooter>
            </Card >
        );
    }
}

PartnerInfo.propTypes = {
    color: PropTypes.string.isRequired,
    partner: PropTypes.object.isRequired,
}

export default withStyles(styles)(PartnerInfo);
