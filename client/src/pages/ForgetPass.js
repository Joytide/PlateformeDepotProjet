import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import i18n from '../components/i18n';
import { withSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";

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

        const form = {
            email: this.state.email
        };

        fetch('/api/partner/reset', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
            .then(res => {
                if (!res.ok) throw res
                else return res.json()
            })
            .then(res => {
                this.props.snackbar.notification("success", i18n.t("forgetPass.mailSent", { lng: this.props.lng }));
            })
            .catch(error => {
                error.json()
                    .then(data => {
                        if (data.code === "PartnerNotFound")
                            this.props.snackbar.notification("danger", i18n.t("errors.partnerNotFound", { lng: this.props.lng }));
                        else
                            this.props.snackbar.notification("danger", i18n.t("errors.default", { lng: this.props.lng }));
                    });
            });
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
                    <Typography variant="h4">{i18n.t("forgetPass.title", { lng })}</Typography>
                    <br />
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        {i18n.t('forgetPass.desc', { lng }).split('\n').map((line, index) => <Typography key={index}>{line}</Typography>)}
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
                            <Typography color="inherit">{i18n.t('forgetPass.submit', { lng })}</Typography>
                        </Button>
                    </form>
                </Grid>
            </Grid>
        )
    }
}

export default withSnackbar(ForgetPass);