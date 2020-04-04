"use strict";

/*************************
 INCLUDES:
 - newSurvey -> display the form to publish a new survey
 - submitSurvey -> function to validate and add a new survey to the database
 - searchSurvey -> display table with the list of surveys which title include the keyword entered by the user
 - getSurvey -> display the selected survey and allow user to respond to it
 - addResponse -> add a survey response to the database
 - getResults -> let survey owner view the results so far
 - getGraph -> let survey owner view the graphical results
 - eliminateSurvey -> when survey owner wants to delete a survey
 - getSuggestedSurveys -> display a table with the surveys suggested to the current user - based on user's profile interests
 
 *************************/


// function to display the form to create a new survey
function newSurvey()
{
    // hiding the elements
    textboxOne.style.display = "none";
    textboxTwo.style.display = "none";
    buttonOne.style.display = "none";
    messageOne.style.display = "none";
    linkOne.style.display = "none";
    contactUs.style.display = "none";
    rightContainer.style.display = "none";

    // displaying the view title
    viewTitle.innerHTML = "Publish New Survey";
    viewTitle.style.display = "block";

    // creating the elements to be displayed in the survey form
    let surveyForm = "<form><div class='row'>";
    surveyForm += "<div class='col-lg-9'>";
    surveyForm += "<p class='label'> Title";
    surveyForm += "<input class='form-control' id='title' placeholder='enter survey title - max 50 characters' required></p>";  
    surveyForm += "<p class='label'> Description";
    surveyForm += "<textarea type='text' class='form-control' rows='3' id='description' placeholder='enter survey description - max 500 characters' required></textarea></p>";
    surveyForm += "<p><span class='label'> Tags </span>";
    surveyForm += "<span> (tick one or more) </span></p>";
    surveyForm += "</div>";
    surveyForm += "</div>";

    surveyForm += "<div class='row'>";    
    surveyForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='science'> <label class='form-check-label' for='science'>Science</label></div>";
    surveyForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='medicine'> <label class='form-check-label' for='medicine'>Medicine</label></div>";
    surveyForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='travel'> <label class='form-check-label' for='travel'>Travel</label></div>";
    surveyForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='education'> <label class='form-check-label' for='education'>Education</label></div>";
    surveyForm += "</div><div class='row'>";    
    surveyForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='sports'> <label class='form-check-label' for='sports'>Sports</label></div>";
    surveyForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='nutrition'> <label class='form-check-label' for='nutrition'>Nutrition</label></div>";
    surveyForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='economy'> <label class='form-check-label' for='economy'>Economy</label></div>";
    surveyForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='environment'> <label class='form-check-label' for='environment'>Environment</label></div>";
    surveyForm += "</div><br>";

    surveyForm += "<div class='row'>";
    surveyForm += "<div class='col-lg-9'>";
    // allowing for up to 15 questions
    // up to 5 options for each question and allowing the user to add one picture relating to this question
    for (let i = 1; i < 16; i++)
    {
        surveyForm += '<p class="label"> Question ' + i + ' ';
        surveyForm += '<input type="text" class="form-control-sm" id="q' + i + '" placeholder="enter your question..."></p>';
        surveyForm += '<p class="label tab"> Q' + i + ' Option 1';
        surveyForm += '<input type="text" class="form-control-sm" id="q' + i + '_opt1" placeholder="enter text here..."></p>';
        surveyForm += '<p class="label tab"> Q' + i + ' Option 2';
        surveyForm += '<input type="text" class="form-control-sm" id="q' + i + '_opt2" placeholder="enter text here...""></p>';
        surveyForm += '<p class="label tab"> Q' + i + ' Option 3';
        surveyForm += '<input type="text" class="form-control-sm" id="q' + i + '_opt3" placeholder="enter text here - leave empty if not required"></p>';
        surveyForm += '<p class="label tab"> Q' + i + ' Option 4';
        surveyForm += '<input type="text" class="form-control-sm" id="q' + i + '_opt4" placeholder="enter text here - leave empty if not required"></p>';
        surveyForm += '<p class="label tab"> Q' + i + ' Option 5';
        surveyForm += '<input type="text" class="form-control-sm" id="q' + i + '_opt5" placeholder="enter text here - leave empty if not required"></p>';
        surveyForm += '<p class="label tab"> (Optional) Q' + i + ' Add Picture:';
        surveyForm += '<input type="file" class="form-control-file" id="q' + i + '_pic" accept="image/png, image/jpeg"></form>';   // accepting only .png or .jpeg files
    }
    surveyForm += "</div>";
    surveyForm += "</div>";
    
    surveyForm += "<div class='row'>";
    surveyForm += "<div class='col-lg-5'>";
    surveyForm += "<p class='message-text' id='newSurveyMsg'></p>";
    surveyForm += "</div>";
    surveyForm += "<div class='col-lg-4'>";
    surveyForm += "<p><button onclick='return submitSurvey()' type='button' class='btn-lg btn-secondary'> Publish Survey </button><br><br></p>";
    surveyForm += "</div>";
    surveyForm += "</div></form>";    
    surveyForm += "<p class='badge badge-info fixed-bottom'> Scroll to the bottom to submit the survey with the entered questions </p>";

    // updating the view
    mainContainer.innerHTML = surveyForm; 
    mainContainer.style.display = "block";
}


