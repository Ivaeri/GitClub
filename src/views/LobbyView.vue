<template>
  <header>
    <h1>
      {{ uiLabels.participateGame }}
    </h1>
  </header>
  <div>
    {{pollId}}
    <div>
      <label> 
        <InputField  
          v-bind:label="uiLabels.enterGamePin"
          v-model="newPollId" 
          :placeholder="uiLabels.id" >
        </InputField>
    </label>
    <button class="joinGameButton" @click="validateAndJoin">
     {{ uiLabels.participateGame }}
   </button>
      <!----<input type="text" v-model="userName" placeholder="Ditt namn">
      <button v-on:click="participateInGame">
        {{ this.uiLabels.participateInGame }}
      </button>
    </div>
    <div v-if="joined">
      <p>Waiting for host to start game</p>
      {{ participants }} -->
    </div> 
  </div>
</template>

<script>
import InputField from '../components/InputField.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'LobbyView',
  components: {
    InputField
  },
  data: function () {
    return {
      userName: "",
      newPollId: "",
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
    if (!this.newPollId.trim()) {
      alert(this.uiLabels.fillNumber);
    } else {
      this.$router.push('/lobbyAll/' + this.newPollId);
    }
  },
    participateInGame: function () {
      socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
      this.joined = true;
    }
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

</style>
