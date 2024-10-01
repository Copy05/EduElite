import { LoadData, Modules, Languages } from "./engine/questionLoader.js";

const questionElement = document.getElementById("question");
const answersContainer = document.getElementById("answers-container");
const questionResults = document.getElementById("questionResults");
const questionResultsHead = document.getElementById("questionResultsHead");
const submitButton = document.getElementById("submit-button");
const lang = localStorage.getItem("site_lang") || Languages.ENGLISH;
const selectedModule = localStorage.getItem("selectedModule");

let randomQuestion;
let score = 0;
let lastQuestionId = null;

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements around
    }
};

const loadQuestion = () => {
    LoadData(lang, selectedModule)
        .then(d => {
            const questions = d.questions;

            shuffleArray(questions); 

            const limitedQuestions = questions.slice(0, 10);

            const filteredQuestions = limitedQuestions.filter(q => q.id !== lastQuestionId);

            if (filteredQuestions.length === 0) {
                questionElement.innerText = "No more questions available.";
                return; // Exit if no questions are left
            }

            const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
            randomQuestion = filteredQuestions[randomIndex];

            lastQuestionId = randomQuestion.id;

            shuffleArray(randomQuestion.answers);

            questionElement.innerText = randomQuestion.question;

            const questionImage = document.getElementById("questionImage");
            if (randomQuestion.img && randomQuestion.img !== "default") {
                questionImage.src = randomQuestion.img; // Set the image source
                questionImage.style.display = "block"; // Show the image
            } else {
                questionImage.style.display = "none"; // Hide the image if "default"
            }

            answersContainer.innerHTML = ''; 
            questionResults.style.display = "none";

            randomQuestion.answers.forEach((answer, index) => {
                const answerLabel = document.createElement("label");
                const answerCheckbox = document.createElement("input");

                answerCheckbox.type = "checkbox";
                answerCheckbox.name = `answer-${randomQuestion.id}`;
                answerCheckbox.value = answer.text;
                answerCheckbox.id = `answer-${randomQuestion.id}-${index}`;
                answerCheckbox.classList.add("QuestionAnswer");

                answerLabel.classList.add("AnswerLabel");
                answerLabel.appendChild(answerCheckbox);
                answerLabel.appendChild(document.createTextNode(answer.text));

                answersContainer.appendChild(answerLabel);
                answersContainer.appendChild(document.createElement("br"));
            });
        })
        .catch(error => {
            questionElement.innerText = "Error loading data.";
            console.error(error);
        });
};

loadQuestion();

const updateScoreDisplay = () => {
    const scoreElement = document.getElementById("lp-score");
    scoreElement.innerText = `Score: ${score}`;
};

submitButton.addEventListener("click", () => {
    const selectedAnswers = [];
    const checkboxes = document.querySelectorAll(`input[name="answer-${randomQuestion.id}"]:checked`);

    checkboxes.forEach(checkbox => {
        selectedAnswers.push(checkbox.value);
    });

    if (selectedAnswers.length === 0) {
        alert("No answers selected. Please select at least one answer.");
        return;
    }

    const correctAnswers = randomQuestion.answers.filter(answer => answer.isCorrect).map(answer => answer.text);
    const allAnswers = randomQuestion.answers.map(answer => answer.text);

    const isCorrect = correctAnswers.every(answer => selectedAnswers.includes(answer)) && 
                      selectedAnswers.every(answer => correctAnswers.includes(answer));

    questionResultsHead.classList.remove("qrh-correct", "qrh-wrong");
    questionResults.classList.remove("qr-correct", "qr-wrong");

    if (isCorrect) {
        questionResultsHead.innerText = "Correct! 🎉";
        questionResultsHead.classList.add("qrh-correct");
        questionResults.style.display = "block";
        questionResults.classList.add("qr-correct");

        score += 1;

        let ts = Number(localStorage.getItem("totalScore")) || 0;
        localStorage.setItem("totalScore", ts + 1);
        updateScoreDisplay();
    } else {
        questionResultsHead.innerText = "Wrong! ❌";
        questionResultsHead.classList.add("qrh-wrong");
        questionResults.style.display = "block";
        questionResults.classList.add("qr-wrong");
    }

    randomQuestion.answers.forEach((answer, index) => {
        const checkbox = document.getElementById(`answer-${randomQuestion.id}-${index}`);
        if (checkbox) {
            if (answer.isCorrect) {
                checkbox.parentNode.style.color = "green";
            } else {
                if (checkbox.checked) {
                    checkbox.parentNode.style.color = "red";
                }
            }
        }
    });

    const allCheckboxes = document.querySelectorAll(`input[name="answer-${randomQuestion.id}"]`);
    allCheckboxes.forEach(checkbox => {
        checkbox.disabled = true;
    });

    submitButton.style.display = "none";

    if (!document.getElementById("continue-button")) {
        const continueButton = document.createElement("button");
        continueButton.id = "continue-button";
        continueButton.innerText = "Continue";
        continueButton.classList.add("continue-button");
        questionResults.appendChild(continueButton);

        continueButton.addEventListener("click", () => {
            randomQuestion.answers.forEach((answer, index) => {
                const checkbox = document.getElementById(`answer-${randomQuestion.id}-${index}`);
                if (checkbox) {
                    checkbox.parentNode.style.color = "";
                }
            });

            loadQuestion();
            questionResults.style.display = "none";
            continueButton.remove();
            submitButton.style.display = "block"; 

            const newCheckboxes = document.querySelectorAll(`input[name="answer-${randomQuestion.id}"]`);
            newCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
        });
    }
});