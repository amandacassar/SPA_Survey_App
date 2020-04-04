// import modules
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// app object returned from the express module function
const app = express();

// set up express to call static files in the directory 'application'
app.use(express.static('application'));
app.use(bodyParser.json());
app.use(fileUpload());


// create a connection pool
const conn = mysql.createPool
({
    connectionLimit: 1,
    host: 'localhost',
    user: 'dbuser',
    password: 'dbpass',
    database: 'surveysdb',
    debug: true
});


//send the html page   
app.get('/', function(req,res)
{
    res.render('index.html');
});


// post requests
app.post('/login', logUser);                        // log in check
app.post('/allEmails', getEmails);                  // get all user's emails
app.post('/register', addUser);                     // add new user in the db
app.post('/newSurvey', addSurvey);                  // add new survey in the db
app.post('/searchSurveys', searchSurvey);           // search for surveys by keywords (matched with survey title)
app.post('/getSurvey', selectedSurvey);             // obtain details of the selected survey - for user to respond the survey
app.post('/newResponse', addResponseAnswers);       // add a new response to a survey in the db
app.post('/ownerSurveys', getOwnerSurveys);         // get a list of surveys that were published by the current user logged in
app.post('/getResponses', viewResponses);           // get the responses of the selected survey
app.post('/getInterests', selectedInterests);       // get the user's interests
app.post('/suggestedSurveys', suggestSurveys);      // get a list of surveys suggested to current user - based on interests selected user's profile
app.post('/editProfile', getUser);                  // get user details to display in the Edit Profile form
app.post('/amendUser', updateUser);                 // update user's details



// login
function logUser(request, response) 
{
    // stringify the object received
    let user = request.body;

    // determine the username (email) and the password received
	let username = user.uname;
    let password = user.pass;

    // sql query to match username and password with a record inside the database - using ? to prevent from sql injection
    let sql = "SELECT * FROM User WHERE email = ? AND password = ?;";
    conn.query(sql, [username,password], function(error, result) 
    {
        if (error)
        {
            throw error;
        }

        // if something was returned
        if (result.length > 0)
        {
            // obtaining the value of the 'name' field and sending the message as response
            let name = result[0].name;
            let userId = (result[0].id).toString();
            response.send("Hello " + name + "||" + userId);
        }
        // if no results returned
        else
        {
            response.send('Incorrect username and/or password.');
        }			
        response.end();
    });
}


// all emails
function getEmails(request, response)
{
    // sql query to obtain all registered email addresses
    let sql = "SELECT email FROM User;";
    conn.query(sql, function(error, result) 
    {
        if (error)
        {
            throw error;
        }
        response.send(JSON.stringify(result));
        response.end();
    });
}


// add new user
function addUser(request, response)
{
    // classify the data received
    let user = request.body;
    let name = user._name;
    let surname = user._surname;
    let dob = user._dob;
    let gender = user._gender;
    let city = user._city;
    let country = user._country;
    let studyLevel = user._studyLevel;
    let studyArea = user._studyArea;
    let interests = user._interests;
    let email = user._email;
    let password = user._password;

    // sql query to insert new user - using ? to prevent from sql injection
    let sql = "INSERT INTO User (name,surname,dob,gender,city,country,studyLevel,studyArea,interests,email,password) VALUES(?,?,?,?,?,?,?,?,?,?,?);";
    conn.query(sql, [name,surname,dob,gender,city,country,studyLevel,studyArea,interests,email,password], function(error, result)
    {
        if (error)
        {
            throw error;
        }
        let rows = result.affectedRows;
        response.send(rows.toString());
        response.end();
    });
}


