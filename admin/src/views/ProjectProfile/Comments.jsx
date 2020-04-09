import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import AuthService from "components/AuthService"
import { api } from "../../config"
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import { withUser } from "../../providers/UserProvider/UserProvider";
import { handleXhrError } from "../../components/ErrorHandler";

const styles = theme => ({
	card: {
		margin: theme.spacing.unit,
		position: "fixed",
		bottom: 2 * theme.spacing.unit,
		right: 2 * theme.spacing.unit,
		zIndex: 9999,
		maxWidth: "25vw",
		width: "25vw"
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	actions: {
		display: 'flex',
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	avatar: {
		backgroundColor: red[500],
	},
	title: {
		marginLeft: "10px"
	},
	overflow: {
		overflowY: "scroll",
		maxHeight: "70vh"
	}
});

class Comments extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			message: "",
			messages: [],
			expanded: true,
			loadingMessages: true
		}
	}

	componentWillMount() {
		this.loadMessages();
	}

	handleExpandClick = () => {
		this.setState(state => ({ expanded: !state.expanded }));
	};

	handleChange = e => {
		this.setState({ [e.target.id]: e.target.value })
	}

	loadMessages = () => {
		AuthService.fetch(api.host + ":" + api.port + "/api/comment/" + this.props.projectId, {
			method: "GET"
		})
			.then(res => {
				if (res.ok)
					return res.json();
				else
					throw res;
			})
			.then(data => {
				this.setState({
					messages: data.comments,
					loadingMessages: false
				});
			})
			.catch(handleXhrError(this.props.snackbar));
	}

	sendMessage = e => {
		if (e.keyCode === 13) {
			const data = {
				id: this.props.projectId,
				content: this.state.message,
				author: this.props.user.user._id
			};

			AuthService.fetch(api.host + ":" + api.port + "/api/comment", {
				method: "POST",
				body: JSON.stringify(data)
			})
				.then(res => {
					if (res.ok)
						return res.json();
					else
						throw res;
				})
				.then(data => {
					console.log(data);
					this.setState({
						message: "",
						messages: [...this.state.messages, { ...data, author: this.props.user.user }]
					});
				})
				.catch(handleXhrError(this.props.snackbar));
		}
	}

	render() {
		const { classes } = this.props;

		let messageDisplay;

		if (!this.state.loadingMessages) {
			messageDisplay = this.state.messages.map(message =>
				<React.Fragment key={message._id}>
					{message.author._id !== this.props.user.user._id &&
						<GridItem xs={2}></GridItem>
					}
					<GridItem xs={10}>
						<Typography variant="caption" gutterBottom align={message.author._id !== this.props.user.user._id ? "right" : "left"}>
							{message.author.first_name + " " + message.author.last_name}
						</Typography>
						<Typography variant="body1" gutterBottom align={message.author._id !== this.props.user.user._id ? "right" : "left"}>
							{message.content}
						</Typography>
					</GridItem>
				</React.Fragment>
			)
		}

		return (
			<Card className={classes.card}>
				<CardActions className={classes.actions} disableActionSpacing>
					<Typography className={classes.title} component="p">Commentaires</Typography>
					<IconButton
						className={classnames(classes.expand, {
							[classes.expandOpen]: this.state.expanded,
						})}
						onClick={this.handleExpandClick}
						aria-expanded={this.state.expanded}
						aria-label="Show more"
					>
						<ExpandMoreIcon />
					</IconButton>
				</CardActions>
				<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
					<CardContent className={classes.overflow} >
						<GridContainer>
							{messageDisplay}
						</GridContainer>
					</CardContent>
					<CardActions>
						<TextField
							id="message"
							label="Message (entrer pour envoyer)"
							fullWidth={true}
							value={this.state.message}
							onChange={this.handleChange}
							onKeyDown={this.sendMessage}
						/>
					</CardActions>
				</Collapse>
			</Card>
		);
	}
}

Comments.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withUser(withSnackbar(withStyles(styles)(Comments)));