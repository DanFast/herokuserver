var express = require('express');
var app = express();
var mysql_query = require('./mysql_GET');
var mysql_post = require('./mysql_POST');
const fileUpload = require('express-fileupload');
var path = require('path');
app.use(fileUpload());


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/api', function(request, response) {
    response.send('Welcome to AppRutsch API');
});

/* GET landslides listing. */
app.get('/api/landslides', function(req, res, next) {

    //res.send('list all landslide');
    let sql = 'Select * FROM landslide';
    mysql_query(sql, res);
    /*connection.query(sql, (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });*/
});
//GET landslide with ID
app.get('/api/getlandslide/:id', function(req, res, next) {
    let sql = `Select * FROM landslide WHERE LId = ${req.params.id}`;
    mysql_query(sql, res);
    /*connection.query(sql, (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });*/
});
//GET landslide img
app.get('/api/getImg/:name', function(req, res, next) {

    res.setHeader('Content-Type', 'image/jpeg');

    var fileName = req.params.name;
    res.sendFile(path.join(__dirname, '../public/images/uploads', fileName), function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});


// POST method route
app.post('/api/postlandslide', function (req, res) {

    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log('BIS HIER GEHTS VOM HANDY');

    var date = req.body.date, userLocLat = req.body.userLocLat, userLocLong = req.body.userLocLong,
        slideLocLat = req.body.slideLocLat,  slideLocLong =  req.body.slideLocLong, title = req.body.title,
        userId = req.body.userId;

    var file = req.files.image_upload;
    file.name = Date.now()+'.jpg';

    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
        // Use the mv() method to place the file somewhere on your server
        file.mv('public/images/uploads/'+file.name, function(err) {
            if (err) return res.status(500).send(err);
        });

        let sql = 'INSERT INTO `landslide`(`LId`, `Date`, `UserLocLat`, `UserLocLong`, `SlideLocLat`, `SlideLocLong`, `Title`, `img_path`, `UserId_fk`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        mysql_post(sql, date, userLocLat, userLocLong, slideLocLat,slideLocLong, title, file.name, userId, res);

    } else {
        let message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
        res.send({message: message});
    }

});

/*
TODO IMPLEMENT UPDATE LANDSLIDE WITH ID!
*/
//UPDATE landslide with ID
app.put('/api/updatelandslide/:id', function(req, res, next) {
    console.log('UPDATE /updatelandslide/:id of landslides');
    res.send('UPDATE /updatelandslide/:id of landslides');
});

//DELETE landslide with ID
app.delete('/api/deletelandslide/:id', function(req, res, next) {
    //console.log('DELETE /deletelandslide/:id of landslides');
    //res.send('DELETE /deletelandslide/:id of landslides');
    let sql = `DELETE FROM landslide WHERE LId = ${req.params.id}`;
    mysql_query(sql, res);
});
















app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


