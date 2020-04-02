import React, { createContext } from "react"; // on importe createContext qui servira à la création d'un ou plusieurs contextes
import PropTypes from 'prop-types';
/*
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
*/
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';

const DEFAULT_DURATION = 4000;

/*const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};*/

const styles1 = theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.dark,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing.unit,
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
});

function MySnackbarContent(props) {
	const { classes, className, message, onClose, variant, ...other } = props;

	return (
		<SnackbarContent
			className={classes[variant]}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes.message}>
					{message}
				</span>
			}
			action={[
				<IconButton
					key="close"
					aria-label="Close"
					color="inherit"
					className={classes.close}
					onClick={onClose}
				>
					<CloseIcon className={classes.icon} />
				</IconButton>,
			]}
			{...other}
		/>
	);
}

MySnackbarContent.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	message: PropTypes.node,
	onClose: PropTypes.func,
	variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

/**
 * `createContext` contient 2 propriétés :
 * `Provider` et `Consumer`. Nous les rendons accessibles
 * via la constante `SnackbarContext` et on initialise une
 * propriété par défaut "name" qui sera une chaîne vide.
 * On exporte ce contexte afin qu'il soit exploitable par
 * d'autres composants par la suite via le `Consumer`
 */
export const SnackbarContext = createContext({
	user: {},
});

/**
 * la classe UserProvider fera office de... Provider (!)
 * en englobant son enfant direct
 * dans le composant éponyme. De cette façon, ses values
 * seront accessibles de manière globale via le `Consumer`
 */
class SnackbarProvider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			notification: (type, message, duration) => {
				let variant = "";
				if (type === "error" || type === "success" || type === "info" || type === "warning")
					variant = type;
				else
					variant = "info";

				this.setState({
					variant,
					duration: duration ? duration : DEFAULT_DURATION,
					message,
					open:true
				})
			},
			duration: DEFAULT_DURATION,
			message: "",
			variant: "error",
			open: false
		};

		this.handleClose = this.handleClose.bind(this);
	}

	handleClose = () => this.setState({ open: false });

	render() {
		return (
			/**
			 * la propriété value est très importante ici, elle rend
			 * le contenu du state disponible aux `Consumers` de l'application
			 */
			<SnackbarContext.Provider value={this.state}>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					open={this.state.open}
					autoHideDuration={this.state.duration}
					onClose={this.handleClose}
				>
					<MySnackbarContentWrapper
						onClose={this.handleClose}
						variant={this.state.variant}
						message={this.state.message}
					/>
				</Snackbar>
				{this.props.children}
			</SnackbarContext.Provider>
		);
	}
}
SnackbarProvider.contextType = SnackbarContext;

export function withSnackbar(Component) {
    return function WrapperComponent(props) {
        return (
            <SnackbarContext.Consumer>
                {snackbar => <Component {...props} snackbar={snackbar} />}
            </SnackbarContext.Consumer>
        );
    };
}

export default SnackbarProvider;