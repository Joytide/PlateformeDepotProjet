import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

        console.log("handleSubmit button pressed");

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
                        label="Entrez votre e-mail"
                        placeholder="Entrez votre e-mail"
                        onChange={this.handleChange.bind(this)}
                        type="email"
                        multiline
                        margin="normal"
                    /><br/>
                    <Button variant="raised" color="primary" type="submit">
                        <div>Envoyer</div>
                    </Button>
                </form>
            </div>
        )
    }
}

export default ForgetPass;