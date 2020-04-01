import React from 'react';
import i18n from '../i18n';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import ProjectCard from './ProjectCard';


class ProjectsListCard extends React.Component {
	render() {
		const { lng } = this.props;
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

							<Grid container style={{ marginTop: 12 }} spacing={16} justify="center">
								{ProjectList.length > 0 ? ProjectList : null}
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>);
	}
}

export default ProjectsListCard;
