import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import AuthService from '../AuthService';
import i18n from '../i18n';

const styles = {

}

class CreatePartner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            company: "",
            email: "",
            first_name: "",
            last_name: "",
            isExisting: false
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        if (AuthService.isLoggedIn()) {
            AuthService.getUser()
                .then(user => {
                    this.setState({
                        ...user,
                        isExisting: true
                    });
                });
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleNext = () => {
        if (this.state.isExisting && this.props.next)
            this.props.next();
        else if (this.props.next) {
            let data = {
                first_name  : this.state.first_name,
                last_name   : this.state.last_name,
                email       : this.state.email,
                company     : this.state.company
            };

            AuthService.fetch("/api/partner/", {
                method: "PUT",
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if(data.token) 
                        AuthService.setToken(data.token);
                    this.props.next();
                })
                .catch(err=> {

                });
        }
    }

    render() {
        const { lng, classes } = this.props;
        return (
            <ValidatorForm ref="form" onSubmit={this.handleNext}>
                <Grid container direction="column" spacing={24} className={classes.paper} >
                    <Grid item>
                        <Typography lng={lng} variant='h6' align='center'>{i18n.t('tellus.label', { lng })}</Typography>
                    </Grid>

                    <Grid item>
                        <TextValidator
                            label={i18n.t('email.label', { lng })}
                            placeholder={i18n.t('email.label', { lng })}
                            validators={['required', 'isEmail', 'maxStringLength:40']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('notvalid.label', { lng }), i18n.t('field_length.label', { lng })]}
                            onChange={this.handleChange}
                            name="email"
                            value={this.state.email}
                            fullWidth={true}
                            disabled={this.state.isExisting}
                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            validators={['required', 'maxStringLength:70']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            label={i18n.t('company.label', { lng })}
                            placeholder={i18n.t('company.label', { lng })}
                            onChange={this.handleChange}
                            name="company" value={this.state.company}
                            fullWidth={true}
                            disabled={this.state.isExisting}

                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            validators={['required', 'maxStringLength:30']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            label={i18n.t('firstname.label', { lng })}
                            placeholder={i18n.t('firstname.label', { lng })}
                            onChange={this.handleChange}
                            fullWidth={true}
                            name="first_name" value={this.state.first_name}
                            disabled={this.state.isExisting}
                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            validators={['required', 'maxStringLength:30']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            label={i18n.t('lastname.label', { lng })}
                            placeholder={i18n.t('lastname.label', { lng })}
                            onChange={this.handleChange} fullWidth={true}
                            name="last_name" value={this.state.last_name}
                            disabled={this.state.isExisting}
                        />
                    </Grid>

                    <Grid item>
                        <Grid container spacing={40} justify="center">
                            <Grid item xs={2}>
                                <Button lng={lng} variant='contained' color='primary' type="submit">
                                    <Typography>
                                        {this.state.isExisting ? i18n.t('next.label', { lng }) : i18n.t('createAccount.label', { lng })}
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ValidatorForm>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CreatePartner);