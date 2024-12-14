<template>
  <header>
    <h1>{{ uiLabels.awaitingPlayers }}</h1>
    <h2>{{ uiLabels.wordRecieved }} {{enteredword}}</h2>
    <h2 v-if="pollId">{{ uiLabels.id }}{{ pollId }}</h2>
    <h2 v-else>pollID har inte uppdaterats.. </h2>
  </header>
  <div v-if="participants.length > 0">
          <h2>Deltagare:</h2>
          <ul>
            <li v-for="participant in participants" :key="participant.name">
              {{ participant.name }}
            </li>
      </ul>
      </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  import InputField from '../components/InputField.vue';
  const socket = io("localhost:3000");
  
  export default {
    name: 'LobbyForHost',
    components: {
      InputField
    },
    data: function () {
      return {
        userName: "",
        pollId: "inactive poll",
        uiLabels: {},
        joined: false,
        lang: localStorage.getItem("lang") || "en",
        participants: []
      }
    },
    created: function () {
      this.pollId = this.$route.params.id;
      socket.on( "uiLabels", labels => this.uiLabels = labels );
      socket.on( "participantsUpdate", p => {
        console.log("Uppdaterade deltagare:", p);
      this.participants = p });
      socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
      socket.emit( "joinPoll", this.pollId );
      socket.emit( "getUILabels", this.lang );
    },
    methods: {
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
