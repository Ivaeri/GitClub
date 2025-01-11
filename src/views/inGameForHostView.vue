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
        <div class="disappearWithSmallWindow">
        <div> 
          <h3>{{ uiLabels.guessedLetters }}</h3>
          <div v-for="letter in allGuessedLetters" :key="letter" class="lettersGuessed">
            <span v-if="enteredword.includes(letter)" class="guessedCorrectLetter"> {{ letter }} </span>
            <span v-else class="guessedWrongLetter"> {{ letter }}</span>
          </div>
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
        <div class="name-wraper">
          
        <div v-if="participant.name == participants[this.index].name">
          <img src="/img/speechbubble.png" class="speechBubble"> 
        </div>
        {{ participant.name }}
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
    
    export default {
      name: 'lobbyForHost',
      components: {
        Logo, 
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
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.allGuessedLetters = data.letters; // Uppdatera deltagarlistan
    this.updateCorrectGuesses();
    console.log("gissade bokstäver uppdaterades för pollId:", data.pollId);
  } else {
    console.log("nya bokstäver ignorerades för pollId:", data.pollId);
  }
});
    socket.on("participantsUpdate", (data) => {
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.participants = data.participants; // Uppdatera deltagarlistan
    console.log("Deltagarlistan uppdaterades för pollId:", data.pollId);
  } else {
    console.log("Uppdateringen ignorerades för pollId:", data.pollId);
  }
});

socket.on("amountWrongLetters", (data) => {
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.ammountWrongLetters = data.amount;
    console.log("Antal felaktiga bokstäver uppdaterades för pollId:", this.ammountWrongLetters);
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
    
    console.log("isGameWon?", this.isGameWon);
  });  

    socket.emit("getIndex", this.pollId )
    socket.emit( "getUILabels", this.lang );
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
      console.log("correctguesses", this.correctguesses);
    },

    gameIsWon () {
      if (this.ammountWrongLetters > 6) {  
        console.log("Game is won, navigating to win view");
        socket.emit("NailInCoffin", {pollId: this.pollId, userName: this.hostName});
        this.sendToWinView();
      }
    },
    
    sendToWinView () {
        console.log("Navigating to win view");
        this.$router.push('/winView/'+ this.pollId+ '/' + this.hostName)
    },

    skipPlayer () {
      socket.emit("updateIndex", this.pollId)
      socket.emit("getIndex", this.pollId )
    },

    sendToLossView () {
      if (this.correctguesses == this.enteredword.length) {
        console.log("Navigating to loss view");
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
  color: black;
  padding: 1em;
  padding-top: 0;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
  width: 100%; /* Fyll hela skärmen */
  font-size: 1.5em;
  margin-top: 3em;
  margin-left: 1em;
  transform: translateY(300%);
}

.player {
  margin-right: 0.1em; /* Justera avståndet mellan deltagarna */
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

.speechBubble {
  position: absolute;
    top: -1.55em; /* Justera detta värde för att placera bubblan ovanför namnet */
    transform: translateY(-15%) translateX(-100%);
    width: 2em; /* Justera bredden efter behov */
  }
  .name-wrapper {
    position: relative;
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
  top: 5em;
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


    .participants-container {
      gap: 0.5em;
      position: relative;
      padding-left: 2.3em;
      width: 95%;
      font-size: 1em;
      margin-top: 0;
      transform: translateY(450%);
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
    
      padding-left: 2.3em;
      font-size: 0.7em;
      margin-top: 0;
      width: 85%;
      transform: translateY(650%);
    
  }

  .player{
    font-size: 1.2em;
  }

  .lettersGuessed {
    font-size: 0.8em;
  }
  .disappearWithSmallWindow{
    display: none;
  }
  .wordBox{
    padding-bottom: 4em;
  }

  .hangPerson{
    top: calc(35%);
    left: 30%;
  }
  .skipPlayer{
    margin-top: 8em;
  }
}

</style>