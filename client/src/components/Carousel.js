import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import i18n from '../components/i18n';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = theme => ({
	root: {
		maxWidth: 1150,
		flexGrow: 1,
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		height: 70,
		paddingLeft: theme.spacing.unit * 4,
		backgroundColor: theme.palette.background.default,
	},
	img: {
		height: 400,
		display: 'block',
		maxWidth: 1150,
		overflow: 'hidden',
		width: '100%',
	},
	//pour indiquer au visiteur qu'il peut cliquer sur le texte et l'image du carousel
	link: {
		cursor: 'pointer',
	},
});

class Carousel extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			activeStep: 0,
		};
	}


	handleNext = () => {
		this.setState(prevState => ({
			activeStep: prevState.activeStep + 1,
		}));
	};

	handleBack = () => {
		this.setState(prevState => ({
			activeStep: prevState.activeStep - 1,
		}));
	};

	handleStepChange = activeStep => {
		this.setState({ activeStep });
	};

	render() {
		const { classes, theme } = this.props;
		const { activeStep } = this.state;
		let lng = this.props.lng;

		//déclaration des projets affichés dans le carousel
		//propriété 'info' non affichée
		const tutorialSteps = [
			{
				label: i18n.t('carousel.Title1', { lng }),
				info: i18n.t('carousel.Text1', { lng }),
				imgPath: './pictures/project1.jpg',
				link: 'https://www.esilv.fr/portfolios/bermudzer-pricing-doption-bermudeennes/'
			},
			{
				label: i18n.t('carousel.Title2', { lng }),
				info: i18n.t('carousel.Text2', { lng }),
				imgPath: './pictures/project2.jpg',
				link: 'https://www.esilv.fr/portfolios/vinci-eco-drive-conception-et-pilotage-du-bloc-moteur-shell-eco-marathon-2015/'
			},
			{
				label: i18n.t('carousel.Title3', { lng }),
				info: i18n.t('carousel.Text3', { lng }),
				imgPath: './pictures/project3.jpg',
				link: 'https://www.esilv.fr/portfolios/id-cam-accessibilite-numerique-non-voyants-mal-voyants/'
			},
			{
				label: i18n.t('carousel.Title4', { lng }),
				info: i18n.t('carousel.Text4', { lng }),
				imgPath: './pictures/project4.jpg',
				link: 'https://www.esilv.fr/portfolios/analyse-big-data-des-sites-unesco-via-les-reseaux-sociaux/'
			},
		];

		const maxSteps = tutorialSteps.length;

		return (
			<div className={classes.root}>
				<div className={classes.link} onClick={() => window.open(tutorialSteps[activeStep].link, "_blank")}>
					<Paper square elevation={0} className={classes.header}>
						<Typography>{tutorialSteps[activeStep].label}</Typography>
					</Paper>
					<AutoPlaySwipeableViews
						axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
						index={activeStep}
						onChangeIndex={this.handleStepChange}
						enableMouseEvents
					>
						{tutorialSteps.map((step, index) => (
							<div key={step.label}>
								{Math.abs(activeStep - index) <= 2 ? (
									<img className={classes.img} src={step.imgPath} alt={step.label} />
								) : null}
							</div>
						))}
					</AutoPlaySwipeableViews>
				</div>
				<MobileStepper
					steps={maxSteps}
					position="static"
					activeStep={activeStep}
					className={classes.mobileStepper}
					nextButton={
						<Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
							{i18n.t('carousel.next', { lng })}
							{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
						</Button>
					}
					backButton={
						<Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
							{i18n.t('carousel.back', { lng })}
							{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
						</Button>
					}
				/>
			</div>
		);
	}
}

Carousel.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Carousel);
