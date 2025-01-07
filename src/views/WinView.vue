<template>
    <header>
        <div class="animate__animated animate__zoomInDown congrats"> {{ uiLabels.win1 }}</div>
        <div class="animate__animated animate__zoomInDown congrats"> {{ uiLabels.win2 }}</div>
    </header>
    <div class="homeButtonContainer">
        <HomeButton :text="uiLabels.goHome"/>
    </div>
    <!-- <header>
        <div class="animate__animated animate__zoomInDown">But at what cost?</div>
    </header> -->
    <button class="restartButton" v-on:click="goToGameLobby">
        Play Again?
    </button>
</template>

<script>
import HomeButton from '../components/HomeButton.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));
export default {
    name: 'WinView',
    components: {
        HomeButton
    },
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
            nailer: "",
            userName: "",
            newGameIsStarted: false
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
        console.log("nailern är", this.nailer);
    });
    socket.on("newGameIsStarted", () => {
        this.newGameIsStarted = true;
        console.log("newGameIsStarted in winview", this.newGameIsStarted);
    });
    socket.emit("getUILabels", this.lang);
    socket.emit("getNailInCoffin", this.pollId);
},
    methods: {
    goToGameLobby: function() {
        console.log( "scoobydoo",this.nailer, this.userName);
        if (this.nailer === this.userName) {
            console.log( "scoobydoo2",this.nailer, this.userName);
            this.$router.push("/ChooseNewWord/" + this.$route.params.id+ "/" + this.$route.params.id2);
        } else {

            if(!this.newGameIsStarted) {
                alert("Hold your horses, the new host is thinking of a word...");
            }
            else {
                socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
                this.$router.push("/lobbyAll/" + this.pollId + "/" + this.$route.params.id2);
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
    top:0;
    font-size: 12em;
    color: pink;
    text-shadow: 2px 2px 4px #000000;
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
    box-shadow: 0 10px 6px rgba(0, 0, 0, 0.2);
}

.restartButton:hover{
    background-color: #a02666;
    transform: rotate(1deg) scale(1.1);
    transition: transform 0.2s ease-in-out;
}
</style>