exports.handleRequest = func => (req, res, next) => {
    func(
        {
            ...req.body,
            ...req.params,
            ...req.user
        }
    )
        .then(data => res.json(data))
        .catch(next)
}