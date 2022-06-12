import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import SortByAlpha from "@material-ui/icons/SortByAlpha"

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import Button from "components/CustomButtons/Button.jsx";

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

class ContactList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            contacts: [],
            contactData: [],
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



    componentWillMount() {
        AuthService.fetch(api.host + ":" + api.port + "/api/contact", { crossDomain: true })
            .then(res => res.json())
            .then(data => {
                let contactData = data.map(contact => {
                    return [
                        contact.company || "-",
                        contact.last_name,
                        contact.first_name,
                        contact.email,
                    ];
                });

                this.setState({ contactData: contactData, contacts:data, loading: false });
            });
    }

    render() {
        const { classes } = this.props;

        if (!this.state.loading) {

            let sortedContacts = this.state.contacts.sort(function(a, b) {
                return a._id.localeCompare(b._id);
            });


            if (this.state.alphaSortName){
                sortedContacts = this.state.contacts.sort(function(a, b) {
                    return a.last_name.localeCompare(b.last_name);
                });
            }
            if (this.state.alphaSortCompany){
                sortedContacts= this.state.contacts.sort(function(a, b) {
                    try{
                        return a.company.localeCompare(b.company);
                    }
                    catch(e){
                        return false;
                    }
                        
                    
                });
            }

            let tableData = applyFilters(this.state.filters, sortedContacts).map(contact => {
                return [
                    // contact.phone ? "EGPE" : contact.__t || "Partenaire",
                    contact.kind,
                    contact.company || "-",
                    contact.last_name,
                    contact.first_name,
                    contact.email,
                    contact.phone,
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
                                <a href={api.host + ":" + api.port + "/api/contact/csv?token=" + AuthService.getToken()}>
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
                                    tableHead={["Type", "Entreprise", "Nom", "Prénom", "Email", "Téléphone"]}
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

export default withStyles(styles)(ContactList);


const applyFilters = (filters, datas) => {
    //console.log(filters, datas)
    return filters.reduce((acc, f) => acc.filter(f), datas)
}
