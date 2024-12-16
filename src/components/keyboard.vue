<template>
    <div id="keyboard" class="keyboard">
      <div class="row">
        <button class="key" v-for="key in row1" v-bind:key="key" v-on:click="keyPressed(key)">{{ key }}</button>
      </div>
      <div class="row">
        <button class="key" v-for="key in row2" v-bind:key="key" v-on:click="keyPressed(key)">{{ key }}</button>
      </div>
      <div class="row">
        <button class="key" v-for="key in row3" v-bind:key="key" v-on:click="keyPressed(key)">{{ key }}</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Keyboard',
    data() {
      return {
        row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Å'],
        row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
        row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
      };
    },
    methods: {
      keyPressed(key) {
        this.$emit('key-pressed', key);
      }
    }
  };
  </script>
  
  <style scoped>
  .keyboard {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .row {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  
  .key {
    margin: 5px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
