<template>
  <div class="headerContainer">
  <div class="homeButton">
      <HomeButton :text="uiLabels.goHome"/> 
  </div>
  <div class="logo">
    <Logo />
  </div> 
  </div>
  <div class="container">
    <div class="item">
      <InputField
          v-model="hostName"
          :placeholder="uiLabels.name"
          id="hostname">
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
  import Logo from "@/components/Logo.vue";
  import io from 'socket.io-client';
  import NewPageButton from '../components/NewPageButton.vue';
  import InputField from '../components/InputField.vue';
  import HomeButton from '../components/HomeButton.vue';
  const socket = io(sessionStorage.getItem("dataServer"));
  
  
  
  export default {
    name: 'wordSubmission',
    components: {
      Logo, 
      NewPageButton,
      InputField,
      HomeButton
    },
    data: function () {
      return {
        hostName: "",
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
        if (!this.hostName.trim()) {
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
        this.$router.push('/hostLobby/' + this.pollId + '/' + this.enteredword.toUpperCase()+ '/' + this.hostName);
      },
      sendWord: function () {
        socket.emit( "setWordAndGenerateGameInfo", {enteredword: this.enteredword.toUpperCase(), pollId: this.pollId, hostName:this.hostName} )
      },
      generateId: function () {
        socket.emit( "generateId", this.pollId )
      }
    }
  };
  
  </script>
  
  <style scoped>


  body {
    overflow-x: hidden; 
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .headerContainer {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  padding: 1em; 
}
  h1{
    font-size: 5rem;
    margin: 0.6em;
  }
  .container {
    overflow-x: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center; 
    margin: 2em 2em;
    padding-left: 10%;
    padding-right: 10%;
    width: 100%;
  }

  .logo {
  font-size: 2em;
  padding: 0em;
  text-align: center;
  margin: 0.5em auto; 
  position: relative; 
  z-index: 1;
  margin-top: 1em;
}


  .item {
    flex: 1 1 100%; 
    max-width: 40em;
    flex-direction: column;
    justify-content: center;
    }
  .item button{
    flex: 1 1 40%;
    display: flex;
    flex-direction: column;
    width: 10em;
    height: 8em;
    max-width: 9rem;
    max-height: 10rem;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #cf84a9;
    border-radius: 0.5em;
    margin: 2em;
    padding: 0.5em;
    color: white;
    border: none;
    box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.2);
  }
  .item button:hover{
    background-color: #a02666;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
  }
  @media (max-width: 768px) {
  .container {
    flex-direction: column; /* Lägg elementen i en kolumn */
    margin: 1em; /* Mindre marginaler */
  }

  .item {
    flex: 1 1 100%; /* Varje element tar upp hela bredden */
    max-width: none; /* Ta bort maxbreddsbegränsning */
    margin: 0.5em 0; /* Mindre mellanrum mellan element */
    width: 100%;
  }
  .logo{
    position: relative;
    margin-top: 1em;
    margin-bottom: 0.1em;
    font-size: 1.5em;
    margin-top: 0.6em;
  }
  .homeButton{
    position: relative;
    margin-top: 0em;
    margin-bottom: 1em;
  }
  .inputField {
    width: 90%; /* Fyll 90% av skärmen */
    font-size: 1.2rem; /* Mindre textstorlek */
    padding: 0.8em; /* Anpassa padding för mobil */
  }

  .item button {
    width: 82%; /* Gör knapparna lika breda som skärmen */
    max-width: none; /* Ingen maxbreddsbegränsning */
    padding: 0.8em; /* Anpassa padding */
    margin-right: 30em;
  }
  
}


  
  </style>