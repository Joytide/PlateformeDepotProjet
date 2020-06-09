import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components
import HeaderLinks from "components/Header/HeaderLinks.jsx";

import sidebarStyle from "assets/jss/material-dashboard-react/components/sidebarStyle.jsx";
import { withUser } from "providers/UserProvider/UserProvider"

const Sidebar = ({ ...props }) => {
	// verifies if routeName is the one active (in browser input)
	function activeRoute(routeName) {
		return routeName === props.location.pathname;
		//return props.location.pathname.indexOf(routeName) > -1 ? true : false;
	}
	const { classes, color, image, routes } = props;

	var links = (
		<List className={classes.list}>
			{routes.map((prop, key) => {
				if (prop.redirect) return null;
				if (prop.invisible) return null;
				if (!hasPermission(prop.permissions, props.user.user)) return null;

				var activePro = " ";
				var listItemClasses;
				listItemClasses = classNames({
					[" " + classes[color]]: activeRoute(prop.path)
				});
				const whiteFontClasses = classNames({
					[" " + classes.whiteFont]: activeRoute(prop.path)
				});

				return (
					<NavLink
						to={prop.path}
						className={activePro + classes.item}
						activeClassName="active"
						key={key}
					>
						<ListItem button className={classes.itemLink + listItemClasses}>
							<ListItemIcon className={classes.itemIcon + whiteFontClasses}>
								{typeof prop.icon === "string" ? (
									<Icon>{prop.icon}</Icon>
								) : (
										<prop.icon />
									)}
							</ListItemIcon>
							<ListItemText
								primary={prop.sidebarName}
								className={classes.itemText + whiteFontClasses}
								disableTypography={true}
							/>
						</ListItem>
					</NavLink>
				);
			})}
		</List>
	);
	/*var brand = (
	  <div className={classes.logo}>
		<a href="https://www.creative-tim.com" className={classes.logoLink}>
		  <div className={classes.logoImage}>
			<img src={logo} alt="logo" className={classes.img} />
		  </div>
		  {logoText}
		</a>
	  </div>
	);*/
	return (
		<div>
			<Hidden mdUp implementation="css">
				<Drawer
					variant="temporary"
					anchor="right"
					open={props.open}
					classes={{
						paper: classes.drawerPaper
					}}
					onClose={props.handleDrawerToggle}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
				>
					{/*brand*/}
					<div className={classes.sidebarWrapper}>
						<HeaderLinks />
						{links}
					</div>
					{image !== undefined ? (
						<div
							className={classes.background}
							style={{ backgroundImage: "url(" + image + ")" }}
						/>
					) : null}
				</Drawer>
			</Hidden>
			<Hidden smDown implementation="css">
				<Drawer
					anchor="left"
					variant="permanent"
					open
					classes={{
						paper: classes.drawerPaper
					}}
				>
					{/*brand*/}
					<div className={classes.sidebarWrapper}>{links}</div>
					{image !== undefined ? (
						<div
							className={classes.background}
							style={{ backgroundImage: "url(" + image + ")" }}
						/>
					) : null}
				</Drawer>
			</Hidden>
		</div>
	);
};

Sidebar.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withUser(withStyles(sidebarStyle)(Sidebar));

const hasPermission = (authorized, user) => {
	if (user.admin)
		return true;
	if (authorized === "")
		return true;
	else if (typeof authorized === "string") {
		if (authorized === "EGPE" && user.EPGE)
			return true;
		return false;
	} else {
		return false;
	}
}