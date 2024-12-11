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
        padding: 15px 32px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
    }

    </style>