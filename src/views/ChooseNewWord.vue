<template>
    <HomeButton :text="uiLabels.goHome"/>
    <h1> {{ uiLabels.newHost }} </h1>
    <h2> {{ uiLabels.chooseNewWord }}</h2>
    <div>
        <InputField
        v-bind:label="uiLabels.enterWord"
        v-model="enteredword" 
        :placeholder="uiLabels.enterWord" 
        id="enter-word">

        </InputField>
    </div>
    <div class="item">
      <Button class="sendWordButton"
        v-bind:text="uiLabels.sendWord" 
        v-on:click="handleClick">
        {{ uiLabels.sendWord }}
      </Button>
    </div>
</template>

<script>
import HomeButton from '../components/HomeButton.vue';
import InputField from '../components/InputField.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");
export default {
    name: 'WinView',
    components: {
        HomeButton,
        InputField
    },
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
            enteredword: "",
            swe_wordlist: new Set()
        }
    },
    created:  async function () {
    this.pollId = this.$route.params.id;
    this.hostName = this.$route.params.id2;
      socket.on("uiLabels", labels => {
      this.uiLabels = labels;
      });
      socket.emit( "getUILabels", this.lang );
      if (this.lang === "sv") {
        const response = await fetch("/server/data/swe_wordlist.txt");
        const text = await response.text();
        this.swe_wordlist = new Set(text.split("\n").map(word => word.trim().toLowerCase()));
        console.log("Svenska ordlistan laddad med", this.swe_wordlist.size, "ord");
        //console.error("Fel vid inläsning av ordlistan:", error); //bort??
    }
    socket.emit("getUILabels", this.lang);
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
        if (!this.hostName.trim()) {
          alert(this.uiLabels.fillName );
          return;
        }
        const validationError = await this.validateWord(this.enteredword, this.lang);
        if (validationError) {
          alert(validationError); 
          return;
        }
        //this.generateId();
        this.startNewGame();
        this.$router.push('/hostLobby/' + this.pollId + '/' + this.enteredword.toUpperCase()+ '/' + this.hostName);
      },

      startNewGame(){
        console.log("startNewGame körs");
        socket.emit("StartNewGame", {pollId: this.pollId, enteredword: this.enteredword.toUpperCase(), hostName: this.hostName});
        socket.emit("newGameHasStarted", this.pollId);
      }
  }}


</script>

<style scoped>
/* Your component styles go here */
</style>