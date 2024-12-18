<template>
    <div>
      {{ this.uiLabels.id }}{{pollId}}
      <h1>{{ this.uiLabels.titlegame }}</h1>
      <div class="homebutton">
        <HomeButton :text="uiLabels.goHome"/> 
      </div>
      </div>
      <div v-if="!joined">
        {{ this.uiLabels.enterUsername }}
        <InputField 
          v-model="userName" 
          :placeholder="uiLabels.name" 
          id="username"
          @keydown.enter="validateAndParticipate">
        </InputField>
        <button class="joinGameButton" @click="validateAndParticipate">
           {{ uiLabels.participateGame }}
        </button>

      </div>
      <div v-if="joined">
        <p>{{ uiLabels.welcome }} {{ userName }}!
          {{ this.uiLabels.awaitingHost }}
        </p>
        </div>
        <div v-if="participants.length > 0">
          <h2>{{ uiLabels.joinedPlayers }}</h2>
          <ul>
            <div v-for="participant in participants" :key="participant.name">
              {{ participant.name }}
        </div>
  </ul>
</div>

   

</template>
  
  <script>
  import io from 'socket.io-client';
  import InputField from '../components/InputField.vue';
  import HomeButton from '../components/HomeButton.vue';
  const socket = io("localhost:3000");
  
  export default {
    name: 'LobbyAll',
    components: {
      InputField,
      HomeButton
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
      socket.on( "startPoll", () => this.$router.push("/playerInGame/" + this.pollId + '/' + this.userName) ); 
      socket.emit( "joinPoll", this.pollId );
      socket.emit( "getUILabels", this.lang );
    },
    methods: {
      validateAndParticipate() {
        if (!this.userName.trim()) {
          alert(this.uiLabels.fillName);
        }
        else {
          this.participateInPoll();
        }
        socket.emit("getParticipants", { pollId: this.pollId });
  },
      participateInPoll: function () {
        socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
        this.joined = true;
      }
    }
  }
  </script>
