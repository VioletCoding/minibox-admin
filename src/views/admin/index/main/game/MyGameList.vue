<!--游戏列表-->
<template>
  <div>
    <div v-if="dataFlag">
      <!--搜索区-->
      <div>
        <a-space>
          <span>游戏ID:</span>
          <a-input style="width: 300px"
                   v-model="searchOps.id"/>
          <span>游戏名称:</span>
          <a-input style="width: 300px"
                   v-model="searchOps.name"/>
          <a-button type="primary"
                    @click="searchGame">搜索
          </a-button>
          <a-button type="primary"
                    @click="addGameOps.visiale=true">添加
          </a-button>
        </a-space>
      </div>
      <!--搜索区end-->
      <!--table-->
      <div style="margin-top: 20px">
        <a-table :columns="columns"
                 :data-source="dataSource"
                 rowKey="id">
          <template #expandedRowRender="record">
            <p style="text-align: center;font-size: 20px">{{ record.description }}</p>
            <img :src="record.photoLink"
                 alt="图片加载失败"
                 style="width:100%;height:500px;object-fit: contain"/>
          </template>

          <template #action="text,record,index">
            <span>
                <a-button type="primary"
                          @click="edit(record)">修改</a-button>
              <a-popconfirm title="你确定要删除这个游戏吗？"
                            @confirm="delGame(record.id)">
                <a-button type="danger"
                          style="margin-left: 20px;">删除</a-button>
                </a-popconfirm>
            </span>
          </template>
        </a-table>
      </div>
      <!--table end-->
      <!--Drawer 修改游戏 抽屉-->
      <div>
        <a-drawer title="修改游戏"
                  :width="720"
                  :visible="drawerOps.visible"
                  @close="()=>this.drawerOps.visible=false"
                  :destroyOnClose="true">
          <a-form-model :label-col="{span:4}"
                        :wrapper-col="{span:14}">
            <a-form-model-item label="游戏名称">
              <a-input v-model="drawerOps.tempData.name"/>
            </a-form-model-item>
            <a-form-model-item label="现价(人民币)">
              <a-input v-model="drawerOps.tempData.price"/>
            </a-form-model-item>
            <a-form-model-item label="原价(人民币)">
              <a-input v-model="drawerOps.tempData.originPrice"/>
            </a-form-model-item>
            <a-form-model-item label="记录状态">
              <a-input v-model="drawerOps.tempData.state"/>
            </a-form-model-item>
            <a-form-model-item label="开发商">
              <a-input v-model="drawerOps.tempData.developer"/>
            </a-form-model-item>
            <a-form-model-item label="发行商">
              <a-input v-model="drawerOps.tempData.publisher"/>
            </a-form-model-item>
            <a-form-model-item label="游戏描述">
              <a-input v-model="drawerOps.tempData.description"/>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{span:14,offset:4}">
              <a-button type="primary"
                        @click="onDraweOk">确定
              </a-button>
              <a-button type="danger"
                        style="margin-left: 50px;">取消
              </a-button>
            </a-form-model-item>

            <a-form-model-item label="游戏封面图">
              <div class="clearfix">
                <a-upload
                    :action="drawerOps.uploadOps.action"
                    list-type="picture-card"
                    :file-list="drawerOps.uploadOps.fileList"
                    name="multipartFile"
                    :headers="drawerOps.uploadOps.headers"
                    @preview="preview"
                    @change="handleChange">

                  <div v-if="drawerOps.uploadOps.fileList.length < 1">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">Upload</div>
                  </div>

                </a-upload>
                <a-modal :visible="drawerOps.uploadOps.previewVisible"
                         :footer="null"
                         @cancel="handleCancel">
                  <img alt="example"
                       style="width: 100%"
                       :src="drawerOps.uploadOps.previewImage"/>
                </a-modal>
              </div>
            </a-form-model-item>

          </a-form-model>
        </a-drawer>
      </div>
      <!--Drawer 修改游戏  抽屉 end-->
      <!--Drawer 新增游戏 抽屉-->
      <div>
        <a-drawer title="新增游戏"
                  :width="720"
                  :visible="addGameOps.visiale"
                  :body-style="{ paddingBottom: '80px' }"
                  @close="addGameOps.visiale=false"
                  :destroy-on-close="true">

          <a-form-model :label-col="{span:4}"
                        :wrapper-col="{span:14}">

            <a-form-model-item label="游戏名称">
              <a-input v-model="addGameOps.input.name"
                       :maxLength="40"/>
            </a-form-model-item>

            <a-form-model-item label="游戏现价">
              <a-input-number :min="0.00"
                              :step="0.01"
                              v-model="addGameOps.input.price"/>
            </a-form-model-item>

            <a-form-model-item label="游戏原价">
              <a-input-number :min="0.00"
                              :step="0.01"
                              v-model="addGameOps.input.originPrice"/>
            </a-form-model-item>

            <a-form-model-item label="发布时间">
              <a-date-picker v-model="addGameOps.input.releaseTime"/>
            </a-form-model-item>

            <a-form-model-item label="开发商">
              <a-input v-model="addGameOps.input.developer"
                       :maxLength="255"/>
            </a-form-model-item>

            <a-form-model-item label="发行商">
              <a-input v-model="addGameOps.input.publisher"
                       :maxLength="255"/>
            </a-form-model-item>

            <a-form-model-item label="游戏描述">
              <a-textarea v-model="addGameOps.input.description"
                          :auto-size="true"
                          :allowClear="true"
                          :maxLength="4000"/>
            </a-form-model-item>

            <a-form-model-item label="游戏封面图">
              <div class="clearfix">
                <a-upload
                    :action="drawerOps.uploadOps.action"
                    list-type="picture-card"
                    :file-list="addGameOps.uploadOps.fileList"
                    name="multipartFile"
                    :headers="drawerOps.uploadOps.headers"
                    @preview="addGamehandlePreview"
                    @change="addGamehandleChange">

                  <div v-if="addGameOps.uploadOps.fileList.length < 1">
                    <a-icon type="plus"/>
                    <div>Upload</div>
                  </div>

                </a-upload>
                <a-modal :visible="addGameOps.uploadOps.previewVisible"
                         :footer="null"
                         @cancel="addGameOps.uploadOps.previewVisible = false">
                  <img alt="example"
                       style="width: 100%"
                       :src="addGameOps.uploadOps.previewImage"/>
                </a-modal>
              </div>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{span:14,offset:4}">
              <a-button type="primary"
                        @click="addGameOnDraweOk">确定
              </a-button>
            </a-form-model-item>

          </a-form-model>

        </a-drawer>
      </div>
      <!--Drawer 新增游戏 抽屉end-->
    </div>
    <div v-else>
      <MyLoading/>
    </div>
  </div>
