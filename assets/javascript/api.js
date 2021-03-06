//Open Weather Map API code starts here
//NOTE: 60 calls a minute max, weather API updates every 3 hours.
 var owpKey = "276e65cee16932f5d1ff28e21441e141";
 var  queryURL= "https://api.openweathermap.org/data/2.5/forecast?q=Chicago,us&appid=" + owpKey;

function toFahrenheit (kelvin){
    var tempeture = ((kelvin - 273.15) * (9/5) + 32).toFixed(2);
    return tempeture;
}

function toCelsius (kelvin){
    var tempeture = (kelvin - 273.15).toFixed(2);
    return tempeture;
}
 $.ajax({
   url: queryURL,
   method: "GET"
 })
   .then(function(response) {
     var cityInfo = response.city;
     var cityForcast = response.list; //This is were each 3 hour instance of up to 5 days stores it's data.
     var tempeture = cityForcast[0].main.temp
   });
//Weather Weather Map API code ends here

function createElements (resName, resAddress, resLocality, resRating){
  var row =  $("<tr>");
  row.append($("<td>").text(resName));
  row.append($("<td>").text(resAddress));
  row.append($("<td>").text(resLocality));
  row.append($("<td>").text(resRating));
  $("#Zplaces").append(row);
}

//Zoomato API Start
  var address = "201 E Randolph St, Chicago, IL 60602";
  var query = "";
  var radius = "8046.72"; //@ Return to verify inputs later
  var count = "10"

$("#Zsubmit").on("click", function(){
  $("#Zplaces td").remove();
  $("#loadMore").show();
  query = $("#foodPref").val();
  foodValidate(query, address, radius, count);
});


function foodValidate(query, address, radius, count){
if (query == "" || address == "" || radius == ""){
  $("#foodPref").attr("placeholder", "Please enter a valid input!");
} else {
    callAPI(query, address, radius, count)
  }
}

function callAPI(query, address, radius, count){
  var Zurl = "https://developers.zomato.com/api/v2.1/search?entity_id="+ address +"&q="+ query +"&count="+ count +"&lat=87.6298&lon=41.8781&radius="+ radius +"&sort=real_distance";
  $.ajax({
    url: Zurl,
    headers: {'user-key': 'f92328b88e65fe94874fbec64cb80a2a'},
    method: "GET"
  })
    .then(function(Zresponse) {
      var restaurants = Zresponse.restaurants;

      for (var i = 0; i < restaurants.length; i++){
        var resName = (restaurants[i].restaurant.name);
        var resAddress = (restaurants[i].restaurant.location.address);
        var resLocality = (restaurants[i].restaurant.location.locality);
        var resRating;
        var aggregateRating = restaurants[i].restaurant.user_rating.aggregate_rating
        if ( aggregateRating == 0){
          resRating =  restaurants[i].restaurant.user_rating.rating_text;
        } else{
          resRating = aggregateRating;
        }
        createElements(resName, resAddress, resLocality, resRating);
      }
  });
}

$("#loadMore").on("click", function(){
  $("#Zplaces td").remove();
  var addToCount = count;
  addToCount += 10;
  callAPI(query, address, radius, addToCount);
});

$("#menuButtons").on("click","button#Zselection", function(){
  $("#Zplaces td").remove();
  $("#loadMore").show();
  query = $(this).attr("data-value");
  callAPI(query, address, radius, count);
});
//Zoomato API End

//Firebase chat Start
var config = {
  apiKey: "AIzaSyDEgmLkFdfvOJ6DQwlwPxC2moA9EZ-ufww",
  authDomain: "trilogy-chat-f6ad1.firebaseapp.com",
  databaseURL: "https://trilogy-chat-f6ad1.firebaseio.com",
  projectId: "trilogy-chat-f6ad1",
  storageBucket: "trilogy-chat-f6ad1.appspot.com",
  messagingSenderId: "487090093192"
};

firebase.initializeApp(config);
var database = firebase.database();
getComment();

$("#commentSubmit").on("click", function(){
  event.preventDefault();
  pushComment();
});

function UpdateCommentBox(dComment, dDate, dUser){
  var dateAndUser = dDate + " " + dUser;
  var div = $("<div>").attr("class","uk-card uk-card-secondary uk-card-body");
  var header = $("<h2>").attr("class", "uk-card-title");
  var p = $("<p>");
  var nameHTML = div.append(header.text(dateAndUser));
  nameHTML.append("<hr>");
  nameHTML.append(p.text(dComment));
  $("#recentReviews").append(nameHTML);
}

function pushComment(dComment, dDate, dUser){
  var dUser = $("#userName").val();
  var dComment = $("#userComment").val();
  var dDate = moment().format("MM-DD-YYYY");
  $("#userComment").val("");
  $("#userName").val("");
  database.ref().push({
    'dUser': dUser,
    'dComment': dComment,
    'dDate': dDate
  });
};

function getComment(){
  database.ref().limitToLast(3).on("child_added", function(child){
    var dComment = child.val().dComment;
    var dDate = child.val().dDate;
    var dUser = child.val().dUser;
    UpdateCommentBox(dComment, dDate, dUser);
  });
}
//Firebase chat end