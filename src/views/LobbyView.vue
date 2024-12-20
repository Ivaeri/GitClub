<template>
  <header>
    <h1>
      {{ uiLabels.participateGame }}
    </h1>
    <div class="homebutton">
      <HomeButton :text="uiLabels.goHome"/> 
   </div> 
  </header>
  <h2>{{ uiLabels.activeGames }}</h2>
    <div v-if="activePolls.length > 0" class="gamesContainer">
      
      <div v-for="poll in activePolls" :key="poll" class="poll-item">
        <button class="poll-button" @click="joinPoll(poll.pollId)">
          {{ poll.pollId}}
          {{ poll.hostName }}
        </button>
      </div>
    </div>
    <div class="manualJoin">
      <h2>{{ uiLabels.manualEnter }}</h2>
      <label for="pollIdInput"> 
        {{ uiLabels.enterGamePin }}
        <InputField 
        id="newPollIdInput"
        class="enterGameInput"
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
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("activePollsUpdate", (polls) => {
      this.activePolls = polls; });
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on("removePollId", (oldPollId) => {
      this.activePolls = this.activePolls.filter(poll => poll.pollId !== oldPollId)});

    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
    socket.emit("getActivePolls");
  },
  methods: {
    validateAndJoin() {
    if (!this.newPollId.trim() || !this.activePolls.some(poll => poll.pollId === this.newPollId)) {
      alert(this.uiLabels.fillNumber);
    } else {
      this.$router.push('/lobbyAll/' + this.newPollId); 
    }
  },
  joinPoll(pollId) {
    this.$router.push('/lobbyAll/' + pollId); 
  },
   }
}
</script>
<style scoped>

header{
  height: 10em;
}

header h1{
  margin-top: 0.2em;
  font-size: 7em;
}

header h2{
  margin-top: 1em;
}
.enterGameInput{
  width: 8em;
  height: 2em;
  text-align: center;
  font-size: larger;
  background-color: pink;
  color: black;
  margin-top: 1em;
}

.gamesContainer{
    color:black;
    padding: 1em;
    width: 90%;
    height: 30em;
    overflow-y: scroll;
    overflow-x: hidden;
    margin: 0 auto;
    border: 0.2em solid black; /* Lägg till en svart kantlinje */
  border-radius: 10px; /* Lägg till rundade hörn */
}
/* Anpassa scrollbaren */
.gamesContainer::-webkit-scrollbar {
  width: 0.5em; /* Bredd på scrollbaren */
}

.gamesContainer::-webkit-scrollbar-track {
  background: #f1f1f1; /* Färg på scrollbarsens spår */
  border-radius: 10px; /* Rundade hörn på spåret */
}

.gamesContainer::-webkit-scrollbar-thumb {
  background: #c888b1; /* Färg på scrollbarsens tumme */
  border-radius: 10px; /* Rundade hörn på tummen */
}

.gamesContainer::-webkit-scrollbar-thumb:hover {
  background: hotpink; /* Färg på scrollbarsens tumme vid hovring */
}

.joinGameButton{
  width: 5%;
  height: 4em;
  background-color: #c888b1;
  cursor: pointer;
}

.poll-button {
  background-color: pink; /* Gör knapparna rosa */
  color: black; /* Textfärg */
  font-size: 1.5em; /* Gör knapparna stora */
  padding: 1em 2em; /* Lägg till padding för att göra knapparna större */
  border: 0.1em solid black; /* Ta bort kantlinje */
  border-radius: 5px; /* Lägg till rundade hörn */
  cursor: pointer; /* Ändra muspekaren till en hand */
  display: block; /* Gör knappen till ett blockelement */
  margin: 1em auto; /* Centrera knappen horisontellt */
  text-align: center; /* Centrera texten i knappen */
  width: 50%;
}

.poll-button:hover {
  background-color: hotpink; /* Ändra färg vid hovring */
}

</style>
