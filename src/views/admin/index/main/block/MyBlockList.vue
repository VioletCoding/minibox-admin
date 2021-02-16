<!--版块管理-->
<template>
  <div>
    <div v-if="!loading">
      <div style="margin-bottom: 20px">
        <a-button type="primary" @click="modalOps.visible=true">添加版块
        </a-button>
        <a-modal title="添加新版块" :visible="modalOps.visible" @cancel="modalOps.visible=false"
                 :confirmLoading="modalOps.loading" @ok="addBlock">
          <a-form-model :label-col="{span:5}" :wrapper-col="{span:16}">
            <a-form-model-item label="版块名称">
              <a-input v-model="modalOps.data.name" placeholder="请输入版块名称"/>
            </a-form-model-item>
            <a-form-model-item label="关联游戏">
              <a-auto-complete style="width: 250px" @blur="onBlur"
                               backfill :data-source="gameDataSource"
                               v-model="modalOps.data.gameId" placeholder="点击此处选择"/>
            </a-form-model-item>
            <a-form-model-item label="版块封面图">
              <div class="clearfix">
                <a-upload :action="action" list-type="picture-card"
                          :file-list="modalOps.fileList" name="multipartFile"
                          :headers="headers" @preview="preview(modalOps.data.photoLink)"
                          @change="handleChange">
                  <div v-if="modalOps.fileList.length < 1">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </div>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </div>
      <a-table :columns="columns" :data-source="dataSource" row-key="id">

        <template #photoLink="record">
          <a @click="preview(record)">点击查看</a>
        </template>

        <template #action="record">
          <a-space>
            <!--修改和删除-->
            <span>
            <a-space>
              <a @click="beforUpdate(record)">修改</a>
              <a-popconfirm title="确定要删除这个版块吗?" @confirm="delBlock(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </a-space>
          </span>
            <!--修改和删除 end-->
          </a-space>
        </template>
      </a-table>

      <div>
        <a-modal :visible="modalOps.previewVisible" :footer="null"
                 @cancel="modalOps.previewVisible=false">
          <img alt="加载失败" style="width: 100%" :src="modalOps.previewImage"/>
        </a-modal>
      </div>


      <div>
        <a-drawer title="更改版块信息" placement="right" width="540px"
                  :visible="drwerOps.visible" @close="drwerOps.visible=false" :closable="false">
          <a-form-model :label-col="{span:5}" :wrapper-col="{span:16}">
            <a-form-model-item label="版块名称">
              <a-input v-model="drwerOps.recordData.name" placeholder="请输入版块名称"/>
            </a-form-model-item>
            <a-form-model-item label="关联游戏">
              <a-input v-model="drwerOps.recordData.gameId"/>
            </a-form-model-item>
            <a-form-model-item label="版块封面图">
              <div class="clearfix">
                <a-upload :action="action" list-type="picture-card"
                          :file-list="modalOps.updateList" name="multipartFile"
                          :headers="headers" @preview="preview(drwerOps.recordData.photoLink)"
                          @change="updateChange">
                  <div v-if="modalOps.updateList.length < 1">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </div>
            </a-form-model-item>
            <a-form-model-item label="操作">
              <a-button type="primary" @click="updateBlock">确定
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-drawer>
      </div>
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
    dataIndex: "gameId",
    title: "关联的游戏ID"
  },
  {
    dataIndex: "photoLink",
    title: "版块图片",
    scopedSlots: {customRender: 'photoLink'}
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
      action: util.ACTION,
      headers: util.HEADERS,
      //自动完成的数据源
      gameDataSource: [],
      //modal可选属性
      modalOps: {
        fileList: [],
        updateList: [],
        previewVisible: false,
        data: {
          name: "",
          gameId: undefined,
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
      },
      //抽屉可选属性
      drwerOps: {
        visible: false,
        recordData: {}
      }
    }
  },
  methods: {
    //上传的文件列表发生改变时
    handleChange({fileList}) {
      this.modalOps.fileList = fileList;
      if (fileList[0].status == "done") {
        if (fileList[0].response.code == 200) {
          this.modalOps.data.photoLink = fileList[0].response.data.images[0];
        } else {
          this.$notification.warning({message: fileList[0].response.message});
        }
      }
    },
    updateChange({fileList}) {
      this.modalOps.updateList = fileList;
      if (fileList[0].status == "done") {
        if (fileList[0].response.code == 200) {
          this.drwerOps.recordData.photoLink = fileList[0].response.data.images[0];
          this.updateBlock();
        } else {
          this.$notification.warning({message: fileList[0].response.message});
        }
      }
    },
    //预览
    preview(url) {
      this.modalOps.previewImage = url;
      this.modalOps.previewVisible = true;
    },
    //预览图关闭
    handleCancel() {
      this.modalOps.previewVisible = false;
    },
    //获取版块信息
    getBlockList() {
      this.$http.post(Api.blockList)
          .then(resp => {
            if (resp.data.code == 200) {
              this.dataSource = resp.data.data;
              console.log(this.dataSource);
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => this.$message.error(util.errMessage(err)))
          .finally(() => this.loading = false)
    },
    //获取游戏信息
    getGameIdList() {
      this.$http.post(Api.gameList)
          .then(resp => {
            if (resp.data.code == 200) {
              this.gameDataSource = resp.data.data;
              let idArr = [];
              this.gameDataSource.filter(item => idArr.push(item.id + "-" + item.name));
              this.gameDataSource = idArr;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => util.errMessage(err));
    },
    //校验选择的gameId是否是返回的gameId,(主要是防止手动输入)
    onBlur() {
      let data = this.gameDataSource;
      for (let i of data) {
        if (i == this.modalOps.data.gameId)
          return true;
      }
      return false;
    },
    //添加版块
    addBlock() {
      //先判空
      if (this.modalOps.data.name.trim() == "") {
        return this.$message.warning("游戏名字不能为空");
      }
      //判断下是不是从下拉框选择的游戏
      if (this.onBlur()) {
        this.modalOps.loading = true;
        //分隔一下字符串，取前面的id
        let split = this.modalOps.data.gameId.split("-");
        this.modalOps.data.gameId = split[0];
        this.$http.post(Api.blockAdd, this.modalOps.data)
            .then(resp => {
              if (resp.data.code == 200) {
                this.modalOps.loading = false;
                this.modalOps.visible = false;
                this.$message.success(resp.data.message);
                this.dataSource = resp.data.data;
              } else {
                this.$message.warning(resp.data.message);
              }
            }).catch(err => this.$message.error(util.errMessage(err)));
      } else {
        this.$message.warning("请从下拉框中选择游戏,不要手动输入");
      }
    },
    beforUpdate(record) {
      this.drwerOps.recordData = record;
      this.drwerOps.visible = true;
    },
    //更新版块信息
    updateBlock() {
      this.$http.post(Api.blockModify, this.drwerOps.recordData)
          .then(resp => {
            if (resp.data.code == 200) {
              this.dataSource = resp.data.data;
              this.$message.success(resp.data.message);
            } else {
              this.$message.success(resp.data.message);
            }
          }).catch(err => util.errMessage(err))
          .finally(() => this.drwerOps.visible = false);
    },
    //删除版块
    delBlock(id) {
      this.$http.get(Api.blockDelete, {params: {id: id}})
          .then(resp => {
            if (resp.data.code != 200) {
              this.$message.warning(resp.data.message);
              return 0;
            }
            this.$message.success(resp.data.message);
            this.getBlockList();
          }).catch(err => this.$message.error(util.errMessage(err)))
    }
  },
  mounted() {
    this.getBlockList();
    this.getGameIdList();
  }
}
</script>