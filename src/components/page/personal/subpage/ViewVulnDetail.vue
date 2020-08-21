<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 漏洞详情
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="block" id="vul_report">
        <!-- {{viewvul}} -->
        <el-row>
          <span class="vuln-title insight_sensitive">{{viewvul.vul_name}}</span>
          <!-- <el-button size="mini" style="float:right" @click="$router.go(-1)">返回</el-button> -->
          <el-button size="mini" style="float:right;margin-right:10px;" @click="getPdf">导出预览PDF</el-button>
          <el-button size="mini" style="float:right" @click="doPrint">打印</el-button>

          <br />
          <hr style="margin-top:20px;margin-bottom:20px;background-color:#606266;height: 1px;" />
          <br />
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form label-position="left" inline style="width:100%">
              <el-form-item label="作者">
                <span class="data-content insight_sensitive" type="text">{{viewvul.username}}</span>
              </el-form-item>

              <el-form-item label="关联方案" >
                <span
                  style="color:409eff ;font-weight:bold;cursor: pointer;"
                  type="text"
                  @click="$router.push( {path:'/n_viewpaperdetail?id='+viewvul.article_id})"
                >{{viewvul.article_name?viewvul.article_name:"" }}</span>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="8">
            <el-form label-position="left" inline>
              <el-form-item label="相关应用">
                <span class="data-content insight_sensitive" type="text">{{viewvul.appname}}</span>
              </el-form-item>

              <el-form-item label="漏洞类型">
                <span
                  class="data-content"
                  type="text"
                >{{viewvul.vul_type | statusNameFilter("VUL_TYPE") }}</span>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="3">
            <el-form label-position="left" inline>
              <el-form-item label="自评Rank">
                <span class="data-content" type="text">{{viewvul.self_rank}}</span>
              </el-form-item>

              <el-form-item label="风险等级">
                <span class="data-content" type="text" v-if="viewvul.vul_level==0">{{risklevel}}</span>
                <span
                  class="data-content"
                  type="text"
                  v-else
                >{{viewvul.vul_level | statusNameFilter("VUL_LEVEL")}}</span>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="6">
            <el-form label-position="left" inline>
              <el-form-item label="开始时间">
                <span class="data-content" type="text" v-if="viewvul.notice_time==0">未审核</span>
                <span class="data-content" type="text" v-else>{{viewvul.notice_time|formatDate}}</span>
              </el-form-item>

              <el-form-item label="结束时间">
                <span class="data-content" type="text" v-if="viewvul.fix_time==0">未完成</span>
                <span class="data-content" type="text" v-else>{{viewvul.fix_time|formatDate}}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <hr style="margin-top:20px;margin-bottom:20px;background-color:#606266;height: 1px;" />
        <div style="width:60%;">
          <div v-html="marked(filterXSS(viewvul.vul_poc)) " class="markdown-body insight_sensitive"></div>
        </div>
        <hr style="margin-top:20px;margin-bottom:20px;margin-left:30%;margin-right:30%;background-color:#e8eaef;height: 1px;" />

        <div style="width:60%;">
          <div v-html="marked(filterXSS(viewvul.vul_solution))  " class="markdown-body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Qs from "qs";
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params,
  getStaticColors
} from "@/utils/common";
import { global_config } from "@/utils/global_config";

import  "static/css/markdown_style.css";
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import Print from "print-js";

export default {
  data() {
    return {
      static_config: global_config,
      viewvul: { self_rank: 0 }
    };
  },
  computed: {
    risklevel: function() {
      if (this.viewvul.self_rank >= 0 && this.viewvul.self_rank < 6) {
        return "低危";
      } else if (this.viewvul.self_rank < 11) {
        return "中危";
      } else if (this.viewvul.self_rank < 16) {
        return "高危";
      } else if (this.viewvul.self_rank <= 20) {
        return "严重";
      } else {
        return "未知";
      }
    }
  },
  updated() {
    this.$desensitive();
  },
  created() {
    if (this.$route.query.id) {
      console.log(this.$route.query.id);
      this.$axios
        .get("/api/vul/nget", { params: { id: this.$route.query.id } })
        .then(res => {
          console.log(res.data);
          this.viewvul = res.data;
          if (res.data.status_code == 403) {
            this.$message.error("操作失败, " + res.data.msg);
          }
        });
    } else if (!this.$route.params.id) {
      this.$router.push("/n_open_vulns");
    } else {
    }

    this.viewvul = this.$route.params;
  },
  mounted() {
    this.$desensitive();
  },
  filters: {
    getDateDiff_timestamp(time) {
      return getDateDiff_timestamp(time);
    },

    formatDate(time) {
      let date = new Date(Math.trunc(time * 1000));
      return formatDate(date, "yyyy-MM-dd HH:mm:ss");
    },

    statusNameFilter(status, name, default_status = "其他") {
      let statusName = global_config[name][status];
      if (global_config[name][status]) {
        return global_config[name][status];
      } else {
        return default_status;
      }
    }
  },
  methods: {
    doPrint() {
      Print({
        printable: "vul_report",
        type: "html",
        // 继承原来的所有样式
        targetStyles: ["*"]
      });
    },
    getPdf() {
      var title = this.viewvul.vul_name;
      html2Canvas(document.querySelector("#vul_report"), {
        allowTaint: true
      }).then(function(canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let PDF = new JsPDF("", "pt", "a4");
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        PDF.save(title + ".pdf");
      });
    }
  }
};
</script>



<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 150px;

  display: inline-block;
}

.label {
  width: 90px;
  color: #99a9bf;
}
.el-form-item {
  font-size: 5px !important;
  margin-right: 0;
  margin-bottom: 0;
  width: 90%;
}
.el-form-item--small.el-form-item {
  margin-bottom: 0 !important;
}
.data-content {
  color: rgb(71, 158, 216) !important;
  font-weight: bold;
}
.data-content-yellow {
  color: rgb(147, 153, 57) !important;
}
.data-content-orange {
  color: rgb(219, 39, 48) !important;
}
.data-content-grey {
  color: #69827c !important;
}
.data-content-blue {
  color: #112041;
}
.data-content-green {
  color: #20856d !important;
}
.vuln-title {
  font-size: 30px;
  font-weight: normal;
  line-height: 1.3;
  color: #20856d;
  letter-spacing: -1px;
  margin-bottom: 80px;
}
.markdown-body > img {
  width: 50%;
}

.block {
  border: solid 0.1px #dbdbdb;
  background: #f8f8f8;
  padding: 60px;
  margin: 10px;
}
</style>
