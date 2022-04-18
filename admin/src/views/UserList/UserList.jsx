import React from "react";
import { Link } from 'react-router-dom';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import Visibility from "@material-ui/icons/Visibility"
import SortByAlpha from "@material-ui/icons/SortByAlpha"


// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import Button from "components/CustomButtons/Button.jsx";
import Danger from "components/Typography/Danger.jsx";

import { api } from "config.json"
import AuthService from "components/AuthService"

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF"
        }
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1"
        }
    }
};

class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            users: [],
            userData: [],
            filters: [],
            alphaSortName: false,
            alphaSortCompany: false
        };

        this.handleChange = this.handleChange.bind(this);

    }

    handleChange = name => event => {
        let temp
        switch (name) {
            case "alphaSortName":
                temp=this.state.alphaSortName;
                this.setState(
                    { alphaSortName: !temp ,
                    alphaSortCompany: false
                    },
                );
                break;
            case "alphaSortCompany":
                temp=this.state.alphaSortCompany;
                this.setState(
                    { alphaSortName: false ,
                    alphaSortCompany: !temp
                    },
                );
                break;
            default:
                this.setState(
                    { [name]: event.target.checked },
                    //this.updateFilters
                );
                break;
            
        }
        console.log("state:",this.state);        
    }
    /*
    updateFilters = () => {
        let filters = [];
        let status = [];

        if (this.state.rejectedProjects)
            status.push("rejected")
        if (this.state.validatedProjects)
            status.push("validated")
        if (this.state.pendingProjects)
            status.push("pending")

        filters.push(p => status.indexOf(p.status) !== -1);

        if (this.state.WaitingForMe)
            filters.push(p => p.specializations.every(spe => spe.specialization.referent.indexOf(this.props.user.user._id) === -1 ? true : (spe.status === "pending" ? true : false)));
        if (this.state.ValidatedByMe)
            filters.push(p => p.specializations.every(spe => spe.specialization.referent.indexOf(this.props.user.user._id) === -1 ? true : (spe.status === "validated" ? true : false)));
        if (this.state.RejectedByMe)
            filters.push(p => p.specializations.every(spe => spe.specialization.referent.indexOf(this.props.user.user._id) === -1 ? true : (spe.status === "rejected" ? true : false)));
        

        if (this.state.keywordSort && this.state.keywordSort !== "None")
            filters.push(p => p.selected_keywords.map(kw => kw.name.fr).flat().indexOf(this.state.keywordSort) !== -1);
        
        this.setState({ filters })
    }
    */


    componentWillMount() {
        AuthService.fetch(api.host + ":" + api.port + "/api/user", { crossDomain: true })
            .then(res => res.json())
            .then(data => {
                let userData = data.map(user => {
                    if (user.admin) return [
                        (<Danger>{user.EPGE ? "EGPE" : user.__t}</Danger>),
                        (<Danger>{user.company || "-"}</Danger>),
                        (<Danger>{user.last_name}</Danger>),
                        (<Danger>{user.first_name}</Danger>),
                        (<Danger>{user.email}</Danger>),
                        (<Link to={"/user/" + user._id}><Button size="sm" type="button" color="info"><Visibility /> Voir le profil</Button></Link>)
                    ];
                    else return [
                        user.EPGE ? "EGPE" : user.__t || "Partenaire",
                        user.company || "-",
                        user.last_name,
                        user.first_name,
                        user.email,
                        (<Link to={"/user/" + user._id}><Button size="sm" type="button" color="info"><Visibility /> Voir le profil</Button></Link>)
                    ];
                });

                this.setState({ userData: userData, users:data, loading: false });
            });
    }

    render() {
        const { classes } = this.props;
        
        

        /*
        if (this.state.alphaSortProject){
            sortedProjects= this.state.projects.sort(function(a, b) {
                return a.title.localeCompare(b.title);
             });
        }

        if (this.state.alphaSortName){
            sortedProjects = this.state.projects.sort(function(a, b) {
                return a.study_year.map(year => year.abbreviation).sort().join(', ').localeCompare(b.study_year.map(year => year.abbreviation).sort().join(', '));
             });
        }
        */
        if (!this.state.loading) {

            let sortedUsers = this.state.users.sort(function(a, b) {
                return a._id.localeCompare(b._id);
            });


            if (this.state.alphaSortName){
                sortedUsers = this.state.users.sort(function(a, b) {
                    return a.last_name.localeCompare(b.last_name);
                });
            }
            if (this.state.alphaSortCompany){
                sortedUsers= this.state.users.sort(function(a, b) {
                    try{
                        return a.company.localeCompare(b.company);
                    }
                    catch(e){
                        return false;
                    }
                        
                    
                });
            }

            let tableData = applyFilters(this.state.filters, sortedUsers).map(user => {
                if (user.admin) return [
                    (<Danger>{user.EPGE ? "EGPE" : user.__t}</Danger>),
                    (<Danger>{user.company || "-"}</Danger>),
                    (<Danger>{user.last_name}</Danger>),
                    (<Danger>{user.first_name}</Danger>),
                    (<Danger>{user.email}</Danger>),
                    (<Link to={"/user/" + user._id}><Button size="sm" type="button" color="info"><Visibility /> Voir le profil</Button></Link>)
                ];
                else return [
                    user.EPGE ? "EGPE" : user.__t || "Partenaire",
                    user.company || "-",
                    user.last_name,
                    user.first_name,
                    user.email,
                    (<Link to={"/user/" + user._id}><Button size="sm" type="button" color="info"><Visibility /> Voir le profil</Button></Link>)
                ];
            });

            
            return (
                <GridContainer>
                    
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Liste des utilisateurs</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Liste de tous les utilisateurs existants sur la plateforme
            </p>
                            </CardHeader>
                            <GridItem>
                                <a href={api.host + ":" + api.port + "/api/user/csv?token=" + AuthService.getToken()}>
                                    <Button size="sm" color="info">
                                        Télécharger les partenaires au format CSV
                                    </Button>
                                </a>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <Button
                                    color= {this.state.alphaSortCompany ? "success" : "white"}
                                    onClick={this.handleChange("alphaSortCompany")}
                                >
                                    <SortByAlpha/> Tri par entreprise
                                </Button>

                                <Button
                                    color= {this.state.alphaSortName ? "success" : "white"}
                                    onClick={this.handleChange("alphaSortName")}
                                >
                                    <SortByAlpha/> Tri par noms
                                </Button>
                            </GridItem>
                            <CardBody>
                                <Table
                                    tableHeaderColor="primary"
                                    tableHead={["Type", "Entreprise", "Nom", "Prénom", "Email", "Actions"]}
                                    tableData={tableData}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            );
        }
        else{
            return (<div></div>);
        }
    }
}

export default withStyles(styles)(UserList);


const applyFilters = (filters, datas) => {
    //console.log(filters, datas)
    return filters.reduce((acc, f) => acc.filter(f), datas)
}
