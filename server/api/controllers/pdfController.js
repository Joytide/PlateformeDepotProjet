const mongoose = require('mongoose');
const { spawn, exec } = require('child_process');
const ejs = require('ejs');
const fs = require('fs');
const Project = mongoose.model('Project');
const File = mongoose.model('File');

const { ProjectNotFoundError } = require('../../helpers/Errors');

const PDFUtils = {
    /**
     * Generate PDF for a project
     * @param {ObjectId} projectID Project for which you want to generate a PDF
     * @see generateHTML for how HTML file is generated
     * @see generatePDF for how HTML file is converted to PDF
     */
    generate: projectID => {
        return new Promise((resolve, reject) => {
            PDFUtils.generateHTML(projectID)
                .then(output =>
                    PDFUtils
                        .generatePDF(output.project, output.path)
                )
                .then(resolve)
                .catch(reject);
        });
    },

    /**
     * Generate a HTML file for project
     * @param {ObjectId} projectID Project for which you want to generate a HTML file
     */
    generateHTML: projectID => {
        return new Promise((resolve, reject) => {
            Project
                .findById(projectID)
                .populate("study_year files partner selected_keywords")
                .populate("specializations.specialization")
                .lean()
                .exec()
                .then(project => {
                    if (project) {
                        console.log("Generating",projectID)
                        if (project.specializations.filter(spe => spe.status === "validated").length != 0){
                        // No promises with ejs :(
                            ejs.renderFile(
                                process.cwd() + "/api/models/PDF_template.ejs",
                                {
                                    //imagePath: process.cwd() + "/PDF/logo-esilv.png",
                                    //imagePath: process.cwd() + "/PDF/logo-esilv.png",
                                    project: project
                                },
                                (err, html) => {
                                    if (err)
                                        reject(err);
                                    else {
                                        let path = process.cwd() + "/PDF/" + projectID + ".html";
                                        fs.writeFile(path, html, 'utf8', err => {
                                            if (err)
                                                reject(err);
                                            else
                                                resolve({ project, path });
                                        })
                                    }
                            });
                        }
                        else{
                            console.log("No specializations accepted this project")
                        }
                    }
                    else
                        throw new ProjectNotFoundError();
                })
                .catch(reject);
        });
    },

    /**
     * Generate a PDF for a project from an HTML file
     * @param {ObjectId} project project document with field populated
     * @param {string} HTMLpath path to the HTML file previously generated
     * @see generate Complete procedure for project's PDF generation
     */
    generatePDF: (project, HTMLpath) => {
        return new Promise((resolve, reject) => {
            let PDFpath = process.cwd() + "/PDF/" + project._id + ".pdf";
            // Using xvfb because of https://github.com/wkhtmltopdf/wkhtmltopdf/issues/2037
            // Using -a because of https://stackoverflow.com/questions/16726227/xvfb-failed-start-error
            let wkhtmltopdf = exec("xvfb-run -a wkhtmltopdf --disable-javascript "+HTMLpath+" "+PDFpath, function(err, stdout, stderr){
                if (err){
                    reject(err);
                    console.log("#stdout:",stdout);
                    console.log("#stderr:",stderr);
                }
                else{
                    console.log("Done wkhtmltopdf for ",project._id)

                    let pdf = new File({
                        projectID: project._id,
                        owner: project.partner._id,
                        originalName: project.number + " - " + project.title + ".pdf",
                        path: PDFpath
                    });
        
                    pdf.save(err => {
                        if (err)
                            reject(err);
                        else {
                            Project.updateOne({ _id: project._id }, { pdf: pdf._id }, err => {
                                if (err) reject(err);
                                else resolve(pdf);
                            });
                        }
                    })
                }
                
            });
            
        });
    },

    /**
     * Generate a PDF with all projects passed as argument
     * @param {Array} projects projects documents with pdf field populated. All project must have a pdf already generated
     */
    chainPDF: async (projects) => {
        return new Promise((resolve, reject) => {
            let files = projects.map(p => p.pdf ? p.pdf.path : undefined).filter(p => p !== undefined)
            console.log("FILES",files)


            let pdfunite = exec("pdfunite /usr/src/app/PDF/*.pdf /usr/src/app/.exports/AllProjects.pdf", function(err, stdout, stderr){
                if (err){
                    
                    console.log("#stdout:",stdout);
                    console.log("#stderr:",stderr);
                    reject(err);
                }
                else{
                    console.log("Done pdfunite");
                    resolve();
                }
            });

        });
    },

    cleanFile: (projectID, type) => {
        return new Promise((resolve, reject) => {
            let path = process.cwd() + "/PDF/" + projectID + "." + type;

            fs.exists(path, exists => {
                if (exists)
                    fs.unlink(path, err => {
                        if (err) reject(err);
                        else {
                            File.deleteOne({ path }, (err) => {
                                if (err) reject(err);
                                else resolve(PDFUtils);
                            });
                        };
                    });
                else
                    resolve(PDFUtils);
            });
        });
    }
}

/*emitter.on('projectValidated', data => {
    PDFUtils
        .generate(data.projectId)
        .catch(err => console.error(err))
});*/

exports.regeneratePDF = (req, res, next) => {
    const data = req.body;

    if (data._id) {
        PDFUtils
            .cleanFile(data._id, "pdf")
            .then(res => res
                .cleanFile(data._id, "html")
            )
            .then(PDF => PDF
                .generate(data._id)
                .then(() => res.json({}))
                .catch(next)
            )
            .catch(next);
    } else {
        next(new Error("MissingParameter"));
    }
}

exports.regenerateAllPDF = (req, res, next) => {
    Project
        .find().or([{ status: "validated" },{ status: "pending" }])
        .exec((err, projects) => {
            if (err) next(err);
            else if (projects.length > 0) {
                Promise
                    .all(projects.map(p => PDFUtils.generate(p._id)))
                    .then(res.json({ ok: 1 }))
                    .catch(next);
            }
            else
                next(new Error("NoValidatedProject"));
        });
}

exports.generateAllProjectsPDF = (req, res, next) => {
    Project.find().or([{ status: "validated" },{ status: "pending" }])
        .populate("pdf")
        .exec((err, projects) => {
            if (err) next(err);
            else if (projects.length > 0) {
                PDFUtils
                    .chainPDF(projects)
                    .then(() => {
                        res.download(process.cwd() + "/.exports/AllProjects.pdf");
                    })
                    .catch(next);
            }
            else {
                next(new Error("NoValidatedProject"));
            }
        });
}