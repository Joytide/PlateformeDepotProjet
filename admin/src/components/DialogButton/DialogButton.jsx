import React from "react"
import PropTypes from 'prop-types'

import Button from "components/CustomButtons/Button.jsx";
import Modal from "components/Modal/Modal.jsx";

class DialogButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dialogOpen: true
        }
    }

    closeModal = () => this.setState({dialogOpen: false})
    showModal = () => this.setState({dialogOpen: true})

    render() {
        const {size, color} = this.props;
        return (
            <React.Fragment>
                <Modal
                    open={this.state.dialogOpen}
                    closeModal={this.closeModal}
                    title={this.props.title}
                    content={this.props.content}
                    buttonColor="danger"
                    buttonContent="Supprimer"
                    validation={this.props.onValidation}
                />
                <Button size={size} color={color} onClick={this.showModal}>{this.props.children}</Button>
            </React.Fragment>
        );
    }
}

DialogButton.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onValidation: PropTypes.func.isRequired
}



export default DialogButton