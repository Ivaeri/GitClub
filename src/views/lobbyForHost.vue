<template>
    <h1>{{ uiLabels.awaitingPlayers }}</h1>
    <h2>{{ uiLabels.wordRecieved }} {{enteredword}}</h2>
    <h2>{{ uiLabels.id }}{{ pollId }}</h2>
    
    
    </template>
    
    <script>
    import io from 'socket.io-client';
    const socket = io("localhost:3000");
    
    export default {
      name: 'CreateView',
      data: function () {
        return {
          uiLabels: {},
          enteredword: "",
          pollId: 1
        }
      },
      created: function () {
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "getUILabels", this.lang );

        socket.on("sendWord", (data) => 
          this.enteredword = data.enteredWord);
          
        socket.on("generateId", (data) => 
        this.pollId = data.pollId);
        console.log("pollId in lobbyforhost " + this.pollId)
      }
         
    }
    
    
    
    </script>
    
    <style scoped>
    
    </style>