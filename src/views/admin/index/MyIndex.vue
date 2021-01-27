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

        <a-dropdown overlayClassName="user-info" placement="bottomCenter">
          <div class="inline-block user-info">
            <a-avatar :size="30"
                      :src="userInfo.userImg"
                      alt="头像"/>
            <div class="inline-block">{{ userInfo.nickname }}</div>
          </div>

          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#">
                <a-icon type="user"/>
                个人中心
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>


        <div class="inline-block m-top-right-logout">
          <a-button type="primary" icon="logout" @click="logoutConfirm">退出登录</a-button>
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
                :defaultSelectedKeys="[this.$route.path]"
                :selectedKeys="[this.$route.path]"
        >

          <a-menu-item key="/home" @click="showIndex">
            <a-icon type="pie-chart"/>
            <span>首页</span>
          </a-menu-item>

          <a-sub-menu v-for="(item,index) in menuList" :key="index + 'subMenu' ">

          <span slot="title">
            <a-icon :type="item.menuIcon"/>
            <span>{{ item.menuName }}</span>
          </span>

            <a-menu-item v-for="subMenu in item.subMenuList"
                         :key="subMenu.url"
                         @click="routerPush(subMenu.url)">
              {{ subMenu.menuName }}
            </a-menu-item>

          </a-sub-menu>

        </a-menu>
        <!--菜单组end-->
      </div>
      <!--侧边导航菜单end-->

      <!--右边的内容区域-->
      <div class="m-right">
        <!--内容展示区-->
        <div class="m-contain">
          <div style="background-color: white;padding: 20px">
            <router-view></router-view>
          </div>
        </div>
        <!--内容展示区end-->

      </div>
      <!--右边的内容区域end-->

    </div>

  </div>
</template>

<script>
import Api from "@/api/api";

export default {
  name: "MyIndex",
  data() {
    return {
      //数据加载是否成功标识
      dataFlag: false,
      //导航菜单收缩
      collapsed: false,
      //菜单信息列表
      menuList: [],
      //用户信息
      userInfo: {}
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
            this.menuList = resp.data.data;
            this.dataFlag = true;
          })
          .catch(err => this.$message.error(err.response.data.message == "" ? "服务器开小差了" : err.response.data.message))
    },
    //获取部分用户信息
    loadUserInfo() {
      this.userInfo.nickname = localStorage.getItem("nickname");
      this.userInfo.userImg = localStorage.getItem("userImg");
    },
    //退出登录确认框
    logoutConfirm() {
      const realThis = this;
      realThis.$confirm({
        title: "确定要退出登录吗?",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          realThis.$http.get(Api.logout)
              .then(resp => {
                realThis.$message.success("欢迎下次使用,再见");
                realThis.$router.replace("/login");
              })
              .finally(f => {
                sessionStorage.clear();
                localStorage.clear();
              })
        },
        onCancel() {
          realThis.$message.warning("别乱点啊");
        }
      })
    },
    //根据时间显示上午好下午好之类的
    loadTimeTip() {
      const date = new Date();
      let tip;
      if (date.getHours() >= 0 && date.getHours() < 12) return tip = "上午好";
      if (date.getHours() >= 12 && date.getHours() < 18) return tip = "下午好";
      else return tip = "晚上好";
    },
    //去主页，这个和子菜单分离
    showIndex() {
      this.$router.push("/home");
    },
    //跳转到对应的菜单
    routerPush(url) {
      if (url == "" || url == null || url == undefined) return 0;
      this.$router.push(url);
    }
  },
  mounted() {
    this.getMenuList();
    this.loadUserInfo();
    let tip = this.loadTimeTip();
    this.$notification.success({message: tip + " " + localStorage.getItem("nickname")});
  }

}
</script>

<style scoped lang="less">
.inline-block {
  display: inline-block;
}

.container {

  .m-topBar {
    background-color: #1890ff;
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
        cursor: pointer;

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
    padding: 20px;
    margin-top: 20px;
    background-color: #F0F2F5;
  }

}
</style>