<!--版块管理-->
<template>
  <div>
    <div v-if="!loading">

      <div style="margin-bottom: 20px">
        <a-button type="primary"
                  @click="getGameIdList">添加版块
        </a-button>
        <a-modal title="添加新版块"
                 :visible="modalOps.visible"
                 @cancel="modalOps.visible=false"
                 :confirmLoading="modalOps.loading"
                 @ok="addBlock">
          <a-form-model :label-col="{span:5}"
                        :wrapper-col="{span:16}"
                        :model="modalOps.data"
                        :rules="modalOps.rules">
            <a-form-model-item label="版块名称"
                               prop="name"
                               hasFeedback>
              <a-input v-model="modalOps.data.name"
                       placeholder="请输入版块名称"/>
            </a-form-model-item>
            <a-form-model-item label="关联游戏ID">
              <a-auto-complete
                  v-model="modalOps.data.gid"
                  :data-source="gameDataSource"
                  style="width: 150px"
                  @blur="onBlur"
                  backfill
                  placeholder="点击此处选择"/>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </div>

      <a-table :columns="columns"
               :data-source="dataSource"
               row-key="id">
        <template #action="record">
          <a-space>
            <!--修改和删除-->
            <span>
            <a-space>
              <a @click="updateBlock(record)">修改</a>
              <a-popconfirm title="确定要删除这个版块吗?"
                            @confirm="delBlock(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </a-space>
          </span>
            <!--修改和删除 end-->
          </a-space>
        </template>
      </a-table>
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

const columns = [
  {
    dataIndex: "id",
    title: "版块ID"
  },
  {
    dataIndex: "name",
    title: "版块名称"
  },
  {
    dataIndex: "gid",
    title: "关联的游戏ID"
  },
  {
    dataIndex: "state",
    title: "记录状态"
  },
  {
    dataIndex: "updateTime",
    title: "更新时间"
  },
  {
    dataIndex: "createTime",
    title: "创建时间"
  },
  {
    key: "action",
    title: "操作",
    scopedSlots: {customRender: 'action'}
  }
]
export default {
  name: "MyBlockList",
  components: {MyLoading},
  data() {
    return {
      //是否正在加载
      loading: true,
      //table 列
      columns,
      //table 数据源
      dataSource: [],
      //自动完成的数据源
      gameDataSource: [],
      //modal可选属性
      modalOps: {
        data: {
          name: "",
          gid: undefined,
        },
        rules: {
          name: [{
            trigger: ['change', 'blur'],
            required: true,
            message: "版块名字不能为空",
            whitespace: true,
            max: 40,
            min: 1
          }]
        },
        visible: false,
        loading: false
      }
    }
  },
  methods: {
    //获取版块信息
    getBlockList() {
      this.$http.post(Api.getBlock)
          .then(resp => this.dataSource = resp.data.data)
          .catch(err => this.$message.error(util.errMessage(err)))
          .finally(() => this.loading = false)
    },
    getGameIdList() {
      this.modalOps.visible = true;
      this.$http.post(Api.gameList)
          .then(resp => {
            let idArr = [];
            resp.data.data.filter(item => idArr.push(item.id + ''));
            this.gameDataSource = idArr;
          })
          .catch(err => util.errMessage(err))
    },
    //校验选择的gid是否是返回的gid,(主要是防止手动输入)
    onBlur() {
      let data = this.gameDataSource;
      for (let i of data) {
        if (i == this.modalOps.data.gid)
          return true;
      }
      return false;
    },
    //添加版块
    addBlock() {
      this.modalOps.loading = true;
      if (this.onBlur()) {
        this.$http.post(Api.addBlock, this.modalOps.data)
            .then(resp => {
              if (resp.data.code == 200) {
                this.modalOps.loading = false;
                this.$message.success(resp.data.message);
                this.getBlockList();
                return 0;
              }
              this.$message.warning(resp.data.message);
            })
            .catch(err => this.$message.error(util.errMessage(err)));
      } else {
        this.$message.warning("请从菜单中选择游戏ID,不要手动输入");
      }
    },
    //更新版块信息
    updateBlock() {
    },
    //删除版块
    delBlock(id) {
      this.$http.get(Api.delBlock, {params: {id: id}})
          .then(resp => {
            if (resp.data.code != 200) {
              this.$message.warning(resp.data.message);
              return 0;
            }
            this.$message.success(resp.data.message);
            this.getBlockList();
          })
          .catch(err => this.$message.error(util.errMessage(err)))
    }
  },
  mounted() {
    this.getBlockList();
  }
}
</script>

<style scoped>

</style>