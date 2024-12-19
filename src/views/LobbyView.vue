<template>
  <header>
    <h1>
      {{ uiLabels.participateGame }}
    </h1>
    <div class="homebutton">
      <HomeButton :text="uiLabels.goHome"/> 
   </div> 
  </header>
  <div>
    {{pollId}}
    <div>
      <label> 
        <InputField  
          v-bind:label="uiLabels.enterGamePin"
          v-model="newPollId" 
          :placeholder="uiLabels.id" 
          @keydown.enter="validateAndJoin"> 
        </InputField>
      </label>
      <button class="joinGameButton" @click="validateAndJoin">
        {{ uiLabels.participateGame }}
      </button>
    </div> 
    <div v-if="activePolls.length > 0">
      <h2>{{ uiLabels.activeGames }}</h2>
      <div v-for="poll in activePolls" :key="poll" class="poll-item">
        <button class="poll-button" @click="joinPoll(poll)">
          {{ poll }}
        </button>
      </div>
    </div>
  </div>
</template> 

<script>
import InputField from '../components/InputField.vue';
import io from 'socket.io-client';
import HomeButton from '../components/HomeButton.vue';
const socket = io("localhost:3000");

export default {
  name: 'LobbyView',
  components: {
    InputField,
    HomeButton
  },
  data: function () {
    return {
      userName: "",
      newPollId: "",
      pollId: "inactive poll",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: [],
      activePolls: []
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("activePollsUpdate", (polls) => {
      this.activePolls = polls; });
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );

    socket.on("removePollId", (pollId) => {
      this.activePolls = this.activePolls.filter(poll => poll !== pollId);
      console.log("kom in i socket on i lobbyview", this.activePolls)
    });
    
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
    socket.emit("getActivePolls"); 
    socket.on("activePolls", (polls) => {
        this.activePolls = polls; 
    });
  },
  methods: {
    validateAndJoin() {
    if (!this.newPollId.trim()) {
      alert(this.uiLabels.fillNumber);
    } else {
      this.$router.push('/lobbyAll/' + this.newPollId); /*allt inom citat?*/
    }
  },
  joinPoll(pollId) {
    this.newPollId = pollId; 
    this.$router.push(`/lobbyAll/${pollId}`); 
  },
  /*
    participateInGame: function () {
      socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
      this.joined = true;
    }*/
   }
}
</script>
<style scoped>

header{
  height: 20em;
}

header h1{
  margin-top: 40px;
  font-size: 7em;
}

.enterGameInput{
  width: 40%;
  height: 4em;
  text-align: center;
  font-size: larger;
  background-color: aliceblue;
  color: black;
}

.joinGameButton{
  width: 5%;
  height: 4em;
  background-color: #c888b1;
  cursor: pointer;
}

</style>
