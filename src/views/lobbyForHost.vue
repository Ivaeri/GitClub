<template>
  <div class="fixer">
  <header class="info">
    <div class="headerContainer">
      <Logo :text="uiLabels.logo" class="logostyle"/>
  <div class="homebutton">
      <HomeButton :text="uiLabels.goHome"/> 
  </div>
</div>
  <h1 v-if="participants.length < 4">{{ uiLabels.awaitingPlayers }}</h1>
  <h1 v-else>{{ uiLabels.reachedMaxPlayers }}</h1>
  <h2>{{ uiLabels.wordRecieved }} {{enteredword}}</h2>
  <h2>{{ uiLabels.id }}{{ pollId }}</h2>
  </header>
  <div class="makeBlue">
  <div class="participantsLobby">
    <h2 class="lobbyHeader">{{ uiLabels.joinedPlayers }}</h2>
    <div class="gridContainer">
      <p v-if="participants.length > 0" v-for="(participant, index) in participants" 
        v-bind:key="participant.name"
        v-bind:style="{gridColumnStart: (index % 2) + 1, gridRowStart: Math.floor(index / 2) + 1}"
        class="player">
          {{ participant.name }}
      </p>
    </div>
  </div>
    <div class="buttonContainer">
      <div v-if="participants.length > 0">
        <button v-on:click="startGamee" class="startGameButtonPink">
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
</div>
  
      



  </template>
  
  <script>
  import Logo from "@/components/Logo.vue";
  import io from 'socket.io-client';
  import HomeButton from '../components/HomeButton.vue';
  const socket = io(sessionStorage.getItem("dataServer"));
  
  export default {
    name: 'LobbyForHost',
    components: {
      Logo, 
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
  } else {
    console.log("Uppdateringen ignorerades för pollId:", data.pollId);
  }
});


socket.emit( "getUILabels", this.lang );
socket.emit("getParticipants", { pollId: this.pollId });
},

unmounted() {
  socket.off("startPoll");
  socket.off("participantsUpdate");
},


methods: {
  startGamee: function () {
    socket.emit("startPoll", this.pollId);
    this.$router.push('/inGameForHost/' + this.pollId + '/' + this.enteredword+ '/' + this.hostName);
    socket.emit("removePollIdFromList", this.pollId);
    socket.emit("getInActivePolls", this.pollId)
    //socket.emit("deletePollId", this.pollId);
   // socket.emit("removeGame", this.pollId)
   
  },
  

  alertErrorMessage(){
  this.noPlayers = true;
}
}
}


  </script>
  
  <style scoped>

  .participantsLobby{
    font-size: 1.5em;
    padding: 0.1em;
    margin-left: 2em;
    margin-right: 1em;
    }
  
  .makeBlue{
    font-size: 1.34em;
    padding: 10px;
    border-radius: 0.5em;
    background-color: lightblue;
    margin-left: 2em;
    margin-right: 1em;
  }

  .fixer {
    overflow-x: hidden; 
    box-sizing: border-box;
  }

  .buttonContainer{
    font-size: 0.8em;
  }
  .headerContainer {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  padding: 1em;     
  }
  .startGameButtonPink{
    width: 10em;
    height: 6em;
    background-color: #cf84a9;
    color: white;
    border: none;
    border-radius: 1em;
    cursor: pointer;
    box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.2);
    margin-top: 2em;
  }
  .startGameButtonPink:hover{
    background-color: #a02666;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
 }
  .startGameButtonGray{
    width: 10em;
    height: 6em;
    border-radius: 1em;
  }
  .lobbyHeader{
    text-align: left;
    font-size: 1.5em;
    padding: 0;
    margin: 0;
  }
  .gridContainer{
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    grid-template-rows: repeat(2, 1fr); 
    gap: 0.05em; 
    justify-items: center;
    align-items: center; 
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
    height: 2em;
    width: 4em;
    background-size: 1.8em 1.8em; 
    padding-left: 3em; 
    font-size: 1.2em; 
    margin-bottom: 0.5em; 
    display: flex;
    align-items: center;
    border-radius: 0.5em; 
    background-color: pink; 
  }

  @media (max-width: 768px) {
    .player{
      width: 3em;
      height: 0.4em;
      background-size: 1.2em 1.2em;
      font-size: 0.8em;
      gap: 1em;
      padding: 1em 2em;
      margin-left: 0;
    }
    .gridContainer{
      display: inline-table;
      overflow-y: scroll;
      margin-left: 0;
      padding-left: 0;
    }
    .info h1{
      padding: 0.4em;
      font-size: 1.3em;
      margin: 0;
    }
    .info h2{
      font-size: 1em;
      margin: 0.3em;
    }
    .lobbyHeader{
      font-size: 0.5em;
      margin-bottom: 0.1em;
    }
    .buttonContainer{
      position: relative;
      margin-bottom: 1em;
    }
    .logostyle{
    font-size: 1.1em;
    }

    .headerContainer{
      padding: 0.2em;
    }
    .homebutton{
      margin-left: 0;
      padding: 0;
    }

    .startGameButtonPink{
      width: 80%;
      margin-left: 3em;
    }
    .startGameButtonGray{
      width: 80%;
      margin-left: 3em;
    }
    .makeBlue{
      background-color: transparent;
    }
    .participantsLobby{
      margin-left: 0;
      padding-left: 0;
    }
  }
  </style>
