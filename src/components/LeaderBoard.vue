<template>
    <div class="leaderboard">
        <h1>{{ text}}</h1>
        <ol>
            <li v-for="player in players.slice(0,3)">
                {{ player.name }}: {{ player.wins }}
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
    }

    .leaderboard li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #ffffff;
        padding: 10px 20px;
        margin-bottom: 10px;
        border-radius: 20px;
        height: 10px; 
    }
    .leaderboard li:nth-child(1) {
        background-color: gold;
    }

    .leaderboard li:nth-child(2) {
        background-color: silver;
    }

    .leaderboard li:nth-child(3) {
        background-color: #cd7f32; 
        }

</style>