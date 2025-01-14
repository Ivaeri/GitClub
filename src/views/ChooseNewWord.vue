<template>
  <div>
    <Logo :text="uiLabels.logo" class="logostyle"/>
  </div>
    <HomeButton :text="uiLabels.goHome"/>
    <h1 class="congrats"> {{ uiLabels.newHost }} </h1>
    <h2> {{ uiLabels.chooseNewWord }}</h2>
    <div class="chooseWord">
    <div>
        <InputField class="wordInput"
        @keydown.enter="handleClick"
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
    </div>
</template>

<script>
import Logo from "@/components/Logo.vue";
import HomeButton from '../components/HomeButton.vue';
import InputField from '../components/InputField.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));
export default {
    name: 'WinView',
    components: {
        HomeButton,
        InputField,
        Logo
    },
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
            enteredword: "",
            swe_wordlist: new Set(),
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
        socket.emit("reActivatePollId", this.pollId)
        this.startNewGame();
        this.$router.push('/hostLobby/' + this.pollId + '/' + this.enteredword.toUpperCase()+ '/' + this.hostName);
      },

      startNewGame(){
        socket.emit("StartNewGame", {pollId: this.pollId, enteredword: this.enteredword.toUpperCase(), hostName: this.hostName, lang: this.lang});
        socket.emit("newGameHasStarted", this.pollId);
      }
  }}


</script>

<style scoped>
.sendWordButton{
  background-color: #cf84a9;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  gap: 7em;
  font-size: 1em;
  transition: transform 0.3s ease;
  width: 10em;
  height: 5em;
  box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.2);
}

.sendWordButton:hover {
 background-color: #975f7b;
 transform: rotate(1deg) scale(1.1);
 transition: transform 0.2s ease-in-out;
 }

 .congrats {
  padding-left: 1em;
  font-size: 4em;
 }

 .chooseWord {
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 1em;
 }
 
 @media (max-width: 650px) {
  .congrats {
    font-size: 2em;
  }
  .sendWordButton {
    width: 8em;
    height: 4em;
  }
  .chooseWord {
    flex-direction: column;
  }
  .wordInput {
    width: 60vw;
    height: 15vw;
    font-size: 1em;
  }
}
</style>