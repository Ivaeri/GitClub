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
      <Button
        v-bind:text="uiLabels.sendWord" 
        v-on:click="handleClick">
        Press me
    </Button>
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
        this.pollId = Math.floor(Math.random() * 1000000);
        this.generateId()
        this.sendWord()
        this.$router.push('/hostLobby/' + this.pollId + '/' + this.enteredword);
      },
      sendWord: function () {
        console.log("sending word:" + this.enteredword)
        socket.emit( "sendWord", {enteredword: this.enteredword, pollId: this.pollId} )
      },
      generateId: function () {
        console.log("generated id:" + this.pollId)
        socket.emit( "generateId", this.pollId )
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
  .item button{
    display: flex;
    flex-direction: column;
    height: 4em;
    justify-content: center;
    align-items: center;  
  }


  
  </style>