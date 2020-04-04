exports.hasPermission = (permission, user, specializations) => {
    if (user.admin)
        return true;
    if (typeof permission === "string") {
        if (permission === "")
            return true;
        else if (permission === "EGPE" && user.EPGE)
            return true;
        else if (permission === "Referent" && hasReferent(specializations, user))
            return true;

        return false;
    } else if (permission instanceof Array) {
        if (permission === "")
            return true;
        if (permission.indexOf("EGPE") !== -1 && user.EPGE)
            return true;
        if (permission.indexOf("Referent") !== -1 && hasReferent(specializations, user))
            return true;

        return false;
    } else {
        console.error("Unknown permission type", permission, user);
        return false;
    }
}

const hasReferent = (specializations, user) => {
    // If referent array is populated, unpopulate it
    if (specializations[0] && specializations[0].referent[0] && typeof specializations[0].referent[0] !== "string")
        specializations = specializations.map(spe => { return { referent: spe.referent.map(r => r._id) } })

    for (let i = 0; i < specializations.length; i++)
        if (specializations[i].referent.indexOf(user._id) !== -1)
            return true;
    return false;
}