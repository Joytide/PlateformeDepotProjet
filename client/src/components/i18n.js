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
          home: { label: 'Home', },
          projects: { label: 'Projects', },
          submit: { label: 'Submit a project', },
          login: {label: 'Log in', },
          admin: {label: 'Admin', },
          linkLost: {label: 'Project link lost', },
          year: {label: 'Year',},
          partner: {label: 'Proposed by',},
          firm: {label: 'Company'},
          title: {label:'Project\'s title'},
          keywords: {label:'Keywords',},
          comment:{label:'Comments',},
          question:{label:'Feel free to ask your questions ',},
          questionH:{label:'Ask your question ! ',},
          button:{label:'Send ',},
          project:{ title:'List of projects',},
          major:{label:'Major',},
          filter:{label:'Filters',},
          ibo:{label:'Computer science, Big Data and IoT',},
          ne:{label:'New Energies',},
          if:{label:'Financial Engineering',},
          mnm:{label:'Computational Mechanics and Modelling',},
          partnerInfo:{label:'Partner information',},
          projectInfo:{label:'Project Information',},
          submission:{label:'Project Submission',},
          message:{label:' Thank you for your submission, your project is now waiting to be validated by the project team of the school. An email has been sent to your address mail containing a link that allows you to edit your submission if you want to. ',},
          tellus:{label:'Tell us about yourself',},
          email:{label:'Your email address *',},
          field:{label:'This field is required',},
          notvalid:{label:'email is not valid',},
          company:{label:'Your company *',},
          firstname:{label:'Your first name *',},
          lastname:{label:'Your last name *',},
          back:{label:'Back',},
          next:{label:'Next',},
          projectPres:{h2:'Please Present your project',},
          titleproj:{label:'Title of the project *',},
          year4:{label:'4th Year',},
          year5:{label:'5th Year',},
          majors:{label:'Major(s) Concerned *',},
          descriptionProj:{label:'A complete description of your project *',},
          finish:{label:'Finish',},
          delete:{label:'Delete',},
          keyword:{label:'Keywords (Press Enter on your keyboard to validate !)',},
          files:{label:'Others Files',},
          dropfiles:{label:'Drop files here or click to upload',},
          acceptedfiles:{label:'Accepted files : png , pdf , csv ...',},
          click:{label:' Click here',},
          example:{label:'to reset the example.',},
          welcomePlatform:{h1:'Welcome to DeVinci Platform',},
          welcomePole:{h1:'Welcome to Leonard De Vinci Campus ',},
          hybridation:{h2:'Hybridization and transversality',},
          approche:{h3:'A unique transversal approach',},
          presentation:{p:'The Leonardo da Vinci Pole Schools have developed a pedagogical transversality that encourages the opening up of teaching and allows students to work in multidisciplinary teams while progressing in their training and their digital knowledge.',},
          transvality:{label:'The Transversality',},
          keys:{label:'The Key numbers',},
          projectt:{label:'The Project',},
          program:{label:'The Programmes',},
          schools:{h2:'Our Schools',},
          campus:{h3:'One campus, four schools',},
          leonard:{p:'The Leonardo da Vinci Campus is three schools in Paris-La Défense: an engineering school, a management school, a multimedia school. In addition, an Institute offers continuing education.',},
          caouselTitle1:{label:'BermudZer: bermudean option pricing',},
          carouselText1:{label:'Industrial Innovation Project of the 5th year, Major Financial Engineering 2014-2015',},
          carouselTitle2:{label:'Vinci Eco Drive – Design and control of the engine block, Shell Eco-Marathon 2015',},
          carouselText2:{label:'5th-year Industrial Innovation Project, Major Mechanical Numerical and Modeling 2014-2015',},
          carouselTitle3:{label:'ID-cam: digital accessibility for the blind and visually impaired',},
          carouselText3:{label:'2017-2018 project of the 5th year of the ESILV engineering student program, 2018 promo',},
          carouselTitle4:{label:'Big Data analysis of Unesco sites via social networks',},
          carouselText4:{label:'5th Year Industrial Innovation Project, Major in Computer Science and Digital Science 2014-2015',}


          
        },
      },
      fr: {
        translation: {
            home: { label: 'Accueil', },
            projects: { label: 'Projets', },
            submit: { label: 'Soumettre un projet', },
            login: {label: 'Se connecter', },
            admin: {label: 'Admin', },
            linkLost: {label: 'Lien oublié', },
            year: {label: 'Année',},
            partner:{label:'Proposé par',},
            firm: {label: 'Entreprise'},
            title: {label: 'Titre du projet'},
            keywords:{label:'Mots-clés',},
            comment:{label:'Commentaires',},
            question:{label:'Posez votre question',},
            questionH:{label:'Posez une question ! ',},
            button:{label:'Envoyer',},
            project:{ title:'Liste des projets',},
            major:{label:'Majeure', },
            filter:{label:'Filtres',},
            ibo:{label:'Informatique, BigData et objets connectés',},
            ne:{label:'Nouvelles Energies',},
            if:{label:'Ingénierie Financière',},
            mnm:{label:'Mécanique numérique et modélisation',},
            partnerInfo:{label:'Des informations sur le partenaire',},
            projectInfo:{label:'Des informations sur le projet',},
            submission:{label:'Soumission du projet',},
            message:{label:'  Merci, votre projet est maintenant en attente de validation par l\'administration de l\'école concerné. Un email vous a été envoyé avec un lien pour modifier votre projet. ',},
            tellus:{label:'Parlez-nous de vous',},
            email:{label:'Votre adresse email * ',},
            field:{label:'Ce champ est obligatoire',},
            notvalid:{label:'Email indiqué n\'est pas valide',},
            company:{label:'Votre entreprise *',},
            firstname:{label:'Prénom *',},
            lastname:{label:'Nom *',},
            back:{label:'Précédent',},
            next:{label:'Suivant',},
            projectPres:{h2:'Présentez votre projet',},
            titleproj:{label:'Intitulé de votre projet *'},
            year4:{label:'Année 4',},
            year5:{label:'Année 5',},
            majors:{label:'Majeur(s) ciblée(s) *',},
            descriptionProj:{label:'Description complete de votre projet *',},
            finish:{label:'Terminer',},
            delete:{label:'Supprimer',},
            keyword:{label:'Mots clés (appuyez sur Entrée sur votre clavier pour valider ! )',},
            files:{label:'Autres Fichiers ',},
            dropfiles:{label:'Déposez les fichiers ici ou cliquez pour télécharger',},
            acceptedfiles:{label:'Types de fichiers acceptés : png , pdf , csv ...',},
            click:{label:' Cliquez ici',},
            example:{label:'pour réinitialiser l\'exemple.',},
            welcomePlatform:{h1:'Bienvenue sur la DeVinci Plateforme',},
            welcomePole:{h1:'Bienvenue au Pôle Léonard de Vinci',},
            hybridation:{h2:'Hybridation et transversalité',},
            approche:{h3:'Une approche transversale unique',},
            presentation:{p:'Les écoles du Pôle Léonard de Vinci ont développé une transversalité pédagogique qui encourage le décloisonnement des enseignements et permet aux étudiants de travailler en équipes pluridisciplinaires tout en progressant dans leur formation et leurs savoirs numériques.',},
            transvality:{label:'La Transversalité',},
            keys:{label:'Les Chiffres-clés',},
            projectt:{label:'Le Projet',},
            program:{label:'Les Programmes',},
            schools:{h2:'Les écoles',},
            campus:{h3:'Un campus, quatre écoles',},
            leonard:{p:'Le Pôle Léonard de Vinci, c’est trois écoles à Paris-La Défense : une école d’ingénieurs, une école de management, une école multimédia. En complément, un Institut propose de la formation continue.',},
            caouselTitle1:{label:'BermudZer : pricing d’options bermudéennes',},
            carouselText1:{label:'Projet d’Innovation Industrielle de 5ème année, Majeure Ingénierie Financière 2014-2015',},
            carouselTitle2:{label:'Vinci Eco Drive – Conception et pilotage du Bloc moteur, Shell Eco-Marathon 2015',},
            carouselText2:{label:'Projet d’Innovation Industrielle de 5ème année, Majeure Mécanique numérique et modélisation 2014-2015',},
            carouselTitle3:{label:'ID-cam : accessibilité numérique pour les non-voyants et mal-voyants',},
            carouselText3:{label:'Projet 2017-2018 de 5e année du cursus d’élève ingénieur de l’ESILV, promo 2018',},
            carouselTitle4:{label:'Analyse Big Data des sites Unesco via les réseaux sociaux',},
            carouselText4:{label:'Projet d’Innovation Industrielle de 5ème année, Majeure Informatique et sciences du numérique 2014-2015',}



        },
      },
    },
  })

export default i18next