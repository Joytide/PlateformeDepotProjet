var app = require('../app');
var debug = require('debug')('server:server');

var port = 3001;

app.listen(port, () => {
    console.log('Server running on port 3001');
});