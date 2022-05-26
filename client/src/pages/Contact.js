import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { withUser } from "../providers/UserProvider/UserProvider";
import { withSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";
import i18n from '../components/i18n';

import AuthService from '../components/AuthService';
import { Redirect } from 'react-router-dom';

/**
 * Create a contact for later
 */

const styles = theme => ({
	root: {
		flexGrow: 1,
		width: '100%',
		maxWidth: 1150,
		margin: 'auto',
		padding: theme.spacing.unit * 2,
	},
	paper: {
		padding: theme.spacing.unit * 2,
		textAlign: 'left',
		color: theme.palette.text.secondary,
	},
});

class Contact extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            company: "",
            email: "",
            first_name: "",
            last_name: "",
            kind: "company",
            phone: "",
            redirectTo: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    componentDidMount() {
        window.scroll(0, 0);

        ValidatorForm.addValidationRule('isPhone', value => {
            if(value === "") return true;
            // eslint-disable-next-line
            let phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

            return phoneRegex.test(value);
        })
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleRadioChange = prop => e => {
        this.setState({
            [prop]: e.target.value
        });
    }

    handleNext = () => {
        const lng = this.props.lng;

        let data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email.toLowerCase(),
            company: this.state.company,
            phone: this.state.phone,
            kind: this.state.kind
        };
        AuthService.fetch("/api/contact/", {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok)
                throw res;
            else
                this.props.snackbar.notification("success", i18n.t('contactPage.success', { lng }), 10000);
                this.setState({ redirectTo: '/' });
        })
        .catch(err => {
            const { lng } = this.props
            console.error(err);
            if (err.status === 409)
                this.props.snackbar.notification("error", i18n.t('errors.emailUsedContact', { lng }), 10000);
            else
                this.props.snackbar.notification("error", i18n.t('errors.createContact', { lng }), 10000);
        });
        
    }

    render() {
        const { lng, classes } = this.props;
        if (this.state.redirectTo !== '') {
            return <Redirect to={this.state.redirectTo} />;
        }
        return (
            
            <ValidatorForm ref="form" onSubmit={this.handleNext}>
                <Grid container direction="column" spacing={24} className={classes.paper} justify="center">
                    <Grid item>
                        <Typography lng={lng} variant='h6' align='center'>{i18n.t('contactPage.title', { lng })}</Typography>
                        <Typography lng={lng} variant='subtitle2' align='center'>{i18n.t('contactPage.title_l2', { lng })}</Typography>
                    </Grid>

                    <Grid item>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel component="legend">{i18n.t('createPartner.kind', { lng }) + " *"}</FormLabel>
                            <RadioGroup
                                className={classes.group}
                                value={this.state.kind}
                                onChange={this.handleRadioChange("kind")}
                                row
                            >
                                <FormControlLabel value="company" control={<Radio />} label={i18n.t('createPartner.company', { lng })} />
                                <FormControlLabel value="association" control={<Radio />} label={i18n.t('createPartner.association', { lng })} />
                                <FormControlLabel value="school" control={<Radio />} label={i18n.t('createPartner.school', { lng })} />
                                <FormControlLabel value="other" control={<Radio />} label={i18n.t('createPartner.other', { lng })} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <TextValidator
                            label={i18n.t('email.label', { lng }) + " *"}
                            placeholder={i18n.t('email.label', { lng })}
                            validators={['required', 'isEmail', 'maxStringLength:254']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('notvalid.label', { lng }), i18n.t('field_length.label', { lng })]}
                            onChange={this.handleChange}
                            name="email"
                            value={this.state.email}
                            fullWidth={true}
                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            validators={['required', 'maxStringLength:70']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            label={i18n.t('company.label', { lng }) + " *"}
                            placeholder={i18n.t('company.label', { lng })}
                            onChange={this.handleChange}
                            name="company" value={this.state.company}
                            fullWidth={true}

                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            validators={['required', 'maxStringLength:30']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            label={i18n.t('firstname.label', { lng }) + " *"}
                            placeholder={i18n.t('firstname.label', { lng })}
                            onChange={this.handleChange}
                            fullWidth={true}
                            name="first_name" value={this.state.first_name}
                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            validators={['required', 'maxStringLength:30']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            label={i18n.t('lastname.label', { lng }) + " *"}
                            placeholder={i18n.t('lastname.label', { lng })}
                            onChange={this.handleChange} fullWidth={true}
                            name="last_name" value={this.state.last_name}
                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            validators={['maxStringLength:15', 'isPhone']}
                            errorMessages={[i18n.t('field_length.label', { lng }), i18n.t('createPartner.invalidPhone', { lng })]}
                            label={i18n.t('createPartner.phone', { lng })}
                            placeholder={i18n.t('createPartner.phone', { lng })}
                            onChange={this.handleChange} fullWidth={true}
                            name="phone" value={this.state.phone}
                        />
                    </Grid>

                    <Grid item>
                        <Grid item >
                            <Grid item xs={2}>
                                <Button lng={lng} variant='contained' color='primary' type="submit">
                                    <Typography color="inherit">
                                        {i18n.t('contactPage.leave_contact', { lng })}
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

export default withUser(withSnackbar(withStyles(styles, { withTheme: true })(Contact)));
