import React from 'react';
import ProjectsListCard from '../components/Projects/ProjectsListCard';
import AuthService from '../components/AuthService';


class Partner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            partner: {},
            loaded: false
        };
    }

    componentDidMount() {
        AuthService
            .getUser()
            .then(data => {
                console.log(data);
                if (data) {
                    this.setState({
                        partner: data,
                        loaded: true
                    });
                }
            });
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

export default Partner;