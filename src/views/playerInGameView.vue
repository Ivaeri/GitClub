<template>
  
    <h1>{{uiLabels.coop}}</h1>
    <h3> {{ uiLabels.id }} {{ this.pollId }}</h3>
    <div> 
      <Logo />
    </div>
    <div class="homebutton">
        <HomeButton :text="uiLabels.goHome" v-on:click="this.leavePoll"/> 
    </div>
    <hr>
    <span v-for="letter in trueWord" class="trueWord">
        <span v-if="allGuessedLetters.includes(letter)"> {{ letter }} </span> 
        <span v-else> _ </span>
    </span>
    <div class="inGame" v-if="!isGameWon">
      <div v-if="this.participants[this.index] && userName == this.participants[this.index].name" class="keyboardContainer">
        <div class="failedLettersContainer">
        <h3>{{ uiLabels.wrongGuess }}</h3>
        <div v-for="letter in allGuessedLetters" :key="letter" class="failedLetters">
          <div v-if="!trueWord.includes(letter)" class="failedLetter">
            {{ letter }}
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
              <HangPerson v-bind:wrongGuesses="ammountWrongLetters" :scale="0.5"/> 
            </div>
    </div>

        <div v-else class="hangMan">
          <HangPerson v-bind:wrongGuesses="ammountWrongLetters"/>
        </div>
      
    </div> <!-- Här Stängs inGame-diven-->

    <div class="participants-container">

      <div v-for="participant in this.participants" :key="participant.name" class="player">
        {{ participant.name }}
        <div v-if="participant.name == this.participants[this.index].name">
          <img src="/img/speechbubble.png" class="speechBubble"> 
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
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'lobbyForHost',
  components: { 
    Logo, 
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
    
    
    window.addEventListener('popstate', this.leavePoll); //denna lyssnar på när någon lämnar sidan via frameller bakåtknapp
    // window.addEventListener('keydown', this.handleKeydown); //denna lyssnar på när någon trycker på en tangent
        // Registrera beforeunload och unload händelser
   // window.addEventListener("beforeunload", this.handleBeforeUnload);
    //window.addEventListener("unload", this.handleUnload);
   socket.on("participantsUpdate", (data) => {
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.participants = data.participants; // Uppdatera deltagarlistan
    console.log("Deltagarlistan uppdaterades för pollId:", data.pollId);
  } else {
    console.log("Uppdateringen ignorerades för pollId:", data.pollId);
  }
});
socket.on( "index", (data) => {
      if (data.pollId === this.pollId) {
        this.index = data.index;
      }
      });
    
   // socket.on( "letters", letters => this.allGuessedLetters = letters );

    socket.on("letters", (data) => {
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.allGuessedLetters = data.letters; // Uppdatera deltagarlistan
    console.log("gissade bokstäver uppdaterades för pollId:", data.pollId);
  } else {
    console.log("nya bokstäver ignorerades för pollId:", data.pollId);
  }
});

    socket.on("word", word => this.trueWord = word );
    socket.on("wonOrNot", (isWon) => {
      this.isGameWon = isWon;
      this.setGameToWonViaData();
      console.log("isGameWon?", this.isGameWon);
    });    
    /*
    socket.on("amountWrongLetters", (wrongGuesses) => {
      this.ammountWrongLetters = wrongGuesses;
      this.gameIsLost(); //Kontrollera om spelet är förlorat efter uppdatering
    });*/

    socket.on("amountWrongLetters", (data) => {
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.ammountWrongLetters = data.amount;
    this.gameIsLost(); //Kontrollera om spelet är förlorat efter uppdatering

  }
});
/*
    socket.on("amountWrongLetters", (data) => {
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.ammountWrongLetters = wrongGuesses;
  }
});*/
    socket.on('connect_error', () => {
      alert('Anslutningen till servern tappades. Försök igen senare.');
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

  unmounted() {
  socket.off("wonOrNot");
  socket.off("amountWrongLetters");
},


  methods: {

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
      console.log("trueWord", this.trueWord, "allGuessedLetters:", this.allGuessedLetters, "key:", this.key);
      for (let letter of this.trueWord) {
        if (!this.allGuessedLetters.includes(letter)) {
          if(this.key !== letter) {
            this.isGameWon = false;
            console.log("game not won")
            return;
          }}
      }
    if (this.participants[this.index] && this.userName == this.participants[this.index].name){
      socket.emit("NailInCoffin", {pollId: this.pollId, userName: this.userName})
    }
    socket.emit("setGameToWon", this.pollId);
    console.log("emit sent to update win status");
    //socket.emit("removeGame", this.pollId)
    
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

    /*handleKeydown(event) {
      const key = event.key.toUpperCase();
      const validKeys = [...this.row1e, ...this.row2e, ...this.row3, ...this.row1s, ...this.row2s];
      if (validKeys.includes(key)) {
        this.keyPressed(key);
      } else if (event.key === 'Enter') {
        this.handleSubmit();
      }
    },*/

    
   
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
       // this.gameIsLostFlag = true;
        this.sendToLossView();
      }
    },
    sendToLossView () {
     // if (this.gameIsLostFlag) {
        this.$router.push('/lossView/'+ this.pollId+ '/' + this.userName)
    //  }
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

.player {
    margin-right: 0.1em; /* Justera avståndet mellan deltagarna */
    background-image: url('https://www.svgrepo.com/show/403055/bust-in-silhouette.svg');
    background-repeat: no-repeat;
    background-position: left center;
    background-position-x: 0.5em;
    height: 3em;
    width: 5em;
    background-size: 2em 2em; 
    padding: 1.5em; 
    font-size: 2em; 
    margin-bottom: 0.5em; 
    display: flex;
    align-items: center;
    border-radius: 5px; 
    background-color: pink; 
    background-size: 2em 2em;
    color: black;
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
    display: flex; /* Ändra till flex för att placera elementen på samma rad */
    flex-direction: row; /* Säkerställ att barnen ligger på rad */
    justify-content: space-evenly; /* Skapa mellanrum mellan keyboard och hangman */
    align-items: center; /* Justera vertikalt så att elementen är centrerade */
  }

  .keyboardhangman {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 2em;
  }

  .guessingcontainer {
    
    display: flex; /* Flexbox för inre strukturering */
    justify-content: center; /* Centrera innehållet horisontellt */
    align-items: center; /* Centrera innehållet vertikalt */
    position: relative;
    left: 3em;
    
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

    margin-left: 1.5em;
    position: relative;
    left: 3em;
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
    margin-top: 1em;
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

  .player{
    background-image: url('https://www.svgrepo.com/show/403055/bust-in-silhouette.svg');
    background-repeat: no-repeat;
    background-position: left center;
    background-position-x: 0.5em;
    height: 3em;
    width: 5em;
    background-size: 2em 2em; 
    padding-left: 2.5em; 
    font-size: 1.5em; 
    margin-bottom: 0.5em; 
    display: flex;
    align-items: center;
    border-radius: 5px; 
    background-color: pink; 
  }

 
</style>
