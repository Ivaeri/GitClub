<template>
  <h1>Co-op mode</h1>
  
  <NewPageButton
  v-bind:text="uiLabels.sendWord" 
  v-bind:to="'/hostLobby/' + pollId"
  v-on:click="handleClick">
  Data: {{ enteredword, pollId }}
  Data: {{ pollId }}
</newPageButton>

  <InputField
   v-bind:label="uiLabels.enterWord"
    v-model="enteredword" 
    placeholder="Enter word here" 
    id="enter-word">
  </InputField>
<!-- Jag tycker det nedanför var onödigt men vill inte ta bort det om resten tycker att det är nice.
  <p>entered word:{{enteredword }}</p> -->
  
  
  </template>
  
  <script>
  import io from 'socket.io-client';
  import NewPageButton from '../components/NewPageButton.vue';
  import InputField from '../components/InputField.vue';
  const socket = io("localhost:3000");
  
  
  
  export default {
    name: 'wordSubmission',
    components: {
      NewPageButton,
      InputField
    },
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
    },
    methods: {
      handleClick: function () {
        this.sendWord()
        this.generateId()
      },
      sendWord: function () {
        console.log("sending word:" + this.enteredword)
        socket.emit( "sendWord", this.enteredword )
      },
      generateId: function () {
        this.pollId = Math.floor(Math.random() * 1000000);
        console.log("generated id:" + this.pollId);
        socket.emit( "generateId", this.pollId );
      }

      
    }
    
  }
  
  
  
  
  </script>
  
  <style scoped>
  
  </style>