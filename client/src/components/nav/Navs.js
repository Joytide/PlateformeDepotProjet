import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { Container, Row, Col } from 'react-grid-system'
import FlagIcon from 'react-flag-kit/lib/FlagIcon';
import IconButton from 'material-ui/IconButton';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup'
import { Link } from 'react-router-dom';
import {
	Icon_Flag_US,
	Icon_Flag_FR
} from 'material-ui-country-flags';
import i18n from '../i18n';

class Navs extends React.Component {
	constructor(props) {
		super(props)
		this.styles = {
			title: {
				cursor: 'pointer',
			},
			menuItem: {
				color: 'white',
			},
		};
		this.state = {lng: 'en'}
	}

	handleclick(event) {
		window.location.replace("/");
	}

	handleButtonClick(event) {

	}

	render() {
		let lng = this.props.lng;

		var configItem = [
			{ label: i18n.t('home.label', {lng} ), href: "/" },
			{ label: i18n.t('projects.label', {lng}), href: "/Projects" },
			{ label: i18n.t('submit.label', {lng}), href: "/Deposit" },
			{ label: i18n.t('login.label', {lng}), href: "/Connection" },
			{ label: i18n.t('admin.label', {lng}), href: "/Admin" },
			{ label: i18n.t('linkLost.label', {lng}), href: "/forgot" },
			{ label: "FR", href: "#", icon: true },
			{ label: "EN", href: "#", icon: true }
		]
		var menu = <Container><Row align='center'> {configItem.map((item) => {
			if (item.icon) {
				switch (item.label) {
					case "FR":
						return (<IconButton onClick={this.props.handleLngChange} className = "FR">
							<FlagIcon code = "FR"/>
						</IconButton>)
						break;
					case "EN":
						return (
							<IconButton onClick={this.props.handleLngChange} className="EN">
								<FlagIcon code = "GB"/>
							</IconButton>)
						break;
				}

			} else {
				return <Link key={item.label} to={item.href}>
					<FlatButton label={item.label} style={this.styles.menuItem} />
				</Link>
			}
		})}
		</Row>
		</Container>
		return (
			<div>
				<AppBar
					title={<img style={this.styles.title} src="/logo_pulv.png" height="50" width="50" />}
					onTitleClick={this.handleclick.bind(this)}
					iconElementRight={menu}
					showMenuIconButton={false} />
			</div>
		);
	}
}
export default Navs;