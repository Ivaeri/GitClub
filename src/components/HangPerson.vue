<template>
  <div class="hangperson-container" :style="{transform: `scale(${scale})`}">
    <svg
      width="250"
      height="310"
      viewBox="0 0 250 310" 
      xmlns="http://www.w3.org/2000/svg"
    >

      <!-- Kullen -->
      <path v-if="wrongGuesses >= 1"
        d="M 0 300 Q 100 250 200 300"
        fill="none"
        stroke="black"
        stroke-width="4"
        stroke-linecap="round"
      />
      <!-- Stolparna -->
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
      <line v-if="wrongGuesses >= 7" x1="150" y1="200" x2="120" y2="250" stroke="black" stroke-width="4" />
      <line v-if="wrongGuesses >= 7" x1="150" y1="200" x2="180" y2="250" stroke="black" stroke-width="4" />

      <!-- Ögonen -->
      <line v-if="wrongGuesses >=7" x1="140" y1="95" x2="147" y2="102" stroke="black" stroke-width="3" />
      <line v-if="wrongGuesses >=7" x1="147" y1="95" x2="140" y2="102" stroke="black" stroke-width="3" />
      <line v-if="wrongGuesses >=7" x1="155" y1="95" x2="162" y2="102" stroke="black" stroke-width="3" />
      <line v-if="wrongGuesses >=7" x1="162" y1="95" x2="155" y2="102" stroke="black" stroke-width="3" />

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
    scale: {
      type: Number,
      default: 1,
    },
  },

};
</script>

<style scoped>
.hangperson-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2em;

}
</style>