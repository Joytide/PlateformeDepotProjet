import React from "react";
import { Link } from 'react-router-dom';

// @material-ui/core components
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

import AuthService from "components/AuthService";
import { hasPermission } from "components/PermissionHandler";
import { withUser } from "../../providers/UserProvider/UserProvider";
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler"

import { api } from "../../config"
import { SpecializationProfile as Permissions } from "../../permissions"

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
            specialization: {
                name: { fr: "", en: "" },
                description: { fr: "", en: "" }
            },
            loadingProfile: true,
            loadingReferent: true,
            modificated: false,
            specialization_old: {},
            administration: [],
            selected: null,
            canEdit: false,
            canManageReferents: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.update = this.update.bind(this);
        this.cancel = this.cancel.bind(this);
        this.loadData = this.loadData.bind(this);
        this.addReferent = this.addReferent.bind(this);
    }

    componentDidMount() {
        this.setPermissions();
    }

    componentWillReceiveProps(nextProps) {
        this.setPermissions(nextProps);
    }

    setPermissions(nextProps) {
        let user = this.props.user.user;
        if (nextProps) user = nextProps.user.user;

        const canEdit = hasPermission(Permissions.EditSpecialization, user);
        const canManageReferents = hasPermission(Permissions.ManageReferents, user);

        if (canEdit !== this.state.canEdit || canManageReferents !== this.state.canManageReferents)
            this.setState({
                canEdit,
                canManageReferents
            }, this.loadData);
    }

    loadData() {
        AuthService.fetch(api.host + ":" + api.port + "/api/specialization/" + this.props.match.params.id)
            .then(res => {
                if (!res.ok)
                    throw res;
                return res.json();
            })
            .then(data => {
                this.setState({
                    specialization: data,
                    specialization_old: data,
                    loadingProfile: false
                });
            })
            .catch(handleXhrError(this.props.snackbar));

        if (this.state.canManageReferents) {
            AuthService.fetch(api.host + ":" + api.port + "/api/user/administration")
                .then(res => {
                    if (!res.ok)
                        throw res;
                    return res.json();
                })
                .then(data => {
                    if (data) {
                        this.setState({
                            administration: data,
                            loadingReferent: false
                        });
                    }
                })
                .catch(handleXhrError(this.props.snackbar));
        }
    }

    handleChange = event => {
        const value = event.target.value;
        const id = event.target.id;

        if (id.includes('.')) {
            let ref = id.split('.');

            this.setState(prevState => ({
                modificated: true,
                specialization: {
                    ...prevState.specialization,
                    [ref[0]]: {
                        ...prevState.specialization[ref[0]],
                        [ref[1]]: value
                    }
                }
            }));
        } else {
            this.setState(prevState => ({
                modificated: true,
                specialization: {
                    ...prevState.specialization,
                    [id]: value
                }
            }));
        }
    }

    cancel() {
        this.setState({
            modificated: false,
            specialization: this.state.specialization_old
        });
    }

    update() {
        let data = {
            id: this.state.specialization._id,
            abbreviation: this.state.specialization.abbreviation,
            nameFr: this.state.specialization.name.fr,
            nameEn: this.state.specialization.name.en,
            descriptionFr: this.state.specialization.description.fr,
            descriptionEn: this.state.specialization.description.en
        }

        AuthService.fetch(api.host + ":" + api.port + "/api/specialization", {
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
                    this.setState({
                        specialization_old: this.state.specialization,
                        modificated: false
                    });
                    this.props.snackbar.success("Modification enregistrée.");
                }
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    addReferent() {
        if (this.state.selectedItem) {
            const data = {
                specializationId: this.props.match.params.id,
                referentId: this.state.selectedItem.value
            };

            AuthService.fetch(api.host + ":" + api.port + "/api/specialization/referent", {
                mode: "cors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok)
                        throw res;
                    return res.json();
                })
                .then(data => {
                    this.loadData();
                    this.setState({ selectedItem: "" });
                })
                .catch(handleXhrError(this.props.snackbar));
        }
        else {
            console.error("No selected item");
        }
    }

    removeReferent = id => event => {
        const data = {
            specializationId: this.props.match.params.id,
            referentId: id
        }

        AuthService.fetch(api.host + ":" + api.port + "/api/specialization/referent", {
            mode: "cors",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (!res.ok)
                    throw res;
                else
                    this.loadData();
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    render() {
        const { classes } = this.props;

        let profile;
        let referent;
        let suggestions;
        if (!this.state.loadingProfile) {
            profile = (
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Majeure</h4>
                                <p className={classes.cardCategoryWhite}>Informations sur la majeure</p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <CustomInput
                                            labelText="Abréviation"
                                            id="abbreviation"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                disabled: !this.state.canEdit,
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
                                            id="name.fr"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                disabled: !this.state.canEdit,
                                                onChange: this.handleChange,
                                                value: this.state.specialization.name.fr
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Nom (en)"
                                            id="name.en"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                disabled: !this.state.canEdit,
                                                onChange: this.handleChange,
                                                value: this.state.specialization.name.en
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>

                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Description (fr)"
                                            id="description.fr"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                disabled: !this.state.canEdit,
                                                onChange: this.handleChange,
                                                value: this.state.specialization.description.fr
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Description (en)"
                                            id="description.en"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                disabled: !this.state.canEdit,
                                                onChange: this.handleChange,
                                                value: this.state.specialization.description.en
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            {
                                this.state.canEdit &&
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
        if (!this.state.loadingReferent && !this.state.loadingProfile) {
            suggestions = this.state.administration.map(admin => ({
                label: admin.last_name + " " + admin.first_name,
                value: admin._id
            }));

            referent = (
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Référents</h4>
                                <p className={classes.cardCategoryWhite}>Personnes en charge de la majeure</p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={["Nom", "Prénom", "Email", "Actions"]}
                                            tableData={
                                                this.state.specialization.referent.map(ref =>
                                                    [
                                                        ref.last_name,
                                                        ref.first_name,
                                                        ref.email,
                                                        (<div>
                                                            <Link to={"/user/" + ref._id}>
                                                                <Button type="button" color="info"><Visibility /> Voir le profil</Button>
                                                            </Link>
                                                            <Button onClick={this.removeReferent(ref._id)} type="button" color="danger"><Delete />Supprimer</Button>
                                                        </div>)
                                                    ]
                                                )
                                            }
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter></CardFooter>
                        </Card>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Ajouter un référent</h4>
                                <p className={classes.cardCategoryWhite}>Personnes en charge de la majeure</p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <AutoComplete
                                            data={suggestions}
                                            label="Listes des référents"
                                            selected={this.state.selectedItem}
                                            select={item => this.setState({ selectedItem: item })}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <Button color="success" onClick={this.addReferent}>Ajouter le référent</Button>
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter>
                            </CardFooter>
                        </Card>
                    </GridItem>
                </GridContainer>
            );
        }
        return (
            <div>
                {profile}
                {this.state.canManageReferents && referent}
            </div>
        );
    }
}

export default withUser(withSnackbar(withStyles(styles)(SpecializationProfile)));
