<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 资产详情
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="block">
        <div class="handle-box">
          <el-button size="mini" icon="search" @click="$router.go(-1)">返回</el-button>
        </div>

        <el-row>
          <el-col :span="24">
            <el-form label-position="left" inline>
              <el-form-item label="对应应用名称">
                <span class="data-content" type="text">{{viewuser.appname}}</span>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="24">
            <el-form label-position="left" inline>
              <el-form-item label="名称">
                <span class="data-content" type="text">{{viewuser.name}}</span>
              </el-form-item>

              <el-form-item label="资产">
                <span class="data-content" type="text">{{viewuser.value }}</span>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="24">
            <el-form label-position="left" inline style="width:100%">
              <el-form-item label="更新时间">
                <span class="data-content" type="text">{{viewuser.update_time| formatDate}}</span>
              </el-form-item>

              <el-form-item label="创建时间">
                <span class="data-content" type="text">{{viewuser.create_time| formatDate }}</span>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="24">
            <el-form label-position="left" inline>
              <el-form-item label="外网">
                <span class="data-content" type="text">{{viewuser.is_open}}</span>
              </el-form-item>

              <el-form-item label="HTTPS">
                <span class="data-content" type="text">{{viewuser.is_https }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
import { formatDate } from "@/utils/common";
export default {
  data() {
    return {};
  },
  created() {
    this.viewuser = this.$route.params;
    if (!this.viewuser.id) {
      this.$router.push("/curd");
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(Math.trunc(time * 1000));
      return formatDate(date, "yyyy-MM-dd HH:mm:ss");
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

.view-user {
  word-break: break-all;
  line-height: 23px;
  position: relative;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  color: #606266;
}
</style>
