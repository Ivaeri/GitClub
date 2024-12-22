<template>
    <h1>{{uiLabels.coop}}</h1>
    <h3> {{ uiLabels.id }} {{ this.pollId }}</h3>
    <div class="homebutton">
        <HomeButton :text="uiLabels.goHome"/> 
    </div>
    <hr>
    <span v-for="letter in trueWord" class="trueWord">
        <span v-if="allGuessedLetters.includes(letter)"> {{ letter }} </span> 
        <span v-else> _ </span>
    </span>
    <div class="inGame" v-if="!isGameWon">
      <div class="failedLettersContainer">
        <h3>Wrong guesses:</h3>
        <div v-for="letter in allGuessedLetters" :key="letter" class="failedLetters">
          <div v-if="!trueWord.includes(letter)" class="failedLetter">
            {{ letter }}
          </div> 
        </div>
      </div> 
      <div v-if="this.participants[this.index] && userName == this.participants[this.index].name" class="keyboardContainer">
        <div class="guessingcontainer">
          <div class="guesspart">
            <div class="letterBoxContainer">
              <div class="letterBox">
                {{ this.current_letter }}
              </div>
            </div>
            <div id="keyboard" class="keyboard" @keydown.enter="handleSubmit">
              <div class="row" v-if="this.lang == 'en'">
                <button class="key" v-for="key in row1e" v-bind:key="key" v-on:click="keyPressed(key)" v-bind:class="{'wrongKey': isWrongKey(key), 'correctKey': isCorrectKey(key)}">{{ key }}</button>
              </div>
              <div class="row" v-if="this.lang == 'sv'">
                <button class="key" v-for="key in row1s" v-bind:key="key" v-on:click="keyPressed(key)"  v-bind:class="{'wrongKey': isWrongKey(key), 'correctKey': isCorrectKey(key)}">{{ key }}</button>
              </div>
              <div class="row" v-if="this.lang == 'en'">
                <button class="key" v-for="key in row2e" v-bind:key="key" v-on:click="keyPressed(key)"  v-bind:class="{'wrongKey': isWrongKey(key), 'correctKey': isCorrectKey(key)}">{{ key }}</button>
              </div>
              <div class="row" v-if="this.lang == 'sv'">
                <button class="key" v-for="key in row2s" v-bind:key="key" v-on:click="keyPressed(key)"  v-bind:class="{'wrongKey': isWrongKey(key), 'correctKey': isCorrectKey(key)}">{{ key }}</button>
              </div>
              <div class="row">
                <button class="key" v-for="key in row3" v-bind:key="key" v-on:click="keyPressed(key)"  v-bind:class="{'wrongKey': isWrongKey(key), 'correctKey': isCorrectKey(key)}">{{ key }}</button>
              </div>
            </div> <!-- Här stängs keyboard-diven-->
            <button class="submitButton" v-on:click="handleSubmit">
              {{ uiLabels.submit }}
            </button>
            </div>
          </div>
          <div class="keyboardhangman">
              <HangPerson v-bind:wrongGuesses="ammountWrongLetters"/> 
            </div>
        </div>

        <div v-else class="hangMan">
          <HangPerson v-bind:wrongGuesses="ammountWrongLetters"/>
        </div>

    </div> <!-- Här Stängs inGame-diven-->

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
import HangPerson from '../components/HangPerson.vue';
const socket = io("localhost:3000");

