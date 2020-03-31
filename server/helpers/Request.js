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