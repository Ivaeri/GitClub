<template>
  <div class="homeButton">
    <HomeButton :text="uiLabels.goHome"/> 
  </div>
  <div>
    <Logo :text="uiLabels.logo" class="logostyle"/>
  </div>
    <div class="skipPlayer">
        <h3> {{ uiLabels.tooSlow }}</h3>
        <button class="skipPlayerButton" v-on:click="skipPlayer">
          {{ uiLabels.skipPlayer }}
        </button>
    </div>
    <div class="wordBox">
      <h2>{{ uiLabels.wordRecieved }}</h2>
        <h2 v-for="letter in enteredword">
          <span v-if="allGuessedLetters.includes(letter)" class="greenLetter"> {{ letter }} </span>
          <span v-else> {{ letter }} </span>
        </h2>
        
        <GuessCounter :wrongGuesses="ammountWrongLetters" :maxGuesses="7" :labels="uiLabels" />
        
        <div> 
          <h3>{{ uiLabels.guessedLetters }}</h3>
          <div v-for="letter in allGuessedLetters" :key="letter" class="lettersGuessed">
            <p v-if="enteredword.includes(letter)" class="guessedCorrectLetter"> {{ letter }} </p>
            <p v-else class="guessedWrongLetter"> {{ letter }}</p>
          </div>
        </div>
    </div> <!-- wordBox stängs här-->
    <div class="graveYard">
      <div>
        <HangPerson class="hangPerson"  v-bind:wrongGuesses="ammountWrongLetters" />
      </div>

    </div>
    <div class="participants-container">
      <div v-for="participant in participants" :key="participant.name" class="player">
        {{ participant.name }}
        <div v-if="participant.name == participants[this.index].name">
          <img src="/img/speechbubble.png" class="speechBubble"> 
        </div>
      </div>
  </div>
    </template>
    
    <script>
    import Logo from "@/components/Logo.vue";
    import io from 'socket.io-client';
    import HomeButton from '../components/HomeButton.vue';
    const socket = io(sessionStorage.getItem("dataServer"));
    import HangPerson from '../components/HangPerson.vue';
    import GuessCounter from "../components/GuessCounter.vue";
    
    export default {
      name: 'lobbyForHost',
      components: {
        Logo, 
        HomeButton,
        HangPerson, 
        GuessCounter
      },
      data: function () {
        return {
          uiLabels: {},
          enteredword: "",
          pollId: null,
          lang: localStorage.getItem("lang") || "en",
          participants: [],
          allGuessedLetters: [],
          ammountWrongLetters: 0,
          correctguesses: 0,
          index: 0,
          hostName: ""
  
        }
      },
  
  created: function () {
    this.pollId = this.$route.params.id;
    this.enteredword = this.$route.params.id2;
    this.hostName = this.$route.params.id3;

  
    socket.on("uiLabels", (labels) => {
      this.uiLabels = labels;
    });


    socket.on("letters", (data) => {
  if (data.pollId === this.pollId) { 
    this.allGuessedLetters = data.letters; // Uppdatera deltagarlistan
    this.updateCorrectGuesses();
  } else {
    console.log("nya bokstäver ignorerades för pollId:", data.pollId);
  }
});
    socket.on("participantsUpdate", (data) => {
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.participants = data.participants; // Uppdatera deltagarlistan
  } else {
    console.log("Uppdateringen ignorerades för pollId:", data.pollId);
  }
});

socket.on("amountWrongLetters", (data) => {
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.ammountWrongLetters = data.amount;
   this.gameIsWon();

  }
});
    socket.on( "index", (data) => {
      if (data.pollId === this.pollId) {
        this.index = data.index;
      }
      });
      

    socket.on("wonOrNot", (isWon) => {
    this.sendToLossView(); 
      });  
  socket.on("lang", (data) => {
      if(data.pollId === this.pollId){
        this.lang = data.lang;
        localStorage.setItem("lang", this.lang);
        socket.emit( "getUILabels", this.lang );

      }
    });

  socket.emit("getLang", this.pollId);

    socket.emit("getIndex", this.pollId )
    socket.emit("getParticipants", { pollId: this.pollId });
    socket.emit("getGuessedLetters",  this.pollId );
    socket.emit("getAmountWrongLetters", this.pollId );
  },

  unmounted() {
  socket.off("wonOrNot");
  socket.off("amountWrongLetters");
},
  
  methods: {

    updateCorrectGuesses () {
      this.correctguesses = this.enteredword.split('').filter(letter => this.allGuessedLetters.includes(letter)).length;  
    },

    gameIsWon () {
      if (this.ammountWrongLetters > 6) {  
        socket.emit("NailInCoffin", {pollId: this.pollId, userName: this.hostName});
        this.sendToWinView();
      }
    },
    
    sendToWinView () {
        this.$router.push('/winView/'+ this.pollId+ '/' + this.hostName)
    },

    skipPlayer () {
      socket.emit("updateIndex", this.pollId)
      socket.emit("getIndex", this.pollId )
    },

    sendToLossView () {
      if (this.correctguesses == this.enteredword.length) {
        this.$router.push('/lossView/'+ this.pollId + '/' + this.hostName)
    }
  }}
  }
   </script>
    
 <style scoped>

