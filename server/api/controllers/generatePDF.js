var page = require('webpage').create(),
    system = require('system'),
    fs = require('fs');

var system = require('system');
var args = system.args;

page.paperSize = {
    format: 'A4',
    orientation: 'portrait',
    margin: {
        top: "1.5cm",
        bottom: "1cm"
    }
};

// This will fix some things that I'll talk about in a second
page.settings.dpi = "96";

page.onLoadFinished = function (status) {
    var output = args[2];
    page.render(output, { format: 'pdf' });
    phantom.exit(0);
}

if (args.length == 3)
    var content = fs.read(args[1]);
else 
    phantom.exit(1);
page.content = content;
