<!--个人中心-->
<template>
  <div>
    <div v-if="!loading">

      <a-row>
        <a-col :span="16">
          <a-page-header title="个人中心"/>
          <a-form-model :label-col="{span:2}"
                        :wrapper-col="{span:8}">
            <a-form-model-item label="昵称"
                               prop="nickname">
              <a-input placeholder="给自己起个名字"
                       v-model="dataSource.nickname"
                       @change="saveVisible = true"/>
            </a-form-model-item>
            <a-form-model-item label="个性签名"
                               prop="description">
              <a-textarea placeholder="写点关于自己的事儿吧"
                          v-model="dataSource.description"
                          @change="saveVisible = true"
                          autoSize/>
            </a-form-model-item>
            <a-form-model-item label="个人等级">
              <span>Lv {{ dataSource.level }}</span>
            </a-form-model-item>
            <a-form-model-item label="登陆密码">
              <a>点击修改</a>
            </a-form-model-item>
            <a-form-model-item v-if="saveVisible"
                               label="操作">
              <a-button type="primary"
                        @click="save">保存
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>

        <a-col :span="8">
          <a-upload :action="action"
                    :headers="headers"
                    name="multipartFile"
                    @change="afterUpload"
                    list-type="picture">
            <img :src="dataSource.userImg"
                 style="width: 300px;height:300px;object-fit: cover;border-radius: 50%"/>
          </a-upload>
        </a-col>
      </a-row>

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
      //页面是否正在加载
      loading: false,
      action: "http://192.168.0.105:20001/" + Api.upload,
      headers: {
        accessToken: util.getLoginUserToken()
      },
      fileList: [],
      dataSource: {},
      saveVisible: false
    }
  },
  methods: {
    getUserInfo() {
      this.$http.post(Api.getUserList, {id: util.getLoginUserId()})
          .then(resp => this.dataSource = resp.data.data[0])
          .catch(err => util.errMessage(err));
    },
    afterUpload({fileList}) {
      if (fileList[0].status == "done") {
        this.dataSource.userImg = fileList[0].response.data;
        this.$http.post(Api.updateUser, {userImg: this.dataSource.userImg, id: util.getLoginUserId()})
            .then(resp => {
              this.$message.success(resp.data.message);
              sessionStorage.setItem("userImg", this.dataSource.userImg);
              localStorage.setItem("userImg", this.dataSource.userImg);
              this.reload();
            })
            .catch(err => util.errMessage(err));
      }
    },
    save() {
      this.$http.post(Api.updateUser, this.dataSource)
          .then(resp => {
            if (resp.data.code == 200) {
              this.$message.success(resp.data.message);
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