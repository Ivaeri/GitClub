<template>
  <div clas="lobby-container">
  <header>
    <Logo :text="uiLabels.logo" class="logostyle"/>
    <div class="homebutton">
      <HomeButton :text="uiLabels.goHome"/> 
   </div> 
    <h1>
      {{ uiLabels.participateGame }}
    </h1>

  </header>
  <h2 v-if="activePolls.length - inActivePolls.length > 0 && !anyIdIsClicked">{{ uiLabels.activeGames }}</h2>
    <div v-if="activePolls.length - inActivePolls.length > 0 && !anyIdIsClicked" class="gamesContainer">
      
      <div v-for="poll in activePolls.filter(p => !inActivePolls.includes(p.pollId))" 
      :key="poll" 
      class="poll-item"
     >
        <button class="poll-button" :class="{ 'clicked-button': chosenPollId === poll.pollId }" @click="joinPoll(poll.pollId)">
          <span class="idPollStyle">
            {{ poll.hostName.name }}
          </span><br/>
          {{ poll.pollId}}
        </button>
      </div>
    </div>
    </div>
    <div class="userNameDiv" v-if="this.anyIdIsClicked">
    <h3>{{ this.uiLabels.enterUsername }}</h3>
      <div class="userNameInput">
        <InputField 
          v-model="userName" 
          :placeholder="uiLabels.name" 
          id="username"
          class="enterGameInput"
          @keydown.enter="validateAndParticipate">
        </InputField>
        <button class="joinGameButton" @click="validateAndParticipate">
           {{ uiLabels.participateGame }}
        </button>
      </div>
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
        <div>
        <h2>{{ uiLabels.noGames }}</h2>
      </div>
    <img :src="this.images[this.currentImageIndex]" class="mrBean"> 
    </div>
  
 
  
</template> 

<script>
import Logo from "@/components/Logo.vue";
import InputField from '../components/InputField.vue';
import io from 'socket.io-client';
import HomeButton from '../components/HomeButton.vue';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'LobbyView',
  components: {
    Logo, 
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
 
    socket.emit("getInActivePolls", this.pollId)
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
    socket.emit("getActivePolls");
    this.startSlideShow();
  },

  beforeDestroy() {
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
        socket.emit( "participateInPoll", {pollId: this.chosenPollId, name: this.userName, wins: 0} )
      }
  
   }
}
</script>
<style scoped>


header h1{
  font-size: 4em;
  text-align: center;
  margin-top: 0.5em;
  margin-bottom: 0em;
}

h2{
  font-size: 2em;
  margin-top: 0.5em;
  text-align: center;
  
}

.idPollstyle { 
  font-size: '1.5em';
  font-weight: 'bold';
  margin-bottom: '5px';
  }

.enterGameInput{
  width: 25em;
  height: 3.5em;
  text-align: center;
  font-size: larger;
  background-color: #D4C2AD;
  color: black;
}
.lobby-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.gamesContainer{
    background-color: #D4C2AD;
    display: inline-block;
    grid-template-columns: repeat(2, 1fr); 
    grid-template-rows: repeat(2, 1fr);
    color:black;
    justify-content: center;
    padding: 1em;
    width: 90vw;
    height: 19em;
    gap: 1em;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0 auto;
    border: none;
    border-radius: 1em; 
}

.gamesContainer::-webkit-scrollbar {
  width: 0.5em; 
}


.gamesContainer::-webkit-scrollbar-thumb {
  background: #a59889; 
  border-radius: 10px; 
  cursor: pointer;
}


.manualJoin {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
  flex-wrap: wrap;
}

.poll-button {
  background-color: #cf84a9; 
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
  box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.2);
  border: none;
}

.poll-button:hover {
  background-color: #975f7b; 
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}



.joinGameButton {
  width: 3.2em;
  height: 2.3em;
  font-size: 1.8em;
  
  background-color: #cf84a9;
  cursor: pointer;
  margin-left: 0.5em;
  border-radius: 10px;
  color: rgb(3, 3, 3);
  border: none;
  color: white;
  box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.2);
  
  }
  .joinGameButton:hover{
    background-color: #975f7b;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
  }

  .mrBean{
    width: 35%;
    height: 35%;
    margin-top: 1em;
    border: 0.2em solid black; 
  }

  .userNameDiv {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .userNameInput {
    display: flex;
    align-items: center;

  }

  
  @media (max-width: 768px) {

  header h1 {
    flex-direction: column;
    align-items: flex-start;
  }
  .enterGameInput{
    width: 8em;
    height: 2em;
  }
  header h1 {
    font-size: 4em;
    text-align: center;
  }

  h2{
  font-size: 2em;
  margin-top: 1em;
  width: 80%;
  margin-left: 10%;
  }

  .homebutton{
    align-self: flex-end;
    margin-right: 0;
  }

  .gamesContainer {
    width: 75vh;
    height: auto;

  }

  .poll-button {
    width: 90%;
    height: auto;
    font-size: 1.2em;
  }

  .joinGameButton {
    width: 6em;
    height: 4em;
  }

  .mrBean {
    width: 75%;
  }
}

@media (max-width: 480px) {
  header h1 {
    font-size: 2em;
    text-align: center;
  }

  h2{
  font-size: 1em;
  margin-top: 1em;
  text-align: center;
}

  .gamesContainer {
    width: 70%; 
    height: auto;
    padding: 0.5em;
  }
  

  .poll-button {
    font-size: 1em;
    padding: 0.5em 1em;
  }

  .joinGameButton {
    font-size: 0.6em;
  }
  .userNameDiv {
    margin-left: 1.2em;
  }
}
</style>
