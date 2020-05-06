import React from "react";
import PropTypes from 'prop-types';

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from '@material-ui/core/Divider';

import Add from "@material-ui/icons/Add"
import Remove from "@material-ui/icons/Remove"
import FormControl from '@material-ui/core/FormControl';

// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";

import AuthService from "components/AuthService"
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler";

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
    },
    displayLineBreak: {
        "white-space": "pre-line"
    }
};

class Keywords extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keywords: [],
            newKeyword: "",
            projectKeywords: this.props.projectKeywords,
            editable: false
        }

        this.loadKeywords = this.loadKeywords.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createKeyword = this.createKeyword.bind(this);
        this.addKeyword = this.addKeyword.bind(this);
        this.removeKeyword = this.removeKeyword.bind(this);
    }

    componentWillMount() {
        this.loadKeywords();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.editable !== nextProps.editable)
            this.setState({ editable: nextProps.editable });
    }

    // Loads keywords from database and put it in keywords state
    loadKeywords() {
        AuthService.fetch(api.host + ":" + api.port + "/api/keyword", {
            method: "GET",
        })
            .then(res => {
                if (res.ok)
                    return res.json();
                else
                    throw res;
            })
            .then(data => {
                this.setState({
                    keywords: data
                        .sort((ka, kb) => ka.lcName > kb.lcName ? 1 : -1)
                });
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    // Create a new keyword entry in database and at it in keywords state list
    createKeyword = () => {
        const body = {
            name: this.state.newKeyword
        };

        AuthService.fetch(api.host + ":" + api.port + "/api/keyword", {
            method: "POST",
            body: JSON.stringify(body)
        })
            .then(res => {
                if (res.ok)
                    return res.json();
                else
                    throw res;
            })
            .then(data => {
                if (data.name !== "Error")
                    this.setState({
                        newKeyword: "",
                        keywords: [...this.state.keywords, data]
                    });
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    // Add a keyword to a project
    addKeyword = id => () => {
        if (this.state.editable) {
            const body = {
                projectId: this.props.projectId,
                keywordId: id
            };

            AuthService.fetch(api.host + ":" + api.port + "/api/project/keyword", {
                method: "POST",
                body: JSON.stringify(body)
            })
                .then(res => {
                    if (res.ok)
                        return res.json();
                    else
                        throw res;
                })
                .then(data => {
                    this.setState({
                        projectKeywords: [id, ...this.state.projectKeywords]
                    });
                })
                .catch(handleXhrError(this.props.snackbar));
        }
        else
            this.props.snackbar.error("Vous n'avez pas les droits pour modifier ce projet");
    }

    // Remove a keyword from a project
    removeKeyword = id => () => {
        if (this.state.editable) {
            const body = {
                projectId: this.props.projectId,
                keywordId: id
            };

            AuthService.fetch(api.host + ":" + api.port + "/api/project/keyword", {
                method: "DELETE",
                body: JSON.stringify(body)
            })
                .then(res => {
                    if (res.ok)
                        return res.json();
                    else
                        throw res;
                })
                .then(data => {
                    this.setState({
                        projectKeywords: this.state.projectKeywords.filter(keyword => keyword !== id)
                    });
                })
                .catch(handleXhrError(this.props.snackbar));
        }
        else
            this.props.snackbar.error("Vous n'avez pas les droits nécessaires pour modifier ce projet");
    }

    // Handle changes on the new keyword's textbox
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { classes, color } = this.props;

        let addedKeywords = [],
            nonAddedKeywords = [];

        // Puts keywords already associated to the project and the other ones in two different lists
        this.state.keywords
            .forEach(keyword => {
                if (this.state.projectKeywords.indexOf(keyword._id) !== -1) {
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
            <Card>
                <CardHeader color={color}>
                    <h4 className={classes.cardTitleWhite}>Mots-clefs</h4>
                </CardHeader>
                <CardBody>
                    <GridContainer>
                        <GridItem xs={12}>
                            <Typography>
                                Mots-clefs déjà associés au projet (cliquer sur le mot clef pour le retirer) :
                                </Typography>
                            {addedKeywords}
                            <Divider />
                            <Typography>
                                Mots-clefs non-associés au projet (cliquer sur le mot clef pour l'ajouter) :
                                </Typography>
                            {nonAddedKeywords}
                        </GridItem>
                    </GridContainer>
                </CardBody>
                {this.state.editable &&
                    <CardFooter>
                        <GridContainer >
                            <GridItem xs={12}>
                                <FormControl>
                                    <CustomInput
                                        labelText="Nouveau mot clef"
                                        inputProps={{
                                            value: this.state.newKeyword,
                                            onChange: this.handleChange,
                                            name: "newKeyword"
                                        }}
                                        formControlProps={{
                                            fullWidth: false
                                        }}
                                    />
                                </FormControl>
                                <Button component="span" size="sm" color="info" onClick={this.createKeyword}><Add />Ajouter un nouveau mot clef</Button>
                            </GridItem>
                        </GridContainer>
                    </CardFooter>
                }
            </Card>
        )
    }
}

Keywords.propTypes = {
    color: PropTypes.string.isRequired,
    projectKeywords: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
}

export default withSnackbar(withStyles(styles)(Keywords));
