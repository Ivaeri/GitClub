<template>
  <header>
  <h1>{{ uiLabels.awaitingPlayers }}</h1>
  <h2>{{ uiLabels.wordRecieved }} {{enteredword}}</h2>
  <h2>{{ uiLabels.id }}{{ pollId }}</h2>
  </header>
  <div class="homebutton">
      <HomeButton :text="uiLabels.goHome"/> 
  </div>
  <div v-if="participants.length > 0">
          <h2>{{ uiLabels.joinedPlayers }}</h2>
          <ul>
            <li v-for="participant in participants" :key="participant.name">
              {{ participant.name }}
            </li>
      </ul>
  </div>
  <button v-on:click="startGame">{{uiLabels.start}}</button>
  </template>
  
  <script>
  import io from 'socket.io-client';
  import HomeButton from '../components/HomeButton.vue';
  import InputField from '../components/InputField.vue';
  const socket = io("localhost:3000");
  
  export default {
    name: 'LobbyForHost',
    components: {
      HomeButton
    },
    data: function () {
      return {
        userName: "",
        enteredword: "",
        pollId: null,
        uiLabels: {},
        joined: false,
        lang: localStorage.getItem("lang") || "en",
      

        participants: []
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

socket.on( "participantsUpdate", p => {
        console.log("Uppdaterade deltagare:", p);
      this.participants = p });
socket.emit( "getUILabels", this.lang );
socket.emit("getParticipants", { pollId: this.pollId });
},

methods: {
  startGame: function () {
    socket.emit("startPoll", this.pollId);
    this.$router.push('/inGameForHost/' + this.pollId + '/' + this.enteredword);
  },

  validateAndParticipate() {
    if (!this.userName.trim()) {
      alert(this.uiLabels.fillName);
    } else {
      this.participateInPoll();
    }
  },
  participateInPoll: function () {
    socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
    this.joined = true;
  }
}
}


  </script>
  
  <style scoped>
  
  </style>
