<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 用户
        </el-breadcrumb-item>
        <el-breadcrumb-item>用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="createVisible=true; form={enable:'1'}"
          size="mini"
        >新增用户</el-button>
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入关键词"
          class="handle-input"
          @keyup.enter.native="search()"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>
        <div style="float:right">
          <el-button size="mini" @click="getInvalidClearStatus();invalidClear()">失效用户清理</el-button>
          <el-button size="mini" icon="search" @click="dataDel()">批量删除</el-button>
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
        <el-table-column type="selection" width="45"></el-table-column>
        <!-- <el-table-column prop="id" label="ID" min-width="70" sortable="custom"></el-table-column> -->
        <el-table-column prop="username" label="用户名" min-width="150" sortable="custom">
          <template slot-scope="scope">
            <span
              :style="scope.row.ldap_online==1?'color:#3e9b87f3' :'color:#b34040'"
              v-tooltip="'用户是否离职'"
              v-show="scope.row.auth_from!='LOCAL'"
            >●</span>
            <span class="second-title insight_sensitive">{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="角色" min-width="150" sortable="custom"></el-table-column>
        <el-table-column prop="create_time" label="编辑时间" min-width="180" sortable="custom">
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
        <el-table-column prop="login_time" label="最后登录" min-width="180" sortable="custom">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.login_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.login_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="active_time" label="最后活跃" min-width="180" sortable="custom">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.active_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.active_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="enable" label="启用状态" min-width="150" sortable="custom">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.enable | statusFilter"
            >{{ scope.row.enable>= 0? (scope.row.enable ===1 ? "启用":"禁用"):"未激活"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <span size="mini" v-tooltip="'编辑'" @click="handleEdit(scope.$index, scope.row)">
              <i class="el-iconbianji2 iconfont_no_margin sumeru_op_button"></i>
            </span>
            <span size="mini" v-tooltip="'删除'" type="danger" @click="dataDel(scope.row.id)">
              <i class="el-iconshanchu1 iconfont_no_margin sumeru_op_button sumeru_red"></i>
            </span>
          </template>
        </el-table-column>
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
    <el-dialog title="新建用户" :visible.sync="createVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input v-model="form.repassword" type="password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form.email" clearable></el-input>
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="form.role_id" placeholder="请选择">
            <el-option
              v-for="item in role_options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="启用状态">
          <el-select v-model="form.enable" placeholder="请选择">
            <el-option key="1" label="启用" value="1">启用</el-option>
            <el-option key="0" label="禁用" value="0">禁用</el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form_errors.length" style="color:#f78989">
          <b>出现以下问题 :</b>
          <ul>
            <li v-for="error in form_errors" :key="error">{{ error }}</li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkForm()&&doCreate()">创建</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role_id" placeholder="请选择">
            <el-option
              v-for="item in role_options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="启用状态">
          <el-select v-model="form.enable" placeholder="请选择">
            <el-option key="1" label="启用" value="1">启用</el-option>
            <el-option key="0" label="禁用" value="0">禁用</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doCreate()">修 改</el-button>
      </span>
    </el-dialog>

    <!-- 失效用户清理 -->
    <el-dialog title="失效用户清理" :visible.sync="invalidClearVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="清理选项">
          <el-select
            size="mini"
            v-model="select_range_status"
            placeholder="请选择时间段"
            class="handle-select mr10"
          >
            <el-option
              v-for="item in invalid_status_options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.count }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doClearInvalid()">清理</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params
} from "@/utils/common";

export default {
  name: "curd",
  components: {},
  data() {
    return {
      form_errors: [],
      cur_entity: {},
      add_url: "/api/user/add",
      list_url: "/api/user/list",
      del_url: "/api/user/del",
      role_list_url: "/api/role/select",
      clear_url: "/api/user/clear",
      del_list: new URLSearchParams(),
      tableData: [],
      select_word: "",
      cur_page: 1,
      page_size: 10,
      total: 0,
      multipleSelection: [],
      invalidClearVisible: false,
      editVisible: false,
      createVisible: false,
      form: {
        enable: "1",
        role_id: ""
      },
      select_range_status: "0",
      invalid_status_options: [
        {
          value: 0,
          name: "加载中",
          count: 0
        }
      ],
      role_options: [
        {
          value: "选项",
          label: "默认"
        }
      ]
    };
  },

  created() {
    this.getRoleList();
    this.getInvalidClearStatus();
    this.getData();
  },
  computed: {},
  updated() {
    this.$desensitive();
  },
  computed: {},

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
    }
  },

  methods: {
    doClearInvalid() {
      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              this.clear_url,
              trans_params({ id: this.select_range_status })
            )
            .then(res => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("删除成功");
                this.invalidClearVisible = false;
              } else this.$message.error("删除失败,  " + res.data.msg);
              this.invalidClearVisible = false;
            });
        })
        .catch(() => {});
    },
    getInvalidClearStatus() {
      this.$axios.get(this.clear_url).then(res => {
        this.invalid_status_options = res.data.result;
      });
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
    invalidClear() {
      this.invalidClearVisible = true;
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
            direction: this.sortorder
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
              } else this.$message.error("删除失败,  " + res.data.msg);
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
