<template>
  <div class="runner">
    <img src="/runner/bacterium.svg" class="bacterium" />
    <div class="light" />
  </div>
</template>

<style scoped>
.runner {
  height: 300px;
  border: 1px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.bacterium {
  height: 200px;
}
.light {
  position: absolute;
  width: 50px;
  height: 100px;
  top: 60px;
  background-color: red;
  opacity: 0.5;
  border-radius: 50px;
}
</style>
