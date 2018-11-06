import React, { Component } from 'react';
import Files from 'react-files';
import ReactDOM from 'react-dom';
import {FormGroup,Label} from "reactstrap";
import i18n from '../../i18n';
class FilesInputs extends Component {

    OnFilesError(error, file) {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    render() {
        const lng = this.props.lng;
        return (
            <FormGroup>
                <Label for = "files" lng={lng} > {i18n.t('files.label',{lng})}</Label>
                <div className="file">
                    <Files
                        className='files-dropzone'
                        onChange={this.props.change}
                        onError={this.OnFilesError}
                        accepts={['image/*', 'application/pdf']}
                        multiple
                        maxFiles={3}
                        maxFileSize={10000000}
                        minFileSize={0}
                        clickable
                    >
                        <p className="lead text-center">{i18n.t('dropfiles.label',{lng})}</p>
                        <p className="text-center help-block">{i18n.t('acceptedfiles.label',{lng})}</p>
                    </Files>
                </div>
                <div id="addedFiles" className="col-md-4 list-group">
                </div>
            </FormGroup>);
    }
}

export default FilesInputs;
