<template>
  <h1>{{uiLabels.coop}}</h1>
  <div class="homebutton">
      <HomeButton :text="uiLabels.goHome"/> 
  </div> 
  <div class="container">
    <div class="item">
      <InputField
          v-model="userName"
          :placeholder="uiLabels.name"
          id="username"
          @enterPressed="handleEnter">
      </InputField>
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
        userName: "",
        uiLabels: {},
        lang: localStorage.getItem( "lang") || "en",
        enteredword: "",
        pollId: 1,
        swe_wordlist: new Set()
      }
    },
    created: async function () {
      socket.on("uiLabels", labels => {
      this.uiLabels = labels;
      });
      socket.emit( "getUILabels", this.lang );
      if (this.lang === "sv") {
        const response = await fetch("/server/data/swe_wordlist.txt");
        const text = await response.text();
        this.swe_wordlist = new Set(text.split("\n").map(word => word.trim().toLowerCase()));
        console.log("Svenska ordlistan laddad med", this.swe_wordlist.size, "ord");
        console.error("Fel vid inläsning av ordlistan:", error); //bort??
    }},
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
        if (language === "sv") {
          if (!this.swe_wordlist.has(word.toLowerCase())) {
            return this.uiLabels.wordNotInLexicon;
          }}
        else {
        // Använd Datamuse API för engelska
        const apiUrl = `https://api.datamuse.com/words?sp=${word}`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          const exactMatch = data.some(entry => entry.word.toLowerCase() === word.toLowerCase());
          if (!exactMatch) {
            return this.uiLabels.wordNotInLexicon;
          }
        } catch (error) {
          console.error("API-fel:", error);
          return this.uiLabels.validationApiError;
        }}
        return null; 
      },
      async handleClick() {
        console.log("handleClick körs");
        if (!this.userName.trim()) {
          alert(this.uiLabels.fillName );
          return;
        }
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
        console.log("sending word:" + this.enteredword.toUpperCase())
        socket.emit( "sendWord", {enteredword: this.enteredword.toUpperCase(), pollId: this.pollId, userName:this.userName} )
        console.log("Navigering påbörjad");
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