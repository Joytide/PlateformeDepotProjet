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
		const tutorialSteps = [{
			imgPath: './pictures/Visuel_PA4_18_08.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_23-24.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_36.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_47.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_56.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_65.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_84.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/project2.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/visuel_equipe.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_10.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_26.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_37.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_50.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_58.jpg.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_73.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_93.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/project4.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_18.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_3.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_40.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_52.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_59.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/Visuel_PA4_18_78.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/project1.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		},
		{
			imgPath: './pictures/visuel2.jpg',
			link: 'https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/'
		}].sort(() => Math.random() - 0.5);

		const maxSteps = tutorialSteps.length;

		return (
			<div className={classes.root}>
				<div className={classes.link} onClick={() => window.open(tutorialSteps[activeStep].link, "_blank")}>
					<Paper square elevation={0} className={classes.header}>					
					<a dangerouslySetInnerHTML={{__html :i18n.t('home.title_p2', { lng })}}></a>
					</Paper>
					<AutoPlaySwipeableViews
						axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
						index={activeStep}
						onChangeIndex={this.handleStepChange}
						enableMouseEvents
					>
						{tutorialSteps.map((step, index) => (
							<div key={step.index}>
								<img className={classes.img} src={step.imgPath} alt={"Projet ESILV"} />
							</div>
						))}
					</AutoPlaySwipeableViews>
				</div>
			</div>
		);
	}
}

Carousel.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Carousel);
