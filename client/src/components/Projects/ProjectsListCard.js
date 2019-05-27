import React from 'react';
import i18n from '../i18n';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import ProjectFilter from './ProjectFilter';
import ProjectCard from './ProjectCard';
import ProjectsToPDF from './ProjectsToPDF';


class ProjectsListCard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			projects: [],
			projectToDisplay: [],
			projectSeen: [],
			peopleToDisplay: [],
			annee_value: "",
			majeur_value: "",
			loaded: false,
		};
	}


	handledropDownValue(dropDownValue, filterName) {
		if (filterName === "Année" && dropDownValue !== "Majeure") {
			this.setState({
				annee_value: (dropDownValue !== "Année" ? dropDownValue : "")
			});
		} if (filterName === "Majeure" && dropDownValue !== "Année") {
			this.setState({
				majeur_value: (dropDownValue !== "Majeure" ? dropDownValue : "")
			});
		}
		if (dropDownValue === "") {
			this.setState({ projectSeen: this.state.projectToDisplay, loaded: true });
		}

		if (this.state.annee_value !== "" && this.state.annee_value !== null) {
			let tmp = this.state.projectToDisplay.filter(project => {
				if (project.study_year.includes(this.state.annee_value)) {
					return true;
				}
				return false;
			})
			this.setState({ projectSeen: tmp, loaded: true })
		}
		if (this.state.majeur_value !== "" && this.state.majeur_value !== null) {
			let tmp = this.state.projectToDisplay.filter(project => {
				if (project.specializations.filter(spe => spe.specialization == this.state.majeur_value).length > 0) {
					return true;
				}
				return false;
			})
			this.setState({ projectSeen: tmp, loaded: true });
		}
	}

	handleMotsClesValue(mots_cles_value) {
		if (mots_cles_value !== "") {
			let tmp = this.state.projectToDisplay.filter(project => {
				for (var element of project.keywords) {
					if (element.includes(mots_cles_value.toLowerCase())) {
						return true;
					}
				}
				return false;
			})
			this.setState({ projectSeen: tmp, loaded: true });
		}
		else {
			this.setState({ projectSeen: this.state.projectToDisplay, loaded: true });
		}
	}

	handleTitleValue(title_value) {
		if (title_value !== "") {
			let tmp = this.state.projectToDisplay.filter(project => {
				if (project.title.includes(title_value)) {
					return true;
				}
				return false;
			})
			this.setState({ projectSeen: tmp, loaded: true });
		}
		else {
			this.setState({ projectSeen: this.state.projectToDisplay, loaded: true });
		}
	}

	handleCompanyValue(company_value) {
		if (company_value !== "") {
			var tmp = this.state.projectToDisplay.filter(project => {
				var id = this.state.peopleToDisplay.filter(people => {
					if (people.company.includes(company_value)) {
						return true;
					}
					return false;
				});

				if (project.partner === id) {
					return true;
				}
				return false;
			})
			this.setState({ projectSeen: tmp, loaded: true });
		}
		else {
			this.setState({ projectSeen: this.state.projectToDisplay, loaded: true });
		}
	}


	render() {
		const lng = this.props.lng;
		let ProjectList;

		if (this.props.projects)
			ProjectList = this.props.projects.map(project =>
				<Grid key={project._id} item xs={10}>
					<ProjectCard project={project} lng={lng} admin={this.props.admin} showPartner={this.props.showPartner} />
				</Grid>
			);

		return (
			<div>
				<Grid container style={{ marginTop: 12 }} justify="center">
					<Grid item xs={11}>
						<Paper style={{ paddingTop: 12 }}>
							<Typography align="center" variant="display2" paragraph>
								{i18n.t('project.title', { lng })}
							</Typography>

							<Grid container justify="flex-end">
								<ProjectsToPDF projects={this.props.projects} ProjectsType="all" lng={lng} />
							</Grid>

							<ProjectFilter getdropDownValue={this.handledropDownValue.bind(this)} getMotsClesValue={this.handleMotsClesValue.bind(this)} getTitleValue={this.handleTitleValue.bind(this)} getCompanyValue={this.handleCompanyValue.bind(this)} style={{ fontSize: 15 }} lng={this.props.lng} />

							<Grid container style={{ marginTop: 12 }} spacing={16} justify="center">
								{ProjectList}
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>);
	}
}

export default ProjectsListCard;
