<template>
    <div>
      {{ this.uiLabels.id }}{{this.pollId}}
      <h1>{{ hostUserName }}{{ uiLabels.idButton }}</h1>
      <div class="homebutton">
        <HomeButton :text="uiLabels.goHome"/> 
      </div>
      </div>
      <div v-if="!joined">
        <h3>{{ this.uiLabels.enterUsername }}</h3>
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
        <div>{{ uiLabels.welcome }} {{ userName }}!</div>
          <div>{{ this.uiLabels.awaitingHost1 }}host {{ uiLabels.host }} {{ this.uiLabels.awaitingHost2 }}</div>
        </div>
        <div v-if="participants.length > 0">
          <h2>{{ uiLabels.joinedPlayers }}</h2>
          <ul>
            <div class="player" v-for="participant in participants" :key="participant.name">
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
        hostUserName: "",
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
      socket.on("pollData", data => this.hostUserName = data.userName );
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
  handleEnter() {
      this.validateAndParticipate();
    },
      participateInPoll: function () {
        socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
        this.joined = true;
      }
    }
  }
  </script>
  <style scoped>
  .joinGameButton {
  width: 6em;
  height: 7em;
  background-color: #cf84a9;
  cursor: pointer;
  margin-left: 1em;
  border-radius: 10px;
  color: white;
  border: none;
  }
  .joinGameButton:hover{
    background-color: #a02666;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
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