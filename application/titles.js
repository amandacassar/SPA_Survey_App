"use strict";

/*************************
 INCLUDES:
 - mySurveys -> display shown on clicking menu item My Surveys
 - searchSurveys -> display shown on clicking menu item Search Surveys
 - suggestedSurveys -> display shown on clicking menu item Suggested Surveys
 - account -> display shown on clicking menu item Account
 
 *************************/


// function called on clicking menu item "My Surveys"
function mySurveys()
{
    // highlighting the selected menu and changing its text colour to white
    mySurveysMenu.style.backgroundColor = "steelblue";
    mySurveysMenu.style.color = "white";

    // removing any other highlighted menu items
    searchSurveysMenu.style.backgroundColor = "aliceblue";
    searchSurveysMenu.style.color = "slategray";
    suggestSurveysMenu.style.backgroundColor = "aliceblue";
    suggestSurveysMenu.style.color = "slategray";
    accountMenu.style.backgroundColor = "aliceblue";
    accountMenu.style.color = "slategray";

    // removing other elements
    viewTitle.style.display = "none";
    textboxOne.style.display = "none";
    textboxTwo.style.display = "none";
    messageOne.style.display = "none";
    linkOne.style.display = "none";
    contactUs.style.display = "none";
    rightContainer.style.display = "none";

    // displaying the contact us
    document.getElementById("contactUs").style.display = "block";

    // checking if user is logged in
    if (sessionStorage.getItem("userId") != null)
    {
        // obtaining the list of survyes
        let owner = sessionStorage.getItem("userId");
        let ownerId = {id : owner};

        // sending xml request
        let xml = new XMLHttpRequest;

        // function that is called when reply received from server
        xml.onreadystatechange = () =>
        {
            if ((xml.readyState == 4) && (xml.status == 200))
            {
                let ownerResult = JSON.parse(xml.responseText);

                // if no results found
                if  (ownerResult.length == 0)
                {
                    mainContainer.innerHTML = "You did not publish any surveys yet.";
                    mainContainer.style.display = "block"; 
                    buttonOne.style.display = "none";
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

                    for (let i = 0; i < ownerResult.length; i++)
                    {   
                        let date = (ownerResult[i].publishDate).substring(0,10);

                        display += "<tr>";
                        display += "<td colspan='1'>" + ownerResult[i].id + "</td>";
                        display += "<td>" + ownerResult[i].title + "</td>";
                        display += "<td>" + date + "</td>";
                        // adding 3 buttons to: (i)view table results  (ii)view graphical results  (iii)delete survey
                        display += '<td colspan="2"> <button class="btn btn-secondary mb-2" type="submit" onclick="getResults(' + ownerResult[i].id + ')"> View Results </button> </td>';
                        display += '<td colspan="2"> <button class="btn btn-secondary mb-2" type="submit" onclick="getDownloads(' + ownerResult[i].id + ')"> Downloads </button> </td>';
                        display += '<td colspan="2"> <button class="btn btn-secondary mb-2" type="submit" onclick="eliminateSurvey(' + ownerResult[i].id + ')"> Delete Survey </button> </td>';
                        display += "</tr>";
                    }

                    // closing the table
                    display += "</tbody></table>";

                    // update the view
                    mainContainer.innerHTML = display;
                    mainContainer.style.display = "block"; 

                    // displaying the Pusblish New Survey button
                    buttonOne.innerText = "Publish New Survey";
                    buttonOne.onclick = newSurvey;
                    buttonOne.style.display = "block";
                }                
            }
        };

        //Send new user data to server
        xml.open("POST", "/ownerSurveys", true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.send(JSON.stringify(ownerId)); 
    }

    else    // if there is no user looged in
    {
        mainContainer.innerHTML = "You are not logged in.  Log in to view your surveys.";
        mainContainer.style.display = "block"; 

        // hiding other elements
        buttonOne.style.display = "none";
        textboxOne.style.display = "none";
        textboxTwo.style.display = "none";
        messageOne.style.display = "none";
        linkOne.style.display = "none";
    }
}



// function called on clicking menu item "Search Surveys"
function searchSurveys()
{
    // highlighting the selected menu and changing its text colour to white
    searchSurveysMenu.style.backgroundColor = "steelblue";
    searchSurveysMenu.style.color = "white";

    // removing any other highlighted menu items
    mySurveysMenu.style.backgroundColor = "aliceblue";
    mySurveysMenu.style.color = "slategray";
    suggestSurveysMenu.style.backgroundColor = "aliceblue";
    suggestSurveysMenu.style.color = "slategray";
    accountMenu.style.backgroundColor = "aliceblue";
    accountMenu.style.color = "slategray";

    // removing other elements
    viewTitle.style.display = "none";
    textboxOne.style.display = "none";
    messageOne.style.display = "none";
    linkOne.style.display = "none";
    contactUs.style.display = "none";
    mainContainer.style.display = "none";
    rightContainer.style.display = "none";

    // checking if user is logged in
    if (sessionStorage.getItem("userId") != null)
    {
        // displaing the search textbox and button + removing the attribute "type = password"
        textboxTwo.setAttribute("type", "text");
        textboxTwo.value = "";
        textboxTwo.placeholder = "search by title here...";
        textboxTwo.style.display = "block";
        buttonOne.innerText = "Search";
        buttonOne.onclick = searchSurvey;
        buttonOne.style.display = "block";
    }

    else    // if there is no user looged in
    {
        textboxTwo.style.display = "none";
        buttonOne.style.display = "none";
        mainContainer.innerHTML = "You are not logged in.  Log in to search for surveys.";
        mainContainer.style.display = "block"; 
    }
}



// function called on clicking menu item "Suggested for You"
function suggestedSurveys()
{
    // highlighting the selected menu and changing its text colour to white
    suggestSurveysMenu.style.backgroundColor = "steelblue";
    suggestSurveysMenu.style.color = "white";

    // removing any other highlighted menu items    
    mySurveysMenu.style.backgroundColor = "aliceblue";
    mySurveysMenu.style.color = "slategray";
    searchSurveysMenu.style.backgroundColor = "aliceblue";
    searchSurveysMenu.style.color = "slategray";
    accountMenu.style.backgroundColor = "aliceblue";
    accountMenu.style.color = "slategray";    

    // removing other elements
    viewTitle.style.display = "none";
    textboxOne.style.display = "none";
    textboxTwo.style.display = "none";
    buttonOne.style.display = "none";
    messageOne.style.display = "none";
    linkOne.style.display = "none";
    contactUs.style.display = "none";
    rightContainer.style.display = "none";

    // checking if user is logged in
    if (sessionStorage.getItem("userId") != null)
    {
        // obtaining the list of survyes
        let owner = sessionStorage.getItem("userId");
        let ownerId = {id : owner};

        // sending xml request
        let xml = new XMLHttpRequest;

        // function that is called when reply received from server
        xml.onreadystatechange = () =>
        {
            if ((xml.readyState == 4) && (xml.status == 200))
            {
                let userInterests = JSON.parse(xml.responseText);

                getSuggestedSurveys(userInterests);
            }
        };

        //Send new user data to server
        xml.open("POST", "/getInterests", true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.send(JSON.stringify(ownerId)); 
    }

    else    // if there is no user looged in
    {
        mainContainer.innerHTML = "You are not logged in.  Log in to view surveys suggested for you.";
        mainContainer.style.display = "block"; 
    }
}



// function called on clicking menu item "Account"
function account()
{
    // highlighting the selected menu and changing its text colour to white
    accountMenu.style.backgroundColor = "steelblue";
    accountMenu.style.color = "white";

    // removing any other highlighted menu items    
    mySurveysMenu.style.backgroundColor = "aliceblue";
    mySurveysMenu.style.color = "slategray";
    searchSurveysMenu.style.backgroundColor = "aliceblue";
    searchSurveysMenu.style.color = "slategray";
    suggestSurveysMenu.style.backgroundColor = "aliceblue";
    suggestSurveysMenu.style.color = "slategray";

    // if nobody is logged in
    if (sessionStorage.getItem("userId") == null)
    {   
        logout();
    }

    else
    {
        // hiding the unwanted elements
        viewTitle.style.display = "none";
        textboxOne.style.display = "none";
        textboxTwo.style.display = "none";
        rightContainer.style.display = "none";

        // updating the text on the button and its functionality
        buttonOne.innerText = "Log Out";
        buttonOne.onclick = logout;
        buttonOne.style.display = "block";

        // updating the text on the link and its functionality
        linkOne.innerText = "Edit My Profile";
        linkOne.onclick = editProfile;
        linkOne.style.display = "block";

        contactUs.style.display = "block";

        // updating the message on the right side of the page
        messageOne.innerHTML = "Hello " + sessionStorage.getItem("name");   // name of current user logged in
        messageOne.style.display = "block";

        // displaying the new message inside the main container
        let main = "<p class='welcome-line'> Survey App </p>";
        main += "<p class='second-message'> Making surveys easy! </p>";
        mainContainer.innerHTML = main;
        mainContainer.style.display = "block";
    }
}



