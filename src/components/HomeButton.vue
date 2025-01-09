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
const socket = io('http://localhost:3000'); 
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
  .toppbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
}
 .homeButton {
  position: relative;
  color: rgb(4, 16, 131); 
  padding: 10px 20px;
  border: solid 2px #0056b3;
  border-radius: 5px;
  cursor: pointer;
  margin-left: calc(100% - 3em);
  margin-top: 0.5em;
}
 .homeButton:hover {
  border: solid 2px rgb(4, 16, 131); 
}

/* Media Queries for responsiveness */
@media (max-width: 768px) {
  .homeButton {
    padding: 8px 16px;
    font-size: 0.9em;  
    scale: 0.9;
  }
}

@media (max-width: 480px) {
  .homeButton {
    padding: 3px 8px; 
    font-size: 0.8em;  
    scale: 0.6;
  }
}

</style>