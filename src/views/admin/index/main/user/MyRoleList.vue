<!--角色列表管理-->
<template>
  <div>
    <div v-if="dataFlag">
      <!--搜索区-->
      <div>
        <span>角色ID：</span>
        <a-input type="text"
                 placeholder="请输入角色id"
                 v-model="searchOps.id"
                 style="width: 400px"/>

        <span style="margin-left: 20px">角色名：</span>
        <a-input type="text"
                 placeholder="请输入角色名"
                 v-model="searchOps.name"
                 style="width: 400px;"/>

        <span style="margin-left: 20px">状态：</span>
        <a-select default-value="0"
                  style="width: 80px"
                  @change="selectChange">
          <a-select-option value="0">可用</a-select-option>
          <a-select-option value="1">不可用</a-select-option>
        </a-select>

        <span style="margin-left: 20px">
        <a-button type="primary"
                  @click="queryRoleList">查询</a-button>
      </span>
      </div>
      <!--搜索区end-->

      <!-- Table -->
      <div style="margin-top: 20px">
        <a-table :columns="columns"
                 row-key="id"
                 :data-source="roleList"
                 :loading="tableOps.isLoading">

          <template #state="text,record">
            <a-tooltip>
              <template #title>0代表可用，1代表不可用</template>
              {{ record.state }}
            </a-tooltip>
          </template>

          <template #action="text,record">
          </template>
        </a-table>
      </div>
      <!-- Table end-->
    </div>
    <div v-else>
      <MyLoading/>
    </div>
  </div>
</template>

<script>
import Api from "@/api/api";
import MyLoading from "@/component/MyLoading";
import util from "@/api/util";

const columns = [
  {
    dataIndex: "id",
    title: "角色ID"
  },
  {
    dataIndex: "name",
    title: "角色名称"
  },
  {
    dataIndex: "state",
    title: "记录状态",
    scopedSlots: {customRender: "state"}
  },
  {
    dataIndex: "createDate",
    title: "创建时间"
  },
  {
    dataIndex: "updateDate",
    title: "更新时间"
  }
]
export default {
  name: "MyRoleList",
  components: {MyLoading},
  data() {
    return {
      dataFlag: false,
      columns,
      //可用的搜索条件
      searchOps: {
        id: "",
        name: "",
        state: undefined
      },
      //table 可用的属性
      tableOps: {
        isLoading: false
      },
      //角色列表
      roleList: []
    }
  },
  methods: {
    //查询角色列表
    queryRoleList() {
      this.tableOps.isLoading = true;
      this.$http.post(Api.showRoles, this.searchOps).then(resp => {
            this.roleList = resp.data.data;
            this.tableOps.isLoading = false;
            this.dataFlag = true;
          }
      ).catch(err => this.$message.error(util.errMessage(err)));
    },
    //a-select的值回调
    selectChange(value) {
      this.searchOps.state = value;
    }
  },
  mounted() {
    this.queryRoleList();
  }
}
</script>