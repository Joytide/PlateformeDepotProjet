import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import i18n from '../components/i18n';
import AuthService from '../components/AuthService';

class ForgetPass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.email) {
            const form = {
                email: this.state.email
            };

            AuthService.fetch('/api/partner/reset', {
                method: 'POST',
                body: JSON.stringify(form)
            })
                .then(res => res.json())
                .then(res => {
                })
                .catch(error => {
                    console.error(error);
                });
        } else {

        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        let lng = this.props.lng;
        return (
            <Grid container alignItems="center" justify="center">
                <Grid item xs={12} md={6} lg={4}>
                    <Typography variant="h4">{i18n.t("forgetPass.title", {lng})}</Typography>
                    <br />
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        {i18n.t('forgetPass.desc', { lng }).split('\n').map(line => <Typography>{line}</Typography>)}
                        <TextField
                            label={i18n.t('forgetPass.textfield', { lng })}
                            placeholder={i18n.t('forgetPass.textfield', { lng })}
                            onChange={this.handleChange.bind(this)}
                            type="email"
                            margin="normal"
                            name="email" value={this.state.email}
                            fullWidth
                        /><br />
                        <Button variant="contained" color="primary" type="submit">
                            <Typography>{i18n.t('forgetPass.submit', { lng })}</Typography>
                        </Button>
                    </form>
                </Grid>
            </Grid>
        )
    }
}

export default ForgetPass;