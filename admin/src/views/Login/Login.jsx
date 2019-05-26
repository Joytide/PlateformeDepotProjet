import React from 'react';
import { sha256 } from 'js-sha256';
import { Redirect } from 'react-router'

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";

import Snackbar from "components/Snackbar/Snackbar.jsx";

import { api } from "config.json";
import AuthService from "components/AuthService";
import { UserContext } from "../../providers/UserProvider/UserProvider";

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: false,
            success: false,
            message: "",
            redirect: false
        }

        if (AuthService.isLoggedIn())
            this.state.redirect = true;

        this.login = this.login.bind(this);
        this.handlekeyDown = this.handlekeyDown .bind(this);
    }

    handleChange = id => event => {
        this.setState({
            [id]: event.target.value
        })
    }

    login = () => {
        this.setState({ success: false, error: false });
        if (this.state.email && this.state.password) {
            let data = {
                email: this.state.email,
                password: sha256(this.state.email + this.state.password)
            }

            fetch(api.host + ":" + api.port + "/api/login", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok) throw res;
                    else return res.json()
                })
                .then(data => {
                    if (data.token) {
                        this.context.setToken(data.token);
                        setTimeout(() => {
                            this.setState({ redirect: true });
                        }, 750);

                        this.setState({
                            success: true,
                            message: "Vous êtes connectés. Vous allez être redirigé."
                        });
                    } else {
                        this.setState({
                            error: true,
                            message: "Combinaison email / mot de passe invalide."
                        });
                    }
                })
                .catch(err => {
                    if (err.status === 401 && err.statusText === "Unauthorized")
                        this.setState({
                            error: true,
                            message: "Combinaison email / mot de passe invalide."
                        });
                    else
                        this.setState({
                            error: true,
                            message: "Une erreur inconnue est survenue."
                        });
                });
        } else {
            this.setState({
                error: true,
                message: "Veuillez saisir vos identifiants."
            });
        }
    }

    handlekeyDown = e => {
        if(e.key === "Enter")
            this.login();
    }

    render() {
        let redirect;
        if (this.state.redirect) {
            redirect = <Redirect to="/dashboard" />;
        }
        return (
            <div>
                <Snackbar
                    place="tc"
                    color="success"
                    message={this.state.message}
                    open={this.state.success}
                    closeNotification={() => this.setState({ success: false })}
                    close
                />
                <Snackbar
                    place="tc"
                    color="danger"
                    message={this.state.message}
                    open={this.state.error}
                    closeNotification={() => this.setState({ error: false })}
                    close
                />
                {redirect}
                <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
                    <Grid item xs={12} md={8} lg={6} xl={5}>
                        <Paper square elevation={1}>

                            <Grid container justify="center" >
                                <Grid item xs={12}>
                                    <Typography align="center" variant="display2" component="h1" style={{ paddingTop: "40px", paddingBottom: "30px" }}>
                                        SE CONNECTER
                                </Typography>
                                </Grid>

                                <Grid item xs={12} md={10}>
                                    <TextField
                                        fullWidth
                                        id="outlined-name"
                                        label="Email"
                                        value={this.state.email}
                                        onChange={this.handleChange('email')}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} md={10}>
                                    <TextField
                                        fullWidth
                                        id="outlined-name"
                                        label="Mot de passe"
                                        value={this.state.password}
                                        onChange={this.handleChange('password')}
                                        margin="normal"
                                        variant="outlined"
                                        type="password"
                                        onKeyDown={this.handlekeyDown}
                                    />
                                </Grid>

                                <Grid item xs={12} md={10} style={{ paddingTop: "30px", paddingBottom: "30px" }}>
                                    <Button
                                        style={{ paddingTop: "15px", paddingBottom: "15px", backgroundColor: "green", color: "white", borderRadius: 0 }}
                                        size="large"
                                        fullWidth
                                        onClick={this.login}
                                    >
                                        SE CONNECTER
                                            </Button>
                                </Grid>

                            </Grid>

                        </Paper>
                    </Grid>
                </Grid >
            </div>
        );
    }

}

Login.contextType = UserContext;

export default withStyles(styles)(Login);