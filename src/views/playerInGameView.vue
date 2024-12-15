<template>
  
  <div>
    {{pollId}}
    <QuestionComponent v-bind:question="question"
              v-on:answer="submitAnswer($event)"/>
    <hr>
    
  </div>
  <p>{{ this.userName }}</p>
  <div class="participants-container">
    <div v-for="participant in participants" :key="participant.name" class="participant">
      {{ participant.name }}
    </div>
  </div>
  <!--biten under gör inget men tänkte att man kan göra något sådant där
  index ökar varje gång någon anger en bokstav
  <div v-if="participants[index] && this.userName == participants[index].name">
    Det är din tur att gissa!
  </div>
  <div>hej {{ this.participants }}</div>
-->
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
      index: 1
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
    
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("getParticipants", { pollId: this.pollId });
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
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
    margin-top: 30em;
}

.participant {
  margin-right: 0.1em; /* Justera avståndet mellan deltagarna */
}

</style>
