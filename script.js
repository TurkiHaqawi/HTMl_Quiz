// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let spansContainer = document.querySelector(".bullets .spans-container");
let questionArea = document.querySelector(".question-area");
let answersArea = document.querySelector('.answers-area');
let sumbitAnswer = document.querySelector(".submit-btn");
let quizContent = document.querySelector('.quiz-content');
let results = document.querySelector(".result");
let countDownContainer = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswerCount = 0;
let countDownInterval;


// AJAX Request 
function getQuestions() {

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsJsObject = JSON.parse(this.responseText);
            let qCount = questionsJsObject.length;

            
            // Set Questions Count + Create Bullets Function
            qcountAndCreateBullets(qCount);

            // Add Question Data Function
            addQuestionData(questionsJsObject[currentIndex], qCount);

            // Start Count Down Function
            countDown(80, qCount);

            sumbitAnswer.onclick = function() {
                // Get The Right Answer
                let rightAnswer = questionsJsObject[currentIndex].right_answer;
                
                // Increase CurrentIndex
                currentIndex++;

                // Check Answet Function
                checkAnswer(rightAnswer, qCount);

                // Remove Previous Question
                questionArea.innerHTML = '';
                answersArea.innerHTML = '';

                // Trigger Add Question Data Function
                addQuestionData(questionsJsObject[currentIndex], qCount);

                // Handle Bullets
                handleBullets();

                clearInterval(countDownInterval);
                countDown(80, qCount);

                // Show Results Function
                showResults(qCount);
            }
        }
    };

    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}

getQuestions()

function qcountAndCreateBullets(num) {

    // Set Questions Count
    countSpan.innerHTML = num;

    // Create Spans
    for (let i = 0; i < num; i++) {
        // Create bullet
        let bullet = document.createElement('span');

        if (i === 0) {
            bullet.className = 'on';
        }

        // Append bullet To Spans Container
        spansContainer.appendChild(bullet);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // Craet H2 Element For Question Tilte
        questionTitle = document.createElement("h2");
        // Create Text 
        questionText = document.createTextNode(obj.title);
        // Append Text to H2 Question
        questionTitle.appendChild(questionText);

        // Append Question Title to Question Area
        questionArea.appendChild(questionTitle);

        // Create Answers
        for (let i = 1; i <= 4; i++) {
            // Create Main Answer Div
            let mainDiv = document.createElement('div');
            mainDiv.className = 'answer';

            // Create Radio Input
            let radioInput = document.createElement('input');
            // Add Type + Name + Id + Data-Attribute
            radioInput.type = 'radio';
            radioInput.name = "question";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];


            // Make First Answer Selected
            if (i === 1) {
                radioInput.checked = true;
            }

            // Create Label
            theLabel = document.createElement('label');
            // Add For Attribute
            theLabel.htmlFor = `answer_${i}`;
            // Create Text to Label
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            theLabel.appendChild(labelText);

            // Append Radio Tnput + Label to Main Answer Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer, count) {
    // Get All Readi Input By name
    let answers = document.getElementsByName("question");
    let choosenAnswer;

    for (let an of answers) {
        if (an.checked) {
            choosenAnswer = an.dataset.answer;
        }
    }

    if (rAnswer === choosenAnswer) {
        rightAnswerCount++
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans-container span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {

        if (currentIndex === index) {
            span.className = 'on';
        }
    })
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizContent.remove();
        sumbitAnswer.remove();
        bullets.remove();

        if (rightAnswerCount === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Are Correct`;
        } else if (rightAnswerCount > (count / 2) && rightAnswerCount < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswerCount} From ${count}`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswerCount} From ${count}`;
        }

        results.innerHTML = theResults;
    }
}


function countDown() {
    
    let minutes, seconds;
    countDownInterval = setInterval(() => {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        minutes = minutes < 10 ? `0${minutes}`: minutes;
        seconds = seconds < 10 ? `0${seconds}`: seconds;

        countDownContainer.innerHTML = `${minutes}:${seconds}`;

        if (--duration < 0) {
            clearInterval(countDownInterval);
            sumbitAnswer.click()
        }

    }, 1000)
    
}






