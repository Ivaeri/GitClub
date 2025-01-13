<template>
    <header>
        <div class="homeButtonContainer">
        <HomeButton :text="uiLabels.goHome"/>
        </div>
        <Logo :text="uiLabels.logo" class="logostyle"/>
        <div class="animate__animated animate__zoomInDown congrats"> 
            {{ uiLabels.win1 }} 
            <br>
            {{ uiLabels.win2 }}
        </div>
    </header>
    <button class="restartButton" v-on:click="goToGameLobby">
        {{ uiLabels.playAgain }}
    </button>
    <LeaderBoard class="leaderboard-container" :players="leaderboard" :text="uiLabels.leaderBoard"/>
</template>

<script>
import Logo from "@/components/Logo.vue";
import HomeButton from '../components/HomeButton.vue';
import io from 'socket.io-client';
import LeaderBoard from "../components/LeaderBoard.vue";
const socket = io(sessionStorage.getItem("dataServer"));
export default {
    name: 'WinView',
    components: {
        Logo, 
        HomeButton,
        LeaderBoard
    },
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
            nailer: "",
            userName: "",
            newGameIsStarted: false,
            leaderboard: [],
            wins: 0
        }
    },
    created: function () {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.id2;
    socket.on("uiLabels", (labels) => {
        this.uiLabels = labels;
    });
    socket.on("nail", nail => {
        this.nailer = nail;
    });
    socket.on("newGameIsStarted", () => {
        this.newGameIsStarted = true;
    });
    socket.on("leaderboard", (data) => {
        this.leaderboard = data.slice().sort((a, b) => b.wins - a.wins);;
        this.getMyWins(this.leaderboard);
    });
    socket.emit("getUILabels", this.lang);
    socket.emit("getNailInCoffin", this.pollId);
    socket.emit("getLeaderboard", this.pollId);
},
    unmounted() {
        socket.off("nail");
        socket.off("newGameIsStarted");
    },

    methods: {
    goToGameLobby: function() {
        if (this.nailer === this.userName) {
            this.$router.push("/ChooseNewWord/" + this.pollId+ "/" + this.userName);
        } else {

            if(!this.newGameIsStarted) {
                alert(this.uiLabels.waitForNewWord);
            }
            else {
                socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName, wins: this.wins} )
                this.$router.push("/lobbyAll/" + this.pollId + "/" + this.userName);
            }

           
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
.win-view {
    position: relative;
}

.congrats{
    text-align: center;
    justify-content: center; 
    align-items: center; 
    font-size: 6.5em;
    color: #e5aa34;
    text-shadow: 2px 2px 4px #6a4f18;
    word-break: break-all;
}
.restartButton {
    background-color: #cf84a9;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    gap: 7em;
    font-size: 1em;
    transition: transform 0.3s ease;
    width: 15em;
    height: 6em;
    box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.2);
    margin-top: 5em;
    margin-left: 1em;
}

.restartButton:hover{
    background-color: #975f7b;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
}


@media (max-width: 740px)  {
    .congrats{
        font-size: 3.5em;
        margin-left: 0.5em;
    }
    .restartButton{
        width: 10em;
        height: 4em;
    }
    .leaderboard-container {
        justify-content: center; 
        margin-top: 1em;
    }
    
}
@media (max-width: 414px)  {
    .congrats{
        font-size: 2.5em;
        margin-left: 0.5em;
    }
    .restartButton{
        width: 9em;
        height: 4em;
        margin-bottom: 1em;
    }
    
}
</style>