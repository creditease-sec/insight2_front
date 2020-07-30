<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="概览" style="width:100%;">
        <el-row>
          <el-col :span="6">
            <el-row>
              <el-card style="width:90%;float:left;margin-left:2%">
  
                <countTo
                  :startVal="startVal"
                  :endVal="dashboard_data.summary.current_month_vul_count"
                  :duration="2000"
                  :decimals="0"
                  class="big-num"
                ></countTo>
                <span style="color:#414959;float:left;font-size: 10px;margin-bottom:5px;">当月漏洞数</span>
                <span
                  style="color:#414959;float:right;font-size: 10px;margin-bottom:5px;"
                > <span style="margin-right:3px;">环比上月     </span>
                 <span v-if="dashboard_data.summary.vul_increase_count>=0"
                  style="color:#3e9b87f3;float:right;font-size: 10px;margin-bottom:5px;"
                > +{{dashboard_data.summary.vul_increase_percent}}%({{dashboard_data.summary.vul_increase_count}})</span>
                  <span v-if="dashboard_data.summary.vul_increase_count<0"
                  style="color:#ee6a6a;float:right;font-size: 10px;margin-bottom:5px;"
                > -{{dashboard_data.summary.vul_increase_percent}}%({{dashboard_data.summary.vul_increase_count}})</span>
                </span>
              </el-card>
            </el-row>
            <el-row>
              <el-card style="width:90%;float:left;margin-left:2%;">
                <el-col :span="12">
                  <span style="font-size:10px;margin-bottom:20px;">资产测试率</span>
                  <el-progress :percentage="dashboard_data.summary.test_percent"></el-progress>
                </el-col>
                <el-col :span="12">
                  <span style="font-size:10px">漏洞修复率</span>
                  <el-progress  :percentage="dashboard_data.summary.fixes_percent" color="#67c23a"></el-progress>
                </el-col>
              </el-card>
            </el-row>
            <el-row>
              <el-card style="width:90%;float:left;margin-left:2%">
                <span style="font-size:10px;float:left;margin-bottom:20px;">参考星级</span>
              
                <el-rate style="float:right" v-model="dashboard_data.summary.star_level>5?5:dashboard_data.summary.star_level"></el-rate>
              </el-card>
            </el-row>
            <el-row>
              <el-card style="width:90%;float:left;margin-left:2%;">
                <v-chart
                  ref="vul_ratio_data"
                  :options="vul_ratio_data"
                  autoresize
                  style="width:110%;"
                />
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="18">
            <el-card style="width:95%;float:left;margin-left:2%;padding-bottom:15px;">
              <v-chart :options="vul_trend_data" autoresize />
            </el-card>
            <el-card style="width:95%;float:left;margin-left:2%;margin-top:20px;">
              <v-chart :options="hot_data" autoresize />
            </el-card>
          </el-col>
        </el-row>
 
      </el-tab-pane>
      <el-tab-pane label="漏洞" style="width:100%;">
            <el-dialog title="时间范围" :visible.sync="timeSelectVisible" width="50%">
      <el-form label-width="90px">
        <el-form-item label="时间范围" prop="vul_name">      <el-date-picker
          v-model="time_range"
          type="datetimerange"
          value-format="timestamp"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          align="right"
        ></el-date-picker></el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="get_dashboard_data()">确 认</el-button>
      </span>
    </el-dialog>
        <el-row>
          <el-col :span="6">
            <el-card style="width:90%;">
              <div slot="header" class="clearfix">
                <span >
                  <i class="el-icon-zonglan1 iconfont_no_margin" ></i>
                  漏洞概况  

                  <div style="float:right">
                    <span style="font-size:12px" @click="timeSelectVisible=true">时段设定</span>
                  <!-- <span style="font-size:10px;">周</span>
                <span style="font-size:10px;font-weight:bold">月</span>
                <span style="font-size:10px;">年</span> -->
                   
                  </div>
                </span>
              </div>
              <el-col :span="24">
                <div class="vul_detail" style="margin-bottom:30px;">
                  <div style="display:block">漏洞总数  <span style="color:#3e9b87f3"> {{dashboard_data.vul.total_vul_count}} </span></div>
                  <div style="display:block">平均漏洞处理时间 <span style="color:#3e9b87f3"> {{ Math.round(dashboard_data.vul.average_solved_cost/60/60)}}</span> 小时</div> 
                  <div style="display:block">漏洞处理总花费时间 <span style="color:#3e9b87f3"> {{ Math.round(dashboard_data.vul.total_solved_cost/60/60/24/30)}} </span> 月</div> 
                  <div style="display:block">漏洞处理及时度评分 <span style="color:#3e9b87f3"> {{dashboard_data.vul.solved_score}} </span> </div> 
                </div>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card style="width:90%;">
 
              <el-col :span="24">
                <v-chart :options="vul_type_top_data" autoresize />
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card style="width:90%;">
              <v-chart :options="rank_distribution_data" autoresize />
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-card style="width:90%;">
              <!-- 漏洞类型 -->
              <el-col :span="24">
                <v-chart :options="vul_ratio_data" autoresize />
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card style="width:95%;">
              <!-- 漏洞类型趋势 -->
              <v-chart :options="vul_type_trend_line_data" autoresize />
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card style="width:90%;">
              <v-chart :options="vul_source_data" autoresize />
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="资产">
        <el-row>
          <el-col :span="6">
            <el-row>
              <el-col :span="12">
                <el-card
                  style="width:90%;float:left;margin-left:2%;text-align:center;margin-bottom:10px;"
                >
                  <countTo
                    :startVal="startVal"
                    :endVal="dashboard_data.assets.total_app_count"
                    :duration="2000"
                    :decimals="0"
                    class="big-num"
                  ></countTo>
                  <span style="color:#3e9b87f3;font-size: 10px;margin:0 auto;font-weight:bold;">应用总数</span>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card style="width:90%;float:left;margin-left:2%;text-align:center;">
                  <countTo
                    :startVal="startVal"
                    :endVal="dashboard_data.assets.total_asset_count"
                    :duration="2000"
                    :decimals="0"
                    class="big-num big-num-blue"
                  ></countTo>
                  <span style="color:#3e9b87f3;font-size: 10px;margin:0 auto;font-weight:bold;">资产总数</span>
                </el-card>
              </el-col>
            </el-row>
            <el-card style="width:90%;margin-left:2%;text-align:center;">
              <span class="big-num">{{dashboard_data.assets.app_asset_associated_percent}}%</span>
              <span style="color:#3e9b87f3;font-size: 10px;margin:0 auto;font-weight:bold;">应用-资产关联率</span>
              <br />
              <div style="margin-top:10px;text-align:center">
                <div style="align:left">
                <span
                  style=";font-size: 10px;margin-bottom:5px;margin-right:10px;"
                >未关联资产</span>
                <span>
                  <countTo
                    style="font-size: 10px;color:#ee6a6a"
                    :startVal="startVal"
                    :endVal="dashboard_data.assets.unassociated_asset_count"
                    :duration="2000"
                    :decimals="0"
                  ></countTo>
                </span>
                <span style="color:#756aee;font-size: 10px;margin-left:15px;margin-bottom:15px;"> <a href="#" @click="$router.push('app')">去关联</a></span>
              </div>
                            </div>
              <div style="margin-top:10px;text-align:center">
                <span
                  style="font-size: 10px;margin-bottom:5px;margin-right:10px;"
                >非活跃资产</span>
                <span style="width:50px;">
                  <countTo
                              style="font-size: 10px;color:#ee6a6a"
                    :startVal="startVal"
                    :endVal="dashboard_data.assets.unactive_asset_count"
                    :duration="2000"
                    :decimals="0"
                  ></countTo>
                </span>
                   <span style="color:#756aee;font-size: 10px;margin-left:15px;margin-bottom:15px;"> <a href="#" @click="$router.push('asset')">去查看</a></span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card style="width:100%;">
              <div slot="header" class="clearfix">
                <span>
                  <i class="el-icon-zonglan1 iconfont_no_margin"></i>
                  资产概况
                </span>
                <!-- <a href="#" class='refresh_button'>自动刷新</a> -->
              </div>
              <el-col :span="24">
                <!-- 应用对应漏洞数 -->
                <v-chart :options="asset_generation_data" autoresize /> 
              </el-col
              >
              <div style="height:20px;">
              </div>
            </el-card>
          </el-col>

          <el-col :span="6">
            <el-card style="width:90%;float:left;margin-left:2%;text-align:center;">
              <v-chart
                :options="asset_ratio_data"
                autoresize
   
                style="width:75%;;margin-left:12%;"
              />
              <div style="height:60px;">
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
            <el-card style="width:100%;">
              <el-col :span="24">
                <v-chart :options="asset_overdue_sovled_data" autoresize />
              </el-col>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card style="width:100%;">
              <el-col :span="24">
                <v-chart :options="asset_overdue_unsovled_data" autoresize />
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import countTo from "vue-count-to";
const path = require("path");
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { formatDate,console_log } from "@/utils/common";
import { getChartData } from "@/utils/chart_data";
import echarts from "echarts";


