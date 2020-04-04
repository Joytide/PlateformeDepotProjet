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

class Years extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            years: [],
            checkedYears: [],
            loadingYear: true,
            studyYears: this.props.studyYears.map(year => year._id),
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

    // Load all years informations
    loadStaticData() {
        fetch(api.host + ":" + api.port + "/api/year")
            .then(res => {
                if (!res.ok)
                    throw res;
                return res.json();
            })
            .then(years => {
                let checkedYears = {};

                years.forEach(year => {
                    checkedYears[year._id] = false;
                });

                this.setState({
                    years: years,
                    checkedYears: checkedYears,
                    loadingYear: false,
                }, this.checkboxMapping);
            })
            .catch(handleXhrError(this.props.snackbar));
    }

    // Check or uncheck checkboxes depending on the state
    checkboxMapping() {
        if (!this.state.loadingYear) {
            let checkedYears = {};

            this.state.years.forEach(year => {
                if (this.state.studyYears.indexOf(year._id) !== -1) checkedYears[year._id] = true;
                else checkedYears[year._id] = false;
            });

            this.setState({
                checkedYears: checkedYears
            });
        }
    }

    handleCheckboxChange = event => {
        const checked = event.target.checked;
        const id = event.target.id;

        // Count the number of checkbox checked
        let checkedCount = 0;
        for (const id in this.state.checkedYears)
            if (this.state.checkedYears[id])
                checkedCount++;

        // If there is at least 2 checkbox checked or the checkbox is getting checked
        if (checkedCount >= 2 || checked) {
            let yearList = [];

            for (let yearId in this.state.checkedYears)
                // uncheck if checked || check if unchecked
                if ((this.state.checkedYears[yearId] && yearId !== id) || (!this.state.checkedYears[yearId] && yearId === id))
                    yearList.push(yearId);

            const data = {
                id: this.props.projectId,
                study_year: yearList
            }

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
                        studyYears: data.study_year
                    });
                    this.checkboxMapping();
                })
                .catch(handleXhrError(this.props.snackbar));

        } else
            this.props.snackbar.error("Le projet doit à minima concerner à une année.")
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
                                {this.state.years.map(year =>
                                    <GridItem xs={12} md={3} key={year._id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={this.handleCheckboxChange}
                                                    checked={this.state.checkedYears[year._id]}
                                                    id={year._id}
                                                    disabled={this.props.projectStatus !== "pending" || !this.state.editable}
                                                    color="primary"
                                                />
                                            }
                                            label={year.name.fr}
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

Years.propTypes = {
    color: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projectStatus: PropTypes.string.isRequired,
    studyYears: PropTypes.array.isRequired,
}

export default withSnackbar(withStyles(styles)(Years));
