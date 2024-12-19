<template>
    <header>
        <div class="animate__animated animate__zoomInDown gameover">{{ uiLabels.gameOver }}!
            <HangPerson v-bind:wrongGuesses="ammountWrongLetters"/>
        </div>

    </header>
    <div class="homeButtonContainer">
        <HomeButton :text="uiLabels.goHome"/>
    </div>
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
    socket.on("uiLabels", (labels) => {
        this.uiLabels = labels;
    });
    socket.emit("getUILabels", this.lang);
}
}


</script>

<style scoped>

.gameover {

    text-align: center; 
    justify-content: center; 
    align-items: center; 
    height: 100vh; 
    top:0;
    font-size: 10em;
    color: rgb(163, 31, 31);
    text-shadow: 2px 2px 4px #000000;
}



</style>