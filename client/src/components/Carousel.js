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

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

//déclaration des projets affichés dans le carousel
//propriété 'info' non affichée
const tutorialSteps = [
  {
    label: 'BermudZer : pricing d’options bermudéennes',
    info: 'Projet d’Innovation Industrielle de 5ème année, Majeure Ingénierie Financière 2014-2015',
    imgPath: './pictures/project1.jpg',
    link:'https://www.esilv.fr/portfolios/bermudzer-pricing-doption-bermudeennes/'
  },
  {
    label : 'Vinci Eco Drive – Conception et pilotage du Bloc moteur, Shell Eco-Marathon 2015',
    info: 'Projet d’Innovation Industrielle de 5ème année, Majeure Mécanique numérique et modélisation 2014-2015',
    imgPath: './pictures/project2.jpg',
    link:'https://www.esilv.fr/portfolios/vinci-eco-drive-conception-et-pilotage-du-bloc-moteur-shell-eco-marathon-2015/'
  },
  {
    label: 'ID-cam : accessibilité numérique pour les non-voyants et mal-voyants',
    info: 'Projet 2017-2018 de 5e année du cursus d’élève ingénieur de l’ESILV, promo 2018',
    imgPath: './pictures/project3.jpg',
    link:'https://www.esilv.fr/portfolios/id-cam-accessibilite-numerique-non-voyants-mal-voyants/'
  },
  {
    label: 'Analyse Big Data des sites Unesco via les réseaux sociaux',
    info: 'Projet d’Innovation Industrielle de 5ème année, Majeure Informatique et sciences du numérique 2014-2015',
    imgPath: './pictures/project4.jpg',
    link:'https://www.esilv.fr/portfolios/analyse-big-data-des-sites-unesco-via-les-reseaux-sociaux/'
  },
];

const styles = theme => ({
  root: {
    maxWidth: 400,
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
    height: 255,
    display: 'block',
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
  },
  //pour indiquer au visiteur qu'il peut cliquer sur le texte et l'image du carousel
  link : {
    cursor: 'pointer',
  },
});

class SwipeableTextMobileStepper extends React.Component {
  state = {
    activeStep: 0,
  };

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
    const maxSteps = tutorialSteps.length;

    return (
      <div className={classes.root}>
        <div className={classes.link} onClick={() => window.location.href = tutorialSteps[activeStep].link}>
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
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </div>
    );
  }
}

SwipeableTextMobileStepper.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SwipeableTextMobileStepper);
