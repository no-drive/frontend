<template>
    <div  class="loader">
      Cargando...
      <h3>{{ message }}</h3>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
      };
    },
    props:{
      message:{
        type:String,
        required:false
      }
    }
  };
  </script>
  
  <style>
  .loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    font-size: 3em;
  }
  </style>
  