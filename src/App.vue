<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: "App",
  //父组件中通过provide来提供变量，在子组件中通过inject来注入变量
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      //控制视图是否显示
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      //先关闭
      this.isRouterAlive = false;
      //再打开
      this.$nextTick(() => this.isRouterAlive = true)
    }
  }
}
</script>

<style lang="less">
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}


#nprogress .bar {
  background: #87CEEB !important;
}

::-webkit-scrollbar {
  /*滚动条整体样式,高宽对应横竖滚动条尺寸*/
  width: 10px;
  height: 1px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: #87ceeb;
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

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .1s ease;
}

.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
}
</style>
