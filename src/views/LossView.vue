<template>
    <div class="fix">
    <div> 
        <Logo :text="uiLabels.logo" class="logostyle"/>
    </div>
    <HomeButton/>
    <div class="animate__animated animate__zoomInDown gameover">
        <div class="gameOverText">
            {{ uiLabels.gameOver }}
        </div>
        <p> {{ uiLabels.correctWord }}{{ this.word.word }}</p>
        <HangPerson class="hangPerson" v-bind:wrongGuesses="ammountWrongLetters" />
        <button class="restartButton" v-on:click="goToGameLobby">
            {{ uiLabels.playAgain }}
        </button>
    </div>
    <LeaderBoard class="leaderBoard" :players="leaderboard" :text="uiLabels.leaderBoard"/>
</div>   
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
            word: "",
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
    });
    socket.on("leaderboard", (data) => {
        this.leaderboard = data.slice().sort((a, b) => b.wins - a.wins);
        this.getMyWins(this.leaderboard);
    });
    socket.on("word", (word) => {
        this.word = word;
    });
    socket.emit("getWord", this.pollId);
    socket.emit("getLeaderboard", this.pollId);
    socket.emit("getUILabels", this.lang);
},
    methods: {
    goToGameLobby: function() {
        if(!this.newGameIsStarted) {
                alert(this.uiLabels.waitForNewWord);
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

.fix {
    overflow-y: hidden; 
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 100vh;
  }

.gameover {
    text-align: center; 
    font-size: 4em;
    color: #a21414;
    text-shadow: 2px 2px 4px #410101;
    transform: translateY(-1em);
    margin-top: 1em;

}
.gameover p {
    font-size: 0.3em;
    color: black;
    margin-block-start: 0.3em;
    margin-block-end: 0.3em;
    text-shadow: none;
}
.restartButton {
    margin: auto;
    margin-top: auto;
    width: 30%;
    height: 10vh;
    background-color: #cf84a9;
    color:rgb(255, 255, 255);
    font-weight: bold;
    font-size: 0.4em;
    border-radius: 10px;
    cursor: pointer;
}

.restartButton:hover {
    background-color: #975f7b;
}
.hangPerson{
    margin:auto;
    scale: 0.9;
}
.leaderBoard {
  position: relative;
  top: -4.7em;
}


@media (max-width: 1040px) {
    .restartButton {
        width: 40%;
        height: 10vh;
    }
    .gameover {
        font-size: 4em;
    }  
    .hangPerson{
        scale: 0.9;
    }

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
    .leaderBoard{
        margin-top: 0.5em;
    }

}


</style>