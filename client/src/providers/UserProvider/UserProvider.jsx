import React, { createContext } from "react"; // on importe createContext qui servira à la création d'un ou plusieurs contextes
import AuthService from "../../components/AuthService";

/**
 * `createContext` contient 2 propriétés :
 * `Provider` et `Consumer`. Nous les rendons accessibles
 * via la constante `UserContext` et on initialise une
 * propriété par défaut "name" qui sera une chaîne vide.
 * On exporte ce contexte afin qu'il soit exploitable par
 * d'autres composants par la suite via le `Consumer`
 */
export const UserContext = createContext({
	user: {},
});

/**
 * la classe UserProvider fera office de... Provider (!)
 * en englobant son enfant direct
 * dans le composant éponyme. De cette façon, ses values
 * seront accessibles de manière globale via le `Consumer`
 */
class UserProvider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {}, // une valeur de départ
			setToken: token => {
				localStorage.setItem("token", token);
				this.refreshUser();
			},
			disconnect: () => {
				localStorage.removeItem("token");
				this.setState({ user: {} });
			}
		};
	}

	componentWillMount() {
		this.refreshUser();
	}

	refreshUser() {
		AuthService.fetch("/api/user/me")
			.then(res => {
				if (!res.ok) throw res;
				return res.json()
			})
			.then(data => {
				this.setState({
					user: data
				});
			})
			.catch(err => {
				if (err.status === 401)
					localStorage.removeItem("token");
			});
	}

	render() {
		return (
			/**
			 * la propriété value est très importante ici, elle rend
			 * le contenu du state disponible aux `Consumers` de l'application
			 */
			<UserContext.Provider value={this.state}>
				{this.props.children}
			</UserContext.Provider>
		);
	}
}
UserProvider.contextType = UserContext;

export default UserProvider;

export function withUser(Component) {
    return function WrapperComponent(props) {
        return (
            <UserContext.Consumer>
                {user => <Component {...props} user={user} />}
            </UserContext.Consumer>
        );
    };
}