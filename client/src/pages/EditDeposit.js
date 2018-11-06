import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Paper from 'material-ui/Paper';
import { Container, Row, Col } from 'react-grid-system';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import i18n from '../components/i18n';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import SelectField from 'material-ui/SelectField';
import KeyWords from '../components/Deposit/FormComponents/KeyWords'
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

/**
 * Edit project page
 */

class Edit extends Component {
    constructor(props) {
        super(props);
        const lng = this.props.lng
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.majors = [{ name: i18n.t('ibo.label', { lng }), key: "IBO" },
        { name: i18n.t('ne.label', { lng }), key: "NE" },
        { name: i18n.t('if.label', { lng }), key: "IF" },
        { name: i18n.t('mnm.label', { lng }), key: "MNM" }]
    }

    componentWillUpdate(nextProps) {
        if (this.props.lng != nextProps.lng) {
            const lng = nextProps.lng;
            this.majors = [{ name: i18n.t('ibo.label', { lng }), key: "IBO" },
            { name: i18n.t('ne.label', { lng }), key: "NE" },
            { name: i18n.t('if.label', { lng }), key: "IF" },
            { name: i18n.t('mnm.label', { lng }), key: "MNM" }]
        }
    }

    componentDidMount() {
        fetch(`/api/edit/${this.props.match.params.editKey}`)
            .then((response) => response.json())
            .then((json) => this.setState(json, () => { console.log(this.state) }))
            .catch((err) => this.setState({ invalid: true }));
    }

    /**
     * Put request to the server to update the component state
     */
    handleSubmit() {
        console.log(`/api/projects/${this.state._id}`);
        console.log(JSON.stringify(this.state));
        fetch(`/api/projects/${this.state._id}`, {
            method: 'PUT',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {

            window.location.reload()
        }).catch(err => console.log(err));

    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSpe(e, index, values) {
        this.setState({ majors_concerned: values }, () => { console.log(this.state.majors_concerned) })
    }

    handleYear(e) {
        var temp = this.state.study_year;
        if (e.target.checked) {
            temp.push(e.target.value);
        }
        else {
            var index = temp.indexOf(e.target.value)
            if (index > -1) {
                temp.splice(index, 1);
            }
        }
        this.setState({ study_year: temp });
    }

    handleKeyWords(key) {
        var keys = [];
        key.forEach(element => {
            keys.push(element)
        });
        console.log(keys)
        this.setState({ keywords: keys }, () => { console.log(this.state.keywords) })
    }

    render() {
        if (this.state.project === {}) {
            return (
                <div>Please wait</div>
            );
        }
        if (this.state.invalid) {
            return (
                <div>Invalid URL</div>
            );
        }
        console.log(this.state.keywords)
        let a = (key) => {
            if (this.state.study_year) {
                console.log(this.state.study_year)
                return this.state.study_year.includes(key)
            }
        }

        var lng = this.props.lng
        var keywordss = this.state.keywords ? this.state.keywords : []
        return (
            <Container fluid>
                <Col md={10} offset={{ md: 1 }}>

                    <Paper style={{ marginTop: 20 }}>
                        <Row>
                            <p style={{ fontSize: 30, width: 100 + "%", textAlign: 'center' }}>Modifiez votre projet</p>
                        </Row>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <Row>
                                <Col md={4} offset={{ md: 4 }}>
                                    <TextField name="title" value={this.state.title} onChange={this.handleChange} floatingLabelText="Nom du projet" fullWidth />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col md={2} offset={{ md: 4 }}>
                                    <Checkbox
                                        label="4A"
                                        name="year"
                                        value="A4"
                                        onCheck={this.handleYear.bind(this)}
                                        defaultChecked={a("A4")} />
                                </Col>
                                <Col md={2}>
                                    <Checkbox
                                        label="5A"
                                        name="year"
                                        value="5A"
                                        onCheck={this.handleYear.bind(this)}
                                        defaultChecked={a("A5")} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} offset={{ md: 3 }}>
                                    <SelectField
                                        onChange={this.handleSpe.bind(this)} fullWidth={true}
                                        floatingLabelText={i18n.t('majors.label', { lng })}
                                        multiple={true}
                                        hintText="Select a name"
                                        value={this.state.majors_concerned}
                                        onChange={this.handleChange}
                                        name="majors_concerned"
                                    >
                                        {this.majors.map((major) =>
                                            <MenuItem
                                                key={major.key}
                                                insetChildren={true}
                                                checked={this.state.majors_concerned ? this.state.majors_concerned.indexOf(major.key) > -1 : false}
                                                value={major.key}
                                                primaryText={major.name}
                                            />
                                        )}
                                    </SelectField>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={8} offset={{ md: 2 }}>
                                    <TextField
                                        hintText={i18n.t('descriptionProj.label', { lng })}
                                        floatingLabelText="Description"
                                        multiLine={true}
                                        rows={10}
                                        name="description"
                                        onChange={this.handleChange}
                                        fullWidth={true}
                                        value={this.state.description} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3} offset={{ md: 5 }}>
                                    <RaisedButton secondary={true} label="Update" type="submit" />
                                </Col>
                            </Row>
                        </form>
                    </Paper>
                </Col>
            </Container>
        )

    }
}
export default Edit;