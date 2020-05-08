import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import { Typography, Divider, Collapse, IconButton, TextField } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Remove from '@material-ui/icons/Remove';
import Add from '@material-ui/icons/Add';

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
    empty: {

    }
};

class PRMItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            prm: this.props.prm,
            prm_cpy: this.props.prm,
            expanded: false,
        };
    }

    handleChange = e => {
        this.setState({
            prm_cpy: {
                ...this.state.prm_cpy,
                [e.target.id]: e.target.value
            }
        });
    }

    handleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    addKeyword = id => () => {
        const body = {
            prmId: this.state.prm._id,
            keywordId: id
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/prm/keyword", {
            method: "POST",
            body: JSON.stringify(body)
        })
            .then(res => {
                if (res.ok) {
                    this.setState({
                        prm: {
                            ...this.state.prm,
                            keywords: [id, ...this.state.prm.keywords]
                        }
                    });
                }
                else
                    throw res;
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    removeKeyword = id => () => {
        const body = {
            prmId: this.state.prm._id,
            keywordId: id
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/prm/keyword", {
            method: "DELETE",
            body: JSON.stringify(body)
        })
            .then(res => {
                if (res.ok) {
                    let keywords = this.state.prm.keywords.filter(k => k !== id);
                    this.setState({
                        prm: {
                            ...this.state.prm,
                            keywords: keywords
                        }
                    });
                }
                else
                    throw res;
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    saveModifications = () => {
        const body = {
            ...this.state.prm_cpy,
            id: this.state.prm._id,
            keywords: undefined
        }

        AuthService.fetch(api.host + ":" + api.port + "/api/prm", {
            method: "PUT",
            body: JSON.stringify(body)
        })
            .then(res => {
                if (res.ok) {
                    this.setState({
                        prm: {
                            ...this.state.prm_cpy,
                            keywords: this.state.prm.keywords
                        }
                    });

                    this.props.snackbar.success("Sauvegarde effectuée avec succès")
                }
                else
                    throw res;
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    cancelModifications = () => {
        this.setState({
            prm_cpy: this.state.prm
        });
    }

    render() {
        const { classes } = this.props;

        let addedKeywords = [],
            nonAddedKeywords = [];

        // Puts keywords already associated to the project and the other ones in two different lists
        this.props.keywords
            .forEach(keyword => {
                if (this.state.prm.keywords.indexOf(keyword._id) !== -1) {
                    addedKeywords.push(
                        <Button key={keyword._id} component="span" size="sm" color="info" onClick={this.removeKeyword(keyword._id)}><Remove />{keyword.displayName}</Button>
                    );

                }
                else {
                    nonAddedKeywords.push(
                        <Button key={keyword._id} component="span" size="sm" color="info" onClick={this.addKeyword(keyword._id)}><Add />{keyword.displayName}</Button>
                    );
                }
            });

        return (
            <React.Fragment >
                <GridContainer className={this.props.gray ? classes.grayBg : classes.empty} onClick={this.handleExpand}>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.state.prm.last_name}</Typography>
                    </GridItem>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.state.prm.first_name}</Typography>
                    </GridItem>
                    <GridItem xs={4}>
                        <Typography className={classes.textField}>{this.state.prm.email}</Typography>
                    </GridItem>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.state.prm.projectNumber}</Typography>
                    </GridItem>
                    <GridItem xs={2}>
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
                            <GridContainer >
                                <GridItem xs={2}>
                                    <TextField
                                        className={classes.pad}
                                        id="last_name"
                                        label="Nom"
                                        value={this.state.prm_cpy.last_name}
                                        onChange={this.handleChange}
                                        margin="normal"
                                    />
                                </GridItem>
                                <GridItem xs={2}>
                                    <TextField
                                        className={classes.pad}
                                        id="first_name"
                                        label="Prénom"
                                        value={this.state.prm_cpy.first_name}
                                        onChange={this.handleChange}
                                        margin="normal"
                                    />
                                </GridItem>
                                <GridItem xs={4}>
                                    <TextField
                                        className={classes.pad}
                                        id="email"
                                        label="Email"
                                        value={this.state.prm_cpy.email}
                                        onChange={this.handleChange}
                                        margin="normal"
                                    />
                                </GridItem>
                                <GridItem xs={2}>
                                    <TextField
                                        className={classes.pad}
                                        id="projectNumber"
                                        label="Nombre de projets"
                                        value={this.state.prm_cpy.projectNumber}
                                        type="number"
                                        onChange={this.handleChange}
                                        margin="normal"
                                    />
                                </GridItem>
                                <GridItem xs={2}></GridItem>
                                <GridItem xs={2}>
                                    <TextField
                                        className={classes.pad}
                                        id="status"
                                        label="Statut"
                                        value={this.state.prm_cpy.status}
                                        onChange={this.handleChange}
                                        margin="normal"
                                    />
                                </GridItem>
                                <GridItem xs={5}>
                                    <TextField
                                        className={classes.pad}
                                        id="caracteristics"
                                        label="Chractéristiques"
                                        value={this.state.prm_cpy.caracteristics}
                                        onChange={this.handleChange}
                                        margin="normal"
                                        fullWidth
                                    />
                                </GridItem>
                                <GridItem xs={5}>
                                    <TextField
                                        className={classes.pad}
                                        id="infos"
                                        label="Informations"
                                        value={this.state.prm_cpy.infos}
                                        onChange={this.handleChange}
                                        margin="normal"
                                        fullWidth
                                    />
                                </GridItem>
                            </GridContainer>
                            <br />
                            <GridContainer >
                                <GridItem xs={12}>
                                    <Typography>
                                        Mots-clefs déjà associés au PRM (cliquer sur le mot clef pour le retirer) :
                                </Typography>
                                    {addedKeywords}
                                    <Divider />
                                    <Typography>
                                        Mots-clefs non-associés au PRM (cliquer sur le mot clef pour l'ajouter) :
                                </Typography>
                                    {nonAddedKeywords}
                                </GridItem>
                            </GridContainer>

                            <br />
                            <Button color="success" size="sm" onClick={this.saveModifications}>Sauvegarder</Button>
                            <Button color="warning" size="sm" onClick={this.cancelModifications}>Annuler les modifications</Button>
                        </Collapse>
                    </GridItem>
                </GridContainer>
                <Divider className={classes.divider} />
            </React.Fragment>
        );
    }
}

export default withSnackbar(withStyles(styles)(PRMItem));
