import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import CreatePartner from '../components/Deposit/CreatePartner';
import CreateProject from '../components/Deposit/CreateProject';

import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { withUser } from "../providers/UserProvider/UserProvider";
import { withSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";
import i18n from '../components/i18n';
/**
 * Deposit of a project
 */

const styles = theme => ({
	root: {
		flexGrow: 1,
		width: '100%',
		maxWidth: 1150,
		margin: 'auto',
		padding: theme.spacing.unit * 2,
	},
	paper: {
		padding: theme.spacing.unit * 2,
		textAlign: 'left',
		color: theme.palette.text.secondary,
	},
});

const DEFAULT_STATE = {
	stepIndex: 1,
	finished: false,
}

class Deposit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			...DEFAULT_STATE,
			stepIndex: Object.keys(this.props.user.user).length > 0 ? 2 : 1
		}
	}

	componentWillReceiveProps(props) {
		if (props.location.state && props.location.state.reset && this.state.finished)
			this.setState({
				...DEFAULT_STATE
			});

		if (Object.keys(this.props.user.user).length === 0 && Object.keys(props.user.user).length > 0)
			this.setState({ stepIndex: 2 });
	}

	// Revoir le fonctionnement de la variable finished. Est-elle vraiment nécessaire ?
	handleNext = data => {
		if (data && data.newAccount)
			this.props.snackbar.notification("success", i18n.t("createPartner.created", { lng: this.props.lng }));

		const { stepIndex } = this.state;

		if (!this.state.finished) {
			this.setState({
				stepIndex: stepIndex + 1,
				finished: stepIndex >= 2
			});
		}
	};

	getStepContent(stepIndex) {
		const lng = this.props.lng;
		const { classes } = this.props;
		switch (stepIndex) {
			//Information about the partner
			case 0:
				return (
					<div>
						<Grid container direction="column" justify="center" alignItems="flex-start">
							<Grid item className={classes.paper}>
								<Typography variant="h6">{i18n.t('home.p1', { lng })}</Typography>
								<Typography>
									{i18n.t('home.p1_l1', { lng })}<br />
									{i18n.t('home.p1_l2', { lng })}<br />
								</Typography>
							</Grid>
							<Grid item className={classes.paper}>
								<Typography variant="h6">{i18n.t('home.p2', { lng })}</Typography>
								<Typography>
									{i18n.t('home.p2_l1', { lng })}<br />
									{i18n.t('home.p2_l2', { lng })}<br />
									{i18n.t('home.p2_l3', { lng })}<br />
									{i18n.t('home.p2_l4', { lng })}<br />
								</Typography>
							</Grid>
							<Grid item className={classes.paper}>
								<Typography variant="h6">{i18n.t('home.p3', { lng })}</Typography>
								<Typography>
									{i18n.t('home.p3_l4', { lng })}<br />
									{i18n.t('home.p3_l5', { lng })}<br />
									{i18n.t('home.p3_l6', { lng })}<br />
									{i18n.t('home.p3_l7', { lng })}<br />
								</Typography>
							</Grid>
							<Grid item className={classes.paper}>
								<Typography variant="h6">{i18n.t('home.p4', { lng })}</Typography>
								<Typography>
									{i18n.t('home.p4_l1', { lng })}<br />
									{i18n.t('home.p4_l2', { lng })}<br />
									{i18n.t('home.p4_l3', { lng })}<br />
									{i18n.t('home.p4_l4', { lng })}<br />
								</Typography>
							</Grid>
							<Grid item xs={2} style={{ paddingBottom: "20px", paddingLeft: "20px" }}>
								<Button lng={lng} variant='contained' color='primary' onClick={this.handleNext}>
									<Typography color="inherit">
										{i18n.t('next.label', { lng })}
									</Typography>
								</Button>
							</Grid>
						</Grid>
					</div>
				);

			case 1: //Applying padding to the parent with at least half the spacing value applied to the child : Negative margin workarounds
				return (
					<CreatePartner lng={lng} next={this.handleNext} />
				);

			/**
			 * Information about the project
			 */
			case 2:
				return (
					<CreateProject lng={lng} next={this.handleNext} />
				)
			case 3:
				return (
					<Grid container lng={lng}>
						<Grid item>
							<br />
							<div> {i18n.t('message.label', { lng })} </div>
							<br /><br />
						</Grid>
					</Grid>);
			default:
				return <div></div>;
		}
	}

	render() {
		const lng = this.props.lng;
		const { stepIndex } = this.state;

		return (
			<div id="deposit-body">
				<Grid container style={{ marginTop: 12 }} justify="center">
					<Grid item xs={11}>
						<Paper style={{ paddingTop: 12, paddingLeft: 100, paddingRight: 100 }}>
							<Stepper activeStep={stepIndex}>
								<Step>
									<StepLabel lng={lng} >{i18n.t('callForProjects.label', { lng })}</StepLabel>
								</Step>
								<Step>
									<StepLabel lng={lng} >{i18n.t('partnerInfo.label', { lng })}</StepLabel>
								</Step>
								<Step>
									<StepLabel lng={lng} >{i18n.t('projectInfo.label', { lng })}</StepLabel>
								</Step>
								<Step>
									<StepLabel lng={lng} >{i18n.t('submission.label', { lng })}</StepLabel>
								</Step>
							</Stepper>

							{this.getStepContent(stepIndex)}
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withUser(withSnackbar(withStyles(styles, { withTheme: true })(Deposit)));
