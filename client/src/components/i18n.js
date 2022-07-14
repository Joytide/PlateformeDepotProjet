import i18next from 'i18next';

i18next
	.init({
		interpolation: {
			escapeValue: false,
		},
		lng: 'en',
		resources: {
			en: {
				translation: {
					deposit: { label: "Deposit project" },
                    notfound: {label: "We looked everywhere but couldn't find the page you're looking for."},
					year: { label: 'Year', },
					partner: { label: 'Submit date', },
					firm: { label: 'Company' },
					title: { label: 'Project\'s title' },
					keywords: { label: 'Keywords *', choose: 'Click here to add keywords'},
					comment: { label: 'Comments', },
					question: { label: 'Feel free to ask your questions ', },
					questionH: { label: 'Ask your question ! ', },
					button: { label: 'Send ', },
					project: {
						title: 'List of projects',
						accepted: 'Project accepted !',
						pending: "Waiting for approval",
						rejected: "Project not acepted by school"
					},
					major: { label: 'Major', },
					filter: { label: 'Filters', },
					ibo: { label: 'Computer science, Big Data and IoT', },
					ne: { label: 'New Energies', },
					if: { label: 'Financial Engineering', },
					mnm: { label: 'Computational Mechanics and Modelling', },
					callForProjects: { label: 'Call for projects', },
					partnerInfo: { label: 'Partner information', },
					projectInfo: { label: 'Project Information', },
					submission: { label: 'Project Submission', },
					message: { label: ' Thank you for your submission, your project is now waiting to be validated by the ESILV. An email has been sent to your address testifying your deposit.', },
					tellus: { label: 'Tell us about yourself', },
					email: { label: 'Email address', },
					field: { label: 'This field is required', },
					field_length: { label: 'Maximum text length exceeded' },
					notvalid: { label: 'email is not valid', },
					company: { label: 'Company', },
					firstname: { label: 'First name', },
					lastname: { label: 'Last name', },
					back: { label: 'Back', },
					next: { label: 'Next', },
					createAccount: { label: 'Create account' },
					projectPres: { h2: 'Please Present your project', },
					titleproj: { label: 'Title of the project *', },
					year4: { label: '4th Year', },
					year5: { label: '5th Year', },
					majors: { label: 'Major(s) Concerned *', },
					years: { label: 'Concerned years *', },
					descriptionProj: { label: 'A complete description of your project *', subtext: 'Presentation, context, stakeholders, prerequisites (required skills, knowledge, software use...), objectives, potential constraints, expected end product and deliverables ', },
					finish: { label: 'Finish', },
					delete: { label: 'Delete', },
					keyword: { label: 'Keywords (Press Enter between each keywords !)', },
					files: { label: 'Others Files', },
					dropfiles: { label: 'If needed, drop files here', },
					acceptedfiles: { label: 'Accepted files are images and pdfs. max size: 10MB, max files: 3. ', },
					pdf: { label: 'Export as PDF', },
					click: { label: ' Click here', },
					example: { label: 'to reset the example.', },
					welcomePlatform: { h1: 'Welcome to DeVinci Platform', },
					welcomePole: { h1: 'Welcome to Leonard De Vinci Campus ', },
					hybridation: { h2: 'Hybridization and transversality', },
					approche: { h3: 'A unique transversal approach', },
					presentation: { p: 'The Leonardo da Vinci Pole Schools have developed a pedagogical transversality that encourages the opening up of teaching and allows students to work in multidisciplinary teams while progressing in their training and their digital knowledge.', },
					transvality: { label: 'The Transversality', },
					keys: { label: 'The Key numbers', },
					projectt: { label: 'The Project', },
					program: { label: 'The Programmes', },
					schools: { h2: 'Our Schools', },
					campus: { h3: 'One campus, four schools', },
					leonard: { p: 'The Leonardo da Vinci Campus is three schools in Paris-La Défense: an engineering school, a management school, a multimedia school. In addition, an Institute offers continuing education.', },
					createPartner: {
						phone: 'Phone number',
						address: "Address",
						company: "A company",
						association: "An association",
						school: "A school",
						other: "Other",
						kind: "You are ?",
						alreadyPartner: "Have you already been an ESILV partner ?",
						yes: "Yes",
						no: "No",
						created: "Your account has been successfuly created. An email has been sent.",
						isExisting: "You are already logged in. Clic on next to submit your project",
						invalidPhone: "Invalid phone number"
					},
					errors: {
                        createContact: "An error occured while trying to create your contact. Please retry.",
						emailUsed: "This email has already been used to create an account. Connect to your account before submitting a new project",
						createPartner: "An error occured while trying to create your account. Please retry.",
						createProject: "An error occured while trying to create your project. Please retry.",
                        emailUsedContact: "This email has already been used to create a contact.",
						NaN: "Please input a number",
						fillAll: "Please fill correctly all required fields",
						partnerNotFound: "No user found with that email",
						default: "Something wrong happened. Please retry later",
						unauthorized: "Action denied. Please ensure that you are correctly logged in.",
						invalidFile: "Please only deposit PDF, jpeg or png file",
                        largeFile: "Please only deposit file under 10MB",
                        tooManyFiles: "The limit of 3 deposited files has already been reached",
						fillTitle: "Please fill the title field",
						fillYear: "Please select at least one year concerned by that project",
						fillSpecialization: "Please select at least one specialiaztion concerned by that project",
						fillKeywords: "Please select at least one keyword for this project",
						fillDescription: "Please fill the description field"
					},
					createProject: {
						skills: "Skills developped",
						infos: "Further informations",
						multipleTeams: "How many maximum teams (of 5 students) would you want on your project ?",
						minTeamNumber: "Select a number higher than 1",
						biggerTeam:"How many students does your project needs ?",
						minStudentNumber: "Select a number higher than 5",
						teamInfo1: "Teams are initially formed by 4 or 5 students, working around 10h per week per student. Thus, your project is originally made up of one team of 5 students.",
                        teamInfo2: "However, you can have if you want either a bigger team (several teams in cooperation), or multiple teams simultaneously or in competion.",
						RandD: "Is it a research and development project ?",
						confidential: "Is your project confidential ?",
						international: "Do you agree to have international students working on your project? (full english project for monitoring, deliverables, etc...)",
						keywords: "Keywords describing the project",
						suggestedKeywords:"Additionnal keywords you would like to submit (comma separated)",
						descriptionHelper: `Indicate, if possible, in particular the following elements:
						context (project stakeholders),
						prerequisites that may be necessary (e.g. required skills, knowledge in the use of software, etc.),
						project objectives,
						possible constraints,
						 "deliverables" expected at the end of the project`,
                        downgrade: "If your project is only for Year 5, to you want to submit it to Year 4 in the event it isn't picked by Year 5 ? "
					},
                    contactPage: {
                        title: "Please leave us your contact!",
                        title_l2: "You'll contacted when the project deposit open next summer.",
                        leave_contact: "Send",
                        success: "Your contact has been saved"
                    },
					home: {
						title: 'Industrial Innovation Projects',
						title_p1: 'You are a company, a laboratory, a student? You want to test an idea, create a prototype, decipher and / or explore a field of innovation, ...?',
						title_p2: 'Discover <a target="_blank" href="https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/">4th year\'s projects</a> and <a target="_blank" href="https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-5/">5th year\'s projects</a>',
						p1: 'Submit a project to our students!',
						p1_l1: 'Proposing a project will allow you to cooperate with a team of motivated and innovative engineering students and to contribute to their training by involving them in current issues.',
						p1_l2: 'Companies or laboratories, it is also a way to make yourself known to those who will respond in the coming years to your internship and job offers.',
						p2: 'How does it work?',
						p2_l1: 'A project group is made up of 4 students (3 or 5 if necessary) who will each work about ten hours a week on your project.',
						p2_l2: 'Each group will be monitored and supervised by a teacher from the school ("project manager") who can provide them with scientific guidance.',
						p2_l3: 'These projects concern students in years 4 and 5, with a similar functioning and a slightly different timetable: the projects start for all in mid/end September, and end at the end of January for years 5 and at the end of March for years 4.',
						p2_l4: 'As students go on to work placements afterwards, it may be possible for your project to be "continued" as an internship by one of the team\'s students.',
						p3: 'What will be my role?',
						p3_l1: 'You will be able to present your project during the "project launch days":',
						p3_l2: ' - September 12 (9am-12.30pm) for the 5th years',
						p3_l3: ' - September 19 (9am-12:30pm) for the 4th years',
						p3_l4: 'If your project is chosen, you become a "project partner".',
						p3_l5: 'The team of students then contacts you for the project\'s kick-off, then keeps you informed of the progress of its work, by deadlines set together.',
						p3_l6: 'The team will be regularly monitored throughout its project by its "project manager", who will also be responsible for evaluating it.',
						p3_l7: 'They organize with you a mid-project report and a project closure in the presence of the "project manager".',
						p3_l8: 'At the end of the project, there will be a feedback meeting with the partner (project closure), followed by a showroom of presentations of all projects (30th January for the A5s; 1st April for the A4s) to which you will of course be invited and welcome.',
						p4: 'How to propose a project?',
						p4_l1: 'Click here to start the process of submitting a project.',
						p4_l2: '<em>You will then be asked to provide information on the partner and then describe the proposed project, and identify the desired and expected competencies.</em>',
						p4_l3: '<b>Deadline</b> for the submission of project proposals: <b>8yh September 2019</b>',
						p4_l4: '<a href="./Domains_PI2.pdf">Main tasks that can be requested in PI²</a>',
						p4_l5: 'If you have any questions, please do not hesitate to contact us: <a href="mailto:projetesilv@devinci.fr">projetesilv@devinci.fr</a>',
						p5: 'Thank you for your participation, and see you soon.',
						p5_l1: 'The EGPE (ESILV Project Management Team)',
					},
					navs: {
						home: 'Home',
						projects: 'Projects',
						myprojects: 'My projects',
						submit: 'Submit a project',
						login: 'Log in',
						admin: 'Admin',
						linkLost: 'Project link lost',
						welcome: 'Welcome',
						disconnect: "Disconnect"
					},
					forgetPass: {
						title: "Lost link",
						submit: 'Submit',
						desc: 'The first time you submitted a project, you should have received an email with a link to connect.\nIf it isn\'t in your spam inbox, we can send it again. You just have to fill the below textbox with your email address.',
						textfield: "Your email address",
						mailSent: "An email has been sent with your new connection link",
					},
					carousel: {
						Title1: 'BermudZer: bermudean option pricing',
						Text1: 'Industrial Innovation Project of the 5th year, Major Financial Engineering 2014-2015',
						Title2: 'Vinci Eco Drive – Design and control of the engine block, Shell Eco-Marathon 2015',
						Text2: '5th-year Industrial Innovation Project, Major Mechanical Numerical and Modeling 2014-2015',
						Title3: 'ID-cam: digital accessibility for the blind and visually impaired',
						Text3: '2017-2018 project of the 5th year of the ESILV engineering student program, 2018 promo',
						Title4: 'Big Data analysis of Unesco sites via social networks',
						Text4: '5th Year Industrial Innovation Project, Major in Computer Science and Digital Science 2014-2015',
						back: 'Back',
						next: 'Next',
					}
				},
			},
			fr: {
				translation: {
                    notfound: { label: "Nous avons bien cherché partout, mais nous ne trouvons pas la page que vous avez recherchée."},
					deposit: { label: "Deposer le projet" },
					year: { label: 'Année', },
					partner: { label: 'Proposé le', },
					firm: { label: 'Entreprise' },
					title: { label: 'Titre du projet' },
					keywords: { label: 'Mots-clés *', choose: "Cliquez ici pour choisir des mots-clés"},
					comment: { label: 'Commentaires', },
					question: { label: 'Posez votre question', },
					questionH: { label: 'Posez une question ! ', },
					button: { label: 'Envoyer', },
					project: {
						title: 'Liste des projets',
						accepted: 'Projet accepté !',
						pending: "En attente de validation",
						rejected: "Projet non accepté par l'école"
					},
					major: { label: 'Majeure', },
					filter: { label: 'Filtres', },
					ibo: { label: 'Informatique, BigData et objets connectés', },
					ne: { label: 'Nouvelles Energies', },
					if: { label: 'Ingénierie Financière', },
					mnm: { label: 'Mécanique numérique et modélisation', },
					callForProjects: { label: 'Appel à projets', },
					partnerInfo: { label: 'Des informations sur le partenaire', },
					projectInfo: { label: 'Des informations sur le projet', },
					submission: { label: 'Soumission du projet', },
					message: { label: '  Merci, votre projet est maintenant en attente de validation par l\'ESILV. Un email vous a été envoyé attestant du dépôt du projet. ', },
					tellus: { label: 'Parlez-nous de vous', },
					email: { label: 'Adresse email', },
					field: { label: 'Ce champ est obligatoire', },
					field_length: { label: 'Longueur maximale du texte dépassée' },
					notvalid: { label: 'Email indiqué n\'est pas valide', },
					company: { label: 'Entreprise', },
					firstname: { label: 'Prénom', },
					lastname: { label: 'Nom', },
					back: { label: 'Précédent', },
					next: { label: 'Suivant', },
					createAccount: { label: 'Créer le compte' },
					projectPres: { h2: 'Présentez votre projet', },
					titleproj: { label: 'Intitulé de votre projet *' },
					year4: { label: 'Année 4', },
					year5: { label: 'Année 5', },
					majors: { label: 'Majeure(s) concernée(s) *', },
					years: { label: 'Années concernée(s) *', },
					descriptionProj: { label: 'Description complète de votre projet *', subtext: 'Présentation, contexte (parties prenantes au projet), prérequis éventuellement nécessaires (compétences requises , connaissances dans l’utilisation de logiciels…), objectifs du projet, contraintes éventuelles, « livrables » attendus à la fin du projet, …', },
					finish: { label: 'Terminer', },
					delete: { label: 'Supprimer', },
					keyword: { label: 'Mots clés (appuyez sur Entrée entre chaque mot clefs ! )', },
					files: { label: 'Autres Fichiers ', },
					dropfiles: { label: 'Déposez ici les fichiers pouvant renseigner sur votre projet si besoin' },
					acceptedfiles: { label: 'Types de fichiers acceptés : images et pdfs. Taille maximum par fichier: 10MB, nombre de fichier maximum: 3', },
					pdf: { label: 'Exporter en PDF', },
					click: { label: ' Cliquez ici', },
					example: { label: 'pour réinitialiser l\'exemple.', },
					welcomePlatform: { h1: 'Bienvenue sur la DeVinci Plateforme', },
					welcomePole: { h1: 'Bienvenue au Pôle Léonard de Vinci', },
					hybridation: { h2: 'Hybridation et transversalité', },
					approche: { h3: 'Une approche transversale unique', },
					presentation: { p: 'Les écoles du Pôle Léonard de Vinci ont développé une transversalité pédagogique qui encourage le décloisonnement des enseignements et permet aux étudiants de travailler en équipes pluridisciplinaires tout en progressant dans leur formation et leurs savoirs numériques.', },
					transvality: { label: 'La Transversalité', },
					keys: { label: 'Les Chiffres-clés', },
					projectt: { label: 'Le Projet', },
					program: { label: 'Les Programmes', },
					schools: { h2: 'Les écoles', },
					campus: { h3: 'Un campus, quatre écoles', },
					leonard: { p: 'Le Pôle Léonard de Vinci, c’est trois écoles à Paris-La Défense : une école d’ingénieurs, une école de management, une école multimédia. En complément, un Institut propose de la formation continue.', },
					forgetPass: {
						title: "Lien de connexion perdu",
						submit: 'Envoyer',
						desc: 'Lors de la soumission de votre premier projet, un mail vous a été envoyé avec le lien de connexion.\nS\'il n\'est pas dans votre boite de spam, nous pouvons vous le renvoyer. Il suffit de remplir votre adresse mail ci-dessous.',
						textfield: "Votre adresse mail",
						mailSent: "Un mail vous a été envoyé avec votre nouveau lien de connexion"
					},
                    contactPage: {
                        title: "Laissez-nous votre contact!",
                        title_l2: "Vous serez contacté quand les dépôts de projets ouvriront l'été prochain.",
                        leave_contact: "Envoyer",
                        success: "Votre contact a été sauvergardé"
                    },
					createPartner: {
						phone: 'Numéro de téléphone',
						address: "Adresse",
						kind: "Vous êtes ?",
						company: "Une entreprise",
						association: "Une association",
						school: "Une école",
						other: "Autre",
						alreadyPartner: "Avez-vous déjà proposé un projet à l'ESILV ?",
						yes: "Oui",
						no: "Non",
						created: "Votre compte a bien été créé. Un mail vous a été envoyé.",
						isExisting: "Vous êtes déjà connecté. Cliquez sur suivant pour déposer votre projet",
						invalidPhone: "Numéro de téléphone invalide"
					},
					createProject: {
						skills: "Compétences développées",
						infos: "Informations complémentaires",
						multipleTeams: "Combien d’équipes (de 5 étudiants) maximum acceptez-vous d’avoir sur votre sujet ? ",
						minStudentNumber:"Saisir un nombre supérieur à 5",
						minTeamNumber: "Saisir un nombre supérieur à 1",
						biggerTeam: "Combien d’étudiants le travail que vous demandez nécessite-t-il ?",
						teamInfoOld: "Les équipes sont formées a priori de 4 ou 5 étudiants, travaillant à raison de 10h par semaine par étudiant. Votre projet est ainsi proposé a priori à une seule équipe de 4 ou 5 étudiants. Mais vous pouvez aussi, si vous le souhaitez, avoir une plus grosse équipe sur votre sujet (i.e plusieurs équipes en collaborations), ou plusieurs équipes en parallèle et/ou en concurrence.",
						teamInfo1: "Les équipes sont formées a priori de 4 ou 5 étudiants, travaillant à raison de 10h par semaine par étudiant. Ainsi vous pouvez avoir a priori une seule équipe de 5 étudiants pour travailler sur votre projet.",
                        teamInfo2: "Mais si le travail demandé nécessite plus d’étudiants, ou si vous souhaitez mettre plusieurs équipes en concurrence sur ce sujet, c’est possible.",
                        RandD: "Est-ce un projet de recherche et développement ?",
						keywords: "Mot-clés décrivants le projet",
						suggestedKeywords: "Mot-clés supplémentaires que vous voudriez soumettre",
						confidential: "Votre projet est-il confidentiel ?",
						international: "Acceptez-vous d'avoir des étudiants internationaux sur votre projet? (projet, suivi et livrables en anglais)",
						descriptionHelper: `Indiquer, si possible ,  en particulier les éléments suivants :
						contexte (parties prenantes au projet),
						prérequis éventuellement nécessaires (ex : compétences requises , connaissances dans l’utilisation de logiciels…),
						objectifs du projet,
						contraintes éventuelles,
						 « livrables »  attendus à la fin du projet`,
                        downgrade:"Si vous n’avez proposé votre projet qu’aux étudiants d’année 5, acceptez-vous de le soumettre aux années 4 s’il n‘est pas pris en année 5 ?"
					},
					errors: {
                        createContact: "Une erreur est seurvenue lors de la création de votre contact. Merci de réessayer.",
						emailUsed: "Cette adresse mail à déjà été utilisé pour créer un compte. Connectez vous avec le lien reçu par mail pour déposer un nouveau projet",
                        emailUsedContact: "Cette adresse mail à déjà été utilisé pour créer un contact.",
						createPartner: "Une erreur est survenue lors de la création de votre compte. Merci de réessayer.",
						createProject: "Une erreur est survenue lors de la création de votre projet. Merci de réessayer.",
						NaN: "Merci de saisir un nombre",
						fillAll: "Merci de remplir correctement tous les champs obligatoires",
						partnerNotFound: "Aucun utilisateur trouvé avec cette adresse mail",
						default: "Une erreur est survenue. Merci de réessayer",
						unauthorized: "Action refusée. Assurez vous d'être correctement connecté.",
						invalidFile: "Merci de déposer uniquement des PDF, des jpeg ou des png",
                        largeFile: "Merci de déposer uniquement des fichiers de taille inférieur à 10MB",
                        tooManyFiles: "La limite de 3 fichiers est déjà atteinte.",
						fillTitle: "Merci de remplir le champ titre du projet",
						fillYear: "Merci de sélectionner au moins une année concernée par ce projet",
						fillSpecialization: "Merci de sélectionner au moins une majeure concernée par ce projet",
						fillKeywords: "Merci de sélectionner au moins un mot clé concerné pour le projet",
						fillDescription: "Merci de remplir le champ description du projet"
					},
					home: {
						title: 'Projets Innovation Industrielle',
						title_p1: 'Vous êtes une entreprise, un laboratoire, un étudiant ? Vous souhaitez tester une idée, créer un prototype, déchiffrer et/ou explorer un terrain d\'innovation, ... ?',
						title_p2: 'Découvrir les projets de <a target="_blank" href="https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-4/">4eme année</a> et de <a target="_blank" href="https://www.esilv.fr/portfoliosets/projet-innovation-industrielle-5/">5eme année</a>',
						p1: 'Proposez un projet à nos élèves !',
						p1_l1: 'Proposer un projet vous permettra de coopérer avec une équipe d\'élèves ingénieurs motivés et innovants et de contribuer à leur formation en les impliquant dans des problématiques actuelles.',
						p1_l2: 'Entreprises ou laboratoires, c\'est aussi un moyen de vous faire connaître auprès de ceux qui répondront dans les années futures à vos offres de stages et d\'emplois.',
						p2: 'Comment ça marche ?',
						p2_l1: 'Un groupe projet est constitué de 4 élèves (3 ou 5 éventuellement) qui travailleront chacun une dizaine d\'heures par semaine sur votre projet.',
						p2_l2: 'Chaque groupe sera suivi et encadré par un enseignant de l\'école ("directeur de projet") à même de les guider scientifiquement.',
						p2_l3: 'Ces projets concernent les élèves d\'année 4 et d\'année 5, avec un fonctionnement similaire et un calendrier un peu différent : les projets démarrent pour tous mi/fin septembre, et se terminent fin janvier pour les années 5 et fin mars pour les années 4.',
						p2_l4: 'Les élèves partant en stage après, il peut être possible que votre projet soit "poursuivi" en stage par un élève de l\'équipe.',
						p3: 'Quel va être mon rôle ?',
						p3_l1: 'Vous pourrez présenter votre projet lors des journées "lancements projets" :',
						p3_l2: ' - le 12 septembre (9h-12h30) pour les années 5',
						p3_l3: ' - le 19 septembre (9h-12h30) pour les années 4',
						p3_l4: 'Si votre projet est choisi, vous devenez alors "partenaire du projet".',
						p3_l5: 'L\'équipe d\'élèves prend alors contact avec vous pour le kick-off du projet, puis vous tient au courant de l\'évolution de ses travaux, par des échéances fixées ensemble. ',
						p3_l6: 'L\'équipe sera suivie régulièrement tout au long de son projet par son « directeur de projet » qui sera aussi chargé de l\'évaluer.',
						p3_l7: 'Elle organise avec vous un bilan à mi-projet et une clôture en fin de projet en présence du « directeur de projet ».',
						p3_l8: 'La fin du projet verra une réunion de restitution avec le partenaire (clôture de projet), suivie d\'un showroom de présentations de tous les projets (le 30 janvier pour les A5 ; le 1er avril pour les A4) auquel vous serez bien entendu invité et bienvenu.',
						p4: 'Comment proposer un projet ?',
						p4_l1: 'Cliquez ici pour commencer le dépôt d\'un projet.',
						p4_l2: '<em>Vous devrez alors donner des informations sur le partenaire puis décrire le projet proposé, et cibler les compétences voulues et attendues.</em>',
						p4_l3: '<b>Deadline</b> pour le dépôt des proposition de projets : <b>8 Septembre 2019</b>',
						p4_l4: '<a href="./Domaines_PI2.pdf">Que peut-on demander dans un projet PI² ?</a>',
						p4_l5: 'Pour toute question, n\'hésitez pas à nous contacter : <a href="mailto:projetesilv@devinci.fr">projetesilv@devinci.fr</a>',
						p5: 'Merci de votre participation, et à très bientôt.',
						p5_l1: 'L\'EGPE (Equipe Gestion Projets ESILV)',
					},
					navs: {
						home: 'Accueil',
						projects: 'Projets',
						myprojects: 'Mes projets',
						submit: 'Soumettre un projet',
						login: 'Se connecter',
						admin: 'Admin',
						linkLost: 'Lien oublié',
						welcome: "Bienvenue ",
						disconnect: "Se déconnecter"
					},
					carousel: {
						Title1: 'BermudZer : pricing d’options bermudéennes',
						Text1: 'Projet d’Innovation Industrielle de 5ème année, Majeure Ingénierie Financière 2014-2015',
						Title2: 'Vinci Eco Drive – Conception et pilotage du Bloc moteur, Shell Eco-Marathon 2015',
						Text2: 'Projet d’Innovation Industrielle de 5ème année, Majeure Mécanique numérique et modélisation 2014-2015',
						Title3: 'ID-cam : accessibilité numérique pour les non-voyants et mal-voyants',
						Text3: 'Projet 2017-2018 de 5e année du cursus d’élève ingénieur de l’ESILV, promo 2018',
						Title4: 'Analyse Big Data des sites Unesco via les réseaux sociaux',
						Text4: 'Projet d’Innovation Industrielle de 5ème année, Majeure Informatique et sciences du numérique 2014-2015',
						back: 'Précédent',
						next: 'Suivant',
					}
				},
			},
		},
	})

export default i18next