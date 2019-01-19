import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import i18n from '../i18n';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
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
  languageButton: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  languageButtonMobile: {
    fontSize: 30,
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
      lng: 'en'
    }
  }
  
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

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

	}

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    let lng = this.props.lng;

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem component={Link} to="/Connection" color="inherit" className={classes.menuButton}>
            <div>{i18n.t('login.label', {lng} )}</div>
        </MenuItem>
        <MenuItem component={Link} to="/Admin" color="inherit" className={classes.menuButton}>
            <div>{i18n.t('admin.label', {lng} )}</div>
        </MenuItem>
        <MenuItem component={Link} to="/forgot" color="inherit" className={classes.menuButton}>
            <div>{i18n.t('linkLost.label', {lng} )}</div>
        </MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <Link to="/">
          <MenuItem color="inherit" className={classes.menuButton}>
              <div>{i18n.t('home.label', {lng} )}</div>
          </MenuItem>
        </Link>
        <Link to="/Projects">
          <MenuItem color="inherit" className={classes.menuButton}>
              <div>{i18n.t('projects.label', {lng} )}</div>
          </MenuItem>
        </Link>
        <Link to="/Deposit">
          <MenuItem color="inherit" className={classes.menuButton}>
              <div>{i18n.t('submit.label', {lng} )}</div>
          </MenuItem>
        </Link>
        <MenuItem  color="inherit" className={classes.menuButton}>
          <IconButton onClick={this.props.handleLngChange} className ="EN">
            <Icon className={classes.languageButtonMobile}></Icon>
          </IconButton>
          <IconButton onClick={this.handleProfileMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static" color='primary'>
           <Toolbar>
            <Link to="/">
             <img style={this.styles.title} alt="logo PULV" src="/logo_pulv.png" height="50" width="50"/>
            </Link>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Link to="/">
                <Button color="inherit" className={classes.button}>
                  <div>{i18n.t('home.label', {lng} )}</div>
                </Button>
              </Link>
              <Link to="/Projects">
                <Button color="inherit" className={classes.button}>
                  <div>{i18n.t('projects.label', {lng} )}</div>
                </Button>
              </Link>
              <Link to="/Deposit">
                <Button color="inherit" className={classes.button}>
                  <div>{i18n.t('submit.label', {lng} )}</div>
                </Button>
              </Link>

              <IconButton onClick={this.props.handleLngChange} className ="EN">
                  {lng === 'en' ? <img src="/fr_flag.png" height="24" width="32" alt="french flag"/>:<img src="/usuk_flag.png" height="24" width="32" alt="english flag"/>}
              </IconButton>
              
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

Navs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navs);