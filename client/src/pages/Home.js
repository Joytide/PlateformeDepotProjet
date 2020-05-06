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

const styles = theme => ({
	root: {
		padding: theme.spacing.unit * 2,
		flexGrow: 1,
	},
	paper: {
		margin: 'auto',
		padding: theme.spacing.unit * 4,
		textAlign: 'left',
		color: theme.palette.text.secondary,
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
	render() {
		let lng = this.props.lng;
		const { classes } = this.props;

		return (
			<div>
				<Grid className={classes.root}>
					<Paper className={classes.paper}>
						<Grid container direction="column" justify="center" spacing={24}>
							<Grid item>
								<Grid container alignItems="center" justify="center" spacing={32}>
									<Grid item xs={3}>
										<img className={classes.logo} alt="logo_esilv" src="./logo_esilv.png" />
									</Grid>
									<Grid item xs={9}>
										<Typography variant="h3">
											{i18n.t('home.title', { lng })}
										</Typography>
									</Grid>
								</Grid>

								<br /><br />

								<Typography>
									{i18n.t('home.title_p1', { lng })}<br />
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Carousel lng={lng} />
							</Grid>
							<Grid item>
								<Typography variant="h5">{i18n.t('home.p1', { lng })}</Typography>
								<Typography align="justify">
									{i18n.t('home.p1_l1', { lng })}<br />
									{i18n.t('home.p1_l2', { lng })}
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="h5">{i18n.t('home.p2', { lng })}</Typography>
								<Typography align="justify">
									{i18n.t('home.p2_l1', { lng })}<br />
									{i18n.t('home.p2_l2', { lng })}<br />
									{i18n.t('home.p2_l3', { lng })}<br />
									{i18n.t('home.p2_l4', { lng })}<br />
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="h5">{i18n.t('home.p3', { lng })}</Typography>
								<Typography align="justify">
									{i18n.t('home.p3_l1', { lng })}<br />
									{i18n.t('home.p3_l2', { lng })}<br />
									{i18n.t('home.p3_l3', { lng })}<br />
									{i18n.t('home.p3_l4', { lng })}<br />
									{i18n.t('home.p3_l5', { lng })}<br />
									{i18n.t('home.p3_l6', { lng })}<br />
									{i18n.t('home.p3_l7', { lng })}<br />
									{i18n.t('home.p3_l8', { lng })}<br />
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="h5">{i18n.t('home.p4', { lng })}</Typography>
								<br />
								<Typography align="justify">
									<Link to="/deposit" style={{ textDecoration: "none" }} >
										<Button variant="contained" color="primary">{i18n.t('home.p4_l1', { lng })}</Button>
									</Link>
									<br /><br />
									<a dangerouslySetInnerHTML={{ __html: i18n.t('home.p4_l2', { lng }) }}></a><br />
									<a dangerouslySetInnerHTML={{ __html: i18n.t('home.p4_l3', { lng }) }}></a><br />
									<a dangerouslySetInnerHTML={{ __html: i18n.t('home.p4_l4', { lng }) }}></a><br />
									<a dangerouslySetInnerHTML={{ __html: i18n.t('home.p4_l5', { lng }) }}></a><br />
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="h5">{i18n.t('home.p5', { lng })}</Typography>
								<Typography style={{ textAlign: 'right' }}>
									{i18n.t('home.p5_l1', { lng })}
								</Typography>
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