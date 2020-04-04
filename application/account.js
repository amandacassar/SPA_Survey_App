"use strict";

/*************************
 INCLUDES:
 - loginUser -> confirm username and password and log in user
 - logout -> log out user 
 - registrationForm -> display the registration form
 - checkEmail -> obtaining all registered emails, to check if new registration email does not already exist in the db
 - registerUser -> validating registration data & adding user to the database
 - editProfile -> display the view to edit profile
 - updateProfile -> updating the user's profile in the database
 - contactPage -> display the contact us view
 - redirect -> redicrecting the user to the account page after 5 seconds

 *************************/


// function to log in user - upon clicking Log In button
function loginUser()
{
    //Set up XMLHttpRequest
    let xml = new XMLHttpRequest();

    //Extract user data
    let username = textboxOne.value;
    let password = textboxTwo.value;

    if (username && password) 
    {
        //Create object with user data
        let userObj = {
            uname: username,
            pass: password
        };
        
        // function that is called when a reply is received from server
        xml.onreadystatechange = () =>
        {
            if ((xml.readyState == 4) && (xml.status == 200))
            {
                let result = xml.responseText;
  
                // if log in successful
                if  (result.includes("Hello"))
                {
                    // splitting the greeting from the id number
                    let splitted = result.split("||");
                    let greeting = splitted[0];
                    let userId = splitted[1];
                    let name = greeting.substring(5);

                    // adding the logged-in user Id + user's name in the session storage
                    sessionStorage.setItem("userId", userId);
                    sessionStorage.setItem("name", name);

                    messageOne.innerHTML = greeting;

                    textboxOne.style.display = "none";
                    textboxTwo.style.display = "none"; 
                    // updating the text on the button and its functionality
                    buttonOne.innerText = "Log Out";
                    buttonOne.onclick = logout;   
                    // updating the text on the link and its functionality
                    linkOne.innerText = "Edit My Profile";
                    linkOne.onclick = editProfile;
                    // displaying the new message inside the main container
                    let main = "<p class='welcome-line'> Survey App </p>";
                    main += "<p class='first-message tab'> Making surveys easy! </p>";
                    mainContainer.innerHTML = main;
                    mainContainer.style.display = "block"; 
                }
                else
                {
                    messageOne.innerHTML = result;
                    textboxOne.value = "";
                    textboxTwo.value = "";
                }

                // display the returned message
                messageOne.style.display = "block";                 
            }
        };

        //Send new user data to server
        xml.open("POST", "/login", true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.send(JSON.stringify(userObj));       
    }
    else
    {
        messageOne.innerHTML = "Enter username and password!";
    }

    // hiding the unwanted elements
    viewTitle.style.display = "none";
    rightContainer.style.display = "none";    
}


// function to log out user
function logout()
{
    // displaying Log In elements
    textboxOne.value = "";
    textboxTwo.value = "";
    textboxOne.placeholder = "enter username...";
    textboxTwo.placeholder = "enter password...";
    textboxTwo.setAttribute("type", "password");
    textboxOne.style.display = "block";
    textboxTwo.style.display = "block";

    // updating the text on the button and its functionality
    buttonOne.innerText = "Log In";
    buttonOne.onclick = loginUser;
    buttonOne.style.display = "block";

    // hiding the message on the right side of the page
    messageOne.style.display = "none";

    // updating the text on the link and its functionality
    linkOne.innerText = "New? Register Here";
    linkOne.onclick = registrationForm;
    linkOne.style.display = "block";

    // displaying the welcome message inside the main container
    let main = "<p class='welcome-line'> Welcome to Survey App! </p>";
    main += "<p class='first-message'> Sign in or sign up to start creating and contributing to <br> surveys... </p>";
    mainContainer.innerHTML = main;
    mainContainer.style.display = "block"

    // clearing the session storage which stored the user's id and name
    sessionStorage.clear();
}


// function to display registration form - upon clicking Register Here link
function registrationForm()
{
    // hiding the elements
    textboxOne.style.display = "none";
    textboxTwo.style.display = "none";
    buttonOne.style.display = "none";
    messageOne.style.display = "none";
    linkOne.style.display = "none";
    contactUs.style.display = "none";

    // displaying the view title
    viewTitle.innerHTML = "REGISTER";
    viewTitle.style.display = "block";

    // creating the elements to be displayed in the registration form
    let regForm = "<form><div class='row'>";
    regForm += "<div class='col-lg-5'>";
    regForm += "<p class='label'> Name";
    regForm += "<input type='text' class='form-control' id='name' placeholder='enter your forename...' required></p>";  
    regForm += "<p class='label'> Surname";
    regForm += "<input type='text' class='form-control' id='surname' placeholder='enter your surname...' required></p>";
    regForm += "<p class='label'> Date of Birth";
    regForm += "<input type='text' class='form-control' id='dob' placeholder='yyyy-mm-dd' required></p>";
    regForm += "<p class='label'> Gender";
    regForm += "<select class='form-control' id='gender'> <option>F</option> <option>M</option> </select></p>"; 
    regForm += "<p class='label'> City";
    regForm += "<input type='text' class='form-control' id='city' placeholder='enter your city...' required></p>";  
    regForm += "<p class='label'> Country";
    regForm += "<select class='form-control' id='country'>";
    for (let i = 0; i < countryArray.length; i++) 
    {
        // adding the options in the Countries drop down list
        regForm +="<option>" + countryArray[i] + "</option>";
    }
    regForm += "</select></p>";  
    regForm += "<p class='label'> Level of Education";
    regForm += "<select class='form-control' id='educLevel'> <option>Secondary</option> <option>Post-Secondary</option> <option>Tertiary</option> <option>Post-Tertiary</option> </select></p>"; 
    regForm += "<p class='label'> Area(s) of Studies";    // NOT REQUIRED
    regForm += "<input type='text' class='form-control' id='studyArea' placeholder='area/s of studies...'></p>";
    regForm += "<p><span class='label'> Topics of Interest </span>";
    regForm += "<span> (tick one or more) </span></p>";
    regForm += "</div>";
    regForm += "</div>";

    regForm += "<div class='row'>";    
    regForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='science'> <label class='form-check-label' for='science'>Science</label></div>";
    regForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='medicine'> <label class='form-check-label' for='medicine'>Medicine</label></div>";
    regForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='travel'> <label class='form-check-label' for='travel'>Travel</label></div>";
    regForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='education'> <label class='form-check-label' for='education'>Education</label></div>";
    regForm += "</div><div class='row'>";    
    regForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='sports'> <label class='form-check-label' for='sports'>Sports</label></div>";
    regForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='nutrition'> <label class='form-check-label' for='nutrition'>Nutrition</label></div>";
    regForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='economy'> <label class='form-check-label' for='economy'>Economy</label></div>";
    regForm += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='environment'> <label class='form-check-label' for='environment'>Environment</label></div>";
    regForm += "</div><br><br>";

    regForm += "<div class='row'>";
    regForm += "<div class='col-lg-5'>";
    regForm += "<p class='label'> Email";
    regForm += "<p><input type='text' class='form-control' id='email' placeholder='enter your email...' required></p>";  
    regForm += "<p class='label'> Password";
    regForm += "<input type='password' class='form-control' id='password' placeholder='enter a password...' required></p>";
    regForm += "</div>";
    regForm += "</div>";

    regForm += "<div class='row'>";
    regForm += "<div class='col-lg-5'>";
    regForm += "<p class='message-text' id='regFormMsg'></p>";
    regForm += "</div>";
    regForm += "<div class='col-lg-3'>";
    regForm += "<p><button onclick='return checkEmail()' type='button' class='btn-lg btn-secondary mb-2'> Register </button></p>";
    regForm += "</div>";
    regForm += "</div></form>";

    mainContainer.innerHTML = regForm; 
    mainContainer.style.display = "block";    
}


// obtaining all email addresses and storing them in localStorage - will be used to check if email entered is already in use
function checkEmail()
{
    // sending xml request
    let xml = new XMLHttpRequest;

    // function that is called when reply received from server
    xml.onreadystatechange = () =>
    {
        if ((xml.readyState == 4) && (xml.status == 200))
        {
            let result = JSON.parse(xml.responseText);

            localStorage.clear();

            for (let i = 0; i < result.length; i++)
            {
                localStorage.setItem(i, JSON.stringify(result[i].email));
            }   
            registerUser();
        }
    };

    //Send new user data to server
    xml.open("POST", "/allEmails", true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send();   
}


// adding the user in the database
function registerUser()
{
    // obtaining the data
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let dob = document.getElementById("dob").value;
    let gender = document.getElementById("gender").value;
    let city = document.getElementById("city").value;
    let country = document.getElementById("country").value;
    let educLevel = document.getElementById("educLevel").value;
    let studyArea = document.getElementById("studyArea").value;
    let science = document.getElementById("science");
    let medicine = document.getElementById("medicine");
    let travel = document.getElementById("travel");
    let education = document.getElementById("education");
    let sports = document.getElementById("sports");
    let nutrition = document.getElementById("nutrition");
    let economy = document.getElementById("economy");
    let environment = document.getElementById("environment");
    let interests = "";
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let emailNotAvailable = false;

    // checking that the characteristics of an email address are included in the user's email
    let emailTest = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    let emailFormat = false;

    if (!emailTest.test(email))
    {
        document.getElementById("regFormMsg").innerHTML = "Enter a valid email.";
        return;
    }
    else
    {
        emailFormat = true;
    }

    // checking that email does not already exist
    for (let i = 0; i < localStorage.length; i++)
    {
        if (email == localStorage.getItem(i))
        {
            emailNotAvailable = true;
        }
    }
    if (emailNotAvailable)
    {
        document.getElementById("regFormMsg").innerHTML = "Email is already in use - enter another email.";
        return;
    }

    // checking which interests did the user select
    if (science.checked == true)
    {
        interests += "science||";
    }
    if (medicine.checked == true)
    {
        interests += "medicine||";
    }
    if (travel.checked == true)
    {
        interests += "travel||";
    }
    if (education.checked == true)
    {
        interests += "education||";
    }
    if (sports.checked == true)
    {
        interests += "sports||";
    }
    if (nutrition.checked == true)
    {
        interests += "nutrition||";
    }
    if (economy.checked == true)
    {
        interests += "economy||";
    }
    if (environment.checked == true)
    {
        interests += "environment||";
    }

    // if email is correct, and user entered all the required data - add user to the database and update the view (note studyArea is not necessary - not included in the condition)
    if (emailFormat && !emailNotAvailable && name && surname && dob && gender && city && country && educLevel && email && password)
    {
        // add user to the database
        // create object with user data to send to the server
        let userObject = {
            _name: name,
            _surname: surname,
            _dob: dob,
            _gender: gender,
            _city: city,
            _country: country,
            _studyLevel: educLevel,
            _studyArea: studyArea,
            _interests: interests,
            _email: email,
            _password: password
        };

        // sending xml request
        let xml = new XMLHttpRequest;

        // function that is called when reply received from server
        xml.onreadystatechange = () =>
        {
            if ((xml.readyState == 4) && (xml.status == 200))
            {
                let insertResult = xml.responseText;

                // update the view
                messageOne.innerHTML = "Successfully Registered " + insertResult + " User";
                messageOne.style.display = "block";

                viewTitle.style.display = "none";
                textboxOne.style.display = "none";
                textboxTwo.style.display = "none";
                rightContainer.style.display = "none";
                mainContainer.style.display = "none";
                // updating the text on the button and its functionality
                buttonOne.innerText = "Log Out";
                buttonOne.onclick = logout;   
                // updating the text on the link and its functionality
                linkOne.innerText = "Edit My Profile";
                linkOne.onclick = editProfile;

                //clearing the local storage which contained all the emails of the registered users
                localStorage.clear();
            }
        };

        //Send new user data to server
        xml.open("POST", "/register", true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.send(JSON.stringify(userObject));  
    }

    // if user did not fill in all the entries
    else
    {
        document.getElementById("regFormMsg").innerHTML = "Enter all fields.";
        return;
    }    
}


// display form to edit user's details
function editProfile()
{
    // hiding the elements
    textboxOne.style.display = "none";
    textboxTwo.style.display = "none";
    buttonOne.style.display = "none";
    messageOne.style.display = "none";
    linkOne.style.display = "none";
    contactUs.style.display = "none";

    // displaying the view title
    viewTitle.innerHTML = "Edit Profile";
    viewTitle.style.display = "block";

    let user = sessionStorage.getItem("userId");
    let userId = {id : user};

    // sending xml request
    let xml = new XMLHttpRequest;

    // function that is called when reply received from server
    xml.onreadystatechange = () =>
    {
        if ((xml.readyState == 4) && (xml.status == 200))
        {
            let userProfile = JSON.parse(xml.responseText);

            let name = userProfile[0].name;
            let surname = userProfile[0].surname
            let dob = userProfile[0].dob.substring(0,10);
            let gender = userProfile[0].gender;
            // checking which gender is this user - to display user's gender first in the dropdown menu
            let gender2 = "";
            if (gender == "F")
                { gender2 = "M";}
            else 
                {gender2 = "F"};
            let city = userProfile[0].city;
            let studyArea = userProfile[0].studyArea;
            let password = userProfile[0].password;

            // creating the elements to be displayed in the registration form
            let form = "<form><div class='row'>";
            form += "<div class='col-lg-5'>";
            form += "<p class='label'> Name";
            form += "<input type='text' class='form-control' id='name' value='" + name + "' required></p>";  
            form += "<p class='label'> Surname";
            form += "<input type='text' class='form-control' id='surname' value='" + surname + "' required></p>";
            form += "<p class='label'> Date of Birth";
            form += "<input type='text' class='form-control' id='dob' value='" + dob + "' required></p>";
            form += "<p class='label'> Gender";
            form += "<select class='form-control' id='gender'> <option>" + gender + "</option> <option>" + gender2 + "</option> </select></p>"; 
            form += "<p class='label'> City";
            form += "<input type='text' class='form-control' id='city' value='" + city + "' required></p>";  
            form += "<p class='label'> Country";
            form += "<select class='form-control' id='country'>";
            for (let i = 0; i < countryArray.length; i++) 
            {
                // adding the options in the Countries drop down list
                form +="<option>" + countryArray[i] + "</option>";
            }
            form += "</select></p>";  
            form += "<p class='label'> Level of Education";
            form += "<select class='form-control' id='educLevel'> <option>Secondary</option> <option>Post-Secondary</option> <option>Tertiary</option> <option>Post-Tertiary</option> </select></p>"; 
            form += "<p class='label'> Area(s) of Studies";
            form += "<input type='text' class='form-control' id='studyArea' value='" + studyArea + "'></p>";
            form += "<p><span class='label'> Topics of Interest </span>";
            form += "<span> (tick one or more) </span></p>";
            form += "</div>";
            form += "</div>";

            form += "<div class='row'>";    
            form += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='science'> <label class='form-check-label' for='science'>Science</label></div>";
            form += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='medicine'> <label class='form-check-label' for='medicine'>Medicine</label></div>";
            form += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='travel'> <label class='form-check-label' for='travel'>Travel</label></div>";
            form += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='education'> <label class='form-check-label' for='education'>Education</label></div>";
            form += "</div><div class='row'>";    
            form += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='sports'> <label class='form-check-label' for='sports'>Sports</label></div>";
            form += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='nutrition'> <label class='form-check-label' for='nutrition'>Nutrition</label></div>";
            form += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='economy'> <label class='form-check-label' for='economy'>Economy</label></div>";
            form += "<div class='form-check col-lg-3 check-box-align'><input type='checkbox' class='form-check-input check-box-align' id='environment'> <label class='form-check-label' for='environment'>Environment</label></div>";
            form += "</div><br><br>";

            form += "<div class='row'>";
            form += "<div class='col-lg-5'>";
            form += "<p class='label'> Password";
            form += "<input type='password' class='form-control' id='password' value='" + password + "' required></p>";
            form += "</div>";
            form += "</div>";

            form += "<div class='row'>";
            form += "<div class='col-lg-5'>";
            form += "<p class='message-text' id='editFormMsg'></p>";
            form += "</div>";
            form += "<div class='col-lg-3'>";
            form += "<p><button onclick='return updateProfile()' type='button' class='btn-lg btn-secondary mb-2'> Update </button></p>";
            form += "</div>";
            form += "</div></form>";

            // update the view
            mainContainer.innerHTML = form; 
            mainContainer.style.display = "block";
        }
    }

    //Send new user data to server
    xml.open("POST", "/editProfile", true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(JSON.stringify(userId));  
}


// updating the user's profile
function updateProfile()
{
    // obtaining the data
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let dob = document.getElementById("dob").value;
    let gender = document.getElementById("gender").value;
    let city = document.getElementById("city").value;
    let country = document.getElementById("country").value;
    let educLevel = document.getElementById("educLevel").value;
    let studyArea = document.getElementById("studyArea").value;
    let science = document.getElementById("science");
    let medicine = document.getElementById("medicine");
    let travel = document.getElementById("travel");
    let education = document.getElementById("education");
    let sports = document.getElementById("sports");
    let nutrition = document.getElementById("nutrition");
    let economy = document.getElementById("economy");
    let environment = document.getElementById("environment");
    let interests = "";
    let password = document.getElementById("password").value;

    // checking which interests did the user select
    if (science.checked == true)
    {
        interests += "science||";
    }
    if (medicine.checked == true)
    {
        interests += "medicine||";
    }
    if (travel.checked == true)
    {
        interests += "travel||";
    }
    if (education.checked == true)
    {
        interests += "education||";
    }
    if (sports.checked == true)
    {
        interests += "sports||";
    }
    if (nutrition.checked == true)
    {
        interests += "nutrition||";
    }
    if (economy.checked == true)
    {
        interests += "economy||";
    }
    if (environment.checked == true)
    {
        interests += "environment||";
    }

    // if user entered all the required data - update user to the database and update the view
    if ( name && surname && dob && gender && city && country && educLevel && password)
    {
        let userId = sessionStorage.getItem("userId");

        // add user to the database
        // create object with user data to send to the server
        let editObject = {
            _id: userId,
            _name: name,
            _surname: surname,
            _dob: dob,
            _gender: gender,
            _city: city,
            _country: country,
            _studyLevel: educLevel,
            _studyArea: studyArea,
            _interests: interests,
            _password: password
        };

        // sending xml request
        let xml = new XMLHttpRequest;

        // function that is called when reply received from server
        xml.onreadystatechange = () =>
        {
            if ((xml.readyState == 4) && (xml.status == 200))
            {
                let updateResult = xml.responseText;

                // update the view
                messageOne.innerHTML = "Successfully Updated " + updateResult + " User";
                messageOne.style.display = "block";

                viewTitle.style.display = "none";
                textboxOne.style.display = "none";
                textboxTwo.style.display = "none";
                rightContainer.style.display = "none";
                mainContainer.style.display = "none";
                // updating the text on the button and its functionality
                buttonOne.innerText = "Log Out";
                buttonOne.onclick = logout;   
                // updating the text on the link and its functionality
                linkOne.innerText = "Edit My Profile";
                linkOne.onclick = editProfile;

                //clearing the local storage
                localStorage.clear();
            }
        };

        //Send new user data to server
        xml.open("POST", "/amendUser", true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.send(JSON.stringify(editObject));  
    }
    
    // if user did not fill in all the entries
    else
    {
        document.getElementById("editFormMsg").innerHTML = "Enter all fields.";
        return;
    }    
}


// function to contact us
function contactPage()
{
    // hiding elements
    textboxOne.style.display = "none";
    textboxTwo.style.display = "none";
    buttonOne.style.display = "none";
    messageOne.style.display = "none";
    linkOne.style.display = "none";
    contactUs.style.display = "none";

    // creating the elements to be displayed in the contact us form
    let contact = "<form><div class='row'>";
    contact += "<div class='col-lg-7'>";
    contact += "<h5> Your Message: </h5>";
    contact += "<textarea class='form-control' placeholder='enter your message...' rows='5'></textarea><p>";
    contact += "<p class='label'> Email";
    contact += "<p><input type='text' clas='form-control' placeholder='enter your email...' required></p>"; 
    contact += "<div class='col-lg-4 ml-auto'>";
    contact += "<p><button onclick='redirect()' type='submit' class='btn-lg btn-secondary mb-2'> Submit </button></p>";
    contact += "</div>";
    contact += "<div><p class='message-text' id='contactMsg'></p></div>";
    contact += "</div>";
    contact += "</div></form>";

    mainContainer.innerHTML = contact;
    mainContainer.style.display = "block";
}


// redirecting to the account page
function redirect()
{
    document.getElementById("contactMsg").innerHTML = "Thank you for your message.  You will now be redirected to the account page.";

    // redirecting to my surveys
    window.setTimeout(function()
    {
        account();        
    }, 5000);
}