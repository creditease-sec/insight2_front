<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 资产
        </el-breadcrumb-item>
        <el-breadcrumb-item>资产</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="createVisible=true; form={enable:'1'}"
          size="mini"
        >新增资产</el-button>
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入关键词"
          class="handle-input"
          @keyup.enter.native="search()"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>

        <div style="float:right">
          <!-- <el-upload style="float:left;margin-right:10px;" action=""> 
            <el-button size="mini" icon="iconfont el-icondaoru1" >资产导入</el-button>
          </el-upload> -->
          <el-button size="mini"  style="height:32px;" icon="el-icon-search" type="primary" @click="viewUser()">查看详情</el-button>
          <el-button size="mini"  style="height:33px;"  icon="search" @click="dataDel()">批量删除</el-button>
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
        <!-- <el-table-column prop="id" label="ID" min-width="50" sortable="custom"></el-table-column> -->
        <el-table-column prop="name" label="资产名称  " min-width="150" sortable="custom">

             <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.name}}</span>
          </template>

        </el-table-column>
        <el-table-column prop="value" label="值" min-width="180" sortable="custom">
          <template slot-scope="scope">
      <span  class="primary-title insight_sensitive">   <a  :href="'http://'+scope.row.value" target="_blank">  {{scope.row.value}} </a> </span>
     </template>
        </el-table-column>
        <el-table-column prop="apptype" label="资产类型" min-width="55" sortable="custom">
          <template slot-scope="scope">
           <span :style="{'color':statusColor(scope.row.type) }">   {{scope.row.type | statusNameFilter("ASSET_TYPE")}}  </span>
          </template>
        </el-table-column>
        <el-table-column prop="appname" label="关联应用" min-width="180" sortable="custom">
          <template slot-scope="scope">
            <span class="insight_sensitive">
                {{ scope.row.appname? scope.row.appname:"[ 未关联 ]"}}
            </span>
               </template>
        </el-table-column>

                <el-table-column
          prop="create_time"
          label="创建时间"
          min-width="80"
          sortable
          :show-overflow-tooltip="true"
        >
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
        <el-table-column label="操作"  min-width="80">
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
    <el-dialog title="新增资产" :visible.sync="createVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="资产名称">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型">
        <el-radio-group v-model="form.type" size="mini">
        <el-radio-button     v-for="(key,value) in static_config.ASSET_TYPE"   :label="value" v-bind:key="key">{{key}}</el-radio-button>
        </el-radio-group>
        </el-form-item>

        <el-form-item label="值">
          <el-input v-model="form.value" placeholder="例:127.0.0.1 或 www.example.com" ></el-input>
        </el-form-item>

        <el-form-item label="选项">
          <el-checkbox v-model="form.is_open" true-label=1 false-label=0 >公网</el-checkbox>
          <el-checkbox v-model="form.is_https" true-label=1 false-label=0 >HTTPS</el-checkbox>
        </el-form-item>

        <el-form-item label="应用类型">
        <el-radio-group v-model="form.apptype" size="mini">
        <el-radio-button     v-for="(key,value) in static_config.ASSET_APP_TYPE"   :label="value" v-bind:key="key">{{key}}</el-radio-button>
        </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form_errors.length" style="color:#f78989">
          <b>出现以下问题 :</b>
          <ul>
            <li v-for="error in form_errors" :key="error">{{ error }}</li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreate()">新 增</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑资产" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="资产名称">
                <el-input v-model="form.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="类型">
              <el-radio-group v-model="form.type" size="mini">
              <el-radio-button     v-for="(key,value) in static_config.ASSET_TYPE"   :label="value" v-bind:key="key">{{key}}</el-radio-button>
              </el-radio-group>
              </el-form-item>

              <el-form-item label="值">
                <el-input v-model="form.value" ></el-input>
              </el-form-item>

              <el-form-item label="选项">
                <el-checkbox v-model="form.is_open" true-label=1 false-label=0>公网</el-checkbox>
                <el-checkbox v-model="form.is_https" true-label=1 false-label=0>HTTPS</el-checkbox>
              </el-form-item>

              <el-form-item label="应用类型">
              <el-radio-group v-model="form.apptype" size="mini">
              <el-radio-button     v-for="(key,value) in static_config.ASSET_APP_TYPE"   :label="value" v-bind:key="key">{{key}}</el-radio-button>
              </el-radio-group>
              </el-form-item>

            </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doCreate()">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params,
  getStaticColors
} from "@/utils/common";
import {global_config} from "@/utils/global_config";

export default {
  name: "curd",
  components: {},
  data() {
    return {
      form_errors: [],
      cur_entity: {},
      add_url: "/api/asset/add",
      list_url: "/api/asset/list",
      del_url: "/api/asset/del",
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
      },
      static_config: global_config
    };
  },

  created() {
  
    this.getData();
  },
  mounted(){
    // //console.log(this.$route.query.app)
  },
  computed: {},
    updated() {
    this.$desensitive()
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
        0: "info",
        1: "success",
        2: "danger"
      };
      return statusMap[status];
    },
    
    statusNameFilter(status,name) { // filters:{ filter:function(data,arg1,arg2){ return ... } } 
          return global_config[name][status];
    }

  },

  methods: {
    statusColor(status) {
      return getStaticColors(status);
    },
    sortChange: function(column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
    },

    viewUser() {
      if (this.cur_entity.id) {
        this.$router.push({
          name: "view_asset_detail",
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
            app_id:this.$route.query.app
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
      this.form.is_https =  this.form.is_https.toString()
      this.form.is_open =  this.form.is_open.toString()
      this.form.type =  this.form.type.toString()
      // //console.log(this.form);
      delete this.form.create_time;
      // this.form.enable = row.enable == 1 ? "1" : "0";
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
            .post(this.del_url,  trans_params({ id: to_del }))
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
