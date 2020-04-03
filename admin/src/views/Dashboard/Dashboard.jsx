import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
//import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
// internal components
import { api } from "config.json"
import AuthService from "../../components/AuthService";
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
// chartjs
import { Doughnut } from 'react-chartjs-2';

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
	}
};

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: 0,
			stats: {
				count: 0,
				general: [],
				byYear: [],
				bySpe: [],
				byYearSubSpe: []
			},
			statsLoaded: false
		};
	}
	handleChange = (event, value) => {
		this.setState({ value });
	};

	handleChangeIndex = index => {
		this.setState({ value: index });
	};

	componentWillMount() {
		this.loadStats();
	}

	loadStats() {
		AuthService.fetch(api.host + ":" + api.port + "/api/project/stats")
			.then(res => {
				if (res.ok)
					return res.json()
				else
					throw res;
			})
			.then(data => {
				this.setState({ stats: data, statsLoaded: true });
			})
			.catch(err => {
				console.error(err);
				this.props.snackbar.notification("danger", "Une erreur est survenue lors du chargemement des statistiques.");
			});
	}
	render() {
		const { classes } = this.props;

		return (
			<GridContainer>
				<GridItem xs={12}>
					<img alt="Phoque you" src="/admin/phoque_you.jpg"></img>
				</GridItem>
				{this.state.statsLoaded && this.state.stats.count > 0 &&
					<GridItem xs={12}>
						<GridContainer>
							<GridItem xs={12} md={6} lg={4}>
								<Card>
									<CardHeader color="primary">
										<h4 className={classes.cardTitleWhite}>Statistiques des projets déposés</h4>
									</CardHeader>
									<CardBody>
										<p>Nombre de projets déposés : {this.state.stats.count}</p>
										<Doughnut data={{
											labels: formatLabels(this.state.stats.general),
											datasets: [{
												data: formatStats(this.state.stats.general),
												backgroundColor: [
													'#4caf50',
													'rgb(255, 152, 0)',
													'rgb(244, 67, 54)',
												],
												options: {
													cutoutPercentage: 50
												}
											}]
										}} />
									</CardBody>
								</Card>
							</GridItem>

							<GridItem xs={12} md={12} lg={8}>
								<Card>
									<CardHeader color="primary">
										<h4 className={classes.cardTitleWhite}>Projets triés par année</h4>
									</CardHeader>
									<CardBody>
										<GridContainer>
											{this.state.stats.byYear
												.sort((y1, y2) => y1._id.study_year.name.fr > y2._id.study_year.name.fr)
												.map(year =>
													<GridItem xs={12} md={6} key={year._id.study_year._id}>
														<h4>{year._id.study_year.name.fr}</h4>
														<Doughnut data={{
															labels: formatLabels(year.stats),
															datasets: [{
																data: formatStats(year.stats),
																backgroundColor: [
																	'#4caf50',
																	'rgb(255, 152, 0)',
																	'rgb(244, 67, 54)',
																]
															}]
														}} />
													</GridItem>
												)}
										</GridContainer>

									</CardBody>
								</Card>
							</GridItem>
							<GridItem xs={12} md={12} lg={12}>
								<Card>
									<CardHeader color="primary">
										<h4 className={classes.cardTitleWhite}>Projets triés par majeure</h4>
									</CardHeader>
									<CardBody>
										<GridContainer>
											{this.state.stats.bySpe
												.sort((s1, s2) => s1._id.specialization.name.fr > s2._id.specialization.name.fr)
												.map(spe =>
													<GridItem xs={12} md={6} lg={2} key={spe._id.specialization._id}>
														<h4>{spe._id.specialization.name.fr}</h4>
														<Doughnut data={{
															labels: formatLabels(spe.stats),
															datasets: [{
																data: formatStats(spe.stats),
																backgroundColor: [
																	'#4caf50',
																	'rgb(255, 152, 0)',
																	'rgb(244, 67, 54)',
																]
															}]
														}} />
													</GridItem>
												)}
										</GridContainer>

									</CardBody>
								</Card>
							</GridItem>
						</GridContainer>
					</GridItem>
				}
			</GridContainer>
		)
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withSnackbar(withStyles(styles)(Dashboard));

function formatStats(stats) {
	let status = ["validated", "pending", "rejected"];
	let dataToReturn = [];

	for (let i = 0; i < status.length; i++) {
		let finder = stats.find(val => val.status === status[i])
		if (finder === undefined)
			dataToReturn[i] = 0;
		else
			dataToReturn[i] = finder.total;
	}

	return dataToReturn;
}

function formatLabels(stats) {
	let statNumbers = formatStats(stats);
	return [
		"Validés (" + statNumbers[0] + ")",
		"En attente (" + statNumbers[1] + ")",
		"Refusés (" + statNumbers[2] + ")"
	];
}