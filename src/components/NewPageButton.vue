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
        background-color: #cf84a9;
        color: white;
        padding: 15px 32px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        width: 30em;
        height: 10em;
    }
 
 
    </style>