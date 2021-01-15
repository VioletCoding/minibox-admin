<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#nprogress .bar{
  background: red !important;
}

::-webkit-scrollbar {
  /*滚动条整体样式,高宽对应横竖滚动条尺寸*/
  width: 10px;
  height: 1px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(45deg,
  rgba(255, 255, 255, 0.2) 25%,
  transparent 25%,
  transparent 50%,
  rgba(255, 255, 255, 0.2) 50%,
  rgba(255, 255, 255, 0.2) 75%,
  transparent 75%,
  transparent);
}

::-webkit-scrollbar-track {
  /*滚动条里的轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}
</style>
