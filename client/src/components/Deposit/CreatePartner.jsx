import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import AuthService from '../AuthService';
import i18n from '../i18n';
import { withUser } from "../../providers/UserProvider/UserProvider";
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";

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
            kind: "company",
            phone: "",
            address: "",
            alreadyPartner: "false",
            isExisting: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
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

    static getDerivedStateFromProps(props, state) {
        if (props.user.user._id)
            return {
                ...props.user.user,
                alreadyPartner: props.user.user.alreadyPartner.toString(),
                isExisting: true
            }
        return {
            isExisting: false
        }
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
        if (this.state.isExisting && this.props.next)
            this.props.next();
        else if (this.props.next) {
            let data = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email.toLowerCase(),
                company: this.state.company,
                phone: this.state.phone,
                kind: this.state.kind,
                address: this.state.address,
                alreadyPartner: this.state.alreadyPartner === "true",
            };

            AuthService.fetch("/api/partner/", {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok)
                        throw res;
                    else
                        return res.json();
                })
                .then(data => {
                    if (data.token) {
                        this.props.user.setToken(data.token);
                        var event = new Event('logged');
                        document.dispatchEvent(event);
                        this.props.next({ newAccount: true });
                    }
                })
                .catch(err => {
                    const { lng } = this.props
                    console.error(err);
                    if (err.status === 409)
                        this.props.snackbar.notification("error", i18n.t('errors.emailUsed', { lng }), 10000);
                    else
                        this.props.snackbar.notification("error", i18n.t('errors.createPartner', { lng }), 10000);
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
                        <FormControl disabled={this.state.isExisting} component="fieldset" className={classes.formControl}>
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
                            disabled={this.state.isExisting}
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
                            disabled={this.state.isExisting}

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
                            disabled={this.state.isExisting}
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
                            disabled={this.state.isExisting}
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
                            disabled={this.state.isExisting}
                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            validators={['maxStringLength:300']}
                            errorMessages={[i18n.t('field_length.label', { lng })]}
                            label={i18n.t('createPartner.address', { lng })}
                            placeholder={i18n.t('createPartner.address', { lng })}
                            onChange={this.handleChange} fullWidth={true}
                            name="address" value={this.state.address}
                            disabled={this.state.isExisting}
                        />
                    </Grid>

                    <Grid item>
                        <FormControl disabled={this.state.isExisting} component="fieldset" className={classes.formControl}>
                            <FormLabel component="legend">{i18n.t('createPartner.alreadyPartner', { lng }) + " *"}</FormLabel>
                            <RadioGroup
                                className={classes.group}
                                value={this.state.alreadyPartner}
                                onChange={this.handleRadioChange("alreadyPartner")}
                                row
                            >
                                <FormControlLabel value="true" control={<Radio />} label={i18n.t('createPartner.yes', { lng })} />
                                <FormControlLabel value="false" control={<Radio />} label={i18n.t('createPartner.no', { lng })} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <Grid container spacing={40} justify="center">
                            <Grid item xs={2}>
                                <Button lng={lng} variant='contained' color='primary' type="submit">
                                    <Typography color="inherit">
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

export default withUser(withSnackbar(withStyles(styles, { withTheme: true })(CreatePartner)));