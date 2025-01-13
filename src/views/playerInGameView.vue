<template>
    <div> 
      <Logo :text="uiLabels.logo"/>
    </div>
    <div class="homebutton">
        <HomeButton :text="uiLabels.goHome" v-on:click="this.leavePoll"/> 
    </div>
    <h3> {{ uiLabels.id }} {{ this.pollId }}</h3>
    <span v-for="letter in trueWord" class="trueWord">
        <span v-if="allGuessedLetters.includes(letter)"> {{ letter }} </span> 
        <span v-else> _ </span>
    </span>
    <div class="inGame" v-if="!isGameWon">
      <div v-if="this.participants[this.index] && userName == this.participants[this.index].name" class="keyboardContainer">

        <div class="guessing-container">
          <GuessCounter :wrongGuesses="ammountWrongLetters" :maxGuesses="7" :labels="uiLabels" />
          <div class="failedLettersContainer">
            <h3>{{ uiLabels.wrongGuesses }}</h3>
            <div v-for="letter in allGuessedLetters" :key="letter" class="failedLetters">
              <div v-if="!trueWord.includes(letter)" class="failedLetter">
                {{ letter }}
              </div> 
            </div>
          </div> 
        </div>
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
              <div class="row" v-else="this.lang == 'sv'">
                <button class="key" v-for="key in row1s" v-bind:key="key" v-on:click="keyPressed(key)"  v-bind:class="{'wrongKey': isWrongKey(key), 'correctKey': isCorrectKey(key)}">{{ key }}</button>
              </div>
              <div class="row" v-if="this.lang == 'en'">
                <button class="key" v-for="key in row2e" v-bind:key="key" v-on:click="keyPressed(key)"  v-bind:class="{'wrongKey': isWrongKey(key), 'correctKey': isCorrectKey(key)}">{{ key }}</button>
              </div>
              <div class="row" v-else="this.lang == 'sv'">
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
            <HangPerson v-bind:wrongGuesses="ammountWrongLetters" /> 
          </div>
      </div> <!-- Här stängs guessingcontainer-diven-->

      <div v-else  class="specView"> <!-- Här börjar vyn för dens tur det inte är-->
        <div class="failedLettersSpecView">
          <h3>
            {{ uiLabels.wrongGuesses }}
          </h3>
          <div v-for="letter in allGuessedLetters" :key="letter" class="failedLetters">
            <div v-if="!trueWord.includes(letter)" class="failedLetter">
              {{ letter }}
            </div> 
          </div>
        </div>  
        <div class="hangMan">
          <HangPerson v-bind:wrongGuesses="ammountWrongLetters"/>
        </div>
      </div>
    </div> <!-- Här Stängs inGame-diven-->

    <div class="participants-container">
      <div v-for="participant in this.participants" :key="participant.name" class="player">
        <div class="name-wrapper">
          <div v-if="participant.name == this.participants[this.index].name">
            <img src="/img/speechbubble.png" class="speechBubble"> 
          </div>
            {{ participant.name }}
        </div>
      </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Logo from "@/components/Logo.vue";
