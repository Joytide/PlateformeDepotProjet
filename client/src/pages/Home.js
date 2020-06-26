import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import i18n from '../components/i18n';
import Carousel from '../components/Carousel.js';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import ReactMarkdown from "react-markdown/with-html";


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


class HomePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			homeTextFr: "",
			homeTextEn: ""
		}
	}

	componentDidMount() {
		this.loadHomeText();
	}

	loadHomeText = () => {
		fetch("/api/settings/home")
			.then(res => {
				if (res.ok)
					return res.json();
				else
					throw res;
			})
			.then(data => {
				this.setState({
					homeTextEn: data.homeTextEn,
					homeTextFr: data.homeTextFr
				});
			});
	}

	render() {
		let lng = this.props.lng;
		const { classes } = this.props;

		return (
			<div>
				<Grid className={classes.root}>
					<Paper className={classes.paper}>
						<Grid container>
							<Grid item xs={12}>
								<ReactMarkdown
									source={this.props.lng === "fr" ? this.state.homeTextFr : this.state.homeTextEn}
									escapeHtml={false}
								/>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</div>
		);
	}
}

HomePage.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(HomePage);