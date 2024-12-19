<template>
  <header>
    <div v-bind:class="['hamburger', {'close': !hideNav}]"
         v-on:click="toggleNav">
    </div>
    <div class="logo" >
      <img src="/img/hangman.jpg">
      {{ uiLabels.titlegame}}
    </div>
    <div class="languagecontainer">
      <button v-bind:class="lang === 'sv' ? 'englishbutton' : 'swedishbutton'" v-on:click="switchLanguage"> </button>
      <div class="switchLanguageDiv" v-on:click="switchLanguage">
        {{ uiLabels.languagebox }}
      </div>
      <div class="gameRules">
        <h5 v-on:click="showGameRules">
          <p v-if="gameRules"> {{ uiLabels.HideGameRules }}</p>
          <p v-else> {{ uiLabels.GameRules }}</p>
        </h5>
        <div v-if="gameRules" class="animate__animated animate__backInUp">
          <ul>
              <li v-for="rule in currentGameRules" v-bind:key="rule" >{{ rule }}</li>
          </ul>
        </div>
      </div>
    </div>
      <div class="homebutton">
        <HomeButton :text="uiLabels.goHome"/>
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
 
 </template>
 
 
 <script>
 import ResponsiveNav from '@/components/ResponsiveNav.vue';
 import io from 'socket.io-client';
 import gameRules from '/server/gamerules.json';
 import HomeButton from '../components/HomeButton.vue';
 const socket = io("localhost:3000");
 
 
 export default {
  name: 'StartView',
  components: {
    ResponsiveNav,
    HomeButton
  },
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true,
      gameRules: false,
      currentGameRules: []
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
    this.loadGameRules();
  },
  methods: {
    showGameRules: function() {
      this.gameRules = !this.gameRules;

    },
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      this.loadGameRules();
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    },
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    },
    loadGameRules(){
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
    height: 350px;
    display: grid;
    grid-template-columns: 2em auto;
 
 
  }
  .logo {
    font-family: 'Sue Ellen Francisco', cursive;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 5rem;
    color: rgb(4, 16, 131);
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
 transform: rotate(10deg) scale(1.1);
 }
  .languagecontainer{
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    position: absolute;
    width: 240px;
    height: px;
    margin-top: 20px;
    margin-right: 10px;
    right: 0px;
  }
  .switchLanguageDiv{
    grid-row : 1;
    grid-column: 2;
    width: 80px;
    height: 30px;
    right: 0;
    margin-top: 15px;
    background-color: lightgrey;
    border-radius: 10%;
    padding-top: 7px;
    cursor: pointer;
    border: 2px solid black
 
 
  }
  .gameRules{
    grid-row: 2;
    grid-column: 1/ span 2;
    width: 7em;
    height: 1em;
    color:black;
 
 
  }
  .gameRules h5{
    cursor: pointer;
    background-color: #cf84a9;
    border-radius: 40%
  }
.gameRules h5:hover {
  background-color: #a02666
}

  .gameRules div{
    position: absolute;
    background-color: pink;
    margin-left: 5px;
    grid-row: 3;
    grid-column: 1;
    border-radius: 10%;
  }
  .gameRules ul{
    padding-right: 10px;
  }
  .gameRules li{
    padding-top: 10px;
  }
  .languagecontainer button{
    grid-row : 1;
    grid-column: 1;
    height: 60px;
    width: 140px;
    background-size: cover;
    background-position: center;
    left: 0;
    cursor: pointer;
    border-radius: 10%;
  }
  .swedishbutton{
    background-image: url("/img/svenskflagga.jpg");
  }
  .englishbutton{
    background-image: url("/img/uk.png");
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