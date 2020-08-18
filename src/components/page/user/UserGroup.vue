<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 用户
        </el-breadcrumb-item>
        <el-breadcrumb-item>用户组</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="createVisible=true; form={enable:'1'}"
          size="mini"
        >新增用户组</el-button>
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入关键词"
          class="handle-input"
          @keyup.enter.native="search()"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>

        <div style="float:right">
          <el-button size="mini" type="primary" @click="form_sub_group={};addSubGroup()">创建子组</el-button>
          <el-button size="mini" type="primary" @click="viewGroupUser()">管理成员</el-button>
          <el-button size="mini" type="primary" @click="changeGroupOwner">拥有者变更</el-button>
          <el-button size="mini" icon="search" @click="dataDel()">批量删除</el-button>
        </div>
      </div>

      <el-table
        :data="tableData"
        ref="dataTable"
        border
        @select="handleSelect"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChangeRow"
        highlight-current-row
        @sort-change="sortChange"
        row-key="id"
        lazy
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'group_child_count'}"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="name" label="用户组" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="second-title insight_sensitive" :style="{'color':scope.row.parent==0?'#35423ff3':'#6fa397'}">{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="task_type" label="成员数量" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.usercount}}</template>
        </el-table-column>
        <el-table-column prop="task_type" label="子组数" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.group_child_count}}</template>
        </el-table-column>


        <el-table-column prop="desc" min-width="110" label="描述">
          <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.desc}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="owner" min-width="110" label="拥有者">
          <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.owner}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="update_time"
          label="创建时间"
          min-width="100"
          sortable
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.update_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.update_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80">
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
    <el-dialog title="新建用户组" :visible.sync="createVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户组名">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc" tclearable></el-input>
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

    <!-- 新建子组 -->
    <el-dialog title="新建子组" :visible.sync="addSubGroupVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="子组名">
          <el-input v-model="form_sub_group.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form_sub_group.desc" tclearable></el-input>
        </el-form-item>

        <el-form-item v-if="form_errors.length" style="color:#f78989">
          <b>出现以下问题 :</b>
          <ul>
            <li v-for="error in form_errors" :key="error">{{ error }}</li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkFormSub()&&doCreateSub()">创建</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="子组名">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc" tclearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doCreate()">修 改</el-button>
      </span>
    </el-dialog>

    <!-- 编辑子组 -->
    <el-dialog title="编辑" :visible.sync="editSubGroupVisible" width="30%">
      <el-form ref="form" :model="form_sub_group" label-width="80px">
        <el-form-item label="用户组名">
          <el-input v-model="form_sub_group.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form_sub_group.desc" tclearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doCreateSub()">修 改</el-button>
      </span>
    </el-dialog>


    <!--拥有者变更 -->
    <el-dialog title="拥有者变更" :visible.sync="groupOwnerChangeVisible" width="30%">
      <el-form label-width="80px">
        <el-form-item
          label="当前"
        >{{JSON.stringify(cur_entity)!="{}"&&cur_entity!=undefined&&cur_entity!=null?cur_entity.name+" - "+cur_entity.owner:""}}</el-form-item>
        <el-form-item label="变更为">
          <el-autocomplete
            v-model="owner_form.username"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleOwnerSelect"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doChange()">确认变更</el-button>
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
      user_list_url: "/api/user/list",
      change_url: "/api/group/owner/set",
      add_url: "/api/group/add",
      list_url: "/api/group/list",
      del_url: "/api/group/del",
      role_list_url: "/api/role/select",
      sub_group_list_url: "/api/group/child/list",
      del_list: new URLSearchParams(),
      tableData: [],
      select_word: "",
      cur_page: 1,
      page_size: 10,
      total: 0,
      multipleSelection: [],
      editVisible: false,
      createVisible: false,
      addSubGroupVisible:false,
      editSubGroupVisible:false,
      groupOwnerChangeVisible: false,
      form: {
        enable: "1",
        role_id: ""
      },
      form_sub_group:{

      },
      owner_form: {
        username: ""
      },
      role_options: []
    };
  },

  created() {
    this.getRoleList();
    this.getData();
  },
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

    load(tree, treeNode, resolve) {
            
            this.$axios
              .get(this.sub_group_list_url, {
                params: {
                  group_id: tree.id
                }
              })
              .then(res => {
                resolve(res.data.result);
               
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
          cb(result);
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
          // console.log(this.role_options);
        });
    },
    handleOwnerSelect(item) {
      this.owner_form.owner_id = item.id;
    },

    sortChange: function(column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
    },

    viewGroupUser() {
      if (JSON.stringify(this.cur_entity) != "{}") {
        this.$router.push({
          name: "editgroupuser",
          params: this.cur_entity
        });
      } else {
        this.$message.info("请选择数据");
      }
    },
    addSubGroup() {
       
      if (
        JSON.stringify(this.cur_entity) != "{}" &&
        this.cur_entity != null &&
        this.cur_entity != undefined
      ) {
        console.log(this.cur_entity.id)
        this.form_sub_group.parent = this.cur_entity.id
        this.addSubGroupVisible = true;
      } else {
        this.$message.info("请选择数据");
      }

    },

    changeGroupOwner() {
      if (
        JSON.stringify(this.cur_entity) != "{}" &&
        this.cur_entity != null &&
        this.cur_entity != undefined
      ) {
        this.owner_form.id = this.cur_entity.id;
        this.groupOwnerChangeVisible = true;
      } else {
        this.$message.info("请选择数据");
      }
    },

    checkForm: function() {
      if (this.form.name) {
        return true;
      }

      this.form_errors = [];

      if (!this.form.name) {
        this.form_errors.push("请输入用户组名");
      }
    },

    doCreateSub(e) {
      this.$axios.post(this.add_url, trans_params(this.form_sub_group)).then(res => {
        if (res.data.status == 1) {
          this.$message.success("操作成功");
          this.getData();
        } else
          this.$message.error(
            "操作失败, 错误码:" + res.data.status + res.data.msg
          );
        this.addSubGroupVisible = false;
        this.editSubGroupVisible = false;
      });
    },

    checkFormSub: function() {
      if (this.form_sub_group.name) {
        return true;
      }

      this.form_errors = [];

      if (!this.form_sub_group.name) {
        this.form_errors.push("请输入用户组名");
      }
    },

    doChange(e) {
      this.$axios
        .post(this.change_url, trans_params(this.owner_form))
        .then(res => {
          if (res.data.status == 1) {
            this.$message.success("操作成功");
            this.getData();
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status + res.data.msg
            );
          this.groupOwnerChangeVisible = false;
        });
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
      if(row.parent == 0){
        this.form_errors = [];
        this.editVisible = true;
        this.form = row;
      }else{
        this.form_errors = [];
        this.editSubGroupVisible = true;
        this.form_sub_group = row;
      }
 
    },
    handleSelect(val, row) {
      this.$refs.dataTable.setCurrentRow(row);
      this.cur_entity = row;
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
                this.$message.error("删除失败, 错误码: " + res.data.status_code+res.data.msg);
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
