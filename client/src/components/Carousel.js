import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import i18n from '../components/i18n';


const styles = theme => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		width: "100%",
		height: 70,
		paddingLeft: theme.spacing.unit * 4,
		backgroundColor: theme.palette.background.default,
	},
	img: {
		display: "block",
		maxWidth: "100%",
		maxHeight: "400px",
		width: "auto",
		height: "auto",
		margin: "auto"
	},
	//pour indiquer au visiteur qu'il peut cliquer sur le texte et l'image du carousel
	link: {
		cursor: 'pointer',
	},
});

class Carousel extends React.Component {
	constructor(props) {
		super(props)

		this.tutorialSteps = [{
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
		}];

		this.state = {
			actualStep: Math.round(Math.random() * (this.tutorialSteps.length - 1)),
		};
	}

	componentWillMount() {
		this.timer = setInterval(() => {
			this.setState({ actualStep: Math.round(Math.random() * (this.tutorialSteps.length - 1)) })
		}, 1500);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		const { classes } = this.props;
		let lng = this.props.lng;
		
		return (
			<Grid container className={classes.root}>
				<Grid item xs={12}>
					<Paper square elevation={0} className={classes.header} >
						<a dangerouslySetInnerHTML={{ __html: i18n.t('home.title_p2', { lng }) }}></a>
					</Paper>
				</Grid>
				<Grid item xs={12} onClick={() => window.open(this.tutorialSteps[this.state.actualStep].link, "_blank")} >
					<img className={classes.img} src={this.tutorialSteps[this.state.actualStep].imgPath} alt={"Projet ESILV"} />
				</Grid>
			</Grid>
		);
	}
}

Carousel.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Carousel);
