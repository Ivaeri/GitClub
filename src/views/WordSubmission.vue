<template>
  <h1>Co-op mode</h1>
  
  <NewPageButton
  v-bind:text="uiLabels.sendWord" 
  to="/hostLobby/"  
  v-on:click="sendWord" >
</newPageButton>

  <InputField
   v-bind:label="uiLabels.enterWord"
    v-model="enteredword" 
    placeholder="example" 
    id="enter-word">
  </InputField>
<p>entered word:{{enteredword }}</p>
  
  
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
        enteredword: "ex: something"
      }
    },
    
    created: function () {
      socket.on( "uiLabels", labels => this.uiLabels = labels );
      socket.emit( "getUILabels", this.lang );
    },
    methods: {
      sendWord: function () {
        socket.emit( "sendWord", {sentWord: this.enteredword} )
      }
      
    }
    
  }
  
  
  
  
  </script>
  
  <style scoped>
  
  </style>