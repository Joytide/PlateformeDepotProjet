import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
            <div style={{ fontSize: 15, marginTop: 15, textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Typography>{i18n.t('forgetPass.desc', { lng })}</Typography>
                    <TextField
                        label={i18n.t('forgetPass.textfield', {lng} )}
                        placeholder={i18n.t('forgetPass.textfield', {lng} )}
                        onChange={this.handleChange.bind(this)}
                        type="email"
                        margin="normal"
                        name="email" value={this.state.email}
                    /><br />
                    <Button variant="contained" color="primary" type="submit">
                        <Typography>{i18n.t('forgetPass.submit', { lng })}</Typography>
                    </Button>
                </form>
            </div>
        )
    }
}

export default ForgetPass;