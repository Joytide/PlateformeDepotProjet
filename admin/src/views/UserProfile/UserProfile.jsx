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
import CardFooter from "components/Card/CardFooter.jsx";
import ChangePassword from "components/ChangePassword/ChangePassword.jsx";
import Table from "components/Table/Table.jsx";

import AuthService from "components/AuthService"
import { withUser } from "../../providers/UserProvider/UserProvider"
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider"
import { api } from "../../config"
import { handleXhrError } from "../../components/ErrorHandler"
import { hasPermission } from "components/PermissionHandler";
import { UserProfile as Permissions } from "../../permissions"

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
			canEditUser: hasPermission(Permissions.EditUser, props.user.user),
			canChangePassword: hasPermission(Permissions.ChangePassword, props.user.user)
		}

		console.log(Permissions, this.state)

		this.update = this.update.bind(this);
		this.cancel = this.cancel.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const canChangePassword = hasPermission(Permissions.ChangePassword, nextProps.user.user);
		const canEditUser = hasPermission(Permissions.EditUser, nextProps.user.user);

		if (canChangePassword !== this.state.canChangePassword || canEditUser !== this.state.canEditUser)
			this.setState({
				canChangePassword,
				canEditUser
			});
	}

	componentDidMount() {
		AuthService.fetch(api.host + ":" + api.port + "/api/user/" + this.props.match.params.id)
			.then(res => {
				if (!res.ok)
					throw res;
				return res.json();
			})
			.then(data => {
				if (data) {
					this.setState({
						user: data,
						user_old: data,
						loading: false,
						inputDisabled: true
					});
				}
			})
			.catch(handleXhrError(this.props.snackbar));
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
			id: this.state.user._id,
			company: this.state.user.company,
			first_name: this.state.user.first_name,
			last_name: this.state.user.last_name,
			email: this.state.user.email,
			phone: this.state.user.phone,
			address: this.state.user.address,
		}

		let url = api.host + ":" + api.port + "/api/user";
		if (this.state.user.__t === "Partner")
			url = api.host + ":" + api.port + "/api/partner"

		AuthService.fetch(url, {
			method: "PUT",
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
					user_old: this.state.user,
					modified: false
				});

				this.props.snackbar.success("Utilisateur mis à jour avec succès");
			})
			.catch(handleXhrError(this.props.snackbar));
	}

	handleCheckboxChange = name => event => {
		const checked = event.target.checked;

		let data = {
			id: this.state.user._id
		};
		if (name === "admin") {
			data.admin = checked;
			this.setState({ adminCheckboxDisabled: true });
		}
		else if (name === "epge") {
			data.EPGE = checked;
			this.setState({ EPGECheckboxDisabled: true });
		}


		AuthService.fetch(api.host + ':' + api.port + "/api/user", {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data)
		})
			.then(res => {
				if (!res.ok)
					throw res;
				else {
					if (name === "admin")
						this.setState({ user: { ...this.state.user, admin: data.admin } })
					else if (name === "epge")
						this.setState({ user: { ...this.state.user, EPGE: data.EPGE } })

				}
			})
			.then(result => {
				if (result)
					this.setState({ user: result });
				if (name === "admin")
					this.setState({ adminCheckboxDisabled: false });
				else if (name === "epge")
					this.setState({ EPGECheckboxDisabled: false });
			})
			.catch(handleXhrError(this.props.snackbar));
	};

	render() {
		const { classes } = this.props;
		const { user, user_old } = this.state;

		if (!this.state.loading) {
			const title = (user_old.company ? "[" + user_old.company.toUpperCase() + "] - " : "") + user_old.last_name.toUpperCase() + " " + user_old.first_name

			let company, phone, address;
			let administration;

			if (user.__t === "Partner") {
				company = (
					<GridItem xs={12} sm={12} md={6}>
						<CustomInput
							labelText="Entreprise"
							id="company"
							formControlProps={{
								fullWidth: true
							}}
							inputProps={{
								value: user.company,
								onChange: this.handleChange,
								disabled: !this.state.canEditUser
							}}
						/>
					</GridItem>);

				phone = (
					<GridItem xs={12} sm={12} md={6}>
						<CustomInput
							labelText="Numéro de téléphone"
							id="phone"
							formControlProps={{
								fullWidth: true
							}}
							inputProps={{
								value: user.phone,
								onChange: this.handleChange,
								disabled: !this.state.canEditUser
							}}
						/>
					</GridItem>);

				address = (
					<GridItem xs={12} sm={12} md={6}>
						<CustomInput
							labelText="Adresse"
							id="address"
							formControlProps={{
								fullWidth: true
							}}
							inputProps={{
								value: user.address,
								onChange: this.handleChange,
								disabled: !this.state.canEditUser
							}}
						/>
					</GridItem>);
			}

			if (user.__t === "Administration") {
				administration = (
					<GridContainer>
						<GridItem xs={12} sm={12} md={12}>
							<FormControl className={classes.formControl} >
								<FormControlLabel
									control={
										<Checkbox
											disabled={this.state.adminCheckboxDisabled || !this.state.canEditUser}
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
											disabled={this.state.EPGECheckboxDisabled || !this.state.canEditUser}
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
					<GridContainer>
						<GridItem xs={12} sm={12} md={12}>
							<Card>
								<CardHeader color="primary">
									<h4 className={classes.cardTitleWhite}>{title} - Profil de l'utilisateur</h4>
									<p className={classes.cardCategoryWhite}>Complete your profile</p>
								</CardHeader>
								<CardBody>
									<GridContainer>
										<GridItem xs={12} sm={12} md={6}>
											<CustomInput
												labelText="Type"
												id="Type"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: user.__t,
													disabled: true
												}}
											/>
										</GridItem>
										{company}
										{address}
									</GridContainer>
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
													onChange: this.handleChange,
													disabled: !this.state.canEditUser
												}}
											/>
										</GridItem>
										<GridItem xs={12} sm={12} md={6}>
											<CustomInput
												labelText="Nom"
												id="last_name"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: user.last_name,
													onChange: this.handleChange,
													disabled: !this.state.canEditUser
												}}
											/>
										</GridItem>
									</GridContainer>
									<GridContainer>
										<GridItem xs={12} sm={12} md={6}>
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
										{phone}
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
							{this.state.canChangePassword &&
								<ChangePassword user={this.state.user} errorHandler={this.props.snackbar.error} successHandler={this.props.snackbar.success}></ChangePassword>
							}
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

export default withSnackbar(withUser(withStyles(styles)(UserProfile)));
