<template>  
    <label v-bind:for="id">{{ label }}</label><br>
    <input type="text" v-bind:id="id" v-model="inputString" v-bind:placeholder="placeholder" class="inputField">
    
    </template>
    
    <script>
    
export default {
  name: 'InputField',
  props: {
    label: {
      type: String,
      required: true
    },
    inputString: {
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
  data() {
    return {
      inputString: ""
    }
  },

 
}
    
    </script>
    
    <style scoped>
    .inputField {
        background-color: pink;
        color: blue;
        padding: 15px 32px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
    }
    .inputField:hover {
        background-color: rebeccapurple;
    }
    </style>