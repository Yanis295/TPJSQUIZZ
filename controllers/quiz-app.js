import { questions } from '../models/quiz-data.js';

class QuizApp {
    constructor() {
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.shuffledQuestions = [...questions]; // Copie des questions de base
        
        // DOM
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        this.questionTitle = document.getElementById('question-title');
        this.answersContainer = document.getElementById('answers-container');
        this.nextButton = document.getElementById('next-button');
        this.submitButton = document.getElementById('submit-button');
        this.scoreDisplay = document.getElementById('score-display');
        this.answersReview = document.getElementById('answers-review');
        
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
        
        this.shuffleQuestions();
        
        this.displayQuestion();
        initProgressBar(this.shuffledQuestions.length);
    }
    
    // Fonction pour mélanger les questions
    shuffleQuestions() {
        for (let i = this.shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffledQuestions[i], this.shuffledQuestions[j]] = 
            [this.shuffledQuestions[j], this.shuffledQuestions[i]];
        }
    }
    
    displayQuestion() {
        const question = this.shuffledQuestions[this.currentQuestionIndex];
        
        this.questionTitle.innerText = `Question ${this.currentQuestionIndex + 1}/${this.shuffledQuestions.length}: ${question.title}`;
        
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
        
        this.nextButton.style.display = this.currentQuestionIndex < this.shuffledQuestions.length - 1 ? 'inline-block' : 'none';
        this.submitButton.style.display = this.currentQuestionIndex === this.shuffledQuestions.length - 1 ? 'inline-block' : 'none';
        
        updateProgressBar(this.currentQuestionIndex, this.shuffledQuestions.length);
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.shuffledQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    submitQuiz() {
        this.calculateScore();
        
        this.quizScreen.style.display = 'none';
        this.resultsScreen.style.display = 'block';
        
        const scoreThreshold = 4;
        const isGoodScore = this.score >= scoreThreshold;
        
        const scoreContainer = document.getElementById('score-container');
        const revealScoreBtn = document.getElementById('reveal-score-btn');
        const scoreDisplay = this.scoreDisplay;
        
        if (isGoodScore) {
            revealScoreBtn.style.display = 'none';
            scoreDisplay.style.display = 'block';
            scoreDisplay.innerText = `Bravo ! Tu as eu ${this.score} sur ${this.shuffledQuestions.length}.`;
            
            this.displayAnswersReview();
        } else {
            scoreDisplay.style.display = 'none';
            revealScoreBtn.style.display = 'block';
            revealScoreBtn.innerText = "Je veux quand même voir ma note (à tes risques et périls...)";
            
            this.answersReview.innerHTML = '';
            
            revealScoreBtn.addEventListener('click', () => {
                revealScoreBtn.style.display = 'none';
                scoreDisplay.style.display = 'block';
                scoreDisplay.innerText = `Aïe... Tu as eu ${this.score} sur ${this.shuffledQuestions.length}. T'es éclaté au sol jusqu'au ciel !`;
                
                this.displayAnswersReview();
            });
        }
    }
    
    displayAnswersReview() {
        this.answersReview.innerHTML = '';
        
        const reviewContainer = document.createElement('div');
        reviewContainer.className = 'answers-review-container';
        
        const reviewTitle = document.createElement('h3');
        reviewTitle.innerText = 'Résumé de tes réponses:';
        reviewContainer.appendChild(reviewTitle);
        
        const table = document.createElement('table');
        table.className = 'review-table';
        
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        ['Question', 'Ta réponse', 'Réponse correcte', 'Résultat'].forEach(text => {
            const th = document.createElement('th');
            th.innerText = text;
            headerRow.appendChild(th);
        });
        
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);
        
        const tableBody = document.createElement('tbody');
        
        this.shuffledQuestions.forEach((question, index) => {
            const row = document.createElement('tr');
            
            const questionCell = document.createElement('td');
            questionCell.innerText = `${index + 1}. ${question.title}`;
            row.appendChild(questionCell);
            
            const userAnswerCell = document.createElement('td');
            if (question.type === 'radio' && question.userAnswer !== null) {
                userAnswerCell.innerText = question.answers[question.userAnswer];
            } else if (question.type === 'text') {
                userAnswerCell.innerText = question.userAnswer || '(Non répondu)';
            } else {
                userAnswerCell.innerText = '(Non répondu)';
            }
            row.appendChild(userAnswerCell);
            
            const correctAnswerCell = document.createElement('td');
            if (question.type === 'radio') {
                correctAnswerCell.innerText = question.answers[question.correctAnswer];
            } else if (question.type === 'text') {
                correctAnswerCell.innerText = question.correctAnswer;
            }
            row.appendChild(correctAnswerCell);
            
            const resultCell = document.createElement('td');
            resultCell.className = question.isCorrect() ? 'correct' : 'incorrect';
            resultCell.innerText = question.isCorrect() ? 'Correct' : 'Incorrect';
            row.appendChild(resultCell);
            
            tableBody.appendChild(row);
        });
        
        table.appendChild(tableBody);
        reviewContainer.appendChild(table);
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats';
        
        const correctCount = this.shuffledQuestions.filter(q => q.isCorrect()).length;
        const incorrectCount = this.shuffledQuestions.length - correctCount;
        const correctPercent = Math.round((correctCount / this.shuffledQuestions.length) * 100);
        const incorrectPercent = Math.round((incorrectCount / this.shuffledQuestions.length) * 100);
        
        statsDiv.innerHTML = `
            <p><strong>Taux de réussite:</strong> ${correctPercent}% (${correctCount} sur ${this.shuffledQuestions.length})</p>
        `;
        
        reviewContainer.appendChild(statsDiv);
        this.answersReview.appendChild(reviewContainer);
    }
    
    calculateScore() {
        this.score = 0;
        this.shuffledQuestions.forEach(question => {
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
        
        this.shuffledQuestions = [...questions];
        
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