// adding a new survey
async function addSurvey(request, response)
{
    // classify the data received
    let survey = request.body;
    let ownerId = survey._userId;
    let title = survey._title;
    let description = survey._description;
    let tags = survey._tags;
    let publishDate = survey._date;
    let numberOfQuestions = survey._questions.length;
    let questionText = survey._questions;
    let options = survey._options;

    // sql query to insert new survey - using ? to prevent from sql injection
    let sql = "INSERT INTO Survey (ownerId,title,description,tags,publishDate) VALUES(?,?,?,?,?);";

    // wrapping the execution of the query in a promise
    let surveyPromise = new Promise ( (resolve, reject) => { 
        conn.query(sql, [ownerId,title,description,tags,publishDate], (error, result) => {
            if (error)
            {
                reject("Error executing query: " + JSON.stringify(err));
            }
            else
            {
                // resolve promise with results - passing the newly created survey id number and other data required for the Question table
                resolve(JSON.stringify(result));
            }
        });
    });

    try
    {
        // execute promise
        // obtain the data required for the Question table
        let promiseResult = await surveyPromise;
        let surveyId = JSON.parse(promiseResult).insertId;

        // making another database call to insert new questions - using ? to prevent from sql injection
        let sql = "INSERT INTO Question (surveyId,questionNo,questionText,options) VALUES (?,?,?,?);";

        for (let i = 0; i < numberOfQuestions; i++)
        {
            conn.query(sql, [surveyId,i,questionText[i],options[i]], (error, result) => {
                if (error)
                {
                    console.log("Error executing query: " + JSON.stringify(error));
                    return;
                }
                else
                {
                    console.log("check your database :-)"); 
                }
            });
        }
        response.send("Survey loaded (ID: " + surveyId + ").  Redirecting to your surveys...");
        response.end();    
    }
    catch(err)
    {
        console.error(JSON.stringify(err) + "...catch error line 202...");
    }
}


// find surveys
function searchSurvey(request, response)
{
    let search = request.body;

    // adding the '% and %' at the end for the LIKE query format [the ' is automatically included in a string]
    let keywords = "%";
    keywords += search.key;
    keywords += "%";

    let userId = search.id;

    // sql query to find survey that include the keyword/s entered and that do not belong to the current user - using ? to prevent from sql injection
    let sql = "SELECT * FROM Survey s WHERE s.title LIKE ? AND s.ownerId <> ?;";

    conn.query(sql, [keywords, userId, userId], function(error, result)
    {
        if (error)
        {
            throw error;
        }
        else
        {
            response.send(JSON.stringify(result));
        }
        response.end();
    });
}


// get survey to fill it in
function selectedSurvey(request, response)
{
    // classify the data received
    let surveyId = request.body;
    let id = surveyId.id;

    // sql query to obtain survey + questions for the selected survey - using ? to prevent from sql injection
    let sql = "SELECT * FROM Survey s, Question q WHERE s.id = ? AND q.surveyId = s.id;";

    conn.query(sql, id, function(error, result)
    {
        if (error)
        {
            throw error;
        }
        else
        {
            response.send(JSON.stringify(result));
        }
        response.end();
    });
}


// add survey response to the related tables
async function addResponseAnswers(request, response)
{
    // classify the data received
    let answers = request.body;
    let surveyId = answers._surveyId;
    let respondentId = answers._respondentId;
    let comments = answers._comments;
    let responseDate = answers._todayDate;
    let numberOfQuestions = answers._questionsArray.length;
    let questionIds = answers._questionsArray;
    let optionSelected = answers._optionsArray;

    // sql query to insert new a survey response - using ? to prevent from sql injection
    let sql = "INSERT INTO SurveyResponse (surveyId,respondentId,comments,responseDate) VALUES(?,?,?,?);";

    // wrapping the execution of the query in a promise
    let surveyPromise = new Promise ( (resolve, reject) => { 
        conn.query(sql, [surveyId,respondentId,comments,responseDate], (error, result) => {
            if (error)
            {
                reject("Error executing query: " + JSON.stringify(err));
            }
            else
            {
                // resolve promise with results - passing the newly created survey id number and other data required for the Question table
                resolve(JSON.stringify(result));
            }
        });
    });

    try
    {
        // execute promise
        // obtain the data required for the Question table
        let promiseResult = await surveyPromise;
        let responseId = JSON.parse(promiseResult).insertId;

        // making another database call to insert the options selected - using ? to prevent from sql injection
        let sql = "INSERT INTO OptionSelected (questionId,responseId,selectedOption) VALUES (?,?,?);";

        for (let i = 0; i < numberOfQuestions; i++)
        {
            conn.query(sql, [questionIds[i],responseId,optionSelected[i]], (error, result) => {
                if (error)
                {
                    console.log("Error executing query: " + JSON.stringify(error));
                    return;
                }
                else
                {
                    console.log("check your database :-)"); 
                }
            });
        }
        response.send("Response submitted (ID: " + responseId + ").");
        response.end();    
    }
    catch(err){
        console.error(JSON.stringify(err) + "...catch error line 321...");
    }
}


