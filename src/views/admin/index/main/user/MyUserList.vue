<!--用户列表-->
<template>
  <div>
    <!--搜索表单区-->
    <div style="background-color: white;padding: 20px">
      <div>
        <span>用户标识：</span>
        <a-input class="inputField" placeholder="请输入最小值为10000的整数"/>
        <span>用户昵称：</span>
        <a-input class="inputField" placeholder="请输入用户的昵称"/>
      </div>

      <div style="margin-top: 20px;display: inline-block">
        <span>用户角色：</span>
        <a-select
            class="inputField"
            default-value="USER">
          <a-select-option
              v-for="(item,index) in userRoles"
              :key="index + 'roles' "
              :value="item.roleType">
            {{ item.roleName }}
          </a-select-option>
        </a-select>

        <span>用户状态：</span>
        <a-select
            class="inputField"
            default-value="NORMAL">
          <a-select-option
              v-for="(item,index) in userStatus"
              :key="index"
              :value="item.status">
            {{ item.statusName }}
          </a-select-option>
        </a-select>
      </div>

      <div style="margin-top: 20px;display: inline-block">
        <a-button type="primary" style="margin-right: 30px">查询</a-button>
        <a-button type="default">重置</a-button>
      </div>

    </div>
    <!--搜索表单区end-->
    <!--列表展示区-->
    <div style="margin-top: 20px">
      <a-table :columns="columns" :data-source="userList" rowKey="id">
        <span slot="action" slot-scope="text,record,index">
        <!--编辑区-->
          <a-button type="primary"
                    style="margin-right: 20px"
                    @click="modalOperation.visible=true">修改</a-button>
          <a-modal
              :title=" '修改' + record.nickname + '的个人信息' "
              :visible="modalOperation.visible"
              :confirm-loading="modalOperation.confirmLoading"
              @cancel="modalOperation.visible=false"
              cancel-text="取消"
              ok-text="确定"
              @ok="modalHandlerOk()"
          >
            <a-form-model :label-col="{span:4}" :wrapper-col="{span:18}">
              <a-form-model-item label="用户昵称">
                <a-input :value="record.nickname"/>
              </a-form-model-item>
              <a-form-model-item label="用户状态">
                <a-select :default-value="record.userState">
                  <a-select-option
                      v-for="(item,index) in userStatus"
                      :key="index + 'modalIndex' "
                      :value="item.status"
                  >
                    {{ item.statusName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="个人简介">
                <a-input :value="record.description"/>
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
          <a-button type="danger">删除</a-button>
          </a-popconfirm>
        </span>

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
      //用户状态
      userStatus: [
        {status: "NORMAL", statusName: "正常"},
        {status: "INVALID", statusName: "失效"},
        {status: "BANNED", statusName: "被封禁"}
      ],
      //用户角色
      userRoles: [{roleName: "管理员", roleType: "ADMIN"}, {roleName: "用户", roleType: "USER"}],
      //table 列
      columns,
      //用户信息
      userList: [],
      //对话框属性
      modalOperation: {
        visible: false,
        confirmLoading: false,
        modalColumns: [
          {title: "用户昵称", value: ""},
          {title: "用户状态", value: ""},
          {title: "个人简介", value: ""},
          {title: "用户名", value: ""}
        ]
      }
    }
  },
  methods: {
    //获取用户列表
    getUserList() {
      this.$http.get(Api.getUserList)
          .then(resp => this.userList = resp.data.data)
          .catch(err => err)
    },
    //确定删除用户
    confirmDeleteUser(id) {
      let local = localStorage.getItem("userId");
      let temp = sessionStorage.getItem("userId");
      if (id != local || id != temp) return this.$message.warning("你不能删除自己");
      this.$http.get(Api.deleteUser, {params: {id: id}})
          .then(resp => {
            this.$message.success(resp.data.message);
            this.$router.go(0);
          })
          .catch(err => this.$message.error(err.response.data.message == "" ? "服务器开小差了" : err.response.data.message))
    },
    //modal点击了ok
    modalHandlerOk() {
      this.$message.success("Yeah~");
      this.modalOperation.visible = false;
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