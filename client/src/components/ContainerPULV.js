import React from 'react';
import {Container,Row,Col} from 'react-grid-system'
import FlatButton from 'material-ui/FlatButton';
import i18n from './i18n';
console.log("Passed");
class ContainerPULV extends React.Component {
    render() {
        const lng = this.props.lng;
        return(
            <Container fluid  lng={lng}>
                <Row>
                    <Col>
                        <h2><b>{i18n.t('hybridation.h2', {lng})}</b></h2><br/>
                        <h3><b>{i18n.t('approche.h3', {lng})}</b></h3><br/>
                        <p>{i18n.t('presentation.p', {lng})}</p>
                        <FlatButton onClick={() => window.location.href="https://www.devinci.fr/le-pole/la-transversalite/"} secondary = {true} size="lg" label = {i18n.t('transvality.label', {lng})}/>{' '}
                        <FlatButton onClick={() => window.location.href="https://www.devinci.fr/le-pole/chiffres-cles/"} secondary = {true} size="lg" label = {i18n.t('keys.label', {lng})}/>{' '}
                        <FlatButton onClick={() => window.location.href="https://www.devinci.fr/le-pole/le-projet-leonard-de-vinci/"} secondary = {true} size="lg" label={i18n.t('projectt.label', {lng})}/>{' '}
                        <FlatButton onClick={() => window.location.href="https://www.devinci.fr/programmes/"} secondary = {true} size="lg" label ={i18n.t('program.label', {lng})}/>{' '}
                    </Col>
                    <Col>
                        <h2><b>{i18n.t('schools.h2', {lng})}</b></h2><br/>
                        <h3><b>{i18n.t('campus.h3', {lng})}</b></h3><br/>
                        <p>{i18n.t('leonard.p', {lng})}.</p>
                        <FlatButton onClick={() => window.location.href="https://www.iim.fr/"} secondary = {true} size="lg" label = 'IIM'/>{' '}
                        <FlatButton onClick={() => window.location.href="https://www.esilv.fr/"} secondary = {true} size="lg"label = 'ESILV'/>{' '}
                        <FlatButton onClick={() => window.location.href="https://www.emlv.fr/"} secondary = {true} size="lg" label = 'EMLV'/>{' '}
                    </Col>
                </Row>
            </Container>
        );

    }
}

export default ContainerPULV;
