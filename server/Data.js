'use strict';
import {readFileSync} from "fs";

function Data() {
  this.polls = {};
  this.inActivePolls = [];
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
        poll.hostName = hostName; 
        poll.participants = [];
          
        this.polls[pollId] = poll;
      }
      return this.polls[pollId];
    }

    Data.prototype.getPoll = function(pollId) {
      if (this.pollExists(pollId)) {
        return this.polls[pollId];
      }
      return {};
    }

Data.prototype.participateInPoll = function(pollId, name, wins) {
  if (this.pollExists(pollId)) {
    this.polls[pollId].participants.push({name: name, wins: wins});
  }
 console.log('körs från participate in poll', this.polls[pollId].participants)
}

Data.prototype.getParticipants = function(pollId) {
  const poll = this.polls[pollId];
  if (this.pollExists(pollId)) { 
    return this.polls[pollId].participants;
  }
  return [];
}


Data.prototype.updateWord = function (word, pollId, hostName) {
  if (this.polls[pollId]) {
      this.polls[pollId].enteredWord = word;
      this.polls[pollId].hostName.name = hostName;
      this.polls[pollId].NailInCoffin = hostName;
  }
  
};

    Data.prototype.updateGuessedLetters = function (pollId, key) {
      if (this.polls[pollId]) {
          this.polls[pollId].guessedLetters.push(key);
      }
    };


    Data.prototype.leaveGame = function (pollId, userName) {
      if (this.polls[pollId]) {
        this.polls[pollId].participants = this.polls[pollId].participants.filter(participant => participant.name !== userName);
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

Data.prototype.nailInCoffin = function (userName, pollId) {
  if (this.polls[pollId]) {
    const participant = this.polls[pollId].participants.find(p => p.name === userName);
    this.polls[pollId].NailInCoffin = userName;
    if (participant) {
      for (let i = 0; i < this.polls[pollId].participants.length; i++) {
          this.polls[pollId].participants[i].wins += 0.5;
          if (participant === this.polls[pollId].participants[i]) {
            this.polls[pollId].participants[i].wins += 0.5;
          }
      }
      ;}
    else  {this.polls[pollId].hostName.wins += 2;}
  }
}

Data.prototype.getNailInCoffin = function (pollId) {
  if (this.polls[pollId]) {
    return this.polls[pollId].NailInCoffin
  }
}
Data.prototype.getLeaderboard = function (pollId) {
  if (this.polls[pollId]) {
    console.log("testavfuck",this.polls[pollId].hostName)
    const leaderboard = this.polls[pollId].participants.slice()
    leaderboard.push(this.polls[pollId].hostName)
    console.log('körs från getLeaderboard i data', leaderboard)
    return leaderboard;
  }
}

Data.prototype.getInActivePolls = function (pollId) {
  return this.inActivePolls;
};

Data.prototype.addToInActivePolls = function (pollId) {
  if (this.polls[pollId] && !this.inActivePolls.includes(pollId)) { 
    this.inActivePolls.push(pollId)
   }
};

Data.prototype.inActivateIfFull = function (pollId) {
  if (this.polls[pollId] && this.polls[pollId].participants.length > 3) { 
      this.inActivePolls.push(pollId);
   }
};

Data.prototype.reActivatePollId = function (pollId) {
  if (this.polls[pollId] && this.polls[pollId].participants.length < 4) { 
    this.inActivePolls = this.inActivePolls.filter(id => id !== pollId);
    return this.inActivePolls;
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
    
      Data.prototype.removeGame = function(pollId) {
        if (this.polls[pollId]) {
          delete this.polls[pollId];
        } else {
          console.log(`Poll with ID ${pollId} does not exist.`);
        }
      };

Data.prototype.setPollId = function (pollId) {
  if (!this.polls[pollId]) {
    this.polls[pollId] = {
      hostName: {name: "", wins: 0},
      enteredWord: "",
      pollId: pollId,
      participants: [],
      answers: [],
      index: 0,
      guessedLetters: [],
      isGameWon: false,
      amountWrongLetters: 0,
      NailInCoffin: ""

    };
  }
  this.polls[pollId].pollId = pollId;
  //console.log('körs från set poll id', this.polls[pollId])
};

Data.prototype.startNewGame = function (pollId, hostname, word) {

 if (hostname === this.polls[pollId].hostName.name) {
  hostname = this.polls[pollId].hostName
 }
 const participant = this.polls[pollId].participants.find(p => p.name === hostname);
  if (participant) {hostname = participant}
  if (this.polls[pollId]) {
    this.polls[pollId] = {
      hostName: hostname, 
      enteredWord: word,
      pollId: pollId,
      participants: [],
      answers: [],
      index: 0,
      guessedLetters: [],
      isGameWon: false,
      amountWrongLetters: 0,
      NailInCoffin: hostname
    };

  }
  console.log("hostNaail", this.polls[pollId].NailInCoffin)

}

export { Data };




