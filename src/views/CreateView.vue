<template>
  <header>
    <h1>{{uiLabels.createGame}}</h1>
  </header>
  <div class="homebutton">
      <HomeButton :text="uiLabels.goHome"/>
  </div>
  <div class="newpageContainer">
    <newPageButton v-bind:text="uiLabels.coop" to="/submitword/"/> 
  </div>  
 </template>
 
 
 <script>
 import newPageButton from '../components/NewPageButton.vue';
 import HomeButton from '../components/HomeButton.vue';
 import io from 'socket.io-client';
 const socket = io("localhost:3000");
 
 
 export default {
  name: 'CreateView',
  components: {
    newPageButton,
    HomeButton
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

 .newpageContainer{
  margin-top: 10em;
 }

 h1{
  font-size: 9em;
 }
 </style>