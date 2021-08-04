var express = require('express');
var multiparty = require('multiparty');
var ImageKit = require("imagekit");


var imagekit = new ImageKit({
    publicKey: "public_BA4Pcimv5MNjuSgVgorpdDADpyc=",
    privateKey: "private_IXir/oq8QXdwsn1dyq90mHqWiwM=",
    urlEndpoint: "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/"
});


var app = express();
app.use(express.json());

app.get('/', function (req, res) {
    res.send('<form method="post" enctype="multipart/form-data">'
        + '<p>Title: <input type="text" name="title" /></p>'
        + '<p>Image: <input type="file" name="image" /></p>'
        + '<p><input type="submit" value="Upload" /></p>'
        + '</form>');
});

app.post('/', function (req, res, next) {
    // create a form to begin parsing
    var form = new multiparty.Form();
    var image;
    var title;
    var arr = [];

    form.on('error', next);
    form.on('close', function () {
        res.send('uploaded');
    });

    // listen on field event for title
    form.on('field', function (name, val) {
        if (name !== 'title') return;
        title = val;
    });

    // listen on part event for image file
    form.on('part', function (part) {
        if (!part.filename) return;
        if (part.name !== 'image') return part.resume();
        image = {};
        image.filename = part.filename;
        image.size = 0;
        part.on('data', function (buf) {
            image.size += buf.length;
            arr.push(buf);
        });
    });

    form.on('close', function () {
        imagekit.upload({
            file: Buffer.concat(arr), //required
            fileName: image.filename, //required
        }, function (error, result) {
            if (error) console.log(error);
            else console.log(result);
        });
    });

    // parse the form
    form.parse(req);
});

app.post('/json', (req, res) => {
    console.log(req);
    res.json({success: 1});
})

/* istanbul ignore next */
app.listen(4000);

