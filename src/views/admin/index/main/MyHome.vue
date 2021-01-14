<!--首页显示的内容-->
<template>
  <div class="container">

    <!--第一栏-->
    <div class="flex">

      <a-card class="card-style"
              v-for="(item,index) in cardContent"
              :key="index"
              :title="item.title"
              :activeTabKey="item.activeTabKey"
              :hoverable="item.hoverable">

        <a slot="extra"
           href="#">
          <a-icon type="info-circle"/>
        </a>

        <a-statistic :value="126560"
                     suffix="篇"/>
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
                v-for="(item,index) in 10"
                v-if="index < 7"
                :key="index + 'leaderboard' ">
          <a-list-item>
            <a-badge :count="index + 1"/>
            <span style="margin-left: 30px">{{ "游戏名" + (index + 1) }}</span>
            <span style="float: right">{{ 1024 + index }}</span>
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
export default {
  name: "MyHome",
  data() {
    return {
      //卡片内容
      cardContent: [
        {
          title: "帖子数量",
          activeTabKey: "1",
          hoverable: true
        },
        {
          title: "用户数量",
          activeTabKey: "2",
          hoverable: true
        },
        {
          title: "游戏数量",
          activeTabKey: "3",
          hoverable: true
        },
        {
          title: "评论数量",
          activeTabKey: "4",
          hoverable: true
        }
      ],
      //获取echarts实例
      echarts: require("echarts")
    }
  },
  methods: {
    //加载echarts
    loadEcharts() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById("main"));
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
          data: ['14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '19日', '20日', '21日']
        },
        yAxis: {},
        series: [{
          name: '发帖数',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20, 30, 40, 20, 30, 40],
          itemStyle: {
            //改一下柱状图的颜色
            color: params => {
              //这里如果有多色的需求，那么多写几个，生成的柱状图颜色就会从里面取
              let color = ["#1890ff"];
              return color;
            }
          }
        }]
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
    }
  },
  mounted() {
    this.loadEcharts();
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