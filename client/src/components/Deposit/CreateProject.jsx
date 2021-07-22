import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import FilesInputs from './FormComponents/FilesInputs';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import AuthService from '../AuthService';
import { withSnackbar } from "../../providers/SnackbarProvider/SnackbarProvider";
import i18n from '../i18n';

const styles = {

}

class CreateProject extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            years: [], //All possible
            specializations: [], //All possible
            description: "",
            study_year: [], //Selected
            majors_concerned: [], //Selected
            files: [],
            infos: "",
            skills: "",
            confidential: false,
            international: false,
            multipleTeams: false,
            biggerTeam: false,
            RandD: false,
            maxTeamNumber: "",
            maxStudentNumber: "",
            keywords:  [], //All possible
            selected_keywords: [], //Selected
            suggestedKeywords: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSpecializations = this.handleSpecializations.bind(this);
        this.handleKeywords = this.handleKeywords.bind(this);
        this.setFiles = this.setFiles.bind(this);
        this.renderSelect = this.renderSelect.bind(this);

    }
    
    componentWillMount() { //Deprecated, move in constructor() apparently?
        window.scroll(0, 0);
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

        AuthService.fetch('/api/keyword')
            .then(res => res.json())
            .then(keywords => {
                if (this.props.lng==="fr")
                    this.setState({ keywords: keywords.sort((a, b) => a.name.fr.localeCompare(b.name.fr)) })
                else
                this.setState({ keywords: keywords.sort((a, b) => a.name.eng.localeCompare(b.name.eng)) })
            })
            .catch(console.error.bind(console));
        
    }

    setFiles = files => {
        this.setState({
            files
        });
    }

    handleKeywords = event =>{
        this.setState({selected_keywords: event.target.value})
    }

    handleSpecializations = event => {
        this.setState({ majors_concerned: event.target.value });
    };

    handleChange = e => {
        let temp;
        switch (e.target.name) {
            case "year":
                temp = this.state.study_year;
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
            /*
            case "spe":
                temp = this.state.majors_concerned;
                if (e.target.checked) {
                    temp.push(e.target.value);
                }
                else {
                    let index = temp.indexOf(e.target.value)
                    if (index > -1) {
                        temp.splice(index, 1);
                    }
                }
                this.setState({ majors_concerned: temp });
                break;
            */
            case "selected_keywords":
                temp = this.state.selected_keywords;
                if (e.target.checked) {
                    temp.push(e.target.value);
                }
                else {
                    let index = temp.indexOf(e.target.value)
                    if (index > -1) {
                        temp.splice(index, 1);
                    }
                }
                this.setState({ selected_keywords: temp });
                break;
            case "multipleTeams":
                this.setState({
                    [e.target.name]: e.target.checked
                });
                break;
            case "biggerTeam":
                this.setState({
                    [e.target.name]: e.target.checked
                });
                break;
            case "confidential":
                this.setState({
                    [e.target.name]: e.target.checked
                });
                break;
            case "international":
                this.setState({
                    [e.target.name]: e.target.checked
                });
                break;
            default:
                this.setState({
                    [e.target.name]: e.target.value
                });
                break;
        }
        
    }

    handleNext = e => {
        if (this.state.title !== "" && this.state.study_year.length > 0 && this.state.selected_keywords.length > 0 && this.state.description !== "") {
            let data = {
                title: this.state.title,
                study_year: this.state.study_year,
                majors_concerned: this.state.specializations, // Instead of majors_concernet so that all spes' resp have to check out project
                description: this.state.description,
                skills: this.state.skills,
                infos: this.state.infos,
                maxTeamNumber: this.state.maxTeamNumber,
                maxStudentNumber: this.state.maxStudentNumber,
                confidential: this.state.confidential,
                international: this.state.international,
                selected_keywords: this.state.selected_keywords,
                suggestedKeywords: this.state.suggestedKeywords,
            };

            if (this.state.files.length > 0) data.files = this.state.files.map(file => file._id);

            AuthService.fetch("/api/project/", {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (res.ok)
                        this.props.next()
                    else
                        throw res;
                })
                .catch(err => {
                    const { lng } = this.props;
                    console.error(err);
                    this.props.snackbar.notification("error", i18n.t("errors.createProject", { lng }));
                });
        }
        else if (this.state.study_year.length === 0)
            this.props.snackbar.notification("error", i18n.t("errors.fillYear", { lng: this.props.lng }));
        /*
        else if (this.state.majors_concerned.length === 0)
            this.props.snackbar.notification("error", i18n.t("errors.fillSpecialization", { lng: this.props.lng }));
        */
        else if (this.state.selected_keywords.length === 0)
            this.props.snackbar.notification("error", i18n.t("errors.fillKeywords", { lng: this.props.lng }));

        else
            this.props.snackbar.notification("error", i18n.t("errors.fillAll", { lng: this.props.lng }));
    }

    renderSelect(e) {
        return this.state.specializations
            // Filtre les majeures qui n'ont pas été selectionnée 
            .filter(spe => {
                if (e.indexOf(spe._id) !== -1)
                    return true;
                return false;
            })
            // Association des majeures selectionnées à leur nom
            .map(spe => {
                return this.props.lng === "fr" ? spe.name.fr : spe.name.en
            })
            // Jointure
            .join(", ");
    }


    render() {
        const { lng, classes } = this.props;
        return (
            <ValidatorForm ref="form" onSubmit={this.handleNext} onError={() => this.props.snackbar.notification("error", i18n.t("errors.fillAll", { lng: this.props.lng }))}>
                <Grid container direction="column" justify="center" spacing={32} className={classes.paper}>
                    <Grid item>
                        <Typography align='center' variant='h6'>{i18n.t('projectPres.h2', { lng })}</Typography>
                    </Grid>
                    <Grid item>
                        <TextValidator
                            label={i18n.t('titleproj.label', { lng })}
                            onChange={this.handleChange}
                            fullWidth={true}
                            name="title"
                            value={this.state.title}
                            validators={['required', 'maxStringLength:70']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            variant="outlined"
                        />
                    </Grid>
                    <br />

                    <Grid item>
                        <Typography variant="subtitle1" align='center' style={{ fontWeight: "bold" }}>
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
                    {/*
                    <Grid item>
                        <Typography variant="subtitle1" align='center' style={{ fontWeight: "bold" }}>
                            {i18n.t('majors.label', { lng })}
                        </Typography>
                        <Grid container direction="row">
                            {this.state.specializations.map(spe =>
                                <Grid item key={spe._id} xs={12} md={6} lg={4} xl={3}>
                                    <Tooltip placement="bottom" title={lng === "fr" ? spe.description.fr : spe.description.en}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={this.handleChange}
                                                    value={spe._id}
                                                    name="spe"
                                                />
                                            }
                                            label={lng === "fr" ? spe.name.fr : spe.name.en}
                                        />
                                    </Tooltip>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>                
                    <br />
                    */}                 
                    <Grid item>
                        <Typography variant="subtitle1" align='center' style={{ fontWeight: "bold" }}>
                            {i18n.t('keywords.label', { lng })}
                        </Typography>
                        <Grid container direction="row">
                            {this.state.keywords.map(kw =>
                                <Grid item key={kw._id} xs={12} md={6} lg={4} xl={3}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={this.handleChange}
                                                value={kw._id}
                                                name="selected_keywords"
                                            />
                                            
                                        }
                                        
                                        label={lng === "fr" ? kw.name.fr : kw.name.en}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <br />
                    <br /><br /><br /><br />
                    {/* Not working yet
                                            <Button lng={lng} name="selected_keywords" variant='contained' value={kw._id} onChange={this.handleChange}>
                                                <Typography color="inherit">
                                                    {lng === "fr" ? kw.name.fr : kw.name.en}
                                                </Typography>
                                            </Button>
                    */}

                    <Grid item xs={12}>
                    {i18n.t('createProject.teamInfo', { lng })}
                    </Grid>
                    {!this.state.multipleTeams &&
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" align='left' style={{ fontWeight: "bold" }}>
                                {i18n.t('createProject.biggerTeam', { lng })}
                            </Typography>
                            <br />
                            <Grid container direction="row" justify='left'>
                                <Grid item xs={4} md={3} lg={2}>
                                    {i18n.t("createPartner.no", { lng })}
                                    <Switch
                                        checked={this.state.biggerTeam}
                                        onChange={this.handleChange}
                                        name="biggerTeam"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                    {i18n.t("createPartner.yes", { lng })}
                                </Grid>
                                
                                <Grid item xs={12} md={6} lg={4}>
                                    {this.state.biggerTeam &&
                                        <TextValidator
                                            label={i18n.t('createProject.maxStudentNumber', { lng })}
                                            value={this.state.maxStudentNumber}
                                            validators={['required', 'matchRegexp:^[0-9]+$']}
                                            style ={{width: '100%'}}
                                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('errors.NaN', { lng })]}
                                            name="maxStudentNumber"
                                            onChange={this.handleChange}
                                            fullWidth={true}
                                            variant="outlined"

                                        />
                                    }
                                </Grid>
                            </Grid>
                            <br />
                        </Grid>
                    }   

                    {!this.state.biggerTeam &&
                        <Grid item xs={12}>
                        
                            <Typography variant="subtitle1" align='left' style={{ fontWeight: "bold" }}>
                                {i18n.t('createProject.multipleTeams', { lng })}
                            </Typography>
                            <br />
                            <Grid container direction="row" justify='left'>
                                <Grid item xs={4} md={3} lg={2}>
                                    {i18n.t("createPartner.no", { lng })}
                                    <Switch
                                        checked={this.state.multipleTeams}
                                        onChange={this.handleChange}
                                        name="multipleTeams"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                    {i18n.t("createPartner.yes", { lng })}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4}>
                                    {this.state.multipleTeams &&
                                        <TextValidator
                                            label={i18n.t('createProject.maxTeamNumber', { lng })}
                                            value={this.state.maxTeamNumber}
                                            validators={['required', 'matchRegexp:^[0-9]+$']}
                                            
                                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('errors.NaN', { lng })]}
                                            name="maxTeamNumber"
                                            onChange={this.handleChange}
                                            fullWidth={true}
                                            variant="outlined"

                                        />
                                    }
                                </Grid>
                            </Grid>
                            <br />
                        
                        </Grid>
                    }
                    

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" align='left' style={{ fontWeight: "bold" }}>
                            {i18n.t('createProject.confidential', { lng })}
                        </Typography>
                        <Grid container direction="row" justify='left'>
                            <Grid item xs={4} md={3} lg={2}>
                                {i18n.t("createPartner.no", { lng })}
                                <Switch
                                    checked={this.state.confidential}
                                    onChange={this.handleChange}
                                    name="confidential"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                                {i18n.t("createPartner.yes", { lng })}
                            </Grid>
                        </Grid>
                        
                    </Grid>


                    <Grid item xs={12}>
                        <Typography variant="subtitle1" align='left' style={{ fontWeight: "bold" }}>
                            {i18n.t('createProject.international', { lng })}
                        </Typography>
                        <Grid container direction="row" justify='left'>
                            <Grid item xs={4} md={3} lg={2}>
                                {i18n.t("createPartner.no", { lng })}
                                <Switch
                                    checked={this.state.international}
                                    onChange={this.handleChange}
                                    name="international"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                                {i18n.t("createPartner.yes", { lng })}
                            </Grid>
                        </Grid>
                        <br />
                    </Grid>



                    <Grid item>
                        <Typography variant="subtitle1" align='left' style={{ fontWeight: "bold" }}>
                            {i18n.t('descriptionProj.label', { lng })}
                        </Typography>
                        <TextValidator
                            label={i18n.t('descriptionProj.subtext', {lng})}
                            value={this.state.description}
                            validators={['required', 'maxStringLength:10000']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            multiline
                            rows="10"
                            name="description"
                            onChange={this.handleChange}
                            fullWidth={true}
                            variant="outlined"
                            /*helperText={i18n.t('createProject.descriptionHelper', { lng })}*/
                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            label={i18n.t('createProject.suggestedKeywords', { lng })}
                            value={this.state.suggestedKeywords}
                            validators={['maxStringLength:250']}
                            errorMessages={[i18n.t('field_length.label', { lng })]}
                            name="suggestedKeywords"
                            onChange={this.handleChange}
                            fullWidth={true}
                            variant="outlined"
                        />
                    </Grid>
                    
                    <Grid item>
                        <TextValidator
                            label={i18n.t('createProject.skills', { lng })}
                            value={this.state.skills}
                            validators={['maxStringLength:1000']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            name="skills"
                            onChange={this.handleChange}
                            multiline
                            fullWidth={true}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item>
                        <TextValidator
                            label={i18n.t('createProject.infos', { lng })}
                            value={this.state.infos}
                            validators={['maxStringLength:1000']}
                            errorMessages={[i18n.t('field.label', { lng }), i18n.t('field_length.label', { lng })]}
                            name="infos"
                            multiline
                            rows="2"
                            onChange={this.handleChange}
                            fullWidth={true}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item>
                        <FilesInputs lng={lng} setFiles={this.setFiles} />
                    </Grid>

                </Grid>

                <Grid item>
                    <Grid container spacing={40} justify="center">
                        <Grid item xs={2}>
                            <Button lng={lng} variant='contained' color='primary' type="submit">
                                <Typography color="inherit">
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

export default withSnackbar(withStyles(styles, { withTheme: true })(CreateProject));