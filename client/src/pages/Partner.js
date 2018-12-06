import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
        console.log();
        fetch('/api/partner/' + this.props.match.params.key)
            .then(res => res.json())
            .then(data => {
                console.log("data:", data);
                this.setState({
                    partner: data,
                    loaded: true
                })
            });
    }

    render() {
        if (this.state.loaded) {
            return (
                <div>
                    <Grid container spacing={24} alignItems="center" justify="center">
                        <Grid item xs={10}>
                            <Paper>
                                <Typography align="center" variant="h2">Bienvenue ...</Typography>
                                <Typography align="center" variant="subtitle2">Bienvenue ...</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <ProjectsListCard lng={this.props.lng} projects={this.state.partner.projects} showPartner={false} />
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}

export default Partner;