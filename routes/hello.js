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
    res.render('hello', { title : "User Creation Page"});
});

// GET /hello/:name 
router.get('/:name', function(req, res) {

    // Check that the :name is not empty
    if (!req.params.name) {
        res.status(500).send({error : "name Parameter missing!"});
        return;
    }
    // <---- Japskua: Get the given name
    var name = req.params.name;
    
    // Make the filePath
    var filePath = name.toString() + ".txt";
    // Try to open the file for reading
    fs.readFile(filePath, function(err, result) {
        if (err) {
            res.status(500).send({error :  err});
            return;
        }

        // We found the data!
        // It is a read buffer, so we should cast it to String
        var user = result.toString();
        // And also cast it to JSON
        user = JSON.parse(user);
        // And then finally return the results
        res.json(user);
    })
    

});

/**
 * Reads the user information from the received HTTP request
 * @param {Object} req The HTTP request received
 * returns {Object} Object containing userName & userEmail or error if something went wrong
 * */
function readUserInfo(req) {
    // Check that the body is not empty
    if (!req.body) {
        // Return error message
        return { error : "no body found"};
    }

    // <---- Japskua: We know that there should be a json coming
    var json = req.body;
    
    
    // Check that both values exist
    if (!req.body.userName || !req.body.userEmail) {
        // Return error
        return { error : "userEmail or userName was missing!" };
    }
    
    // Read the name and email of the user
    // And return the JSON
    return {
        userName : json.userName,
        userEmail : json.userEmail
    };
}

/**
 * Writes the given information to the file, 
 * automatically sending the proper response to the client
 * @param {String} filePath The path where to write to
 * @param {Object} data the Data to write to the file
 * @param {Object} res The response object of node.js
 * */
function writeToFile(filePath, data, res) {
    // Here we could for example write the results to a file
    fs.writeFile(filePath, JSON.stringify(data), function(err) {
        if(err) {
            res.status(500).send({error : err});
            return;
        } 
        
        // Otherwise, things running nicely
        // And return ok, once everything is done
        res.status(200).send( { message : "ok"});
    }); 
}


// POST /hello/
router.post('/', function(req, res) {

    // Read the user information
    var result = readUserInfo(req);

    if(result.error) {
        // We have an error
        res.status(500).send({error : result.error});
        return;
    }
    
    // Create the filepath for writing [and make sure it is string]
    var filePath = result.userName.toString() + ".txt";
    
    // Write the results to a file
    writeToFile(filePath, result, res);
});

// PUT /hello/
router.put('/', function(req, res) {
    
    // Read the user information
    var result = readUserInfo(req);

    if(result.error) {
        // We have an error
        res.status(500).send({error : result.error});
        return;
    }
    
    // Create the filepath for writing [and make sure it is string]
    var filePath = result.userName.toString() + ".txt";
    
    // Write the results to a file
    writeToFile(filePath, result, res);

});

// DELETE /hello/
router.delete('/', function(req, res) {
    // Check that the body is not empty
    if (!req.body) {
        // Return error message
        res.status(500).send({error : "no body found"});
        return;
    }
    
    // Check that userName is given
    if (!req.body.userName) {
        // Return error
        res.status(500).send({error : "userName was missing!"});
        return;
    }
    
    var userName = req.body.userName;
    
    // Create the filepath for deleting [and make sure it is string]
    var filePath = userName.toString() + ".txt";
    
    // Remove the data completely
    fs.unlink(filePath, function(err, result) {
        if (err) {
            res.status(500).send({error : err});
            return;
        }
        
        // Remove done!
        res.status(200).send( { message : "ok"});
    })
    
});

module.exports = router;
