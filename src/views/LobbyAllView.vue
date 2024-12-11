<template>
    <div>
      {{ this.uiLabels.id }}{{pollId}}
      <h1>{{ this.uiLabels.titlegame }}</h1>
      <div v-if="!joined">
        {{ this.uiLabels.enterUsername }}
        <InputField  
          v-model="userName" 
          placeholder="skriv ditt namn här" 
          id="username">
        </InputField>
        <button v-on:click="participateInPoll">
          {{ this.uiLabels.participateGame }}
        </button>
      </div>
      <div v-if="joined">
        <p>{{ this.uiLabels.awaitingHost }}</p>
        {{ participants }}
    </div>
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  import InputField from '../components/InputField.vue';
  const socket = io("localhost:3000");
  
  export default {
    name: 'LobbyView',
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
      socket.on( "participantsUpdate", p => this.participants = p );
      socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
      socket.emit( "joinPoll", this.pollId );
      socket.emit( "getUILabels", this.lang );
    },
    methods: {
      validateAndJoin() {
    if (!this.PollId.trim()) {
      alert('Du måste skriva in ett spel-ID för att gå med!');
    } else {
      this.$router.push('/lobbyAll/' + this.PollId);
    }
  },
      participateInPoll: function () {
        socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
        this.joined = true;
      }
    }
  }
  </script>
