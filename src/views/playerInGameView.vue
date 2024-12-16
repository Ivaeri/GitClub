<template>
  
  <div>
    {{pollId}}
    <!--
    <QuestionComponent v-bind:question="question"
              v-on:answer="submitAnswer($event)"/> 
  -->
    <hr>
    <p>{{ this.userName }}</p>
    <div v-if="this.participants[this.index] && userName == this.participants[this.index].name">
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
    
    <button v-on:click="toggleIndexViaData">{{ uiLabels.submit }}</button>
  </div>
  <div v-else>hänga-gubbe-animationen</div>

  </div>
  
  <div class="participants-container">
    <div v-for="participant in participants" :key="participant.name" class="participant">
      {{ participant.name }}
    </div>
  </div>

 

</template>

<script>
// @ is an alias to /src

import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'lobbyForHost',
  components: {
   
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
      row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        }
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
    
    
    
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("getParticipants", { pollId: this.pollId });
    socket.emit("getIndex", this.pollId )
    /*
    socket.emit("getIndex", { pollId: this.pollId })
    socket.emit("updateIndex", { pollId: this.pollId, index: this.index })
    */
    
   
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },

         toggleIndexViaData: function (){
          socket.emit("updateIndex", this.pollId)
          socket.emit("getIndex", this.pollId )
         }
      }
}
</script>
<style scoped>
.participants-container {
    color: black;
    padding: 1em;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
    width: 100%; /* Fyll hela skärmen */
    margin-top: 20em;
}

.participant {
  margin-right: 0.1em; /* Justera avståndet mellan deltagarna */
}

.inputBox {
  background-color: pink;
  color: black;
  padding: 10px 20px; /* Justera padding för att kompensera för större text */
  text-align: center;
  display: inline-block;
  font-size: 24px; /* Ändra textstorleken här */
  margin: 4px 2px;
  cursor: pointer;
  height: 8em; /* Justera höjden för att kompensera för större text */
  width: 20em; /* Justera bredden om nödvändigt */
}

.keyboard {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .row {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  
  .key {
    margin: 5px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
</style>
