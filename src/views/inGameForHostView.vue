<template>
    <h1>{{ uiLabels.titlegame }}</h1>
    <div class="wordBox">
      <h2>{{ uiLabels.wordRecieved }}</h2>
      <h2 v-for="letter in enteredword">
        <span v-if="allGuessedLetters.includes(letter)" class="greenLetter"> {{ letter }} </span>
        <span v-else> {{ letter }} </span>
      </h2>
      <div >
        <h3>Letter's guessed:</h3>
        <div v-for="letter in allGuessedLetters" :key="letter" class="lettersGuessed">
          <span v-if="enteredword.includes(letter)" class="guessedCorrectLetter"> {{ letter }} </span>
          <span v-else class="guessedWrongLetter"> {{ letter }}</span>
        </div>
      </div>
    </div>
    <div v-for="letter in allGuessedLetters" :key="letter" class="graveYard">
      <div v-if="!enteredword.includes(letter)">
        <HangPerson />
      </div>
    </div>
    <div class="homebutton">
        <HomeButton :text="uiLabels.goHome"/> 
    </div>
    <div class="participants-container">
    <div v-for="participant in participants" :key="participant.name" class="participant">
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
          allGuessedLetters: []
  
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
    });
    socket.on( "participantsUpdate", p => {
      this.participants = p;
    });
    
  socket.emit( "getUILabels", this.lang );
  socket.emit("getParticipants", { pollId: this.pollId });
  socket.emit("letters", { pollId: this.pollId });
  },
  
  methods: {
  
  }
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

.participant {
  margin-right: 0.1em; /* Justera avståndet mellan deltagarna */
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