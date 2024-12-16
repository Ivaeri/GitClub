<template>
    <h1>{{ uiLabels.titlegame }}</h1>
    <h2>{{ uiLabels.wordRecieved }} {{enteredword}}</h2>
    <h3>{{ uiLabels.players }}:</h3>
    <div class="participants-container">
    <div v-for="participant in participants" :key="participant.name" class="participant">
      {{ participant.name }}
    </div>
  </div>
    </template>
    
    <script>
    import io from 'socket.io-client';
    const socket = io("localhost:3000");
    
    export default {
      name: 'lobbyForHost',
      components: {
      },
      data: function () {
        return {
          uiLabels: {},
          enteredword: "",
          pollId: null,
          lang: localStorage.getItem("lang") || "en",
          participants: []
        
  
        }
      },
  
  created: function () {
    this.pollId = this.$route.params.id;
    this.enteredword = this.$route.params.id2;
  
    socket.on("uiLabels", (labels) => {
      this.uiLabels = labels;
      console.log("Mottog UI-labels från servern:", this.uiLabels);
    });
    socket.on( "participantsUpdate", p => {
      this.participants = p;
      
    });
    
  
  /*
  socket.on("sendWord", (data) => {
    // this.enteredword = data.enteredWord; Hämtar ordet från sökvägen istället
    console.log("Mottog ord från servern:", this.enteredword);
  });
  
  socket.on("generateId", (data) => {
    // this.pollId = data.pollId; H��mtar ordet från sökvägen istället
    console.log("Mottog pollId från servern:", this.pollId);
  });
  */
  socket.emit( "getUILabels", this.lang );
  socket.emit("getParticipants", { pollId: this.pollId });
  },
  
  methods: {
  
  }
  }
    </script>
    
    <style scoped>

.participants-container {
    color: black;
    padding: 1em;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
    width: 100%; /* Fyll hela skärmen */
    margin-top: 30em;
}

.participant {
  margin-right: 0.1em; /* Justera avståndet mellan deltagarna */
}
    </style>