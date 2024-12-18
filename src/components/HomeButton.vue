<template>
    <div class="toppbar">
      <RouterLink to="/">
        <button class="homeButton">
          {{ text }}
        </button> 
      </RouterLink>
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io('http://localhost:3000'); // Justera URL efter behov
  
  export default {
    name: 'HomeButton',
    props: {
      text: {
        type: String,
        default: ""
      }
    },
    data: function () {
      return {
        uiLabels: {},
        lang: localStorage.getItem( "lang") || "en"
        }
      },
    
    created() {
        socket.on("uiLabels", (labels) => {

          this.uiLabels = labels;
        });
        socket.emit("getUILabels", this.lang);
    },

  }
  </script>
  
  <style scoped>
  /*.toppbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f8f9fa;
  }*/
  
  .homeButton {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .homeButton:hover {
    background-color: #0056b3;
  }
  </style>