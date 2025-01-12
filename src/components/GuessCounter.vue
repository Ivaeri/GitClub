<template>
    <div class="guess-counter">
        {{ labels.guessesRemaining }}: {{ maxGuesses - wrongGuesses }}
    </div>
</template>
  
<script>
export default {
    name: "GuessCounter",
    props: {
      wrongGuesses: {
        type: Number,
        required: true,
      },
      maxGuesses: {
        type: Number,
        default: 7, 
      },

      labels: { 
        type: Object,
        required: true,
    },

    }, 
    computed: {
        remainingGuesses() {
            return this.maxGuesses - this.wrongGuesses;
        },
    },
};
</script>

<style scoped>
.guess-counter {
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
    color: #88154f;
    margin: 1em 0;
}
</style>