export default {
  name: "dashboard",
  components: {
    PulseLoader,
    countTo
  },
  data() {

    return {
      timeSelectVisible:false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      time_range: [
        0,
        Date.parse(new Date() +  60 * 60 * 24 * 1000)
      ],
      dashboard_data :{
        "summary":{
            "total_vul_count":0,
            "vul_increase_percent":-3,
            "vul_increase_count":80,
            "test_percent":80.0,
            "fixes_percent":80.2,
            "star_level":4,
              "hot_data":
            {"data":[
              ["2019-01-01", 2074], //事件数 漏洞日志+扩展日志数
              ["2019-01-02", 1074],
            ],
            "range": ['2019-04-01', '2019-06-30'],
            },
            "vul_trend_data":{
              "x": ["1968/10/4"],
              "y": [1,] //漏洞个数
            },
            "vul_ratio_data":{
              data:[
                { value: 335, name: '已完成' },
                { value: 310, name: '未修复' },
                { value: 234, name: '复测中' },
                { value: 135, name: '未审核' },
                { value: 500, name: '已过期' }
            ]}

        },
        "vul":{
           "total_vul_count":4327,
           "average_solved_cost":111, // 秒
           "total_solved_cost":111, // 秒
           "solved_score":66,
           "vul_source_data":
           {data:[
              { value: 0, name: "安全部" }
            ]
           },
            "vul_ratio_data":
            {data:[
                { value: 0, name: '已完成' },
                { value: 0, name: '未修复' },
                { value: 0, name: '复测中' },
                { value: 0, name: '未审核' },
                { value: 0, name: '已过期' }
            ]},
            "rank_distribution_data": {data: [ //Rank分布
                ['score', 'amount', 'rank'],
                [0, 0, '7'],
                [0, 0, '15'],
            ]},
            "vul_type_top_data":{ //漏洞类型TOP
                  xAxis_data: [
                    "敏感信息泄露",
                  ],
                  series_data: [820,]                  
            },
            "vul_type_trend_line_data":{ //漏洞类型趋势
                 legend_data: ['SQL注入漏洞'],
                  xAxis_data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                  series: [
                        {
                            name: 'SQL注入漏洞',
                            type: 'line',
                            stack: '总量',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                    ]
            }
        },
        "assets":{
           "total_app_count":70,
           "total_asset_count":666,
           "app_asset_associated_percent":95.2,
           "unassociated_asset_count":666,
           "unactive_asset_count":666,
           "asset_generation_data":{
             total:123,
            x_data: [
            "系统",
          ],
            series_data: [444, ],
           },
           "asset_overdue_sovled_data":{
             total:123,
            x_data: [
            "系统",
          ],
            series_data: [444, ],
           },
           "asset_overdue_unsovled_data":{
             total:123,
            x_data: [
            "系统",
          ],
            series_data: [444,],
           },

           "asset_ratio_data":{
              data: [
                { value: 335, name: 'IP' },
                { value: 310, name: '域名' },
                { value: 234, name: '端口' }
            ]
           }
        }
      },

      startVal: 0,
      endVal: 0,
      circle_process_width: 95, //document.body.clientWidth * 0.08,
      name: sessionStorage.getItem("ms_username"),
      plugin_list: [],
      timer: null,
      hot_data: getChartData("hot_data"),
      vul_ratio_data: getChartData("vul_ratio_data"),
      vul_trend_data: getChartData("vul_trend_data"),
      asset_ratio_data: getChartData("asset_ratio_data"),
      vul_type_trend_line_data: getChartData("vul_type_trend_line_data"), //漏洞类型趋势
      rank_distribution_data: getChartData("rank_distribution_data"), //Rank分布
      vul_source_data:getChartData("vul_source_data"), //漏洞来源饼图
      vul_type_top_data:getChartData("vul_type_top_data"), // 漏洞Top线图 
      asset_generation_data:getChartData("asset_generation_data"),
      asset_overdue_sovled_data:getChartData("asset_overdue_sovled_data"),
      asset_overdue_unsovled_data:getChartData("asset_overdue_unsovled_data"),
     

    };
  },
  created() {
    this.get_dashboard_data();
  },
  computed: {

    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
  },
  filters: {
    formatTimestamp(time) {
      let date = new Date(Math.trunc(time * 1000));
      return formatDate(date, "yyyy-MM-dd HH:mm:ss");
    }
  },
  destroyed: function() {
    clearInterval(this.timer);
  },

  methods: {
    get_dashboard_data() {
      let that = this
      this.$axios.get("/api/dashboard?start="+this.time_range[0]/1000+"&end="+this.time_range[1]/1000).then(res => {
        let raw_data =JSON.stringify( res.data.data)
        that.dashboard_data = JSON.parse(localStorage.getItem("__IS_DESENSITIVE__")) ?JSON.parse(raw_data.replace(/([^\u0000-\u00FF])/g, function ($) { return "*"; }).replace(/:[0-9]*,/g, function ($) { return ":666,"; })):res.data.data

        this.vul_ratio_data = getChartData("vul_ratio_data", that.dashboard_data.summary.vul_ratio_data)
        this.vul_trend_data = getChartData("vul_trend_data", that.dashboard_data.summary.vul_trend_data)
        this.hot_data = getChartData("hot_data",that.dashboard_data.summary.hot_data)
         this. vul_type_top_data = getChartData("vul_type_top_data",that.dashboard_data.vul.vul_type_top_data)
         this. vul_source_data = getChartData("vul_source_data",that.dashboard_data.vul.vul_source_data)
         this. vul_type_trend_line_data = getChartData("vul_type_trend_line_data",that.dashboard_data.vul.vul_type_trend_line_data)
         this. rank_distribution_data = getChartData("rank_distribution_data",that.dashboard_data.vul.rank_distribution_data)
          this.asset_generation_data = getChartData("asset_generation_data",that.dashboard_data.assets.asset_generation_data)
          this.asset_overdue_sovled_data = getChartData("asset_overdue_sovled_data",that.dashboard_data.assets.asset_overdue_sovled_data)
         this.asset_overdue_unsovled_data = getChartData("asset_overdue_unsovled_data",that.dashboard_data.assets.asset_overdue_unsovled_data)
          this.asset_ratio_data = getChartData("asset_ratio_data",that.dashboard_data.assets.asset_ratio_data)
      });
      this.timeSelectVisible=false
    },

    secondToDate(result) {
      var d =
        Math.floor(result / 86400) < 10
          ? "0" + Math.floor(result / 86400)
          : Math.floor(result / 86400);
      var h =
        Math.floor((result / 3600) % 24) < 10
          ? "0" + Math.floor((result / 3600) % 24)
          : Math.floor((result / 3600) % 24);
      var m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      var s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);
      return (result =
        //   w+
        //   " " +
        //  '周' +
        //   " " +
        d +
        " " +
        this.$t("label.days") +
        " " +
        h +
        " " +
        this.$t("label.hours") +
        " " +
        m +
        " " +
        this.$t("label.minutes") +
        " " +
        s +
        " " +
        this.$t("label.seconds"));
    },

    fixn(num, n) {
      if (num == undefined) return 0.0;
      return num.toFixed(n);
    }
  }
};
</script>



