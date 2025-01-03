<template>
    <header>
        <div class="animate__animated animate__zoomInDown congrats">Congratulations!</div>
        <div class="animate__animated animate__zoomInDown congrats">You Won 🎉</div>
    </header>
    <div class="homeButtonContainer">
        <HomeButton :text="uiLabels.goHome"/>
    </div>
    <!-- <header>
        <div class="animate__animated animate__zoomInDown">But at what cost?</div>
    </header> -->

</template>

<script>
import HomeButton from '../components/HomeButton.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");
export default {
    name: 'WinView',
    components: {
        HomeButton
    },
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en"
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
    hyphens: auto;
    white-space: normal;
}

</style>