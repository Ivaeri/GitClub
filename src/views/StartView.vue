<template>
  <header>
    <Logo :text="uiLabels.logo" :isStartPage="true"/>
    <div v-bind:class="['hamburger', {'close': !hideNav}]"
         v-on:click="toggleNav">
    </div>
    <div class="languagecontainer">
      <button v-bind:class="lang === 'sv' ? 'englishbutton' : 'swedishbutton'" v-on:click="switchLanguage"> </button>
      <div class="switchLanguageDiv" v-on:click="switchLanguage">
        {{ uiLabels.languagebox }}
      </div>
    </div>
    <div class="gameRules">
        <button v-on:click="showGameRules">
          <p v-if="gameRules"> {{ uiLabels.HideGameRules }}</p>
          <p v-else> {{ uiLabels.GameRules }}</p>
        </button>
        <div v-if="gameRules" class="animate__animated animate__backInUp">
          <ul>
            <li v-for="rule in currentGameRules" v-bind:key="rule">{{ rule }}</li>
          </ul>
        </div>
      </div>
  </header>

  <main class="main-content">
    <!-- Hängda gubben -->
    <HangPerson :wrongGuesses="wrongGuesses" :scale="0.7" />


    <div class="create-join">
      <router-link to="/submitword/">
        <button>{{ uiLabels.createGame }}</button>
      </router-link>
      <router-link to="/lobby/">
        <button>{{ uiLabels.participateGame }}</button>
      </router-link>
    </div>
  </main>
</template>

<script>
import Logo from "@/components/Logo.vue";
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
import gameRules from '/server/gamerules.json';
import HangPerson from "@/components/HangPerson.vue";
//sessionStorage.setItem("dataServer", "192.168.0.182:3000")
sessionStorage.setItem("dataServer", "localhost:3000")
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'StartView',
  components: {
    Logo,
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
  height: 15vh;
  display: grid;
  grid-template-columns: auto;
  align-items: center;
}

.main-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh; 
  margin-top: 3.5em; 
}

.create-join {
  display: flex;
  flex-direction: row;
  gap: 2em;
  justify-content: center; 
  align-items: center; 
  margin-top: 2em; 
  background-color: transparent;
  color: white;
  border: none;
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
  width: 20vw;
  height: 13vw;
  box-shadow: 0 10px 6px rgba(0, 0, 0, 0.2);
}

.create-join button:hover {
  background-color: #a02666;
  transform: rotate(1deg) scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.languagecontainer {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  position: absolute;
  width: 15em;
  height: 10em;
  margin-top: 10px;
  right: 0px;
  top: 0em;
}

.switchLanguageDiv {
  grid-row: 1;
  grid-column: 2;
  width: 4em;
  height: 1.7em;
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
}

.gameRules {
  margin-left: 5px;
  width: 20%;
  height: 90%;
  color: white;
}

.gameRules button {
  cursor: pointer;
  background-color: #cf84a9;
  color:white;
  border-radius: 5px;
  padding: 0.3em;
  margin-left:5em;
  width: 10vw;
}

.gameRules button:hover {
  background-color: #a02666;
  transform: rotate(1deg) scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.gameRules div {
  background-color: pink;
  margin-left: 5px;
  border-radius: 10%;
  margin-left:2em;
}

.gameRules ul {
  padding-right: 10px;
}

.gameRules li {
  padding-top: 10px;
}

.languagecontainer button {
  grid-row: 1;
  grid-column: 1;
  height: 4em;
  width: 8em;
  background-size: cover;
  background-position: center;
  left: 0;
  cursor: pointer;
  border-radius: 10%;
}

.swedishbutton {
  background-image: url("/img/svenskflagga.jpg");
}

.englishbutton {
  background-image: url("/img/uk.png");
}

@media screen and (max-width: 930px) {
  .create-join button{
    width: 30vw;
    height: 20vw;
  }
  .languagecontainer {
    width: 12vw;
    height: 8vw;
  }

}

@media screen and (max-width: 900px) {
  .gameRules {
    margin-top: 10em;
    margin-right:4em;
    width: 20%;
    min-width: 200px;
    z-index: 100;
    
  }
  .gameRules div {
    width: 150px;
    height: 300px;
    overflow: scroll;
  }

  
}

@media screen and (max-width: 630px) {
  .create-join {
    flex-direction: column;
    gap: 2em;
  }

  .create-join button {
    margin-top: 2em;
    width: 45vw;
    height: 25vw;
  }

  .switchLanguageDiv{
    display: none;
    width: 0;
    height: 0;
  }

  .languagecontainer button {
    width: 17vw;
    height: 8vw;
    grid-column: 2;
  }

  .gameRules {
    margin-top: 22em;
    margin-right:4em;
    width: 20%;
    min-width: 200px;
    z-index: 100;
    
  }

  .gameRules button {
    width: 20vw;
    height:10vw;
    min-width: 90px;
    min-height: 55px;
    z-index: 100;

  }
  .main-content{
    margin-top: 7em;
  }
  .gameRules div {
    width: 150px;
    height: 200px;
    overflow: scroll;
  }


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
  .languagecontainer {
    width: 10em;
    height: 7em;
  }

}
</style>