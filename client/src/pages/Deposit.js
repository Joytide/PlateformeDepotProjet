import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import FilesInputs from '../components/Deposit/FormComponents/FilesInputs';
import KeyWords from '../components/Deposit/FormComponents/KeyWords';

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
import { FormControl, InputLabel, Select, Input, FormGroup } from '@material-ui/core'

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


class Deposit extends React.Component {
	constructor(props) {
		super(props);

		const lng = this.props.lng;

		this.state = {
			years: [],
			finished: false,
			stepIndex: 0,
			title: "",
			study_year: [],
			majors_concerned: [],
			majors: [],
			description: "",
			keyWords: [],
			files: [],
			urls: [],
			email: "",
			company: "",
			first_name: "",
			last_name: "",
			submited: false
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyWords = this.handleKeyWords.bind(this);
		this.handleFiles = this.handleFiles.bind(this);
		//this.handleBlur = this.handleBlur.bind(this);

		/*this.years = [{ name: i18n.t('year4.label', { lng }), key: "A4" },
		{ name: i18n.t('year5.label', { lng }), key: "A5" }];*/

		/*this.majors = [{ name: i18n.t('ibo.label', { lng }), key: "IBO" },
		{ name: i18n.t('ne.label', { lng }), key: "NE" },
		{ name: i18n.t('if.label', { lng }), key: "IF" },
		{ name: i18n.t('mnm.label', { lng }), key: "MNM" }];*/
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

	//STEP
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

	handlePrev = () => {
		const { stepIndex } = this.state;
		if (stepIndex > 0) {
			this.setState({ stepIndex: stepIndex - 1 });
		}
	};

	handleSpe = event => {
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

	handleKeyWords(key) {
		var keys = [];
		key.forEach(element => {
			keys.push(element);
		});
		console.log(keys);
		this.setState({ keyWords: keys });
		console.log(this.state.keyWords);
	}

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
							method: 'POST',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(form)
						})
							.then((res) => {
								this.setState({ submited: true })
								console.log(res)
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
				console.log(this.state.study_year)
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
				console.log(this.state.majors_concerned)
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
						<Grid container direction="column" justify="center" alignItems="center">
							<Grid item className={classes.paper}>
								<Typography variant="h6">Proposer un projet a nos élèves</Typography>
								<Typography>
									Proposer un projet vous permettra de coopérer avec une équipe d'élèves ingénieurs motivés et innovants et de contribuer à leur formation en les impliquant dans des problématiques actuelles. <br />
									Entreprises ou laboratoires, c'est aussi un moyen de vous faire connaître auprès de ceux qui répondront dans les années futures à vos offres de stages et d'emplois. <br />
								</Typography>
							</Grid>
							<Grid item className={classes.paper}>
								<Typography variant="h6">Comment ça marche ?</Typography>
								<Typography>
									Un groupe projet est constitué de 4 élèves (3 ou 5 éventuellement) qui travailleront chacun une dizaine d'heures par semaine sur votre projet. <br />
									Chaque groupe sera suivi et encadré par un enseignant de l'école ("directeur de projet") à même de les guider scientifiquement. <br />
									Ces projets concernent les élèves d'année 4 et d'année 5, avec un fonctionnement similaire et un calendrier un peu différent : les projets démarrent pour tous mi/fin septembre, et se terminent fin janvier pour les années 5 et fin mars pour les années 4. <br />
									Les élèves partant en stage après, il peut être possible que votre projet soit "poursuivi" en stage par un élève de l'équipe. <br />
								</Typography>
							</Grid>
							<Grid item className={classes.paper}>
								<Typography variant="h6">Quel va être mon rôle ?</Typography>
								<Typography>
									Si votre projet est choisi, vous devenez alors "partenaire du projet". <br />
									L'équipe d'élèves prend alors contact avec vous pour démarrer le projet, puis vous tient au courant de l'évolution de ses travaux, par des échéances fixées ensemble, et enfin organise avec vous la clôture de projet la dernière semaine de janvier pour les années 5, de mars pour les années 4. <br />
									L'équipe sera suivie régulièrement tout au long de son projet par son "directeur de projet", qui sera aussi chargé de l'évaluer. <br />
									Plusieurs revues projets et pitchs jalonneront le projet, qui se terminera par un showroom auquel vous serez bien entendu invité. <br />
								</Typography>
							</Grid>
							<Grid item className={classes.paper}>
								<Typography variant="h6">Comment proposer un projet ?</Typography>
								<Typography>
									Cliquez sur [SUIVANT] en bas de la page. Vous devrez alors donner des information sur le partenaire puis décrire le projet proposé, et cibler les compétences voulues et attendues. <br />
									Pour plus d'informations, vous pouvez trouver une présentation succincte  de ces projets, ainsi que des exemples effectués les années précédentes en innovation industrielle <a href="http://www.esilv.fr/formations/projets/projet-dinnovation-industrielle-5/" target="_blank" rel="noopener noreferrer">pour les années 5</a> et <a href="http://www.esilv.fr/formations/projets/projet-dinnovation-industrielle-4/" rel="noopener noreferrer">pour les années 4</a>.
                Des renseignements plus précis, ainsi qu'un calendrier seront fournis en septembre. <br />
									Pour toute question, n'hésitez pas à nous contacter : projetesilv@devinci.fr <br />
								</Typography>
							</Grid>
						</Grid>
					</div>);

			case 1: //Applying padding to the parent with at least half the spacing value applied to the child : Negative margin workarounds
				return (<div style={{ padding: 12 }}>
					<Grid container direction="column" spacing={24} className={classes.paper} >
						<Grid item>
							<Typography lng={lng} variant='h6' align='center'>{i18n.t('tellus.label', { lng })}</Typography>
						</Grid>

						<Grid item>
							<TextValidator
								label={i18n.t('email.label', { lng })}
								placeholder={i18n.t('email.label', { lng })}
								validators={['required', 'isEmail', 'maxStringLength:40']}
								errorMessages={[i18n.t('field.label', { lng }), i18n.t('notvalid.label', { lng }), i18n.t('field_length.label', { lng })]}
								onChange={this.handleChange}
								onBlur={this.handleBlur}
								name="email"
								value={this.state.email}
								fullWidth={true}
							/>
						</Grid>

						<Grid item>
							<TextValidator
								validators={['required', 'maxStringLength:70']}
								errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
								label={i18n.t('company.label', { lng })}
								placeholder={i18n.t('company.label', { lng })}
								onChange={this.handleChange}
								name="company" value={this.state.company}
								fullWidth={true}
							/>
						</Grid>

						<Grid item>
							<TextValidator
								validators={['required', 'maxStringLength:30']}
								errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
								label={i18n.t('firstname.label', { lng })}
								placeholder={i18n.t('firstname.label', { lng })}
								onChange={this.handleChange} fullWidth={true}
								name="first_name" value={this.state.first_name}
							/>
						</Grid>

						<Grid item>
							<TextValidator
								validators={['required', 'maxStringLength:30']}
								errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
								label={i18n.t('lastname.label', { lng })}
								placeholder={i18n.t('lastname.label', { lng })}
								onChange={this.handleChange} fullWidth={true}
								name="last_name" value={this.state.last_name}
							/>
						</Grid>
					</Grid>
				</div>);

			/**
			 * Information about the project
			 */
			case 2:
				return (
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
										onChange={this.handleSpe}
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
									validators={['required', 'maxStringLength:3000']}
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
								<FilesInputs lng={lng} change={this.handleFiles} />
							</Grid>
						</Grid>
					</div>)
			case 3:
				if (!this.state.submited) {
					return (
						<Grid container justify="center">
							<CircularProgress />
						</Grid>);
				}
				else {
					return (
						<Grid container lng={lng}>
							<div> {i18n.t('message.label', { lng })} </div>
						</Grid>);
				}
			default:
				return 'You\'re a long way from home sonny jim!';
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
														this.setState({ stepIndex: 0, finished: false });
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
											<ValidatorForm ref="form" onSubmit={this.handleNext}>
												{this.getStepContent(stepIndex)}
												<div style={{ marginTop: 12, paddingBottom: 30, textAlign: 'center' }}>
													<Button lng={lng} variant='contained' color='secondary' disabled={stepIndex === 0} onClick={this.handlePrev} style={{ marginRight: 12 }}>
														<Typography>
															{i18n.t('back.label', { lng })}
														</Typography>
													</Button>
													<Button lng={lng} variant='contained' color='secondary' type="submit">
														<Typography>
															{stepIndex === 2 ? i18n.t('finish.label', { lng }) : i18n.t('next.label', { lng })}
														</Typography>
													</Button>
												</div>
											</ValidatorForm>
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
