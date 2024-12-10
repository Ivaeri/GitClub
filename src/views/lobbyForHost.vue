<template>
    <h1>The lobby for the host</h1>
    <h2>Word received: {{enteredword}}</h2>
    
    
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
        }
      },
      created: function () {
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "getUILabels", this.lang );
        socket.on("sendWord", (data) => 
          this.enteredword = data.enteredWord);
      }
    }
    
    
    
    </script>
    
    <style scoped>
    
    </style>