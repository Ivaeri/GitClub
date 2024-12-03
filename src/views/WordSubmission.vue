<template>
    <h1>Co-op mode</h1>
    <div>
        <router-link to="/hostLobby/">
          {{ uiLabels.enterWordHere }}
        </router-link>
    </div>
    
    </template>
    
    <script>
    import io from 'socket.io-client';
    const socket = io("localhost:3000");
    
    export default {
      name: 'CreateView',
      data: function () {
        return {
         
          uiLabels: {},
        }
      },
      created: function () {
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "getUILabels", this.lang );
      }
    }
    
    
    
    </script>
    
    <style scoped>
    
    </style>