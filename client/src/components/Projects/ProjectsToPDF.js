import React from 'react';
import i18n from '../i18n';

import jsPDF from 'jspdf'

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


class ProjectsToPDF extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            type: this.props.ProjectsType,
		}
    }
    handleSaving = (doc) => {
        var today = new Date();
        var filename = "DeVinciDeposit_"
        console.log(this.state.type)
        if(this.state.type==="all")
        {
            filename+="allProjects_"
        }
        else if(this.state.type==="one")
        {
            filename+=this.props.projects[0].title.substring(0,15)+"_"
        }
        doc.save(filename+ today.toLocaleDateString() +'.pdf')
        return 1
    }

    handleNewPage = (doc, y) => {
        if(y>=11)
        {
            doc.addPage()
            y=1
        }
        return y
    };

	handleDownload = () => {

        const lng = this.props.lng;

        var doc = new jsPDF({
            unit: 'in',
            //format: [4, 2]
          })
          
          doc.setFont("times")
          doc.setFontSize(20)
          doc.text('DeVinci Deposit : '+ this.state.type + " project(s)", 2.5, 0.75)

          let y = 1.5
          let taille_ligne = 107

          this.props.projects.map(project =>
            {
                y= this.handleNewPage(doc,y)
                
                doc.setFontSize(15)
                doc.text(project.number + " - " +project.title,0.75,y)
                y+=0.20
                doc.setFontSize(10)
                doc.text(i18n.t('partner.label', {lng}) + " : "+project.partner.company + ", " +new Date(project.sub_date).toLocaleDateString(),1,y)
                y+=0.25

                //Ajout de la description
                for(let i=0;i<project.description.length;i+=taille_ligne)
                {
                    let line = project.description.substring(i,i+taille_ligne)
                    
                    let k =0
                    //Gestion des retours chariots cassant la mise en page
                    while(line.includes('\n'))
                    {
                        let temp = line.indexOf('\n')
                        i-= (line.length-temp)
                        line = line.replace('\n','')
                        line = line.substring(0,temp)
                    }
                    //gestion des mots coupés par le retour à la ligne
                    while(line[line.length-1]!=='\n'&&line[line.length-1]!==' ' && i+taille_ligne<project.description.length && k<10) 
                    {
                        line += project.description[i+taille_ligne]
                        i+=1
                        k+=1
                    }
                    
                    doc.text(line,1,y)
                    y+=0.15
                    y=this.handleNewPage(doc,y)
                }
                
                y+=0.25

                //Ajout des années, majeures et mots-clés
                let x = 1
                doc.text("Tags : ",0.75,y)
                y+=0.15
                project.study_year.map(year =>
                    {
                        doc.text(year.abbreviation,x,y)
                        x+=year.abbreviation.length*0.1
                    }
                )
                y+=0.15
                x = 1
                project.majors_concerned.map(major =>
                    {
                        doc.text(major.abbreviation,x,y)
                        x+=major.abbreviation.length*0.13
                    }
                )
                y+=0.15
                x = 1
                project.keywords.map(keyword =>
                    {
                        doc.text(keyword,x,y)
                        x+=keyword.length*0.13
                    }
                )
                x = 1
                y+=0.15
                y=this.handleNewPage(doc,y)
                doc.text("Files : ",0.75,y)
                project.media_files.map(file =>
                    {
                        y+=0.15
                        doc.text(file.originalname,x,y)
                    }
                )
                y+=0.5
            }
            );

            this.handleSaving(doc)
            return 1
	};
	render() {
		const lng = this.props.lng;

		return (
			<div>
                <Button lng={lng} variant="outlined" color='secondary' onClick={this.handleDownload} style={{ marginRight: 12 }}>
					<Typography variant="button" >
                        {i18n.t('pdf.label', {lng})}
					</Typography>
				</Button>
			</div>);
	}
}

export default ProjectsToPDF;
