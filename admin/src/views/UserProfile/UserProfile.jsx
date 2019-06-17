import React from "react";
import { Link } from 'react-router-dom';


// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from "@material-ui/core/Checkbox";

import Visibility from "@material-ui/icons/Visibility"


// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import ChangePassword from "components/ChangePassword/ChangePassword.jsx";
import Table from "components/Table/Table.jsx";

import AuthService from "components/AuthService"

import { api } from "../../config"

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
	}
};

class UserProfile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {},
			user_old: {},
			loading: true,
			adminCheckboxDisabled: false,
			EPGECheckboxDisabled: false,
			modified: false,
			error: false,
			success: false,
			message: ""
		}

		this.update = this.update.bind(this);
		this.cancel = this.cancel.bind(this);
		this.error = this.error.bind(this);
		this.success = this.success.bind(this);
	}

	componentDidMount() {
		fetch(api.host + ":" + api.port + "/api/user/" + this.props.match.params.id)
			.then(res => res.json())
			.then(data => {
				if (data) {
					this.setState({
						user: data,
						user_old: data,
						loading: false,
						inputDisabled: true
					});
				}
			});
	}

	handleChange = e => {
		const value = e.target.value;
		const id = e.target.id;
		this.setState(prevState => ({
			modified: true,
			user: {
				...prevState.user,
				[id]: value
			}
		}));
	}

	cancel() {
		this.setState({
			modificated: false,
			user: this.state.user_old
		});
	}

	update() {
		let data = {
			_id: this.state.user._id,
			company: this.state.user.company,
			firstName: this.state.user.first_name,
			lastName: this.state.user.last_name,
			email: this.state.user.email,
			__t: this.state.user.__t
		}

		AuthService.fetch(api.host + ":" + api.port + "/api/user", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data)
		})
			.then(res => {
				if (!res.ok)
					throw res;
				return res.json();
			})
			.then(res => {
				this.setState({
					user: res,
					user_old: res,
					modified: false
				});

				this.success("Utilisateur mis à jour avec succès");
			})
			.catch(err => {
				console.error(err);
			});
	}

	handleCheckboxChange = name => event => {
		const checked = event.target.checked;

		let data = {
			_id: this.state.user._id
		};
		if (name === "admin") {
			data.admin = checked;
			this.setState({ adminCheckboxDisabled: true });
		}
		else if (name === "epge") {
			data.EPGE = checked;
			this.setState({ EPGECheckboxDisabled: true });
		}


		fetch(api.host + ':' + api.port + "/api/user", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data)
		})
			.then(res => res.json())
			.then(result => {
				if (result)
					this.setState({ user: result });
				if (name === "admin")
					this.setState({ adminCheckboxDisabled: false });
				else if (name === "epge")
					this.setState({ EPGECheckboxDisabled: false });
			})
			.catch(err => console.err(err));
	};

	error = msg => {
		this.setState({
			error: true,
			message: msg
		}, () => {
			setTimeout(() => {
				this.setState({ error: false });
			}, 3000);
		});
	}

	success = msg => {
		this.setState({
			success: true,
			message: msg
		}, () => {
			setTimeout(() => {
				this.setState({ success: false });
			}, 3000);
		});
	}

	render() {
		const { classes } = this.props;
		const { user } = this.state;

		if (!this.state.loading) {
			const title = (user.company ? "[" + user.company.toUpperCase() + "] - " : "") + user.last_name.toUpperCase() + " " + user.first_name

			let company;
			let administration;

			if (user.__t === "Partner") {
				company = (
					<GridContainer>
						<GridItem xs={12} sm={12} md={4}>
							<CustomInput
								labelText="Entreprise"
								id="company"
								formControlProps={{
									fullWidth: true
								}}
								inputProps={{
									value: user.company,
									onChange: this.handleChange
								}}
							/>
						</GridItem>
					</GridContainer>);
			}

			if (user.__t === "Administration") {
				administration = (
					<GridContainer>
						<GridItem xs={12} sm={12} md={12}>
							<FormControl className={classes.formControl} >
								<FormControlLabel
									control={
										<Checkbox
											disabled={this.state.adminCheckboxDisabled}
											onChange={this.handleCheckboxChange('admin')}
											checked={user.admin}
											value="admin"
											color="primary"
										/>
									}
									label="Administrateur"
								/>
							</FormControl>
						</GridItem>
						<GridItem xs={12} sm={12} md={12}>
							<FormControl className={classes.formControl} >
								<FormControlLabel
									control={
										<Checkbox
											disabled={this.state.EPGECheckboxDisabled}
											onChange={this.handleCheckboxChange('epge')}
											checked={user.EPGE}
											value="epge"
											color="primary"
										/>
									}
									label="EGPE"
								/>
							</FormControl>
						</GridItem>
					</GridContainer >
				);
			}

			return (
				<div>
					<Snackbar
						place="tc"
						color="success"
						message={this.state.message}
						open={this.state.success}
						closeNotification={() => this.setState({ success: false })}
						close
					/>
					<Snackbar
						place="tc"
						color="danger"
						message={this.state.message}
						open={this.state.error}
						closeNotification={() => this.setState({ error: false })}
						close
					/>
					<GridContainer>
						<GridItem xs={12} sm={12} md={12}>
							<Card>
								<CardHeader color="primary">
									<h4 className={classes.cardTitleWhite}>{title} - Profil de l'utilisateur</h4>
									<p className={classes.cardCategoryWhite}>Complete your profile</p>
								</CardHeader>
								<CardBody>
									<GridContainer>
										<GridItem xs={12} sm={12} md={4}>
											<CustomInput
												labelText="Type"
												id="Type"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: user.__t,
													disabled: this.state.inputDisabled
												}}
											/>
										</GridItem>
									</GridContainer>
									{company}
									<GridContainer>
										<GridItem xs={12} sm={12} md={6}>
											<CustomInput
												labelText="Prénom"
												id="first_name"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: user.first_name,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
										<GridItem xs={12} sm={12} md={6}>
											<CustomInput
												labelText="Last Name"
												id="last_name"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: user.last_name,
													onChange: this.handleChange
												}}
											/>
										</GridItem>
									</GridContainer>
									<GridContainer>
										<GridItem xs={12} sm={12} md={12}>
											<CustomInput
												labelText="Email"
												id="email"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: user.email,
													disabled: true
												}}
											/>
										</GridItem>
									</GridContainer>
									{administration}
								</CardBody>
								<CardFooter>
									<GridContainer >
										<GridItem xs={12} sm={12} md={12}>
											<Button disabled={!this.state.modified} color="success" onClick={this.update}>Sauvegarder</Button>
											<Button disabled={!this.state.modified} color="danger" onClick={this.cancel}>Annuler</Button>
										</GridItem>
									</GridContainer>
								</CardFooter>
							</Card>
						</GridItem>

						<GridItem xs={12} sm={12} md={12}>
							{this.state.user.projects && this.state.user.projects.length > 0 &&
								<Card>
									<CardHeader color="primary">
										<h4 className={classes.cardTitleWhite}>Liste des projets</h4>
										<p className={classes.cardCategoryWhite}>Projets déposés par le partenaire</p>
									</CardHeader>
									<CardBody>
										<Table
											tableHeaderColor="primary"
											tableHead={["Titre", "Lien"]}
											tableData={this.state.user.projects.map(p => [
												p.title,
												<Link to={"/project/" + p._id}><Button size="sm" type="button" color="info"><Visibility /> Voir le projet</Button></Link>
											])}
										/>
									</CardBody>
								</Card>}
						</GridItem>

						<GridItem xs={12}>
							<ChangePassword user={this.state.user} errorHandler={this.error} successHandler={this.success}></ChangePassword>
						</GridItem>
					</GridContainer>
				</div>
			);
		}
		else {
			return <div></div>
		}
	}
}

export default withStyles(styles)(UserProfile);
