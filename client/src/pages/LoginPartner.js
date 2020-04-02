import React from 'react';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import sha256 from 'js-sha256';
import AuthService from '../components/AuthService';
import { UserContext } from "../providers/UserProvider/UserProvider";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class LoginPartner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logged: false,
            error: false,
            redirectTo: ''
        };
    }

    componentDidMount() {
        let key = this.props.match.params.key;

        AuthService.fetch('/api/login/partner/', {
            method: "POST",
            body: JSON.stringify({ key: sha256(key) })
        })
            .then(res => {
                if (res.ok)
                    return res.json()
                else
                    throw res
            })
            .then(data => {
                if (data.token) {
                    this.context.setToken(data.token);
                    setTimeout(() => {
                        this.setState({ redirectTo: '/partner' });
                    }, 3000);
                    this.setState({ logged: true });
                } else {
                    console.error(data);
                    setTimeout(() => {
                        this.setState({ redirectTo: '/' });
                    }, 3000);
                    this.setState({ error: true });
                }
            })
            .catch(err => {
                console.error(err);
                setTimeout(() => {
                    this.setState({ redirectTo: '/' });
                }, 3000);
                this.setState({ error: true });
            });
    }

    render() {
        let content;
        let redirectTo;
        if (this.state.redirectTo !== '') {
            redirectTo = <Redirect to={this.state.redirectTo} />;
        }
        if (this.state.logged) {
            content = (
                <div>
                    <Typography variant="h5" component="h3">
                        Vous êtes connecté
                    </Typography>
                    <Typography component="p">
                        Vous allez être redirigé vers la page de votre profil
                    </Typography>
                </div>
            );
        } else if (this.state.error) {
            content = (
                <div>
                    <Typography variant="h5" component="h3">
                        Une erreur est survenue
                    </Typography>
                    <Typography component="p">
                        Vous allez être redirigé vers la page d'accueil
                    </Typography>
                </div>
            );
        } else {
            content = (
                <div>
                    <CircularProgress />
                </div>
            );
        }

        return (
            <div>
                <Grid container justify="center">
                    <Grid item xs={6}>
                        <Paper elevation={1}>
                            {redirectTo}
                            {content}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

LoginPartner.contextType = UserContext;

export default withStyles(styles)(LoginPartner);