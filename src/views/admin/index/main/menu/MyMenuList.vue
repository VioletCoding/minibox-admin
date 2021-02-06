<!--菜单列表-->
<template>
  <div>
    <div v-if="dataFlag">
      <!--搜索区-->
      <div>
        <a-space>
          <span>菜单ID:</span>
          <a-input type="text"
                   style="width: 300px"
                   v-model="searchOps.id"/>
          <span>菜单名称:</span>
          <a-input type="text"
                   style="width: 300px"
                   v-model="searchOps.menuName"/>
          <a-button type="primary"
                    @click="getMenuList">查询
          </a-button>
          <a-button @click="showAddMenuModal">添加</a-button>
        </a-space>
      </div>
      <!--搜索区end-->

      <!--table-->
      <div style="margin-top: 20px">
        <a-table :columns="columns"
                 :data-source="menuList"
                 rowKey="id"
                 :loading="tableOps.isLoading">
          <template #icon="record">
            <a-icon :type="record"/>
            <span style="margin-left: 10px;">{{ record }}</span>
          </template>

          <template #action="record">
            <a-button type="primary"
                      @click="showModal(record)">修改
            </a-button>

            <a-modal :visible="tableOps.modalOps.visible"
                     @cancel="closeModal"
                     @ok="updateMenuInfo"
                     :confirm-loading="tableOps.modalOps.confirmLoading"
                     :mask="false"
                     :destroyOnClose="true"
                     title="修改菜单信息">

              <a-form-model :label-col="{span:4}"
                            :wrapper-col="{span:14}">
                <a-form-model-item label="菜单ID">
                  <a-input v-model="tableOps.modalOps.inputValue.id"
                           :disabled="true"/>
                </a-form-model-item>

                <a-form-model-item label="菜单图标">
                  <a-input v-model="tableOps.modalOps.inputValue.menuIcon">
                    <a-icon v-if="tableOps.modalOps.inputValue.menuIcon != '' "
                            slot="prefix"
                            :type="tableOps.modalOps.inputValue.menuIcon"/>
                  </a-input>
                </a-form-model-item>

                <a-form-model-item label="菜单名称">
                  <a-input v-model="tableOps.modalOps.inputValue.menuName"/>
                </a-form-model-item>

                <a-form-model-item label="菜单路径">
                  <a-input v-model="tableOps.modalOps.inputValue.menuUrl"/>
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

              <a-form-model :label-col="{span:4}"
                            :wrapper-col="{span:14}">

                <a-form-model-item label="菜单图标">
                  <a-input v-model="addMenuModalOps.inputValue.menuIcon">
                    <a-icon v-if="addMenuModalOps.inputValue.menuIcon != '' "
                            slot="prefix"
                            :type="addMenuModalOps.inputValue.menuIcon"/>
                  </a-input>
                </a-form-model-item>

                <a-form-model-item label="菜单名称">
                  <a-input v-model="addMenuModalOps.inputValue.menuName"/>
                </a-form-model-item>

                <a-form-model-item label="菜单路径">
                  <a-input v-model="addMenuModalOps.inputValue.menuUrl"/>
                </a-form-model-item>

              </a-form-model>
            </a-modal>

            <a-popconfirm title="确定要删除这个菜单吗？"
                          @confirm="deleteMenu(record)">
              <a-button type="danger"
                        style="margin-left: 20px;">删除
              </a-button>
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
import util from "@/api/util";
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
    dataIndex: "menuUrl",
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
      dataFlag: false,
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
          inputValue: {}
        }
      },
      //添加按钮的模态框
      addMenuModalOps: {
        //模态框可操作项
        visible: false,
        confirmLoading: false,
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
      this.$http.post(Api.menuList, this.searchOps)
          .then(resp => {
            if (resp.data.code == 200) {
              this.menuList = resp.data.data;
              this.tableOps.isLoading = false;
              this.dataFlag = true;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => this.$message.error(util.errMessage(err)))
    },
    //显示modal，并且把那一列的record存起来方便使用
    showModal(record) {
      this.tableOps.modalOps.visible = true;
      this.tableOps.modalOps.inputValue = record;
    },
    //关闭modal回调
    closeModal() {
      this.tableOps.modalOps.visible = false;
      this.addMenuModalOps.visible = false;
    },
    //修改菜单信息
    updateMenuInfo() {
      this.tableOps.modalOps.confirmLoading = true;
      this.$http.post(Api.menuModify, this.tableOps.modalOps.inputValue)
          .then(resp => {
            if (resp.data.code == 200) {
              this.tableOps.modalOps.confirmLoading = false;
              this.tableOps.modalOps.visible = false;
              this.tableOps.modalOps.inputValue = {};
              this.menuList = resp.data.data;
              this.$notification.success({message: resp.data.message});
            } else {
              this.$notification.warning({message: resp.data.message});
            }
          }).catch(err => this.$message.error(util.errMessage(err)))
          .finally(() => this.reload);
    },
    //显示添加菜单的模态框
    showAddMenuModal(record) {
      this.addMenuModalOps.inputValue = record;
      this.addMenuModalOps.visible = true;
    },
    //添加菜单
    addMenu() {
      this.$http.post(Api.menuAdd, this.addMenuModalOps.inputValue)
          .then(resp => {
            if (resp.data.code == 200) {
              this.$notification.success({message: resp.data.message});
              this.getMenuList();
            } else {
              this.$notification.warning({message: resp.data.message});
            }
          }).catch(err => this.$message.error(util.errMessage(err)))
          .finally(() => this.addMenuModalOps.visible = false);
    },
    //删除菜单
    deleteMenu(record) {
      this.$http.get(Api.menuDelete, {params: {id: record.id}})
          .then(resp => {
            if (resp.data.code == 200) {
              this.$notification.success({message: resp.data.message});
              this.getMenuList();
            } else {
              this.$notification.warning({message: resp.data.message});
            }
          }).catch(err => this.$message.error(util.errMessage(err)))
    }
  },
  mounted() {
    this.getMenuList();
  }
}
</script>