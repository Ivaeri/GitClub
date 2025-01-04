<template> 
    <button v-on:click="handleClick" class="blueButton">
        {{ text }}
    </button>
   
    </template>
   
    <script>
   
    export default {
        name: 'NewPageButton',
        props: {
            text: String,
            to: String
        },
        methods: {
            handleClick: function () {
                this.$router.push(this.to);
            }
        }
    }
   
    </script>
   
    <style scoped>
    .blueButton {
        background-color: pink;
        color: white;
        border-radius: 16px;
        padding: 1em 1em;
        text-align: center;
        display: inline-block;
        font-size: 2em;
        margin: 1em 1em;
        cursor: pointer;
        width: 20em;
        height: 8em;
    }
    .blueButton:hover{
        background-color: #a02666;
        transform: rotate(1deg) scale(1.1);
        transition: transform 0.2s ease-in-out;
    }
 
 
    </style>