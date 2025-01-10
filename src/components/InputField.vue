<template>  
    <!--<label v-bind:for="id"></label><br>-->
    <input type="text"
     v-bind:id="id" 
     v-bind:value="modelValue" 
     v-bind:placeholder="placeholder"
      class="inputField"
      v-on:input="$emit('update:modelValue', $event.target.value)">

      
    
    </template>
    
    <script>
    
export default {
  name: 'InputField',
  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },



 
}
    
    </script>
    
    <style scoped>
  .inputField {
  background-color: pink;
  color: black;
  padding: 0.5em 1em; /* Justera padding för att kompensera för större text */
  text-align: center;
  display: inline-block;
  font-size: 2rem; /* Ändra textstorleken här */
  margin: 0.5em auto;
  cursor: text;
  height: auto; /* Justera höjden för att kompensera för större text */
  width: 100%; /* Justera bredden om nödvändigt */
  max-width: 7000em;
  box-sizing: border-box;
  }

  @media (max-width: 768px) {
  .inputField {
    height: 3em;
    width: 3em; 
  }
}

@media (max-width: 480px) {
  .inputField {
    height: 2em;
    width: 2em;
  }
}

    </style>