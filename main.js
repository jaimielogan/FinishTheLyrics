$(document).ready(function(){

  // Hide the Completion Pop-Up immediately
  $(".completion").hide();

  //--------------------------------------------//
  //----- Function & Variable Definitions -----//

  // Song Definitions -- Defined by Track_ID
  var songs = ["60244658", "48140529", "35360837", "3449321", "3599972", "35215928", "70652942", "13990180", "2639370", "684941", "31192234", "85167406", "15953433", "90401994", "51127613"];
  // Define max length for lyrics manipulation
  var maxLength = [10, 12, 10, 18, 14, 18, 17, 17, 8, 17, 11, 22, 21, 20, 25];
  // Define Variables
  var returnedLyrics = [];
  var lyrics = [];
  var lyricsClue = [];
  var lyricsAnswer = [];
  var level = 0;
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

    // Splice Lyrics Clue and Lyrics Answer to create 3 levels of 5 songs
    lyricsClue = [lyricsClue.splice(0,5),lyricsClue.splice(0,5),lyricsClue.splice(0,5)];
    lyricsAnswer = [lyricsAnswer.splice(0,5),lyricsAnswer.splice(0,5),lyricsAnswer.splice(0,5)];

  }

  //-------------------------//
  //----- Functionality-----//

  // Show Lyrics on Page
  function showLyrics(level,counter) {
    $(".lyricsInput").text(lyricsClue[level][counter]);
    $(".result").text("");
    $(".word1").val("");
    $(".word2").val("");
    $(".word3").val("");
  }

  // Check Answer
  function checkAnswer(level,counter) {
    // Manipulate user input and the answer to ensure they are compared against eachother appropriately
    input = ($(".word1").val() + $(".word2").val() + $(".word3").val()).replace(/[\W_]/g,"").toLowerCase();
    answer = lyricsAnswer[level][counter].replace(/[\W_]/g,"").toLowerCase();

    // Check if the answer and input match
    if(input === answer){
      $(".result").text("Correct!");
      score ++;
    }
    else {
      $(".result").text("Incorrect!");
      // Updating text inputs to show correct answer
      lyricsOutput = lyricsAnswer[level][counter].split(" ");
      $(".word1").text(lyricsOutput[0]).val(lyricsOutput[0]);
      $(".word2").text(lyricsOutput[1]).val(lyricsOutput[1]);
      $(".word3").text(lyricsOutput[2]).val(lyricsOutput[2]);
    }
  }

  // Pull Lyrics out of API call
  function findLyrics(data){
    for (var m in data){
      returnedLyrics.push((JSON.parse(data[m]).message.body.lyrics.lyrics_body));
    }
  }

  // Within the lyrics input, allow the spacebar to be used to move onto next text input
  $('body').on('keydown', 'input, select, textarea', function(e) {
    var self = $(this),
    form = self.parents('form:eq(0)'),
    focusable,
    next;
    if (e.keyCode == 32) {
      focusable = form.find('input,text').filter(':visible');
      next = focusable.eq(focusable.index(this)+1);
      if (next.length) {
        next.focus();
      }
      return false;
    }
  });

  //----------------------------//
  //----- API Musix Match -----//
  var urlBase = "http://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=" + config.apiKey_lyrics + "&track_id=";

  var urls = songs.map(function(array){
    return urlBase + array;
  });

  // var promises = urls.map(function(url){
  //   return $.get(url);
  // });
  //

  // Promise.all(promises)
  //   .then(function(data){
  //     findLyrics(data);
  //     lyricManipulation (returnedLyrics, maxLength);
  //
  //     //-----------------------//
  //     //----- Begin Game -----//
  //
  //     // Show Clue
  //     showLyrics(level,counter);
  //
  //     // Submit Lyrics Guess
  //     $(".submit").click(function(event){
  //       event.preventDefault();
  //       $(".submit").hide();
  //       checkAnswer(level,counter);
  //     });
  //
  //     $(".continue").click(function(event){
  //       event.preventDefault();
  //       $(".submit").show();
  //       // Increase counter and call showLyrics to show next lyric
  //       counter ++;
  //       if (counter < lyricsClue[level].length){
  //         showLyrics(level,counter);
  //       }
  //       else {
  //         // Increase level to ensure when showLyrics is called, it goes onto the next level. Restart counter @ 0.
  //         counter = 0;
  //         level ++;
  //         // When the song loops are completed, show the final score and the option to restart,
  //         $(".lyrics").hide(500);
  //         $(".completion").show(500);
  //         $(".score").text("Congratulations, you have completed this level! Your final score was " + score + " out of 5!");
  //         // Add on "Restart" button click
  //         if (level < lyricsClue.length){
  //           // Call showLyrics when the Next Level button is clicked;
  //           $(".nextLevel").click(function(){
  //             // Reset score to 0
  //             $(".completion").hide(500);
  //             $(".lyrics").show(500);
  //             score = 0;
  //             showLyrics(level,counter);
  //           });
  //         }
  //         else {
  //           $(".nextLevel").hide();
  //         }
  //       }
  //     });
  //
  //   });

});
