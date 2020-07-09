<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 知识
        </el-breadcrumb-item>
        <el-breadcrumb-item>文章</el-breadcrumb-item>
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


      </div>

      <el-table
        :data="tableData"
        
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChangeRow"
        highlight-current-row
        @sort-change="sortChange"
      >
               
        <el-table-column prop="title" label="标题" min-width="200" sortable="custom">
          <template slot-scope="scope">
            <span
              class="primary-title"
              @click="cur_entity = scope.row;viewPaper()"
              style="cursor:pointer !important"
            >{{scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category_name" label="分类" min-width="100"></el-table-column>
        <el-table-column prop="author" label="作者" min-width="80" sortable="custom"></el-table-column>
        <el-table-column prop label="发布时间" min-width="80" sortable="custom">
        <template slot-scope="scope">{{scope.row.publish_time | getDateDiff_timestamp}}</template>
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



  </div>
</template>

<script>

import Vue from "vue";
import { VueEditor, Quill } from "vue2-editor";
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params,
  getStaticColors,
  getRankColors
} from "@/utils/common";
export default {
  name: "curd",
  components: {VueEditor},
  data() {
    return {
        upload_cover_url:false,
        category_list: [{
          value: '1',
          label: '漏洞知识库'
        }, {
          value: '3',
          label: '技术分享'
        }, {
          value: '5',
          label: '漏洞解决方案'
        }, {
          value: '12',
          label: '安全规范'
        }, {
          value: '2',
          label: '安全开发技术'
        }, {
          value: '4',
          label: '内部规范制度'
        }],
        value: '',
      md_report:"",
      value1: "",
      editor_type: false,
      form_errors: [],
      cur_entity: {},
      add_url: "/api/paper/upsert",
      list_url: "/api/paper/open",
      del_url: "/api/paper/del",
      category_add_url:"/api/category/add",
      category_list_url: "/api/category/list",
      category_del_url: "/api/category/del",
      del_list: new URLSearchParams(),
      tableData: [],
      select_word: "",
      cur_page: 1,
      page_size: 10,
      total: 0,
      multipleSelection: [],
      editVisible: false,
      createVisible: false,
      newCatagoryVisible:false,
      form: {
        enable: "1"
      },
      categoryForm:{
      },
        options: [{
          value: '超赞',
          label: '超赞'
        }, {
          value: '不错',
          label: '不错'
        }, {
          value: '感人',
          label: '感人'
        }],
    };
  },

  created() {
    this.getData()
    this.getCategoryList()
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
    },
    statusNameFilter(status, name, default_status = "其他") {
      // filt ers:{ filter:function(data,arg1,arg2){ return ... } }
      let statusName = global_config[name][status];
      if (global_config[name][status]) {
        return global_config[name][status];
      } else {
        return default_status;
      }
    }
  },

  methods: {

    solutionChange(value, render) {
      console.log(value,render)
      this.form.content = render;
    },

    $imgAdd(pos, $file) {
      let that = this
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("image", $file);
      this.$axios({
        url: "/api/image/upload",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(url => {

        console.log(url);
        that.$refs.content_editor.$img2Url(pos, "api/" + url.data.path);
        
      });
    },

      handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
            // An example of using FormData
            // NOTE: Your key could be different such as:
            // formData.append('file', file)

            var formData = new FormData();
            formData.append("image", file);
            this.$axios({
              url: "/api/image/upload",
              method: "POST",
              data: formData
            })
              .then(result => {
                let url = result.data.path; // Get url from response
                Editor.insertEmbed(cursorLocation, "image", "api/"+url);
                resetUploader();
              })
              .catch(err => {
                console.log(err);
              });
          },

       handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        this.form.cover = res.path
        this.upload_cover_url =  'api/'+res.path
        console.log(this.form.cover)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' | file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    sortChange: function(column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
    },

    viewPaper() {
      if (this.cur_entity.id) {
        let routes = this.$router.resolve({ name: "n_viewpaperdetail", query:{id:this.cur_entity.id}})
        window.open(routes.href, "_blank");


      } else {
        this.$message.info("请选择数据");
      }
    },
    

    doCreate(e) {
      if (this.form.content_type  == 0 ){
        this.content = this.raw_content
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
    },

    createCategory(){

      this.$axios.post(this.category_add_url, trans_params(this.categoryForm)).then(res => {
        if (res.data.status == 1) {
          this.$message.success("操作成功");
          this.getCategoryList()
        } else
          this.$message.error(
            "操作失败, 错误码:" + res.data.status + res.data.msg
          );

        this.newCatagoryVisible = false;
 
      });

    },
    getCategoryList(){
      this.$axios
        .get(this.category_list_url, {
        })
        .then(res => {
          this.category_list = res.data.result;
        });
    },
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
   
      this.editVisible = true;
      this.form = row;
      this.form.status = row.status.toString()
      if(row.editor_type == 0){
      this.form.raw_content = row.content
      }
      delete this.form.create_time;
      this.form.enable = row.enable == 1 ? "1" : "0";
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    categoryDel(cur_del_node_id) {
      // 数据删除，支持多个和单个删除

      let to_del = null;

      if (cur_del_node_id) {
        to_del = cur_del_node_id;
      }

      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.category_del_url, trans_params({ id: to_del }))
            .then(res => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("删除成功");
                this.getCategoryList()
              } else
                this.$message.error("删除失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 178px;
    display: block;
  }
</style>
