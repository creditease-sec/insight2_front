<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 日程
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="lunarFullCalendar">
        <div class="full-calendar">
          <lunar-full-calendar
            ref="calendar"
            :events="events"
            :config="config"
            @changeMonth="changeMonth"
          ></lunar-full-calendar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/common";
import { FullCalendar } from "vue-fullcalendar";
import { LunarFullCalendar } from "vue-lunar-full-calendar";
export default {
  components: {
    LunarFullCalendar
  },
  data() {
    let that = this;
    return {
      config: {
        // lunarCalendar
        // Control whether the Chinese calendar shows true, unrealistic false, default true.（lunarCalendar控制是否显示中国农历、显示的为true，隐藏为false，默认为true）
        lunarCalendar: true,
        height: "50%",
        width: "70%",
        locale: "zh-cn",
        buttonText: {
          today: "今天",
          month: "月",
          week: "周",
          day: "日"
        },
        header: {
          left: "prev,next, today",
          center: "title",
          right: "hide, custom, month,agendaWeek,agendaDay"
        },
        // eventOrder:'index',   // 这个是控制事件排序的功能，意思是 按照字段 事件数据中index来排序
        // eventLimitClick: 'day', //点击今天日列表图
        changeMonth: this.changeMonth,
        eventLimit: true, // 一天中显示多少条事件，多了隐藏
        firstDay: 0, // 控制周一周日那个在前面
        defaultView: "month",
        allDaySlot: true, // agenda视图下是否显示all-day
        allDayText: "全天", // agenda视图下all-day的显示文本
        timezone: "local", // 时区默认本地的
        slotLabelFormat: "HH:mm", // 周视图和日视同的左侧时间显示

        customButtons: {
          // 新增按钮
          hide: {
            text: "隐藏农历",
            click: function() {
              that.$refs.calendar.fireMethod("option", {
                lunarCalendar: false
              });
              that.$refs.calendar.fireMethod("option", {
                header: {
                  left: "prev,next, today",
                  center: "title",
                  right: "show, custom, month,agendaWeek,agendaDay"
                }
              });
            }
          },
          show: {
            text: "显示农历",
            click: function() {
              that.$refs.calendar.fireMethod("option", {
                lunarCalendar: true
              });
              that.$refs.calendar.fireMethod("option", {
                header: {
                  left: "prev,next, today",
                  center: "title",
                  right: "hide, custom, month,agendaWeek,agendaDay"
                }
              });
            }
          }
        }
      },

      events: [
        {
          title: "[好旺角] 待复测",
          start: "2019-08-22T12:30:00"
        },
        {
          title: "[1] XX系统 定期安全扫描",
          start: "2019-08-22T12:30:00"
        },
        {
          title: "[2] 待复测",
          start: "2019-08-22T12:30:00"
        },
        {
          title: "[3] 待复测",
          start: "2019-08-22T12:30:00"
        },
        {
          title: "[4] 待复测",
          start: "2019-08-22T12:30:00"
        },
        {
          title: "定期安全扫描",
          start: "2019-07-05",
          end: "2019-07-07"
        },
        {
          title: "  ",
          start: "2019-08-01T12:30:00",
          allDay: false
        }
      ],
      monthData: [
        {
          title: "Q3 开发",
          start: "2018-08-25",
          end: "2020-07-27",
          cssClass: ["family", "career"]
        },
        {
          title: "每周安全扫描",
          start: "2019-07-10",
          end: "2019-07-10",
          cssClass: ["family", "career"]
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .get("/api/extension/crontab/calendar", {
          params: {}
        })
        .then(res => {
          this.events = res.data.result;
        });
    },

    // /api/extension/crontab/calendar
    // 选择月份
    changeMonth(start, end, current) {
      //  console.log('changeMonth', start.format(), end.format(), current.format())
    },
    // 点击事件
    eventClick(event, jsEvent, pos) {
      // console.log('eventClick', event, jsEvent, pos)
    },
    // 点击当天
    dayClick(day, jsEvent) {
      //  console.log('dayClick', day, jsEvent)
    },
    // 查看更多
    moreClick(day, events, jsEvent) {
      // console.log('moreCLick', day, events, jsEvent)
    }
  }
};
</script>
<style  lang="scss" scoped>
$color: #45b984;
.lunarFullCalendar {
  width: 80%;
  height: 70%;
  // background: #fff;
  .top {
    height: 100px;
    h2 {
      text-align: center;
      font-size: 15px;
    }
    div {
      font-size: 13px;
    }
  }
  .full-calendar {
    padding: 20px;
    height: calc(100% - 30px);
    /deep/ {
      .fc-unthemed thead,
      .fc-unthemed .fc-content,
      .fc-unthemed th,
      .fc-unthemed td,
      .fc-unthemed tbody,
      .fc-unthemed .fc-row,
      .fc-unthemed .fc-list-view,
      .fc-unthemed .fc-popover,
      .fc-unthemed .fc-divider,
      .fc-unthemed .fc-list-heading td {
        border-color: #eaecf1;
      }
      .fc-header-toolbar {
        height: 30px;
        margin-bottom: 0;
        line-height: 30px;
        h2 {
          font-size: 24px;
          color: #000;
        }
      }
      .fc-button {
        height: 30px;
        background: #fff;
        border-color: #fff;
        box-shadow: none;
        padding: 0;
      }
      .fc-today-button {
        font-size: 15px;
        color: $color;
      }
      .fc-show-button,
      .fc-hide-button {
        position: relative;
        width: 80px;
        border: 1px solid #bbbfcd;
        border-radius: 20px;
        font-size: 15px;
        color: #000;
      }
      .fc-next-button,
      .fc-prev-button {
        color: #7d8292;
      }
      .fc-button-group {
        margin-left: 20px;
        font-size: 15px;
        button {
          width: 80px;
          color: #000;
          border: 1px solid #bbbfcd;
        }
        button:first-child {
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
        }
        button:last-child {
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
        }
        .fc-state-active {
          background: $color;
          color: #fff;
          text-shadow: none;
        }
      }
      .fc-agendaDay-view,
      .fc-month-view,
      .fc-agendaWeek-view {
        .fc-widget-content {
          .fc-sun,
          .fc-sat {
            background: rgba(245, 246, 248, 0.6);
          }
          .fc-day-number {
            font-size: 15px;
            letter-spacing: 0;
            line-height: 13px;
            float: left;
          }
          .fc-day-top {
            padding: 15px 12px 0 12px;
          }
          .fc-day-cnTerm,
          .fc-day-cnDate {
            font-size: 12px;
            color: #7d8292;
            float: right;
          }
          .fc-more {
            font-size: 12px;
            color: #7d8292;
          }
          .fc-event {
            cursor: pointer;
            font-size: 12px;
            color: #000;
            background-color: rgba($color: $color, $alpha: 0.15) !important;
            border: 1px solid rgba($color: $color, $alpha: 0.15) !important;
            border-left: 2px solid rgba($color: $color, $alpha: 0.15) !important;
            border-radius: 0;
          }
          .fc-day-grid-event {
            padding: 1px 0 1px 5px;
          }
        }
      }
      .fc-agendaWeek-view,
      .fc-agendaDay-view {
        .fc-axis {
          font-size: 15px;
        }
        .fc-title {
          font-size: 15px;
          color: $color;
        }
      }
      .fc-month-view {
        .fc-event {
          &.fc-not-start {
            border-left: 1px solid rgba($color: $color, $alpha: 0.1) !important;
          }
        }
      }
      .fc-agendaDay-view {
        .fc-head {
          table {
            margin: 15px 0;
          }
          .fc-day-header {
            display: none;
          }
        }
      }
      .fc-head {
        .fc-day-header,
        .fc-widget-header,
        .fc-head-container {
          border-top-color: #fff;
          border-left-color: #fff;
          border-right-color: #fff;
        }
        table {
          margin: 10px 0 15px 0;
          font-size: 15px;
          color: #000;
        }
      }
    }
  }
}
.tip {
  color: $color;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}
</style>