import io from 'socket.io-client';
import HomeButton from '../components/HomeButton.vue';
import InputField from '../components/InputField.vue';
import HangPerson from '../components/HangPerson.vue';
import GuessCounter from "../components/GuessCounter.vue";
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'lobbyForHost',
  components: { 
    Logo, 
    HomeButton,
    InputField,
    HangPerson,
    GuessCounter
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
      lang: "en",
      ammountWrongLetters: 0,
      gameIsLostFlag: false,
      isLeaving: false
    };
      
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.id2;
    socket.on( "questionUpdate", q => this.question = q );
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    
    
    window.addEventListener('popstate', this.leavePoll); 
    
   socket.on("participantsUpdate", (data) => {
  if (data.pollId === this.pollId) { 
    this.participants = data.participants; 
  } else {
    console.log("Uppdateringen ignorerades för pollId:", data.pollId);
  }
});
socket.on( "index", (data) => {
      if (data.pollId === this.pollId) {
        this.index = data.index;
      }
      });

    socket.on("letters", (data) => {
  if (data.pollId === this.pollId) { 
    this.allGuessedLetters = data.letters; 
  } else {
    console.log("nya bokstäver ignorerades för pollId:", data.pollId);
  }
});

    socket.on("word", data => {
      if (data.pollId === this.pollId) {
      this.trueWord = data.word } 
    });
    socket.on("wonOrNot", (isWon) => {
      this.isGameWon = isWon;
      this.setGameToWonViaData();
    });    

    socket.on("lang", (data) => {
      if(data.pollId === this.pollId){
        this.lang = data.lang;
        localStorage.setItem("lang", this.lang);
        socket.emit( "getUILabels", data.lang );

      }
    });
  
    socket.on("amountWrongLetters", (data) => {
  if (data.pollId === this.pollId) { 
    this.ammountWrongLetters = data.amount;
    this.gameIsLost(); 

  }
});

    socket.on('connect_error', () => {
      alert('Anslutningen till servern tappades. Försök igen senare.');
    });
    
    socket.emit( "joinPoll", this.pollId );
    socket.emit("getParticipants", { pollId: this.pollId });
    socket.emit("getIndex", this.pollId )
    socket.emit("getGuessedLetters", this.pollId)
    socket.emit("getWord", this.pollId)
    socket.emit("findIfWon", this.pollId) 
    socket.emit("getAmountWrongLetters", this.pollId );
    socket.emit("getLang", this.pollId);
  },

  unmounted() {
  socket.off("wonOrNot");
  socket.off("amountWrongLetters");
  socket.off("lang");
},


  methods: {

    toggleLang: function () {
      if (this.lang == "en") {
        this.lang = "sv";
      } else {
        this.lang = "en";
      }
      localStorage.setItem("lang", this.lang);
    },

    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },
    
    
    leavePoll() {
      socket.emit("leavePoll", { pollId: this.pollId, userName: this.userName }); // berättar för servern att spelaren lämnat
      socket.emit("getParticipants", { pollId: this.pollId }); // uppdaterar listan över spelare
    },

    handleBeforeUnload(event) {
      
    },

    handleUnload() {
  
},

    updateThoseLetters: function () {
      socket.emit("updateGuessedLetters", {pollId: this.pollId, key: this.key})
      socket.emit("getGuessedLetters", this.pollId)
    },

    handleSubmit: function () {
      if(!this.allGuessedLetters.includes(this.key)){
      this.updateThoseLetters();
      this.setcurrentLetterToEmpty();
      this.setGameToWonViaData();
      this.findIfGameIsWonViaData();
      this.setAmountWrongLetters();
      this.sendAmountWrongLetters();
      this.toggleIndexViaData();
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
            return;
          }}
      }
    if (this.participants[this.index] && this.userName == this.participants[this.index].name){
      socket.emit("NailInCoffin", {pollId: this.pollId, userName: this.userName})
    }
    socket.emit("setGameToWon", this.pollId);    
    if (this.isGameWon) {
      this.$router.push('/winView/'+ this.pollId+ '/' + this.userName)
    }
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
    
    },
    isWrongKey(key) {
      return this.allGuessedLetters.includes(key) && !this.trueWord.includes(key);
    },
    isCorrectKey(key) {
      return this.allGuessedLetters.includes(key) && this.trueWord.includes(key);
    },

    gameIsLost () {
      if (this.ammountWrongLetters > 6) { 
     
        this.sendToLossView();
      }
    },
    sendToLossView () {
   
        this.$router.push('/lossView/'+ this.pollId+ '/' + this.userName)
  
    }
    
    }
}
</script>


<style scoped>



.participants-container {
  color: black;
  padding: 1em;
  padding-top: 0;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
  width: 100%; 
  font-size: 1.5em;
  margin-top: 3em;
  margin-left: 1em;

}

