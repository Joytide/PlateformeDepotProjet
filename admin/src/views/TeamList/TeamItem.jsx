import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import { Typography, Divider, Collapse, IconButton, InputLabel, FormControl, Select } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import Button from "components/CustomButtons/Button.jsx";

import { api } from "config.json"
import AuthService from "components/AuthService"
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler";

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
    },
    pad: {
        marginLeft: "10px",
    },
    grayBg: {
        backgroundColor: "#F7F7F7"
    },
    formControl: {
        padding: "10px"
    },
    button: {
        marginTop: "25px"
    }
};

class TeamItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: this.props.team,
            expanded: false,
            prm: ""
        };
    }

    handleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    setPRM = () => {
        const data = {
            prmId: this.state.prm,
            teamId: this.state.team._id
        }

        AuthService.fetch(api.host + ":" + api.port + "/api/team/prm", {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                else
                    throw res;
            })
            .then(async () => {
                this.props.snackbar.success("PRM associé à l'équipe avec succès");
                if(this.state.team.prm) {
                    await this.props.updateTeamCount(this.state.team.prm._id, true);
                }
                await this.props.updateTeamCount(this.state.prm);
                this.props.updateCorrespondences();
                this.setState({
                    team: {
                        ...this.state.team,
                        prm: this.props.findPRMById(this.state.prm)
                    }
                })
            })
            .catch(err => {
                if (err.status === 409) {
                    this.props.snackbar.error("Ce PRM a déjà atteint sa limite de projet")
                } else
                    handleXhrError(this.props.snackbar)(err);
            });
    }


    render() {
        const { classes } = this.props;

        let options = this.props.correspondence.filter(e => e !== undefined).map(e =>
            <option
                key={this.props.team._id + e.prm._id}
                value={e.prm._id}
            >
                {e.prm.last_name + " " + e.prm.first_name + " " + Math.round(e.compatibility * 100).toString() + "% de compatibilité"}
            </option>
        )
            
        return (
            <React.Fragment >
                <GridContainer className={this.props.gray ? classes.grayBg : classes.empty} onClick={this.handleExpand}>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.state.team.year}</Typography>
                    </GridItem>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.state.team.teamNumber}</Typography>
                    </GridItem>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.state.team.project.number}</Typography>
                    </GridItem>
                    <GridItem xs={3}>
                        <Typography className={classes.textField}>{this.state.team.prm ? this.state.team.prm.last_name + " " + this.state.team.prm.first_name : "Aucun"}</Typography>
                    </GridItem>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.state.team.project.title}</Typography>
                    </GridItem>
                    <GridItem xs={1}>
                        <IconButton
                            onClick={this.handleExpand}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </GridItem>
                </GridContainer>
                <Divider />
                <GridContainer className={this.props.gray ? classes.grayBg : classes.empty}>
                    <GridItem xs={12}>
                        <Collapse in={this.state.expanded} unmountOnExit timeout={100}>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="prm-native-simple">PRM recommandés</InputLabel>
                                        <Select
                                            native
                                            value={this.state.prm}
                                            onChange={this.handleChange('prm')}
                                            inputProps={{
                                                name: 'prm',
                                                id: 'prm-native-simple',
                                            }}
                                        >
                                            <option value=""></option>
                                            {options}
                                        </Select>
                                    </FormControl>
                                </GridItem>
                                <GridItem xs={4}>
                                    <Button color="info" size="sm" className={classes.button} onClick={this.setPRM}>
                                        Ajouter comme PRM de l'équipe
                                    </Button>
                                </GridItem>
                            </GridContainer>
                        </Collapse>
                    </GridItem>
                </GridContainer>
                <Divider className={classes.divider} />
            </React.Fragment>
        );
    }
}

export default withSnackbar(withStyles(styles)(TeamItem));
