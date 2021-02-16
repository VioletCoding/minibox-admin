<template>
  <div v-if="dataFlag">
    <!--顶部导航-->
    <div class="top-bar">
      <p>Mini Box Pro</p>
      <!--折叠菜单按钮-->
      <div>
        <a-button type="primary" @click="collapsed = !collapsed" size="large">
          <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'"/>
        </a-button>
      </div>
      <!--折叠菜单按钮end-->
      <p>欢迎进入 Mini Box 后台管理页面</p>
      <p>{{ userInfo.nickname }}</p>
      <div>
        <a-dropdown overlayClassName="user-info" placement="bottomCenter">
          <a-avatar :size="30" :src="userInfo.photoLink" alt="头像加载失败" style="margin-right: 50px">
          </a-avatar>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="()=>this.$router.push('/personal')">
                <a-icon type="user"/>
                个人中心
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-button type="danger" icon="logout" @click="logoutConfirm">退出登录
        </a-button>
      </div>
    </div>
    <!--顶部导航end-->
    <div class="box">
      <!--侧边导航菜单-->
      <div class="m-menu">
        <!--菜单组-->
        <a-menu mode="inline" :defaultSelectedKeys="[this.$route.path]" :selectedKeys="[this.$route.path]"
                :inline-collapsed="collapsed" @select="jump">
          <template v-for="item in menuList">
            <a-menu-item v-if="item.menuUrl" :key="item.menuUrl">
              <a-icon :type="item.menuIcon"/>
              <span>{{ item.menuName }}</span>
            </a-menu-item>
          </template>
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
import util from "@/api/util";

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
      userInfo: {
        nickname: localStorage.getItem("nickname"),
        photoLink: localStorage.getItem("photoLink")
      }
    }
  },
  methods: {
    //点击菜单时跳转路由
    jump({item, key, selectedKeys}) {
      this.$router.push(key).catch(err => this.$message.error("该路由暂时不可用"));
    },
    //获取菜单列表
    getMenuList() {
      this.$http.post(Api.menuList)
          .then(resp => {
            if (resp.data.code == 200) {
              this.menuList = resp.data.data;
              this.dataFlag = true;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => this.$message.error(util.errMessage(err)));
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
                if (resp.data.code == 200) {
                  realThis.$message.success("欢迎下次使用,再见");
                  sessionStorage.clear();
                  localStorage.clear();
                  realThis.$router.replace("/login");
                } else {
                  realThis.$message.warning(resp.data.message);
                }
              }).catch(err => util.errMessage(err));
        },
        onCancel() {
          realThis.$message.warning("别乱点啊！");
        }
      })
    },
    //跳转到对应的菜单
    routerPush(url) {
      if (!util.isNullOrEmpty(url)) {
        this.$router.push(url).catch(err => err);
      }
    }
  },
  mounted() {
    this.getMenuList();
  }

}
</script>

<style scoped lang="less">
.top-bar {
  display: flex;
  flex-direction: row;
  background-color: #1890FF;
  height: 60px;
  width: 100%;
  padding: 0 10px 0 10px;

  p {
    padding: 0;
    margin: 0;
    color: white;
    line-height: 60px;
  }

  p:nth-child(1) {
    font-size: 28px;
    font-weight: bold;
    width: 200px;
  }

  div:nth-child(2) {
    line-height: 60px;
    margin: 0 30px 0 0;
  }

  p:nth-child(3) {
    font-size: 16px;
  }

  p:nth-child(4) {
    margin: 0 30px 0 auto;
    font-size: 18px;
  }

  div:nth-child(5) {
    line-height: 60px;
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
</style>