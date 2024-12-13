<template>
  <h1>{{ uiLabels.awaitingPlayers }}</h1>
  <h2>{{ uiLabels.wordRecieved }} {{enteredword}}</h2>
  <h2 v-if="pollId">{{ uiLabels.id }}{{ pollId }}</h2>
  <h2 v-else>pollID har inte uppdaterats.. </h2>
  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
    name: 'CreateView',
    socket,
    beforeDestroy() {
  socket.disconnect(); //försökte förhindra att massa sockets skapas, inte lyckats
  console.log("Socket frånkopplad.");
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
 

socket.on("uiLabels", (labels) => {
  this.uiLabels = labels;
  console.log("Mottog UI-labels från servern:", this.uiLabels);
});

socket.on("sendWord", (data) => {
  this.enteredword = data.enteredWord;
  localStorage.setItem("enteredWord", this.enteredword); // Spara lokalt så att det inte försvinner vid siduppdateringar
  console.log("Mottog ord från servern:", this.enteredword);
});

socket.on("generateId", (data) => {
  this.pollId = data.pollId;
  localStorage.setItem("pollId", this.pollId); // Sparar lokalt så att det inte försvinner vid siduppdateringar
  console.log("Mottog pollId från servern:", this.pollId);
});

socket.emit( "getUILabels", this.lang );
},
beforeDestroy() { //försökte förhindra att massa sockets skapas, inte lyckats
  this.cleanupSocket();
},

methods: {
cleanupSocket() { //försökte förhindra att massa sockets skapas, inte lyckats
    socket.off("uiLabels", this.updateUILabels);
    socket.off("sendWord", this.updateEnteredWord);
    socket.off("generateId", this.updatePollId);
  },


}
}
  </script>
  
  <style scoped>
  
  </style>
