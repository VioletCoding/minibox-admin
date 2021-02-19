<template>
  <div>
    <div v-if="!loading">
      <a-button @click="openModal" :loading="loadingGame" style="margin-bottom: 20px">添加</a-button>
      <a-table :data-source="tagList" :columns="columns" rowKey="id">
        <template #operation="text, record">
          <a-popconfirm title="确定删除？" @confirm="deleteTag(record.id,record.gameId)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
      <a-modal v-model="modalVisible"
               title="添加标签"
               @ok="saveTag"
               :confirmLoading="confirmLoading"
               :destroyOnClose="true">
        <a-form-model :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="标签名称">
            <a-input placeholder="标签名称" v-model="tagModel.tagName" ref="tagName"/>
          </a-form-model-item>
          <a-form-model-item label="关联游戏">
            <a-auto-complete backfill
                             placeholder="选择游戏"
                             ref="gameId"
                             :data-source="gameList"
                             v-model="tagModel.gameId"/>
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
import util from "@/api/util";
import api from "@/api/api";

const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: "标签名",
    dataIndex: "tagName",
  },
  {
    title: "游戏id",
    dataIndex: "gameId",
  },
  {
    title: "状态",
    dataIndex: "state",
  },
  {
    title: "创建日期",
    dataIndex: "createDate",
  },
  {
    title: "更新日期",
    dataIndex: "updateDate",
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: {customRender: 'operation'},
  }
]
export default {
  name: "MyTagList",
  components: {MyLoading},
  data() {
    return {
      loading: false,
      loadingGame: false,
      confirmLoading: false,
      columns,
      tagList: [],
      gameList: [],
      modalVisible: false,
      tagModel: {
        tagName: "",
        gameId: undefined
      }
    }
  },
  methods: {
    loadTag() {
      this.loading = true;
      this.$http.post(api.tagList, this.search)
          .then(resp => {
            if (resp.data.code === 200) {
              this.tagList = resp.data.data;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => util.errMessage(err))
          .finally(() => this.loading = false);
    },
    saveTag() {
      this.confirmLoading = true;
      if (util.isNullOrEmpty(this.tagModel.tagName)) {
        this.$refs.tagName.focus();
        this.$message.warning("请输入标签名");
        this.confirmLoading = false;
      } else if (util.isNullOrEmpty(this.tagModel.gameId)) {
        this.$refs.gameId.focus();
        this.$message.warning("请选择需要关联的游戏");
        this.confirmLoading = false;
      } else {
        this.tagModel.gameId = this.tagModel.gameId.split("-")[0];
        this.$http.post(api.tagSave, this.tagModel)
            .then(resp => {
              if (resp.data.code === 200) {
                this.tagList = resp.data.data;
                this.$message.success(resp.data.message);
                this.closeModal();
              } else {
                this.$message.warning(resp.data.message);
              }
            }).catch(err => util.errMessage(err))
            .finally(() => this.confirmLoading = false);
      }
    },
    deleteTag(id, gameId) {
      if (util.isNullOrEmpty(id) || util.isNullOrEmpty(gameId)) {
        return 0;
      } else {
        this.$http.get(api.tagRemove, {params: {id: id, gameId: gameId}})
            .then(resp => {
              if (resp.data.code === 200) {
                this.$message.success(resp.data.message);
                this.tagList = resp.data.data;
              } else {
                this.$message.warning(resp.data.message);
              }
            }).catch(err => util.errMessage(err));
      }
    },
    async openModal() {
      await this.loadGameList();
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
    },
    loadGameList() {
      this.loadingGame = true;
      this.$http.post(api.gameList)
          .then(resp => {
            if (resp.data.code === 200) {
              let format = [];
              resp.data.data.forEach(game => {
                game = game.id + "-" + game.name;
                format.push(game);
              });
              this.gameList = format;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => util.errMessage(err))
          .finally(() => this.loadingGame = false);
    }
  },
  mounted() {
    this.loadTag();
  }
}
</script>