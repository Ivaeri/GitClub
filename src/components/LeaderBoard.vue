<template>
    <div class="leaderboard">
        <h1>{{ text}}</h1>
        <ol>
            <li v-for="player in players.slice(0,3)">
                {{ player.name }}: {{ player.wins }}p
            </li>
        </ol>
    </div>
</template>

<script>
export default {
    name: 'LeaderBoard',
    props: {
        players: {
            type: Array,
            default: () => [],
        },
        text: {
            type: String,
            default: "",
        },
    },
};
</script>

<style scoped>
    .leaderboard {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .leaderboard ol {
        list-style-type: none;
        padding: 0;
        text-align: center;
        margin-top: 0;
    }

    .leaderboard li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #ffffff;
        padding: 10px 20px;
        margin-bottom: 5px;
        border-radius: 15px;
        height: 10px; 
    }
    .leaderboard li:nth-child(1) {
        background-color: rgb(219, 186, 1);
    }

    .leaderboard li:nth-child(2) {
        background-color: silver;
    }

    .leaderboard li:nth-child(3) {
        background-color: rgb(205, 127, 50); 
        }

</style>