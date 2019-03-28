import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import FilesInputs from '../components/Deposit/FormComponents/FilesInputs';
import KeyWords from '../components/Deposit/FormComponents/KeyWords';
import CreatePartner from '../components/Deposit/CreatePartner';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel, Select, Input, FormGroup, MuiThemeProvider } from '@material-ui/core'

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { Link } from 'react-router-dom';
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
	years: [],
	majors: [],
	//années et majeures sélectionnées
	study_year: [],
	majors_concerned: [],

	stepIndex: 1,
	title: "",
	description: "",
	keyWords: [],
	files: [],
	urls: [],
	email: "",
	company: "",
	first_name: "",
	last_name: "",
	finished: false,
	submited: false
}
const RESET_STATE = {
	study_year: [],
	majors_concerned: [],

	title: "",
	description: "",
	keyWords: [],
	files: [],
	urls: []
}

class Deposit extends React.Component {
	constructor(props) {
		super(props);

		this.state = { ...DEFAULT_STATE }

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleFiles = this.handleFiles.bind(this);
	}

	componentWillMount() {
		fetch('/api/specialization')
			.then(res => res.json())
			.then(majors => {
				this.setState({ majors: majors });
			})
			.catch(console.error.bind(console));

		fetch('/api/year')
			.then(res => res.json())
			.then(years => {
				this.setState({ years: years })
			})
			.catch(console.error.bind(console));
	}

	// Revoir le fonctionnement de la variable finished. Est-elle vraiment nécessaire ?
	handleNext = () => {
		const { stepIndex } = this.state;

		if (!this.state.finished) {
			this.setState({
				stepIndex: stepIndex + 1,
				finished: stepIndex >= 2
			}, () => {
				this.handleSubmit();
			});
		}
	};

	// A voir s'il est vraiment nécessaire de pouvoir revenir en arrière
	handlePrev = () => {
		const { stepIndex } = this.state;
		if (stepIndex > 0) {
			this.setState({ stepIndex: stepIndex - 1 });
		}
	};


	handleSpecializations = event => {
		this.setState({ majors_concerned: event.target.value });
	};

	// Inutile pour le moment. On verra avec le token pour remplir automatiquement si le partenaire est déjà authentifié

	/*handleBlur(event) {
	  fetch("/api/partners/" + this.state.email)
		.then((res) => res.json())
		.then((partner) => {
		  try {
			this.setState({ first_name: partner.first_name, last_name: partner.last_name, company: partner.company });
		  } catch (e) {
			console.log("Email not found");
		  }
		})
		.catch((err) => { console.log("Email not found") });
	}*/

	FilesUpload() {
		return new Promise((resolve, reject) => {
			var formData = new FormData()
			/*Object.keys(this.state.files).forEach((key)=>{  //On parcourt la liste des fichiers
				const file = this.state.files[key]
				formData.append(key, new Blob([file], {type : file.type}), file.name || 'file') //On ajoute dans le formData le fichier
			})*/

			this.state.files.forEach((file) => {
				formData.append(file.name, new Blob([file], { type: file.type }), file.name || 'file')
			})

			fetch('/api/addFile', {
				method: 'POST',
				body: formData
			})
				.then((resp) => {
					resp.json().then((urls) => {
						console.log(urls)
						this.setState({ urls: urls })
						return resolve()
					});
				})
				.catch((err) => { return reject(err) })
		});
	}

	addViewFile() {
		const lng = this.props.lng;

		var Delete = (e) => {
			const fileIdToRemove = e.target.getAttribute('data-key')
			this.state.files.splice(this.state.files.findIndex((file) => {
				return file.id === fileIdToRemove;
			}), 1);
			this.addViewFile();
		};

		// Lisibiilité ?
		const html = (
			this.state.files.map((file, index) => {
				return (
					<a key={index} class="justify-content-between file-add list-group-item list-group-item-action">
						<div>
							<p>{file.name}</p>
							<p data-key={file.id} className="text-right" onClick={Delete}>{i18n.t('delete.label', { lng })} </p>
						</div>
					</a>)
			})
		)
		ReactDOM.render(html, document.getElementById("addedFiles"))
	}

	handleFiles(event) {
		console.log(event);
		this.setState({ files: event }, () => {
			console.log(this.state.files);
			this.addViewFile();
		});
	}

	handleKeyWords = key => this.setState({ keyWords: key });

	handleSubmit() {
		console.log("finished : " + this.state.finished);
		if (this.state.finished) {
			console.log("Passed");
			this.FilesUpload()
				.then(() => {
					const form = {
						title: this.state.title,
						study_year: this.state.study_year,
						majors_concerned: this.state.majors_concerned,
						description: this.state.description,
						keywords: this.state.keyWords,
						email: this.state.email,
						company: this.state.company,
						media_files: this.state.urls,
						first_name: this.state.first_name,
						last_name: this.state.last_name
					};

					console.log(form);
					try {
						fetch('/api/projects', {
							method: 'PUT',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(form)
						})
							.then((res) => {
								this.setState({ submited: true })
								console.log(res)
								console.log("RESET_STATE1");
								this.setState(RESET_STATE);
								console.log(this.state.study_year);
							})
							.catch((error) => {
								console.log(error)
							});
					}
					catch (error) {
						return console.log(error);
					}
				})
				.catch((err) => { console.log("ERROR UPLOAD FILE") })
			this.handleNext();
		}
	}

