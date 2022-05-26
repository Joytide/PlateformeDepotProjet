import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import i18n from '../components/i18n';

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
		const lng = this.props.lng;

		return (
            <div>
                <Grid container justify="center">
                    <Grid item xs={6}>
                        <Paper elevation={1}>
                            <Typography variant="h1" align="center">
                                404 !
                            </Typography>
                            <Typography variant="h4" align="center">
                                <span role="img" aria-labelledby="jsx-a11y/accessible-emoji" >😢</span>
                            </Typography>
                            <Typography variant="subtitle1" align="center" >
                                {i18n.t('notfound.label', { lng })}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
	}
}

Closed.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Closed);