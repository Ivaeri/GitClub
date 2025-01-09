<template>
    <div class="logo" :class="{ 'is-startpage': isStartPage}">
        {{ text }}
    </div>
</template>

<script>


import io from 'socket.io-client';
const socket = io('http://localhost:3000'); 

export default {
    name: "Logo", 
    props: {
        text: {
            type: String,
            default: ""
        },
        isStartPage: {
            type: Boolean, 
            default: false, 
        }, 
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
};
</script>

<style scoped>
.logo {
    font-family: 'Sue Ellen Francisco', cursive;
    text-transform: uppercase; 
    letter-spacing: 0.1em;
    font-size: 1.5em;
    color: rgb(4, 16, 131); 
    position: absolute; 
    top: 5%;
    left: 50%;
    transform: translate(-50%, -40%);
    /*margin: 1rem auto; */
    text-align: center; 
}

.logo.is-startpage {
    font-size: 5rem; 
    padding-top: 2rem;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
}

@media (max-width: 768px) {
    .logo {
        font-size: 1.2em; 
    }
    .logo.is-startpage {
        font-size: 3rem; 
    }
}


@media (max-width: 480px) {
    .logo {
        font-size: 1em; 
        width: 100%;
        text-align: center;
    }
    .logo.is-startpage {
        font-size: 2rem; 
    }
    
}
</style>