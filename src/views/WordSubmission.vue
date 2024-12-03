<template>
    <h1>Co-op mode</h1>
    <div class="grid">

        
       
          
            <input type="text" v-bind:placeholder="uiLabels.enterWordHere" v-model="word" class="textField">
       
       
        
            <router-link to="/hostLobby/">
                <div class="link">
                    <img src= "/img/check-mark-icon-green-0.png">  
                </div>
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
    .grid {
        display: grid;
        grid-template-columns: repeat(2,600px);
        grid-gap: 20px;
    }
    .grid > img{

    }
    .textField {
        background-color: lightblue;
        width: 20em;
        height: 10em;
    }
    .link {
        background-color: lightblue;
        width: 6em;
        height: 6em;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .link > img {
        width: 80%;
        height: 80%;
        position: absolute;
    }
   
   
    </style>