<template>
  <div clas="lobby-container">
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
        <button class="poll-button" :class="{ 'clicked-button': chosenPollId === poll.pollId }" @click="joinPoll(poll.pollId)">
          <span :style="{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '5px' }">
            {{ poll.hostName }}
          </span><br/>
          {{ poll.pollId}}
        </button>
      </div>
    </div>
    <div class="userNameDiv" v-if="this.anyIdIsClicked">
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
    <h2>{{ uiLabels.manualEnter }}</h2>
    <div class="manualJoin">
      <label for="pollIdInput"> 
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
      activePolls: [],
      chosenPollId: "",
      anyIdIsClicked: false
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("activePollsUpdate", (polls) => {
      this.activePolls = polls; });
    socket.on( "participantsUpdate", p => this.participants = p );
    /*
    socket.on("removePollId", (oldPollId) => {
      this.activePolls = this.activePolls.filter(poll => poll.pollId !== oldPollId)});
*/
      socket.on("removeGameFromList", (oldPollId) => {
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
      this.chosenPollId = this.newPollId; 
    }
  },

  joinPoll(pollId) {
    this.chosenPollId = pollId; 
    this.anyIdIsClicked = true;
  },
  validateAndParticipate() {
        if (!this.userName.trim()) {
          alert(this.uiLabels.fillName);
        }
        else {
          this.participateInPoll();
          this.$router.push('/lobbyAll/' + this.chosenPollId + '/' + this.userName); 
        }
        socket.emit("getParticipants", { pollId: this.chosenPollId });
  },
  handleEnter() {
      this.validateAndParticipate();
    },
      participateInPoll: function () {
        socket.emit( "participateInPoll", {pollId: this.chosenPollId, name: this.userName} )
        //this.joined = true;
      }
  
   }
}
</script>
<style scoped>

header{
  height: 7em;
}

header h1{
  margin-top: 0em;
  font-size: 6em;
}

header h2{
  margin-top: 1em;
}
.enterGameInput{
  width: 8em;
  height: 1.5em;
  text-align: center;
  font-size: larger;
  background-color: pink;
  color: black;
  margin-top: 1em;
}
.lobby-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.gamesContainer{
  background-color: lightblue;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10em, 1fr));
    color:black;
    justify-content: center;
    padding: 1em;
    width: 90vw;
    height: 19em;
    gap: 1em;
    overflow-y: auto;
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
  width: 5em;
  height: 4em;
  background-color: #cf84a9;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 1em;
  margin-left: 1em;
}
.joinGameButton:hover{
background-color: #a02666;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
  }

.manualJoin {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
  flex-wrap: wrap;
}

.poll-button {
  background-color: pink; /* Gör knapparna rosa */
  color: black; /* Textfärg */
  font-size: 1.5em; /* Gör knapparna stora */
  padding: 1em 2em; /* Lägg till padding för att göra knapparna större */
  border: 0.1em solid black; /* Ta bort kantlinje */
  border-radius: 5px; /* Lägg till rundade hörn */
  cursor: pointer; /* Ändra muspekaren till en hand */
  margin: 1em auto; /* Centrera knappen horisontellt */
  text-align: center; /* Centrera texten i knappen */
  width: 70%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1em;
  box-sizing: 1em;
}

.poll-button:hover {
  background-color: hotpink; /* Ändra färg vid hovring */
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.clicked-button {
  background-color: rgb(149, 42, 95); /* Ändra färg för den senast klickade knappen */
  border: 0.2em solid blue; /* Lägg till en kantlinje för den senast klickade knappen */
}

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


</style>
