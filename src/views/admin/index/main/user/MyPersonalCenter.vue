<!--个人中心-->
<template>
  <div>
    <div v-if="!loading">
      <a-row>
        <a-col :span="16">
          <a-page-header title="个人中心"/>
          <a-form-model :label-col="{span:2}" :wrapper-col="{span:8}">
            <a-form-model-item label="昵称" prop="nickname">
              <a-input placeholder="给自己起个名字" v-model="dataSource.nickname" @change="saveVisible = true"/>
            </a-form-model-item>
            <a-form-model-item label="个性签名" prop="description">
              <a-textarea placeholder="写点关于自己的事儿吧" v-model="dataSource.description"
                          @change="saveVisible = true" autoSize/>
            </a-form-model-item>
            <a-form-model-item label="登陆密码">
              <a @click="visible=true">点击修改</a>
            </a-form-model-item>
            <a-form-model-item v-if="saveVisible" label="操作">
              <a-button type="primary" @click="modifyUser">保存</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
        <a-col :span="8">
          <a-upload :action="action" :headers="headers" name="multipartFile" @change="afterUpload" list-type="picture">
            <img :src="dataSource.photoLink" style="width: 300px;height:300px;object-fit: cover;border-radius: 50%"/>
          </a-upload>
        </a-col>
      </a-row>

      <a-modal title="修改密码"
               :visible="visible"
               :confirm-loading="confirmLoading"
               @ok="onOk"
               @cancel="visible=false"
               cancel-text="取消"
               ok-text="确定"
               :destroyOnClose="true">
        <a-form-model :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-form-model-item label="新密码">
            <a-input v-model="dataSource.password"/>
          </a-form-model-item>
          <a-form-model-item label="确认密码">
            <a-input v-model="dataSource.confirmPassword"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
    <div v-else>
      <MyLoading/>
    </div>
  </div>
</template>

<script>
import MyLoading from "@/component/MyLoading";
import Api from "@/api/api";
import util from "@/api/util";

export default {
  name: "MyPersonalCenter",
  components: {MyLoading},
  inject: ["reload"],
  data() {
    return {
      visible: false,
      confirmLoading: false,
      //页面是否正在加载
      loading: false,
      action: "http://192.168.0.105:20001/" + Api.upload,
      headers: {
        accessToken: util.getLoginUserToken()
      },
      fileList: [],
      dataSource: {
        id: util.getLoginUserId(),
        password: undefined,
        confirmPassword: undefined
      },
      saveVisible: false
    }
  },
  methods: {
    onOk() {
      this.$http.post(Api.userPwdModify, this.dataSource)
          .then(resp => {
            this.confirmLoading = true;
            if (resp.data.code == 200) {
              this.$message.success(resp.data.message);
              this.confirmLoading = false;
              this.visible = false;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => util.errMessage(err))
          .finally(() => {
            this.confirmLoading = false;
          });
    },
    //获取用户信息
    getUserInfo() {
      this.$http.get(Api.userInfo, {params: {id: util.getLoginUserId()}})
          .then(resp => {
            if (resp.data.code == 200) {
              this.dataSource = resp.data.data;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => util.errMessage(err));
    },
    //图片上传回调
    afterUpload({fileList}) {
      if (fileList[0].status == "done") {
        if (fileList[0].response.code == 200) {
          this.dataSource.photoLink = fileList[0].response.data.images[0];
          this.modifyUser();
        } else {
          this.$message.warning(fileList[0].response.message);
        }
      }
    },
    //修改个人信息
    modifyUser() {
      this.$http.post(Api.userModify, this.dataSource)
          .then(resp => {
            if (resp.data.code == 200) {
              this.$message.success(resp.data.message);
              sessionStorage.setItem("photoLink", this.dataSource.photoLink);
              localStorage.setItem("photoLink", this.dataSource.photoLink);
              sessionStorage.setItem("nickname", this.dataSource.nickname);
              localStorage.setItem("nickname", this.dataSource.nickname);
              this.reload();
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => util.errMessage(err));
    }
  },
  mounted() {
    this.getUserInfo();
  }
}
</script>