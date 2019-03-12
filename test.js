

//------initialize firebase!

var config = {
    apiKey: "AIzaSyBZx6O5slZbbI5AwDInkYCRhTJftabPd9U",
    authDomain: "train-time-40526.firebaseapp.com",
    databaseURL: "https://train-time-40526.firebaseio.com",
    projectId: "train-time-40526",
    storageBucket: "train-time-40526.appspot.com",
    messagingSenderId: "826916255508"
  };
  
  firebase.initializeApp(config);
  
  // Database var
  
  var chooDb = firebase.database();
  
   //Show Current Time
  
    $("#currentTime").append(moment().format("hh:mm A"));
  
   //found this on StacKOverflow!
  
   var datetime = null,
          date = null;
  
  var update = function () {
      date = moment(new Date())
      datetime.html(date.format('h:mm:ss a'));
  };
  
  $(document).ready(function(){
      datetime = $('#currentTime')
      update();
      setInterval(update, 1000);
  });
  
  // ------- onClick #addTrains
  
  $("#addTrains").on("click", function (event) {
  
    event.preventDefault();
  
     
    // --- var(s) to grab data #chooName #chooPlace #firstChoo #chooInterval (still don't quite get the unix)
  
    var trainName = $("#chooName").val().trim();
    var destination = $("#chooPlace").val().trim();
    var arrival = moment($("#firstChoo").val().trim(), "HH:mm A").format("X");
    var freq = $("#chooInterval").val().trim();
  
    
  
    /*---checking input value ---
  
    console.log(trainName);
    console.log(destination);
    console.log(arrival);
    console.log(freq);*/
  
    // ----- var temp object{} for train data
  
    var newTrain = {
      name: trainName,
      place: destination,
      start: arrival,
      rate: freq
    };
  
    // ----- upload to firebase
  
    chooDb.ref().push(newTrain);
  
    /* Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.place);
    console.log(newTrain.start);
    console.log(newTrain.rate);*/
  
    // ---- Clear input
  
    $("#chooName").val("");
    $("#chooPlace").val("");
    $("#firstChoo").val("");
    $("#chooInterval").val("");
   
  });
  
  // --- Create Firebase event for adding new train to the database 
  
  chooDb.ref().on("child_added", function (childSnapshot) {
  
    //console.log(childSnapshot.val());
  
    // Store everything into a var
  
    var tName = childSnapshot.val().name;
    var tPlace = childSnapshot.val().place;
    var tStart = childSnapshot.val().start;
    var tRate = childSnapshot.val().rate;
  
     /* --- Train Info
    console.log(tName);
    console.log(tPlace);
    console.log(tStart);
    console.log(tRate);*/
  
    //calculate time away and update!
  
    var tLeft = moment().diff(moment.unix(tStart), "minutes") % tRate;
    var tAway = tRate - tLeft;
  
    var cleanStart = moment().add(tAway, "m").format("hh:mm A");
  
    //console.log(tLeft);
    //console.log(tAway);
  
    // make de new row & info!
    var train = $("<tr>").append(
      $("<td>").text(tName),
      $("<td>").text(tPlace),
      $("<td>").text(tRate + " min"),
      $("<td>").text(cleanStart),
      $("<td>").text(tAway  + " min")
  
    );
  
    // insert the new row to the table
    $("#newTrains").prepend(train);
  
  });
  
  