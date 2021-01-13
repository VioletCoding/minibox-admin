<template>
  <div class="container" v-if="dataFlag">

    <!--顶部导航-->
    <div class="m-topBar">
      <!--系统名-->
      <div class="inline-block">
        Mini Box Pro
      </div>
      <!--系统名end-->

      <!--折叠菜单按钮-->
      <div class="inline-block m-menu-btn">
        <a-button type="primary" @click="toggleCollapsed" size="large">
          <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'"/>
        </a-button>
      </div>
      <!--折叠菜单按钮end-->

      <!--一些文字-->
      <div class="inline-block m-top-text">
        欢迎进入 Mini Box 后台管理页面
      </div>
      <!--一些文字end-->

      <div class="inline-block m-top-right-item">

        <div class="inline-block">
          <a-input-search placeholder="输入搜索内容" style="width: 180px"/>
        </div>

        <div class="inline-block user-info">
          <a-avatar :size="30" icon="user"/>
          <div class="inline-block">欢迎您 Violet</div>
        </div>

        <div class="inline-block m-top-right-logout">
          <a-button type="primary" icon="logout">退出登录</a-button>
        </div>

      </div>

    </div>
    <!--顶部导航end-->

    <div class="box">
      <!--侧边导航菜单-->
      <div class="m-menu">
        <!--菜单组-->
        <a-menu mode="inline"
                :inline-collapsed="collapsed"
                :defaultSelectedKeys="['index']">

          <a-menu-item key="index">
            <a-icon type="pie-chart"/>
            <span>首页</span>
          </a-menu-item>

          <a-sub-menu v-for="(item,index) in menuList"
                      :key="item.id">

          <span slot="title">
            <a-icon :type="item.menuIcon"/>
            <span>{{ item.menuName }}</span>
          </span>

            <a-menu-item
                v-for="(sub,subIndex) in item.subMenuList"
                :key="sub.id">
              {{ sub.subMenuName }}
            </a-menu-item>

          </a-sub-menu>

        </a-menu>
        <!--菜单组end-->
      </div>
      <!--侧边导航菜单end-->

      <!--右边的内容区域-->
      <div class="m-right">
        <!-- 面包屑 -->
        <div>
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <!-- 面包屑end -->

        <!--flex 内容展示区-->
        <div class="m-contain">
          <div>
            <MyHome></MyHome>
          </div>
        </div>
        <!--flex 内容展示区end-->

      </div>
      <!--右边的内容区域end-->

    </div>

  </div>
</template>

<script>
import Api from "@/api/api";
import MyHome from "@/views/admin/index/main/MyHome";

export default {
  name: "MyIndexTopBar",
  components: {MyHome},
  data() {
    return {
      //数据加载是否成功标识
      dataFlag: false,
      //导航菜单收缩
      collapsed: false,
      //菜单信息列表
      menuList: []
    }
  },
  methods: {
    //收缩导航菜单
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    //获取菜单列表
    getMenuList() {
      this.$http.get(Api.getMenu)
          .then(resp => {
            console.log("菜单回调=>", resp);
            this.menuList = resp.data.data;
            this.dataFlag = true;
          })
          .catch(err => {
            console.warn("菜单列表错误信息=>", err);
            this.$message.error(err.response.data.message);
          })
          .finally(f => {
            this.dataFlag = true;
          })
    }
  },
  mounted() {
    this.getMenuList();
  }

}
</script>

<style scoped lang="less">
.inline-block {
  display: inline-block;
}

.container {

  .m-topBar {
    background-color: #1890FF;
    padding: 10px 0 0 20px;
    width: 100%;
    height: 60px;

    div:first-child {
      font-size: 26px;
      font-weight: bold;
      color: white;
    }

    .m-menu-btn {
      margin: 0 20px 0 20px;
    }

    .m-top-text {
      width: 500px;
      font-size: 16px;
      color: white;
    }

    .m-top-right-item {
      width: 670px;
      height: 50px;
      float: right;

      .user-info {
        margin-left: 40px;

        div:nth-child(2) {
          margin-left: 20px;
          color: white;
        }
      }

      .m-top-right-logout {
        float: right;
        margin: 7px 20px 0 0;
      }
    }

  }

  .box {
    width: 100%;
    height: 93.5vh;
    display: flex;
    flex-direction: row;
  }

  .m-menu {
    height: 93.5vh;
    background-color: white;
  }

  .m-right {
    width: 100%;
    padding: 20px;
  }

  .m-contain {
    display: flex;
    flex-direction: row;
    padding: 20px;
  }

}
</style>