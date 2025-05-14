class Question {
    #author
    
    constructor(title, type, answers, correctAnswer, author = "Admin") {
        this.title = title;
        this.type = type;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
        this.#author = author;
        this.userAnswer = null;
    }
    
    isCorrect() {
        if (this.type === 'radio') {
            return this.userAnswer === this.correctAnswer;
        } else if (this.type === 'text') {
            return this.userAnswer && 
                this.userAnswer.trim().toLowerCase() === this.correctAnswer.trim().toLowerCase();
        }
        return false;
    }
    
    get author() {
        return this.#author;
    }
}

// Questions du quiz
const questions = [
    new Question(
        "Quel langage de programmation a été créé en 1995 par Brendan Eich ?",
        "radio",
        ["Le francais", "JavaScript", "Python", "C++"],
        1
    ),
    new Question(
        "Quelle méthode permet de sélectionner un élément HTML par son ID ?",
        "radio",
        ["document.querySelector()", "document.getElementById()", "Je donne ma langue au chien", "a²+b²"],
        1
    ),
    new Question(
        "Quel est le résultat de 5 == '5' en JavaScript ?",
        "radio",
        ["true", "false", "Je sais pas je connais que le CSS", "Barber Touch à Bezons"],
        0
    ),
    new Question(
        "Comment déclare-t-on une variable constante en JavaScript ?",
        "text",
        [],
        "const"
    ),
    new Question(
        "C'est quoi le plus facile en street workout ?",
        "radio",
        ["traction 1 bras", "muscle up", "front lever", "drapeau"],
        3
    )
];

export { Question, questions };
