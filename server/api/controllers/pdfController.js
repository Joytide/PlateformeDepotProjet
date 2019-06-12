const { emitter } = require('../../eventsCommon');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const ejs = require('ejs');
const fs = require('fs');
const Project = mongoose.model('Project');
const File = mongoose.model('File');

emitter.on('projectValidated', args => {
    generateHTML(args)
        .then(output => {
            generatePDF(output.project, output.path);
        });
});

function generateHTML(projectID) {
    return new Promise((resolve, reject) => {
        Project
            .findById(projectID)
            .populate("study_year files partner")
            .populate("specializations.specialization")
            .exec((err, project) => {
                if (err)
                    throw err;
                else if (project) {
                    ejs.renderFile(process.cwd() + "/api/models/PDF_template.ejs", {
                        imagePath: process.cwd() + "/PDF/logo-esilv.jpg",
                        project: project
                    },
                        (err, html) => {
                            if (err)
                                console.error(err);
                            else {
                                let path = process.cwd() + "/PDF/" + projectID + ".html";
                                fs.writeFile(path, html, 'utf8', err => {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve({project, path});
                                })
                            }
                        });
                }
            });
    });
}

function generatePDF(project, HTMLpath) {
    let PDFpath = process.cwd() + "/PDF/" + project._id + ".pdf";
    console.log(HTMLpath, PDFpath);
    let wkhtmltopdf = spawn("wkhtmltopdf", [
        HTMLpath,
        PDFpath]
    );

    wkhtmltopdf.on('close', exitCode => {
        console.log(exitCode);

        let pdf = new File({
            projectID: project._id,
            owner: project.partner._id,
            originalName: project.number + " - " + project.title + ".pdf",
            path: PDFpath
        })

        pdf.save(err => {
            if (err)
                throw err;
            else {
                Project.updateOne({ _id: project._id }, { pdf: pdf._id }, err => {
                    if (err) throw err;
                });
            }
        });
    });
}