	handleChange(e, index, values) {
		switch (e.target.name) {
			case "year":
				var temp = this.state.study_year;
				if (e.target.checked) {
					temp.push(e.target.value);
				}
				else {
					let index = temp.indexOf(e.target.value)
					if (index > -1) {
						temp.splice(index, 1);
					}
				}
				console.log(this.state.study_year);
				this.setState({ study_year: temp });
				break;

			case "major":
				var temp2 = this.state.majors_concerned;
				if (e.target.checked) {
					temp2.push(e.target.value);
				}
				else {
					let index = temp2.indexOf(e.target.value)
					if (index > -1) {
						temp2.splice(index, 1);
					}
				}
				console.log(this.state.majors_concerned);
				this.setState({ majors_concerned: temp2 });
				break;

			default:
				this.setState({
					[e.target.name]: e.target.value
				});
		}
	}

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
					<ValidatorForm ref="form" onSubmit={this.handleNext}>
						<div lng={lng} style={{ padding: 12 }}>
							<Grid container direction="column" justify="center" spacing={24} className={classes.paper}>
								<Grid item>
									<Typography align='center' variant='h6'>{i18n.t('projectPres.h2', { lng })}</Typography>
								</Grid>
								<Grid item>
									<TextValidator
										label={i18n.t('titleproj.label', { lng })}
										placeholder={i18n.t('titleproj.label', { lng })}
										onChange={this.handleChange} fullWidth={true}
										name="title"
										value={this.state.title}
										validators={['required', 'maxStringLength:70']}
										errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
									/>
								</Grid>
								<br />

								<Grid item>
									<Typography variant="subtitle1" align='center'>
										{i18n.t('years.label', { lng })}
									</Typography>
									<Grid container direction="row" justify='center'>
										{this.state.years.map(year =>
											<Grid item key={year._id}>
												<FormControlLabel
													control={
														<Checkbox
															onChange={this.handleChange}
															value={year._id}
															name="year"
														/>
													}
													label={lng === "fr" ? year.name.fr : year.name.en}
												/>
											</Grid>
										)}
									</Grid>
								</Grid>
								<br />

								<Grid item>
									<FormControl fullWidth>
										<InputLabel htmlFor="select-multiple">{i18n.t('majors.label', { lng })}</InputLabel>
										<Select
											multiple
											required
											fullWidth
											value={this.state.majors_concerned}
											onChange={this.handleSpecializations}
											input={<Input id="select-multiple" />}
										>
											{this.state.majors.map(major => (
												<MenuItem key={major._id} value={major._id}>
													{lng === "fr" ? major.name.fr : major.name.en}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<br />

								<Grid item>
									<TextValidator
										placeholder={i18n.t('descriptionProj.label', { lng })}
										label="Description"
										value={this.state.description}
										validators={['required', 'maxStringLength:10000']}
										errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
										multiline
										rows="10"
										name="description"
										onChange={this.handleChange}
										fullWidth={true}
										variant="outlined"
									/>
								</Grid>

								<Grid item>
									{<KeyWords lng={lng} change={this.handleKeyWords} />}
								</Grid>
								<Grid item>
									{<FilesInputs lng={lng} change={this.handleFiles} />}
								</Grid>
							</Grid>
						</div>
					</ValidatorForm>
				)
			case 3:
				if (!this.state.submited) {
					return (
						<Grid container justify="center">
							<CircularProgress />
						</Grid>);
				}
				else {
					// /!\ code jamais atteint
					return (
						<Grid container lng={lng}>
							<div> {i18n.t('message.label', { lng })} </div>
						</Grid>);
				}
			default:
				return <div></div>;
		}
	}

	render() {
		const lng = this.props.lng;
		const { finished, stepIndex } = this.state;
		//const { classes } = this.props;
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

							<div>
								{finished ? (
									<Grid container xs>
										{this.state.submited ? (
											<div>
												<div>{i18n.t('message.label', { lng })}</div>
												<br />

												<Link
													to={"/Deposit"}
													onClick={(event) => {
														event.preventDefault();
														this.setState({ stepIndex: 2, finished: false, submited: false });
													}}
												>
													{i18n.t('click.label', { lng })}
												</Link>

												{i18n.t('example.label', { lng })}
											</div>
										) : (
												<Grid container justify="center">
													<div style={{ textAlign: 'center' }}><CircularProgress /></div>
												</Grid>
											)}
									</Grid>
								) : (
										<div>
											{this.getStepContent(stepIndex)}
										</div>
									)}
							</div>
						</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Deposit);
