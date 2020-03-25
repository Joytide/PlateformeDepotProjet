import React from "react";
import PropTypes from 'prop-types';

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from '@material-ui/core/Divider';

// core components
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

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

class ProjectInfo extends React.Component {
    render() {
        const { classes, color, project } = this.props;
        return (
            <Card>
                <CardHeader color={color}>
                    <h4 className={classes.cardTitleWhite}>Information projet</h4>
                    <p className={classes.cardCategoryWhite}>Informations sur le projet proposé par le partenaire</p>
                </CardHeader>
                <CardBody>
                    <Typography variant="display2" align="center">
                        {project.title}
                    </Typography>
                    <br />
                    <Typography>
                        Description :
                        </Typography>
                    <Typography className={classes.displayLineBreak}>
                        {project.description}
                    </Typography>
                    <br />
                    <Divider />
                    <br />
                    <Typography >
                        Compétences développées :
                        </Typography>
                    <Typography>
                        {project.skills}
                    </Typography>
                    <br />
                    <Typography >
                        Informations supplémentaires :
                        </Typography>
                    <Typography>
                        {project.infos}
                    </Typography>
                    <br />
                    <Typography >
                        Nombre maximum d'équipes sur le projet :
                        </Typography>
                    <Typography>
                        {project.maxTeams}
                    </Typography>
                </CardBody>
            </Card>
        );
    }
}

ProjectInfo.propTypes = {
    color: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
}

export default withStyles(styles)(ProjectInfo);
