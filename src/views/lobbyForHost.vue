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
        class="player">
          {{ participant.name }}
      </p>
    </div>
    <div class="buttonContainer">
      <div v-if="participants.length > 0">
        <button v-on:click="startGame" class="startGameButtonPink">
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
        uiLabels: {},
        lang: localStorage.getItem("lang") || "en",
        participants: [],
        noPlayers: false
      }
    },

created: function () {
  this.pollId = this.$route.params.id;
  this.enteredword = this.$route.params.id2;
  this.hostName = this.$route.params.id3;

  socket.on("uiLabels", (labels) => {
    this.uiLabels = labels;
    });


socket.on("participantsUpdate", (data) => {
  if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
    this.participants = data.participants; // Uppdatera deltagarlistan
    console.log("Deltagarlistan uppdaterades för pollId:", data.pollId);
  } else {
    console.log("Uppdateringen ignorerades för pollId:", data.pollId);
  }
});


socket.emit( "getUILabels", this.lang );
socket.emit("getParticipants", { pollId: this.pollId });
},

methods: {
  startGame: function () {
    socket.emit("startPoll", this.pollId);
    this.$router.push('/inGameForHost/' + this.pollId + '/' + this.enteredword+ '/' + this.hostName);
    console.log("reached startGame with values:", this.pollId, this.enteredword, this.hostName);
    socket.emit("removePollIdFromList", this.pollId);
    socket.emit("getInActivePolls", this.pollId)
    //socket.emit("deletePollId", this.pollId);
   // socket.emit("removeGame", this.pollId)
  },

  /*validateAndParticipate() {
    if (!this.userName.trim()) {
      alert(this.uiLabels.fillName);
    } else {
      this.participateInPoll();
    }
  },
  participateInPoll: function () {
    socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
    this.joined = true;
  },*/
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
    background-color: lightblue;
    z-index: 6;
    margin-left: 2em;
    }

  .buttonContainer{
    position: absolute;
    bottom: 10px;
    right: 10px; 
    font-size: 0.8em;
    margin-right: 1em;

  }

  .startGameButtonPink{
    width: 10em;
    height: 6em;
    background-color: #cf84a9;
    color: white;
    border: none;
    border-radius: 10%;
    cursor: pointer;
    box-shadow: 0 10px 6px rgba(0, 0, 0, 0.2);
  }
  .startGameButtonPink:hover{
 background-color: #a02666;
 transform: rotate(1deg) scale(1.1);
 transition: transform 0.2s ease-in-out;
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
  
  .active1{
    margin-left: 5px;
    display: inline-block;
    color: red
  }

  .player{
    background-image: url('https://www.svgrepo.com/show/403055/bust-in-silhouette.svg');
    background-repeat: no-repeat;
    background-position: left center;
    background-position-x: 0.5em;
    height: 3em;
    width: 5em;
    background-size: 2em 2em; 
    padding-left: 2.5em; 
    font-size: 1.5em; 
    margin-bottom: 0.5em; 
    display: flex;
    align-items: center;
    border-radius: 5px; 
    background-color: pink; 
  }
  
  </style>
