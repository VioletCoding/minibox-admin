<!--菜单列表-->
<template>
  <div>
    <div v-if="loading">
      <!--搜索区-->
      <div>
        <span>菜单ID：</span>
        <a-input type="text" style="width: 300px" v-model="searchOps.id"/>

        <span style="margin-left: 20px">菜单名称：</span>
        <a-input type="text" style="width: 300px" v-model="searchOps.menuName"/>

        <a-button type="primary" style="margin-left: 20px" @click="searchMenu">查询</a-button>

        <a-button style="margin-left: 20px" @click="showAddMenuModal">添加</a-button>
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
                     @cancel="closeModal"
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

                <a-form-model-item label="菜单路径">
                  <a-input v-model="tableOps.modalOps.inputValue.url" :disabled="tableOps.modalOps.isDisabled"/>
                </a-form-model-item>

              </a-form-model>
            </a-modal>

            <a-modal :visible="addMenuModalOps.visible"
                     @cancel="closeModal"
                     @ok="addMenu"
                     :confirm-loading="addMenuModalOps.confirmLoading"
                     :mask="false"
                     :destroyOnClose="true"
                     title="添加菜单">

              <a-form-model :label-col="{span:4}" :wrapper-col="{span:14}">

                <a-form-model-item label="菜单图标">
                  <a-input v-model="addMenuModalOps.inputValue.menuIcon">
                    <a-icon v-if="addMenuModalOps.inputValue.menuIcon != '' "
                            slot="prefix" :type="addMenuModalOps.inputValue.menuIcon"/>
                  </a-input>
                </a-form-model-item>

                <a-form-model-item label="菜单名称">
                  <a-input v-model="addMenuModalOps.inputValue.menuName"/>
                </a-form-model-item>

                <a-form-model-item label="菜单路径">
                  <a-input v-model="addMenuModalOps.inputValue.url" :disabled="addMenuModalOps.isDisabled"/>
                </a-form-model-item>

                <a-form-model-item label="添加子菜单">
                  <a-checkbox @change="allowSubMenu"/>
                </a-form-model-item>

                <a-form-model-item v-show="addMenuModalOps.isCheckBoxChecked" label="父菜单ID">
                  <a-input v-model="addMenuModalOps.inputValue.parentMenuId"/>
                </a-form-model-item>

              </a-form-model>
            </a-modal>

            <a-popconfirm title="确定要删除这个菜单吗？" @confirm="deleteMenu(record)">
              <a-button type="danger" style="margin-left: 20px;">删除</a-button>
            </a-popconfirm>
          </template>


        </a-table>
      </div>
      <!--table end-->
    </div>
    <div v-else>
      <MyLoading/>
    </div>
  </div>
</template>

<script>
import Api from "@/api/api";
import MyLoading from "@/component/MyLoading";
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
  components: {MyLoading},
  inject: ["reload"],
  name: "MyMenuList",
  data() {
    return {
      loading: false,
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
          //模态框里的输入框，记录那一行record的值
          inputValue: {},
          //是否禁用输入框
          isDisabled: false
        }
      },
      //添加按钮的模态框
      addMenuModalOps: {
        //模态框可操作项
        visible: false,
        confirmLoading: false,
        isDisabled: false,
        isCheckBoxChecked: false,
        //模态框里的输入框，记录那一行record的值
        inputValue: {}
      },
      //数据源
      menuList: []
    }
  },
  methods: {
    //获取菜单信息
    getMenuList() {
      this.tableOps.isLoading = true;
      this.$http.get(Api.getMenu)
          .then(resp => {
            this.menuList = resp.data.data;
            this.tableOps.isLoading = false;
            this.loading = true;
          })
          .catch(err => err)
    },
    //搜索菜单
    searchMenu() {
      this.tableOps.isLoading = true;
      this.$http.get(Api.getMenu, {params: {id: this.searchOps.id, menuName: this.searchOps.menuName}})
          .then(resp => {
            this.menuList = resp.data.data;
            this.tableOps.isLoading = false;
          })
          .catch(err => err)
    },
    //显示modal，并且把那一列的record存起来方便使用
    showModal(record) {
      this.tableOps.modalOps.visible = true;
      this.tableOps.modalOps.inputValue = record;
      if (this.tableOps.modalOps.inputValue.url == undefined) this.tableOps.modalOps.isDisabled = true;
    },
    //关闭modal回调
    closeModal() {
      this.tableOps.modalOps.visible = false;
      this.tableOps.modalOps.isDisabled = false;
      this.addMenuModalOps.isDisabled = false;
      this.addMenuModalOps.visible = false;
    },
    //修改菜单信息
    updateMenuInfo() {
      this.tableOps.modalOps.confirmLoading = true;
      //区分一下是子菜单还是父菜单，父菜单没有url这个属性
      if (this.tableOps.modalOps.inputValue.url != undefined) {
        this.$http.post(Api.updateSubMenu, this.tableOps.modalOps.inputValue)
            .then(resp => {
              this.tableOps.modalOps.confirmLoading = false;
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
            this.tableOps.modalOps.confirmLoading = false;
            this.tableOps.modalOps.visible = false;
            this.tableOps.modalOps.inputValue = {};
            this.$notification.success({message: resp.data.message});
          })
          .catch(err => err)
          .finally(f => this.reload)
    },
    //显示添加菜单的模态框
    showAddMenuModal(record) {
      if (record.url == undefined) this.addMenuModalOps.isDisabled = true;
      this.addMenuModalOps.inputValue = record;
      this.addMenuModalOps.visible = true;
    },
    //判断是否添加子菜单
    allowSubMenu(e) {
      this.addMenuModalOps.isCheckBoxChecked = e.target.checked;
      if (this.addMenuModalOps.isCheckBoxChecked) this.addMenuModalOps.isDisabled = false;
    },
    //添加菜单
    addMenu() {
      //区分下是父菜单还是子菜单
      //父菜单
      if (!this.addMenuModalOps.isCheckBoxChecked) {
        this.$http.post(Api.addParentMenu, this.addMenuModalOps.inputValue)
            .then(resp => this.$notification.success({message: resp.data.message}))
            .catch(err => err)
      } else {
        this.$http.post(Api.addSubMenu, this.addMenuModalOps.inputValue)
            .then(resp => this.$notification.success({message: resp.data.message}))
            .catch(err => err)
      }
      this.addMenuModalOps.visible = false;
    },
    //删除菜单
    deleteMenu(record) {
      //父菜单
      if (record.url == undefined) {
        this.$http.get(Api.delParentMenu, {params: {id: record.id}})
            .then(resp => this.$notification.success({message: resp.data.message}))
            .catch(err => err)
      } else {
        this.$http.get(Api.delSubMenu, {params: {id: record.id}})
            .then(resp => this.$notification.success({message: resp.data.message}))
            .catch(err => err)
      }
    }
  },
  mounted() {
    this.getMenuList();
  }
}
</script>

<style scoped>

</style>