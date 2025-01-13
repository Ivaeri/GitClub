<template>
  <header>
    <Logo :text="uiLabels.logo" :isStartPage="true" class="logo"/>
    <div class="languagecontainer">
      <button v-bind:class="lang === 'sv' ? 'englishbutton' : 'swedishbutton'" v-on:click="switchLanguage"> </button>
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
import io from 'socket.io-client';
import gameRules from '/server/gamerules.json';
import HangPerson from "@/components/HangPerson.vue";
sessionStorage.setItem("dataServer", "172.20.10.2:3000")
//sessionStorage.setItem("dataServer", "localhost:3000")
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'StartView',
  components: {
    Logo,
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
  min-height: 70vh; 
  margin-top: 3.5em;
}

.create-join {
  display: flex;
  gap: 2em;
  background-color: transparent;
  transition: background-color 0.3s ease;
  margin: auto;
  width: fit-content;
  margin-bottom: 10em;
}

.create-join button {
  background-color: #cf84a9;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 2em;
  transition: transform 0.3s ease;
  width: 20vw;
  height: 13vw;
  box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.2);
}

.create-join button:hover {
  background-color: #975f7b;
  transform: rotate(1deg) scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.languagecontainer {
  position: absolute;
  margin-top: 10px;
  right: 5%;
  top: 1em;
}



.gameRules {
  margin-left: 0.5em;
  width: 20%;
  height: 90%;
  color: white;
  margin-top: 2em;
}

.gameRules button {
  cursor: pointer;
  background-color: #cf84a9;
  color:white;
  border-radius: 5px;
  padding: 0.3em;
  margin-left:5em;
  width: 10vw;
  border: none;
  box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.2);
}

.gameRules button:hover {
  background-color: #975f7b;
  transform: rotate(1deg) scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.gameRules div {
  background-color: #D4C2AD;
  margin-left: 0.5em;
  border-radius: 1em;
  margin-left: 2em;
  margin-top: 1em;
  position: absolute;
  width: 23em;
}

.gameRules ul {
  padding-right: 10px;
}

.gameRules li {
  padding-top: 10px;
}

.languagecontainer button {
  height: 4em;
  width: 8em;
  background-size: cover;
  background-position: center;
  left: 0;
  cursor: pointer;
  border-radius: 0.5em;
  box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.2);
  border: none;
}

.languagecontainer button:hover {
  transform: rotate(1deg) scale(1.1);
  transition: transform 0.2s ease-in-out;
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
    margin-top: 3em;
    margin-right: 4em;
    width: 20%;
    min-width: 200px;
    z-index: 1000000;
    
  }
  .gameRules div {
    width: 20em;
    height: 30em;
    overflow: scroll;
    font-size: 0.8em;
  }

  .gameRules button {
    width: 50%
  }

  
}

@media screen and (max-width: 630px) {
  .create-join {
    flex-direction: column;
  }

  .create-join button {
    width: 35vw;
    height: 17vw;
    margin-bottom: 1em;
    font-size: 1em;
  }

  .languagecontainer button {
    width: 17vw;
    height: 8vw;
    border-radius: 0.32em;
    margin-left: 3em;
  }

  .gameRules {
    margin-top: 2em;
    margin-right: 1em;
    width: 20%;
    min-width: 200px;
    z-index: 100;
    padding-bottom: 1em;
  }

  .gameRules button {
    width: 40%;
    height: 40%;
    min-width: 2em;
    min-height: 1.5em;
    z-index: 100;
    font-size: 0.6em;
    padding-top: 0;
    margin-top: 1em;
    margin-left: 0;
  }

  .gameRules div {
    margin-top: 0.5em;
    width: 12em;
    height: 18em;
    overflow: scroll;
    font-size: 0.85em;
  }


}

@media screen and (max-width: 50em) {
  .languagecontainer {
    width: 10em;
    height: 7em;
  }

}
</style>