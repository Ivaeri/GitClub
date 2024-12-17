<template>
  
  <div>
    {{pollId}}
    <div class="homebutton">
        <HomeButton :text="uiLabels.goHome"/> 
    </div>
    <!--
    <QuestionComponent v-bind:question="question"
              v-on:answer="submitAnswer($event)"/> 
  -->
    <hr>
    <p>{{ this.userName }}</p>

    <div class="inGame" v-if="!isGameWon">

    <div class="failedLettersContainer">
      <h3>Wrong guesses:</h3>
      <div v-for="letter in allGuessedLetters" :key="letter" class="failedLetters">
        <div v-if="!trueWord.includes(letter)" class="failedLetter">
          {{ letter }}

        </div> 
      </div>
    </div>
    <span v-for="letter in trueWord" class="trueWord">
       <span v-if="allGuessedLetters.includes(letter)"> {{ letter }} </span> 
       <span v-else> _ </span>
    </span>
   
    

    <div v-if="this.participants[this.index] && userName == this.participants[this.index].name" class="keyboardContainer">
      <div class="letterBoxContainer">
      <div class="letterBox">
        {{ this.current_letter }}
      </div>
    </div>
      <div id="keyboard" class="keyboard">
      <div class="row">
        <button class="key" v-for="key in row1" v-bind:key="key" v-on:click="keyPressed(key)">{{ key }}</button>
      </div>
      <div class="row">
        <button class="key" v-for="key in row2" v-bind:key="key" v-on:click="keyPressed(key)">{{ key }}</button>
      </div>
      <div class="row">
        <button class="key" v-for="key in row3" v-bind:key="key" v-on:click="keyPressed(key)">{{ key }}</button>
      </div>
    </div>
    
    <button class="submitButton" v-on:click="handleSubmit">{{ uiLabels.submit }}</button>
  </div>
  <div v-else>hänga-gubbe-animationen</div>

  </div>
</div>
<div v-if="isGameWon" class="animate__animated animate__zoomInDown">
      You won!  
      <InputField
          v-model="trueWord"
          placeholder="uiLabels.example"
          id="username">
      </InputField>
    </div>
  <div class="participants-container">
    
    <div v-for="participant in participants" :key="participant.name" class="participant">
       <div v-if="participant.name == participants[this.index].name">
        <img src="/img/speechbubble.png" class="speechBubble"> 
       </div>
      {{ participant.name }}
    </div>
  </div>


 

</template>

<script>
// @ is an alias to /src

import io from 'socket.io-client';
import HomeButton from '../components/HomeButton.vue';
import InputField from '../components/InputField.vue';
const socket = io("localhost:3000");

export default {
  name: 'lobbyForHost',
  components: {
    HomeButton,
    InputField
  },
  data: function () {
    return {
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      participants: [],
      userName: "",
      index: 0,
      uiLabels: {},
      row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Å'],
      row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
      row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      allGuessedLetters: "",
      trueWord: "",
      current_letter: "",
      isGameWon: false
    };
      
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.id2;
    socket.on( "questionUpdate", q => this.question = q );
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => {
      this.participants = p;
      
    });
    socket.on( "index", index => {
      this.index = index });
    
    socket.on( "letters", letters => this.allGuessedLetters = letters );
    socket.on("word", word => this.trueWord = word );
    socket.on("wonOrNot", isWon => this.isGameWon = isWon)
    console.log("ordet i player:", this.trueWord)
    
    
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("getParticipants", { pollId: this.pollId });
    socket.emit("getIndex", this.pollId )
    socket.emit("getGuessedLetters", this.pollId)
    socket.emit("getWord", this.pollId)
    socket.emit("findIfWon", this.pollId)
   
    
   
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },

    updateThoseLetters: function () {
      console.log("running updated those letters", this.key)
      socket.emit("updateGuessedLetters", {pollId: this.pollId, key: this.key})
      socket.emit("getGuessedLetters", this.pollId)
    },

    handleSubmit: function () {
      this.toggleIndexViaData();
      this.updateThoseLetters();
      this.setcurrentLetterToEmpty();
      this.setGameToWonViaData();
      this.findIfGameIsWonViaData();
    },

    setGameToWonViaData() {
      
      for (let letter of this.trueWord) {
        if (!this.allGuessedLetters.includes(letter)) {
          if(this.key !== letter) {
            this.isGameWon = false;
            console.log("win status:", this.isGameWon);
            return;
          }
          
        }
      }
      socket.emit("setGameToWon", this.pollId);
      console.log("emit sent to update win status");
      
    },
    findIfGameIsWonViaData () {
      socket.emit("findIfWon", this.pollId)
    },

    setcurrentLetterToEmpty: function () {
      this.current_letter = ""
    },

    toggleIndexViaData: function () { 
    socket.emit("updateIndex", this.pollId)
    socket.emit("getIndex", this.pollId )
    },

   
    keyPressed: function (key) {
      this.key = key;
      this.current_letter = key;
      /*
      socket.emit("updateGuessedLetters", {pollId: this.pollId, key: key})
      socket.emit("getGuessedLetters", this.pollId)*/
    }
      }
}
</script>
<style scoped>
.participants-container {
    color: darkgray;
    padding: 1em;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
    width: 100%; /* Fyll hela skärmen */
    margin-top: 3em;
}

.participant {
  margin-right: 0.1em; /* Justera avståndet mellan deltagarna */
}

.keyboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: blue;
  }
  
  .row {
    display: flex;
    justify-content: center;
    margin-bottom: 0.4em;
  }
  
  .key {
    margin: 0.3em;
    font-size: 1em;
    cursor: pointer;
    color: white;
    background-color: #007bff;
    width: 2em;
    height: 2.5em;
    align-items: center;
    justify-content: center;
    border-radius: 20%;
  }

  .key:hover {
    background-color:#0056b3;
  }

  .keyboardContainer {
    margin-top: 3em
  }

  .letterBox {
   
    height: 1.8em;
    width: 1.5em;
    border: solid black;
    border: 0.2em solid black; /* Lägg till en kantlinje */
    justify-content: center; /* Centrera innehållet horisontellt */
    align-items: center; /* Centrera innehållet vertikalt */
}

  .submitButton {
    background-color: lightcoral
  }

  .submitButton:hover {
    background-color: coral
  }

  .speechBubble {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 5rem;
    color: black;
    size: 0.5em;
    width: 1em;
    height: auto;
  }

  .failedLettersContainer {
    margin-top: 2em;
    width: 5em;
    height: 5em;
  }

  .failedLetters {
    top: 2em;
    width: 5em;
    color: red
  }
  .failedLetter {
 
  }
  .letterBoxContainer {
    display: flex;
    justify-content: center;
    margin-top: 2em;
    margin-bottom: 1em;

  }

  .trueWord {
    color: rgb(42, 205, 20);
  }

  .winContainer {
    color: #0056b3;
    font-size: 10em;

  }
  

 
</style>
