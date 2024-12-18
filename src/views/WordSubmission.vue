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
        id="enter-word"
        @keydown.enter="handleClick">
      </InputField>
    </div>
    <div class="item">
      <Button
        v-bind:text="uiLabels.sendWord" 
        v-on:click="handleClick">
        {{ uiLabels.sendWord }}
      </Button>
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
        let regex;
        if (language === "sv") {
          regex = /^[a-zA-ZåäöÅÄÖ]+$/; 
        } else {
          regex = /^[a-zA-Z]+$/; 
        }
        if (!regex.test(word)) {
          return this.uiLabels.wordOnlyLetters;
        }
        if (word.length < 3) {
          return this.uiLabels.wordTooShort;
        }
        if (word.length > 12) {
          return this.uiLabels.wordTooLong; 
        }
        let apiUrl;
        if (language === "sv") {
          // Använd ett API eller lokal ordbok för svenska
          apiUrl = `https://ws.spraakbanken.gu.se/ws/sparv=${word}`;
        } else {
          // Använd Datamuse API för engelska
          apiUrl = `https://api.datamuse.com/words?sp=${word}`;
        }

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          // För svenska API-svar
          if (language === "sv" && (!data || !data.found)) {
            return this.uiLabels.wordNotInLexicon;
          }

          // För Datamuse API-svar (engelska)
          if (language === "en" && (!data.length)) {
            return this.uiLabels.wordNotInLexicon;
          }

        } catch (error) {
          console.error("API-fel:", error);
          return this.uiLabels.validationApiError;
        }
        return null; 
      },
      async handleClick() {
        const validationError = await this.validateWord(this.enteredword, this.lang);
        if (validationError) {
          alert(validationError); 
          return;
        }
        this.pollId = Math.floor(Math.random() * 1000000);
        this.generateId();
        this.sendWord();
        this.$router.push('/hostLobby/' + this.pollId + '/' + this.enteredword.toUpperCase());
      },
      sendWord: function () {
        socket.emit( "sendWord", {enteredword: this.enteredword.toUpperCase(), pollId: this.pollId} )
      },
      generateId: function () {
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