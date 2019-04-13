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

	handleOpen = (e) => {
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
									project.study_year
										.sort((a, b) => (a.abbreviation > b.abbreviation) ? 1 : ((b.abbreviation > a.abbreviation) ? -1 : 0))
										.map(year => {
											return (<Grid key={year._id} item>
												<Chip label={year.abbreviation} color="primary" />
											</Grid>);
										})
								}
							</Grid>
							<Grid container spacing={8}>
								{
									project.majors_concerned		
									.sort((a, b) => (a.abbreviation > b.abbreviation) ? 1 : ((b.abbreviation > a.abbreviation) ? -1 : 0))
									.map(major => {
										return (<Grid key={major._id} item>
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
