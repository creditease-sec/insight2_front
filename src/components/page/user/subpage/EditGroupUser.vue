<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 用户组管理
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
        <div style="float:right;margin-left:10px">
          <span class="view-user" style="margin-right:10px;">当前用户组 ：<span style="color:#3e9b87f3 "> {{viewuser.name}}</span></span>
          <el-button size="mini" icon="search" @click="$router.go(-1)">返回</el-button>
        </div>
        <div style="float:right">
          <el-button size="mini" icon="search" @click="dataDel()">批量删除</el-button>
        </div>
      </div>
      <div class="block">
        <div class="handle-box">
          <br>
          <div style="margin-top:10px;">
            <el-autocomplete
              v-model="form.username"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
            ></el-autocomplete>
            <el-select v-model="form.role_id" placeholder="请选择">
              <el-option
                v-for="item in role_options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button @click="delete form.id ; doCreate();">添加</el-button>
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
          <el-table-column prop="user_name" label="用户名" min-width="150" sortable="custom"></el-table-column>
          <el-table-column prop="role_name" label="角色" min-width="150" sortable="custom"></el-table-column>
          <el-table-column prop="create_time" label="加入时间" min-width="180" sortable="custom">
            <template slot-scope="scope">{{scope.row.create_time | getDateDiff_timestamp}}</template>
          </el-table-column>
          <el-table-column label="操作" width="320">
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

        <!-- 编辑 -->
        <el-dialog title="编辑用户" :visible.sync="editVisible" width="30%">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="角色">
              <el-select v-model="form.role_id" placeholder="请选择">
                <el-option
                  v-for="item in role_options"
                  :key="item.id.toString()"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" icon="el-icon-edit" @click="doCreate()">修 改</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params
} from "@/utils/common";
export default {
  data() {
    return {
      tableData: [],
      restaurants: [],
      form: {},
      tableData: [],
      select_word: "",
      cur_page: 1,
      page_size: 10,
      total: 0,
      multipleSelection: [],
      editVisible: false,
      createVisible: false,
      add_url: "/api/groupuser/add",
      del_url: "/api/groupuser/del",
      list_url: "/api/groupuser/list",
      user_list_url: "/api/user/list",
      role_list_url: "/api/role/select",
      role_options: []
    };
  },
  filters: {
    getDateDiff_timestamp(time) {
      return getDateDiff_timestamp(time);
    }
  },
  created() {
    this.viewuser = this.$route.params;
    this.form.group_id = this.viewuser.id;
    if (!this.viewuser.id) {
      this.$router.push("/usergroup");
    }
    this.getRoleList();
    this.getData();
  },
  methods: {
    getRoleList: function() {
      this.$axios
        .get(this.role_list_url, {
          params: {
            type: 1
          }
        })
        .then(res => {
          this.role_options = res.data.result;
        });
    },
    querySearchAsync(queryString, cb) {
      this.$axios
        .get(this.user_list_url, {
          params: {
            search: queryString
          }
        })
        .then(res => {
          let result = new Array();
          res.data.result.map(function(v) {
            result.push({ value: v.username, id: v.id });
          });
          console.log(result);
          cb(result);
        });
    },

    doCreate(e) {
      this.$axios.post(this.add_url, trans_params(this.form)).then(res => {
        if (res.data.status == 1) {
          this.$message.success("操作成功");
          this.getData();
        } else
          this.$message.error(
            "操作失败, 错误码:" + res.data.status +" -  "+ res.data.msg
          );
        this.createVisible = false;
        this.editVisible = false;
      });
    },

    handleSelect(item) {
      this.form.user_id = item.id;
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
            group_id: this.viewuser.id
          }
        })
        .then(res => {
          console.log();
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
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sortChange: function(column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
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
