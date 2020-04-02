import React from 'react';
import ProjectsListCard from '../components/Projects/ProjectsListCard';
import AuthService from '../components/AuthService';
import { withSnackbar } from "../providers/SnackbarProvider/SnackbarProvider";
import i18n from '../components/i18n';

class Partner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            partner: {},
            loaded: false
        };
    }

    componentDidMount() {
        AuthService.fetch("/api/partner/me")
            .then(res => {
                if (res.ok)
                    return res.json();
                else
                    throw res
            })
            .then(partner => {
                if (partner) {
                    this.setState({
                        partner: partner,
                        loaded: true
                    });
                }
            })
            .catch(err => {
                console.error(err);
                this.props.snackbar.notification("danger", i18n.t("errors.default", { lng: this.props.lng }));
            })
    }

    render() {
        if (this.state.loaded) {
            return (
                <div>
                    <ProjectsListCard lng={this.props.lng} projects={this.state.partner.projects} showPartner={false} />
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}

export default withSnackbar(Partner);