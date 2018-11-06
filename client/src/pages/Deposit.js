import React, { Component } from 'react';
//import Navs from '../components/nav/Navs.js';
import FilesInputs from '../components/Deposit/FormComponents/FilesInputs';
import ReactDOM from 'react-dom';
import { Container, Row, Col } from 'react-grid-system'
import KeyWords from '../components/Deposit/FormComponents/KeyWords';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import { TextValidator, ValidatorForm, SelectValidator } from 'react-material-ui-form-validator';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import i18n from '../components/i18n';
/**
 * Deposit a project
 */
class Deposit extends Component {


  constructor(props) {
    super(props);
    const lng = this.props.lng;
    this.state = {
      finished: false,
      stepIndex: 0,
      title: "",
      study_year: [],
      majors_concerned: [],
      description: "",
      keyWords: [],
      files: [],
      urls: [],
      email: "",
      company: "",
      first_name: "",
      last_name: "",
      submited: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyWords = this.handleKeyWords.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleBlur = this.handleBlur.bind(this);


    this.majors = [{ name: i18n.t('ibo.label', { lng }), key: "IBO" },
    { name: i18n.t('ne.label', { lng }), key: "NE" },
    { name: i18n.t('if.label', { lng }), key: "IF" },
    { name: i18n.t('mnm.label', { lng }), key: "MNM" }]
  }

  componentWillUpdate(nextProps) {
    if (this.props.lng != nextProps.lng) {
      const lng = nextProps.lng;
      this.majors = [{ name: i18n.t('ibo.label', { lng }), key: "IBO" },
      { name: i18n.t('ne.label', { lng }), key: "NE" },
      { name: i18n.t('if.label', { lng }), key: "IF" },
      { name: i18n.t('mnm.label', { lng }), key: "MNM" }]
    }
  }

  //STEP
  handleNext = () => {
    console.log("Finished :" + this.state.finished)
    const { stepIndex } = this.state;
    if (!this.state.finished) {
      this.setState({
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2
      }, () => {
        this.handleSubmit();
      })
    }
    else {
      this.setState({
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2
      });
    }


  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  handleSpe(e, index, values) {
    this.setState({ majors_concerned: values }, () => { console.log(this.state.majors_concerned) })
  }

  handleBlur(event) {
    console.log(this.state)
    fetch("/api/partners/" + this.state.email)
      .then((res) => res.json())
      .then((partner) => {
        try {
          this.setState({ first_name: partner.first_name, last_name: partner.last_name, company: partner.company })
        } catch (e) {
          console.log("Email not found");
        }
      })
      .catch((err) => { console.log("Email not found") })
    console.log("passed")

  }

  FilesUpload() {
    return new Promise((resolve, reject) => {
      var formData = new FormData()
      /*Object.keys(this.state.files).forEach((key)=>{  //On parcourt la liste des fichiers
          const file = this.state.files[key]
          formData.append(key, new Blob([file], {type : file.type}), file.name || 'file') //On ajoute dans le formData le fichier
      })*/

      this.state.files.forEach((file) => {
        formData.append(file.name, new Blob([file], { type: file.type }), file.name || 'file')
      })

      fetch('/api/addFile', {
        method: 'POST',
        body: formData
      })
        .then((resp) => {
          resp.json().then((urls) => {
            console.log(urls)
            this.setState({ urls: urls })
            return resolve()
          });
        })
        .catch((err) => { return reject(err) })
    })

  }

  addViewFile() {

    const lng = this.props.lng;
    var Delete = (e) => {
      const fileIdToRemove = e.target.getAttribute('data-key')
      this.state.files.splice(this.state.files.findIndex((file) => {
        return file.id === fileIdToRemove;
      }), 1);
      this.addViewFile();
    }

    const html = (
      this.state.files.map((file, index) => {
        return (
          <a key={index} class="justify-content-between file-add list-group-item list-group-item-action">
            <div>
              <p>{file.name}</p>
              <p data-key={file.id} className="text-right" onClick={Delete}>{i18n.t('delete.label', { lng })} </p>
            </div>
          </a>)
      })
    )
    ReactDOM.render(html, document.getElementById("addedFiles"))
  }

  handleFiles(event) {
    console.log(event);
    this.setState({ files: event }, () => {
      console.log(this.state.files);
      this.addViewFile()
    });
  }

  handleKeyWords(key) {

    var keys = [];
    key.forEach(element => {
      keys.push(element)
    });
    console.log(keys)
    this.setState({ keyWords: keys });
    console.log(this.state.keyWords)
  }

  handleSubmit() {
    console.log("finished : " + this.state.finished)
    if (this.state.finished) {
      console.log("Passed")
      this.FilesUpload()
        .then(() => {
          const form = {
            title: this.state.title,
            study_year: this.state.study_year,
            majors_concerned: this.state.majors_concerned,
            description: this.state.description,
            keywords: this.state.keyWords,
            email: this.state.email,
            company: this.state.company,
            media_files: this.state.urls,
            first_name: this.state.first_name,
            last_name: this.state.last_name
          }

          console.log(form);
          try {
            fetch('/api/projects', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(form)
            })
              .then((res) => {
                this.setState({ submited: true })
                console.log(res)
              })
              .catch((error) => {
                console.log(error)
              })
          }
          catch (error) {
            return console.log(error);
          }
        })
        .catch((err) => { console.log("ERROR UPLOAD FILE") })
      this.handleNext();
    }
  }

  handleChange(e, index, values) {
    switch (e.target.name) {
      case "year":
        var temp = this.state.study_year;
        if (e.target.checked) {
          temp.push(e.target.value);
        }
        else {
          var index = temp.indexOf(e.target.value)
          if (index > -1) {
            temp.splice(index, 1);
          }
        }
        console.log(this.state.study_year)
        this.setState({ study_year: temp });
        break;

      default:
        this.setState({
          [e.target.name]: e.target.value
        })
        console.log(this.state.email)
        console.log(this.state.title)
    }
  }

  getStepContent(stepIndex) {
    const lng = this.props.lng;
    switch (stepIndex) {
      //Information about the partner
      case 0:
        return <div>

          <Container>
            <h2>Proposer un projet a nos élèves</h2>
            <p> Proposer un projet vous permettra de coopérer avec une équipe d'élèves ingénieurs motivés et innovants et de contribuer à leur formation en les impliquant dans des problématiques actuelles.
Entreprises ou laboratoires, c'est aussi un moyen de vous faire connaître auprès de ceux qui répondront dans les années futures à vos offres de stages et d'emplois. </p>

            <h2>Comment ça marche ?</h2>
            <p>Un groupe projet est constitué de 4 élèves (3 ou 5 éventuellement) qui travailleront chacun une dizaine d'heures par semaine sur votre projet. Chaque groupe sera suivi et encadré par un enseignant de l'école ("directeur de projet") à même de les guider scientifiquement.
Ces projets concernent les élèves d'année 4 et d'année 5, avec un fonctionnement similaire et un calendrier un peu différent : les projets démarrent pour tous mi/fin septembre, et se terminent fin janvier pour les années 5 et fin mars pour les années 4. Les élèves partant en stage après, il peut être possible que votre projet soit "poursuivi" en stage par un élève de l'équipe.
</p>

            <h2>Quel va être mon rôle ?</h2>
            Si votre projet est choisi, vous devenez alors "partenaire du projet". L'équipe d'élèves prend alors contact avec vous pour démarrer le projet, puis vous tient au courant de l'évolution de ses travaux, par des échéances fixées ensemble, et enfin organise avec vous la clôture de projet la dernière semaine de janvier pour les années 5, de mars pour les années 4.
L'équipe sera suivie régulièrement tout au long de son projet par son "directeur de projet", qui sera aussi chargé de l'évaluer. Plusieurs revues projets et pitchs jalonneront le projet, qui se terminera par un showroom auquel vous serez bien entendu invité.

      <h2>Comment proposer un projet ?</h2>
            Cliquez sur [SUIVANT] en bas de la page. Vous devrez alors donner des information sur le partenaire puis décrire le projet proposé, et cibler les compétences voulues et attendues.

Pour plus d'informations, vous pouvez trouver une présentation succincte  de ces projets, ainsi que des exemples effectués les années précédentes en http://www.esilv.fr/formations/projets/projet-dinnovation-industrielle-5/ pour les années 5 et http://www.esilv.fr/formations/projets/projet-dinnovation-industrielle-4/ pour les années 4.
Des renseignements plus précis, ainsi qu'un calendrier seront fournis en septembre.


Pour toute question, n'hésitez pas à nous contacter : projetesilv@devinci.fr
      </Container>
        </div>

        break

      case 1:
        return <div>
          <h2 lng={lng} style={{ textAlign: 'center' }}>{i18n.t('tellus.label', { lng })}</h2>
          <Container >
            <Row>
              <Col md={6} offset={{ md: 3 }}>
                <TextValidator lng={lng}
                  floatingLabelText={i18n.t('email.label', { lng })}
                  validators={['required', 'isEmail']}
                  errorMessages={[i18n.t('field.label', { lng }), i18n.t('notvalid.label', { lng })]}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  name="email"
                  value={this.state.email}
                  fullWidth={true} />
              </Col>
            </Row>

            <Row>
              <Col md={6} offset={{ md: 3 }}>
                <TextValidator lng={lng}
                  validators={['required']}
                  errorMessages={i18n.t('field.label', { lng })}
                  floatingLabelText={i18n.t('company.label', { lng })}
                  onChange={this.handleChange}
                  name="company" value={this.state.company}
                  fullWidth={true} />
              </Col>
            </Row>

            <Row>
              <Col md={6} offset={{ md: 3 }}>
                <TextValidator lng={lng}
                  validators={['required']}
                  errorMessages={i18n.t('field.label', { lng })}
                  floatingLabelText={i18n.t('firstname.label', { lng })}
                  onChange={this.handleChange} fullWidth={true}
                  name="first_name" value={this.state.first_name} />
              </Col>
            </Row>
            <Row>
              <Col md={6} offset={{ md: 3 }}>
                <TextValidator lng={lng}
                  validators={['required']}
                  errorMessages={i18n.t('field.label', { lng })}
                  floatingLabelText={i18n.t('lastname.label', { lng })}
                  onChange={this.handleChange} fullWidth={true}
                  name="last_name" value={this.state.last_name} />
              </Col>
            </Row>

          </Container>
        </div>

      /**
       * Information about the project
       */
      case 2:
        return <div lng={lng} >
          <h2 style={{ textAlign: 'center' }}>{i18n.t('projectPres.h2', { lng })}</h2>
          <Container>
            <Row>
              <Col md={6} offset={{ md: 3 }}>
                <TextValidator
                  floatingLabelText={i18n.t('titleproj.label', { lng })}
                  onChange={this.handleChange} fullWidth={true}
                  name="title" value={this.state.title}
                  validators={['required']}
                  errorMessages={i18n.t('field.label', { lng })} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={3} offset={{ md: 3 }}>
                <Checkbox
                  label={i18n.t('year4.label', { lng })}
                  name="year"
                  value="A4"
                  onCheck={this.handleChange} />
              </Col>
              <Col md={3}>
                <Checkbox
                  label={i18n.t('year5.label', { lng })}
                  name="year"
                  value="A5"
                  onCheck={this.handleChange} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6} offset={{ md: 3 }}>
                <SelectValidator
                  multiple={true} hintText={i18n.t('majors.label', { lng })}
                  value={this.state.majors_concerned}
                  onChange={this.handleSpe.bind(this)} fullWidth={true}
                  name="majors_concerned"
                  floatingLabelText={i18n.t('majors.label', { lng })}
                  validators={["required"]}
                  errorMessages={i18n.t('field.label', { lng })}>

                  {this.majors.map((major) => <MenuItem
                    key={major.key}
                    insetChildren={true}
                    checked={this.state.majors_concerned.indexOf(major.key) > -1}
                    value={major.key}
                    primaryText={major.name}
                  />)}
                </SelectValidator>
              </Col>
            </Row>
            <Row>
              <Col md={8} offset={{ md: 2 }}>
                <TextValidator
                  hintText={i18n.t('descriptionProj.label', { lng })}
                  floatingLabelText="Description *"
                  multiLine={true}
                  value={this.state.description}
                  validators={["required"]}
                  errorMessages={i18n.t('field.label', { lng })}
                  rows={10}
                  name="description"
                  onChange={this.handleChange}
                  fullWidth={true} />
              </Col>
            </Row>
            <Row>
              <Col md={8} offset={{ md: 2 }}>
                <KeyWords lng={lng} change={this.handleKeyWords} />
              </Col>
            </Row>
            <Row>
              <Col md={8} offset={{ md: 2 }}>
                <FilesInputs lng={lng} change={this.handleFiles} />
              </Col>
            </Row>
          </Container>
        </div>;
      case 3:
        if (!this.state.submited) {
          return <CircularProgress />
        }
        else {
          <Container lng={lng} >
            <Row>
              <Col md={8} offset={{ md: 2 }}>
                <div> {i18n.t('message.label', { lng })} </div>
              </Col>
            </Row>
          </Container>
        }
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const lng = this.props.lng;
    const { finished, stepIndex } = this.state;
    return (
      <div id="deposit-body">

        <Paper zDepth={1} style={{ width: '100%', maxWidth: 1000, margin: 'auto', marginTop: 10 }}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>Appel à projets</StepLabel>
            </Step>
            <Step>
              <StepLabel lng={lng} >{i18n.t('partnerInfo.label', { lng })}</StepLabel>
            </Step>
            <Step>
              <StepLabel lng={lng} >{i18n.t('projectInfo.label', { lng })}</StepLabel>
            </Step>
            <Step>
              <StepLabel lng={lng} >{i18n.t('submission.label', { lng })}</StepLabel>
            </Step>
          </Stepper>

          <div>
            {finished ? (

              <Container lng={lng} >
                <Row>
                  <Col md={8} offset={{ md: 2 }}>
                    {this.state.submited ? (<div><div>{i18n.t('message.label', { lng })}</div>
                      <br />
                      <a
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          this.setState({ stepIndex: 0, finished: false });
                        }}
                      >
                        {i18n.t('click.label', { lng })}
                      </a> {i18n.t('example.label', { lng })}
                    </div>) : (
                        <div style={{ textAlign: 'center' }}><CircularProgress /></div>)}
                  </Col>
                </Row>
              </Container>
            ) : (
                <div>
                  <ValidatorForm ref="form" onSubmit={this.handleNext}>
                    {this.getStepContent(stepIndex)}
                    <div style={{ marginTop: 12, paddingBottom: 30, textAlign: 'center' }}>
                      <FlatButton lng={lng}
                        label={i18n.t('back.label', { lng })}
                        disabled={stepIndex === 0}
                        onClick={this.handlePrev}
                        style={{ marginRight: 12 }}
                      />
                      <RaisedButton lng={lng}
                        label={stepIndex === 2 ? i18n.t('finish.label', { lng }) : i18n.t('next.label', { lng })}
                        type="submit"
                        primary={true}
                      />
                    </div>
                  </ValidatorForm>
                </div>
              )}
          </div>
        </Paper>
      </div>
    );
  }
}

export default Deposit;
