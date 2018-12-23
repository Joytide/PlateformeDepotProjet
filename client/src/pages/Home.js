import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import i18n from '../components/i18n';
import Carousel from '../components/Carousel.js';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    margin: 'auto',
    padding: theme.spacing.unit * 2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    maxWidth: 1150,
    flexGrow: 1,
  },
  logo: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});


class HomePage extends React.Component {

  handleKeyChosen(key) {
    if (key === "Student") {
      sessionStorage.setItem("Connected", "True");
      sessionStorage.setItem("typePerson", "3");
      window.location.reload();
    } else {
      sessionStorage.setItem("typePerson", "4");
      this.props.history.push("/Deposit");
    }
  }

  render() {
    let lng = this.props.lng;
    const { classes } = this.props;

    return (
      <div>
        <Grid className={classes.root}>
          <Grid container xs direction="column" justify="center" alignItems="center" spacing={24}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h3">
                  Projets Innovation Industrielle 18/19
                </Typography>

                <Typography>
                  Please find here this call for Projects in English : <a href ="http://projets.labs.esilv.fr/CallForProjects.pdf">http://projets.labs.esilv.fr/CallForProjects.pdf</a> including information on process and usual topics for each specialty.
                </Typography>

                <img className={classes.logo} alt="logo_esilv" src="./logo_esilv.png" />

              
                <Typography>
                  Vous êtes une entreprise, un laboratoire, un étudiant ? Vous souhaitez tester une idée, créer un prototype, déchiffrer et/ou explorer un terrain d'innovation, ... ?<br/>
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid xs container direction="row" justify="center" alignItems="center">
                  <Carousel />
                </Grid>
              </Paper>
            </Grid>


            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5">Proposez un projet à nos élèves !</Typography>
                <Typography>
                  Proposer un projet vous permettra de coopérer avec une équipe d'élèves ingénieurs motivés et innovants et de contribuer à leur formation en les impliquant dans des problématiques actuelles. <br/>
                  Entreprises ou laboratoires, c'est aussi un moyen de vous faire connaître auprès de ceux qui répondront dans les années futures à vos offres de stages et d'emplois.<br/>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5">Comment ça marche ?</Typography>
                <Typography>
                  Un groupe projet est constitué de 4 élèves (3 ou 5 éventuellement) qui travailleront chacun une dizaine d'heures par semaine sur votre projet.<br/>
                  Chaque groupe sera suivi et encadré par un enseignant de l'école ("directeur de projet") à même de les guider scientifiquement.<br/>
                  Ces projets concernent les élèves d'année 4 et d'année 5, avec un fonctionnement similaire et un calendrier un peu différent : les projets démarrent pour tous mi/fin septembre, et se terminent fin janvier pour les années 5 et fin mars pour les années 4.<br/>
                  Les élèves partant en stage après, il peut être possible que votre projet soit "poursuivi" en stage par un élève de l'équipe.<br/>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5">Quel va être mon rôle ?</Typography>
                <Typography>
                  Vous pourrez présenter votre projet (en direct et/ou via vidéo) lors des journées "lancements projets" :<br/>
                    * le 13 septembre (9h-12h30) pour les années 5<br/>
                    * le 18 septembre (9h-12h30) pour les années 4<br/>
                  Si votre projet est choisi, vous devenez alors "partenaire du projet".<br/>
                  L'équipe d'élèves prend alors contact avec vous pour démarrer le projet, puis vous tient au courant de l'évolution de ses travaux, par des échéances fixées ensemble, et enfin organise avec vous la clôture de projet la dernière semaine de janvier pour les années 5, de mars pour les années 4.<br/>
                  L'équipe sera suivie régulièrement tout au long de son projet par son "directeur de projet", qui sera aussi chargé de l'évaluer.<br/>
                  La fin du projet verra une réunion de restitution avec le partenaire (clôture de projet), suivie d'un showroom de présentations de tous les projets (le 31 janvier pour les A5 ; le 28 mars pour les A4) auquel vous serez bien entendu invité et bienvenu.<br/>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5">Comment proposer un projet ?</Typography>
                <Typography>
                  Cliquez sur [Soumettre un projet] en haut à droite de la page.<br/>
                  Vous devrez alors donner des information sur le partenaire puis décrire le projet proposé, et cibler les compétences voulues et attendues.<br/>
                  Vous trouverez des informations sur le fonctionnement et le contenu de ces projets (principales tâches pouvant être demandées, et domaines techniques à privilégier) ici : <a href="http://projets.labs.esilv.fr/ProjetsPI2_Info.pdf">http://projets.labs.esilv.fr/ProjetsPI2_Info.pdf</a><br/>
                  Deadline pour le dépôt des proposition de projets :  5 Septembre 2018<br/>
                  Pour toute question, n'hésitez pas à nous contacter : projetesilv@devinci.fr<br/>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5">Merci de votre participation, et à très bientôt.</Typography>
                <Typography style={{textAlign: 'right'}}>
                  L'EGPE (Equipe Gestion Projets ESILV)
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(HomePage);