<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> API Key 生成
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="block" style="width:50%">
        <div style="margin-top:10px;width:70%;">
          <el-form ref="form" label-width="80px">
            <el-form-item label="API Key ">
              <el-input v-model="apikey" placeholder="待生成"></el-input>
            </el-form-item>

            <el-form-item label="命令示例">
              <div style="margin-top:10px;width:100%;">
                <el-input v-model="curl_eg" type="textarea" :rows="10" placeholder="cURL 示例"></el-input>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button @click="keyGen">重新生成</el-button>
              <el-checkbox
                v-model="is_enable"
                :checked="is_enable"
                size="mini"
                style="margin-left:10px;padding-top:5px;"
                @change="enbaleKey"
              >启用</el-checkbox>
              <el-button
                type="text"
                style="color:green !important;"
                @click="$router.push('doc')"
              >查看API文档</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { trans_params } from "@/utils/common";
export default {
  data() {
    return {
      apikey: "",
      is_enable: true,
      curl_eg: ""
    };
  },
  created() {
    this.keyGet();
  },
  methods: {
    keyGen() {
      this.$axios.post("/api/user/apikey/gen").then(res => {
        if (res.data.status >= 1) {
          this.$message.success("生成成功");
          this.apikey = res.data.apikey;
          this.keyGet();
        } else {
          this.$message.error("失败,  " + res.data.msg);
        }
      });
    },
    keyGet() {
      this.$axios.get("/api/user/apikey/get").then(res => {
        if (res.data.status >= 1) {
          this.apikey = res.data.apikey;
          this.is_enable = res.data.enable == 1;
          this.curl_eg =
            "curl " +
            res.data.host +
            "/api/user/apikey/test?token=" +
            res.data.apikey;
        }
      });
    },
    enbaleKey(val) {
      this.$axios
        .post("/api/user/apikey/enable", trans_params({ enable: val ? 1 : 0 }))
        .then(res => {
        });
    }
  }
};
</script>

