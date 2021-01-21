<!--菜单列表-->
<template>
  <div style="background-color: white;padding: 20px">
    <!--搜索区-->
    <div>
      <span>菜单ID：</span>
      <a-input type="text" style="width: 300px" v-model="searchOps.id"/>

      <span style="margin-left: 20px">菜单名称：</span>
      <a-input type="text" style="width: 300px" v-model="searchOps.menuName"/>

      <a-button type="primary" style="margin-left: 20px" @click="searchMenu">查询</a-button>
    </div>
    <!--搜索区end-->

    <!--table-->
    <div style="margin-top: 20px">
      <a-table :columns="columns"
               :data-source="menuList"
               rowKey="id"
               :loading="tableOps.isLoading" childrenColumnName="subMenuList">
        <template #icon="record">
          <a-icon :type="record"/>
          <span style="margin-left: 10px;">{{ record }}</span>
        </template>

        <template #action="record">
          <a-button type="primary" @click="showModal(record)">修改</a-button>

          <a-modal :visible="tableOps.modalOps.visible"
                   @cancel="tableOps.modalOps.visible=false"
                   @ok="updateMenuInfo"
                   :confirm-loading="tableOps.modalOps.confirmLoading"
                   :mask="false"
                   :destroyOnClose="true"
                   title="修改菜单信息">

            <a-form-model :label-col="{span:4}" :wrapper-col="{span:14}">
              <a-form-model-item label="菜单ID">
                <a-input v-model="tableOps.modalOps.inputValue.id" :disabled="true"/>
              </a-form-model-item>

              <a-form-model-item label="菜单图标">
                <a-input v-model="tableOps.modalOps.inputValue.menuIcon">
                  <a-icon v-if="tableOps.modalOps.inputValue.menuIcon != '' "
                          slot="prefix" :type="tableOps.modalOps.inputValue.menuIcon"/>
                </a-input>
              </a-form-model-item>

              <a-form-model-item label="菜单名称">
                <a-input v-model="tableOps.modalOps.inputValue.menuName"/>
              </a-form-model-item>

            </a-form-model>
          </a-modal>

          <a-button style="margin-left: 20px">添加</a-button>

          <a-popconfirm title="确定要删除这个菜单吗？">
            <a-button type="danger" style="margin-left: 20px;">删除</a-button>
          </a-popconfirm>
        </template>


      </a-table>
    </div>
    <!--table end-->
  </div>
</template>

<script>
import Api from "@/api/api";
//table columns
const columns = [
  {
    dataIndex: "id",
    title: "菜单ID",
    width: "100px"
  },
  {
    dataIndex: "menuIcon",
    title: "菜单图标",
    width: "200px",
    scopedSlots: {customRender: "icon"}
  },
  {
    dataIndex: "menuName",
    title: "菜单名称",
    width: "200px"
  },
  {
    dataIndex: "url",
    title: "菜单路径",
    width: "200px"
  },
  {
    key: "action",
    title: "操作",
    width: "400px",
    scopedSlots: {customRender: "action"}
  }
]
export default {
  inject: ["reload"],
  name: "MyMenuList",
  data() {
    return {
      //搜索框可用条件
      searchOps: {
        id: undefined,
        menuName: undefined
      },
      columns,
      //table可操作项
      tableOps: {
        isLoading: false,
        //模态框可操作项
        modalOps: {
          visible: false,
          confirmLoading: false,
          inputValue: {}
        }
      },
      //数据源
      menuList: []
    }
  },
  methods: {
    //获取菜单信息
    getMenuList() {
      this.tableOps.isLoading = true;
      this.$http.get(Api.getMenu).then(resp => {
        this.menuList = resp.data.data;
        this.tableOps.isLoading = false;
      })
    },
    //搜索菜单
    searchMenu() {
      this.tableOps.isLoading = true;
      this.$http.get(Api.getMenu, {params: {id: this.searchOps.id, menuName: this.searchOps.menuName}})
          .then(resp => {
            console.log("搜索菜单=>", resp);
            this.menuList = resp.data.data;
            this.tableOps.isLoading = false;
          })
    },
    //显示modal，并且把那一列的record存起来方便使用
    showModal(record) {
      this.tableOps.modalOps.visible = true;
      this.tableOps.modalOps.inputValue = record;
    },
    //修改菜单信息
    updateMenuInfo() {
      //区分一下是子菜单还是父菜单，父菜单没有url这个属性
      if (this.tableOps.modalOps.inputValue.url != undefined) {
        this.$http.post(Api.updateSubMenu, this.tableOps.modalOps.inputValue)
            .then(resp => {
              this.tableOps.modalOps.visible = false;
              this.tableOps.modalOps.inputValue = {};
              this.$notification.success({message: resp.data.message});
            })
            .catch(err => err)
            .finally(f => this.reload)
        return 0;
      }
      this.$http.post(Api.updateParentMenu, this.tableOps.modalOps.inputValue)
          .then(resp => {
            this.tableOps.modalOps.visible = false;
            this.tableOps.modalOps.inputValue = {};
            this.$notification.success({message: resp.data.message});
          })
          .catch(err => err)
          .finally(f => this.reload)
    }
  },
  mounted() {
    this.getMenuList();
  }
}
</script>

<style scoped>

</style>