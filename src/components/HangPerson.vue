<template>
  <div class="hangperson-container">
    <svg
      width="250"
      height="350"
      viewBox="0 0 250 350"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Stolpen -->
      <line v-if="wrongGuesses >= 2" x1="50" y1="280" x2="50" y2="20" stroke="black" stroke-width="4" />
      <line v-if="wrongGuesses >= 2" x1="50" y1="20" x2="150" y2="20" stroke="black" stroke-width="4" />
      <line v-if="wrongGuesses >= 3" x1="50" y1="50" x2="80" y2="20" stroke="black" stroke-width="4" />
      <line v-if="wrongGuesses >= 3" x1="50" y1="240" x2="80" y2="277" stroke="black" stroke-width="4" />

      <!-- Repet -->
      <line v-if="wrongGuesses >= 4" x1="150" y1="20" x2="150" y2="80" stroke="black" stroke-width="2" />

      <!-- Huvudet -->
      <circle  v-if="wrongGuesses >= 5" cx="150" cy="100" r="20" stroke="black" stroke-width="4" fill="none" />

      <!-- Kroppen -->
      <line  v-if="wrongGuesses >= 6"  x1="150" y1="120" x2="150" y2="200" stroke="black" stroke-width="4" />

      <!-- Armarna -->
      <line  v-if="wrongGuesses >= 6"  x1="150" y1="140" x2="120" y2="170" stroke="black" stroke-width="4" />
      <line  v-if="wrongGuesses >= 6"  x1="150" y1="140" x2="180" y2="170" stroke="black" stroke-width="4" />

      <!-- Benen -->
      <line  v-if="wrongGuesses >= 7" x1="150" y1="200" x2="120" y2="250" stroke="black" stroke-width="4" />
      <line   v-if="wrongGuesses >= 7" x1="150" y1="200" x2="180" y2="250" stroke="black" stroke-width="4" />

      <!-- Kullen -->
      <path v-if="wrongGuesses >= 1"
        d="M 0 300 Q 100 250 200 300"
        fill="none"
        stroke="black"
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "HangPerson",
  props: {
    wrongGuesses: {
      type: Number,
      default: 0,
    },
  },

};
</script>

<style scoped>
.hangperson-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full höjd på viewporten */
}
</style>