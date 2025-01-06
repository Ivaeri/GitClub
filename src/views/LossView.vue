<template>
    <header>
        <div class="animate__animated animate__zoomInDown gameover">{{ uiLabels.gameOver }}!
            <HangPerson v-bind:wrongGuesses="ammountWrongLetters"/>
        </div>

    </header>
    <div class="homeButtonContainer">
        <HomeButton :text="uiLabels.goHome"/>
    </div>
    <button class="restartButton" v-on:click="goToGameLobby">
        Play Again?
    </button>
</template>

<script>
import HomeButton from '../components/HomeButton.vue';
import io from 'socket.io-client';
import HangPerson from '../components/HangPerson.vue';
const socket = io("localhost:3000");
export default {
    name: 'LossView',
    components: {
        HomeButton,
        HangPerson
    },
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
            ammountWrongLetters: 8
        }
    },
    created: function () {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.id2;
    socket.on("uiLabels", (labels) => {
        this.uiLabels = labels;
    });
    socket.emit("getUILabels", this.lang);
},
    methods: {
    goToGameLobby: function() {
        this.$router.push("/lobbyAll/" + this.pollId);
    }
}}


</script>

<style scoped>

.gameover {

    text-align: center; 
    justify-content: center; 
    align-items: center; 
    height: 100vh; 
    top:0;
    font-size: 9.5em;
    color: rgb(163, 31, 31);
    text-shadow: 2px 2px 4px #000000;
    padding-left: 0.5em;
    padding-top: 0.3em;
}
.restartButton {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 30%;
    height: 10vh;
    background-color: pink;
    color: black;
    font-size: 2em;
    border-radius: 10px;
    cursor: pointer;
}


</style>