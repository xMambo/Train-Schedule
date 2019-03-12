//Initialize Firebase

  var config = {
    apiKey: "AIzaSyBZx6O5slZbbI5AwDInkYCRhTJftabPd9U",
    authDomain: "train-time-40526.firebaseapp.com",
    databaseURL: "https://train-time-40526.firebaseio.com",
    projectId: "train-time-40526",
    storageBucket: "train-time-40526.appspot.com",
    messagingSenderId: "826916255508"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  
  $("#currentTime").append(moment().format("hh:mm A"));

var datetime = null,
    date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format("h:mm:ss a"));
};

$(document).ready(function(){
  datetime = $("#currentTime")
  update();
  setInterval(update, 1000);
});

  //Button for adding Trains
  $("#add-train-btn").on("click", function(event) {
      event.preventDefault();
console.log("click");

      // Grab user input
      var trName = $("#train-name-input").val().trim();
      var trDestination = $("#destination-input").val().trim();
      var trStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
      var trRate = $("#rate-input").val().trim();

      // creates local "temp" object for holding train data
    var newTrain = {
        name: trName,
        destination: trDestination,
        start: trStart,
        rate: trRate,

    };

    // uploads train data to the database
    database.ref().push(newTrain);

    // logs everything to the console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.rate);

    alert("Train successfullyt added");

    //clears all of the boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
  });


  // create firbase event for adding new train to the database
  database.ref().on("child_added", function (childSnapshot) {

  //store everything into a variable
  var trName = childSnapshot.val().name;
  var trDestination = childSnapshot.val().destination;
  var trStart = childSnapshot.val().start;
  var trRate = childSnapshot.val().rate;

  //train info
  /*console.log(trName);
  console.log(trDestination);
  console.log(trStart);
  console.log(trRate);*/

  //prettify the train start
var trStartPretty = moment.unix(trStart).format("HH:mm");

// calculate train time vs time remaining

var trLeft = moment().diff(moment.unix(trStart), "minutes") % trRate;
var trAway = trRate - trLeft;

//make new row
var train = $("<tr>").append(
    $("<td>").text(trName),
    $("<td>").text(trDestination),
    $("<td>").text(trRate + " min"),
    $("<td>").text(trStartPretty),
    $("<td>").text(trAway + " min")
);

// insert new row to table
$("#trTable").append(train);
console.log(train);
});

