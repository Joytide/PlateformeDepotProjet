exports.handleRequest = func => (req, res, next) => {
    func(
        {
            ...req.query,
            ...req.body,
            ...req.params,
            user: req.user
        }
    )
        .then(data => res.json(data))
        .catch(next)
}

exports.handleDownloadRequest = func => (req, res, next) => {
    func(
        {
            ...req.query,
            ...req.body,
            ...req.params,
            user: req.user
        }
    )
        .then(data => res.download(data.path, data.filename))
        .catch(next)
}