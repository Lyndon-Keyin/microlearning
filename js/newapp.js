async function fetchJSONData() {
    // This function fetches our data from JSON files

    let filename = "performance.json";

    // Fetch the JSON file
    let url="jsondata/" + filename;
    let response = await fetch(url);
    let quiz = await response.json();

    // Store the JSON object in localStorage so we can access it from other functions
    localStorage.setItem("data", JSON.stringify(quiz));

    // Get the Lesson start date
    let start_date = new Date(Date.parse(quiz[0]["start_date"]));

    // Get the current date of today
    let today = new Date();

    // Get the number of days / weeks between days
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((today - start_date) / oneDay));
    const numWeeks = Math.floor(diffDays / 7);

    // Save the Week Number
    localStorage.setItem("numWeeks", numWeeks);

    // Setup the starting question index
    // This will need to change once we can pull data from db for user's completed question
    localStorage.setItem("currentQuestion", 0);
}


function showQuestion() {

    // Get the JSON data
    let quiz = JSON.parse(localStorage.getItem("data"));

    let index = localStorage.getItem("currentQuestion");
    
    // Get the current question title
    let question = quiz[0]["quiz"][index]["question"];

    // Save the answer to local storage
    let answer = quiz[0]["quiz"][index]["answer"];
    localStorage.setItem("answer", answer);

    // Display the current question in the document
    let question_title = document.querySelector(".question-title");
    question_title.innerHTML = question;

    // Display the current options in the document
    let option_a = document.getElementById("option-a");
    let option_b = document.getElementById("option-b");
    let option_c = document.getElementById("option-c");
    let option_d = document.getElementById("option-d");
    
    option_a.innerHTML = quiz[0]["quiz"][index]["a"];
    option_b.innerHTML = quiz[0]["quiz"][index]["b"];
    option_c.innerHTML = quiz[0]["quiz"][index]["c"];
    option_d.innerHTML = quiz[0]["quiz"][index]["d"];
}


function processAnswer() {
    // Get the user's selected option
    let user_answer = document.querySelector("input[name='quiz-option']:checked").value;
    
    // Get the answer from the json data
    let answer = localStorage.getItem("answer");

    let question_area = document.querySelector(".question-area");
    let result_area = document.querySelector(".result");
    let result_title = document.querySelector(".result-title");
    let result_body = document.querySelector(".result-body");
    let play_btn = document.getElementById("play-btn");
    let next_btn = document.getElementById("next-btn");
    let question_index = parseInt(localStorage.getItem("currentQuestion"));
    let numWeeks = parseInt(localStorage.getItem("numWeeks"));

    question_area.style.display = "none";
    result_area.style.display = "flex";

    // Correct answer
    if (user_answer === answer) {

        question_index++;
        localStorage.setItem("currentQuestion", question_index);

        result_title.innerHTML = "Correct";
        result_body.innerHTML = "";
        play_btn.style.display = "none";

        if (question_index <= numWeeks) {
            next_btn.style.display = "block";
        } else {
            next_btn.style.display = "none";
        }

    } else {
        result_title.innerHTML = "Incorrect";
        result_body.innerHTML = "Please review the following video and try again";
        play_btn.style.display = "block";
        next_btn.style.display = "none";
    }
}


function playVideo() {

    let quiz = JSON.parse(localStorage.getItem("data"));
    let numWeeks = parseInt(localStorage.getItem("numWeeks"));
    let index = parseInt(localStorage.getItem("currentQuestion"));

    // Hide the question area
    let question_area = document.querySelector(".question-area");
    question_area.style.display = "none";

    let result_area = document.querySelector(".result");
    result_area.style.display = "none";

    // Load and Show the video player
    let video_player = document.getElementById("video-player");
    let video_source = document.getElementById("video-source");

    video_player.style.display = "block";

    video_player.pause();
    video_source.src = "video/" + quiz[0]["video_file"];
    video_player.load();

    video_player.currentTime = quiz[0]["quiz"][index]["clip_start"];
    video_player.play()

    video_player.addEventListener("timeupdate", function() {

        if (this.currentTime >= quiz[0]["quiz"][index]["clip_end"]) {
            this.pause();

            // Hide the video player
            video_player.style.display = "none";

            // Show the question area
            question_area.style.display = "flex";
        }
    })
}


function nextQuestion() {
    console.log("test");
}


function main() {

    // Access the video player elements
    let video_source = document.getElementById("video-source");
    let video_player = document.getElementById("video-player");

    // Access the Sound toggle button
    let soundBtn = document.getElementById("audio-button");

    // Access the output areas
    let question_area = document.querySelector(".question-area");
    let question_title = document.querySelector(".question-title");

    // Make sure the video player & sound button is hidden when the page first loads
    video_player.style.display = "none";
    soundBtn.style.display = "none";

    // Make sure the question area is visible
    question_area.style.display = "flex";

    // Setup the submit answer buttons
    let submitBtn = document.getElementById("submit-answer");
    submitBtn.addEventListener("click", processAnswer);    

    // Setup the play button & next button for the video-player
    let play_btn = document.getElementById("play-btn");
    play_btn.display="none";
    play_btn.addEventListener("click", playVideo)

    let next_btn = document.getElementById("next-btn");
    next_btn.display="none";
    next_btn.addEventListener("click", playVideo)

    // Fetch some JSON data yo!
    fetchJSONData();

    // Display the first available question
    showQuestion();

}

window.addEventListener("load", main);