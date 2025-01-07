<script setup>
import { RouterView, useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <div id="app">
    <header :class="{ 'is-startpage': route.path === '/' }">
      <div class="logo">Häng Person</div>
    </header>

    <RouterView />
  </div>
</template>

<style>
/* Global header */
header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 0.5rem 0;
}


.logo {
  font-family: 'Sue Ellen Francisco', cursive;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 2rem; 
  color: rgb(4, 16, 131);
  margin: 0 auto;
}

header.is-startpage {
  position: relative; 
  box-shadow: none; 
  padding: 2rem 0;
}

header.is-startpage .logo {
  font-size: 5rem;
  padding-top: 2rem;
  color: rgb(4, 16, 131);
}

/* Responsiv design */
@media (max-width: 768px) {
  .logo {
    font-size: 1.5rem; /* Mindre text på små skärmar */
  }

  header.is-startpage .logo {
    font-size: 3rem; /* Anpassad storlek på startsidan för små skärmar */
  }
}
</style>