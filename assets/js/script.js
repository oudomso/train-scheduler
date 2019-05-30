var Config = {
    apiKey: "AIzaSyCd_ATp7kekW8S5E29dX0Dnd06U1ylHDkg",
    authDomain: "train-scheduler-47217.firebaseapp.com",
    databaseURL: "https://train-scheduler-47217.firebaseio.com",
    projectId: "train-scheduler-47217",
    storageBucket: "train-scheduler-47217.appspot.com",
    messagingSenderId: "785661835455",
    appId: "1:785661835455:web:ae23b9290fecee9e"
};
firebase.initializeApp(Config);
// puts the firebase into a variable
var database = firebase.database();


// Initial Values
var name="";
var dest="";
var starttime = "";
var freq = 0;


$("#add-train").click(function (event) {
    event.preventDefault();

    name = $("#nameInput").val().trim();
    dest = $("#destination").val().trim();
    starttime = $("#starttime").val().trim();
    freq = $("#frequency").val().trim();

    database.ref().push({
        name: name,
        dest: dest,
        starttime: starttime,
        freq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#nameInput").val("");
    $("#destination").val("");
    $("#starttime").val("");
    $("#frequency").val("");
});
database.ref().on("child_added", function(snapshot) {

    var snapval = snapshot.val();


    var arrival = moment(snapval.starttime, "hh:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(arrival), "minutes");

    var remainder = parseInt( diffTime % snapval.freq);

    // Minutes until next train
    var minAway = parseInt (snapval.freq) - remainder;

    // Calculate next train time 
    var nextTrain = moment().add(minAway, "minutes");

    // Convert minute to hour and minute format
    nextTrain = moment(nextTrain).format("hh:mm A");

    console.log("THis is the minute away: "+ minAway)


    $("#train-data").append(
        "<tr>"+
        "<td>" + snapval.name + "</td>" + 
        "<td>" + snapval.dest + "</td>" + 
        "<td>" + snapval.freq +"</td>" + 
        "<td>" + nextTrain + "</td>" + 
        "<td>" + minAway + "</td>" +
        "</tr>");
    }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

