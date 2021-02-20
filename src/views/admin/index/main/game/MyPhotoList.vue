<template>
  <div>
    <div v-if="!loading">
      <a-button style="margin-bottom: 20px" @click="openModal">添加</a-button>
      <a-table :data-source="photoList" :columns="columns" rowKey="id">
        <template #photoLink="text,record">
          <a @click="preview(text)">点击查看</a>
        </template>
        <template #ops="text, record">
          <a-popconfirm title="确定删除?" @confirm="confirmDelete(record.id,record.gameId)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>

      <a-modal v-model="modalVisible"
               title="给游戏添加预览图片"
               @ok="savePhoto"
               :confirmLoading="confirmLoading"
               :destroyOnClose="true">
        <a-form-model :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="选择游戏">
            <a-auto-complete backfill
                             placeholder="选择游戏"
                             ref="gameId"
                             :data-source="gameList"
                             v-model="photoModel.gameId"/>
          </a-form-model-item>
          <a-form-model-item label="上传图片">
            <a-upload-dragger :action="action"
                              :headers="headers"
                              name="multipartFile"
                              list-type="picture-card"
                              @preview="preview(previewImage)"
                              @change="uploadChange">
              <div>
                <a-icon type="upload"/>
                拖拽上传
              </div>
            </a-upload-dragger>
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <a-modal :footer="null" :visible="previewVisible" @cancel="cancelPreview">
        <img :src="previewImage" alt="加载失败" style="width: 100%;height: 300px;object-fit: cover">
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
    title: "id",
    dataIndex: "id"
  },
  {
    title: "图片",
    dataIndex: "photoLink",
    width: "200px",
    scopedSlots: {customRender: "photoLink"}
  },
  {
    title: "游戏id",
    dataIndex: "gameId"
  },
  {
    title: "状态",
    dataIndex: "state"
  },
  {
    title: "创建日期",
    dataIndex: "createDate"
  },
  {
    title: "更新日期",
    dataIndex: "updateDate"
  },
  {
    title: "操作",
    dataIndex: "ops",
    scopedSlots: {customRender: "ops"}
  },
]
export default {
  name: "MyPhotoList",
  components: {MyLoading},
  data() {
    return {
      loading: false,
      confirmLoading: false,
      modalVisible: false,
      photoList: [],
      photoModel: {
        gameId: undefined,
        photoLink: ""
      },
      action: util.ACTION,
      headers: util.HEADERS,
      previewImage: "",
      previewVisible: false,
      gameList: [],
      columns
    }
  },
  methods: {
    confirmDelete(id, gameId) {
      if (!util.isNullOrEmpty(id) && !util.isNullOrEmpty(gameId)) {
        this.$http.get(api.photoRemove, {params: {id: id, gameId: gameId}})
            .then(resp => {
              if (resp.data.code === 200) {
                this.photoList = resp.data.data;
                this.$message.success(resp.data.message);
              } else {
                this.$message.warning(resp.data.message);
              }
            }).catch(err => util.errMessage(err));
      }
    },
    loadPhotoList() {
      this.loading = true;
      this.$http.post(api.photoList)
          .then(resp => {
            if (resp.data.code === 200) {
              this.photoList = resp.data.data;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => util.errMessage(err))
          .finally(() => this.loading = false);
    },
    loadGameList() {
      this.$http.post(api.gameList)
          .then(resp => {
            if (resp.data.code === 200) {
              let result;
              let temp = [];
              result = resp.data.data;
              result.forEach(r => {
                temp.push(r.id + "-" + r.name)
              });
              this.gameList = temp;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => util.errMessage(err));
    },
    async openModal() {
      await this.loadGameList();
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
    },
    preview(url) {
      this.previewImage = url;
      this.previewVisible = true;
    },
    cancelPreview() {
      this.previewVisible = false;
    },
    uploadChange(info) {
      const status = info.file.status;
      if (status === 'done') {
        if (info.file.response.code === 200) {
          this.previewImage = info.file.response.data.images[0];
          this.photoModel.photoLink = this.previewImage;
          this.$message.success(info.file.response.message);
        } else {
          this.$message.warning(info.file.response.message);
        }
      } else if (status === 'error') {
        this.$message.error(`上传失败,${info.file.response.message}`);
      }
    },
    savePhoto() {
      this.confirmLoading = true;
      let gameId = this.photoModel.gameId.split("-")[0];
      let photoModel = this.photoModel;
      photoModel.gameId = gameId;
      this.$http.post(api.photoSave, photoModel)
          .then(resp => {
            if (resp.data.code === 200) {
              this.$message.success(resp.data.message);
              this.photoList = resp.data.data;
              this.closeModal();
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => util.errMessage(err))
          .finally(() => this.confirmLoading = false);
    }
  },
  mounted() {
    this.loadPhotoList();
  }
}
</script>