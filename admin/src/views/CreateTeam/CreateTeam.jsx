import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import Button from "components/CustomButtons/Button.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import AuthService from "components/AuthService"

import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { api } from "config.json"

import TeamItem from './TeamItem';

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

class CreateTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teamData: "",
            teams: []
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value.trim(), teams: [] });
    };

    createTeams = async () => {
        let teamList = this.formatTeam();
        let teams = [];

        this.props.snackbar.warning("Importation en cours, merci de ne pas recharger la page");

        for (let i = 0; i < teamList.length; i++)
            teams[i] = { status: "waiting" };

        this.setState({ ...this.state, teams });

        for (let i = 0; i < teamList.length; i++) {
            try {
                await this.createTeam(teamList[i]);

                let teams = [...this.state.teams];
                teams[i] = { status: "done" };

                this.setState({
                    ...this.state,
                    teams
                });
            }
            catch (e) {
                let teams = [...this.state.teams];
                teams[i] = { status: "error", message: e.message };
                
                this.setState({
                    ...this.state,
                    teams
                });
            }
        }

        this.props.snackbar.success("Importation terminée");
    }

    createTeam = team => {
        return new Promise((resolve, reject) => {
            if (team.teamNumber && team.projectNumber && team.year) {
                const data = {
                    teamNumber: team.teamNumber,
                    projectNumber: team.projectNumber,
                    year: team.year
                };

                AuthService.fetch(api.host + ":" + api.port + "/api/team", {
                    method: "POST",
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        if (res.ok)
                            resolve()
                        else
                            throw res;
                    })
                    .catch(err => {
                        err
                            .json()
                            .then(msg => {
                                if(msg.code === "ExistingTeam")
                                    reject(new Error("Une équipe existe déjà avec cette année et ce numéro d'équipe"));
                                else if(msg.code === "ProjectNotFound")
                                    reject(new Error("Aucun projet trouvé avec ce numéro"));
                                else if(msg.code === "TooManyTeams")
                                    reject(new Error("Le nombre maximal d'équipes autorisés a déjà été attribué à ce projet"));
                                else
                                    reject(new Error("Une erreur inconnue est survenue"));
                            })
                            .catch(msg => {
                                console.error(msg);
                                this.props.snackbar.error("Une erreur inconnue est survenue");
                            });
                    });
            }
            else {
                reject(
                    new Error("Impossible d'ajouter cette équipe. Merci de vérifier que tous les champs sont correctement remplis.\nColonne 1 : année (nombre), colonne 2 : numéro d'équipe (nombre), colonne 3: number de projet (nombre)")
                );
            }
        });
    }

    formatTeam = () => {
        if (this.state.teamData) {
            let formatedData = [];
            let lines = this.state.teamData.split('\n');

            for (let i = 0; i < lines.length; i++) {
                let splittedData = lines[i].split('\t');
                let prm = {
                    year: splittedData[0],
                    teamNumber: splittedData[1],
                    projectNumber: splittedData[2]
                }

                formatedData.push(prm)
            }

            return formatedData;
        } else return [];
    }

    render() {
        const { classes } = this.props;
        let formatedData = this.formatTeam();
        let teamItems;

        if (this.state.teamData !== "")
            teamItems = formatedData.map((team, index) =>
                <TeamItem
                    team={team}
                    key={index}
                    gray={index % 2}
                    status={this.state.teams[index] ? this.state.teams[index].status : undefined}
                    error={this.state.teams[index] ? this.state.teams[index].message : undefined}
                />)

        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Importer des équipes</h4>
                            <p className={classes.cardCategoryWhite}></p>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <TextField
                                        id="teamData"
                                        label="Equipes"
                                        multiline
                                        rows="25"
                                        className={classes.textField}
                                        margin="normal"
                                        fullWidth={true}
                                        onChange={this.handleChange}
                                        value={this.state.teamData}
                                    />
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                    </Card>
                </GridItem>
                {this.state.teamData !== "" &&
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Equipes</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Liste des équipes telles qu'elles vont être importées
                            </p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer >
                                    <GridItem xs={2}>
                                        <Typography className={classes.title}>Année</Typography>
                                    </GridItem>
                                    <GridItem xs={2}>
                                        <Typography className={classes.title}>Numéro d'équipe</Typography>
                                    </GridItem>
                                    <GridItem xs={2}>
                                        <Typography className={classes.title}>Numéro de projet</Typography>
                                    </GridItem>
                                    <GridItem xs={6}></GridItem>
                                </GridContainer>
                                <Divider />
                                {teamItems}
                            </CardBody>
                            <CardFooter>
                                <Button color="primary" size="sm" onClick={this.createTeams}>Confirmer l'importation</Button>
                            </CardFooter>
                        </Card>
                    </GridItem>
                }
            </GridContainer >

        );
    }
}

export default withSnackbar(withStyles(styles)(CreateTeam));
