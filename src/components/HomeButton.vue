<template>
    <div class="toppbar">
      <RouterLink to="/">
        <button class="homeButton">{{ uiLabels.goHome }}</button> <!-- Denna knapp ska få namn i labels sen -->
      </RouterLink>
    </div>
  </template>
  
  <script>
  import { RouterLink } from 'vue-router';
  import io from 'socket.io-client';
  const socket = io('http://localhost:3000'); // Justera URL efter behov
  
  export default {
    name: 'HomeButton',
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
    }
  }
  </script>
  
  <style scoped>
  .toppbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f8f9fa;
  }
  
  .homeButton {
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