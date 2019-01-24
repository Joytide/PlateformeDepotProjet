import React from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Filter from '@material-ui/icons/Filter7'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FilterIcone from 'material-ui/svg-icons/content/filter-list'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormControl, InputLabel, Input, FormGroup } from '@material-ui/core'


import i18n from '../i18n';
class ProjectFilter extends React.Component {
    constructor(props) {
        super(props);

        this.changeYearValue = this.changeYearValue.bind(this);
        this.changeMajorValue = this.changeMajorValue.bind(this);
        this.changeMotsClesValue = this.changeMotsClesValue.bind(this);
        this.changeTitleValue = this.changeTitleValue.bind(this);
        this.changeCompanyValue = this.changeCompanyValue.bind(this);

        this.state = {
          title : "",
          years : [],
          majors : [],
          mots_cles_value : "",
          company_value : "",
          yearValue:this.props.filterName,
          majorValue:this.props.filterName,
 };
    }

    changeYearValue(e, index, value) {
        this.setState({ yearValue: e.target.value }, function () {
            this.props.getdropDownValue(this.state.yearValue, "Année");
        });
    }

    changeMajorValue(e, index, value) {
        this.setState({ majorValue: e.target.value }, function () {
            this.props.getdropDownValue(this.state.majorValue, "Majeure");
        });
    }

    changeMotsClesValue(e, value) {
        this.setState({ mots_cles_value: e.target.value }, function () {
            this.props.getMotsClesValue(this.state.mots_cles_value);
        });
    }

    changeTitleValue(e,value){
        this.setState({title_value: e.target.value }, function(){
            this.props.getTitleValue(this.state.title_value);
        });
    }

    changeCompanyValue(e,value){
        this.setState({company_value: e.target.value }, function(){
            this.props.getCompanyValue(this.state.company_value);
        })
    }


    componentDidMount() {
        fetch('/api/majors/major/:major')
            .then(res => res.json())
            .then(majors => this.setState({ majors }))
            .catch((err) => { console.log(err); });
    }

    componentWillMount() {
        fetch('/api/specialization')
          .then(res => res.json())
          .then(majors => {
            this.setState({ majors: majors });
          })
          .catch(console.error.bind(console));
      }


    render() {
        const lng = this.props.lng
        return (
            <div lng={lng} style={{ padding: 12 }}>
                <Grid container direction="column" justify="center" spacing={24}>
                    <Grid item xs={24}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h5" component="h2">
                                    {i18n.t('filter.label', { lng })}
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid item>
                                    <Typography>
                                            <Grid item >
                                                <TextField
                                                    label={i18n.t('title.label', {lng})}
                                                    onChange={this.changeTitleValue}
                                                    fullWidth                              
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    label={i18n.t('firm.label', { lng })}
                                                    onChange={this.changeCompanyValue}
                                                    fullwidth
                                                />
                                            </Grid>                      
                                            <Grid item>
                                                <TextField
                                                    label={i18n.t('year.label', { lng })}
                                                    select
                                                    onChange={this.changeYearValue}
                                                    value={this.state.yearValue}
                                                    fullWidth
                                                >
                                                    <MenuItem value="A4">{i18n.t('year4.label', { lng })}</MenuItem>
                                                    <MenuItem value="A5">{i18n.t('year5.label', { lng })}</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item>
                                                <FormControl fullWidth>
                                                    <InputLabel htmlFor="select-major">{i18n.t('major.label', { lng })}</InputLabel>
                                                    <Select
                                                        fullWidth
                                                        value={this.state.majorValue}
                                                        onChange={this.changeMajorValue}
                                                        input={<Input name="major" id="select-major" />}
                                                    >
                                                        {this.state.majors.map(major => (
                                                        <MenuItem value={major._id}>
                                                            {lng === "fr" ? major.name.fr : major.name.en}
                                                        </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    label={i18n.t('keywords.label', { lng })}
                                                    onChange={this.changeMotsClesValue}
                                                    fullwidth
                                                />
                                            </Grid>
                                    </Typography>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default ProjectFilter;

