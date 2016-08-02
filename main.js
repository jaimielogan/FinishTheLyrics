$(document).ready(function(){

  $(".completion").hide();

  //--------------------------------------------//
  //----- Function & Variable Definitions -----//

  // Song Definitions -- Defined by Track_ID
  // var songs = ["35215928", "31192234", "60244658", "70652942", "13990180", "2639370", "85167406", "15953433", "48140529", "35360837", "684941", "90401994", "3449321", "3599972", "51127613"];
  var songs = ["35215928", "31192234"];
  // Define max length for lyrics manipulation
  // var maxLength = [18, 11, 10, 17, 17, 8, 22, 21, 12, 10, 17, 20, 18, 14, 25];
  var maxLength = [18, 11];
  // Define Variables
  var lyrics = [];
  var lyricsClue = [];
  var lyricsAnswer = [];
  var counter = 0;
  var input = "";
  var score = 0;

  //--------------------------------//
  //----- Lyrics Manipulation -----//

  function lyricManipulation (returnedLyrics, maxLength) {
    // Shorten lyrics to desired length & push into array lyrics. This will be the source of truth that the input is compared to.
    for (var j in returnedLyrics){
      lyrics.push(returnedLyrics[j].split(/\s+/).slice(0,maxLength[j]).join(" "));
    }

    //Define the lyrics clue that will be shown on the screen by cutting off the final three words
    for (var k in lyrics){
      lyricsClue.push(lyrics[k].split(/\s+/).slice(0,(maxLength[k] - 3)).join(" "));
      lyricsAnswer.push(lyrics[k].split(/\s+/).slice((maxLength[k] - 3),maxLength[k]).join(" "));
    }
  }

  //-------------------------//
  //----- Functionality-----//

  // Show Lyrics on Page
  function showLyrics(counter) {
    $(".lyricsInput").text(lyricsClue[counter]);
    $(".result").text("");
    $(".word1").val("");
    $(".word2").val("");
    $(".word3").val("");
  }

  // Check Answer
  function checkAnswer(counter) {
    // Manipulate user input and the answer to ensure they are compared against eachother appropriately
    input = ($(".word1").val() + $(".word2").val() + $(".word3").val()).replace(/[\W_]/g,"").toLowerCase();
    answer = lyricsAnswer[counter].replace(/[\W_]/g,"").toLowerCase();

    // Check if the answer and input  match
    if(input === answer){
      $(".result").text("Correct!");
      score ++;
    }
    else {
      $(".result").text("Incorrect!");
      // Updating text inputs to show correct answer
      lyricsOutput = lyricsAnswer[counter].split(" ");
      $(".word1").text(lyricsOutput[0]).val(lyricsOutput[0]);
      $(".word2").text(lyricsOutput[1]).val(lyricsOutput[1]);
      $(".word3").text(lyricsOutput[2]).val(lyricsOutput[2]);
    }
  }

  //----------------------------//
  //----- API Musix Match -----//
  var urlBase = "http://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=1a27e75bdb2640b7855e3bb00431c1d9&track_id=";

  var urls = songs.map(function(array){
    return urlBase + array;
  });

  var promises = urls.map(function(url){
    return $.get(url);
  });

  var returnedLyrics = [];

  function findLyrics(data){
    for (var m in data){
      returnedLyrics.push((JSON.parse(data[m]).message.body.lyrics.lyrics_body));
    }
    console.log(returnedLyrics);
  }

  Promise.all(promises)
    .then(function(data){
      findLyrics(data);
      lyricManipulation (returnedLyrics, maxLength);

      //-----------------------//
      //----- Begin Game -----//

      // Show Clue
      showLyrics(counter);

      // Submit Lyrics Guess
      $(".submit").click(function(event){
        event.preventDefault();
        $(".submit").hide();
        checkAnswer(counter);
      });

      $(".continue").click(function(event){
        event.preventDefault();
        $(".submit").show();
        // Increase counter and call showLyrics to show next lyric
        counter ++;
        if (counter < songs.length){
          showLyrics(counter);
        }
        else {
          // When the song loops are completed, show the final score and the option to restart,
          $(".lyrics").hide(500);
          $(".completion").show(500);
          $(".score").text("Congratulations, you have completed the game! Your final score was " + score + " out of " + songs.length + "!");
        }
      });

    });

});
