'use strict';

const mongoose = require('mongoose');
const { isValidType, areValidTypes, ExistingTeamError, ProjectNotFoundError, TooManyTeamsError } = require('../../helpers/Errors');

const Team = mongoose.model('Team');
const PRM = mongoose.model('PRM');
const Project = mongoose.model('Project');

/**
 * Create a new team
 */
exports.create = team =>
    new Promise((resolve, reject) => {
        // For each elements of the teams array, create a new team
        areValidTypes(
            [team.teamNumber, team.year, team.projectNumber],
            ["teamNumber", "year", "projectNumber"],
            ["number", "number", "number"]
        )
            .then(() => teamExists(team))
            .then(() => projectExists(team.projectNumber))
            .then(project => teamCanBeAdded(project))
            .then(project => {
                return Team.create({
                    project: project._id,
                    year: team.year,
                    teamNumber: team.teamNumber
                });
            })
            .then(resolve)
            .catch(reject);
    });

/**
 * List all exsting teams
 */
exports.list = () =>
    new Promise((resolve, reject) => {
        Team
            .find()
            .populate({
                path: "project",
                select: "title number"
            })
            .populate({
                path: "prm",
                select: "first_name last_name"
            })
            .sort("year teamNumber")
            .lean()
            .exec()
            .then(resolve)
            .catch(reject);
    });

exports.setPRM = ({ prmId, teamId }) =>
    new Promise((resolve, reject) => {
        areValidTypes([prmId, teamId], ["prmId", "teamId"], ["ObjectId", "ObjectId"])
            .then(() => {
                let findPRM = PRM.findOne({ _id: prmId }).lean().exec();
                let findNumberOfProject = Team.find({ prm: prmId }).lean().exec();

                return Promise.all([findPRM, findNumberOfProject]);
            })
            .then(([prm, numberOfTeams]) => {
                console.log(prm.projectNumber, numberOfTeams.length, prm.projectNumber > numberOfTeams.length)
                if (prm.projectNumber > numberOfTeams.length) {
                    return Team.updateOne({ _id: teamId }, { $set: { prm: prmId } }).exec()
                }
                else
                    throw new TooManyTeamsError();
            })
            .then(resolve)
            .catch(reject);
    });

exports.correspondance = () =>
    new Promise((resolve, reject) => {
        let PRMListPromise = getPRMList();
        let teamAndProjectsPromise = getTeamsAndProjects();

        Promise
            .all([teamAndProjectsPromise, PRMListPromise])
            .then(([projects, prms]) => {
                let correspondances = {};

                for (let i = 0; i < projects.length; i++) {
                    let projectKeywords = projects[i].keywords.map(k => k.toString());

                    for (let j = 0; j < prms.length; j++) {
                        let commonKeywords = 0;
                        let compatibility = 0;
                        let numberKeywords = projectKeywords.length;

                        let prmKeywords = prms[j].keywords.map(k => k.toString());

                        // Get a compatibility score from number of common keywords
                        for (let k = 0; k < numberKeywords; k++)
                            if (prmKeywords.indexOf(projectKeywords[k]) !== -1)
                                commonKeywords++;

                        compatibility = commonKeywords / numberKeywords;

                        // If the partner can handle all the teams for that projects, he gets +10% compability
                        if (projects[i].maxTeams <= prms[j].projectNumber)
                            compatibility += 0.1;

                        // If not entry in correspondance array, create one
                        if (!correspondances[projects[i]._id])
                            correspondances[projects[i]._id] = [];

                        // push compatibility of the current prm to  the correspondace array
                        correspondances[projects[i]._id].push({ prm: prms[j]._id, compatibility });
                    }

                    correspondances[projects[i]._id] = correspondances[projects[i]._id].sort((a, b) => a.compatibility < b.compatibility ? 1 : -1);
                }

                resolve(correspondances);
            })
            .catch(reject);
    });

/**
 * Get all teams and projects choosen by teams
 */
const getTeamsAndProjects = () =>
    new Promise((resolve, reject) => {
        Team.find({})
            .lean()
            .exec()
            .then(teams => {
                let projects = teams.map(t => t.project);

                Project.find({ _id: projects })
                    .select("keywords maxTeams")
                    .lean()
                    .exec()
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });

/**
 * Return promise which resolves with the list of PRMs
 */
const getPRMList = () =>
    new Promise((resolve, reject) => {
        PRM.find({})
            .select("first_name last_name keywords projectNumber")
            .lean()
            .exec()
            .then(resolve)
            .catch(reject);
    });

/**
 * Check if a team already exists
 * @param {Object} team 
 * @param {Number} team.year 
 * @param {Number} team.teamNumber
 */
const teamExists = team =>
    new Promise((resolve, reject) => {
        Team.find({ year: team.year, teamNumber: team.teamNumber })
            .lean()
            .exec()
            .then(existingTeam => {
                if (existingTeam.length === 0)
                    resolve()
                else
                    throw new ExistingTeamError(existingTeam);
            })
            .catch(reject);
    });

/**
 * Check if a project exists. If is exists, the promise is resolved with the project. Otherwise an error is thrown
 * @param {Number} projectNumber 
 * @returns {Promise}
 */
const projectExists = projectNumber =>
    new Promise((resolve, reject) => {
        let projectNumberPadded = projectNumber.toString().padStart(3, '0');

        Project
            .findOne({ number: projectNumberPadded, status: "validated" })
            .lean()
            .exec()
            .then(project => {
                if (project)
                    resolve(project);
                else
                    throw new ProjectNotFoundError("Project number " + projectNumberPadded + " not found");
            })
            .catch(reject);
    });

/**
 * Check if a team can be added to a project. If the maximum teams isn't reached yet, the promise is resolved with the project. Otherwise an error is thrown
 * @param {Object} project 
 * @returns {Promise}
 */
const teamCanBeAdded = project =>
    new Promise((resolve, reject) => {
        Team
            .countDocuments({ project: project._id })
            .exec()
            .then(count => {
                if (count < project.maxTeams)
                    resolve(project)
                else
                    throw new TooManyTeamsError(project.number);
            })
            .catch(reject);
    });