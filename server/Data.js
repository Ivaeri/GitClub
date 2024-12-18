'use strict';
import {readFileSync} from "fs";

function Data() {
  this.polls = {};
}


// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.pollExists = function (pollId) {
  return typeof this.polls[pollId] !== "undefined"
}


Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function(pollId, lang="en") {
  if (!this.pollExists(pollId)) {
    let poll = {};
    poll.lang = lang; 
    poll.userName = userName; 
    poll.questions = [];
    poll.answers = [];
    poll.participants = [];
    poll.currentQuestion = 0;              
    this.polls[pollId] = poll;
<<<<<<< HEAD
    console.log("poll created", pollId, "by host", userName, poll);
=======
>>>>>>> 152babae058443a093f427337ff2a571cc4ab43e
  }
  return this.polls[pollId];
}

Data.prototype.getPoll = function(pollId) {
  if (this.pollExists(pollId)) {
    return this.polls[pollId];
  }
  return {};
}

Data.prototype.participateInPoll = function(pollId, name) {
  if (this.pollExists(pollId)) {
    this.polls[pollId].participants.push({name: name, answers: []})
  }
}

Data.prototype.getParticipants = function(pollId) {
  const poll = this.polls[pollId];
  if (this.pollExists(pollId)) { 
    return this.polls[pollId].participants;
  }
  return [];
}

Data.prototype.addQuestion = function(pollId, q) {
  if (this.pollExists(pollId)) {
    this.polls[pollId].questions.push(q);
  }
}

Data.prototype.activateQuestion = function(pollId, qId = null) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return {}
}

Data.prototype.getSubmittedAnswers = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return answers;
    }
  }
  return {}
}

Data.prototype.submitAnswer = function(pollId, answer) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    let answers = poll.answers[poll.currentQuestion];
    // create answers object if no answers have yet been submitted
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    // create answer property if that specific answer has not yet been submitted
    else if (typeof answers[answer] === 'undefined') {
      answers[answer] = 1;
    }
    // if the property already exists, increase the number
    else
      answers[answer] += 1
  

  }
}

Data.prototype.updateWord = function (word, pollId, userName) {
  if (this.polls[pollId]) {
      this.polls[pollId].enteredWord = word;
      this.polls[pollId].userName = userName;
  }
  
};

Data.prototype.updateGuessedLetters = function (pollId, key) {
  if (this.polls[pollId]) {
      this.polls[pollId].guessedLetters.push(key);
  }
};

Data.prototype.setGameToWon = function (pollId) {
  if (this.polls[pollId]) {
      this.polls[pollId].isGameWon = true;
  }
};

Data.prototype.setAmountWrongLetters = function (pollId) {
  if (this.polls[pollId]) {
        this.polls[pollId].amountWrongLetters += 1;
      }
  };

  Data.prototype.getAmountWrongLetters = function (pollId) {
    if (this.polls[pollId]) {
          return this.polls[pollId].amountWrongLetters
        }
      
    };


Data.prototype.findIfWon = function (pollId) {
  if (this.polls[pollId]) {
      return this.polls[pollId].isGameWon;
  }
  else {
    return false
  }
};


Data.prototype.getGuessedLetter = function (pollId) {
  if (this.pollExists(pollId)) { 
    return this.polls[pollId].guessedLetters;
  }
  return [];
};

Data.prototype.updateIndex = function (pollId) {
  if (this.polls[pollId]) {

      if(this.polls[pollId].participants.length -1 == this.polls[pollId].index){
        this.polls[pollId].index = 0;
      }
      else{
        this.polls[pollId].index += 1;
            }
         }
        
    };
  Data.prototype.getIndex = function (pollId) {

    if (this.pollExists(pollId)) {
      return this.polls[pollId].index
      };
    };
    Data.prototype.getWord = function (pollId) {
      if (this.pollExists(pollId)) {
        return this.polls[pollId].enteredWord
        };
        return ""
      };

Data.prototype.setPollId = function (pollId) {
  if (!this.polls[pollId]) {
    this.polls[pollId] = {
      userName: "",
      enteredWord: "",
      pollId: pollId,
      participants: [],
      questions: [],
      answers: [],
      currentQuestion: 0,
      index: 0,
      guessedLetters: [],
      isGameWon: false,
      amountWrongLetters: 0

    };
  }
  this.polls[pollId].pollId = pollId;
};

export { Data };




