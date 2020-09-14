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
          <span class="view-user" style="margin-right:10px;">
            当前用户组 ：
            <span style="color:#3e9b87f3 ">{{viewgroup.name}}</span>
          </span>
          <el-button size="mini" icon="search" @click="$router.go(-1)">返回</el-button>
        </div>
        <div style="float:right">
          <el-button size="mini" icon="search" @click="dataDel()">批量删除</el-button>
          <el-button
            size="mini"
            icon="search"
            v-if="viewgroup.parent==0"
            @click="createSubGroup()"
          >添加子组成员</el-button>
        </div>
      </div>
      <div class="block">
        <div class="handle-box">
          <el-checkbox v-model="isLDAP">从LDAP新建用户</el-checkbox>
          <br />
          <div style="margin-top:10px;">
            <el-autocomplete
              v-model="form.username"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
              :debounce="1000"
              :trigger-on-focus="false"
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

        <!-- 子组操作 -->
        <el-dialog title="子组操作" :visible.sync="subGroupVisible" width="30%">
          <el-form ref="form" :model="sub_group_form" label-width="80px">
            <el-form-item label="角色">
              <el-select v-model="sub_group_form.role_id" placeholder="请选择">
                <el-option
                  v-for="item in role_options"
                  :key="item.id.toString()"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="子组">
              <el-select v-model="sub_group_form.group_id" placeholder="请选择" style="width:50%">
                <el-option
                  v-for="item in sub_group_options"
                  :key="item.id.toString()"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button @click="createOrEdit=!createOrEdit" size="mini" v-if="createOrEdit">新增</el-button>
              <el-input
                v-model="sub_group_form.name"
                placeholder="请输入子组名称"
                style="width:30%"
                v-if="!createOrEdit"
              ></el-input>
              <el-button v-if="!createOrEdit" @click="addSubGroup" size="mini">保存</el-button>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="doSubGroupCreate()">保存</el-button>
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
  trans_params,
} from "@/utils/common";
export default {
  data() {
    return {
      isLDAP: false,
      createOrEdit: true,
      tableData: [],
      restaurants: [],
      form: {},
      sub_group_form: {},
      tableData: [],
      select_word: "",
      cur_page: 1,
      page_size: 10,
      total: 0,
      multipleSelection: [],
      editVisible: false,
      createVisible: false,
      subGroupVisible: false,
      ldap_search_url: "/api/ldap/search",
      user_add_url: "/api/user/add",
      add_url: "/api/groupuser/add",
      del_url: "/api/groupuser/del",
      list_url: "/api/groupuser/list",
      user_list_url: "/api/user/list",
      role_list_url: "/api/role/select",
      sub_group_list_url: "/api/group/child/list",
      group_add_url: "/api/group/add",
      role_options: [],
      sub_group_options: [],
    };
  },
  filters: {
    getDateDiff_timestamp(time) {
      return getDateDiff_timestamp(time);
    },
  },
  created() {
    console.log(this.$router.params);
    this.viewgroup = this.$route.params;
    this.form.group_id = this.viewgroup.id;
    if (!this.viewgroup.id) {
      this.$router.push("/usergroup");
    }
    this.getRoleList();
    this.getData();
  },
  methods: {
    addSubGroup() {
      this.$axios
        .post(
          this.group_add_url,
          trans_params({
            name: this.sub_group_form.name,
            parent: this.viewgroup.id,
          })
        )
        .then((res) => {
          if (res.data.status == 1) {
            this.sub_group_form.group_id = res.data.group_id;
            this.createOrEdit = true;
            this.getSubGroupList();
            this.$message.success("操作成功");
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status + " -  " + res.data.msg
            );
        });
    },
    getRoleList: function () {
      this.$axios
        .get(this.role_list_url, {
          params: {
            type: 1,
          },
        })
        .then((res) => {
          this.role_options = res.data.result;
        });
    },
    getSubGroupList: function () {
      let that = this;
      this.$axios
        .get(this.sub_group_list_url, {
          params: {
            group_id: that.viewgroup.id,
          },
        })
        .then((res) => {
          this.sub_group_options = res.data.result;
        });
    },

    querySearchAsync(queryString, cb) {
      if (this.isLDAP) {
        this.$axios
          .get(this.ldap_search_url, {
            params: {
              search: queryString,
            },
          })
          .then((res) => {
            let result = new Array();
            res.data.result.map(function (v) {
              result.push({
                value: v.username + " " + v.nickname,
                nickname: v.nickname,
                id: v.username,
                email: v.email,
              });
            });
            cb(result);
          });
      } else {
        this.$axios
          .get(this.user_list_url, {
            params: {
              search: queryString,
              page_size: 20,
              group_id: this.form.group_id,
            },
          })
          .then((res) => {
            let result = new Array();
            res.data.result.map(function (v) {
              result.push({ value: v.username, id: v.id });
            });
            console.log(result);
            cb(result);
          });
      }
    },

    doCreate(e) {
      if (this.isLDAP) {
        this.$axios
          .post(
            this.user_add_url,
            trans_params({
              username: this.form.ldap_username,
              email: this.form.email,
              nickname: this.form.nickname,
            })
          )
          .then((res) => {
            if (res.data.status == 1) {
              let user_id = res.data.user_id;
              this.form.user_id = user_id;
              this.$axios
                .post(this.add_url, trans_params(this.form))
                .then((res) => {
                  if (res.data.status == 1) {
                    this.$message.success("操作成功");
                    this.getData();
                  } else
                    this.$message.error(
                      "操作失败, 错误码:" +
                        res.data.status_code +
                        " -  " +
                        res.data.msg
                    );
                  this.createVisible = false;
                  this.editVisible = false;
                });
            } else
              this.$message.error(
                "操作失败, 错误码:" + res.data.status_code + res.data.msg
              );
          });
      } else {
        this.$axios.post(this.add_url, trans_params(this.form)).then((res) => {
          if (res.data.status == 1) {
            this.$message.success("操作成功");
            this.getData();
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status_code + " -  " + res.data.msg
            );
          this.createVisible = false;
          this.editVisible = false;
        });
      }
    },

    doSubGroupCreate(e) {
      this.sub_group_form.user_id = this.subgroup_member_list;
      this.$axios
        .post(this.add_url, trans_params(this.sub_group_form))
        .then((res) => {
          if (res.data.status == 1) {
            this.$message.success("操作成功");
            this.getData();
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status_code + " -  " + res.data.msg
            );
          this.subGroupVisible = false;
        });
    },

    handleSelect(item) {
      if (this.isLDAP) {
        this.form.ldap_username = item.id;
        this.form.nickname = item.nickname;
        this.form.email = item.email;
      } else {
        this.form.user_id = item.id;
      }
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
            group_id: this.viewgroup.id,
          },
        })
        .then((res) => {
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
    sortChange: function (column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
    },
    createSubGroup() {
      let that = this;

      if (this.multipleSelection.length <= 0) {
        this.$message.info("未选择任何成员");
        return;
      }
      this.subgroup_member_list = this.multipleSelection.map(function (item) {
        return item.user_id;
      });
      this.getSubGroupList();
      this.subGroupVisible = true;
      //   this.$message({
      //     type: 'success',
      //     message: '您创建的子组名是: ' + value
      //   });
      // this.$confirm("是否确认此操作", "提示", {
      //   confirmButtonText: "确认",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     this.$axios
      //       .post(this.add_url, trans_params({ id: that.subgroup_member_list,group_id:that.viewgroup.id,group_name:value,role_id:that.form.role_id }))
      //       .then(res => {
      //         if (res.data.status >= 1) {
      //           this.getData();
      //           this.$message.success("操作成功");
      //         } else
      //           this.$message.error("操作失败, 错误码: " + res.data.status);
      //       });
      //   })
      //   .catch(() => {});
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
        this.del_list = this.multipleSelection.map(function (item) {
          return item.id;
        });
        to_del = this.del_list;
      }

      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(this.del_url, trans_params({ id: to_del }))
            .then((res) => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("删除成功");
              } else
                this.$message.error(
                  "删除失败, 错误码: " + res.data.status_code + res.data.msg
                );
            });
        })
        .catch(() => {});
    },
  },
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
