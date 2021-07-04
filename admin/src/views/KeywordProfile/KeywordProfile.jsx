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
import { hasPermission } from "components/PermissionHandler";
import { withUser } from "../../providers/UserProvider/UserProvider";
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler";

import { KeywordProfile as Permissions } from "../../permissions"
import { api } from "config.json"

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

class KeywordProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: {},
            keyword_old: {},
            loading: true,
            modificated: false,
            canEditKeyword: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.update = this.update.bind(this);
        this.cancel = this.cancel.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    loadData() {
        AuthService.fetch(api.host + ":" + api.port + "/api/keyword/" + this.props.match.params.id)
            .then(res => {
                if (!res.ok)
                    throw res;
                return res.json();
            })
            .then(data => {
                if (data) {
                    let keyword = {
                        nameFr: data.name.fr,
                        nameEn: data.name.en,
                        abbreviation: data.abbreviation,
                        _id: data._id
                    }

                    this.setState({
                        keyword: keyword,
                        keyword_old: keyword,
                        loading: false
                    });
                }
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        const canEditKeyword = hasPermission(Permissions.EditKeyword, nextProps.user.user);

        if (canEditKeyword !== this.state.canEditKeyword)
            this.setState({
                canEditKeyword,
            }, this.loadData);
    }

    handleChange = event => {
        const value = event.target.value;
        const id = event.target.id;
        this.setState(prevState => ({
            modificated: true,
            keyword: {
                ...prevState.keyword,
                [id]: value
            }
        }));
    }

    cancel() {
        this.setState({
            modificated: false,
            keyword: this.state.keyword_old
        });
    }

    update() {
        let data = {
            id: this.state.keyword._id,
            nameFr: this.state.keyword.nameFr,
            nameEn: this.state.keyword.nameEn,
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/keyword", {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (!res.ok)
                    throw res;
                else {
                    this.props.snackbar.success("Modifications enregistrées avec succès");
                    this.setState({
                        keyword_old: this.state.keyword,
                        loading: false,
                        modificated: false
                    });
                }
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    render() {
        const { classes } = this.props;

        let profile;
        if (!this.state.loading) {
            profile = (
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Année</h4>
                                <p className={classes.cardCategoryWhite}>Informations sur l'année</p>
                            </CardHeader>
                            <CardBody>

                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Nom (fr)"
                                            id="nameFr"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                disabled: !this.state.canEditKeyword,
                                                onChange: this.handleChange,
                                                value: this.state.keyword.nameFr
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
                                                disabled: !this.state.canEditKeyword,
                                                onChange: this.handleChange,
                                                value: this.state.keyword.nameEn
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            {
                                this.state.canEditKeyword &&
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
            );
        }
        return (
            <div>
                {profile}
            </div>
        );
    }
}

export default withUser(withSnackbar(withStyles(styles)(KeywordProfile)));
