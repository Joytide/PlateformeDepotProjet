import React from 'react';
import Files from 'react-files';
import { FormGroup, Label } from "reactstrap";
import i18n from '../../i18n';
import AuthService from '../../AuthService';
import { api } from "../../../config.json";
import { withSnackbar } from "../../../providers/SnackbarProvider/SnackbarProvider";


class FilesInputs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            errorCode: 0
        }

        this.onChange = this.onChange.bind(this);
        this.setFiles = this.props.setFiles || (() => { });
        this.OnFilesError = this.OnFilesError.bind(this);
    }

    OnFilesError(error, file) {
        this.setState({errorCode:error.code});
    }

    onChange(event) {
        const file = event[event.length - 1];
    
        if (file) {
            var formData = new FormData();
            formData.append("file", new Blob([file], { type: file.type }), file.name || 'file');

            fetch(api.host + ":" + api.port + '/api/project/file', {
                method: "POST",
                headers: {
                    "Authorization": AuthService.getToken()
                },
                body: formData
            })
                .then(res => {
                    if (!res.ok)
                        throw res;
                    else
                        return res.json();
                })
                .then(data => {
                    this.setState(state => {
                        file._id = data._id;
                        const list = [...state.files, {
                            name: file.name,
                            type: file.type,
                            _id: data._id
                        }];

                        this.setFiles(list);
                        return { files: list };
                    });
                })
                .catch(err => {
                    const { lng } = this.props;
                    console.error(err);
                    this.props.snackbar.notification("error", i18n.t('errors.default', { lng }), 10000);
                });
        }
        else{
            switch(this.state.errorCode){
                case 1:
                    this.props.snackbar.notification("error", i18n.t('errors.invalidFile', { lng: this.props.lng }), 10000);
                    break;
                case 2:
                    this.props.snackbar.notification("error", i18n.t('errors.largeFile', { lng: this.props.lng }), 10000);
                    break;
                default:
                    this.props.snackbar.notification("error", i18n.t('errors.default', { lng: this.props.lng }), 10000);
                    break;
            };
        }
    }

    deleteFile = fileID => () => {
        const data = {
            id: fileID
        }
        AuthService.fetch("/api/project/file", {
            method: "DELETE",
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok)
                    this.setState({
                        files: this.state.files.filter(f => f._id !== fileID)
                    })
                else
                    throw res;
            })
            .catch(err => {
                const { lng } = this.props;
                console.error(err);
                this.props.snackbar.notification("error", i18n.t('errors.default', { lng }), 10000);
            })
    }

    render() {
        const lng = this.props.lng;
        return (
            <FormGroup>
                <Label for="files" lng={lng} > {i18n.t('files.label', { lng })}</Label>
                <div className="file">
                    <Files
                        className='files-dropzone'
                        onChange={this.onChange}
                        onError={this.OnFilesError}
                        accepts={['image/*', 'application/pdf']}
                        maxFiles={3}
                        maxFileSize={10000000}
                        minFileSize={0}
                        clickable
                    >
                        <p className="lead text-center">{i18n.t('dropfiles.label', { lng })}</p>
                        <p className="text-center help-block">{i18n.t('acceptedfiles.label', { lng })}</p>
                    </Files>
                </div>
                <div id="addedFiles" className="col-md-4 list-group">
                    {this.state.files.map((file, index) =>
                        (
                            <a key={index} className="justify-content-between file-add list-group-item list-group-item-action">
                                <div>
                                    <p>{file.name}</p>
                                    <button onClick={this.deleteFile(file._id)}>{i18n.t('delete.label', { lng })} </button>
                                </div>
                            </a>)
                    )
                    }
                </div>
            </FormGroup>);
    }
}

export default withSnackbar(FilesInputs);
