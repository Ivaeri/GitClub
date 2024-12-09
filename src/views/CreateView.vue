<template>
  <h1>Create Game</h1>
      
      
     
  <newPageButton v-bind:text="uiLabels.coop" to="/submitword/" /> <!--newPageutton är en komponent som skapas i Button.vue, den har props: text, to. I text anger man vad som ska stå på knappen. I to anger man den sida man vill skickas till vid klick på knappen -->


  <div>
  
  
    <div>
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <input v-for="(_, i) in answers" 
               v-model="answers[i]" 
               v-bind:key="'answer' + i">
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <input type="number" v-model="questionNumber">
    <button v-on:click="startPoll">
      Start poll
    </button>
    <button v-on:click="runQuestion">
      Run question
    </button>
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    Data: {{ pollData }}
  </div>
</template>

<script>
import newPageButton from '../components/NewPageButton.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
  components: {
    newPageButton
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      pollData: {},
      uiLabels: {},
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("joinPoll", this.pollId);
    },
    startPoll: function () {
      socket.emit("startPoll", this.pollId)
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    }
  }
}
</script>
<style scoped>
.gameMode {
 
  background-color: blue;
  justify-content: center;
  width: 300px;
  align-items: center;
  
}
.coopLink {
 
  color: pink;
  font-size: 70px;
}

</style>
