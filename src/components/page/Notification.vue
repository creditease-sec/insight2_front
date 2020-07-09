<template>
  <div class>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 消息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`未读消息(${msgData.unread.length})`" name="first">
          <el-table :data="msgData.unread" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span class="message-title insight_sensitive">[{{scope.row.title}}]</span>
                <span style="color:#bb5555" class="insight_sensitive">{{scope.row.content}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="180">
              <template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
            </el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleRead(scope.$index,  scope.row)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row">
            <el-button type="primary" size="mini" @click="readAll()">全部标为已读</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`已读消息(${msgData.read.length})`" name="second">
          <template v-if="message === 'second'">
            <el-table :data="msgData.read" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title insight_sensitive">[{{scope.row.title}}]</span>
                  <span style="color:#bb5555" class="insight_sensitive">{{scope.row.content}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" width="150">
                <template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
              </el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button @click="handleDel(scope.$index,  scope.row)" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="handle-row">
              <el-button size="mini" @click="delAll()">删除全部</el-button>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane :label="`回收站(${msgData.recycle.length})`" name="third">
          <template v-if="message === 'third'">
            <el-table :data="msgData.recycle" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title insight_sensitive">[{{scope.row.title}}]</span>
                  <span style="color:#bb5555" class="insight_sensitive">{{scope.row.content}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" width="150">
                <template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
              </el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button @click="handleRestore(scope.$index,  scope.row)" size="mini">还原</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="handle-row">
              <el-button size="mini" @click="clearAll()">清空回收站</el-button>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { formatDate, trans_params } from "@/utils/common";
import bus from "@/components/common/bus";

export default {
  // name: 'tabs',
  data() {
    return {
      list_url: "/api/message/list",
      read_url: "/api/message/read",
      clear_url: " /api/message/clear",
      restore_url: "  /api/message/restore",
      del_url: "/api/message/del",
      message: "first",
      showHeader: false,
      multipleSelection: [],
      tableData: [],
      paginationShow: true,
      cur_page: 1,
      pagesize: 20,
      totals: 0,
      msgData: {
        unread: [
          {
            date: "2018-04-19 20:00:00",
            title: "【系统通知】该系统将进行升级维护"
          }
        ],
        read: [
          {
            date: "2018-04-19 20:00:00",
            title: "【系统通知】该系统将进行升级维护"
          }
        ],
        recycle: [
          {
            date: "2018-04-19 20:00:00",
            title: "【系统通知】该系统将进行升级维护"
          }
        ]
      }
    };
  },
  props: {
    changeMessageCount: Function
  },
  created() {
    this.getData();
  },
  updated() {
    this.$desensitive();
  },
  methods: {
    readAll() {
      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.read_url, trans_params({ is_all: 1 }))
            .then(res => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("操作成功");
              } else
                this.$message.error("操作失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
    },
    delAll() {
      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.del_url, trans_params({ is_all: 1 }))
            .then(res => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("操作成功");
              } else
                this.$message.error("操作失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
    },
    clearAll() {
      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.clear_url, trans_params({ is_all: 1 }))
            .then(res => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("操作成功");
              } else
                this.$message.error("操作失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
    },
    handleRead(index, row) {
      this.$axios
        .post(this.read_url, trans_params({ message_id: row.message_id }))
        .then(res => {
          if (res.data.status >= 1) {
            this.getData();
            bus.$emit("updateUserInfo", "");
            this.$message.success("操作成功");
          } else this.$message.error("操作失败, 错误码: " + res.data.status);
        });
    },

    getData() {
      this.$axios.get(this.list_url, {}).then(res => {
        this.msgData = res.data.result;
      });
    },
    handleDel(index, row) {
      this.$axios
        .post(this.del_url, trans_params({ message_id: row.message_id }))
        .then(res => {
          if (res.data.status >= 1) {
            this.getData();
            this.$message.success("操作成功");
          } else this.$message.error("操作失败, 错误码: " + res.data.status);
        });
    },
    handleRestore(index, row) {
      this.$axios
        .post(this.restore_url, trans_params({ message_id: row.message_id }))
        .then(res => {
          if (res.data.status >= 1) {
            this.getData();
            this.$message.success("操作成功");
          } else this.$message.error("操作失败, 错误码: " + res.data.status);
        });
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(Math.trunc(time * 1000));
      return formatDate(date, "yyyy-MM-dd HH:mm:ss");
    }
  },
  computed: {
    unreadNum() {
      return this.unread.length;
    },
    data() {
      return this.tableData.filter(d => {
        return d;
        let is_del = false;
      });
    }
  }
};
</script>

<style>
.message-title {
  cursor: pointer;
  color: #3e9b87f3;
}
.handle-row {
  margin-top: 30px;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
</style>
