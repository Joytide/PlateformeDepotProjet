import React from "react";
//import PropTypes from "prop-types";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from "components/CustomButtons/Button.jsx";

function Modal(props) {
    return (
        <Dialog
            open={props.open}
            onClose={props.closeModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                {props.content}
            </DialogContent>

            <DialogActions>
                <Button onClick={props.closeModal} size="sm" color="info" autoFocus>
                    Annuler
                        </Button>
                <Button size="sm" color={props.buttonColor} onClick={props.validation}>
                    {props.buttonContent}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
/*
Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    validation: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired,
    buttonColor: PropTypes.string,
    buttonContent: PropTypes.string.isRequired
};*/

export default Modal;