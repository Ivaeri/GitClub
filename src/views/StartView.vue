<template>
  <header>
    <div v-bind:class="['hamburger', {'close': !hideNav}]"
         v-on:click="toggleNav">
    </div>
    <div class="logo" >
      {{ uiLabels.titlegame }}
    </div>
    <div class="buttonsContainer">
  <button class="languageSwitchButton" v-on:click="switchLanguage">
    <img :src="lang === 'sv' ? '/img/uk.png' : '/img/svenskflagga.jpg'" alt="flag" class="languageFlag">
    <span class="languageText">{{ uiLabels.languagebox }}</span>
  </button>

<div class="gameRules">
  <h5 v-on:click="showGameRules">
    <p v-if="gameRules"> {{ uiLabels.HideGameRules }}</p>
    <p v-else> {{ uiLabels.GameRules }}</p>
  </h5>
  <div v-if="gameRules" class="animate__animated animate__backInUp">
    <ul>
      <li v-for="rule in currentGameRules" v-bind:key="rule">{{ rule }}</li>
    </ul>
  </div>
</div>
</div>
  </header>

  <!-- Hängda gubben -->
  <HangPerson :wrongGuesses="wrongGuesses" :scale="0.5" />


    <div class="create-join">
      <router-link to="/submitword/">
      <button>{{ uiLabels.createGame }}</button>
    </router-link>
    <router-link to="/lobby/">
      <button>{{ uiLabels.participateGame }}</button>
    </router-link>
  </div>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
import gameRules from '/server/gamerules.json';
import HangPerson from "@/components/HangPerson.vue";

const socket = io("192.168.166.109:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav,
    HangPerson
  },
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      gameRules: false,
      currentGameRules: [],
      wrongGuesses: 0,
    }
  },
  created: function () {
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.emit("getUILabels", this.lang);
    this.loadGameRules();
  },
  mounted() {
    const maxGuesses = 7;
    let delay = 250;
    const interval = setInterval(() => {
      if (this.wrongGuesses < maxGuesses) {
        this.wrongGuesses++;
        console.log(`wrongGuesses: ${this.wrongGuesses}`); // Debug-logg
      } else {
        clearInterval(interval);
      }
    }, delay);
  },
  methods: {
    showGameRules: function () {
      this.gameRules = !this.gameRules;
    },
    switchLanguage: function () {
      if (this.lang === "en") {
        this.lang = "sv";
      } else {
        this.lang = "en";
      }
      this.loadGameRules();
      localStorage.setItem("lang", this.lang);
      socket.emit("getUILabels", this.lang);
    },
    toggleNav: function () {
      this.hideNav = !this.hideNav;
    },
    loadGameRules() {
      if (this.lang === "sv") {
        this.currentGameRules = gameRules.gameRules_sv;
      } else {
        this.currentGameRules = gameRules.gameRules_en;
      }
    }
  }
}
</script>

<style scoped>
header {
  position: relative;
  width: 100%;
  height: 25em;
  display: grid;
  grid-template-columns: 2em auto;
  align-items: center;
}


.create-join {
  background-color: transparent;
  display: flex;
  color: white;
  border: none;
  gap: 3em;
  border-radius: 10px;
  transition: background-color 0.3s ease;
  margin: auto;
  text-align: left;
  width: fit-content;
  margin-bottom: 10em;
}

.create-join button {
  background-color: #cf84a9;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  gap: 7em;
  font-size: 1em;
  transition: transform 0.3s ease;
  width: 20em;
  height: 10em;
  box-shadow: 0 10px 6px rgba(0, 0, 0, 0.2);
}

.create-join button:hover {
  background-color: #a02666;
  transform: rotate(1deg) scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.buttonsContainer {
  display: flex; /* Byt till flex för enkel justering av horisontell layout */
  justify-content: flex-end; /* Placera knapparna till höger */
  align-items: center; /* Centrera vertikalt */
  gap: 1em; /* Skapa avstånd mellan knapparna */
  position: absolute;
  top: 1em; /* Avstånd från toppen */
  right: 1em; /* Avstånd från högerkanten */
}
.languageFlag{
  height: 1.5em;
}

.languageSwitchButton {
  display: flex;
  width: 5.2em;
  height: 2.5em;
  right: 0;
  background-color: #cf84a9;
  border-radius: 10%;
  cursor: pointer;
  color: white;
  display: flex;
  font-size: 2em;
  box-sizing: border-box;
  padding: 0;
  align-items: center;
  text-align: center;
  justify-content: center;
  border: none;
  box-shadow: 0 10px 6px rgba(0, 0, 0, 0.2);
}

.languageSwitchButton:hover {
  background-color: #a02666;
  transform: rotate(1deg) scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.gameRules {
  width: 8em;
  height: 1em;
  color: white;
}

.gameRules h5 {
  cursor: pointer;
  background-color: #cf84a9;
  border-radius: 5px;
  padding: 0.3em;
  box-shadow: 0 10px 6px rgba(0, 0, 0, 0.2);
}

.gameRules h5:hover {
  background-color: #a02666;
  transform: rotate(1deg) scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.gameRules div {
  position: absolute;
  background-color: pink;
  margin-left: 5px;
  border-radius: 10%;
}


.languageText{
    min-width: 2.5em;
    text-align: center;
  }

.swedishbutton {
  background-image: url("/img/svenskflagga.jpg");
}

.englishbutton {
  background-image: url("/img/uk.png");
}

@media screen and (max-width: 50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close::before {
    content: "✕";
    color: rgb(60, 35, 35);
  }
  .hide {
    left: -12em;
  }
}
</style>
