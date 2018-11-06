import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import ProjectCard from './ProjectCard';
import { Container, Row, Col } from 'react-grid-system';
import { List, ListItem } from 'material-ui/List';
import CommunicationComment from 'material-ui/svg-icons/communication/comment';
import TextField from 'material-ui/TextField';
import i18n from '../i18n';
export default class ProjectComment extends React.Component {
    state = {
        open: false,
        project: this.props.project,
        comments: this.props.project.comments,
        projectCardOpen: this.props.projectCardOpen,
        question: '',
        response: ''
    };

    handleOpen = (item) => {
        this.setState({ open: true });
    };

    handleClose = (item) => {
        this.setState({ open: false });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: [e.target.value] })
    }

    handleSendQuestion = (e) => {
        var question = this.state.question
        var userId = "5a6d011d063609d47c70fdda";
        var idProject = this.state.project._id
        var body = {
            content: question,
            projectId: idProject,
            userId: userId
        }

        console.log(idProject)
        fetch(`api/projects/${idProject}/comments`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
            .then((res) => { console.log(res) })
            .catch((err) => { console.log(err) })
    }

    handleResponse = (commentId) => {
        console.log("COMMENT ID :" + commentId)
        var userId = "5a6d011d063609d47c70fdda";
        var body = {
            content: this.state.response,
            userId: userId,
            id_project : this.state.project._id
        }
        fetch(`/api/projects/comment/${commentId}/responses`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then((res)=> {window.location.reload()})
    }
    render() {
        console.log(this.state.project)
        var comments = () => {
            var tab = []
            tab = this.state.project.comments.map(comment => {
                var nesteds = [];
                if(comment.responses){
                    comment.responses.forEach(answer => {
                        console.log(answer)
                        nesteds.push(<ListItem key={answer._id} primaryText={answer.content} />)
                    });
                }
                
                nesteds.push(
                    <ListItem>
                        <TextField name="response" floatingLabelText="Répondez" onChange={this.handleChange.bind(this)} />
                        <RaisedButton onClick={() => this.handleResponse(comment._id)} secondary={true} label="envoyer" style={{ width: 75, height: 25, marginLeft: 25 }} />
                    </ListItem>);

                return <ListItem primaryText={comment.content}
                    nestedItems={nesteds}
                    leftIcon={<CommunicationComment />} />
            });
            console.log(tab)
            return tab
        }

        var comment;
        const lng = this.props.lng

        if (this.state.projectCardOpen) {
            comment = <Container fluid>
                <Row>
                    <Col>
                        <List>
                            {
                                comments()
                            }
                        </List>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <form onSubmit={this.handleSendQuestion.bind(this)}>
                            <label style={{ marginRight: 50 }}> {i18n.t('question.label', {lng})}: </label><TextField floatingLabelText= {i18n.t('questionH.label', {lng})} name="question" onChange={this.handleChange.bind(this)} />
                            <RaisedButton type='submit' secondary={true} label={i18n.t('button.label', {lng})} style={{ width: 75, height: 25, marginLeft: 25 }} />
                        </form>
                    </Col>
                </Row>
            </Container>

        }
        else {
            comment = <div>
                <FlatButton label={this.state.comments.length + ' '+  i18n.t('comment.label', {lng})} onClick={this.handleOpen} />
                <Dialog
                    title={this.state.project.title}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    contentStyle={{ width: '90%', maxWidth: 'none' }}>
                    <ProjectCard project={this.state.project} lng={lng} projectCardOpen />
                </Dialog>
            </div>
        }
        return (
            comment
        )
    }
}