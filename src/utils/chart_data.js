import echarts from "echarts"

export function getChartData(type,data) {
    switch (type) {
        case "hot_data": {
         if(data){
            hot_data.calendar[0].range = data.range
            hot_data.series[0].data = data.data
         }   
        return hot_data;
        }
        case "vul_ratio_data":{ 
            if(data){
            vul_ratio_data_template.series[0].data =data 
        }
            return vul_ratio_data_template;
        }
        case "vul_trend_data": {
            if(data){
            vul_trend_data.xAxis.data = data.x
            vul_trend_data.series[0].data = data.y
        }
            return vul_trend_data;
        }
        case "vul_source_data":{
            if(data){
                vul_source_data.series[0].data =data .data
                data .data.forEach((item,index,array)=>{
                    vul_source_data.legend.data.push(item.name)
                })
            }

            return vul_source_data
        }
        case "vul_type_top_data": {
            if(data){
                vul_type_top_data.xAxis.data = data.xAxis_data
                vul_type_top_data.series[0].data = data.series_data
            }

            return vul_type_top_data
        }
        case "asset_generation_data":{
            if(data){
                   
                    asset_generation_data.title. text=  "应用("+data.total+")漏洞数量"
                    asset_generation_data.xAxis.data = data.x_data
                    asset_generation_data.series[0].data = data.series_data
            }
            return asset_generation_data
        }
        case "asset_overdue_sovled_data":{
            if(data){ 
                asset_overdue_sovled_data.title. text=  "应用("+data.total+")逾期已修复漏洞数量"
                asset_overdue_sovled_data.xAxis.data = data.x_data
                asset_overdue_sovled_data.series[0].data = data.series_data
        }
            return asset_overdue_sovled_data
        }
        case "asset_overdue_unsovled_data":{
            if(data){
                asset_overdue_unsovled_data.title. text=  "应用("+data.total+")逾期未修复漏洞数量"
                asset_overdue_unsovled_data.xAxis.data = data.x_data
                asset_overdue_unsovled_data.series[0].data = data.series_data
        }
            return asset_overdue_unsovled_data
        }

        case "asset_ratio_data": {
            if(data){
                asset_ratio_data.series[0].data = data.data
            }
            return asset_ratio_data;
        }
        case "vul_type_trend_line_data": {
                if(data)   {
                
                     vul_type_trend_line_data.legend.data = data.legend_data
                     vul_type_trend_line_data.xAxis.data = data.xAxis_data
                     vul_type_trend_line_data.series = data.series

                }   
                return vul_type_trend_line_data;
        }
        case "rank_distribution_data":{
                if(data){
                    rank_distribution_data.dataset.source = data
                }
            return rank_distribution_data;
        } 
    }
}

function getVirtulData(year) {
    year = year || '2017';
    var date = +echarts.number.parseDate(year + '-01-01');
    var end = +echarts.number.parseDate((+year + 1) + '-01-01');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < end; time += dayTime) {
        data.push([
            echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 10000)
        ]);
    }
    return data;
}
var base = +new Date(1968, 9, 3);
var oneDay = 24 * 3600 * 1000;
var date = [];

var chat_data = [Math.random() * 100];

for (var i = 1; i < 20000; i++) {
    var now = new Date((base += oneDay));
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"));
    chat_data.push(Math.round((Math.random() - 0.5) * 20 + chat_data[i - 1]));
}


var hot_date_data = getVirtulData(2019)
// console.log("hot_data");
// console.log(hot_data);

