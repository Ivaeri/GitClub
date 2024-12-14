<template>
  <h1>{{ uiLabels.awaitingPlayers }}</h1>
  <h2>{{ uiLabels.wordRecieved }} {{enteredword}}</h2>
  <h2>{{ uiLabels.id }}{{ pollId }}</h2>
  <div>
  <HomeButton /> <!-- Jag försöker skapa en komponent som alltid ska finnas ifall man vill hem alternativt byta språk och fråga om spelregler också på varje sida-->
  </div>
  <button v-on:click="startGame">{{uiLabels.start}}</button>
  </template>
  
  <script>
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
        uiLabels: {},
        enteredword: "",
        pollId: null,
        lang: localStorage.getItem("lang") || "en",
      

      }
    },

created: function () {
  this.pollId = this.$route.params.id;
  this.enteredword = this.$route.params.id2;

  socket.on("uiLabels", (labels) => {
    this.uiLabels = labels;
    console.log("Mottog UI-labels från servern:", this.uiLabels);
  });


socket.on("sendWord", (data) => {
  // this.enteredword = data.enteredWord; Hämtar ordet från sökvägen istället
  console.log("Mottog ord från servern:", this.enteredword);
});

socket.on("generateId", (data) => {
  // this.pollId = data.pollId; Hämtar ordet från sökvägen istället
  console.log("Mottog pollId från servern:", this.pollId);
});

socket.emit( "getUILabels", this.lang );
},

methods: {
  startGame: function () {
    socket.emit("startPoll", this.pollId);
    this.$router.push('/inGameForHost/' + this.pollId + '/' + this.enteredword);
  }
}
}
  </script>
  
  <style scoped>
  
  </style>
