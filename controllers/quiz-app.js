import { questions } from '../models/quiz-data.js';

class QuizApp {
    constructor() {
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        // DOM
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        this.questionTitle = document.getElementById('question-title');
        this.answersContainer = document.getElementById('answers-container');
        this.nextButton = document.getElementById('next-button');
        this.submitButton = document.getElementById('submit-button');
        this.scoreDisplay = document.getElementById('score-display');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        const startButton = document.getElementById('start-button');
        startButton.addEventListener('click', () => this.startQuiz());
        
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        
        this.submitButton.addEventListener('click', () => this.submitQuiz());
        
        const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener('click', () => this.restartQuiz());
    }
    
    startQuiz() {
        this.welcomeScreen.style.display = 'none';
        this.quizScreen.style.display = 'block';
        
        this.displayQuestion();
        initProgressBar(questions.length);
    }
    
    displayQuestion() {
        const question = questions[this.currentQuestionIndex];
        
        this.questionTitle.innerText = `Question ${this.currentQuestionIndex + 1}/${questions.length}: ${question.title}`;
        
        this.answersContainer.innerHTML = '';
        
        if (question.type === 'radio') {
            question.answers.forEach((answer, index) => {
                const answerElement = document.createElement('div');
                answerElement.className = 'answer-option';
                answerElement.dataset.index = index;
                
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = 'quiz-answer';
                radioInput.id = `answer-${index}`;
                radioInput.value = index;
                
                const label = document.createElement('label');
                label.htmlFor = `answer-${index}`;
                label.innerText = answer;
                
                if (question.userAnswer !== null && question.userAnswer === index) {
                    radioInput.checked = true;
                    answerElement.classList.add('selected');
                }
                
                answerElement.appendChild(radioInput);
                answerElement.appendChild(label);
                
                answerElement.addEventListener('click', () => {
                    document.querySelectorAll('.answer-option').forEach(el => {
                        el.classList.remove('selected');
                    });
                    
                    answerElement.classList.add('selected');
                    
                    radioInput.checked = true;
                    
                    question.userAnswer = index;
                });
                
                this.answersContainer.appendChild(answerElement);
            });
        } else if (question.type === 'text') {
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.className = 'text-input';
            textInput.placeholder = 'Votre réponse...';
            
            if (question.userAnswer !== null) {
                textInput.value = question.userAnswer;
            }
            
            textInput.addEventListener('input', (e) => {
                question.userAnswer = e.target.value;
            });
            
            this.answersContainer.appendChild(textInput);
        }
        
        this.nextButton.style.display = this.currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
        this.submitButton.style.display = this.currentQuestionIndex === questions.length - 1 ? 'inline-block' : 'none';
        
        updateProgressBar(this.currentQuestionIndex, questions.length);
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    submitQuiz() {
        // Score
        this.calculateScore();
        
        // écran des résultats
        this.quizScreen.style.display = 'none';
        this.resultsScreen.style.display = 'block';
        
        // Score final
        this.scoreDisplay.innerText = `Tu as eu ${this.score} sur ${questions.length}.`;
        if(this.score >= 4) {
            this.scoreDisplay.innerText += " C'est pas mal !";
        }
        else {
            this.scoreDisplay.innerText += " T'es éclaté au sol jusqu'au ciel !";
        }
    }
    
    calculateScore() {
        this.score = 0;
        questions.forEach(question => {
            if (question.isCorrect()) {
                this.score++;
            }
        });
    }
    
    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        questions.forEach(question => {
            question.userAnswer = null;
        });
        
        this.resultsScreen.style.display = 'none';
        this.welcomeScreen.style.display = 'block';
    }
}

function initProgressBar(totalQuestions) {
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('current-question').textContent = 1;
    document.getElementById('progress-fill').style.width = `${(1 / totalQuestions) * 100}%`;
}

function updateProgressBar(currentQuestionIndex, totalQuestions) {
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new QuizApp();
});
