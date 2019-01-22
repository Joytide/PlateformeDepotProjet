import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from "@material-ui/core/Checkbox";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";


import avatar from "assets/img/faces/marc.jpg";

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
			loading: true,
			adminCheckboxDisabled: false,
			EPGECheckboxDisabled: false
		}
	}

	componentDidMount() {
		fetch(api.host + ":" + api.port + "/api/user/" + this.props.match.params.id)
			.then(res => res.json())
			.then(data => {
				if (data) {
					this.setState({
						user: data,
						loading: false,
						inputDisabled: true
					});
				}
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
									disabled: this.state.inputDisabled
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
									label="EPGE"
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
												id="first-name"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: user.first_name,
													disabled: this.state.inputDisabled
												}}
											/>
										</GridItem>
										<GridItem xs={12} sm={12} md={6}>
											<CustomInput
												labelText="Last Name"
												id="last-name"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: user.last_name,
													disabled: this.state.inputDisabled
												}}
											/>
										</GridItem>
									</GridContainer>
									<GridContainer>
										<GridItem xs={12} sm={12} md={12}>
											<CustomInput
												labelText="Email"
												id="email-address"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													value: user.email,
													disabled: this.state.inputDisabled
												}}
											/>
										</GridItem>
									</GridContainer>
									{administration}
								</CardBody>
							</Card>
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