// get the list of surveys belonging to the current user
function getOwnerSurveys(request, response)
{
    let owner = request.body;    
    let ownerId = owner.id;

    // sql query to find survey/s that include the keyword/s entered by the user - using ? to prevent from sql injection
    let sql = "SELECT * FROM Survey WHERE ownerId = ?;";

    conn.query(sql, ownerId, function(error, result)
    {
        if (error)
        {
            throw error;
        }
        else
        {
            response.send(JSON.stringify(result));
        }
        response.end();
    });
}


// get the responses of a survey
function viewResponses(request, response)
{
    let survey = request.body;
    let surveyId = survey.id;

    // sql query to find obtain the survey response, options selected and questiosn for a particular survey - using ? to prevent from sql injection
    let sql = "SELECT * FROM SurveyResponse r, OptionSelected o, Question q WHERE r.surveyId = ? AND o.responseId = r.id AND q.id = o.questionId;";

    conn.query(sql, surveyId, function(error, result)
    {
        if (error)
        {
            throw error;
        }
        else
        {
            response.send(JSON.stringify(result));
        }
        response.end();
    });
}


// get user's interests
function selectedInterests(request, response)
{
    let owner = request.body;
    let ownerId = owner.id;

    // sql query to get the current user's interests - using ? to prevent from sql injection
    let sql = "SELECT interests FROM User WHERE id = ?;";

    conn.query(sql, ownerId, (error, result) => {
        if (error)
        {
            reject("Error executing query: " + JSON.stringify(err));
        }
        else
        {
            // resolve promise with results - passing the newly created survey id number and other data required for the Question table
            response.send(JSON.stringify(result));
        }
        response.end();
    });
}


// get surveys suggested for a user
function suggestSurveys(request, response)
{
    let interests = request.body;
    let interestsString = interests.tag;
    let tags = interestsString.split("||");
    let id = parseInt(interests.id);

    // building the query to find surveys that include the user's interests as tags
    // building it based on the number of interests that the user has
    let sqlString = "SELECT * FROM Survey WHERE ownerId <> ? AND (tags";
    for (let j = 0; j < tags.length; j++)
    {
        if (j == 0)
        {
            sqlString += " LIKE '%" + tags[j] + "%'";     // first iteration does not include "OR"
        }
        else
        {
            sqlString += " OR tags LIKE '%" + tags[j] + "%'";
        }
    }
    sqlString += ");";

    // execute the query
    conn.query(sqlString, id, (error, result) => {
        if (error)
        {
            console.log("Error executing query: " + JSON.stringify(error));
            return;
        }
        else
        {
            response.send(result);
            response.end();
        }
    });
        
}


// get user info
function getUser(request, response)
{
    let user = request.body;
    let userId = user.id;

    // sql query to get one user's records - using ? to prevent from sql injection
    let sql = "SELECT * FROM User WHERE id= ?;";

    conn.query(sql, userId, function(error, result)
    {
        if (error)
        {
            throw error;
        }
        else
        {
            response.send(JSON.stringify(result));
        }
        response.end();
    });
}


// update user info
function updateUser(request, response)
{
    let userInfo = request.body;
    let userId = userInfo._id;
    let name = userInfo._name;
    let surname = userInfo._surname;
    let dob = userInfo._dob;
    let gender = userInfo._gender;
    let city = userInfo._city;
    let country = userInfo._country;
    let studyLevel = userInfo._studyLevel;
    let studyArea = userInfo._studyArea;
    let interests = userInfo._interests;
    let password = userInfo._password;

    // sql query to update a user's record - using ? to prevent from sql injection
    let sql = "UPDATE User SET name = ? , surname = ? , dob = ? , gender = ? , city = ? , country = ? , studyLevel = ? , studyArea = ? , interests = ? , password = ? WHERE id= ?;";

    conn.query(sql, [name, surname, dob, gender, city, country, studyLevel, studyArea, interests, password, userId], function(error, result)
    {
        if (error)
        {
            throw error;
        }
        else
        {
            let rows = result.affectedRows;
            response.send(rows.toString());
        }
        response.end();
    });
}




// begin listening on port 8081
app.listen(8080, function(err)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("Connected to port 8081");
    }
});

