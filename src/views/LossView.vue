<template>
    <header>
        <div class="homeButtonContainer">
            <HomeButton :text="uiLabels.goHome"/>
        </div>
        <Logo />
    </header>
    <div class="animate__animated animate__zoomInDown gameover">{{ uiLabels.gameOver }}!
        <HangPerson class="hangPerson" v-bind:wrongGuesses="ammountWrongLetters" />
        <button class="restartButton" v-on:click="goToGameLobby">
            {{ uiLabels.playAgain }}
        </button>
    </div>
    <LeaderBoard :players="leaderboard" :text="uiLabels.leaderBoard"/>
</template>

<script>
import Logo from "@/components/Logo.vue";
import HomeButton from '../components/HomeButton.vue';
import io from 'socket.io-client';
import HangPerson from '../components/HangPerson.vue';
import LeaderBoard from "../components/LeaderBoard.vue";
const socket = io(sessionStorage.getItem("dataServer"));
export default {
    name: 'LossView',
    components: {
        Logo, 
        HomeButton,
        HangPerson,
        LeaderBoard
    },
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
            ammountWrongLetters: 8,
            newGameIsStarted: false,
            wins: 0,
            leaderboard: [],
        }
    },
    created: function () {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.id2;
    socket.on("uiLabels", (labels) => {
        this.uiLabels = labels;
    });
    socket.on("newGameIsStarted", () => {
        this.newGameIsStarted = true;
        console.log("newGameIsStarted in winview", this.newGameIsStarted);
    });
    socket.on("leaderboard", (data) => {
        this.leaderboard = data.slice().sort((a, b) => b.wins - a.wins);
        this.getMyWins(this.leaderboard);
        console.log("leaderboard", data);
    });
    socket.emit("getLeaderboard", this.pollId);
    socket.emit("getUILabels", this.lang);
},
    methods: {
    goToGameLobby: function() {
        if(!this.newGameIsStarted) {
                alert("Hold your horses, the new host is thinking of a word...");
            }
            else {
                socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName, wins: this.wins} )
                this.$router.push("/lobbyAll/" + this.pollId + '/' + this.userName);
            }   

    },
    getMyWins: function(leaderboard) {
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].name === this.userName) {
                this.wins = leaderboard[i].wins;
            }
        }
    }

}}


</script>

<style scoped>

.gameover {
    text-align: center; 
    font-size: 5em;
    color: rgb(163, 31, 31);
    text-shadow: 2px 2px 4px #000000;
}
.restartButton {
    margin: auto;
    margin-top: auto;
    width: 30%;
    height: 10vh;
    background-color: pink;
    color:rgba(0, 0, 0, 0.8);
    font-weight: bold;
    font-style: italic;
    font-size: 0.4em;
    border-radius: 10px;
    cursor: pointer;
}

.hangPerson{
    margin:auto;
    scale: 0.9;
}

@media (max-width: 700px) {

    .restartButton {
        width: 50%;
        height: 10vh;
    }
    .gameover {
        font-size: 3em;
    }  
    .hangPerson{
        scale: 0.8;
    } 
}


</style>