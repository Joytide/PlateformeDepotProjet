import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from "@material-ui/core/Checkbox";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";


import avatar from "assets/img/faces/marc.jpg";

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

class SpecializationProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            specialization: {},
            loading: true,
            modificated: false,
            specialization_old: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.update = this.update.bind(this);
        this.cancel = this.cancel.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    loadData() {
        fetch(api.host + ":" + api.port + "/api/specialization/" + this.props.match.params.id)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    let spe = {
                        nameFr: data.name.fr,
                        nameEn: data.name.en,
                        abbreviation: data.abbreviation,
                        _id: data._id
                    }
                    this.setState({
                        specialization: spe,
                        specialization_old: spe,
                        loading: false
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

    cancel() {
        this.setState({
            modificated: false,
            specialization: this.state.specialization_old
        });
    }

    update() {
        let data = {
            _id: this.state.specialization._id,
            abbreviation: this.state.specialization.abbreviation,
            name: {
                fr: this.state.specialization.nameFr,
                en: this.state.specialization.nameEn
            }
        }

        fetch(api.host + ":" + api.port + "/api/specialization", {
            method: "POST",
            mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                let spe = {
                    nameFr: data.name.fr,
                    nameEn: data.name.en,
                    abbreviation: data.abbreviation
                }
                this.setState({
                    specialization: spe,
                    specialization_old: spe,
                    modificated: false
                });
            });
    }

    render() {
        const { classes } = this.props;
        const { specialization } = this.state;

        if (!this.state.loading) {
            return (
                <div>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card>
                                <CardHeader color="primary">
                                    <h4 className={classes.cardTitleWhite}>Profil de l'utilisateur</h4>
                                    <p className={classes.cardCategoryWhite}>Complete your profile</p>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <CustomInput
                                                labelText="Abbréviation"
                                                id="abbreviation"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: this.handleChange,
                                                    value: this.state.specialization.abbreviation
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={6}>
                                            <CustomInput
                                                labelText="Nom (fr)"
                                                id="nameFr"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: this.handleChange,
                                                    value: this.state.specialization.nameFr
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6}>
                                            <CustomInput
                                                labelText="Nom (en)"
                                                id="nameEn"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: this.handleChange,
                                                    value: this.state.specialization.nameEn
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
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
                    </GridContainer>
                </div>
            );
        }
        else {
            return <div></div>
        }
    }
}

export default withStyles(styles)(SpecializationProfile);
