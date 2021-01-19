<!--用户列表-->
<template>
  <div>
    <!--搜索表单区-->
    <div style="background-color: white;padding: 20px">
      <div>
        <span>用户标识：</span>
        <a-input class="inputField"
                 placeholder="请输入用户id"
                 v-model="queryUserParams.id"/>
        <span>用户昵称：</span>
        <a-input class="inputField"
                 placeholder="请输入用户昵称"
                 v-model="queryUserParams.nickname"/>
      </div>

      <div style="margin-top: 20px;display: inline-block">
        <span>用户状态：</span>
        <a-radio-group default-value="NORMAL"
                       style="margin-right: 50px"
                       button-style="solid"
                       @change="stateRadioChange">
          <a-radio-button value="NORMAL">正常</a-radio-button>
          <a-radio-button value="INVALID">非法</a-radio-button>
          <a-radio-button value="BANNED">封禁</a-radio-button>
        </a-radio-group>
      </div>

      <div style="display: inline-block">
        <a-button type="primary" @click="queryUser">查询</a-button>
      </div>

    </div>
    <!--搜索表单区end-->
    <!--列表展示区-->
    <div style="margin-top: 20px">
      <a-table :columns="columns"
               :data-source="userList"
               rowKey="id"
               style="background-color: white"
      >

        <template #roleList="roles,record">
          <a-tag v-for="(role,roleIndex) in roles"
                 :key="roleIndex + 'role' "
                 :color=" role.name =='ADMIN'? 'red' : 'cyan' ">
            {{ role.name }}
          </a-tag>
        </template>

        <template #action="text,record,index">
          <!--编辑区-->
          <a-button type="primary"
                    style="margin-right: 20px"
                    @click="modalHandlerUpdate(record)">
            修改
          </a-button>

          <a-modal :title=" '修改 ' + modalOperation.singleUserUpdate.nickname + ' 的个人信息' "
                   :visible="modalOperation.visible"
                   :confirm-loading="modalOperation.confirmLoading"
                   @cancel="modalOperation.visible=false"
                   cancel-text="取消"
                   ok-text="确定"
                   @ok="modalHandlerOk"
                   :destroyOnClose="true"
                   :mask="false"
          >
            <a-form-model :label-col="{span:4}"
                          :wrapper-col="{span:18}"
            >
              <a-form-model-item label="用户昵称">
                <a-input v-model="modalOperation.singleUserUpdate.nickname"/>
              </a-form-model-item>

              <a-form-model-item label="用户状态">
                <a-radio-group :default-value="modalOperation.singleUserUpdate.userState"
                               button-style="solid"
                               @change="radioChange"
                >
                  <a-radio-button value="NORMAL">正常</a-radio-button>
                  <a-radio-button value="INVALID">非法</a-radio-button>
                  <a-radio-button value="BANNED">封禁</a-radio-button>
                </a-radio-group>
              </a-form-model-item>

              <a-form-model-item label="个人简介">
                <a-input v-model="modalOperation.singleUserUpdate.description"/>
              </a-form-model-item>

            </a-form-model>
          </a-modal>
          <!--编辑区end-->

          <a-popconfirm
              title="确定要删除这个用户吗?"
              ok-text="是"
              cancel-text="否"
              @confirm="confirmDeleteUser(record.id)"
          >
            <a-button type="danger" style="margin-right: 20px">删除</a-button>
          </a-popconfirm>

        </template>

      </a-table>
    </div>
    <!--列表展示区end-->
  </div>
</template>

<script>
import Api from "@/api/api";
//table 列
const columns = [
  {
    dataIndex: 'id',
    title: "用户标识"
  },
  {
    dataIndex: 'nickname',
    title: '用户昵称'
  },
  {
    dataIndex: 'userState',
    title: '用户状态'
  },
  {
    dataIndex: 'roleList',
    title: "用户角色",
    scopedSlots: {customRender: "roleList"}
  },
  {
    dataIndex: 'level',
    title: '用户等级'
  },
  {
    dataIndex: "createDate",
    title: '注册时间'
  },
  {
    dataIndex: "description",
    title: "个人简介"
  },
  {
    dataIndex: "username",
    title: "用户名"
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: {
      customRender: "action"
    }
  }
];
export default {
  name: "MyUserList",
  data() {
    return {
      columns,
      //用户信息
      userList: [],
      //对话框属性
      modalOperation: {
        //修改按钮
        visible: false,
        //tag的X，也就是closeable
        tagModalVisible: false,
        confirmLoading: false,
        singleUserUpdate: {},
      },
      //查询用户可用参数
      queryUserParams: {
        id: "",
        nickname: "",
        userState: ""
      }
    }
  },
  methods: {
    //获取用户列表
    getUserList() {
      this.$http.post(Api.getUserList)
          .then(resp => this.userList = resp.data.data)
          .catch(err => err)
    },
    //确定删除用户
    confirmDeleteUser(id) {
      let local = localStorage.getItem("userId");
      let session = sessionStorage.getItem("userId");
      if (id == local || id == session) return this.$message.warning("你不能删除自己");
      this.$http.get(Api.deleteUser, {params: {id: id}})
          .then(resp => {
            this.$message.success(resp.data.message);
            this.getUserList();
          })
          .catch(err => this.$message.error(err.response.data.message == "" ? "服务器开小差了" : err.response.data.message))
    },
    //点击修改按钮
    modalHandlerUpdate(record) {
      this.modalOperation.visible = true
      this.modalOperation.singleUserUpdate = record;
    },
    //modal点击了ok
    modalHandlerOk() {
      this.modalOperation.confirmLoading = true;
      this.$http.post(Api.updateUser, this.modalOperation.singleUserUpdate)
          .then(resp => {
            this.$message.success("修改成功");
            this.modalOperation.confirmLoading = false;
            this.modalOperation.visible = false;
          })
          .catch(err => {
            this.$message.error("修改失败 " + err.response.data.message);
            this.modalOperation.confirmLoading = false;
            this.modalOperation.visible = false;
          })
    },
    //Modal里的用户状态 单选框回调
    radioChange(e) {
      this.modalOperation.singleUserUpdate.userState = e.target.value;
    },
    //用户状态单选框改变回调
    stateRadioChange(e) {
      this.queryUserParams.userState = e.target.value;
    },
    //条件查询用户
    queryUser() {
      this.$http.post(Api.getUserList, {
        id: this.queryUserParams.id,
        nickname: this.queryUserParams.nickname,
        userState: this.queryUserParams.userState
      }).then(resp => this.userList = resp.data.data)
          .catch(err => err);
    }
  },
  mounted() {
    this.getUserList();
  }
}
</script>

<style scoped lang="less">
.inputField {
  display: inline-block;
  width: 400px;
  margin-right: 50px
}
</style>