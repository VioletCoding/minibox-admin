<!--管理员登陆页，因为管理员的是PC端的，用移动端的组件展示效果不太好-->
<template>
  <div class="box">
    <div class="container">
      <!--标题-->
      <div>
        <p>Mini Box</p>
        <p>Mini Box 是一名叫龚鸿炜的学生仔写的一个沙雕毕设</p>
      </div>
      <!--Tabs标签切换-->
      <div class="tabs">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="账号密码登陆"/>
          <a-tab-pane key="2" tab="验证码登陆" force-render/>
        </a-tabs>
      </div>
      <!--Tabs标签切换end-->

      <!--不使用tabs组件的默认样式-->
      <div class="login">
        <!--表单输入校验区-->
        <a-form-model :model="authForm" :rules="authFormRules" ref="login">
          <a-form-model-item prop="username" has-feedback>
            <a-input v-model="authForm.username" placeholder="请输入用户名" :allowClear="true">
              <a-icon slot="prefix" type="user"/>
            </a-input>
          </a-form-model-item>

          <!--根据激活的tab显示不同的input框和button tabActiveKey==1 账号密码输入 tabActiveKey==2 验证码输入-->
          <a-form-model-item v-if="tabActiveKey == 1" prop="password" has-feedback>
            <a-input-password v-model="authForm.password" placeholder="请输入密码" :allowClear="true">
              <a-icon slot="prefix" type="safety-certificate"/>
            </a-input-password>
          </a-form-model-item>

          <div v-if="tabActiveKey == 2" class="authCodeInput">

            <div class="inline-block">

              <a-form-model-item prop="authCode" has-feedback>
                <a-input v-model="authForm.authCode" placeholder="请输入验证码" :allowClear="true" :maxLength="6">
                  <a-icon slot="prefix" type="safety-certificate"/>
                </a-input>
              </a-form-model-item>

            </div>

            <div class="inline-block btn">
              <a-button type="default" @click="getAuthCode" :loading="getAuthCodeButtonLoadingFlag"
                        :disabled="getAuthCodeButtonDisableFlag">
                获取验证码
              </a-button>
            </div>

          </div>
        </a-form-model>
      </div>
      <!--表单输入校验区end-->

      <!--公共区域-->
      <div class="public">
        <a-checkbox @change="autoLogin">自动登录</a-checkbox>
        <br/><br/>
        <a-button type="primary" block @click="confirm">确定</a-button>
      </div>
      <!--公共区域end-->

      <div class="footer">
        <a>Copyright &copy; 2021 龚鸿炜 出品</a>
      </div>

      <!--表单输入区end-->
    </div>
  </div>
</template>

<script>
import Api from "@/api/api";

