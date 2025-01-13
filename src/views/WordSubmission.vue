<template>
    <div class="headerContainer">
      <div class="homeButton">
        <HomeButton :text="uiLabels.goHome"/> 
      </div>
      <div class="logo">
        <Logo :text="uiLabels.logo" class="logostyle"/>
      </div> 
    </div>
    <h2> {{ uiLabels.enterUsernameAndWord }}</h2>
    <div class="container">
      <div class="item">
        <InputField class="inputField"
            v-model="hostName"
            :placeholder="uiLabels.name"
            id="hostname">
        </InputField>
        <InputField class="inputField"
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
  import InputField from '../components/InputField.vue';
  import HomeButton from '../components/HomeButton.vue';
  const socket = io(sessionStorage.getItem("dataServer"));
  
  
  
  export default {
    name: 'wordSubmission',
    components: {
      Logo, 
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
        socket.emit("setLang", {lang: this.lang, pollId: this.pollId});
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
  .homeButton{
    margin-bottom: 10em;
  }
  .headerContainer {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  padding: 1em; 
}
  h2{
    padding-left: 2em;
  }
  .container {
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center; 
    margin: 2em 2em;
    width: 100%;
  }

  .logo {
  font-size: 2em;
  text-align: center;
  margin: 0.5em auto; 
  position: relative; 
  z-index: 1;
  margin-top: 1em;
}

  .item {
    display: flex;
    flex: 1 1 100%; 
    max-width: 40em;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    }

  .inputField {
  width: 100%;
  max-width: 20em;
  padding: 0.5em;
  margin-bottom: 1em;
  font-size: 2em;
}
  .item button{
  width: 100%;
  max-width: 10em;
  padding: 0.5em;
  font-size: 1em;
  background-color: #cf84a9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
    
  }
  .item button:hover{
    background-color: #a02666;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
  }
  @media (max-width: 768px) {

    h2 {
      font-size: 1em;
    }
    .logo{
      font-size: 1.5em;
    }

    .inputField {
      font-size: 1.5em;
      width: 70%;
    }
}



  
  </style>