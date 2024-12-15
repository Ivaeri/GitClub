<template>
  <h1>{{uiLabels.coop}}</h1>
  <div class="homebutton">
      <HomeButton :text="uiLabels.goHome"/> 
  </div> 
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
        {{ uiLabels.sendWord }}
      </Button><!-- v-bind:to="'/hostLobby/' + pollId"skickar nu vidare när man klickar ok på varningen, försöker lösa med router push i funktionen och ta vort v-bind.to men kanske måste göra om kanppen, kräver to för att vara clickable -->
    </div>
  </div>
</template>
  
  <script>
  import io from 'socket.io-client';
  import NewPageButton from '../components/NewPageButton.vue';
  import InputField from '../components/InputField.vue';
  import HomeButton from '../components/HomeButton.vue';
  const socket = io("localhost:3000");
  
  
  
  export default {
    name: 'wordSubmission',
    components: {
      NewPageButton,
      InputField,
      HomeButton
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
      async validateWord(word, language) {
        console.log("validateWord körs");
        console.log(word);
        let regex;
        if (language === "sv") {
          regex = /^[a-zA-ZåäöÅÄÖ]+$/; 
        } else {
          regex = /^[a-zA-Z]+$/; 
        }
        if (!regex.test(word)) {
          return this.uiLabels.wordOnlyLetters[language];
        }
        if (word.length < 3) {
          return this.uiLabels.wordTooShort[language];
        }
        if (word.length > 12) {
          return this.uiLabels.wordTooLong[language]; 
          }

        const apiUrl = language === "sv"
          ? `https://api.datamuse.com/words?sp=${word}&lang=sv`
          : `https://api.datamuse.com/words?sp=${word}&lang=en`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (!data.length) {
            return this.uiLabels.wordNotInLexicon[language];
          }
        } catch (error) {
          console.error("API-fel:", error);
          return this.uiLabels.validationApiError[language];
        }
        return null; 
      },
      async handleClick() {
        console.log("handleClick körs");
        const validationError = await this.validateWord(this.enteredword, this.lang);
        if (validationError) {
          alert(validationError); 
          console.log("Validering misslyckades med:", validationError);
          return;
        }
        this.pollId = Math.floor(Math.random() * 1000000);
        this.generateId();
        console.log("Poll ID genererat:", this.pollId);
        this.sendWord();
        this.$router.push('/hostLobby/' + this.pollId + '/' + this.enteredword);
      },
      sendWord: function () {
        console.log("sending word:" + this.enteredword)
        socket.emit( "sendWord", {enteredword: this.enteredword, pollId: this.pollId} )
        console.log("Navigering påbörjad");
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