export default {
  name: 'lobbyForHost',
  components: {
    HomeButton,
    InputField,
    HangPerson
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
      row1s: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Å'],
      row2s: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
      row1e: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      row2e: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      allGuessedLetters: "",
      trueWord: "",
      current_letter: "",
      isGameWon: false,
      lang: localStorage.getItem("lang") || "en",
      ammountWrongLetters: 0,
      gameIsLostFlag: false
    };
      
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.id2;
    socket.on( "questionUpdate", q => this.question = q );
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    // Lyssna på popstate för navigering mellan sidor
    window.addEventListener('popstate', this.leavePoll); //denna lyssnar på när någon lämnar sidan via inbyggd manick 'popstate'
    window.addEventListener("beforeunload", this.handleBeforeUnload);
    socket.on("participantsUpdate", (participants) => {
      this.participants = participants;
    });
    socket.on( "index", index => {
      this.index = index });
    
    socket.on( "letters", letters => this.allGuessedLetters = letters );
    socket.on("word", word => this.trueWord = word );
    socket.on("wonOrNot", (isWon) => {
      this.isGameWon = isWon;
      this.setGameToWonViaData();
      console.log("isGameWon?", this.isGameWon);
    });    
    socket.on("amountWrongLetters", (wrongGuesses) => {
      this.ammountWrongLetters = wrongGuesses;
      this.gameIsLost(); //Kontrollera om spelet är förlorat efter uppdatering
    });


    
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("getParticipants", { pollId: this.pollId });
    socket.emit("getIndex", this.pollId )
    socket.emit("getGuessedLetters", this.pollId)
    socket.emit("getWord", this.pollId)
    socket.emit("findIfWon", this.pollId) 
    socket.emit("getAmountWrongLetters", this.pollId );
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('popstate', this.handlePageLeave);
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },
    
    
    leavePoll() {
      socket.emit("leavePoll", { pollId: this.pollId, userName: this.userName }); // berättar för servern att spelaren lämnat
      socket.emit("getParticipants", { pollId: this.pollId }); // uppdaterar listan över spelare
    },
 
  handleBeforeUnload() {
      console.log("beforeunload event triggered");
      const data = JSON.stringify({ pollId: this.pollId, userName: this.userName });
      navigator.sendBeacon("/leavePoll", data);
      socket.emit("getParticipants", { pollId: this.pollId }); // uppdaterar listan över spelare
    },

    updateThoseLetters: function () {
      socket.emit("updateGuessedLetters", {pollId: this.pollId, key: this.key})
      socket.emit("getGuessedLetters", this.pollId)
    },

    handleSubmit: function () {
      if(!this.allGuessedLetters.includes(this.key)){
      this.toggleIndexViaData();
      this.updateThoseLetters();
      this.setcurrentLetterToEmpty();
      this.setGameToWonViaData();
      this.findIfGameIsWonViaData();
      this.setAmountWrongLetters();
      this.sendAmountWrongLetters();
      /*this.sendToWinView();*/
      }
  },
    
    setAmountWrongLetters(){
      if(!this.trueWord.includes(this.key)) {
      socket.emit("addAmountWrongLetters", this.pollId);
      }
      
    },
    sendAmountWrongLetters () {
      socket.emit("getAmountWrongLetters", this.pollId)
    },

    setGameToWonViaData() {
      
      for (let letter of this.trueWord) {
        if (!this.allGuessedLetters.includes(letter)) {
          if(this.key !== letter) {
            this.isGameWon = false;
            console.log("game not won")
            return;
          }}
      }
    socket.emit("setGameToWon", this.pollId);
    console.log("emit sent to update win status");
    socket.emit("removeGame", this.pollId)
    this.$router.push('/winView/')
      
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
    },
    isWrongKey(key) {
      return this.allGuessedLetters.includes(key) && !this.trueWord.includes(key);
    },
    isCorrectKey(key) {
      return this.allGuessedLetters.includes(key) && this.trueWord.includes(key);
    },

    gameIsLost () {
      if (this.ammountWrongLetters > 6) { 
        this.gameIsLostFlag = true;
        this.sendToLossView();
      }
    },
    sendToLossView () {
      if (this.gameIsLostFlag) {
        this.$router.push('/lossView/'+ this.pollId)
      }
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

  .wrongKey {
  background-color: red
}

.correctKey {
  background-color: green
}

.correctKey:hover {
  background-color: rgb(21, 69, 21);
}
.wrongKey:hover {
  background-color: rgb(143, 27, 27)
}

  .keyboardContainer {
    margin-top: 3em;
    display: flex; /* Ändra till flex för att placera elementen på samma rad */
    flex-direction: row; /* Säkerställ att barnen ligger på rad */
    justify-content: space-between; /* Skapa mellanrum mellan keyboard och hangman */
    align-items: center; /* Justera vertikalt så att elementen är centrerade */
    gap: 2em; /* Lägg till mellanrum mellan elementen */
  }

  .keyboardhangman {
    flex: 0; /* Se till att hangman tar upp sin andel av utrymmet */
    display: flex;
    justify-content: center;
    
  }

  .guessingcontainer {
    flex: 1; /* Se till att guessingcontainer tar upp proportionerligt utrymme */
    display: flex; /* Flexbox för inre strukturering */
    justify-content: center; /* Centrera innehållet horisontellt */
    align-items: center; /* Centrera innehållet vertikalt */
    
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
    width: 8em;
    height: 5em;
    margin-left: 1.5em;
  }
  .failedLetters {
    top: 2em;
    width: 5em;
    color: red
  }
  .inGame {
    position: relative;

  }
  .letterBoxContainer {
    display: flex;
    justify-content: center;
    margin-top: 2em;
    margin-bottom: 1em;

  }

  .trueWord {
    color: rgb(42, 205, 20);
    font-size: 2em;
  }

  .winContainer {
    color: #0056b3;
    font-size: 10em;

  }
  
  .winText {
    color: #0056b3;
    font-size: 10em
  }

 
</style>
