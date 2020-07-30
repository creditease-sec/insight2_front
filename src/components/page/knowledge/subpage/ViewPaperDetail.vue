<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 文章详情
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="block" id="vul_report">
        <el-row>
          <span class="vuln-title">{{viewvul.vul_name}}</span>
          <el-button size="mini" style="float:right" @click="$router.go(-1)">返回</el-button>
          <br />

          <span class="data-content-green" type="text">{{viewvul.title}}</span>
          <hr style="margin-top:20px;margin-bottom:0px;background-color:#606266;height: 1px;" />
          <br />
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form label-position="left" inline style="width:100%">
              <el-form-item label="作者">
                <span class="data-content" type="text">{{viewvul.author}}</span>
              </el-form-item>

              <el-form-item label="发布时间">
                <span class="data-content" type="text">{{viewvul.publish_time | formatDate }}</span>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="8">
            <el-form label-position="left" inline>
              <el-form-item label="分类">
                <span class="data-content" type="text">{{viewvul.category_name}}</span>
              </el-form-item>

              <el-form-item label="修改时间">
                <span class="data-content" type="text">{{viewvul.modify_time|formatDate}}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <hr style="margin-top:20px;margin-bottom:20px;background-color:#606266;height: 1px;" />
        <div style="width:60%;">
          <div v-html="viewvul.content_type==1?marked(filterXSS(viewvul.md_raw_content)):viewvul.content" class="markdown-body"></div>
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
      viewvul: { vul_name: "" }
    };
  },
  created() {
    if (this.$route.query.id) {
      console.log(this.$route.query);
      this.$axios
        .get(" /api/paper/get?id=" + this.$route.query.id, {})
        .then(res => {
          console.log(res);
          this.viewvul = res.data;
        });
    } else {
      if (!this.$route.params.id) {
        this.$router.push("/paper");
      }
      this.viewvul = this.$route.params;
    }
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
      // filt ers:{ filter:function(data,arg1,arg2){ return ... } }
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
      // let newstr = document.getElementById('vul_report').innerHTML
      // document.body.innerHTML = newstr
      // window.print()
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
  color: rgb(143, 171, 190) !important;
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
  font-size: 25px;
  font-weight: bold;
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
  background: #ffffff;
  padding: 60px;
  margin: 10px;
}
</style>
 