var vul_ratio_data_template = {
    legend: {
      itemWidth:5,
      itemHeight:5,
      icon: 'circle',
      orient: 'vertical',
      left: 0,
      data: ['已完成', '待审核', '暂不处理', '已确认', '修复中','复测中']
    },

    title: {
        text: '状态比例',
        left: 'center',
        textStyle: {
            color: '#000'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series: [
        {
            name: '漏洞状态',
            type: 'pie',
            radius: ['40%', ' 45%'],
            avoidLabelOverlap: true,
            label: {
                normal: {
                    show: false,
                    // position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 1,
                },
            },
            label: {
                normal: {
                    textStyle: {
                        //  color: 'red'  // 改变标示文字的颜色
                    }
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: [
{name: "待审核",
value: 1978}
            ]
        }
    ]
}
let hot_data = {

    title: {
        top: 10,
        text: '风险处理概览',
        left: 'center',
        textStyle: {
            color: '#000'
        }
    },
    tooltip: {
        trigger: 'item'
    },
    // legend: {
    //     top: '30',
    //     left: '100',
    //     data:['步数', 'Top 12'],
    //     textStyle: {
    //         color: '#fff'
    //     }
    // },
    calendar: [{
        top: 100,
        left: 'center',
        range: ['2019-04-01', '2019-06-30'],
        cellSize: 20,
        width: '75%',
        dayLabel: {
            firstDay: 1,
            nameMap: 'cn',
            textStyle: {
                fontSize: 14,
                color: '#999'
            }
        },
        monthLabel: {
            nameMap: 'cn',
            margin: 15,
            textStyle: {
                fontSize: 14,
                color: '#999'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#fff',
                width: 4,
                type: 'solid'
            }
        },
        yearLabel: {
            formatter: '{start}  Q2',
            margin: "10 0 0 0",
            // textStyle: {
            //     color: '#fff'
            // }
        },
        itemStyle: {
            normal: {
                // color: '#323c48',
                borderWidth: 1,
                // borderColor: '#000'
            }
        }
    }],
    series: [
        {
            name: '事件数',
            type: 'scatter',//type: 'effectScatter',
            coordinateSystem: 'calendar',
            data: [],
            symbolSize: function (val) {
                return Math.sqrt(val[1] )<18?Math.sqrt(val[1] ):18;
            },
            // itemStyle: {
            //     normal: {
            //         color: '#75a770'
            //     }
            // },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            itemStyle: {
                normal: {
                    color: '#75a770',
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        },

    ]
}


var vul_trend_data = {
    tooltip: {
        trigger: "axis",
        position: function (pt) {
            return [pt[0], "10%"];
        }
    },
    title: {
        left: "center",
        text: "漏洞趋势"
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
        data: date
    },
    yAxis: {
        type: "value",
        boundaryGap: [0, "100%"]
    },
    dataZoom: [
        {
            type: "inside",
            start: 90,
            end: 100,
        },
        {
            start: 90,
            end: 100,
            handleIcon: "M0,0 v9.7h5 v-9.7h-5 Z",
            handleSize: "80%",
            handleStyle: {
                color: "#fff",
                shadowBlur: 3,
                shadowColor: "rgba(0, 0, 0, 0.6)",
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }
    ],
    series: [
        {
            name: "漏洞数",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
                color: "#75a770"
            },

            data: chat_data
        }
    ]
}
var asset_ratio_data = {

    title: {
        text: '资产类型比例',
        left: 'center',
        textStyle: {
            color: '#000'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series: [
        {
            name: '类型',
            type: 'pie',
            radius: ['20%', ' 30%'],
            avoidLabelOverlap: true,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 1,
                },
            },
            label: {
                normal: {
                    textStyle: {
                        //  color: 'red'  // 改变标示文字的颜色
                    }
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: [
            ]
        }
    ]
}

var vul_type_trend_line_data = {
    title: {
        text: '漏洞类型趋势',
        textStyle: {
            //文字颜色
            color: '#ccc',
            //字体风格,'normal','italic','oblique'
            fontStyle: 'normal',
            fontSize: 13
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: []
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [

    ]
};

var rank_distribution_data = {
    title: {
        text: 'Rank分布',
        left: 'center',
        textStyle: {
            color: '#000'
        }
    },
    dataset: {
        source: [
          ["score", "amount", "rank"],
          [3, 13, 3], [8, 9, 8], [13, 4, 13], [1, 14, 1], [10, 0, 10], [9, 1, 9]
        ]
    },
    grid: { containLabel: true },
    xAxis: { name: 'amount' },
    yAxis: { type: 'category' },
    visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: 0,
        max: 20,
        text: ['低', '高'],
        // Map the score column to color
        dimension: 0,
        inRange: {
            color: ['#D7DA8B', '#0dad51']
        }
    },
    series: [
        {
            type: 'bar',
            encode: {
                // Map the "amount" column to X axis.
                x: 'amount',
                // Map the "product" column to Y axis
                y: 'rank'
            }
        }
    ]
};

let vul_source_data = {
    legend: {
      itemWidth:5,
      itemHeight:5,
      icon: 'pin',
      orient: 'horizontal',
      left: 0,
      bottom:0,
      data: []
    },
    title: {
      text: "漏洞来源",
      left: "center",
      top: 0
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series: [
      {
        name: "漏洞比例",
        type: "pie",
        radius: "25%",
        center: ["50%", "50%"],
        data: [

        ].sort(function(a, b) {
          return a.value - b.value;
        }),
        roseType: "radius",
        label: {
          normal: {
            textStyle: {
              color: "#000"
            }
          }
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: "#000"
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          }
        },
        itemStyle: {
          normal: {
            // color: "#fff",
            shadowBlur: 200,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function(idx) {
          return Math.random() * 200;
        }
      }
    ]
  }

  let       vul_type_top_data =  {
    // autoresize:true,
    title: {
      text: "漏洞类型 TOP",
      x: "center",
      y: 0
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // type: 'cross',
        animation: false,
        label: {
          backgroundColor: "#aaa",
          borderColor: "#bbb",
          borderWidth: 1,
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          textStyle: {
            color: "#222"
          }
        }
      }
      // formatter: function (params) {
      //     return params[2].name + '<br />' + params[2].value;
      // }
    },
    grid: {
      left: "3%",
      right: "2%",
      bottom: "2%",
      containLabel: true
    },
    xAxis: {
      // type: 'category',
      boundaryGap: false,
      show: true,
      axisLabel: {
        show: true,
        interval: "auto", // {number}
        rotate: 30,
        margin: 10
        // formatter: '{value}月',
        // textStyle: {
        //     color: 'blue',
        //     fontFamily: 'sans-serif',
        //     fontSize: 15,
        //     fontStyle: 'italic',
        //     fontWeight: 'bold'
        // }
      },

      data: [

      ]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [],
        type: "line",
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(40, 182, 252, 0.85)"
              },
              {
                offset: 1,
                color: "rgba(28, 255, 125, 0.2)"
              }
            ])
          }
        },
        itemStyle: {
          normal: {
            color: "#e4e4e4",
            barBorderColor: "#e4e4e4"
          }
        },
        show: true
      }
    ],
    animationDuration: 1500
  }


  let asset_generation_data = {
    title: {
      text: "应用(662)漏洞数量",
      x: "center",
      y: 0
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // type: 'cross',
        animation: false,
        label: {
          backgroundColor: "#ccc",
          borderColor: "#aaa",
          borderWidth: 1,
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          textStyle: {
            color: "#222"
          }
        }
      }
    },
    grid: {
      left: "3%",
      right: "2%",
      bottom: "2%",
      containLabel: true
    },
    xAxis: {
      // type: 'category',
      boundaryGap: false,
      show: true,
      axisLabel: {
        show: true,
        interval: "auto", // {number}
        rotate: 30,
        margin: 10
      },

      data: [

      ]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [],
        type: "line",
        areaStyle: {},
        show: true,
        itemStyle: {
          normal: {
            color: "#409EFF",
            shadowBlur: 200,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ],
    animationDuration: 1500
  }

  let asset_overdue_unsovled_data =  {
    // Make gradient line here
    visualMap: [
      {
        show: false,
        type: "continuous",
        seriesIndex: 0,
        min: 0,
        max: 400
      },
      {
        show: false,
        type: "continuous",
        seriesIndex: 1,
        dimension: 0,
        min: 0,
        max: 500
      }
    ],
    title: {
      text: "应用(34)逾期未修复漏洞数量",
      x: "center",
      y: 0
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // type: 'cross',
        animation: false,
        label: {
          backgroundColor: "#ccc",
          borderColor: "#aaa",
          borderWidth: 1,
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          textStyle: {
            color: "#222"
          }
        }
      }
    },
    grid: {
      left: "3%",
      right: "2%",
      bottom: "2%",
      containLabel: true
    },
    xAxis: {
      // type: 'category',
      boundaryGap: false,
      show: true,
      axisLabel: {
        show: true,
        interval: "auto", // {number}
        rotate: 30,
        margin: 10
      },
      data: [
      ]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [],
        type: "line",
        areaStyle: {},
        show: true
      }
    ],
    animationDuration: 1500
  }

  let asset_overdue_sovled_data =  {
    visualMap: [
      {
        show: false,
        type: "continuous",
        seriesIndex: 0,
        min: 0,
        max: 400
      },
      {
        show: false,
        type: "continuous",
        seriesIndex: 1,
        dimension: 0,
        min: 0,
        max: 500
      }
    ],
    title: {
      text: "应用(190)逾期已修复漏洞数量",
      x: "center",
      y: 0
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // type: 'cross',
        animation: false,
        label: {
          backgroundColor: "#ccc",
          borderColor: "#aaa",
          borderWidth: 1,
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          textStyle: {
            color: "#222"
          }
        }
      }
    },
    grid: {
      left: "3%",
      right: "2%",
      bottom: "2%",
      containLabel: true
    },
    xAxis: {
      // type: 'category',
      boundaryGap: false,
      show: true,
      axisLabel: {
        show: true,
        interval: "auto", // {number}
        rotate: 30,
        margin: 10
      },

      data: [
      ]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [],
        type: "line",
        areaStyle: {},
        show: true
      }
    ],
    animationDuration: 1500
  }
  