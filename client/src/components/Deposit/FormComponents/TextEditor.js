import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState,RichUtils } from 'draft-js';
import { Button } from 'reactstrap';
export default class TextEditor extends Component {

    _onBoldClick() {
        this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'BOLD'));
      }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          this.props.onChange(newState);
          return 'handled';
        }
        return 'not-handled';
    }

    render() {
        return (
            <div>
            <Button size = "sm" color = "secondary" onClick={this._onBoldClick.bind(this)}>Bold</Button>
            <Editor editorState={this.props.editorState} 
            onChange={this.props.onChange}
            handleKeyCommand={this.handleKeyCommand.bind(this)} />
            </div>
        );
    }
}
