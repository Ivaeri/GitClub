<template>
  
  <div>
    {{pollId}}
    <!--
    <QuestionComponent v-bind:question="question"
              v-on:answer="submitAnswer($event)"/> 
  -->
    <hr>
    
  </div>
  <p>{{ this.userName }}</p>
  <div class="participants-container">
    <div v-for="participant in participants" :key="participant.name" class="participant">
      {{ participant.name }}
    </div>
  </div>
  
  <div v-if="this.participants[this.index] && userName == this.participants[this.index].name">
    Det är din tur att gissa!
    <button v-on:click="toggleIndex">Submit, gör till UIlabel</button>
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
      isYourTurn: false
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
    //socket.on( "index", index => this.index = index );
    
    
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("getParticipants", { pollId: this.pollId });
    //this.toggleTurn(this.userName)
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },
    toggleIndex: function (){
      console.log("index before toggle:", this.index)
      if(this.participants.length -1 == this.index){
        this.index = 0;
      }
      else{
        this.index += 1
            }
            console.log("index after toggle:", this.index)
            
         },
         /*
         toggleIndexViaData: function (){
          socket.emit("updateIndex", { pollId: this.pollId })
         }*/
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
    margin-top: 30em;
}

.participant {
  margin-right: 0.1em; /* Justera avståndet mellan deltagarna */
}

</style>
