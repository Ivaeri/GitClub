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
  <h2 v-if="activePolls.length - inActivePolls.length > 0 && !anyIdIsClicked">{{ uiLabels.activeGames }}</h2>
    <div v-if="activePolls.length - inActivePolls.length > 0 && !anyIdIsClicked" class="gamesContainer">
      
      <div v-for="poll in activePolls.filter(p => !inActivePolls.includes(p.pollId))" 
      :key="poll" 
      class="poll-item"
     >
        <button class="poll-button" :class="{ 'clicked-button': chosenPollId === poll.pollId }" @click="joinPoll(poll.pollId)">
          <span :style="{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '5px' }">
            {{ poll.hostName }}
          </span><br/>
          {{ poll.pollId}}
        </button>
      </div>
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
    <h2  v-if="activePolls.length - inActivePolls.length > 0 && !anyIdIsClicked">{{ uiLabels.manualEnter }}</h2>
    <div class="manualJoin" v-if="activePolls.length - inActivePolls.length > 0 && !anyIdIsClicked">
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
    <div v-if="activePolls.length - inActivePolls.length == 0" class="noGames">
        
        <h2>{{ uiLabels.noGames }}</h2>
    <img :src="this.images[this.currentImageIndex]" class="mrBean"> 
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
      hostName: "",
      newPollId: "",
      pollId: "inactive poll",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: [],
      activePolls: [],
      chosenPollId: "",
      anyIdIsClicked: false,
      inActivePolls: [],
      images: ["/img/OIP.jpg", "/img/84e9f62ff454a1c4b1b82841f0d6aef2.jpg", "/img/image-w1280.webp", "/img/EeVGxbTU8AA9718.jpg"
        ],
      currentImageIndex: 0
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("activePollsUpdate", (polls) => {
      this.activePolls = polls; });
    socket.on("inActivePolls", (polls) => {
      this.inActivePolls = polls; });
    /*
    socket.on("removePollId", (oldPollId) => {
      this.activePolls = this.activePolls.filter(poll => poll.pollId !== oldPollId)});

      socket.on("removeGameFromList", (oldPollId) => {
        this.activePolls = this.activePolls.filter(poll => poll.pollId !== oldPollId)});
    */
    socket.emit("getInActivePolls", this.pollId)
     

    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
    socket.emit("getActivePolls");
    this.startSlideShow();
  },

  beforeDestroy() {
    // Stoppa bildspelet när komponenten förstörs
    this.stopSlideshow();
  },

  methods: {

  startSlideShow() {
    this.slideshowInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 5000); // Byt bild var tredje sekund
  },
  stopSlideshow() {
    clearInterval(this.slideshowInterval);
  },

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
    const poll = this.activePolls.find(poll => poll.pollId === this.chosenPollId);
    socket.emit("getParticipants", { pollId: this.chosenPollId });
    socket.once("participantsUpdate", (data) => { // Lyssna på uppdateringar av deltagarlistan endast en gång
      if (data.pollId === this.chosenPollId) {
        this.participants = data.participants;
        console.log(this.hostName, "host")
        if (!this.userName.trim()) {
          alert(this.uiLabels.fillName);
        } else if (this.participants.some(participant => participant.name === this.userName) || this.userName === poll.hostName) {
          alert(this.uiLabels.nameTaken);
        } else {
          this.participateInPoll();
          this.$router.push('/lobbyAll/' + this.chosenPollId + '/' + this.userName); 
        }
      }
    });
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
  height: 2em;
  text-align: center;
  font-size: larger;
  background-color: pink;
  color: black;
  margin: 1em;
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
    border: 0.2em solid black; 
    border-radius: 10px; 
}

.gamesContainer::-webkit-scrollbar {
  width: 0.5em; 
}

.gamesContainer::-webkit-scrollbar-track {
  background: #f1f1f1; 
  border-radius: 10px; 
}

.gamesContainer::-webkit-scrollbar-thumb {
  background: #c888b1; 
  border-radius: 10px; 
}

.gamesContainer::-webkit-scrollbar-thumb:hover {
  background: hotpink; 
}


.manualJoin {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
  flex-wrap: wrap;
}

.poll-button {
  background-color: pink; 
  color: black; 
  font-size: 1.5em; 
  padding: 1em 2em; 
  border: 0.1em solid black; 
  border-radius: 5px; 
  cursor: pointer; 
  margin: 1em auto; 
  text-align: center; 
  width: 70%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1em;
  box-sizing: 1em;
  box-shadow: 0 10px 6px rgba(0, 0, 0, 0.2);
}

.poll-button:hover {
  background-color: hotpink; 
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.clicked-button {
  background-color: rgb(149, 42, 95); 
  border: 0.2em solid blue; 
}

.joinGameButton {
  width: 6em;
  height: 5em;
  background-color: #cf84a9;
  cursor: pointer;
  margin-left: 1em;
  border-radius: 10px;
  color: white;
  border: none;
  box-shadow: 0 10px 6px rgba(0, 0, 0, 0.2);
  margin: 1em;
  }
  .joinGameButton:hover{
    background-color: #a02666;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
  }

  .mrBean{
    width: 70em;
    height: auto;
    margin-top: 1em;
    border: 0.2em solid black; 
  }


</style>
