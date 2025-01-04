<template>
    <h1>{{ uiLabels.titlegame }}</h1>
    <div class="wordBox">
      <h2>{{ uiLabels.wordRecieved }}</h2>
      <h2 v-for="letter in enteredword">
        <span v-if="allGuessedLetters.includes(letter)" class="greenLetter"> {{ letter }} </span>
        <span v-else> {{ letter }} </span>
      </h2>
      <div> 
        <h3>{{ uiLabels.guessedLetters }}</h3>
        <div v-for="letter in allGuessedLetters" :key="letter" class="lettersGuessed">
          <span v-if="enteredword.includes(letter)" class="guessedCorrectLetter"> {{ letter }} </span>
          <span v-else class="guessedWrongLetter"> {{ letter }}</span>
        </div>
      </div>
    </div>
    <div v-if="ammountWrongLetters > 0" class="graveYard">
      <div >
        <HangPerson  v-bind:wrongGuesses="ammountWrongLetters" />
      </div>
    </div>
    <div class="homebutton">
        <HomeButton :text="uiLabels.goHome"/> 
    </div>
    <div class="participants-container">
      <div v-for="participant in participants" :key="participant.name" class="player">
        <div v-if="participant.name == participants[this.index].name">
          <img src="/img/speechbubble.png" class="speechBubble"> 
        </div>
        {{ participant.name }}
      </div>
  </div>
    </template>
    
    <script>
    import io from 'socket.io-client';
    import HomeButton from '../components/HomeButton.vue';
    const socket = io("localhost:3000");
    import HangPerson from '../components/HangPerson.vue';
    
    export default {
      name: 'lobbyForHost',
      components: {
        HomeButton,
        HangPerson
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
          isGameWon: false,
          index: 0
  
        }
      },
  
  created: function () {
    this.pollId = this.$route.params.id;
    this.enteredword = this.$route.params.id2;
  
    socket.on("uiLabels", (labels) => {
      this.uiLabels = labels;
    });

    socket.on("letters", (letters) => {
      this.allGuessedLetters = letters;
      this.updateCorrectGuesses();
    });
    socket.on( "participantsUpdate", p => {
      this.participants = p;
    });

    socket.on("amountWrongLetters", (wrongGuesses) => {
      this.ammountWrongLetters = wrongGuesses;
      this.gameIsWon(); // Kontrollera om spelet är vunnet för hosten efter uppdatering
    });
    socket.on( "index", index => {
      this.index = index });

    socket.on("wonOrNot", (isWon) => {
    this.isGameWon = isWon;
    this.sendToLossView();
    console.log("isGameWon?", this.isGameWon);
  });  

    socket.emit("getIndex", this.pollId )
    socket.emit( "getUILabels", this.lang );
    socket.emit("getParticipants", { pollId: this.pollId });
    socket.emit("getGuessedLetters",  this.pollId );
    socket.emit("getAmountWrongLetters", this.pollId );
  },
  
  methods: {

    updateCorrectGuesses () {
      this.correctguesses = this.enteredword.split('').filter(letter => this.allGuessedLetters.includes(letter)).length;  
      console.log("correctguesses", this.correctguesses);
    },

    gameIsWon () {
      if (this.ammountWrongLetters > 6) {  
        this.gameIsWon = true;
        this.sendToWinView();
      }
    },
    sendToWinView () {
      if (this.gameIsWon) {
        this.$router.push('/winView/')
      }
    },
    sendToLossView () {
      if (this.correctguesses == this.enteredword.length) {
        this.$router.push('/lossView/'+ this.pollId)
    }
  }}
  }
   </script>
    
 <style scoped>

h1 {
    font-size: 4em;
}
h2 {
    display: inline-block;
}
.participants-container {
    color: black;
    padding: 1em;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
    width: 100%; /* Fyll hela skärmen */
    margin-top: 6em;
    font-size: 2em;
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
}

</style>