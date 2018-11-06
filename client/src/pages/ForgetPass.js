import React, { Component } from 'react';
import { Form, FormGroup, Button, Input, Label } from 'reactstrap';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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

        try {
            fetch('/api/retrieveEdit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form)
            })
                .then((res) => {
                    console.log(res)
                    window.location.reload()
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        catch (error) {
            console.error(error);
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div style={{ fontSize: 15, marginTop:15, textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <p > Si vous avez perdu votre lien pour modifier votre projet, veuillez entrer votre mail pour le récupérer. </p>
                    <TextField
                        hintText="Entrez votre e-mail"
                        floatingLabelText="Entrez votre e-mail"
                        onChange={this.handleChange.bind(this)}
                        type="email"
                    /><br/>
                    <RaisedButton label="Envoyer" primary={true} type="submit"/>
                </form>
            </div>
        )
    }
}

export default ForgetPass;