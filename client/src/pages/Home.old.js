import React, { Component } from 'react';
import i18n from '../components/i18n';
//import ContainerPULV from '../components/ContainerPULV';
import { Container, Row, Col } from 'react-grid-system';
import Carousel from '../components/Carousel.js';
import Button from '@material-ui/core/Button';

class Home extends Component {

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
    const lng = this.props.lng;
    return (
      <div>
        <JumbotronPresentation lng={lng} />
        <JumbotronPULV lng={lng} />
        <Container>
          <Row>
            <Col md={8} offset={{ md: 2 }}>
              <Carousel />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function JumbotronPresentation(props) {
  const lng = props.lng;
  /*const videoURL = 'https://www.devinci.fr/wordpress/video/poleleonarddevinci.mp4';
  const style = {
    video: {
      height: 600 + 'px',
    }
  }*/

  return (
    <div className="welcome"
      rounded={true}>

      <h1 className="description display-3 text-center" lng={lng}>{i18n.t('welcomePlatform.h1', { lng })}</h1>
      {/*
                  <video style = {style.video} className="background-video embed-responsive" loop autoPlay>
                      <source src={videoURL} type="video/mp4" />
                      <source src={videoURL} type="video/ogg" />
                      Your browser does not support the video tag.
                  </video>
              */}
    </div>
  );
}

function JumbotronPULV(props) {
  const lng = props.lng;
  return (
    <div style={{ marginTop: 50 + "px" }}>
      <div className="text-center"
        zDepth={2}>
        <h1 className="display-3" lng={lng}>{i18n.t('welcomePole.h1', { lng })}</h1><br />
        <p className="lead"></p>
        <hr className="my-2" />
        <ContainerPULV lng={lng} />
        <p className="lead">
        </p>
      </div>
    </div>
  );
}

function ContainerPULV(props) {
  const lng = props.lng;
  return (
    <Container fluid lng={lng}>
      <Row>
        <Col>
          <h2><b>{i18n.t('hybridation.h2', { lng })}</b></h2><br />
          <h3><b>{i18n.t('approche.h3', { lng })}</b></h3><br />
          <p>{i18n.t('presentation.p', { lng })}</p>
          <Button onClick={() => window.location.href = "https://www.devinci.fr/le-pole/la-transversalite/"} color="secondary">
            <div>{i18n.t('transvality.label', { lng })}</div>
          </Button>{' '}
          <Button onClick={() => window.location.href = "https://www.devinci.fr/le-pole/chiffres-cles/"} color="secondary">
            <div>{i18n.t('keys.label', { lng })}</div>
          </Button>{' '}
          <Button onClick={() => window.location.href = "https://www.devinci.fr/le-pole/le-projet-leonard-de-vinci/"} color="secondary">
            <div>{i18n.t('projectt.label', { lng })}</div>
          </Button>{' '}
          <Button onClick={() => window.location.href = "https://www.devinci.fr/programmes/"} color="secondary">
            <div>{i18n.t('program.label', { lng })}</div>
          </Button>{' '}
        </Col>
        <Col>
          <h2><b>{i18n.t('schools.h2', { lng })}</b></h2><br />
          <h3><b>{i18n.t('campus.h3', { lng })}</b></h3><br />
          <p>{i18n.t('leonard.p', { lng })}.</p>
          <Button onClick={() => window.location.href = "https://www.iim.fr/"} color="secondary">
            <div>IIM</div>
          </Button>{' '}
          <Button onClick={() => window.location.href = "https://www.esilv.fr/"} color="secondary">
            <div>ESILV</div>
          </Button>{' '}
          <Button onClick={() => window.location.href = "https://www.emlv.fr/"} color="secondary">
            <div>EMLV</div>
          </Button>{' '}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

