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
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="createVisible=true; form={enable:'1'}"
          size="mini"
        >添加文章</el-button>
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入关键词"
          class="handle-input"
          @keyup.enter.native="search()"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>
        <div style="float:right">
          <!-- <el-button size="mini" type="primary" @click="viewUser()">查看</el-button> -->
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
        <!-- <el-table-column prop="id" label="ID" min-width="30" sortable="custom"></el-table-column> -->
        <el-table-column prop="title" label="标题" min-width="200" sortable="custom">
          <template slot-scope="scope">
            <span
              class="primary-title"
              @click="cur_entity = scope.row;viewUser()"
              style="cursor:pointer !important"
            >{{scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" min-width="100" sortable="custom">
          <template slot-scope="scope">{{scope.row.category_name }}</template>
        </el-table-column>
        <el-table-column prop="author" label="作者" min-width="80" max-width="100" sortable="custom"></el-table-column>
        <el-table-column prop="publish_time" label="发布时间" min-width="80" sortable="custom">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.publish_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.publish_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          prop="modify_time"
          label="修改时间"
          min-width="80"
          sortable
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.modify_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.modify_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="文章状态" min-width="50" sortable="custom">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status===1?"已发布":"未发布"}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" max-width="320">
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

    <!-- 添加文章 -->
    <el-dialog
      title="添加文章"
      :visible.sync="createVisible"
      width="70%"
      height="40%"
      :before-close="handleClose"
    >
      <el-form ref="createForm" :model="form" label-width="100px" :rules="rules">
        <el-form :inline="true" label-width="100px" :rules="rules">
          <el-form-item label="标题">
            <el-input
              v-model="form.title"
              clearable
              placeholder="请输入标题"
              size="mini"
              type="text"
              name="title"
            ></el-input>
          </el-form-item>
          <el-form-item label="别名">
            <el-input
              v-model="form.alias"
              clearable
              placeholder="请输入别名"
              size="mini"
              type="text"
              name="alias_title"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-form :inline="true" label-width="100px">
          <el-form-item label="状态">
            <el-select
              size="mini"
              v-model="form.status"
              placeholder="公告状态"
              class="handle-select mr10"
            >
              <el-option key="0" label="未发布" value="0"></el-option>
              <el-option key="1" label="已发布" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="作者">
            <el-input
              max-width="100"
              v-model="form.author"
              clearable
              placeholder="请输入作者"
              size="mini"
              type="text"
              name="task_name"
            ></el-input>

          </el-form-item>

          <el-form-item label="发布时间">
            <el-date-picker
              v-model="form.publish_time"
              type="datetime"
              value-format="timestamp"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-form>

        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="请选择">
            <el-option
              v-for="item in category_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                共 {{ item.count }} 篇
                <el-button type="text" @click="categoryDel(item.id)">
                  <i class="el-iconshanchu1 iconfont_no_margin sumeru_op_button"></i>
                </el-button>
              </span>
            </el-option>
          </el-select>
          <!-- <span v-show="errors.has('task_name')" class="sumeru_error">请输入昵称</span> -->
          <el-button type="text" @click="newCatagoryVisible=true">
            <i class="el-icontuoputu iconfont_no_margin sumeru_op_button"></i> 新增分类
          </el-button>
        </el-form-item>
        <el-form-item label="更多">
          <el-checkbox v-model="isShowCover">封面</el-checkbox>
          <el-checkbox v-model="isShowAbstract">摘要</el-checkbox>
          <el-checkbox v-model="isShowTags">标签</el-checkbox>
        </el-form-item>
        <el-form-item label="封面" v-show="isShowCover">
          <el-upload
            class="avatar-uploader"
            action="/api/paper/cover"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="upload_cover_url" :src="upload_cover_url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="摘要" v-show="isShowAbstract">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.summary"></el-input>
        </el-form-item>
        <el-form-item label="标签" v-show="isShowTags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择文章标签"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编辑器类型">
          <el-switch
            v-model="form.content_type"
            active-text="Markdown"
            inactive-text="富文本"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="正文" v-show="form.content_type==0">
          <!-- <quill-editor v-model="form.content" ref="myQuillEditor"></quill-editor> -->
          <vue-editor
            v-model="form.raw_content"
            useCustomImageHandler
            @imageAdded="handleImageAdded"
          ></vue-editor>
        </el-form-item>
        <el-form-item label="正文" v-show="form.content_type==1">
          <mavon-editor
            ref="content_editor"
            v-model="form.md_raw_content"
            @change="solutionChange"
            @imgAdd="$imgAdd"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreate()">保存</el-button>
        <el-button @click="createVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑文章 -->
    <el-dialog
      title="编辑文章"
      :visible.sync="editVisible"
      width="80%"
      height="50%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input
            v-model="form.title"
            clearable
            placeholder="请输入标题"
            size="mini"
            v-validate="'required'"
            type="text"
            name="title"
          ></el-input>
        </el-form-item>

        <el-form-item label="别名">
          <el-input
            v-model="form.alias"
            clearable
            placeholder="请输入别名"
            size="mini"
            v-validate="'required'"
            type="text"
            name="task_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="请选择">
            <el-option
              v-for="item in category_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                共 {{ item.count }} 篇
                <el-button type="text" @click="categoryDel(item.id)">
                  <i class="el-iconshanchu1 iconfont_no_margin sumeru_op_button"></i>
                </el-button>
              </span>
            </el-option>
          </el-select>
          <el-button type="text" @click="newCatagoryVisible=true">
            <i class="el-icontuoputu iconfont_no_margin sumeru_op_button"></i> 新增分类
          </el-button>
        </el-form-item>

        <el-form-item label="作者">
          <el-input

            v-model="form.author"
            clearable
            placeholder="请输入作者"
            size="mini"
            v-validate="'required'"
            type="text"
            name="task_name"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="发布时间">
          <el-date-picker v-model="form.publish_time" type="datetime" value-format="timestamp"   placeholder="选择日期时间"></el-date-picker>
        </el-form-item>-->

        <el-form-item label="状态">
          <el-select
            size="mini"
            v-model="form.status"
            placeholder="公告状态"
            class="handle-select mr10"
          >
            <el-option key="0" label="未发布" value="0"></el-option>
            <el-option key="1" label="已发布" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            class="avatar-uploader"
            action="/api/paper/cover"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="upload_cover_url" :src="upload_cover_url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.summary"></el-input>
        </el-form-item>

        <el-form-item label="编辑器类型">
          <el-switch
            v-model="form.content_type"
            active-text="Markdown"
            inactive-text="富文本"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="正文" v-show="form.content_type==0">
          <!-- <quill-editor v-model="form.content" ref="myQuillEditor"></quill-editor> -->
          <vue-editor
            v-model="form.raw_content"
            useCustomImageHandler
            @imageAdded="handleImageAdded"
          ></vue-editor>
        </el-form-item>
        <el-form-item label="正文" v-show="form.content_type==1">
          <mavon-editor
            ref="content_editor"
            v-model="form.md_raw_content"
            @change="solutionChange"
            @imgAdd="$imgAdd"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreate()">保存</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 新增分类 -->
    <el-dialog title="新增分类" :visible.sync="newCatagoryVisible" width="30%" height="50%">
      <el-form ref="form" :model="categoryForm" label-width="100px">
        <el-form-item label="分类名称">
          <el-input
            v-model="categoryForm.name"
            clearable
            placeholder="请输入分类名称"
            size="mini"
            v-validate="'required'"
            type="text"
            name="task_name"
          ></el-input>
          <!-- <span v-show="errors.has('task_name')" class="sumeru_error">请输入用户名</span> -->
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createCategory()">保存</el-button>
        <el-button @click="newCatagoryVisible = false">取 消</el-button>
      </span>
    </el-dialog>
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
  components: { VueEditor },
  data() {
    return {
      isShowCover: false,
      isShowAbstract: false,
      isShowTags: false,
      upload_cover_url: false,
      rules: {
        title: [{ required: true, message: "请输标题", trigger: "blur" }]
      },

      category_list: [
        {
          value: "1",
          label: "漏洞知识库"
        },
        {
          value: "3",
          label: "技术分享"
        },
        {
          value: "5",
          label: "漏洞解决方案"
        },
        {
          value: "12",
          label: "安全规范"
        },
        {
          value: "2",
          label: "安全开发技术"
        },
        {
          value: "4",
          label: "内部规范制度"
        }
      ],
      value: "",
      md_report: "",
      value1: "",
      editor_type: false,
      form_errors: [],
      cur_entity: {},
      add_url: "/api/paper/upsert",
      list_url: "/api/paper/list",
      del_url: "/api/paper/del",
      category_add_url: "/api/category/add",
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
      newCatagoryVisible: false,
      form: {
        enable: "1"
      },
      categoryForm: {},
      options: [
        {
          value: "超赞",
          label: "超赞"
        },
        {
          value: "不错",
          label: "不错"
        },
        {
          value: "感人",
          label: "感人"
        }
      ]
    };
  },

  created() {
    this.getData();
    this.getCategoryList();
  },
  mounted() {
    window.onbeforeunload = function(e) {
      e = e || window.event;
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = "关闭提示";
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return "关闭提示";
    };
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
      // console.log(value,render)
      this.form.content = render;
    },

    $imgAdd(pos, $file) {
      let that = this;
      var formdata = new FormData();
      formdata.append("image", $file);
      this.$axios({
        url: "/api/image/upload",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(url => {
        that.$refs.content_editor.$img2Url(pos, url.data.path);
      });
    },

    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("image", file);
      this.$axios({
        url: "/api/image/upload",
        method: "POST",
        data: formData
      })
        .then(result => {
          let url = result.data.path; // Get url from response
          Editor.insertEmbed(cursorLocation, "image", url);
          resetUploader();
        })
        .catch(err => {
        });
    },

    handleAvatarSuccess(res, file) {
      this.form.cover = res.path;
      this.upload_cover_url = res.path;
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === "image/jpeg") | (file.type === "image/png");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    sortChange: function(column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
    },

    viewUser() {
      if (this.cur_entity.id) {
        this.$router.push({
          name: "viewpaperdetail",
          params: this.cur_entity
        });
      } else {
        this.$message.info("请选择数据");
      }
    },

    doCreate(e) {
    
      if(this.form.title==""|this.form.title==undefined){
        this.$message.info("标题得填一下哈");
        return 
      }
      if (this.form.content_type == 0) {
        this.form.content = this.form.raw_content;
      }

      let cur_form = null;


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

    createCategory() {
      this.$axios
        .post(this.category_add_url, trans_params(this.categoryForm))
        .then(res => {
          if (res.data.status == 1) {
            this.$message.success("操作成功");
            this.getCategoryList();
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status + res.data.msg
            );

          this.newCatagoryVisible = false;
        });
    },
    getCategoryList() {
      this.$axios.get(this.category_list_url, {}).then(res => {
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
      this.editVisible = true;
      this.form = row;
      this.form.status = row.status.toString();
      if (row.content_type == 0) {
        this.form.raw_content = row.content;
      }else{
        this.form.md_raw_content = filterXSS(row.md_raw_content);
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
                this.getCategoryList();
              } else
                this.$message.error("删除失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
    },

    handleClose(done) {
      this.$confirm("数据还未提交，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
  border-color: #409eff;
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
