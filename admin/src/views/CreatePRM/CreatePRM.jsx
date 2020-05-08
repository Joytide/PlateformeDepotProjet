import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Table from "components/Table/Table.jsx";

import Button from "components/CustomButtons/Button.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import AuthService from "components/AuthService"

import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler";
import { api } from "config.json"

const styles = theme => ({
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
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    }
});

class CreatePRM extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            prmData: "",
            existingEmails: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.formatPRM = this.formatPRM.bind(this);
        this.createPrm = this.createPrm.bind(this);
        this.removeExisting = this.removeExisting.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value.trim() });
    };

    createPrm() {
        let data = { prms: this.formatPRM("request") };

        if (data !== []) {
            AuthService.fetch(api.host + ":" + api.port + "/api/prm", {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok)
                        throw res;
                    else {
                        this.props.snackbar.success("PRMs créés avec succès");
                        this.setState({ prmData: "", existingEmails: [] })
                    }
                })
                .catch(err => {
                    if (err.status === 500)
                        handleXhrError(this.props.snackbar)(err);
                    else
                        err.json().then(msg => {
                            console.log(err, msg);
                            this.props.snackbar.error("Certaines adresses mails ont déjà été utilisées. Cliquer sur le bouton pour les retirer");
                            this.setState({ existingEmails: msg.message })
                        })
                });
        }
    }

    removeExisting() {
        let data = this.formatPRM("request");

        console.log("data", data, "existing", this.state.existingEmails);
        let filtered = data.filter(e => this.state.existingEmails.indexOf(e.email) === -1);

        let newData = filtered.map(e => `${e.first_name}\t${e.last_name}\t${e.email}\t${e.projectNumber}\t${e.status}\t${e.infos}\t${e.characteristics}`).join('\n');

        this.setState({ prmData: newData });
    }

    formatPRM(type) {
        if (this.state.prmData) {
            let formatedData = [];
            let lines = this.state.prmData.split('\n');

            for (let i = 0; i < lines.length; i++) {
                let splittedData = lines[i].split('\t');

                if (type === "table") {
                    formatedData.push(splittedData);
                }
                else if (type === "request") {
                    let prm = {
                        first_name: splittedData[0],
                        last_name: splittedData[1],
                        email: splittedData[2],
                        projectNumber: splittedData[3],
                        status: splittedData[4],
                        infos: splittedData[5],
                        characteristics: splittedData[6],
                    }

                    formatedData.push(prm)
                }
            }

            return formatedData;
        } else return [];
    }

    render() {
        const { classes } = this.props;
        let formatedData = this.formatPRM("table");

        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Importer des PRM</h4>
                            <p className={classes.cardCategoryWhite}></p>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <TextField
                                        id="prmData"
                                        label="PRMs"
                                        multiline
                                        rows="25"
                                        className={classes.textField}
                                        margin="normal"
                                        fullWidth={true}
                                        onChange={this.handleChange}
                                        value={this.state.prmData}
                                    />
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                    </Card>
                </GridItem>
                {this.state.prmData !== "" &&
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Liste des PRM tels qu'ils vont être importés</h4>
                                <p className={classes.cardCategoryWhite}></p>
                            </CardHeader>
                            <CardBody>
                                <Table
                                    tableHeaderColor="primary"
                                    tableHead={["Prénom", "Nom", "Email", "nbProjet", "Status", "Infos", "Caractéristiques"]}
                                    tableData={formatedData}
                                />
                            </CardBody>
                            <CardFooter>
                                <Button color="primary" size="sm" onClick={this.createPrm}>Confirmer l'importation</Button>
                                {this.state.existingEmails.length > 0 &&
                                    <Button color="danger" size="sm" onClick={this.removeExisting}>Supprimer les PRMs existants de la liste</Button>
                                }
                            </CardFooter>
                        </Card>
                    </GridItem>
                }
            </GridContainer >

        );
    }
}

export default withSnackbar(withStyles(styles)(CreatePRM));
