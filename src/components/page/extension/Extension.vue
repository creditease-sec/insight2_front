<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 扩展
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入关键词"
          class="handle-input"
          @keyup.enter.native="search()"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>
        <el-button size="mini" icon="search" @click="$router.push({name: 'extensionlog' })">执行日志</el-button>
      </div>

      <div>
        <el-row>
          <el-col :span="8">
            <el-card style="width:90%;margin:3%;" shadow="hover">
              <div style="text-align:center;height:5.5em;">
                <div style="margin-top:70px;">
                  <el-button
                    type="text"
                    class="hover-green"
                    @click="createVisible=true; form={enable:1} ; $refs.myVueDropzone?$refs.myVueDropzone.removeAllFiles():null;"
                  >
                    <span style="font-size:15px;">+ 新增扩展</span>
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8" v-for="ex in ex_list" :key="ex.no">
            <el-card style="width:90%;margin:3%">
              <div slot="header" class="clearfix">
                <span class="hover-green">{{ex.name}}({{ex.eid}}) {{ex.version}}</span>
                <el-button
                  style="float: right; padding: 3px 0; "
                  type="text"
                  @click="delExtension(ex)"
                >移除</el-button>
                <el-button
                  style="float: right; padding: 3px 0;"
                  type="text"
                  @click="configExtension(ex)"
                >配置</el-button>
                     <el-tag type="success" v-if="ex.status">启用 </el-tag>
                 <el-tag type="danger" v-else>禁用 </el-tag>
                <el-button @click="updateSwich(ex.eid,ex.status)" size="mini">切换</el-button>
              </div>
              <div class="ant-card-body">
                <div class="ant-card-meta-avatar" style="float:left">
                  <img alt class="antd-pro-pages-list-card-list-style-cardAvatar" :src="ex.path" />
                </div>
                <div
                  class="ant-card-meta-detail"
                  style="width:70%;float:right;margin:0px 10px 30px 10px;    font-size: 14px;
    color: #303133;"
                >
                  <div class="ant-card-meta-description">
                    <div
                      class="ant-typography antd-pro-pages-list-card-list-style-item ant-typography-ellipsis ant-typography-ellipsis-multiple-line"
                      style="-webkit-line-clamp: 3; height:50px;"
                    >{{ex.desc}}</div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 新建 -->
    <el-dialog title="导入扩展" :visible.sync="createVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="备注">
          <el-input v-model="remark" clearable></el-input>
        </el-form-item>
        <el-form-item label>
          <vue-dropzone
            ref="myVueDropzone"
            id="dropzone"
            :options="dropzoneOptions"
            v-on:vdropzone-sending="sendingEvent"
            v-on:vdropzone-complete="upload_complete"
          ></vue-dropzone>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importPluginDo()">导入扩展</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-select v-model="form.enable" placeholder="请选择">
            <el-option key="1" label="启用" value="1">启用</el-option>
            <el-option key="0" label="禁用" value="0">禁用</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="checkForm()&&doCreate()">修 改</el-button>
      </span>
    </el-dialog>

    <!-- 配置 -->
    <el-dialog title="配置" :visible.sync="configVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <div v-for="p in cur_config_template" v-bind:key="p.name">
          <el-form-item :label="p.name">
            <el-input
              v-model="form[p.name]"
              :placeholder="'参数名: '+p.name+' [必填项]'"
              style="margin-top:10px;"
              clearable
              :maxlength="p.max_length"
              :type="p.input_type"
              :rows="p.row"
              show-word-limit
            ></el-input>
            <div
              style="font-size: 12px;margin-top:5px;margin-left:2px; color: #72726c;"
            >参数说明: {{p.comment}}</div>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="saveConfig()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, trans_params } from "@/utils/common";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  name: "curd",
  components: {
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      configVisible: false,
      cur_config_template: [],
      cur_eid: -1,
      remark: null,
      enable: 1,
      dropzoneOptions: {
        url: "api/extension/upload",
        resizeWidth: 50,
        resizeHeight: 50,
        maxFilesize: 5.0,
        autoProcessQueue: false,
        dictDefaultMessage: "拖拽文件到此处上传"
      },
      ex_list: [],

      form_errors: [],
      cur_entity: {},
      add_url: "api/extension/config",
      list_url: "/api/extension/list",
      del_url: "/api/extension/del",
      del_list: new URLSearchParams(),
      tableData: [],
      select_word: "",
      cur_page: 1,
      page_size: 10,
      total: 0,
      multipleSelection: [],
      editVisible: false,
      createVisible: false,
      form: {
        enable: "1"
      }
    };
  },

  created() {
    this.getData();
  },

  computed: {},

  filters: {
    formatDate(time) {
      let date = new Date(Math.trunc(time * 1000));
      return formatDate(date, "yyyy-MM-dd HH:mm:ss");
    },

    statusFilter(status) {
      const statusMap = {
        0: "info",
        1: "success",
        2: "danger"
      };
      return statusMap[status];
    }
  },

  methods: {
    configExtension(row) {
      this.configVisible = true;
      this.cur_config_template = row.config_template;
      this.form=row.config
      this.cur_eid = row.eid;
    },
    delExtension(row) {
      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.del_url, trans_params({ eid: row.eid }))
            .then(res => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("移除成功");
              } else
                this.$message.error("移除失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
    },
    importPlugin() {
      this.newNodeGroupVisible = true;
      if (this.$refs.myVueDropzone) {
        this.$refs.myVueDropzone.removeAllFiles();
      }
      this.remark = "";
    },
    sendingEvent(file, xhr, formData) {
      formData.append("remark", this.remark);
      formData.append("enable", this.enable ? 1 : 0);
    },

    upload_complete(file) {
      let res = JSON.parse(file.xhr.responseText);
      if (res.status) {
        this.$message.success("上传成功");
        this.createVisible = false;
        this.getData();
      } else {
        this.$message.error("上传失败:" + res.msg);
      }
    },

    importPluginDo() {
      this.$refs.myVueDropzone.processQueue();
      this.createVisible = false;
      this.getData();
    },

    sortChange: function(column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
    },

    viewUser() {
      if (this.cur_entity.id) {
        this.$router.push({
          name: "viewuser",
          params: this.cur_entity
        });
      } else {
        this.$message.info("请选择数据");
      }
    },
    checkForm: function() {
      if (
        this.form.username &&
        this.form.password &&
        this.form.repassword &&
        this.form.enable != null &&
        this.form.password == this.form.repassword
      ) {
        return true;
      }

      this.form_errors = [];

      if (!this.form.username) {
        this.form_errors.push("请输入用户名");
      }
      if (!this.form.password) {
        this.form_errors.push("请输入密码");
      }

      if (!this.form.repassword) {
        this.form_errors.push("请输入重复密码");
      }

      if (
        this.form.repassword &&
        this.form.repassword &&
        this.form.username !== this.form.repassword
      ) {
        this.form_errors.push("两次密码输入不一致");
      }
      if (!this.form.enable) {
        this.form_errors.push("请选择状态");
      }
    },
    updateSwich(eid, value) {
      this.$axios
        .post("api/extension/enable", trans_params({ eid: eid, status: value?0:1 }))
        .then(res => {
          if (res.data.status == 1) {
            this.$message.success("操作成功");
            this.getData();
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status + res.data.msg
            );

          this.configVisible = false;
        });
    },
    saveConfig(e) {
      this.form.eid = this.cur_eid;
      this.$axios.post(this.add_url, trans_params(this.form)).then(res => {
        if (res.data.status == 1) {
          this.$message.success("操作成功");
          this.getData();
        } else
          this.$message.error(
            "操作失败, 错误码:" + res.data.status + res.data.msg
          );

        this.configVisible = false;
      });
    },

    getData() {
      this.$axios
        .get(this.list_url, {
          params: {
            search: this.select_word
          }
        })
        .then(res => {
          this.ex_list = res.data.result;
          this.total = res.data.total;
        });
    },

    handleSizeChange(val) {
      this.page_size = val;
      this.getData();
    },

    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },

    handleCurrentChangeRow(val) {
      this.cur_entity = val;
    },

    search() {
      this.getData();
    },

    handleEdit(index, row) {
      this.form_errors = [];
      this.editVisible = true;
      this.form = row;
      delete this.form.password;
      delete this.form.create_time;
      this.form.enable = row.enable == 1 ? "1" : "0";
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    dataDel(cur_del_node_id) {
      // 数据移除，支持多个和单个移除

      let to_del = null;

      if (cur_del_node_id) {
        to_del = cur_del_node_id;
      } else {
        if (this.multipleSelection.length <= 0) {
          this.$message.info("未选择任何数据");
          return;
        }
        this.del_list = this.multipleSelection.map(function(item) {
          return item.id;
        });
        to_del = this.del_list;
      }

      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.del_url, trans_params({ id: to_del }))
            .then(res => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("移除成功");
              } else
                this.$message.error("移除失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
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
  width: 200px;
  display: inline-block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.bottom {
  margin-bottom: 13px;
}

.ant-card-meta-detail {
  overflow: hidden;
}
.ant-list * {
  outline: none;
}
.ant-card-body {
  padding: 24px;
  zoom: 1;
}
.antd-pro-pages-list-card-list-style-cardAvatar {
  width: 48px;
  height: 48px;
  border-radius: 48px;
}

.antd-pro-pages-list-card-list-style-cardList
  .antd-pro-pages-list-card-list-style-card
  .ant-card-meta-title
  > a {
  display: inline-block;
  max-width: 100%;
  color: rgba(0, 0, 0, 0.85);
}

div {
  display: block;
}

.hover-green:hover {
  color: #3e9b87f3;
  cursor: pointer;
}
</style>
