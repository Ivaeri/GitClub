<template>
    <h1>The lobby for the host</h1>
    <h2>Word received: {{ receivedWord }}</h2>
    
    
    </template>
    
    <script>
    import io from 'socket.io-client';
    const socket = io("localhost:3000");
    
    export default {
      name: 'CreateView',
      data: function () {
        return {
         
          uiLabels: {},
          receivedWord: ""
        }
      },
      created: function () {
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "getUILabels", this.lang );
        socket.on("sendWord", (data) => {
          this.receivedWord = data.sentWord;
        });
      }
    }
    
    
    
    </script>
    
    <style scoped>
    
    </style>