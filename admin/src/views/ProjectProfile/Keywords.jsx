import React from "react";
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import AuthService from "components/AuthService";
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { handleXhrError } from "../../components/ErrorHandler";

import { api } from "../../config";

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
            checkedKeywords: [],
            loadingKeyword: true,
            selected_keywords: this.props.selected_keywords.map(kw => kw._id),
            editable: false
        }
    }

    componentWillMount() {
        this.loadStaticData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.editable !== nextProps.editable)
            this.setState({ editable: nextProps.editable });
    }

    // Load all keywords informations
    loadStaticData() {
        fetch(api.host + ":" + api.port + "/api/keyword")
            .then(res => {
                if (!res.ok)
                    throw res;
                return res.json();
            })
            .then(keywords => {
                let checkedKeywords = {};

                keywords.forEach(keyword => {
                    checkedKeywords[keyword._id] = false;
                });

                this.setState({
                    keywords: keywords,
                    checkedKeywords: checkedKeywords,
                    loadingKeyword: false,
                }, this.checkboxMapping);
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    // Check or uncheck checkboxes depending on the state
    checkboxMapping() {
        if (!this.state.loadingKeyword) {
            let checkedKeywords = {};

            this.state.keywords.forEach(keyword => {
                if (this.state.selected_keywords.indexOf(keyword._id) !== -1) checkedKeywords[keyword._id] = true;
                else checkedKeywords[keyword._id] = false;
            });

            this.setState({
                checkedKeywords: checkedKeywords
            });
        }
    }

    handleCheckboxChange = event => {
        const checked = event.target.checked;
        const id = event.target.id;
        console.log("Detected checkbox change on",id,":",checked)
        // Count the number of checkbox checked
        let checkedCount = 0;
        for (const id in this.state.checkedKeywords)
            if (this.state.checkedKeywords[id])
                checkedCount++;
        console.log("CheckCount is now",checkedCount)
        
        // If there is at least 2 checkbox checked (so 1 after change) or the checkbox is getting checked (so at least 1 after change)
        if (checkedCount >= 2 || checked) {
            let keywordList = [];
            
            for (let keywordId in this.state.checkedKeywords)
                // uncheck if checked || check if unchecked
                if ((this.state.checkedKeywords[keywordId] && keywordId !== id) || (!this.state.checkedKeywords[keywordId] && keywordId === id))
                keywordList.push(keywordId);
            console.log("keywordList is",keywordList)
            const data = {
                id: this.props.projectId,
                selected_keywords: keywordList
            }
            console.log("data is ",data)
            AuthService.fetch(api.host + ":" + api.port + "/api/project", {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok) throw res;
                    else return res.json()
                })
                .then(data => {
                    this.setState({
                        selected_keywords: data.selected_keywords
                    });
                    this.checkboxMapping();
                })
                .catch(handleXhrError(this.props.snackbar));
            
        } else
            this.props.snackbar.error("Le projet doit à minima concerner un mot-clé.")
        
    }

    render() {
        const { classes, color } = this.props;
        
        return (
            <Card>
                <CardHeader color={color}>
                    <h4 className={classes.cardTitleWhite}>Années</h4>
                    <p className={classes.cardCategoryWhite}>Années concernées par le projet</p>
                </CardHeader>
                <CardBody>
                    <GridContainer>
                        <GridItem xs={12} md={12}>
                            <GridContainer alignItems="center" justify="center">
                                {this.state.keywords.map(keyword =>
                                    <GridItem xs={12} md={3} key={keyword._id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={this.handleCheckboxChange}
                                                    checked={this.state.checkedKeywords[keyword._id]}
                                                    id={keyword._id}
                                                    disabled={this.props.projectStatus !== "pending" || !this.state.editable}
                                                    color="primary"
                                                />
                                            }
                                            label={keyword.name.fr}
                                        />
                                    </GridItem>
                                )}
                            </GridContainer>
                        </GridItem>
                    </GridContainer>
                </CardBody>
                <CardFooter>
                </CardFooter>
            </Card >
        );
    }
}

Keywords.propTypes = {
    color: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projectStatus: PropTypes.string.isRequired,
    selected_keywords: PropTypes.array.isRequired,
}

export default withSnackbar(withStyles(styles)(Keywords));
