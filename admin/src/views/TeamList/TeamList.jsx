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
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler";

import TeamItem from './TeamItem';

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

class TeamList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingTeams: true,
            loadingPrms: true,
            loadingCorrespondence: true,
            teams: [],
            prms: [],
            correspondences: {},
            teamCount: {},
        };
    }

    componentWillMount() {
        AuthService.fetch(api.host + ":" + api.port + "/api/team", {
            method: "GET"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                else
                    throw res;
            })
            .then(teams => {
                // List how many projects have already be associated to each PRM
                let teamCount = {};
                teams.forEach(t => {
                    if (t.prm) {
                        if (!teamCount[t.prm._id])
                            teamCount[t.prm._id] = 0
                        teamCount[t.prm._id]++;
                    }
                });

                this.setState({ teamCount, teams, loadingTeams: false },
                    this.orderByNumberOfTeams);
            })
            .catch(handleXhrError(this.props.snackbar));

        AuthService.fetch(api.host + ":" + api.port + "/api/prm", {
            method: "GET"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                else
                    throw res;
            })
            .then(prms => {
                this.setState({ prms, loadingPrms: false });
            })
            .catch(handleXhrError(this.props.snackbar));

        AuthService.fetch(api.host + ":" + api.port + "/api/team/correspondence", {
            method: "GET"
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                else
                    throw res;
            })
            .then(correspondences => {
                this.setState({ correspondences, loadingCorrespondence: false }, this.populateCorrespondences);
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    updateTeamCount = (prmId, decrease) =>
        new Promise((resolve, reject) => {
            let teamCount = { ...this.state.teamCount };
            if (!teamCount[prmId])
                teamCount[prmId] = 0;

            teamCount[prmId] += decrease ? -1 : 1;

            console.log(teamCount)

            this.setState({ teamCount }, resolve);
        });

    updateCorrespondences = () => {
        let correspondences = { ...this.state.correspondences };

        this.state.prms.forEach(prm => {
            if (prm.projectNumber === this.state.teamCount[prm._id]) {
                Object.keys(correspondences).forEach(key => {
                    correspondences[key] = correspondences[key].filter(e => e.prm._id !== prm._id)
                })
            }
        })

        this.setState({ correspondences })
    }


    populateCorrespondences = () => {
        if (this.state.loadingPrms) {
            setTimeout(this.populateCorrespondences, 100);
        }
        else {
            let prms = {};
            let correspondences = { ...this.state.correspondences };
            this.state.prms.forEach(prm => prms[prm._id] = prm);

            Object.keys(correspondences).forEach(k => {
                correspondences[k] = correspondences[k].map(c => {
                    return { ...c, prm: prms[c.prm] }
                })
            });

            this.setState({ correspondences }, this.updateCorrespondences)
        }
    }

    /**
     * Order teams by the number of teams on the same project
     */
    orderByNumberOfTeams = () => {
        let teams = [...this.state.teams];
        let orderedTeams = [];
        let projectCount = [];

        for (let i = 0; i < teams.length; i++) {
            let project = projectCount[teams[i].project._id];

            if (project) {
                project.count++;
                project.teams.push(teams[i]);
            }
            else {
                project = {}
                project.count = 1;
                project.teams = [teams[i]];
            }

            projectCount[teams[i].project._id] = project;
        }

        orderedTeams = Object.keys(projectCount)
            .map(k => [k, projectCount[k].count, projectCount[k].teams])
            .sort((a, b) => a[1] < b[1] ? 1 : -1)
            .map(e => e[2])
            .flat();

        this.setState({ teams: orderedTeams });
    }

    orderByYear = () =>
        this.setState({
            teams: this.state.teams.sort((a, b) => a.year - b.year || a.teamNumber - b.teamNumber)
        })

    orderByProjectNumber = () =>
        this.setState({
            teams: this.state.teams.sort((a, b) => a.project.number - b.project.number)
        })

    findPRMById = prmId => this.state.prms.filter(p => p._id === prmId)[0];




    render() {
        const { classes } = this.props;

        if (this.state.loadingTeams || this.state.loadingPrms || this.state.loadingCorrespondence) {
            return (<div></div>);
        } else {
            let data = this.state.teams.map((team, i) =>
                <TeamItem
                    correspondence={this.state.correspondences[team.project._id]}
                    team={team}
                    updateTeamCount={this.updateTeamCount}
                    updateCorrespondences={this.updateCorrespondences}
                    findPRMById={this.findPRMById}
                    gray={i % 2 === 0}
                    key={team._id} />
            )

            return (
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Filtres</h4>
                            </CardHeader>
                            <CardBody>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Liste des équipes</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Liste de toutes les équipes existantes sur la plateforme
                            </p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer >
                                    <GridItem xs={2}>
                                        <Typography className={classes.title} onClick={this.orderByYear}>Année</Typography>
                                    </GridItem>
                                    <GridItem xs={2}>
                                        <Typography className={classes.title} onClick={this.orderByYear}>Numéro d'équipe</Typography>
                                    </GridItem>
                                    <GridItem xs={2}>
                                        <Typography className={classes.title} onClick={this.orderByProjectNumber}>Numéro de projet</Typography>
                                    </GridItem>
                                    <GridItem xs={3}>
                                        <Typography className={classes.title}>PRM</Typography>
                                    </GridItem>
                                    <GridItem xs={3}>
                                        <Typography className={classes.title}>Nom du projet</Typography>
                                    </GridItem>
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

export default withSnackbar(withStyles(styles)(TeamList));
