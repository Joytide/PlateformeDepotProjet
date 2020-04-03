exports.handleXhrError = snackbar => err => {
    if (err && snackbar) {
        console.error("Error : ",err);

        /* ----------------------------- BAD REQUEST ----------------------------- */
        if (err.status === 400 && err.statusText === "Bad Request")
            getRequestData(err)
                .then(data => {
                    if (data)
                        if (data.code === "MissingParameter")
                            snackbar.notification("error", "Merci de vérifier que tous les champs sont correctement remplis.");
                        else if (data.code === "FileNotFound")
                            snackbar.notification("error", "Fichier introuvable.");
                        else if (data.code === "InvalidCredentials")
                            snackbar.notification("error", "Identifiants incorrects.");
                        else if (data.code === "InvalidParameter")
                            snackbar.notification("error", "Veuillez vérifier que les paramètres fournis sont corrects.");
                        else if (data.code === "PartnerNotFound")
                            snackbar.notification("error", "Partenaire introuvable.");
                        else if (data.code === "ProjectNotFound")
                            snackbar.notification("error", "Projet introuvable.");
                        else if (data.code === "SpecializationNotFound")
                            snackbar.notification("error", "Majeure introuvable.");
                        else if (data.code === "UserNotFoundError")
                            snackbar.notification("error", "Utilisateur introuvable.");
                        else if (data.code === "YearNotFoundError")
                            snackbar.notification("error", "Année introuvable.");

                        else
                            throw data;
                })
                .catch(() => {
                    snackbar.notification("error", "Bad Request");
                });

        /* ----------------------------- UNAUTHORIZED ----------------------------- */
        else if (err.status === 401 && err.statusText === "Unauthorized")
            snackbar.notification("error", "Une erreur est survenue en tentant de vous authentifier. Merci de vous reconnecter et de rééssayer.");

        /* ----------------------------- FORBIDDEN ----------------------------- */
        else if (err.status === 403 && err.statusText === "Forbidden")
            snackbar.notification("error", "Vous n'êtes pas autorisé à effectuer cette action.");

        /* ----------------------------- CONFLICT ----------------------------- */
        else if (err.status === 409 && err.statusText === "Conflict")
            getRequestData(err)
                .then(data => {
                    if (data)
                        if (data.code === "ExistingEmail")
                            snackbar.notification("error", "Cette adresse mail est déjà utilisée.");
                        else if (data.code === "ExistingName")
                            snackbar.notification("error", "Un mot clef existe déjà avec ce nom.")
                        else if (data.code === "ReferentAlreadyRegistered")
                            snackbar.notification("error", "Cet utilisateur a déjà été désigné responsable de cette majeure.")

                        else
                            throw data;
                })
                .catch(() => {
                    snackbar.notification("error", "Conflict");
                });

        /* ----------------------------- INTERNAL SERVER ERROR ----------------------------- */
        else if (err.status === 500 && err.statusText === "Internal Server Error ")
            snackbar.notification("error", "Une erreur est survenue sur le serveur. Merci de rééssayer plus tard ou de contacter un administrateur si l'erreur persiste.");

        else
            snackbar.notification("error", "Une erreur inconnue est survenue.");
    }
}

const getRequestData = err =>
    new Promise((resolve, reject) => {
        err
            .json()
            .then(data => {
                console.log(data);
                resolve(data)
            })
            .catch(reject);
    });