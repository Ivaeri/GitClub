<template>
    <div class="leaderboard">
        <h1>Leaderboard:</h1>
        <ul>
            <li v-for="player in players" :key="player.id">
                {{ player.name }}: {{ player.wins }}
            </li>
        </ul>
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
    },
};
</script>

<style scoped>
    .leaderboard {
        text-align: center;
    }

    .leaderboard ul {
        list-style-type: none;
        padding: 0;
    }

    .leaderboard li {
        margin: 5px 0;
    }
</style>