export default {
  name: "MyAdminLogin",
  data() {
    return {
      //激活的tabs，为了拿当前的下标
      tabActiveKey: 1,
      //获取验证码按钮是否显示正在加载状态
      getAuthCodeButtonLoadingFlag: false,
      //获取验证码按钮是否被禁用
      getAuthCodeButtonDisableFlag: false,
      //是否自动登录
      isAutoLogin: false,
      //需要校验的对象
      authForm: {
        //用户名
        username: "",
        //密码
        password: "",
        //验证码
        authCode: ""
      },
      //登陆的校验规则
      authFormRules: {
        username: [
          {
            required: true,
            message: "邮箱格式不正确",
            pattern: "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码必须大于等于8位数且小于16位数",
            min: 8,
            max: 16,
            trigger: "blur"
          }
        ],
        authCode: [
          {
            required: true,
            message: "请输入6位数验证码",
            min: 6,
            max: 6,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //tabs面板切换回调
    callback(activeKey) {
      this.tabActiveKey = activeKey;
      return activeKey;
    },
    //是否勾选自动登录复选框
    autoLogin(checkedValue) {
      this.isAutoLogin = checkedValue.target.checked;
    },
    //获取验证码按钮
    getAuthCode() {
      //单个参数验证，传入prop名，得到回调
      this.$refs.login.validateField("username", v => {
        //如果返回的errorMessage为空，那么校验通过，否则不通过
        if (v.match("")) {
          this.getAuthCodeButtonLoadingFlag = true;
          //请求验证码接口
          this.$http
              .post(Api.auth, {username: this.authForm.username})
              .then(resp => {
                if (resp.data.code == 200) {
                  this.$message.success("验证码已发送");
                  this.getAuthCodeButtonLoadingFlag = false;
                  this.getAuthCodeButtonDisableFlag = true;
                  //5秒后才可以再次点击
                  setTimeout(() => {
                    this.getAuthCodeButtonDisableFlag = false;
                  }, 5000);
                }
              })
              .catch(err => this.$message.error(err.response.data.message))
              .finally(f => this.getAuthCodeButtonLoadingFlag = false);
        } else this.$message.warning("请填写输入框内必填信息");
      });
    },
    //确定按钮
    confirm() {
      // TODO 用户名密码登陆 暂不可用
      if (this.tabActiveKey == 1) {
        this.$refs.login.validate(v => {
          console.log("用户名密码登陆，校验是否通过=>", v);
          if (v) alert("功能未开发，请暂时使用验证码登陆");
          else console.warn("校验不通过，不允许登陆");
        });
      }
      //验证码登陆
      if (this.tabActiveKey == 2) {
        this.$refs.login.validate(v => {
          if (v) {
            this.$http
                .post(Api.loginOrReg, {
                  username: this.authForm.username,
                  authCode: this.authForm.authCode
                })
                .then(resp => {
                  let returnData = resp.data.data;
                  //正常情况
                  if (resp.data.code == 200) {
                    //遍历角色列表，如果有管理员身份，则return true
                    if (returnData.roleList.some(v => {
                      return v.id == 10001;
                    })) {
                      //临时存储一下部分信息
                      localStorage.setItem("nickname", returnData.nickname);
                      localStorage.setItem("userImg", returnData.userImg);
                      //如果未勾选了自动登录（7天），那么把token存储到sessionStorage，关闭页面后则登录信息失效
                      if (!this.isAutoLogin) {
                        sessionStorage.setItem("accessToken", returnData.token);
                        sessionStorage.setItem("userId", returnData.id);
                        this.$message.success("欢迎回来，尊敬的管理员 「" + returnData.nickname + "」 您未勾选自动登录,页面关闭后会清空您的信息");
                        this.$router.replace("/home");
                        return true;
                      }
                      //否则存储到localStorage
                      localStorage.setItem("accessToken", returnData.token);
                      localStorage.setItem("userId", returnData.id);
                      this.$message.success("欢迎回来，尊敬的管理员 「 " + returnData.nickname + "」 您勾选了自动登录,下次将会自动登录");
                      this.$router.replace("/home");
                      return true;
                    } else this.$message.error("你根本不是管理员,你怎么发现我们的后台系统的?我已经报警了!");
                  } else this.$message.error(resp.data.message == "" ? "服务器拒绝了你的请求" : resp.data.message);
                }).catch(err => this.$message.error(err.response.data.message == "" ? "服务器出错啦" : err.response.data.message)
            );
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.inline-block {
  display: inline-block;
}

.box {
  height: 100%;
  background: url("../../assets/background/admin-login-bg.svg");
  overflow: hidden;

  .container {
    width: 1200px;
    height: 500px;
    margin: 150px auto;

    p {
      padding: 0;
      margin: 0;
    }

    p:first-child {
      font-size: 50px;
      text-align: center;
      font-weight: bold;
    }

    p:nth-child(2) {
      text-align: center;
    }

    .tabs {
      width: 250px;
      height: 20px;
      margin: 50px auto;
    }

    .login {
      width: 350px;
      margin: 0 auto;

      .authCodeInput {
        width: 350px;

        .btn {
          margin: 5px 0 0 20px;
          position: fixed;
        }
      }
    }

    .footer {
      width: 350px;
      height: 100px;
      text-align: center;
      margin: 100px auto;
    }

    .public {
      width: 350px;
      margin: 0 auto;
    }
  }
}
</style>