</template>

<script>
import Api from "@/api/api";
import util from "@/api/util";
import MyLoading from "@/component/MyLoading";

const columns = [
  {
    dataIndex: "id",
    title: "游戏ID",
    width: "75px"
  },
  {
    dataIndex: "name",
    title: "游戏名称"
  },
  {
    dataIndex: "price",
    title: "现价￥",
    width: "75px"
  },
  {
    dataIndex: "originPrice",
    title: "原价￥",
    width: "75px"
  },
  {
    dataIndex: "state",
    title: "记录状态",
    width: "90px"
  },
  {
    dataIndex: "score",
    title: "游戏评分",
    width: "90px"
  },
  {
    dataIndex: "releaseTime",
    title: "发布时间",
    width: "120px"
  },
  {
    dataIndex: "developer",
    title: "开发商",
    width: "150px"
  },
  {
    dataIndex: "publisher",
    title: "发行商",
    width: "150px"
  },
  {
    dataIndex: "createDate",
    title: "创建日期"
  },
  {
    dataIndex: "updateDate",
    title: "更新日期"
  },
  {
    key: "action",
    title: "操作",
    scopedSlots: {customRender: "action"}
  }
];

//获取图片的base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default {
  name: "MyGameList",
  components: {MyLoading},
  data() {
    return {
      //table 列
      columns,
      //table 数据源
      dataSource: [],
      //搜索可用条件
      searchOps: {
        id: undefined,
        name: undefined
      },
      //新增游戏可选属性
      addGameOps: {
        visiale: false,
        tempData: {},
        input: {
          name: "",
          price: undefined,
          originPrice: undefined,
          releaseTime: undefined,
          developer: "",
          publisher: "",
          description: "",
          photoLink: ""
        },
        uploadOps: {
          previewImage: "",
          previewVisible: false,
          fileList: []
        }
      },
      //修改游戏抽屉可选属性
      drawerOps: {
        visible: false,
        tempData: {},
        //上传可选属性
        uploadOps: {
          previewImage: "",
          previewVisible: false,
          action: "http://192.168.0.105:20001/" + Api.upload,
          fileList: [],
          headers: {
            accessToken: util.getLoginUserToken()
          }
        },
      },
      //数据标识
      dataFlag: false,
    };
  },
  methods: {
    getGameList() {
      this.$http.post(Api.gameList)
          .then(resp => {
            if (resp.data.code == 200) {
              this.dataSource = resp.data.data;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => this.$message.error(util.errMessage(err)))
          .finally(() => this.dataFlag = true)
    },
    //点击 table 每行的修改按钮时
    edit(record) {
      this.drawerOps.visible = true;
      this.drawerOps.tempData = record;
    },
    //预览图关闭
    handleCancel() {
      this.drawerOps.uploadOps.previewVisible = false;
    },
    //预览
    preview() {
      this.drawerOps.uploadOps.previewImage = this.drawerOps.tempData.photoLink;
      this.drawerOps.uploadOps.previewVisible = true;
    },
    //上传的文件列表发生改变时
    handleChange({fileList}) {
      this.drawerOps.uploadOps.fileList = fileList;
      if (fileList[0].status == "done") {
        if (fileList[0].response.code == 200) {
          this.drawerOps.tempData.photoLink = fileList[0].response.data.images[0];
          this.onDraweOk();
        } else {
          this.$notification.warning({message: fileList[0].response.message});
        }
      }
    },
    //点击抽屉里的确定时
    onDraweOk() {
      this.$http.post(Api.gameModify, this.drawerOps.tempData)
          .then(resp => {
            if (resp.data.code == 200) {
              this.$notification.success({message: resp.data.message});
              this.drawerOps.visible = false;
              this.dataSource = resp.data.data;
            } else {
              this.$notification.warning({message: resp.data.message});
            }
          }).catch(err => this.$message.error(util.errMessage(err)))
    },
    //搜索游戏
    searchGame() {
      this.$http.post(Api.gameList, this.searchOps)
          .then(resp => {
            if (resp.data.code == 200) {
              this.dataSource = resp.data.data;
            } else {
              this.$message.warning(resp.data.message);
            }
          }).catch(err => this.$message.error(util.errMessage(err)));
    },
    //添加游戏文件列表发生改变时
    addGamehandleChange({fileList}) {
      this.addGameOps.uploadOps.fileList = fileList;
      if (fileList[0].status == "done") {
        if (fileList[0].response.code == 200) {
          this.addGameOps.input.photoLink = fileList[0].response.data.images[0];
        } else {
          this.$notification.warning({message: fileList[0].response.message});
        }
      }
    },
    //添加游戏预览图片
    async addGamehandlePreview() {
      this.addGameOps.uploadOps.previewImage = this.addGameOps.input.photoLink;
      this.addGameOps.uploadOps.previewVisible = true;
    },
    //添加游戏
    addGameOnDraweOk() {
      this.$http.post(Api.gameAdd, this.addGameOps.input)
          .then(resp => {
            if (resp.data.code == 200) {
              this.$notification.success({message: resp.data.message})
              this.addGameOps.visiale = false;
              this.dataSource = resp.data.data;
            } else {
              this.$notification.warning({message: resp.data.message})
            }
          }).catch(err => this.$message.error(util.errMessage(err)));
    },
    //删除游戏
    delGame(id) {
      this.$http.get(Api.gameDelete, {params: {id: id}})
          .then(resp => {
            if (resp.data.code == 200) {
              this.$notification.success({message: resp.data.message});
              this.dataSource = resp.data.data;
            } else {
              this.$notification.warning({message: resp.data.message});
            }
          }).catch(err => this.$message.error(util.errMessage(err)))
    }
  },
  mounted() {
    this.getGameList();
  }
}
</script>