var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */

// <---- Japskua: Define that we are using the helloRoute 

// GET /hello/
router.get('/', function(req, res) {
    
    // <---- Japskua: Render the hello page
    // 1st param is the hello.ejs (without ending) 
    // and the 2nd parameter is Object containing passable information to that page
    res.render('hello', { title : "Hello Page"});
});

// GET /hello/:name 
router.get('/:name', function(req, res) {

    // <---- Japskua: Get the given name
    var name = req.params.name;
    
    // Return Hello + name as a JSON
    res.json({ message : "Hello " + req.params.name});
});


// POST /hello/
router.post('/', function(req, res) {

    // Check that the body is not empty
    if (!req.body) {
        // Send an error, informing that not all was properly formated
        res.status(500).send({ error : "no body found"});
        return;
    }

    // <---- Japskua: We know that there should be a json coming
    var json = req.body;
    
    
    // Check that both values exist
    if (!req.body.userName || !req.body.userEmail) {
        res.status(500).send({error : "userEmail or userName was missing!"});
        return;
    }
    
    // Read the name and email of the user
    var userName = json.userName;
    var userEmail = json.userEmail;
    
    // Create the filepath for writing
    var filePath = userName.toString() + ".txt";
    
    // Here we could for example write the results to a file
    fs.writeFile(filePath, { name : userName, email : userEmail}, function(err) {
        if(err) {
            res.status(500).send({error : err});
            return;
        } 
        
        // Otherwise, things running nicely
        // And return ok, once everything is done
        res.status(200).send("ok");
    }); 
    

});

// PUT /hello/
router.put('/', function(req, res) {
    
    
    res.status(200).send("ok");
    
})

module.exports = router;