h1 {
    font-size: 4em;
    margin-top: -0.5em
}
h2 {
    display: inline-block;
}
.participants-container {
    position: absolute;
    bottom: 0;
    color: black;
    padding: 1em;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
    width: 100%; 
    font-size: 1.3em;
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
  padding-left: 2.5em; 
  font-size: 1.5em; 
  margin-bottom: 0.5em; 
  display: flex;
  align-items: center;
  border-radius: 5px; 
  background-color: pink;
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

.greenLetter {
  color: green;
}

.wordBox {
  position: relative;
  text-align: left;
  margin-left: 4em;
}

.lettersGuessed {
  display: inline-block;
}

.guessedCorrectLetter{
  font-size: 1em;
  color: green;
  padding: 0.3em;
}

.guessedWrongLetter{
  font-size: 1em;
  color: red;
  padding: 0.3em;

}
.graveYard {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.hangPerson{
  position: absolute;
  top: calc(27%); 
  left: 40%;
}
.skipPlayer{
  position: absolute;
  right: 5em;
  top: calc(10%);
  z-index: 100;

}
.skipPlayerButton {
  background-color: #cf84a9;
  color: black;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
}

.skipPlayerButton:hover {
  background-color: #a02666;
}
.homeButton{
  position: relative;
  z-index: 100;
}

.guess-counter {
  position: relative;
  text-align: left;
  margin-left: 0em;
}

@media (max-width: 768px) {
  .skipPlayer{
    right: 0.5em;
  }
  .skipPlayerButton {
    padding: 0.5em;
  }
  .participants-container {
    font-size: 1.2em;
    margin-bottom: 2em;
  }

  .speechBubble{
    scale: 0.7;
  }
  .guess-counter {
    font-size: 1.2em;
  }
}

@media (max-width: 600px) {

  h1 {
    font-size: 3em;
    margin-top: 0.05em;
  }
  h3{
    font-size: 1em;
  }

  .participants-container {
    font-size: 0.6em;
    flex-wrap: wrap;
    gap:30px;
    width: 100%;
  }

  .lettersGuessed {
    font-size: 0.8em;
  }

  .wordBox{
    padding-bottom: 1em;
  }
  .speechBubble{
    scale: 0.3;
    position: relative;
    right: 33%;
  }
  .hangPerson{
    top: calc(40%);
    left: 30%;
    scale: 0.6;
  }
  .skipPlayer{
    right: 1.5em;
    top: calc(5%);
    width: 15%;
  }
  .guess-counter {
    font-size: 1em;
  }
  
}

</style>