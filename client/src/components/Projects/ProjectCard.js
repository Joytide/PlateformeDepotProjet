import React from 'react';
import i18n from '../i18n';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
//import Collapse from '@material-ui/core/Collapse';
//import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import { Link } from 'react-router-dom';


/*
 * i18n integration
 * Card content when expanded 
 * Keywords list
 * User / Admin footer ?
 */



/**
 * Fast description of a project
 * use project props to set the project to display
 */
class ProjectCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			project: this.props.project,
			modal_validation: false,
			projectCardOpen: this.props.projectCardOpen,
			expanded: false
		}
		this.handleValidation = this.handleValidation.bind(this)
		this.handleRejection = this.handleRejection.bind(this)
		this.handleExpandClick = this.handleExpandClick.bind(this)
	}

	handleExpandClick = () => {
		this.setState(state => ({ expanded: !state.expanded }));
	};

    /**
     * Update the project and set the status to "validate"
     * @param {*} event 
     */
	handleValidation(event) {
		// Pas d'envoi de mail côté client. Faire un route pour valider le projet côté serveur
        /*
        var myInit = {
            method: 'PUT',
            mode: 'cors',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({ "status": "validate", "edit_key": null })
        }
        let mailReq = {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
                recipient: this.state.project.partner.email,
                subject: 'Félicitations, votre projet a été retenu! - ProjectWebApp',
                content:
                    `Bonjour ${this.state.project.partner.first_name}, \n
                Votre soumission de projet (${this.state.project.title}) a été retenu par notre équipe. \n
                Nous vous contacterons bientôt afin de pouvoir échanger davantage avec vous. \n
                Merci de votre compréhension,
                
                L'équipe projet du PULV.`
            })
        };
        fetch("/api/mail", mailReq)
            .then((res) => {
                console.log(res);
                fetch("/api/projects/" + this.state.project._id, myInit)
                    .then((res) => {
                        console.log(res);
                        window.location.reload();
                    })
                    .catch((err) => { console.log("Error occured : " + err) })

            })
            .catch((err) => { console.log("Error occured : " + err) })
            */
	}

    /**
         * Update the project and set the status to "refused"
         * @param {*} event 
         */
	handleRejection(event) {
		// Pas d'envoi de mail côté client. Faire un route pour rejeter le projet côté serveur

        /*
        var myInit = {
            method: 'PUT',
            mode: 'cors',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({ "status": "refused" })
        }
        console.log('refused');
        let mailReq = {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
                recipient: this.state.project.partner.email,
                subject: 'Refus de votre soumission - ProjectWebApp',
                content:
                    `Bonjour ${this.state.project.partner.first_name}, \n
                Votre soumission de projet (${this.state.project.title}) n'a pas été retenu. \n
                Merci de votre compréhension,
                
                L'équipe projet du PULV.`
            })
        };
        fetch("/api/mail", mailReq)
            .then((res) => {
                console.log(res);
                fetch("/api/projects/" + this.state.project._id, myInit)
                    .then((res) => {
                        console.log(res);
                        window.location.reload();
                    })
                    .catch((err) => { console.log("Error occured : " + err) })

            })
            .catch((err) => { console.log("Error occured : " + err) })
            */

	}

	handleOpen = (e) => {
		console.log(e.target)
		this.setState({ modal_validation: true });
	}

	handleClose = () => {
		this.setState({ modal_validation: false });
	};

	render() {
		const project = this.props.project;
		const lng = this.props.lng;

		let partner;
		if (this.props.showPartner) {
			partner = (<Grid item xs >
				<Typography variant="subtitle1" component="h2">
					{i18n.t('partner.label', { lng })} : {project.partner.company}
				</Typography>
			</Grid>)
		}

		return (
			<div>
				<Link to={`/Projects/${this.props.project._id}`} key={this.props.project._id}>
					<Card style={{ borderBottom: 2, marginBottom: 8 }}>

						<CardContent>
							<Grid container justify="space-between">
								<Grid item xs={7}>
									<Typography variant="h5" component="h2">
										{project.number} - {project.title}
									</Typography>
								</Grid>
								<Grid item xs={5}>
									{partner}
									<Typography color="textSecondary" gutterBottom>
										{new Date(project.sub_date).toLocaleDateString()}
									</Typography>
								</Grid>
							</Grid>

							<hr></hr>

							<Grid item xs={10} >
								<CardContent style={{ color: "black", paddingTop: 1, paddingBottom: 1 }}>
									{project.description.substring(0, 220) + " ..."}
								</CardContent>
							</Grid>

						</CardContent>

						<CardActions disableActionSpacing>
								<Grid container spacing={8}>
									{
										project.study_year.sort().map((year, index) => {
											return (<Grid key={index} item>
												<Chip label={year} color="primary" />
											</Grid>);
										})
									}
								</Grid>
								<Grid container spacing={8}>
									{
										project.majors_concerned.sort().map((major, index) => {
											return (<Grid key={index} item>
												<Chip label={major.abbreviation} color="secondary" />
											</Grid>);
										})
									}
								</Grid>
								<Grid container spacing={8}>
									{
										project.keywords.sort().map((keyword, index) => {
											return (<Grid key={index} item>
												<Chip label={keyword} />
											</Grid>);
										})
									}
								</Grid>
						</CardActions>

					</Card>
				</Link>
			</div>);
	}
}

export default ProjectCard;
