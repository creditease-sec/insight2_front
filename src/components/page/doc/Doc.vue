<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 文档
        </el-breadcrumb-item>
        <el-breadcrumb-item>接口文档</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入关键词进行过滤"
          class="handle-input"
          @change="inputChange"
          clearable
        ></el-input>
        <el-radio-group v-model="select_word" size="mini" style="margin-top:10px;margin-left:10px;">
          <el-radio-button v-for="value in KEYWORD_LIST" :label="value" v-bind:key="value">{{value}}</el-radio-button>
        </el-radio-group>
        <div style="float:right"></div>
      </div>

      <el-table
        :data="tableData.filter(data => !select_word || data.name.toLowerCase().includes(select_word.toLowerCase()))"
        border
        highlight-current-row
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        :default-expand-all="is_expand"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="id" label min-width="180">
          <template slot-scope="scope">
            <span style="color:#045745">{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="功能" min-width="180">
          <template slot-scope="scope">
            <span style="color:#d53281">{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="args" label="参数" min-width="180">
          <template slot-scope="scope">
            <li v-for="arg in scope.row.args" v-bind:key="arg">{{ arg }}</li>
          </template>
        </el-table-column>

        <el-table-column prop="method" label="方法" min-width="180"></el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination layout="total" :total.sync="total"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate, trans_params } from "@/utils/common";

export default {
  name: "curd",
  components: {},
  data() {
    return {
      KEYWORD_LIST: ["漏洞"],
      is_expand: true,
      list_url: "/api/docs",
      tableData: [
        {
          uri: ""
        }
      ],
      select_word: "",
      total: 0
    };
  },

  created() {
    this.getData();
  },

  computed: {},

  filters: {},

  methods: {
    getData() {
      this.$axios
        .get(this.list_url, {
          params: {
            search: this.select_word,
            page_index: this.cur_page,
            page_size: this.page_size,
            sortcolumn: this.sortcolumn,
            sortorder: this.sortorder
          }
        })
        .then(res => {
          this.tableData = res.data.result;
          this.KEYWORD_LIST = res.data.category;
          this.total = res.data.total;
        });
    },
    inputChange(val) {
      if (val.length > 0) {
        this.is_expand = true;
      } else {
        this.is_expand = false;
      }
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
