<template>
    <div>
      {{ this.uiLabels.id }}{{pollId}}
      <h1>{{ this.uiLabels.titlegame }}</h1>
      <div v-if="!joined">
        {{ this.uiLabels.enterUsername }}
        <InputField 
          v-model="userName" 
          :placeholder="uiLabels.name" 
          id="username">
        </InputField>
        <button class="joinGameButton" @click="validateAndParticipate">
           {{ uiLabels.participateGame }}
        </button>

      </div>
      <div v-if="joined">
        <p>{{ uiLabels.welcome }} {{ userName }}!
          {{ this.uiLabels.awaitingHost }}
        </p>
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
