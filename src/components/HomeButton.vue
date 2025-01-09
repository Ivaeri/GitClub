<template>
  <div class="toppbar">
    <RouterLink to="/">
        <img src="https://static.vecteezy.com/system/resources/previews/047/429/171/non_2x/flat-house-icon-free-png.png" alt="Home" class="homeIcon" />
    </RouterLink>
  </div>
</template>
 <script>
import io from 'socket.io-client';
const socket = io('http://localhost:3000'); 
 export default {
  name: 'HomeIcon',
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

  .homeIcon {
    height: 4em;
    width: 4em;
    margin-left: 4em;
    padding: 0;
    cursor: pointer;
    display: inline-block;
    position: relative;
    background-color: rgba(55,139,248,255);
    pointer-events: auto;
    border-radius: 100%;
    background-size: 1em;
  }
  
  .homeIcon:hover {
    transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
  }

  body, html {
  margin: 0;
  padding: 0;
}

@media (max-width: 768px) {
  .homeIcon {
    height: 3em;
    width: 3em; 
  }
}

@media (max-width: 480px) {
  .homeIcon {
    height: 2em;
    width: 2em;
  }
}

</style>