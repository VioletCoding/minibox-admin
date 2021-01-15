<!--首页显示的内容-->
<template>
  <div class="container">

    <!--第一栏-->
    <div class="flex">

      <a-card class="card-style"
              v-for="(item,index) in cardContent"
              :key="index"
              :title="item.title"
              :activeTabKey="index+''"
              :hoverable="true">

        <a slot="extra"
           href="#">
          <a-icon type="info-circle"/>
        </a>

        <a-statistic :value="item.number"
                     :suffix="item.suffix"/>
      </a-card>

    </div>
    <!--第一栏 end-->

    <!--第二栏 -->
    <div class="flex">
      <!--echarts图表-->
      <div class="m-center" id="main"></div>
      <!--排行榜-->
      <div class="leaderboard">
        <div style="font-size: 18px;font-weight: bold">游戏销量排行榜</div>
        <a-list item-layout="vertical"
                v-for="(item,index) in gameSalesRankings"
                v-if="index < 7"
                :key="index + 'leaderboard' ">
          <a-list-item>
            <a-badge :count="index + 1"/>
            <span style="margin-left: 30px">{{ item.gameName }}</span>
            <span style="float: right">{{ item.sales }}</span>
          </a-list-item>
        </a-list>
      </div>
      <!--排行榜end-->
    </div>
    <!--第二栏end-->

    <!--第三栏-->
    <div class="m-bottom" id="bottom"></div>
    <!--第三栏end-->

  </div>
</template>

<script>
import Api from "@/api/api";

export default {
  name: "MyHome",
  data() {
    return {
      //卡片内容
      cardContent: [],
      //获取echarts实例
      echarts: require("echarts"),
      //游戏销量排行榜
      gameSalesRankings: []
    }
  },
  methods: {
    //加载首页上的所有数据
    loadAll() {
      //横轴数据
      let xAxisData = [];
      //系列数据
      let seriesData = [];
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById("main"));
      myChart.showLoading();
      //请求数据
      this.$http.get(Api.getCount)
          .then(resp => {
            console.log("数据=>", resp);
            let temp = resp.data.data;
            //卡片内容
            this.cardContent.push(
                {title: "帖子数量", number: temp.post_number, suffix: "篇"},
                {title: "用户数量", number: temp.user_number, suffix: "位"},
                {title: "游戏数量", number: temp.game_number, suffix: "个"},
                {title: "评论数量", number: temp.comment_number, suffix: "个"}
            );
            //每日发帖数
            temp.echartsComment.forEach(item => {
              xAxisData.push(item.createDate);
              seriesData.push(item.postNumberPerDay);
            });
            //绘制图表
            myChart.setOption({
              itemStyle: {
                color: "#1890ff"
              },
              title: {
                text: '每日发帖数情况一览'
              },
              tooltip: {},
              xAxis: {
                data: xAxisData
              },
              yAxis: {},
              series: [{
                name: '发帖数',
                type: 'bar',
                data: seriesData,
                itemStyle: {
                  //改一下柱状图的颜色
                  color: params => {
                    //这里如果有多色的需求，那么多写几个，生成的柱状图颜色就会从里面取
                    return ["#1890ff"];
                  }
                }
              }]
            });
            //游戏销量排行榜
            this.gameSalesRankings = temp.gameSalesRankings;
            myChart.hideLoading();
          })
          .catch(err => {
            console.error(err);
            this.$message.error(err.response.data.message == "" ? "服务器繁忙" : err.response.data.message);
          });
    },
    //加载底部echarts
    loadBottomEcharts() {

      let echarts = this.echarts.init(document.getElementById("bottom"));

      echarts.setOption({
        title: {
          text: "每日评论数总览"
        },
        xAxis: {
          type: "category",
          data: ["1-14", "1-15", "1-16", "1-16", "1-16", "1-16"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 564, 130, 522, 251, 202],
            type: "line"
          },
          {
            data: [80, 1030, 1440, 1050, 1260],
            type: "line"
          }
        ]
      });
      return echarts;
    },
  },
  mounted() {
    this.loadAll();
    this.loadBottomEcharts();
  }
}
</script>

<style scoped lang="less">
.flex {
  display: flex;
  flex-direction: row;
}

.container {

  .card-style {
    width: 400px;
    margin-right: 25px
  }

  .m-center {
    width: 1200px;
    height: 350px;
    margin-top: 30px;
  }

  .leaderboard {
    margin: 30px 0 0 0;
    width: 475px;
  }

  .m-bottom {
    width: 100%;
    height: 300px;
  }

}

</style>