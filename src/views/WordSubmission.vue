<template>
  <h1>{{uiLabels.coop}}</h1>

  <div class="container">
    <div class="item">
      <InputField
        v-bind:label="uiLabels.enterWord"
        v-model="enteredword" 
        :placeholder="uiLabels.enterWord" 
        id="enter-word">
      </InputField>
    </div>
    <div class="item">
      <NewPageButton
        v-bind:text="uiLabels.sendWord" 
        v-bind:to="'/hostLobby/' + pollId"
        v-on:click="handleClick">
        Data: {{ enteredword}}
        Data: {{ pollId }}
      </newPageButton>
    </div>
  </div>
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
        lang: localStorage.getItem( "lang") || "en",
        enteredword: "",
        pollId: 1

      }
    },
    
    created: function () {
      socket.on("uiLabels", labels => {
      this.uiLabels = labels;
      });
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
        console.log("generated id:" + this.pollId)
        socket.emit( "generateId", this.pollId )
        socket.emit("getActivePolls");
      }


    }
    
  };
  
  </script>
  
  <style scoped>

  .container {
    display: flex;
    justify-content: center; 
    align-items: center; 
  }

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    }


  
  </style>