<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 漏洞
        </el-breadcrumb-item>
        <el-breadcrumb-item>日志</el-breadcrumb-item>
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
        <el-button @click="vul_id=null;getData()" size="mini">取消以漏洞名过滤</el-button>

        <el-date-picker
          v-model="time_range"
          type="datetimerange"
          value-format="timestamp"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          align="right"
        ></el-date-picker>
        <div style="float:right">
        </div>
      </div>

      <el-table
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChangeRow"
        highlight-current-row
        @sort-change="sortChange"
      >
        <el-table-column prop="id" label="ID" min-width="100"></el-table-column>
        <el-table-column prop="action" label="操作" min-width="100">
          <template slot-scope="scope">
            <span class="clean-title">{{scope.row.action}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="操作人" min-width="50">

      <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label=" 时间" min-width="50">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.create_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.create_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="关联漏洞" min-width="150">
          <template slot-scope="scope">
            <span class="primary-title insight_sensitive" @click="filterTitle(scope.row.vul_id)">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="150"></el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="cur_page"
          :page-sizes="[10, 20, 50,100]"
          :page-size.sync="page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total.sync="total"
        ></el-pagination>
      </div>
    </div>

    <!-- 新建 -->
    <el-dialog title="新增漏洞" :visible.sync="createVisible" width="80%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="漏洞标题">
          <el-input
            v-model="form.vul_name"
            clearable
            placeholder="请输入漏洞名称"
            size="mini"
            v-validate="'required'"
            type="text"
            name="task_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="关联应用">
          <el-autocomplete
            v-model="form.app_id_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="漏洞层面">
          <el-radio-group v-model="form.layer" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.VUL_LAYER"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="漏洞类型">
          <el-select v-model="form.vul_type" placeholder="请选择" size="mini">
            <el-option
              v-for="(key,item) in static_config.VUL_TYPE"
              :key="item"
              :label="key"
              :value="item"
            >
              <!-- <span
                style="float: right; color: #8492a6; font-size: 13px"
              >共个节点</span>-->
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Rank值">
          <el-input-number
            v-model="form.self_rank"
            controls-position="right"
            :min="0"
            :max="20"
            size="mini"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-tag :type="colortype" size="medium">{{risklevel}}</el-tag>
        </el-form-item>
        <el-form-item label="漏洞来源">
          <el-radio-group v-model="form.vul_source" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.VUL_SOURCE"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选项">
          <el-checkbox v-model="is_report_visible" v-tooltip="'显示漏洞证明编辑器'">漏洞证明</el-checkbox>
          <el-checkbox v-model="is_solution_visible" v-tooltip="'显示解决方案编辑器'">解决方案</el-checkbox>
        </el-form-item>

        <el-form-item label="漏洞证明" v-show="is_report_visible">
          <!-- <codemirror :code="code" :options="cmOptions"  @input="onCmCodeChange"   ></codemirror> -->
          <mavon-editor
            ref="poc_editor"
            v-model="form.vul_poc"
            @change="pocChange"
            @imgAdd="$imgAdd"
          />
        </el-form-item>
        <el-form-item label="解决方案" v-show="is_solution_visible">
          <!-- <codemirror :code="code" :options="cmOptions"  @input="onCmCodeChange"   ></codemirror> -->
          <mavon-editor v-model="form.vul_solution" @imgAdd="$imgAdd" />
        </el-form-item>

        <el-form-item v-if="form_errors.length" style="color:#f78989">
          <b>出现以下问题 :</b>
          <ul>
            <li v-for="error in form_errors" :key="error">{{ error }}</li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreate()">创建</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="editVisible" width="80%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="漏洞标题">
          <el-input
            v-model="form.vul_name"
            clearable
            placeholder="请输入漏洞名称"
            size="mini"
            v-validate="'required'"
            type="text"
            name="task_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="关联应用">
          <el-autocomplete
            v-model="form.app_id_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="漏洞层面">
          <el-radio-group v-model="form.layer" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.VUL_LAYER"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="漏洞类型">
          <el-select v-model="form.vul_type" placeholder="请选择" size="mini" clearable>
            <el-option
              v-for="(key,item) in static_config.VUL_TYPE"
              :key="item"
              :label="key"
              :value="item"
            >
              <!-- <span
                style="float: right; color: #8492a6; font-size: 13px"
              >共个节点</span>-->
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Rank值">
          <el-input-number
            v-model="form.self_rank"
            controls-position="right"
            :min="0"
            :max="20"
            size="mini"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-tag :type="colortype" size="medium">{{risklevel}}</el-tag>
        </el-form-item>
        <el-form-item label="漏洞来源">
          <el-radio-group v-model="form.vul_source" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.VUL_SOURCE"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选项">
          <el-checkbox v-model="is_report_visible" v-tooltip="'显示漏洞证明编辑器'">漏洞证明</el-checkbox>
          <el-checkbox v-model="is_solution_visible" v-tooltip="'显示解决方案编辑器'">解决方案</el-checkbox>
        </el-form-item>

        <el-form-item label="漏洞证明" v-show="is_report_visible">
          <!-- <codemirror :code="code" :options="cmOptions"  @input="onCmCodeChange"   ></codemirror> -->
          <mavon-editor ref="poc_editor" v-model="form.vul_poc" @imgAdd="$imgAdd" />
        </el-form-item>
        <el-form-item label="解决方案" v-show="is_solution_visible">
          <!-- <codemirror :code="code" :options="cmOptions"  @input="onCmCodeChange"   ></codemirror> -->
          <mavon-editor v-model="form.vul_solution" @imgAdd="$imgAdd" />
        </el-form-item>

        <el-form-item v-if="form_errors.length" style="color:#f78989">
          <b>出现以下问题 :</b>
          <ul>
            <li v-for="error in form_errors" :key="error">{{ error }}</li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doCreate()">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params,
  getStaticColors
} from "@/utils/common";
import { global_config } from "@/utils/global_config";

