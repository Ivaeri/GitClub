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
    poll.questions = [];
    poll.answers = [];
    poll.participants = [];
    poll.currentQuestion = 0;              
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
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
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.updateWord = function (word, pollId) {
  if (this.polls[pollId]) {
      this.polls[pollId].enteredWord = word;
  }
  console.log(this.polls[pollId]);
};

Data.prototype.updateGuessedLetters = function (pollId, key) {
  console.log("Letter received in data:", key);
  console.log("pollId received in data", pollId);
  if (this.polls[pollId]) {
      this.polls[pollId].guessedLetters.push(key);
  }
};

Data.prototype.setGameToWon = function (pollId) {
  console.log("setting game to won in data for:", this.polls[pollId].isGameWon);
  if (this.polls[pollId]) {
      this.polls[pollId].isGameWon = true;
  }
};

Data.prototype.setAmountWrongLetters = function (pollId) {
  if (this.polls[pollId]) {
        this.polls[pollId].amountWrongLetters += 1;
      }
    console.log("amount in data, in set:", this.polls[pollId].amountWrongLetters)
  };

  Data.prototype.getAmountWrongLetters = function (pollId) {
    if (this.polls[pollId]) {
          console.log("amount in data, in get:", this.polls[pollId].amountWrongLetters)
          return this.polls[pollId].amountWrongLetters
        }
      
    };


Data.prototype.findIfWon = function (pollId) {
  console.log("finding if game is won in data for:", this.polls[pollId].isGameWon);
  if (this.polls[pollId]) {
      return this.polls[pollId].isGameWon;
  }
  else {
    return false
  }
};


Data.prototype.getGuessedLetter = function (pollId) {
  console.log("letters requested for", pollId);
  if (this.pollExists(pollId)) { 
    return this.polls[pollId].guessedLetters;
  }
  return [];
};

Data.prototype.updateIndex = function (pollId) {
  console.log("updating index in data:", this.polls[pollId].index)
  if (this.polls[pollId]) {

    console.log("index before toggle:", this.polls[pollId].index)
      if(this.polls[pollId].participants.length -1 == this.polls[pollId].index){
        this.polls[pollId].index = 0;
      }
      else{
        this.polls[pollId].index += 1;
            }
            console.log("index after toggle:", this.polls[pollId].index)
         }
        
    };
  Data.prototype.getIndex = function (pollId) {
    if (this.pollExists(pollId)) {
      return this.polls[pollId].index
      };
    };
    Data.prototype.getWord = function (pollId) {
      console.log("reached getWord in data:", this.polls[pollId].enteredWord )
      if (this.pollExists(pollId)) {
        return this.polls[pollId].enteredWord
        };
        return ""
      };

Data.prototype.setPollId = function (pollId) {
  console.log("Id received from client:", pollId);
  if (!this.polls[pollId]) {
    this.polls[pollId] = {
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


/*function Data() {
  this.polls = {};
}*/

/*Data.prototype.setPollId = function (pollId) {
  console.log("Id received from client:", pollId);
  if (!this.pollExists(pollId)) {
    this.polls[pollId] = {
      lang: "en",
      questions: [],
      answers: [],
      currentQuestion: 0,
      participants: [],
      enteredWord: "",
      pollIdInData: pollId
    };
  }
};


export { Data };


/*function Data() {
  this.polls = {};
}*/

