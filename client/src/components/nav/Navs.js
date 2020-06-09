import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
//import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import i18n from '../i18n';
import { Link } from 'react-router-dom';

import { UserContext } from "../../providers/UserProvider/UserProvider"

const styles = theme => ({
	root: {
		width: '100%',
	},
	grow: {
		flexGrow: 1,
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: 200,
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
	button: {
		margin: theme.spacing.unit,
		color: '#FFFFFF',
	},
	menuButton: {
		color: '#FFFFFF',
	},
	languageButton: {
		fontSize: 25,
		color: '#FFFFFF',
	},
	languageButtonMobile: {
		fontSize: 25,
		color: '#000000',
	}
});

class Navs extends React.Component {
	constructor(props) {
		super(props)
		this.styles = {
			title: {
				cursor: 'pointer',
			},
		};

		this.state = {
			anchorEl: null,
			mobileMoreAnchorEl: null
		}
	}

	handleProfileMenuOpen = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuClose = () => {
		this.setState({ anchorEl: null });
		this.handleMobileMenuClose();
	};

	handleMobileMenuOpen = event => {
		this.setState({ mobileMoreAnchorEl: event.currentTarget });
	};

	handleMobileMenuClose = () => {
		this.setState({ mobileMoreAnchorEl: null });
	};

	handleclick(event) {
		window.location.replace("/");
	}

	handleButtonClick(event) {
		this.setState({
			anchorEl: null,
			mobileMoreAnchorEl: null,
			user: {}
		});
	}

	handleLogged = e => {
		this.loadUser();
	}

	render() {
		const { mobileMoreAnchorEl } = this.state;
		const { classes } = this.props;
		//const isMenuOpen = Boolean(anchorEl);
		const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

		let lng = this.props.lng;

		let user;
		if (this.context.user._id)
			user =
				(<Button color="inherit" className={classes.button}>
					<div>{i18n.t('navs.welcome', { lng }) + " " + this.context.user.first_name + " " + this.context.user.last_name}</div>
				</Button>);

		const renderMobileMenu = (
			<Menu
				anchorEl={mobileMoreAnchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMobileMenuOpen}
				onClose={this.handleMobileMenuClose}
			>
				<Link to="/" >
					<MenuItem color="inherit">
						<div>{i18n.t('navs.home', { lng })}</div>
					</MenuItem>
				</Link>
				{this.context.user._id &&
					<Link to="/partner">
						<MenuItem color="inherit">
							<div>{i18n.t('navs.myprojects', { lng })}</div>
						</MenuItem>
					</Link>
				}
				<Link to={{ pathname: "/deposit", state: { reset: true } }}>
					<MenuItem color="inherit">
						<div>{i18n.t('navs.submit', { lng })}</div>
					</MenuItem>
				</Link>
				{this.context.user._id &&
					<Link to="/" onClick={this.context.disconnect}>
						<MenuItem color="inherit">
							<div>{i18n.t('navs.disconnect', { lng })}</div>
						</MenuItem>
					</Link>
				}
				{!this.context.user._id &&
					<Link to="/forgot">
						<MenuItem color="inherit">
							<div>{i18n.t('navs.linkLost', { lng })}</div>
						</MenuItem>
					</Link>
				}
				{
					/* <MenuItem color="inherit">
					<IconButton onClick={this.props.handleLngChange}>
						{lng === 'en' ? <img src="/fr_flag.png" height="24" width="32" alt="french flag" /> : <img src="/usuk_flag.png" height="24" width="32" alt="english flag" />}
					</IconButton>
					<IconButton onClick={this.handleProfileMenuOpen} color="inherit">
						<AccountCircle />
					</IconButton>
				</MenuItem>
				*/
				}

			</Menu>
		);

		return (
			<div className={classes.root}>
				<AppBar position="fixed" color='primary'>
					<Toolbar>
						<Link to="/">
							<img alt="logo PULV" src="/logo_pulv_blanc.png" height="60" width="60" style={{ marginTop: "5px", marginBottom: "5px" }} />
						</Link>

						{this.context.user._id && user}
						<div className={classes.grow} />
						<div className={classes.sectionDesktop}>
							<Link to="/" style={{ textDecoration: "none" }}>
								<Button color="inherit" className={classes.button}>
									<div>{i18n.t('navs.home', { lng })}</div>
								</Button>
							</Link>
							{this.context.user._id &&
								<Link to="/partner">
									<Button color="inherit" className={classes.button}>
										<div>{i18n.t('navs.myprojects', { lng })}</div>
									</Button>
								</Link>
							}
							<Link to={{ pathname: "/deposit", state: { reset: true } }} style={{ textDecoration: "none" }}>
								<Button color="inherit" className={classes.button}>
									<div>{i18n.t('navs.submit', { lng })}</div>
								</Button>
							</Link>
							{this.context.user._id &&
								<Link to="/" onClick={this.context.disconnect} style={{ textDecoration: "none" }}>
									<Button color="inherit" className={classes.button}>
										<div>{i18n.t('navs.disconnect', { lng })}</div>
									</Button>
								</Link>
							}
							{!this.context.user._id &&
								<Link to="/forgot" style={{ textDecoration: "none" }}>
									<Button color="inherit" className={classes.button}>
										<div>{i18n.t('navs.linkLost', { lng })}</div>
									</Button>
								</Link>
							}

							<IconButton onClick={this.props.handleLngChange}>
								{lng === 'en' ? <img src="/fr_flag.png" height="24" width="32" alt="french flag" /> : <img src="/usuk_flag.png" height="24" width="32" alt="english flag" />}
							</IconButton>
						</div>
						<div className={classes.sectionMobile}>
							<IconButton onClick={this.props.handleLngChange}>
								{lng === 'en' ? <img src="/fr_flag.png" height="24" width="32" alt="french flag" /> : <img src="/usuk_flag.png" height="24" width="32" alt="english flag" />}
							</IconButton>
							<IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
								<MoreIcon />
							</IconButton>
						</div>
					</Toolbar>
				</AppBar>
				{/*/renderMenu*/}
				{renderMobileMenu}
			</div>
		);
	}
}

Navs.contextType = UserContext;

Navs.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navs);
