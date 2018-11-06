import React from 'react';
import {Jumbotron, Button,Row,Col, Container} from 'reactstrap';
import ContainerPULV from './ContainerPULV';
import Paper from 'material-ui/Paper';
import i18n from './i18n';

console.log("Passed");
class JumbotronPULV extends React.Component {
	render() {
        const lng = this.props.lng;
		return (
            <div style = {{marginTop : 50+"px"}}>
                <Paper className="text-center"
                zDepth = {2}>
                    <h1 className="display-3" lng={lng}>{i18n.t('welcomePole.h1', {lng})}</h1><br/>
                    <p className="lead"></p>
                    <hr className="my-2" />
                    <ContainerPULV lng={lng} />
                    <p className="lead">
                    </p>
                </Paper>
            </div>
		);
	}
}
export default JumbotronPULV;