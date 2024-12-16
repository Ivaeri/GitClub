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
    <span v-for="letter in allGuessedLetters" :key="letter">
      <span v-if="!allGuessedLetters.includes(letter)">{{ letter }}</span> 
    </span>
    <p>{{ this.userName }}</p>

    <span v-for="letter in trueWord" class="trueWord">
       <span v-if="allGuessedLetters.includes(letter)"> {{ letter }} </span> 
       <span v-else> _ </span>
    </span>
    

    <div v-if="this.participants[this.index] && userName == this.participants[this.index].name" class="keyboardContainer">
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
  
  <div class="participants-container">
    
    <div v-for="participant in participants" :key="participant.name" class="participant">
       <span v-if="participant.name == participants[this.index].name">
        <img src="/img/speechbubble.png" class="speechBubble"> 
       </span>
      {{ participant.name }}
    </div>
  </div>


 

</template>

<script>
// @ is an alias to /src

import io from 'socket.io-client';
import HomeButton from '../components/HomeButton.vue';
const socket = io("localhost:3000");

export default {
  name: 'lobbyForHost',
  components: {
    HomeButton
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
      trueWord: ""
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
    console.log("ordet i player:", this.trueWord)
    
    
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("getParticipants", { pollId: this.pollId });
    socket.emit("getIndex", this.pollId )
    socket.emit("getGuessedLetters", this.pollId)
    socket.emit("getWord", this.pollId)
   
    
   
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },

    handleSubmit: function () {
      this.toggleIndexViaData();
      this.updateThoseLetters();
    },

    toggleIndexViaData: function () { 
    socket.emit("updateIndex", this.pollId)
    socket.emit("getIndex", this.pollId )
    },

    updateThoseLetters: function () {
      socket.emit("updateGuessedLetters", {pollId: this.pollId, key: this.key})
      socket.emit("getGuessedLetters", this.pollId)
    },
    keyPressed: function (key) {
      this.key = key;
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
    margin: 0.4em;
    font-size: 1em;
    cursor: pointer;
    color: white;
    background-color: #007bff;
    width: 2em;
    height: 2.5em;
    align-items: center;
    justify-content: center;
  }

  .key:hover {
    background-color:#0056b3;
  }

  .keyboardContainer {
    margin-top: 20em
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
    padding-top: 2.5em;
    size: 0.5em;
    width: 1em;
    height: auto;
  }
  
 
</style>
