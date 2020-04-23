import React from "react";
import { Link } from 'react-router-dom';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import Visibility from "@material-ui/icons/Visibility"
import Delete from "@material-ui/icons/Delete"

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Modal from "components/Modal/Modal.jsx";
import Button from "components/CustomButtons/Button.jsx";

import AuthService from "../../components/AuthService";
import { hasPermission } from "components/PermissionHandler";
import { withUser } from "../../providers/UserProvider/UserProvider"
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler"

import { YearList as Permissions } from "../../permissions"
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
            years: [],
            open: false,
            _id: "",
            canDeleteYear: hasPermission(Permissions.DeleteYear, props.user.user)
        };
    }

    componentWillMount() {
        this.loadData()
    }

    componentWillReceiveProps(nextProps) {
        const canDeleteYear = hasPermission(Permissions.DeleteYear, nextProps.user.user);

        if (canDeleteYear !== this.state.canDeleteYear)
            this.setState({
                canDeleteYear,
            }, this.loadData);
    }

    loadData = () => {
        fetch(api.host + ":" + api.port + "/api/year", { crossDomain: true })
            .then(res => {
                if (!res.ok)
                    throw res;
                return res.json();
            })
            .then(data => {
                let yearData = data.map(year => [
                    year.abbreviation,
                    year.name.fr,
                    year.name.en,
                    (
                        <div>
                            <Link to={"/year/" + year._id}>
                                <Button size="sm" type="button" color="info">
                                    <Visibility /> Voir l'année
                                </Button>
                            </Link>
                            {this.state.canDeleteYear &&
                                <Button size="sm" type="button" color="danger" onClick={this.showModal(year._id)}>
                                    <Delete /> Supprimer l'année
                                </Button>
                            }
                        </div>)
                ])

                this.setState({ years: yearData, loading: false });
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    showModal = _id => () => {
        this.setState({ open: true, _id });
    }

    closeModal = () => {
        this.setState({ open: false, _id: "" });
    }

    deleteYear = () => {
        const data = {
            id: this.state._id
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/year",
            {
                method: "DELETE",
                body: JSON.stringify(data)
            })
            .then(res => {
                if (!res.ok)
                    throw res;
                return res.json();
            })
            .then(data => {
                this.closeModal();
                this.loadData();
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Modal
                    open={this.state.open}
                    closeModal={this.closeModal}
                    title="Supprimer cette année ?"
                    content={(<div>Etes vous sûr de vouloir supprimer cette année ?
                        <br />
                            Toute suppression est définitive et aucun retour en arrière n'est possible.
                    </div>)}
                    buttonColor="danger"
                    buttonContent="Supprimer"
                    validation={this.deleteYear}
                />
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
                                    tableHead={["Abréviation", "Nom (fr)", "Nom (en)", "Actions"]}
                                    tableData={this.state.loading ? [] : this.state.years}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withSnackbar(withUser(withStyles(styles)(YearList)));
