import React from 'react';
import ProjectsListCard from '../components/Projects/ProjectsListCard';

class Partner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            partner: {},
            loaded: false
        };
    }

    componentDidMount() {
        let token;
        if (token = localStorage.getItem('token'))
            fetch('/api/partner/', {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': token
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        console.log("data:", data);
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