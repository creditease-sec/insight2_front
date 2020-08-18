<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 用户
        </el-breadcrumb-item>
        <el-breadcrumb-item>角色</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="createVisible=true; form={enable:'1'}"
          size="mini"
        >增加角色</el-button>
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入关键词"
          class="handle-input"
          @keyup.enter.native="search()"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>

        <div style="float:right">
        
          <el-button size="mini" icon="search" @click="dataDel()">删除</el-button>
        </div>
      </div>

      <el-table
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChangeRow"
        highlight-current-row
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <!-- <el-table-column prop="id" min-width="20" label="ID"></el-table-column> -->
        <el-table-column prop="name" label="角色名" min-width="80" sortable >
          <template slot-scope="scope">
           <span  class="second-title">     {{scope.row.name}}  </span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述" min-width="80"></el-table-column>
        <el-table-column prop="level" label="级别" min-width="80" sortable ></el-table-column>
        <el-table-column prop="default" label="默认" min-width="80" sortable >
          <template slot-scope="scope">
            <span>{{  scope.row.default===1 ?"✓":"" }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="类型" min-width="80" sortable >
          <template slot-scope="scope">
            <span>{{  scope.row.type===1 ?"审核角色":"系统角色" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button size="mini"   @click="setDefault(scope.row)">
            设为默认  
            </el-button>

            <span size="mini" v-tooltip="'编辑'" @click="handleEdit(scope.$index, scope.row)">
              <i class="el-iconbianji2 iconfont_no_margin sumeru_op_button"></i>
            </span>
            <span size="mini" v-tooltip="'删除'" type="danger" @click="dataDel(scope.row.id)">
              <i class="el-iconshanchu1 iconfont_no_margin sumeru_op_button sumeru_red"></i>
            </span>
          </template>
        </el-table-column>
      </el-table>


    </div>

    <!-- 新建 -->
    <el-dialog title="增加角色" :visible.sync="createVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="角色名">
          <el-input
            v-model="form.name"
            clearable
            placeholder="请输入角色名"
            size="mini"
            v-validate="'required'"
            type="text"
            name="task_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="权限等级">
          <el-input-number size="mini" v-model="form.level" :step="1"></el-input-number>
        </el-form-item>

        <el-form-item label="角色类型">

        <el-switch
          style="margin-top:-5px"
          v-model="form.type"
          active-color="#000"
          inactive-color="##3e9b87"
          active-text="审核角色"
          inactive-text="系统角色"
          active-value =  1
          inactive-value = 0

          >
        </el-switch>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="form.desc"
            clearable
            placeholder="请输入描述"
            size="mini"
            v-validate="'required'"
            type="text"
            name="task_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="权限列表">
          <el-tree
            :data="access"
            :props="props"
            show-checkbox
            node-key="id"
            ref="tree"
          ></el-tree>
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
    <el-dialog title="编辑角色" :visible.sync="editVisible" width="30%">
<el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="角色名">
          <el-input
            v-model="form.name"
            clearable
            placeholder="请输入角色名"
            size="mini"
            type="text"
            name="task_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="权限等级">
          <el-input-number size="mini" v-model="form.level" :step="1"></el-input-number>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="form.desc"
            clearable
            placeholder="请输入描述"
            size="mini"
            type="text"
            name="task_name"
            
          ></el-input>
        </el-form-item>

        <el-form-item label="权限列表">
          <el-tree
            :data="access"
            :props="props"
            show-checkbox
            node-key="id"
            ref="treeEdit"
            check-strictly
            default-expand-all
          ></el-tree>
        </el-form-item>

        <el-form-item v-if="form_errors.length" style="color:#f78989">
          <b>出现以下问题 :</b>
          <ul>
            <li v-for="error in form_errors" :key="error">{{ error }}</li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="checkForm()&&doCreate()">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, trans_params } from "@/utils/common";
import Qs from "qs";
export default {
  name: "curd",
  components: {},
  data() {
    return {
      form_errors: [],
      cur_entity: {},
      add_url: "/api/role/add",
      list_url: "/api/role/list",
      del_url: "/api/role/del",
      set_default_url:"/api/role/default",
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
        enable: "1",
        type: "1"
      },
      props: {
        label: 'label',
        children: 'children'
    },
    access:[]
    };
  },

  created() {
    this.getData()
    this.getAccessList()
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
    setDefault(row){
  this.$axios.post(this.set_default_url, trans_params({id:row.id})).then(res => {
                    if (res.data.status == 1) {
                      this.$message.success("操作成功");
                      this.getData();
                    } else
                      this.$message.error(
                        "操作失败, 错误码:" + res.data.status_code + res.data.msg
                      );
              
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
          name: "viewuser",
          params: this.cur_entity
        });
      } else {
        this.$message.info("请选择数据");
      }
    },
    checkForm: function() {
      if (
        this.form.name &&
        this.form.level!=undefined
      ) {
        return true;
      }

      this.form_errors = [];

      if (!this.form.name) {
        this.form_errors.push("请输入角色名");
      }
      if (this.form.level ==undefined) {
        this.form_errors.push("请输入权限等级");
      }

    },

    doCreate(e) {

            this.$nextTick(function() {
                 if(this.createVisible){
                    this.form.accesses =  this.$refs.tree.getCheckedKeys()
                 }else{
                   this.form.accesses =  this.$refs.treeEdit.getCheckedKeys()
                 }
                
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
            })




    },

    getAccessList(){
        this.$axios
        .get("/api/access/list")
        .then(res => {
          this.access = res.data.result;
        });
    },
    getData() {
      this.$axios
        .get(this.list_url, {
          params: {
            search: this.select_word,
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
      this.form_errors = []
      this.editVisible = true;
      this.form = row;
      this.form.id  = row.id
      let that = this
      this.$nextTick(function() {
         console.log(this.$refs.treeEdit.getCheckedKeys())
         that.$refs.treeEdit.setCheckedKeys(row.accesses)
         console.log(row.accesses)
         console.log(this.$refs.treeEdit.getCheckedKeys())
    })
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
