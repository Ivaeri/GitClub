<template>
    <div>
      <Logo :text="uiLabels.logo" class="logoStyle"/>
      <h1>
        {{ hostUserName }}{{ uiLabels.idButton }}
      </h1>
      <div class="homebutton">
        <HomeButton :text="uiLabels.goHome"/> 
      </div>
    </div>
      
    <div>
      <div>
        {{ uiLabels.welcome }} {{ this.uiLabels.id }}{{this.pollId}} {{ userName }}!
      </div>
      <div>
        {{ this.uiLabels.awaitingHost1 }}{{ uiLabels.host }} {{ this.uiLabels.awaitingHost2 }}
      </div>
      </div>
    <div v-if="participants.length > 0"  class="participants-list">
      <h2>
        {{ uiLabels.joinedPlayers }}
      </h2>
        <ul>
          <div class="player" v-for="participant in participants" :key="participant.name">
            {{ participant.name }}
          </div>
        </ul>
    </div>

    

</template>
  
  <script>
  import Logo from "@/components/Logo.vue";
  import io from 'socket.io-client';
  import InputField from '../components/InputField.vue';
  import HomeButton from '../components/HomeButton.vue';
  const socket = io(sessionStorage.getItem("dataServer"));
  
  export default {
    name: 'LobbyAll',
    components: {
      Logo, 
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
      this.userName = this.$route.params.id2;
      socket.on( "uiLabels", labels => this.uiLabels = labels );
      socket.on("participantsUpdate", (data) => {
        if (data.pollId === this.pollId) { // Kontrollera om pollId matchar
          this.participants = data.participants; // Uppdatera deltagarlistan
          console.log("Deltagarlistan uppdaterades för pollId:", data.pollId);
        } else {
          console.log("Uppdateringen ignorerades för pollId:", data.pollId);
        }
      });
      socket.on("startPoll", () => this.$router.push("/playerInGame/" + this.pollId + '/' + this.userName) ); 
      socket.on("pollData", data => this.hostUserName = data.userName );
      socket.emit( "joinPoll", this.pollId );
      socket.emit( "getUILabels", this.lang );
      socket.emit("getParticipants", { pollId: this.pollId });
    },
    unmounted() {
  socket.off("startPoll");
},
    

    methods: {
 
 
    }
  }
  </script>
  <style scoped>
 
  .player{
    background-image: url('https://www.svgrepo.com/show/403055/bust-in-silhouette.svg');
    background-repeat: no-repeat;
    background-position: left center;
    background-position-x: 0.5em;
    height: 3em;
    width: 5em;
    background-size: 2em 2em; 
    padding-left: 2.5em; 
    font-size: 2em; 
    margin-bottom: 0.5em; 
    display: flex;
    align-items: center;
    border-radius: 5px; 
    background-color: pink; 
  }

  .participants-list{
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
  }

  @media (max-width: 480px) {
    .player{
      font-size: 1.5em;
    }

    .logoStyle{
      margin-left: 3%;
      margin-top: 0.5em;
    }
  }
</style>