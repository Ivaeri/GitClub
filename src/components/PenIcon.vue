<template>
    <div class="svg-container">
      <!-- Inbäddad SVG-kod -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="pen-icon">
        <!-- Lägg här in din SVG-kod från filen -->
        <!-- Exempel på SVG-kod -->
        <path d="M10 80 L90 10" stroke="black" stroke-width="5" fill="none"/>
        <circle cx="50" cy="50" r="10" stroke="black" stroke-width="3" fill="red"/>
      </svg>
    </div>
  </template>
  
  <script>
  export default {
    name: "PenIcon",
  };
  </script>
  
  <style scoped>
  .svg-container {
    display: inline-block;
    width: 50px; /* Anpassa storlek */
    height: 50px;
  }
  
  .pen-icon {
    width: 100%;
    height: 100%;
    fill: currentColor; /* Gör att färg kan ändras via CSS */
  }
  
  .pen-icon:hover {
    fill: #007BFF; /* Färg vid hover */
  }
  </style>
  