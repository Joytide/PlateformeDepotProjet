import React from "react";
import PropTypes from "prop-types";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from "components/CustomButtons/Button.jsx";

class Modal extends React.Component {
    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                        {this.props.content}
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.props.closeModal} size="sm" color="info" autoFocus>
                        Annuler
                        </Button>
                    <Button size="sm" color={this.props.buttonColor} onClick={this.props.validation}>
                        {this.props.buttonContent}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    validation: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired,
    buttonColor: PropTypes.string,
    buttonContent: PropTypes.string.isRequired
};

export default Modal;