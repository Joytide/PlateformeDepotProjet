exports.hasPermission = (permission, user, project) => {
    console.log(permission, user, typeof permission)
    if (user.admin)
        return true;
    if (typeof permission === "string") {
        if (permission === "")
            return true;
        else if (permission === "EGPE" && user.EPGE)
            return true;
        else if (permission === "Referent" && project.referent.indexOf(user._id) !== -1)
            return true;

        return false;
    } else if (permission instanceof Array) {
        if (permission === "")
            return true;
        if (permission.indexOf("EGPE") !== -1 && user.EPGE)
            return true;
        if (permission.indexOf("Referent") !== -1 && project.referent.indexOf(user._id) !== -1)
            return true;

        return false;
    } else {
        console.error("Unknown permission type", permission, user);
        return false;
    }
}