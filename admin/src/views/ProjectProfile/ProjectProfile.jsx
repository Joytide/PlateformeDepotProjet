import React from "react";
import { Link } from 'react-router-dom';

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Visibility from "@material-ui/icons/Visibility"
import Delete from "@material-ui/icons/Delete"

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import AutoComplete from "components/AutoComplete/AutoComplete.jsx"
import Button from "components/CustomButtons/Button.jsx";

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
    }
};

class ProjectProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingProject: true,
            project: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    loadData() {
        fetch(api.host + ":" + api.port + "/api/project/" + this.props.match.params.id)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    this.setState({
                        project: data,
                        loadingProject: false
                    });
                }
            });
    }

    componentDidMount() {
        this.loadData();
    }

    handleChange = event => {
        const value = event.target.value;
        const id = event.target.id;
        this.setState(prevState => ({
            modificated: true,
            specialization: {
                ...prevState.specialization,
                [id]: value
            }
        }));
    }

    render() {
        const { classes } = this.props;
        const { specialization } = this.state;

        let partnerInfo;
        let projectInfo;
        if (!this.state.loadingProject) {
            partnerInfo = (
                <Card>
                    <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>Information partenaire</h4>
                        <p className={classes.cardCategoryWhite}>Informations disponibles sur le partenaire</p>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography variant="body2" gutterBottom>
                                    Entreprise :
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {this.state.project.partner.company}
                                </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography variant="body2" gutterBottom>
                                    Mail :
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <a href={"mailto:" + this.state.project.partner.email}>{this.state.project.partner.email}</a>
                                </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography variant="body2" gutterBottom>
                                    Nom :
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {this.state.project.partner.last_name}
                                </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Typography variant="body2" gutterBottom>
                                    Prénom :
                        </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {this.state.project.partner.first_name}
                                </Typography>
                            </GridItem>
                        </GridContainer>
                    </CardBody>
                    <CardFooter>
                        <GridContainer >
                            <GridItem xs={12} sm={12} md={12}>
                                <Link to={"/user/" + this.state.project.partner._id}>
                                    <Button size="sm" color="primary"><Visibility />Profil du partenaire</Button>
                                </Link>
                            </GridItem>
                        </GridContainer>
                    </CardFooter>
                </Card>
            );

            projectInfo = (
                <Card>
                    <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>Information projet</h4>
                        <p className={classes.cardCategoryWhite}>Informations sur le projet proposé par le partenaire</p>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12}>
                                <Typography variant="display1" align="center">
                                    {this.state.project.title}
                                </Typography>
                            </GridItem>
                        </GridContainer>
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </Card>
            );
        }

        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    {partnerInfo}

                    {projectInfo}
                    <Card>
                        <CardFooter>
                            <GridContainer >
                                <GridItem xs={12} sm={12} md={12}>
                                    <Button disabled={!this.state.modificated} color="success" onClick={this.update}>Sauvegarder</Button>
                                    <Button disabled={!this.state.modificated} color="danger" onClick={this.cancel}>Annuler</Button>
                                </GridItem>
                            </GridContainer>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer >);

    }
}

export default withStyles(styles)(ProjectProfile);
