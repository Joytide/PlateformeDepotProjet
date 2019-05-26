import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";

import AuthService from "components/AuthService";
import { api } from "../../config";
import { UserContext } from "../../providers/UserProvider/UserProvider";

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

class YearProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            year: {},
            year_old: {},
            loading: true,
            modificated: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.update = this.update.bind(this);
        this.cancel = this.cancel.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    loadData() {
        fetch(api.host + ":" + api.port + "/api/year/" + this.props.match.params.id)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    let year = {
                        nameFr: data.name.fr,
                        nameEn: data.name.en,
                        abbreviation: data.abbreviation,
                        _id: data._id
                    }

                    this.setState({
                        year: year,
                        year_old: year,
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
            year: {
                ...prevState.year,
                [id]: value
            }
        }));
    }

    cancel() {
        this.setState({
            modificated: false,
            year: this.state.year_old
        });
    }

    update() {
        let data = {
            _id: this.state.year._id,
            nameFr: this.state.year.nameFr,
            nameEn: this.state.year.nameEn,
            abbreviation: this.state.year.abbreviation,
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/year", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                let year = {
                    nameFr: res.name.fr,
                    nameEn: res.name.en,
                    abbreviation: res.abbreviation,
                    _id: res._id
                }

                this.setState({
                    year: year,
                    year_old: year,
                    loading: false,
                    modificated: false
                });
            });
    }

    render() {
        const { classes } = this.props;

        let profile;
        if (!this.state.loading) {
            profile = (
                <UserContext.Consumer>
                    {value =>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <Card>
                                    <CardHeader color="primary">
                                        <h4 className={classes.cardTitleWhite}>Année</h4>
                                        <p className={classes.cardCategoryWhite}>Informations sur l'année</p>
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
                                                        disabled: !value.user.admin,
                                                        onChange: this.handleChange,
                                                        value: this.state.year.abbreviation
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
                                                        disabled: !value.user.admin,
                                                        onChange: this.handleChange,
                                                        value: this.state.year.nameFr
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
                                                        disabled: !value.user.admin,
                                                        onChange: this.handleChange,
                                                        value: this.state.year.nameEn
                                                    }}
                                                />
                                            </GridItem>
                                        </GridContainer>
                                    </CardBody>
                                    {
                                        value.user.admin &&
                                        <CardFooter>
                                            <GridContainer >
                                                <GridItem xs={12} sm={12} md={12}>
                                                    <Button disabled={!this.state.modificated} color="success" onClick={this.update}>Sauvegarder</Button>
                                                    <Button disabled={!this.state.modificated} color="danger" onClick={this.cancel}>Annuler</Button>
                                                </GridItem>
                                            </GridContainer>
                                        </CardFooter>
                                    }
                                </Card>
                            </GridItem>
                        </GridContainer>
                    }
                </UserContext.Consumer>);
        }
        return (
            <div>
                {profile}
            </div>
        );
    }
}

export default withStyles(styles)(YearProfile);