// function to check that survey being submitted is correct and if so publish it
function submitSurvey()
{
    // obtain the data
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let science = document.getElementById("science");
    let medicine = document.getElementById("medicine");
    let travel = document.getElementById("travel");
    let education = document.getElementById("education");
    let sports = document.getElementById("sports");
    let nutrition = document.getElementById("nutrition");
    let economy = document.getElementById("economy");
    let environment = document.getElementById("environment");
    let tags = "";

    let questionsArray = [];
    let options = "";
    let optionsArray = [];
    let imagesArray = [];
    
    for (let i = 1; i < 16; i++)
    {
        // obtain the questions text and add this in the questions array
        if (document.getElementById("q" + i).value)
        {
            questionsArray.push(document.getElementById("q" + i).value);
        }

        // obtain the options text for each possible option
        if (document.getElementById("q" + i + "_opt1").value)
        {
            options += document.getElementById("q" + i + "_opt1").value + "||";
        }
        if (document.getElementById("q" + i + "_opt2").value)
        {
            options += document.getElementById("q" + i + "_opt2").value + "||";
        }
        if (document.getElementById("q" + i + "_opt3").value)
        {
            options += document.getElementById("q" + i + "_opt3").value + "||";
        }
        if (document.getElementById("q" + i + "_opt4").value)
        {
            options += document.getElementById("q" + i + "_opt4").value + "||";
        }
        if (document.getElementById("q" + i + "_opt5").value)
        {
            options += document.getElementById("q" + i + "_opt5").value + "||";
        }

        // finally, adding all the options for this questions in the options array
        if (options != "")
        {
            optionsArray.push(options);
        }
        // clearing the options string to start taking new values in the next iteration
        options = "";

        let image = document.getElementById("q" + i + "_pic").value;
        if (image)
        {
            imagesArray.push(image);
        }
        else
        {
            imagesArray.push("");
        }

        console.log(imagesArray);
    }

    // checking which tags did the user select
    if (science.checked == true)
    {
        tags += "science||";
    }
    if (medicine.checked == true)
    {
        tags += "medicine||";
    }
    if (travel.checked == true)
    {
        tags += "travel||";
    }
    if (education.checked == true)
    {
        tags += "education||";
    }
    if (sports.checked == true)
    {
        tags += "sports||";
    }
    if (nutrition.checked == true)
    {
        tags += "nutrition||";
    }
    if (economy.checked == true)
    {
        tags += "economy||";
    }
    if (environment.checked == true)
    {
        tags += "environment||";
    }

    // obtaining the logged-in user id from the session storage, and converting it to integer data type
    let userId = sessionStorage.getItem("userId");
    userId = parseInt(userId);

    // obtaining today's date - in the same format as it will be stored in mysql
    let todayDate = new Date().toJSON().slice(0,10);    

    // collecting all the data to send to the server to create a new survey
    let surveyObj = {
        _userId : userId,
        _title : title,
        _description : description,
        _tags : tags,
        _questions : questionsArray,
        _options : optionsArray,
        _images : imagesArray,
        _date : todayDate
    };

    // sending xml request
    let xml = new XMLHttpRequest;

    // function that is called when reply received from server
    xml.onreadystatechange = () =>
    {
        if ((xml.readyState == 4) && (xml.status == 200))
        {
            let surveyResult = xml.responseText;

            // update the view
            messageOne.innerHTML = surveyResult;
            messageOne.style.display = "block";

            viewTitle.style.display = "none";
            textboxOne.style.display = "none";
            textboxTwo.style.display = "none";
            buttonOne.style.display = "none";
            linkOne.style.display = "none";
            rightContainer.style.display = "none";
            mainContainer.style.display = "none";

            // redirecting to my surveys
            window.setTimeout(function()
            {
                mySurveys();        
            }, 3000);
        }
    };

    //Send new user data to server
    xml.open("POST", "/newSurvey", true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(JSON.stringify(surveyObj));  
}


// searching for surveys
function searchSurvey()
{
    let userId = sessionStorage.getItem("userId");

    // passing keyword search and user id in the xml request
    // including user id so that the survey published by the current user are not displayed
    let keywords = {
        key : textboxTwo.value,
        id : userId
    };

    // sending xml request
    let xml = new XMLHttpRequest;

    // function that is called when reply received from server
    xml.onreadystatechange = () =>
    {
        if ((xml.readyState == 4) && (xml.status == 200))
        {
            let searchResult = JSON.parse(xml.responseText);

            if (searchResult.length == 0)
            {
                mainContainer.innerHTML = "No matches found";
                mainContainer.style.display = "block"; 
            }
            else
            {
                // creating the table to display
                let display = "<table class='table table-striped text-nowrap whitespace-nowrap'>";
                display += "<thead>";
                display += "<tr>";
                display += "<th scope='col' colspan='1'> SURVEY ID </th>";
                display += "<th scope='col'> TITLE </th>";
                display += "<th scope='col'> DATE PUBLISHED </th>";
                display += "</tr>";
                display += "</thead><tbody>";

                for (let i = 0; i < searchResult.length; i++)
                {  
                    let date = (searchResult[i].publishDate).substring(0,10);

                    display += "<tr>";
                    display += "<td colspan='1'>" + searchResult[i].id + "</td>";
                    display += "<td>" + searchResult[i].title + "</td>";
                    display += "<td>" + date + "</td>";
                    // adding the button to select a survey
                    display += '<td colspan="2"> <button class="btn btn-secondary mb-2" type="submit" onclick="getSurvey(' + searchResult[i].id + ')"> Respond this Survey </button> </td>';
                    display += "</tr>";
                }

                // closing the table
                display += "</tbody></table>";

                // update the view
                mainContainer.innerHTML = display;
                mainContainer.style.display = "block"; 
            }            
        }
    };

    //Send new user data to server
    xml.open("POST", "/searchSurveys", true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(JSON.stringify(keywords)); 
}


// display the survey for the respondent to answer it
function getSurvey(surveyId)
{
    let id = {id : surveyId};

    // sending xml request
    let xml = new XMLHttpRequest;

    // function that is called when reply received from server
    xml.onreadystatechange = () =>
    {
        if ((xml.readyState == 4) && (xml.status == 200))
        {
            let surveyData = JSON.parse(xml.responseText);

            // arrays to store survey id, question id and options selected
            let surveyQuestionOptions = [];
            surveyQuestionOptions.push("'");
            surveyQuestionOptions.push(surveyData[0].surveyId);

            // using variables to store html code to display the survey and any images
            let display = "<p><h5>TITLE: <span class='text-left font-weight-light'>" + surveyData[0].title + "</span></h5></p>";
            display += "<p><h5> DESCRIPTION: <span class='text-left font-weight-light'>" + surveyData[0].description + "</span></h5></p>";
            display += "<br>";
            let pictures = "<br><br>";

            // iterating for the number of questions
            for (let i = 0; i < surveyData.length; i++)
            {
                // adding the question id in the array
                surveyQuestionOptions.push(surveyData[i].id);

                display += "<h6> Question " + surveyData[i].questionNo + ": <span class='text-left font-weight-normal'>" + surveyData[i].questionText + "</span></h6>";

                // iterating for the number of options
                let options = (surveyData[i].options).split("||");

                display += '<div id="'+i+'"> ';
                for (let j = 0; j < options.length; j++)
                {
                    // questionId as radio button id.. using radio buttons i/o checkboxes to allow only one selection
                    display += '<label class="tab"><input type="radio" class="form-check-input radio-box-align" name="' +i+ '" value="'+options[j]+'">' + options[j] + '</label>';
                }                    

                // empty the array to re-start at the next iteration
                options.length = 0;
                // option element id
                surveyQuestionOptions.push(i);
                display += "</div><br>";

                // adding any pictures
                // including as caption the question that the picture is related to
                if (surveyData[i].imageUrl)
                {
                    pictures += '<p> Image for Question ' + surveyData[i].questionNo + ': </p>';
                    pictures += '<div> <img src="assets/' +surveyData[i].id + '.jpg" width=50 height=180> </div><br>';
                }
                else    // if there is no image associated with the current question
                {
                    pictures += '<p></p>';
                    pictures += '<div> <img src="assets/no-image.jpg" width=50 height=180> </div><br>';
                }
                
            }
            // note - adding the "'" at the end, as it would not allow me to send an array of integers
            surveyQuestionOptions.push("'");    
            
            display += "<h5> Add Comments: </h5>";
            display += "<textarea class='form-control' id='comments' rows='3'></textarea><br>";
            display += "<div class='row'>";
            display += "<div class='col-lg-5'>";
            display += "<p class='message-text' id='respondMsg'></p>";
            display += "</div>";
            display += "<div class='col-lg-3'>";
            display += '<p><button onclick="addResponse(' + surveyQuestionOptions + ')" type="button" class="btn-lg btn-secondary mb-2"> Submit </button></p>';
            display += "</div></div>";

            // update the view
            viewTitle.innerHTML = "Respond Survey";
            viewTitle.style.display = "block";
            mainContainer.innerHTML = display;
            mainContainer.style.display = "block"; 

            rightContainer.innerHTML = pictures;
            rightContainer.style.display = "block";
            
            textboxOne.style.display = "none";
            textboxTwo.style.display = "none";
            buttonOne.style.display = "none";
            linkOne.style.display = "none";
            contactUs.style.display = "none";
        }
    };

    //Send new user data to server
    xml.open("POST", "/getSurvey", true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(JSON.stringify(id)); 
}


// function to add a survey response to the database
function addResponse(surveyQuestionOptions)
{
    // obtaining the data
    let data = surveyQuestionOptions.split(",");
    let surveyId = parseInt(data[1]);
    let respondentId = sessionStorage.getItem("userId");
    let comments = document.getElementById("comments").value;
    // obtaining today's date - in the same format as it will be stored in mysql
    let todayDate = new Date().toJSON().slice(0,10);   

    // first and last element of the array are "";  second element is the survey id;  elements in between are questions Id's in the db and the options id's in the html page
    let questionsAndAnswers = data.length - 2;

    // obtaining the questions id's (as stored in the db)- stored in the even indexes of the data array
    let questionsArray = [];
    for (let n = 2; n < questionsAndAnswers; n++)
    {
        questionsArray.push(parseInt(data[n]));
        n++;
    }

    // obtaining the values of the selected options - options html id's are stored in the odd indexes of the data array
    let optionsArray = [];
    let temp = 0;   // temporary variable
    let numberOfQues = (data.length - 3) / 2;
    for (let i = 0; i < numberOfQues; i++)
    {
        temp = document.getElementsByName(i);

        for (let j = 0; j < temp.length; j++)
        {
            if (temp[j].checked)
            {
                optionsArray.push(temp[j].value);
            }
        }
    }

    // add the data into the database
    let responseData = {
        _surveyId : surveyId,
        _respondentId : respondentId,
        _comments : comments,
        _todayDate : todayDate,
        _questionsArray : questionsArray,
        _optionsArray : optionsArray
    };

    // sending xml request
    let xml = new XMLHttpRequest;

    // function that is called when reply received from server
    xml.onreadystatechange = () =>
    {
        if ((xml.readyState == 4) && (xml.status == 200))
        {
            // update view
            mainContainer.innerHTML = "Your response was submitted.  Thank you!";           
            viewTitle.style.display = "none";
            textboxOne.style.display = "none";
            textboxTwo.style.display = "none";
            rightContainer.style.display = "none";
        }
    };

    //Send new user data to server
    xml.open("POST", "/newResponse", true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(JSON.stringify(responseData));     
}


// when owner wants to view the results so far
function getResults(surveyId)
{
    let sId = {id : surveyId};

    // sending xml request
    let xml = new XMLHttpRequest;

    // function that is called when reply received from server
    xml.onreadystatechange = () =>
    {
        if ((xml.readyState == 4) && (xml.status == 200))
        {
            let results = JSON.parse(xml.responseText);

            // if no responses yet
            if (results.length == 0)
            {
                messageOne.innerHTML = "No responses submitted.";
                messageOne.style.display = "block";
            }
            else
            {
                // finding out the number of responses (by finding out the number of occurrences of the first questionId)
                let numberOfResults = results.length;
                let numberOfResponses = 1;
                for (let x = 1; x < numberOfResults; x++)
                {
                    if (results[0].id == results[x].id)
                    {
                        numberOfResponses++;
                    }
                }   
                
                // find out the number of questions
                let numberOfQuestions = numberOfResults / numberOfResponses;

                // creating the table to display
                let display = "<table class='table table-striped text-nowrap whitespace-nowrap'>";
                display += "<thead>";
                display += "<tr>";
                display += "<th scope='col'> Response # </th>";
                for (let j = 0; j < numberOfResponses; j++)
                {
                    display += "<th scope='col'>" + (j+1) + "</th>";
                }
                display += "</tr>";
                display += "</thead><tbody>";

                // displaying questions and answers for each question
                for (let k = 0; k < numberOfQuestions; k++)
                {
                    display += "<tr>";
                    display += "<td class='font-weight-bold'>" + results[k].questionText + "</td>";
                    for (let n = 0; n < numberOfResponses; n++)
                    {
                        display += "<td>" + results[((numberOfQuestions * n) +k)].selectedOption + "</td>";
                    }
                    display += "</tr>"
                }

                // displaying the comments 
                display += "<tr>";
                display += "<td class='font-weight-bold'> Comments </td>";
                for (let c = 0; c < numberOfResponses; c++)
                {
                    display += "<td>" + results[(numberOfQuestions * c)].comments + "</td>";
                }
                display += "</tr>"

                // displaying the date when survey was responded
                display += "<tr>";
                display += "<td class='font-weight-bold'> Response Date </td>";
                for (let d = 0; d < numberOfResponses; d++)
                {
                    let date = (results[(numberOfQuestions * d)].responseDate).substring(0,10);
                    display += "<td>" + date + "</td>";
                }
                display += "</tr>";

                // closing the table
                display += "</tbody></table>";


                // elements for displaying the graphs
                for (let b = 0; b < numberOfQuestions; b++)
                {
                    display += "<div><canvas id='graph"+ b +"'</canvas></div>";
                }    

                // update view
                mainContainer.innerHTML = display;  
                mainContainer.style.display = "block";
                viewTitle.style.display = "none";
                textboxOne.style.display = "none";
                textboxTwo.style.display = "none";
                messageOne.style.display = "none";
                linkOne.style.display = "none";

                // displaying the graphs
                // setting the alternating bar colours between all possible 15 questions' bar charts
                let colours = ['#CD5C5C', '#FF8C00', '#BDB76B', '#008000', '#00CED1', '#0000CD', '#6A5ACD', '#BA55D3', '#DAA520', '#DC143C', '#FFA500', '#2E8B57', '#008080', '#00BFFF', '#7B68EE'];
               
                for (let h = 0; h < numberOfQuestions; h++)
                {
                    // obtaining the data and displaying the graphs
                    let graphLabels = [];
                    let graphData = [];

                    for (let g = 0; g < numberOfResponses; g++)
                    {                        
                        // obtaining the options selected - only adding each selected option once
                        // if the option already exists in the array, obtain the index of that element and update the data of the graphData at that same index
                        // (i.e. do not add into graphLabels, but update the value of graphData element representing this label)
                        if (graphLabels.includes(results[((numberOfQuestions * g) + h)].selectedOption))
                        {
                            let a = graphLabels.indexOf(results[((numberOfQuestions * g) + h)].selectedOption);
                            graphData[a] += 1;
                        }
                        // if the option does not exist already in the array, add it in graphLabels, and add a value of 1 in graphData
                        else
                        {
                            graphLabels.push(results[((numberOfQuestions * g) + h)].selectedOption);
                            graphData.push(1);
                        }               
                    }    

                    let config = {
                        type: 'bar',
                        data:{
                            labels: graphLabels,
                            datasets: [{
                                label: results[h].questionText,
                                data: graphData,
                                backgroundColor: colours[h],
                                borderWidth: 4
                            }]
                        },
                        options:{
                                barPercentage: 0.5
                        }
                    };
                                        
                    // passing the data to each graph
                    let myGraph = document.getElementById("graph" + h).getContext("2d");
                    let barGraph = new Chart(myGraph, config);
                }
            }            
        }
    };

    //Send new user data to server
    xml.open("POST", "/getResponses", true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(JSON.stringify(sId));     
}


// when owner wants to view the graphical results
function getDownloads(surveyId)
{
    let sId = {id : surveyId};

    // sending xml request
    let xml = new XMLHttpRequest;

    // function that is called when reply received from server
    xml.onreadystatechange = () =>
    {
        if ((xml.readyState == 4) && (xml.status == 200))
        {
            let results = JSON.parse(xml.responseText);

            if (results.length == 0)
            {
                messageOne.innerHTML = "No responses submitted.";
                messageOne.style.display = "block";
            }

            else
            {
                // finding out the number of responses (by finding out the number of occurrences of the first questionId)
                let numberOfResults = results.length;
                let numberOfResponses = 1;
                for (let x = 1; x < numberOfResults; x++)
                {
                    if (results[0].id == results[x].id)
                    {
                        numberOfResponses++;
                    }
                }   
                
                // find out the number of questions
                let numberOfQuestions = numberOfResults / numberOfResponses;

                // creating the table to display
                let tbl = "<table id='resultsTable' class='table table-striped text-nowrap whitespace-nowrap'>";
                tbl += "<thead>";
                tbl += "<tr>";
                tbl += "<th scope='col'> Response # </th>";
                for (let j = 0; j < numberOfResponses; j++)
                {
                    tbl += "<th scope='col'>" + (j+1) + "</th>";
                }
                tbl += "</tr>";
                tbl += "</thead><tbody>";

                // displaying questions and answers for each question
                for (let k = 0; k < numberOfQuestions; k++)
                {
                    tbl += "<tr>";
                    tbl += "<td class='font-weight-bold'>" + results[k].questionText + "</td>";
                    for (let n = 0; n < numberOfResponses; n++)
                    {
                        tbl += "<td>" + results[((numberOfQuestions * n) +k)].selectedOption + "</td>";
                    }
                    tbl += "</tr>"
                }

                // displaying the comments 
                tbl += "<tr>";
                tbl += "<td class='font-weight-bold'> Comments </td>";
                for (let c = 0; c < numberOfResponses; c++)
                {
                    tbl += "<td>" + results[(numberOfQuestions * c)].comments + "</td>";
                }
                tbl += "</tr>"

                // displaying the date when survey was responded
                tbl += "<tr>";
                tbl += "<td class='font-weight-bold'> Response Date </td>";
                for (let d = 0; d < numberOfResponses; d++)
                {
                    let date = (results[(numberOfQuestions * d)].responseDate).substring(0,10);
                    tbl += "<td>" + date + "</td>";
                }
                tbl += "</tr>";

                // closing the table
                tbl += "</tbody></table>";

                mainContainer.innerHTML = tbl ;
                mainContainer.style.display = "block";
                viewTitle.style.display = "none";
                textboxOne.style.display = "none";
                textboxTwo.style.display = "none";
                messageOne.style.display = "none";
                linkOne.style.display = "none";

                // allowing the user to download the results
                $(document).ready(function() {
                    $('#resultsTable').DataTable( {
                        dom: 'Bfrtip',
                        buttons: [
                            'excelHtml5',
                            'csvHtml5',
                            'pdfHtml5'
                        ]
                    } );
                } );
            }             
        }
    };
    //Send new user data to server
    xml.open("POST", "/getResponses", true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(JSON.stringify(sId));       
}


// when owner wants to remove a survey
function eliminateSurvey(surveyId)
{
    // the owner needs to specify the reasons -> survey and related responses would be deleted by the administration from the database
    mainContainer.innerHTML = "Please contact us and advise the reason why you would like to remove survey with id " + surveyId + ".";
    mainContainer.style.display = "block"; 
    
    // hiding other elements
    messageOne.style.display = "none";
    viewTitle.style.display = "none";
    textboxOne.style.display = "none";
    textboxTwo.style.display = "none";
}


// display suggested surveys for the current user to respond
function getSuggestedSurveys(userInterests)
{
    let uInterests = userInterests[0].interests;
    let userId = sessionStorage.getItem("userId");

    // creating object to send xml request
    let tags = {tag : uInterests, id : userId};

    // sending xml request
    let xml = new XMLHttpRequest;

    // function that is called when reply received from server
    xml.onreadystatechange = () =>
    {
        if ((xml.readyState == 4) && (xml.status == 200))
        {
            let suggestResults = JSON.parse(xml.responseText);

            // creating the table to display
            let display = "<table class='table table-striped text-nowrap whitespace-nowrap'>";
            display += "<thead>";
            display += "<tr>";
            display += "<th scope='col' colspan='1'> SURVEY ID </th>";
            display += "<th scope='col'> TITLE </th>";
            display += "<th scope='col'> DATE PUBLISHED </th>";
            display += "</tr>";
            display += "</thead><tbody>";

            for (let i = 0; i < suggestResults.length; i++)
            {   
                let date = (suggestResults[i].publishDate).substring(0,10);

                display += "<tr>";
                display += "<td colspan='1'>" + suggestResults[i].id + "</td>";
                display += "<td>" + suggestResults[i].title + "</td>";
                display += "<td>" + date + "</td>";
                // adding 3 buttons to: (i)view table results  (ii)view graphical results  (iii)delete survey
                display += '<td colspan="2"> <button class="btn btn-secondary mb-2" type="submit" onclick="getSurvey(' + suggestResults[i].id + ')"> Respond this Survey </button> </td>';
                display += "</tr>";
            }

            // closing the table
            display += "</tbody></table>";

            // update the view
            mainContainer.innerHTML = display;
            mainContainer.style.display = "block";   
            contactUs.style.display = "none";   
            viewTitle.style.display = "none"     ;
            textboxOne.style.display = "none";
            textboxTwo.style.display = "none";
            buttonOne.style.display = "none";
            linkOne.style.display ="none";
        }        
    };

    //Send new user data to server
    xml.open("POST", "/suggestedSurveys", true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(JSON.stringify(tags)); 
}

