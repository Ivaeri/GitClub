<template>
  <header>
    <div v-bind:class="['hamburger', {'close': !hideNav}]" 
         v-on:click="toggleNav">
    </div>
    <div class="logo">
      <img src="/img/hangman.jpg">
      {{ uiLabels.titlegame}}
    </div>
    <div class="languagecontainer">
      <button v-bind:class="lang === 'sv' ? 'englishbutton' : 'swedishbutton'" v-on:click="switchLanguage"> </button>
      <div v-on:click="switchLanguage">
        {{ uiLabels.languagebox }}
      </div>
    </div>
  </header>
    <div class="create-join">
      <router-link to="/create/">
      <button>{{ uiLabels.createGame }}</button>
      </router-link>
      <router-link to="/lobby/">
      <button>{{ uiLabels.participateGame }}</button>
      </router-link>
    </div>


    <ResponsiveNav v-bind:hideNav="hideNav">
      <button v-on:click="switchLanguage">
        {{ uiLabels.changeLanguage }}
      </button>
      <router-link to="/create/">
       {{ uiLabels.createPoll }}
      </router-link>
      <a href="">
       {{ uiLabels.about }}
     </a>
      <a href="">FAQ</a>
    </ResponsiveNav>
    <label>
      Write poll id: 
      <input type="text" v-model="newPollId">
    </label>
    <router-link v-bind:to="'/lobby/' + newPollId">
      {{ uiLabels.participatePoll }}
    </router-link>


</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    },
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    }
  }
}
</script>
<style scoped>
  header {
    position: relative;
    background-color: white;
    width: 100%;
    height: 350px;
    display: grid;
    grid-template-columns: 2em auto;

  }
  .logo {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 5rem;
    color: black;
    padding-top: 2.5em;
  }
  .logo img {
    height:5rem;
    vertical-align: bottom;
    margin-right: 0.5rem; 
  }
  .hamburger {
    color:white;
    width:1em;
    display: flex;
    align-items: center;
    justify-content: center;
    padding:0.5rem;
    top:0;
    left:0;
    height: 2rem;
    cursor: pointer;
    font-size: 1.5rem;
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
  background-color: #d63384; 
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer; 
  gap: 7em;
  font-size: 1em;
  transition: background-color 0.3s ease;
  width: 20em;
  height: 10em;
  }
.create-join button:hover {
background-color: #a02666; 
}
  .languagecontainer{
    position:absolute;
    width: 240px;
    height: 60px;
    margin-top: 20px;
    margin-right: 10px;
    right: 0;
  }
  .languagecontainer div{
    position: absolute;
    width: 80px;
    height: 30px;
    right: 0;
    margin-top: 15px;
    margin-right: 5px;
    background-color: lightgrey;
    border-radius: 10%;
    padding-top: 7px;
    cursor: pointer;
    border: 2px solid black

  }
  .languagecontainer button{
    position: absolute;
    height: 60px;
    width: 140px;
    background-size: cover;
    background-position: center;
    left: 0;
    cursor: pointer;
    border-radius: 10%;
  }
  .swedishbutton{
    background-image: url("public/img/svenskflagga.jpg");
  }
  .englishbutton{
    background-image: url("public/img/uk.png");
  }

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hamburger::before {
    content: "☰";
    color:black;
  }
  .close::before {
    content: "✕";
    color:black;
  }
  .hide {
    left:-12em;
  }
}
</style>
