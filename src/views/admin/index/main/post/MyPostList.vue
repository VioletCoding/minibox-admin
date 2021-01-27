<!--帖子列表-->
<template>
  <div>
    <div v-if="loading">
      <!--搜索区-->
      <div>
        <a-space>
          <span>帖子ID：</span>
          <a-input style="width: 300px"
                   v-model="searchOps.id"/>
          <span>帖子标题：</span>
          <a-input style="width: 300px"
                   v-model="searchOps.title"/>
          <span>发帖人ID：</span>
          <a-input style="width: 300px"
                   v-model="searchOps.uid"/>
          <a-button type="primary"
                    @click="getPostList">搜索
          </a-button>
        </a-space>
      </div>
      <!--搜索区end-->
      <div style="margin-top: 20px">
        <a-table :columns="columns"
                 :data-source="dataSource"
                 rowKey="id">
          <template #action="record">
            <a-space>
              <a @click="showDetail(record)">详情</a>
              <a-popconfirm title="确定删除这个帖子吗?" @confirm="del(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
        <a-drawer width="1040"
                  placement="right"
                  :closable="drawerOps.closable"
                  :visible="drawerOps.visible"
                  :destroy-on-close="true"
                  @close="drawerOps.visible = false;drawerOps.editing=false">
          <div>
            <a-descriptions title="帖子信息"
                            bordered>
              <a-descriptions-item label="帖子标题"
                                   :span="3">
                <span v-if="!drawerOps.editing">{{ drawerOps.tempData.title }}</span>
                <span v-else><a-input v-model="drawerOps.tempData.title"/></span>
              </a-descriptions-item>
              <a-descriptions-item label="帖子内容"
                                   :span="3">{{ drawerOps.tempData.content }}
              </a-descriptions-item>
              <a-descriptions-item label="帖子ID"
                                   :span="1">{{ drawerOps.tempData.id }}
              </a-descriptions-item>
              <a-descriptions-item label="创建时间"
                                   :span="1">{{ drawerOps.tempData.createDate }}
              </a-descriptions-item>
              <a-descriptions-item label="帖子封面图"
                                   :span="1">
                <a @click="preview(drawerOps.tempData.coverImg)">点击查看</a>
              </a-descriptions-item>
              <a-descriptions-item label="评论数"
                                   :span="1">{{ drawerOps.tempData.countComment }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div v-if="drawerOps.tempData.mbUser"
               style="margin-top: 20px">
            <a-descriptions title="发布者信息"
                            bordered>
              <a-descriptions-item label="昵称"
                                   :span="3">{{ drawerOps.tempData.mbUser.nickname }}
              </a-descriptions-item>
              <a-descriptions-item label="ID"
                                   :span="1">{{ drawerOps.tempData.mbUser.id }}
              </a-descriptions-item>
              <a-descriptions-item label="等级"
                                   :span="1">Lv {{ drawerOps.tempData.mbUser.level }}
              </a-descriptions-item>
              <a-descriptions-item label="头像"
                                   :span="1">
                <a @click="preview(drawerOps.tempData.mbUser.userImg)">点击查看</a>
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div v-if="drawerOps.tempData.mbBlock"
               style="margin-top: 20px">
            <a-descriptions title="版块信息"
                            bordered>
              <a-descriptions-item label="名称"
                                   :span="1">{{ drawerOps.tempData.mbBlock.name }}
              </a-descriptions-item>
              <a-descriptions-item label="ID"
                                   :span="1">{{ drawerOps.tempData.mbBlock.id }}
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div style="margin-top: 20px;">

            <div v-if="!drawerOps.editing">
              <a-button type="primary"
                        @click="drawerOps.editing=true">修改
              </a-button>
            </div>
            <div v-else>
              <a-space>
                <a-button type="primary" @click="save">保存</a-button>
                <a-popconfirm title="确定要取消吗?" @confirm="drawerOps.editing=false">
                  <a-button type="danger">取消</a-button>
                </a-popconfirm>
              </a-space>
            </div>
          </div>
        </a-drawer>
        <a-modal :visible="drawerOps.preview.previewVisible"
                 :footer="null"
                 destory-on-close
                 @cancel="drawerOps.preview.previewVisible=false">
          <img alt="图片加载失败啦..."
               style="width: 100%"
               :src="drawerOps.preview.previewImage"/>
        </a-modal>
      </div>
    </div>

    <div v-else>
      <MyLoading/>
    </div>

  </div>
</template>

<script>
import Api from "@/api/api";
import MyLoading from "@/component/MyLoading";

const columns = [
  {
    dataIndex: "id",
    title: "帖子ID",
    width: "80px"
  },
  {
    dataIndex: "mbUser.id",
    title: "发布者ID",
    width: "90px"
  },
  {
    dataIndex: "mbUser.nickname",
    title: "用户昵称",
    ellipsis: true
  },
  {
    dataIndex: "mbBlock.id",
    title: "版块ID",
    width: "80px"
  },
  {
    dataIndex: "mbBlock.name",
    title: "版块名称"
  },
  {
    dataIndex: "title",
    title: "帖子标题",
    ellipsis: true
  },
  {
    dataIndex: "createDate",
    title: "创建时间"
  },
  {
    key: "action",
    title: "操作",
    scopedSlots: {customRender: "action"}
  }
]
export default {
  name: "MyPostList",
  components: {MyLoading},
  data() {
    return {
      //table的列
      columns,
      //是否正在加载
      loading: false,
      //table数据源
      dataSource: [],
      //搜索可选属性
      searchOps: {
        id: undefined,
        title: undefined,
        uid: undefined
      },
      //抽屉可选属性
      drawerOps: {
        //是否正在编辑
        editing: false,
        //抽屉是否可见
        visible: false,
        //抽屉是否显示右上角的关闭按钮,不显示的话就点击蒙层关闭抽屉,或者按ESC
        closable: false,
        //临时数据
        tempData: {},
        //预览图片可用属性
        preview: {
          //是否显示预览
          previewVisible: false,
          //图片的url
          previewImage: ""
        }
      }
    }
  },
  methods: {
    //获取帖子列表
    getPostList() {
      this.$http.post(Api.postList, this.searchOps)
          .then(resp => this.dataSource = resp.data.data)
          .catch(err => err)
          .finally(() => this.loading = true)
    },
    //预览图片
    preview(url) {
      this.drawerOps.preview.previewImage = url;
      this.drawerOps.preview.previewVisible = true;
    },
    //查看帖子详情
    showDetail(record) {
      this.drawerOps.tempData = record;
      this.drawerOps.visible = true;
    },
    //保存帖子更改
    save() {
      this.$http.post(Api.modifyPost, this.drawerOps.tempData)
          .then(resp => {
            this.$message.success(resp.data.message);
            this.getPostList();
            this.drawerOps.editing = false;
          })
          .catch(err => err)
    },
    //删除帖子
    del(id) {
      this.$http.get(Api.delPost, {params: {id: id}})
          .then(resp => {
            this.$message.success(resp.data.message);
            console.log(resp);
            this.getPostList();
          })
          .catch(err => err)
    }
  },
  mounted() {
    this.getPostList();
  }
}
</script>