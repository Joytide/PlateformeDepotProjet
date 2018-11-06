import React, { Component } from 'react';
import './Index.css';
import Navs from '../components/nav/Navs.js';
import JumbotronPULV from '../components/JumbotronPULV.js';
import Carousel from '../components/Carousel.js'
import '../components/components.css';
import Cards from '../components/Cards';
import { Container, Row, Col } from 'react-grid-system'
import JumbotronPresentation from '../components/JumbotronPresentation';

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
        <JumbotronPULV lng={lng}/>
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

export default Home;