.player {
    margin-right: 0.1em; 
    background-image: url('https://www.svgrepo.com/show/403055/bust-in-silhouette.svg');
    background-repeat: no-repeat;
    background-position: left center;
    background-position-x: 0.5em;
    height: 2em;
    width: 3.5em;
    background-size: 2em 2em; 
    padding-left: 2.5em; 
    font-size: 1.2em; 
    margin-bottom: 0.5em; 
    display: flex;
    align-items: center;
    border-radius: 5px; 
    background-color: pink; 
  }

  .name-wrapper {
    position: relative;
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

  hr {
    width: 100%;
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
    display: flex;
    flex-direction: row; 
    justify-content: space-evenly; 
    align-items: center; 
  }

  .keyboardhangman {

    position: relative;
    top: 2em;
    scale: 0.8;
  }

  .guessingcontainer {
    display: flex; 
    flex-direction: column;
    justify-content: center; 
    align-items: center; 
    position: relative;
    left: 1.5em;
    
    }

  .letterBox {
    height: 1.8em;
    width: 1.5em;
    border: solid black;
    border: 0.2em solid black;
    justify-content: center; 
    align-items: center; 
  }

  .submitButton {
    background-color: #cf84a9;
    color: white;
    border: none;
    border-radius: 0.5em;
    cursor: pointer;
    box-shadow: 0 10px 6px rgba(0, 0, 0, 0.2);
    height: 4em;
    width: 8em;
  }

  .submitButton:hover {
    background-color: #a02666;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
  }

  .failedLettersContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 1.5em;
    position: relative;
    left: 0em;
    top: -4em;
  }

  .failedLettersSpecView {
    position: relative;
    transform: translateX(calc(1em + 100%));
  }

  .failedLetters {
    top: 2em;
    width: 5em;
    color: red
  }
  .inGame {
    position: relative;
    margin: 0;
    padding: 0;
    }

  .letterBoxContainer {
    display: flex;
    justify-content: center;
    margin-top: 1em;
    margin-bottom: 1em;

  }

  .trueWord {
    color: rgb(42, 205, 20);
    font-size: 2em;
  }

  .specView {
    display: flex;
    justify-content: space-evenly;
    position: relative;
    top: 2em;
    gap: 6em;
    transform: translateX(-20%);
  }



  .speechBubble {
    position: absolute;
    top: -2em; /* Justera detta värde för att placera bubblan ovanför namnet */
    left: 50%;
    transform: translateY(-15%) translateX(-100%);
    width: 2em; /* Justera bredden efter behov */
  }

  .guess-counter {
    margin-left: 1em;
    margin-bottom: 3em;
}





  @media (max-width: 700px) {
    .hangMan {
      scale: 0.8;
    }
    .player{
      font-size: 1em;
    }

    .participants-container {
      gap: 0.5em;
      position: relative;
      padding-left: 2.3em;
      width: 95%;
      font-size: 1em;
      margin-top: 0;
      
    }

    .guessingcontainer {
      scale: 0.7;  
    }

    .specView {
      transform: translateX(-10%) translateY(25%);
      
    }

  }

  

  @media (max-width: 431px) {
    
    .player{
      font-size: 0.9em;
    }

    .hangMan {
      position: relative;
      scale: 0.7;
      transform: translateY(-25%) translateX(-15%);    
    }

    .keyboardhangman {
      scale: 0.5;
      transform: translateX(calc(1em - 310%)) translateY(calc(1em - 80%));
    }

    .guessingcontainer {
      scale: 0.5;
      transform: translateX(calc(1em - 54%)) translateY(calc(1em + 30%));
    }

    .participants-container {
      
      padding-left: 2.3em;
      margin-top: 0;
      width: 85%;
      transform: translateY(150%);
      
    }

  .homebutton {
    margin-left: -2em;
    margin-top: 0.5em;
  }
}

 
</style>
