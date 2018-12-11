import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
            error: false
        };
    }

    componentDidMount() {
        let key = this.props.match.params.key;
        fetch('/api/login/partner/', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: key })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    this.setState({ logged: true });
                } else {
                    this.setState({ error: true });
                }
            })
            .catch(err => {
                this.setState({ error: true });
                console.error(err);
            });
    }

    render() {
        let content;
        if (this.state.logged) {
            content = (
                <div>
                    <Typography variant="h5" component="h3">
                        Vous êtes connecté
                    </Typography>
                    <Typography component="p">
                        Vous allez être rediriger 
                    </Typography>
                </div>
            );
        } else if (this.state.error) {
            content = (
                <div>Une erreur est survenue</div>
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
                            {content}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(LoginPartner);