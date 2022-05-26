import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import ReactMarkdown from "react-markdown/with-html";

import { api } from "../config.json"

const styles = theme => ({
	root: {
		padding: theme.spacing.unit * 2,
		flexGrow: 1,
	},
	paper: {
		margin: 'auto',
		padding: theme.spacing.unit * 4,
		textAlign: 'left',
		color: "rgba(0, 0, 0, 0.80)",
		maxWidth: 1150,
		flexGrow: 1,
	},
	logo: {
		margin: 'auto',
		display: 'block',
		maxWidth: '100%',
	},
});


class Closed extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			description: ""
		}
	}

	componentDidMount() {
		this.loadClosedText();
	}

	loadClosedText = () => {
		fetch(api.host + ":" + api.port +"/api/open", { crossDomain: true })
			.then(res => res.json())
			.then(data => {
				this.setState({ description: data.description });
			});
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<Grid className={classes.root}>
					<Paper className={classes.paper}>
						<Grid container>
							<Grid item xs={12}>
                            <ReactMarkdown source={this.state.description} />
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</div>
		);
	}
}

Closed.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Closed);