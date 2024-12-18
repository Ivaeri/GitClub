<template>
  <header>
  <h1>{{ uiLabels.awaitingPlayers }}</h1>
  <h2>{{ uiLabels.wordRecieved }} {{enteredword}}</h2>
  <h2>{{ uiLabels.id }}{{ pollId }}</h2>
  </header>
  <div class="homebutton">
      <HomeButton :text="uiLabels.goHome"/> 
  </div>
  <div class="participantsLobby">
    <h2 class="lobbyHeader">{{ uiLabels.joinedPlayers }}</h2>
    <div class="gridContainer">
      <p v-if="participants.length > 0" v-for="(participant, index) in participants" 
        v-bind:key="participant.name"
        v-bind:style="{gridColumnStart: (index % 3) + 1, gridRowStart: Math.floor(index / 3) + 1}"
        class="playerGrid">
          {{ participant.name }}
      </p>
    </div>
    <div class="buttonContainer">
      <div v-if="participants.length > 0">
        <button v-on:click="startGame" class="startGameButtonGreen">
            {{uiLabels.start}}
        </button>
      </div>
      <div v-else>
        <button  v-on:click="alertErrorMessage" class="startGameButtonGray">
          {{uiLabels.start}}
        </button>
        <p v-if="noPlayers":class="{ active1: noPlayers }"> {{ uiLabels.waitForPlayers }}</p>
      </div>
    </div>
  </div>
      



  </template>
  
  <script>
  import io from 'socket.io-client';
  import HomeButton from '../components/HomeButton.vue';
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
        participants: [],
        noPlayers: false
      }
    },

created: function () {
  this.pollId = this.$route.params.id;
  this.enteredword = this.$route.params.id2;

  socket.on("uiLabels", (labels) => {
    this.uiLabels = labels;
    });


socket.on("sendWord", (data) => {
  // this.enteredword = data.enteredWord; Hämtar ordet från sökvägen istället
});

socket.on("generateId", (data) => {
  // this.pollId = data.pollId; Hämtar ordet från sökvägen istället
});

socket.on( "participantsUpdate", p => {
      this.participants = p });
socket.emit( "getUILabels", this.lang );
socket.emit("getParticipants", { pollId: this.pollId });
},

methods: {
  startGame: function () {
    socket.emit("startPoll", this.pollId);
    this.$router.push('/inGameForHost/' + this.pollId + '/' + this.enteredword);
    socket.emit("deletePollId", this.pollId)
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
  },
  alertErrorMessage(){
  this.noPlayers = true;
}
}
}


  </script>
  
  <style scoped>

  .participantsLobby{
      position: relative;
      font-size: 1.5em;
      padding: 20px;
      border: 1px solid #ccc;
      height: 400px;
      background-color: lightblue

    }

  .buttonContainer{
    position: absolute;
    bottom: 10px;
    right: 10px; 
    font-size: 0.8em;
    margin-right: 1em;

  }

  .startGameButtonGreen{
    width: 10em;
    height: 6em;
    background-color: lightgreen;
    cursor: pointer;
    border-radius: 10%;

  }
  .startGameButtonGray{
    width: 10em;
    height: 6em;
    border-radius: 10%;
  }
  .lobbyHeader{
    text-align: left;
    font-size: 1.5em;
  }
  .gridContainer{
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* skapar 3 kolumner */
    grid-auto-rows: 100px;
    gap: 20px; 
    justify-items: center;
    align-items: center; 
    padding: 20px;

  }
  .playerGrid{
    padding: 10px;
    text-align: center;
    font-size: 1.5em;
    font-style: italic;
  }
  .active1{
    margin-left: 5px;
    display: inline-block;
    color: red

  }
  
  </style>
