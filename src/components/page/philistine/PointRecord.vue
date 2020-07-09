<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 俗事
        </el-breadcrumb-item>
        <el-breadcrumb-item>积分</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="关键词"
          class="handle-input mr10"
          @keyup.enter.native="search()"
        ></el-input>

        <el-button size="mini" type="primary" icon="search" @click="search">搜索</el-button>

        <el-checkbox v-model="is_pointrecord" style="margin-bottom:10px;" @change="changeType">积分记录</el-checkbox>

        <div style="float:right" v-show="!is_pointrecord">
          <el-button
            size="mini"
            type="warning"
            icon="search"
            @click="checkSelected()&&(frozenVisible=true)"
          >冻结积分</el-button>
          <el-button size="mini" icon="search" @click="checkSelected()&&(unfrozenVisible=true)">解冻积分</el-button>
          <el-button
            size="mini"
            type="success"
            icon="search"
            @click="checkSelected()&&(rewardVisible=true)"
          >奖励积分</el-button>
        </div>
      </div>

      <el-table
        v-show="!is_pointrecord"
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChangeRow"
        highlight-current-row
        @sort-change="sortChange"
      >
        <el-table-column prop="username" label="用户名" min-width="150">
          <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total_points" label="总积分" min-width="180" sortable="custom"></el-table-column>
        <el-table-column prop="frozen_points" label="冻结积分" min-width="180" sortable="custom"></el-table-column>
        <el-table-column prop="total_points" label="可用积分" min-width="180" sortable="custom">
          <template slot-scope="scope">{{ scope.row.total_points - scope.row.frozen_points}}</template>
        </el-table-column>
        <el-table-column prop="hornor" label="称号" min-width="180"></el-table-column>
      </el-table>

      <el-table
        v-show="is_pointrecord"
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChangeRow"
        highlight-current-row
        @sort-change="sortChange"
      >
        <el-table-column prop="operator" label="操作人" min-width="80">
          <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.operator}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="relate_user" label="操作对象" min-width="80">
          <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.relate_user}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="时间" min-width="120">
          <template slot-scope="scope">{{ scope.row.create_time|formatDate }}</template>
        </el-table-column>

        <el-table-column prop="title" label="积分记录类型" min-width="80"></el-table-column>
        <el-table-column prop="total_points" label="总积分" min-width="50"></el-table-column>
        <el-table-column prop="frozen_points" label="冻结积分" min-width="50"></el-table-column>
        <el-table-column prop="available_points" label="可用积分" min-width="50">
          <template slot-scope="scope">{{ scope.row.available_points }}</template>
        </el-table-column>
        <el-table-column prop="message_id" label="消息编号" min-width="180"></el-table-column>
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

    <!-- 冻结积分 -->
    <el-dialog title="冻结积分" :visible.sync="frozenVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="积分数量">
          <el-input-number v-model="form.point" :step="2"></el-input-number>
        </el-form-item>
        <el-form-item label="操作原因">
          <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doOp('frozen')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 奖励积分 -->
    <el-dialog title="奖励积分" :visible.sync="rewardVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="积分数量">
          <el-input-number v-model="form.point" :step="2"></el-input-number>
        </el-form-item>
        <el-form-item label="操作原因">
          <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doOp('reward')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 解冻积分 -->
    <el-dialog title="解冻积分" :visible.sync="unfrozenVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="积分数量">
          <el-input-number v-model="form.point" :step="2"></el-input-number>
        </el-form-item>
        <el-form-item label="操作原因">
          <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doOp('unfrozen')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, trans_params } from "@/utils/common";

export default {
  name: "point",
  components: {},
  data() {
    return {
      frozenVisible: false,
      unfrozenVisible: false,
      rewardVisible: false,
      is_pointrecord: 0,
      form_errors: [],
      cur_entity: {},
      add_url: "/api/point/insert_update",
      list_url: "/api/point/list",
      del_url: "/api/point/del",
      del_list: new URLSearchParams(),
      tableData: [],
      select_word: "",
      cur_page: 1,
      page_size: 10,
      total: 0,
      multipleSelection: [],
      editVisible: false,
      createVisible: false,
      form: {}
    };
  },

  created() {
    this.getData();
  },
  updated() {
    this.$desensitive();
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
    changeType(status) {
      console.log(status);
      // this.is_pointrecord = status
      this.getData();
    },
    doOp(op) {
      this.form.id = this.cur_entity.id;
      this.$axios
        .post("/api/point/" + op, trans_params(this.form))
        .then(res => {
          if (res.data.status == 1) {
            this.$message.success("操作成功");
            this.getData();
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status + res.data.msg
            );
          this.frozenVisible = false;
          this.unfrozenVisible = false;
          this.rewardVisible = false;
        });
    },

    checkSelected() {
      if (JSON.stringify(this.cur_entity) == "{}") {
        this.$message.info("请选择数据");
        return false;
      } else {
        return true;
      }
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
        .get(this.is_pointrecord ? "api/point/log" : this.list_url, {
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
      delete this.form.password;
      delete this.form.create_time;
      this.form.enable = row.enable == 1 ? "1" : "0";
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

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
