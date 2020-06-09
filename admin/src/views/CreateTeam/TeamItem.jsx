import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import { Typography, Divider } from "@material-ui/core";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";

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
    progress: {
        margin: "5px",
        height: "20px",
        width: "20px"
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
    redBg: {
        backgroundColor: "#F00"
    },
    waiting: {
        backgroundColor: "#ffa000",
        color: "white",
        borderRadius: "4px",
        marginTop: "10px",
        padding: "10px",
        fontWeight: 300,
        display: "inline-block"
    },
    done: {
        backgroundColor: "#4caf50",
        color: "white",
        borderRadius: "4px",
        marginTop: "10px",
        padding: "10px",
        fontWeight: 300,
        display: "inline-block"
    },
    error: {
        backgroundColor: "#f44336",
        color: "white",
        borderRadius: "4px",
        marginTop: "10px",
        padding: "10px",
        fontWeight: 300,
        display: "inline-block"
    }
};

class TeamItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    handleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render() {
        const { classes } = this.props;
        let bgColor;

        if (this.props.gray)
            bgColor = classes.grayBg;

        return (
            <React.Fragment >
                <GridContainer className={bgColor} onClick={this.handleExpand}>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.props.team.year}</Typography>
                    </GridItem>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.props.team.teamNumber}</Typography>
                    </GridItem>
                    <GridItem xs={2}>
                        <Typography className={classes.textField}>{this.props.team.projectNumber}</Typography>
                    </GridItem>
                    <GridItem xs={6}>
                        {this.props.status === "waiting" &&
                            <Typography className={classes.waiting}>En cours de traitement</Typography>
                        }
                        {this.props.status === "done" &&
                            <Typography className={classes.done}>Importé</Typography>
                        }
                        {this.props.status === "error" &&
                            <Typography className={classes.error}>Erreur : {this.props.error}</Typography>
                        }
                    </GridItem>
                </GridContainer>
                <Divider />
            </React.Fragment>
        );
    }
}

export default withSnackbar(withStyles(styles)(TeamItem));
