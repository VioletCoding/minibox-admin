<!--游戏列表-->
<template>
  <div v-if="dataFlag" style="background-color: white;padding: 20px">
    <!--搜索区-->
    <div>
      <span>游戏ID：</span>
      <a-input style="width: 300px"/>
      <span style="margin-left: 20px">游戏名称：</span>
      <a-input style="width: 300px"/>
      <a-button type="primary" style="margin-left: 20px">搜索</a-button>
      <a-button type="primary" style="margin-left: 20px">添加</a-button>
    </div>
    <!--搜索区end-->

    <!--table-->
    <div style="margin-top: 20px">
      <a-table :columns="columns" :data-source="dataSource" rowKey="id">
        <template #expandedRowRender="record">
          <p style="text-align: center;font-size: 20px">{{ record.description }}</p>
          <img :src="record.coverImg" alt="图片加载失败" style="width: 100%;height: 80%;background-size: cover"/>
        </template>

        <template
            v-for="(col,key) in ['name','price','originPrice','state','gameState','score','releaseTime','developer','publisher']"
            :slot="col"
            slot-scope="text,record,index">
          <div>
            <span v-if="record.editable">
              <a-input v-model="text"/>
            </span>

            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>

        <template #action="text,record,index">
          <div>
            <span v-if="record.editable">
                <a>保存</a>
                <a-popconfirm title="确定要取消？" @confirm="() => cancel(record.id)">
                    <a style="margin-left: 20px;">取消</a>
                  </a-popconfirm>
              </span>

            <span v-else>
                <a :disabled="editingKey != undefined " @click="()=> edit(record.id)">修改</a>
                <a :disabled="editingKey != undefined " style="margin-left: 20px;">删除</a>
            </span>
          </div>
        </template>
      </a-table>
    </div>
    <!--table end-->
  </div>
</template>

<script>
import Api from "@/api/api";

const columns = [
  {
    dataIndex: "id",
    title: "游戏ID",
    width: "75px"
  },
  {
    dataIndex: "name",
    title: "游戏名称",
    scopedSlots: {customRender: "name"}
  },
  {
    dataIndex: "price",
    title: "现价￥",
    width: "75px",
    scopedSlots: {customRender: "price"}
  },
  {
    dataIndex: "originPrice",
    title: "原价￥",
    width: "75px",
    scopedSlots: {customRender: "originPrice"}
  },
  {
    dataIndex: "state",
    title: "记录状态",
    width: "90px",
    scopedSlots: {customRender: "state"}
  },
  {
    dataIndex: "gameState",
    title: "游戏状态",
    width: "90px",
    scopedSlots: {customRender: "gameState"}
  },
  {
    dataIndex: "score",
    title: "游戏评分",
    width: "90px",
    scopedSlots: {customRender: "score"}
  },
  {
    dataIndex: "releaseTime",
    title: "发布时间",
    width: "120px",
    scopedSlots: {customRender: "releaseTime"}
  },
  {
    dataIndex: "developer",
    title: "开发商",
    width: "150px",
    scopedSlots: {customRender: "developer"}
  },
  {
    dataIndex: "publisher",
    title: "发行商",
    width: "150px",
    scopedSlots: {customRender: "publisher"}
  },
  {
    dataIndex: "scoreCount",
    title: "评分数",
    width: "75px"
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
]
export default {
  name: "MyGameList",
  data() {
    return {
      columns,
      dataSource: [],
      dataFlag: false,
      editingKey: undefined
    }
  },
  methods: {
    getGameList() {
      this.$http.post(Api.gameList)
          .then(resp => this.dataSource = resp.data.data)
          .catch(err => err)
          .finally(f => this.dataFlag = true)
    },
    //点击修改时
    edit(id) {
      let newData = this.dataSource;
      //当传进来的id 等于数据源里某一列的id时，把这一列的数据存起来，因为id是唯一值，所以filter后的数组长度肯定为1，那么直接取第一个就能得到对象，省了一步遍历
      let target = newData.filter(item => id == item.id)[0];
      //只能修改 当前正在修改的列 ，其他列做判断，禁用
      this.editingKey = id;
      //如果target不为空
      if (target) {
        //为了显示input框
        target.editable = true;
        //更新下原数组里的内容，本质就是在你编辑那行里加了个属性 editable = true
        this.dataSource = newData;
      }

    },
    //取消
    cancel(id) {
      console.log("adadada")
      let newData = this.dataSource;
      let target = newData.filter(item => id == item.id)[0];
      this.editingKey = undefined;
      if (target) {
        Object.assign(target, this.cacheData.filter(item => id == item.id)[0]);
        delete target.editable;
        this.dataSource = newData;
      }
    }
  },
  mounted() {
    this.cacheData = this.dataSource.map(item => ({item}));
    this.getGameList();
  }
}
</script>

<style scoped>

</style>