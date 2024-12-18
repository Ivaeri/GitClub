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
  padding: 10px 20px; /* Justera padding för att kompensera för större text */
  text-align: center;
  display: inline-block;
  font-size: 24px; /* Ändra textstorleken här */
  margin: 4px 2px;
  cursor: text;
  height: 3em; /* Justera höjden för att kompensera för större text */
  width: 20em; /* Justera bredden om nödvändigt */
}

    </style>