<style scoped>
.echarts {
  width: 100%;
  height: 250px;
}
.process_label {
  text-align: center;
  margin-bottom: 5px;
}
.progress_div {
  align-items: center;
  display: inline-block;
  margin-right: 5%;
  height: 152px;
}
.progress_bar {
  display: inline-block;
  font-size: 14px;
  height: 250px;
}
.grid_bar {
  display: flex;
  height: 50px;
}

.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 70px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #585858ea;
}

.grid-num {
  font-size: 25px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 30px;
  width: 70px;
  height: 70px;
  text-align: center;
  line-height: 70px;
  color: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-num {
  color: rgb(23, 148, 11);
}

.grid-con-2 .grid-con-icon {
  color: rgb(23, 148, 11);
}

.refresh_button {
  font-size: 7px;
  color: rgb(242, 94, 67);
}
.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.grid-con-3 .grid-con-icon {
  color: rgb(242, 94, 67);
}

.grid-con-4 .grid-num {
  color: rgb(150, 219, 70);
}

.grid-con-4 .grid-con-icon {
  color: rgb(150, 219, 70);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 10px;
}

.text_key {
  font-size: 14px;
  color: #585858ea;
  line-height: 25px;
  margin: 0.2em;
}
.text_value {
  font-size: 14px;
  font-weight: bold;
  color: #187eec;
  line-height: 25px;
  margin: 0.2em;
}
.big-num {
  font-size: 30px;
  color: #2a2828f3;
  display: block;
  margin: 10px 0;
  text-align: center;
  font-weight: 500;
}

.big-num-blue{
  color: #4c7095
}

.vul_detail {
  text-align: right;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
</style>

