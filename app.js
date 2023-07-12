//jshint esversion 6

const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const e = require('express');
app.use(bodyParser.urlencoded({ extended: true }));
const mailchimp = require('@mailchimp/mailchimp_marketing'); // Had to also install the package using npm
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

//This part is like authentication
mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
    apiKey: process.env.APIKEY,
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
    server: "us21"
});
//As soon as the sign in button is pressed execute this
app.post("/", function (req, res) {
    //*****************************CHANGE THIS ACCORDING TO THE VALUES YOU HAVE ENTERED IN THE INPUT ATTRIBUTE IN HTML******************************
    const firstName = req.body.nameF;
    const secondName = req.body.nameL;
    const email = req.body.email;
    //^This part is retreiving the data according to the input names in the html
    //*****************************ENTER YOU LIST ID HERE******************************
    const listId = "1a9a8e8390";
    //Creating an object with the users data so that we can pass the information to mailchimp in the form that it wants
    const subscribingUser = {
        firstName: firstName,
        lastName: secondName,
        email: email
    };
    //Uploading the data to the server
    //This function  was taken from the documentation on the website
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        //If all goes well logging the contact's id
        res.sendFile(__dirname + "/success.html")
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id}.`
        );
    }
    //Running the function and catching the errors (if any)
    // ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LECTURE*************************
    // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the failure page
    //SINCE THIS IS INCLUDED OUTSIDE OF THE RUN() FUNCTION, IT WILL ONLY SEND FAIL IF THERE IS AN ERROR THROWN BACK FROM THE FUNCTION.
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});

//apikey: 16a9dbe86a37a770aaf1fd56d8703749-us21

// list id: 1a9a8e8390