export default {
  name: "curd",
  components: {},
  data() {
    return {
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
      app_list_url: "/api/vullog/list",
      is_report_visible: false,
      is_solution_visible: false,
      cronPopover: false,
      cron: "",
      rank: 0,
      links: [],
      task_type: "立即任务",
      url: "",
      md_report:
        "一、URL地址：\n\
二、发现方式：\n\n\n\
请尽量详细描述，保留场景/截图/重现方法等 \n\n\n\
三、漏洞证明：\n\n\n\
请在这里写POC\n\n\n\
",
      form_errors: [],
      cur_entity: {},
      add_url: "/api/vullog/add",
      list_url: "/api/vullog/list",
      del_url: "/api/vullog/del",
      role_list_url: "/api/role/select",
      del_list: new URLSearchParams(),
      tableData: [],
      select_word: "",
      cur_page: 1,
      page_size: 10,
      total: 0,
      multipleSelection: [],
      editVisible: false,
      createVisible: false,
      vul_id: null,
      form: {
        self_rank: "1",
        layer: 10
      },
      role_options: [
        {
          value: "__",
          label: "--"
        }
      ],
      static_config: global_config
    };
  },

  created() {
    // this.getRoleList();
    this.getData();
  },
  updated() {
    this.$desensitive()
  },
  computed: {
    colortype: function() {
      if (this.form.self_rank >= 0 && this.form.self_rank < 6) {
        return "success";
      } else if (this.form.self_rank < 11) {
        return "";
      } else if (this.form.self_rank < 16) {
        return "danger";
      } else if (this.form.self_rank <= 20) {
        return "warning";
      }
    },
    risklevel: function() {
      if (this.form.self_rank >= 0 && this.form.self_rank < 6) {
        return "低危";
      } else if (this.form.self_rank < 11) {
        return "中危";
      } else if (this.form.self_rank < 16) {
        return "高危";
      } else if (this.form.self_rank <= 20) {
        return "严重";
      }
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

    statusFilter(status) {
      const statusMap = {
        "0": "info",
        "1": "success",
        "-1": "danger"
      };
      return statusMap[status];
    },
    statusNameFilter(status, name) {
      // filt ers:{ filter:function(data,arg1,arg2){ return ... } }
      return global_config[name][status];
    }
  },

  methods: {
    filterTitle(vul_id) {
      this.vul_id = vul_id;
      this.getData();
    },
    statusColor(status) {
      return getStaticColors(status);
    },
    pocChange(value, render) {
      this.form.vul_poc_html = render;
    },

    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("image", $file);
      this.$axios({
        url: "/api/image/upload",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(url => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        console.log(url);
        this.$refs.poc_editor.$img2Url(pos, "api/" + url.data.path);
      });
    },
    handleSelect(item) {
      this.form.app_id = item.id;
    },
    querySearchAsync(queryString, cb) {
      this.$axios
        .get(this.app_list_url, {
          params: {
            search: queryString
          }
        })
        .then(res => {
          let result = new Array();
          res.data.result.map(function(v) {
            result.push({ value: v.appname, id: v.id });
          });
          cb(result);
        });
    },
    handleClose(done) {
      this.$confirm("数据还未提交，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getRoleList: function() {
      this.$axios
        .get(this.role_list_url, {
          params: {
            type: 0
          }
        })
        .then(res => {
          this.role_options = res.data.result;
          console.log(this.role_options);
        });
    },

    sortChange: function(column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
    },

    viewUser() {
      if (this.cur_entity.id) {
        this.$router.push({
          name: "viewvulndetail",
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

    doCreate(e) {
      this.$axios.post(this.add_url, trans_params(this.form)).then(res => {
        if (res.data.status == 1) {
          this.$message.success("操作成功");
          this.getData();
        } else
          this.$message.error(
            "操作失败, 错误码:" + res.data.status + res.data.msg
          );
        this.createVisible = false;
        this.editVisible = false;
      });
    },

    getData() {
      this.$axios
        .get(this.list_url, {
          params: {
            search: this.select_word,
            page_index: this.cur_page,
            page_size: this.page_size,
            sort: this.sortcolumn,
            direction: this.sortorder,
            start: this.time_range ? this.time_range[0] / 1000 : null,
            end: this.time_range ? this.time_range[1] / 1000 : null,
            vul_id: this.vul_id
          }
        })
        .then(res => {
          this.tableData = res.data.result;
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
      delete this.form.create_time;
      this.form.enable = row.enable == 1 ? "1" : "0";
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    dataDel(cur_del_node_id) {
      // 数据删除，支持多个和单个删除

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
                this.$message.success("删除成功");
              } else
                this.$message.error("删除失败, 错误码: " + res.data.status);
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
</style>
