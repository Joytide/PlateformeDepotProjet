import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import FilesInputs from './FormComponents/FilesInputs';
import KeyWords from './FormComponents/KeyWords';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { FormControl, InputLabel, Select, Input } from '@material-ui/core'

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import AuthService from '../AuthService';
import i18n from '../i18n';

const styles = {

}

class CreateProject extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            years: [],
            specializations: [],
            description: "",
            study_year: [],
            majors_concerned: [],
            files: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSpecializations = this.handleSpecializations.bind(this);
        this.setFiles = this.setFiles.bind(this);
    }

    componentWillMount() {
        AuthService.fetch('/api/specialization')
            .then(res => res.json())
            .then(specializations => {
                this.setState({ specializations: specializations });
            })
            .catch(console.error.bind(console));

        AuthService.fetch('/api/year')
            .then(res => res.json())
            .then(years => {
                this.setState({ years: years })
            })
            .catch(console.error.bind(console));
    }

    setFiles = files => {
        this.setState({
            files
        });
    }

    handleSpecializations = event => {
        this.setState({ majors_concerned: event.target.value });
    };

    handleChange = e => {
        switch (e.target.name) {
            case "year":
                var temp = this.state.study_year;
                if (e.target.checked) {
                    temp.push(e.target.value);
                }
                else {
                    let index = temp.indexOf(e.target.value)
                    if (index > -1) {
                        temp.splice(index, 1);
                    }
                }
                this.setState({ study_year: temp });
                break;

            case "major":
                var temp2 = this.state.majors_concerned;
                if (e.target.checked) {
                    temp2.push(e.target.value);
                }
                else {
                    let index = temp2.indexOf(e.target.value)
                    if (index > -1) {
                        temp2.splice(index, 1);
                    }
                }
                this.setState({ majors_concerned: temp2 });
                break;

            default:
                this.setState({
                    [e.target.name]: e.target.value
                });
                break;
        }
    }

    handleKeyWords = key => this.setState({ keyWords: key });

    handleNext = () => {
        if (this.state.title && this.state.study_year.length > 0 && this.state.majors_concerned.length > 0 && this.state.description) {
            let data = {
                title: this.state.title,
                study_year: this.state.study_year,
                majors_concerned: this.state.majors_concerned,
                description: this.state.description
            };
            if (this.state.keyWords) data.keywords = this.state.keywords;
            if (this.state.files.length > 0) data.files = this.state.files.map(file => file._id);

            AuthService.fetch("/api/projects/", {
                method: "PUT",
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if (data._id)
                        this.props.next();
                })
                .catch(err => {

                });
        }
    }

    render() {
        const { lng, classes } = this.props;
        return (
            <ValidatorForm ref="form" onSubmit={this.handleNext}>
                <Grid container direction="column" justify="center" spacing={24} className={classes.paper}>
                    <Grid item>
                        <Typography align='center' variant='h6'>{i18n.t('projectPres.h2', { lng })}</Typography>
                    </Grid>
                    <Grid item>
                        <TextValidator
                            label={i18n.t('titleproj.label', { lng })}
                            placeholder={i18n.t('titleproj.label', { lng })}
                            onChange={this.handleChange} fullWidth={true}
                            name="title"
                            value={this.state.title}
                            validators={['required', 'maxStringLength:70']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                        />
                    </Grid>
                    <br />

                    <Grid item>
                        <Typography variant="subtitle1" align='center'>
                            {i18n.t('years.label', { lng })}
                        </Typography>
                        <Grid container direction="row" justify='center'>
                            {this.state.years.map(year =>
                                <Grid item key={year._id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={this.handleChange}
                                                value={year._id}
                                                name="year"
                                            />
                                        }
                                        label={lng === "fr" ? year.name.fr : year.name.en}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <br />

                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="select-multiple">{i18n.t('majors.label', { lng })}</InputLabel>
                            <Select
                                multiple
                                required
                                fullWidth
                                value={this.state.majors_concerned}
                                onChange={this.handleSpecializations}
                                input={<Input id="select-multiple" />}
                            >
                                {this.state.specializations.map(specialization => (
                                    <MenuItem key={specialization._id} value={specialization._id}>
                                        {lng === "fr" ? specialization.name.fr : specialization.name.en}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <br />

                    <Grid item>
                        <TextValidator
                            placeholder={i18n.t('descriptionProj.label', { lng })}
                            label="Description"
                            value={this.state.description}
                            validators={['required', 'maxStringLength:10000']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            multiline
                            rows="10"
                            name="description"
                            onChange={this.handleChange}
                            fullWidth={true}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item>
                        <KeyWords lng={lng} change={this.handleKeyWords} />
                    </Grid>
                    <Grid item>
                        <FilesInputs lng={lng} setFiles={this.setFiles} />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container spacing={40} justify="center">
                        <Grid item xs={1}>
                            <Button lng={lng} variant='contained' color='primary'>
                                <Typography>
                                    {i18n.t('back.label', { lng })}
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button lng={lng} variant='contained' color='primary' type="submit">
                                <Typography>
                                    {i18n.t('deposit.label', { lng })}
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </ValidatorForm>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CreateProject);