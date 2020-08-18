<template>
  <div>
    
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 漏洞
        </el-breadcrumb-item>
        <el-breadcrumb-item>我的漏洞</el-breadcrumb-item>
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
        <el-select
          size="mini"
          v-model="select_vul_status"
          placeholder="状态筛选"
          class="handle-select mr10"
        >
          <el-option
            v-for="item in status_options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.count }}</span>
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>

        <div style="float:right">
          <span  v-show="isShowText" class="ec-shake-time blink" style="font-weight: 400; color: #114c2b;  font-size: 13px" > 
            请单击选择一条数据以显示可操作项</span>
            <span      v-show="isShowNoOp" class="blink"
            style="font-weight: 400; color: #114c2b;  font-size: 13px"
          >无可用的操作</span>

          <el-button size="mini" type="primary" @click="updateCur_entity();solveVisible=true;cur_audit_status='/auditing/fixing' " v-show="isShowConfirmButton">已知悉</el-button>
          <el-button size="mini" type="primary" @click="updateCur_entity();solveVisible=true;cur_audit_status='/auditing/retest' " v-show="isShowApplyRetestButton">申请复测</el-button>
          <el-button size="mini" icon="iconfont  el-iconCSV1" @click="exportCSV()">导出CSV</el-button>
          <!-- <el-button size="mini" icon="search" @click="dataDel()">批量删除</el-button> -->
        </div>
      </div>

      <el-table
        :data="tableData"
        border
        @select="select"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChangeRow"
        highlight-current-row
        @sort-change="sortChange"
        ref="vulTable"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <!-- <el-table-column prop="id" label="ID" min-width="40"></el-table-column> -->
        <el-table-column prop="vul_name" label="名称" min-width="150" sortable="custom">
          <template slot-scope="scope">
            <span
              class="primary-title insight_sensitive"
              @click="cur_entity = scope.row;viewUser()"
              style="cursor:pointer !important"
            >{{scope.row.vul_name }}</span> 
            <!-- <span class="already_read">已读</span> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="vul_type"
          label="类型"
          min-width="100"
          sortable="custom">
        >
          <template slot-scope="scope">
            <span
              class="in-tag"
              :style="{'color':statusColor(scope.row.vul_type) }"
            >{{scope.row.vul_type | statusNameFilter("VUL_TYPE")}} </span>
          </template>
        </el-table-column>
        <el-table-column prop="self_rank" label="Rank" min-width="70" sortable="custom">
          <template slot-scope="scope">
            <span
              :style="{'color':rankColor(scope.row.self_rank) ,'font-weight':'bold' }"
            >{{scope.row.self_rank}}</span>
          </template>
          
        </el-table-column>
        <el-table-column prop="username" label="提交人" min-width="100" sortable="custom">
          <template slot-scope="scope">
            <span class="insight_sensitive">
              {{scope.row.username}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop label="提交时间" min-width="80" sortable="custom">
          <template slot-scope="scope">
            
                        <el-tooltip
              effect="light"
              :content="scope.row.submit_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.submit_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
            
          </template>
        </el-table-column>
        <el-table-column
          prop="vul_status"
          label="状态"
          min-width="70"
          :filters="[{ text: '待审核', value: '10' }, { text: '已确认', value: '40' }, { text: '修复中', value: '50' }, { text: '复测中', value: '55' }]"
          :filter-method="filterVulStatus"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <span class="in-tag">{{ scope.row.vul_status}}</span>
          </template>

          <template slot-scope="scope">
            <span
              class="in-tag"
              :style="{'color':statusColor(scope.row.vul_status) }"
            >{{scope.row.vul_status | statusNameFilter("VUL_STATUS","未处理")}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <span size="mini" v-tooltip="'编辑'" @click="handleEdit(scope.$index, scope.row)">
              <i class="el-iconbianji2 iconfont_no_margin sumeru_op_button"></i>
            </span>
            <span size="mini" v-tooltip="'删除'" type="danger" @click="dataDel(scope.row.id)">
              <i class="el-iconshanchu1 iconfont_no_margin sumeru_op_button sumeru_red"></i>
            </span>
          </template>
        </el-table-column> -->
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
    <el-dialog title="新增漏洞" :visible.sync="createVisible" width="75%" :before-close="handleClose">
      <el-form ref="createForm" :model="form" label-width="150px" :rules="rules">
        <el-form-item label="漏洞标题" prop="vul_name">
          <el-input
            v-model="form.vul_name"
            clearable
            placeholder="请输入漏洞名称"
            size="mini"
            v-validate="'required'"
            type="text"
            name="task_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="关联应用" prop="app_id">
          <el-autocomplete
            v-model="form.app_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入关键字"
            @select="handleSelect"
            clearable
          ></el-autocomplete>  
        </el-form-item>

        <el-form-item label="关联解决方案" prop="solution_id">
          <el-autocomplete
            v-model="form.solution_name"
            :fetch-suggestions="querySearchPaperAsync"
            placeholder="请输入关键字"
            @select="handleSelectPaper"
            clearable
          ></el-autocomplete> 
        </el-form-item>

        <el-form-item label="漏洞层面" prop="layer">
          <el-radio-group v-model="form.layer" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.VUL_LAYER"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="form.vul_type" placeholder="请选择" size="mini">
            <el-option
              v-for="(key,item) in static_config.VUL_TYPE"
              :key="item"
              :label="key"
              :value="item"
            >
              <!-- <span
                style="float: right; color: #8492a6; font-size: 13px"
              >共个节点</span>-->
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Rank值" prop="self_rank">
          <el-input-number
            v-model="form.self_rank"
            controls-position="right"
            :min="0"
            :max="20"
            size="mini"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="风险等级" prop="risklevel">
          <el-tag :type="colortype" size="medium">{{risklevel}}</el-tag>
        </el-form-item>
        <el-form-item label="漏洞来源" prop="vul_source">
          <el-radio-group v-model="form.vul_source" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.VUL_SOURCE"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选项">
          <el-checkbox v-model="is_report_visible" v-tooltip="'显示漏洞证明编辑器'">漏洞证明</el-checkbox>
          <el-checkbox v-model="is_solution_visible" v-tooltip="'显示解决方案编辑器'">解决方案</el-checkbox>
        </el-form-item>

        <el-form-item label="漏洞证明" v-show="is_report_visible">
          <mavon-editor
            ref="poc_editor"
            v-model="form.vul_poc"
            @change="pocChange"
            @imgAdd="$imgAdd"
          />
        </el-form-item>
        <el-form-item label="解决方案" v-show="is_solution_visible">
          <mavon-editor
            ref="solution_editor"
            v-model="form.vul_solution"
            @change="solutionChange"
            @imgAdd="$imgAddSolution"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreate()">创建</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑漏洞" :visible.sync="editVisible" width="80%">
      <el-form ref="editForm" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="漏洞标题" prop="vul_name">
          <el-input
            v-model="form.vul_name"
            clearable
            placeholder="请输入漏洞名称"
            size="mini"
            type="text"
            name="task_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="关联应用" prop="app_id">
          <el-autocomplete
            v-model="form.app_id_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入关键字"
            @select="handleSelect"
            clearable
          ></el-autocomplete>  
        
        </el-form-item>

        <el-form-item label="漏洞层面" prop="layer">
          <el-radio-group v-model="form.layer" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.VUL_LAYER"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="form.vul_type" placeholder="请选择" size="mini">
            <el-option
              v-for="(key,item) in static_config.VUL_TYPE"
              :key="item"
              :label="key"
              :value="item"
            >
              <!-- <span
                style="float: right; color: #8492a6; font-size: 13px"
              >共个节点</span>-->
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Rank值" prop="self_rank">
          <el-input-number
            v-model="form.self_rank"
            controls-position="right"
            :min="0"
            :max="20"
            size="mini"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="风险等级" prop="risklevel">
          <el-tag :type="colortype" size="medium">{{risklevel}}</el-tag>
        </el-form-item>
        <el-form-item label="漏洞来源" prop="vul_source">
          <el-radio-group v-model="form.vul_source" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.VUL_SOURCE"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选项">
          <el-checkbox v-model="is_report_visible" v-tooltip="'显示漏洞证明编辑器'">漏洞证明</el-checkbox>
          <el-checkbox v-model="is_solution_visible" v-tooltip="'显示解决方案编辑器'">解决方案</el-checkbox>
        </el-form-item>

        <el-form-item label="漏洞证明" v-show="is_report_visible">
          <mavon-editor
            ref="poc_editor"
            v-model="form.vul_poc"
            @change="pocChange"
            @imgAdd="$imgAdd"
          />
        </el-form-item>
        <el-form-item label="解决方案" v-show="is_solution_visible">
          <mavon-editor
            ref="solution_editor"
            v-model="form.vul_solution"
            @change="solutionChange"
            @imgAdd="$imgAddSolution"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doCreate()">修 改</el-button>
      </span>
    </el-dialog>


    <!-- 审核 -->
    <el-dialog title="审核漏洞" :visible.sync="auditVisible" width="50%">
      <el-form ref="editForm" :model="form" label-width="90px" >
        <el-form-item label="漏洞标题" prop="vul_name">
          {{form.vul_name}}
        </el-form-item>

        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="form.vul_type" placeholder="请选择" size="mini"              :disabled="true">
            <el-option
              v-for="(key,item) in static_config.VUL_TYPE"
              :key="item"
              :label="key"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="自评Rank" prop="self_rank">
          {{form.self_rank}}
        </el-form-item>
        <el-form-item label="风险等级" prop="risklevel">
          <el-tag :type="colortype" size="medium">{{risklevel}}</el-tag>
        </el-form-item>
        <el-form-item label="审核状态" >
          <!-- {{cur_audit_status}} -->
          <el-radio-group v-model="cur_audit_status" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.VUL_ACTION"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联应用" prop="app_id_name" v-show="isShowAuditDetail">
          <el-autocomplete
            v-model="form.app_id_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="实际Rank" prop="self_rank" v-show="isShowAuditDetail">
          <el-input-number
            v-model="form.real_rank"
            controls-position="right"
            :min="0"
            :max="20"
            size="mini"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="风险等级"  v-show="isShowAuditDetail" >
          <el-tag :type="colortype" size="medium">{{real_risklevel}}</el-tag>
        </el-form-item>
        <el-form-item label="回复作者" prop="return">
     <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="form.content">
        </el-input>
        </el-form-item>

        <el-form-item label="详情备注" prop="return">
     <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="form.msg">
        </el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doAudit()">审 核</el-button>
      </span>
    </el-dialog>


    <!-- 处理 -->
    <el-dialog title="处理漏洞" :visible.sync="solveVisible" width="50%">
      <el-form ref="editForm" :model="form" label-width="90px" >
        <el-form-item label="漏洞标题" prop="vul_name">
          {{form.vul_name}}
        </el-form-item>

        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="form.vul_type" placeholder="请选择" size="mini"              :disabled="true">
            <el-option
              v-for="(key,item) in static_config.VUL_TYPE"
              :key="item"
              :label="key"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="自评Rank" prop="self_rank">
          {{form.self_rank}}
        </el-form-item>
        <el-form-item label="风险等级" prop="risklevel">
          <el-tag :type="colortype" size="medium">{{risklevel}}</el-tag>
        </el-form-item>


        <el-form-item label="回复作者" prop="return">
     <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="form.content">
        </el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doSolve()">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params,
  getStaticColors,
  getRankColors
} from "@/utils/common";
import { global_config } from "@/utils/global_config";

export default {
  name: "curd",
  components: {},
  data() {
  let that = this
  var checkAppID = (rule, value, callback) => {
    // that.$refs.createForm.clearValidate("app_id",null)
    console.log(rule, value, callback)
    console.log(this.form)
    that.$nextTick(() => {
        // console.log(this[rule.fullField])
        console.log(this.form.app_id)
    })
    if (!value) {
      return callback(new Error('请选择关联应用!!!'));
    }else{
      return true
    }
  };

    return {
      cur_audit_status:"/auditing/confirm",
      auditVisible:false,
      solveVisible:false,
      select_vul_status: null,
      app_id:null,
      app_id_name:null,
      status_options: [
        {
          value: "0",
          label: "未审核"
        },
      ],
      rules: {
        vul_name: [
          { required: true, message: "请输入漏洞标题", trigger: "blur" }
        ],
        app_id: [
          {  required: true, message: "请选择关联应用",    trigger: "change" }
        ],
        layer: [{ required: true, message: "请选择漏洞层面", trigger: "blur" }],
        vul_type: [
          { required: true, message: "请选择漏洞类型", trigger: "blur" }
        ],
        self_rank: [
          { required: true, message: "请填写Rank值", trigger: "blur" }
        ],
        vul_source: [
          { required: true, message: "请选择漏洞来源", trigger: "blur" }
        ]
      },
      app_list_url: "/api/app/list",
      paper_list_url: "/api/paper/list",
      is_report_visible: false,
      is_solution_visible: false,
      cronPopover: false,
      cron: "",
      rank: 0,
      links: [],
      task_type: "立即任务",
      url: "",
      md_report:
        "一、URL地址：\n\
二、发现方式：\n\n\n\
请尽量详细描述，保留场景/截图/重现方法等 \n\n\n\
三、漏洞证明：\n\n\n\
请在这里写POC\n\n\n\
",
      form_errors: [],
      cur_entity: {},
      add_url: "/api/vul/add",
      list_url: "/api/vul/my/list",
      del_url: "/api/vul/del",
      role_list_url: "/api/role/select",
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
        self_rank: "1",
        layer: 10,
        app_id:-1
      },
      role_options: [
        {
          value: "__",
          label: "--"
        }
      ],
      static_config: global_config
    };
  },

  created() {
    this.getStatusGroup()
    this.getRoleList();
    this.getData();
  
  },
    updated() {
    this.$desensitive()
  },
  computed: {
    isShowText:function(){
      if (JSON.stringify(this.cur_entity)!="{}"){
        return false
      }else{
        return true
      }
    },
    isShowNoOp:function(){
      return !this.isShowText && !this.isShowConfirmButton &&  !this.isShowApplyRetestButton 
    },
    isShowAuditDetail: function(){
     return  this.cur_audit_status == "/auditing/confirm"
    },
    isShowAuditButton: function(){
      if (this.cur_entity){
      return this.cur_entity.vul_status == "10"
      }else{
        return false
      }
    },
    isShowConfirmButton: function(){
      if (this.cur_entity){
      return this.cur_entity.vul_status == "40"
      }else{
        return false
      }
    },
    isShowApplyRetestButton: function(){
      if (this.cur_entity){
      return this.cur_entity.vul_status == "50"
      }else{
        return false
      }
    },    
    isShowSubmitRetestButton: function(){
      if (this.cur_entity){
      return this.cur_entity.vul_status == "55"
      }else{
        return false
      }
    },
    colortype: function() {
      if (this.form.self_rank >= 0 && this.form.self_rank < 6) {
        return "success";
      } else if (this.form.self_rank < 11) {
        return "";
      } else if (this.form.self_rank < 16) {
        return "danger";
      } else if (this.form.self_rank <= 20) {
        return "warning";
      }
    },
    risklevel: function() {
      if (this.form.self_rank >= 0 && this.form.self_rank < 6) {
        return "低危";
      } else if (this.form.self_rank < 11) {
        return "中危";
      } else if (this.form.self_rank < 16) {
        return "高危";
      } else if (this.form.self_rank <= 20) {
        return "严重";
      }
    },
    real_risklevel: function() {
      if (this.form.real_rank >= 0 && this.form.real_rank < 6) {
        return "低危";
      } else if (this.form.real_rank < 11) {
        return "中危";
      } else if (this.form.real_rank < 16) {
        return "高危";
      } else if (this.form.real_rank <= 20) {
        return "严重";
      }
    }
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

    select(selection, row){	
			  this.$refs.vulTable.clearSelection();
			if(selection.length == 0) return ;
      this.$refs.vulTable.toggleRowSelection(row, true);
      this.$refs.vulTable.setCurrentRow(row);
      
      this.cur_entity = row;
    },
    
    exportCSV(){
        this.$axios({
          method: "get",
          url: "/api/vul/my/export?vul_status=0" ,
          data: {
            search: this.select_word,
            page_index: this.cur_page,
            page_size: this.page_size,
            sort: this.sortcolumn,
            direction: this.sortorder,
            vul_status:this.select_vul_status
          },
          responseType: "blob"
        }).then(res => {
          if (!res.data) {
            return;
          }
          let url = window.URL.createObjectURL(res.data);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download",  "vulns_export.csv");
          document.body.appendChild(link);
          link.click();
        });
    },
    updateCur_entity(){
      this.form = this.cur_entity
      this.form. vul_type = this.cur_entity.vul_type.toString()
    },
    statusColor(status) {
      return getStaticColors(status);
    },
    rankColor(status) {
      return getRankColors(status);
    },
    pocChange(value, render) {
      this.form.vul_poc_html = render;
    },
    solutionChange(value, render) {
      this.form.vul_solution_html = render;
    },

    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("image", $file);
      this.$axios({
        url: "/api/image/upload",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(url => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        console.log(url);
        this.$refs.poc_editor.$img2Url(pos, "api/" + url.data.path);
      });
    },
    $imgAddSolution(pos, $file) {
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
        this.$refs.solution_editor.$img2Url(pos, "api/" + url.data.path);
      });
    },
    handleSelect(item) {
      this.form.app_id = item.id
      this.form.app_name = item.value
    },
    handleSelectPaper(item) {
      this.form.solution_id = item.id
      this.form.solution_name = item.value
    },

    querySearchAsync(queryString, cb) {
      this.$axios
        .get(this.app_list_url, {
          params: {
            search: queryString
          }
        })
        .then(res => {
          let result = new Array();
          res.data.result.map(function(v) {
            result.push({ value: v.appname, id: v.id.toString() });
          });
          cb(result);
        });
    },
    querySearchPaperAsync(queryString, cb) {
      this.$axios
        .get(this.paper_list_url, {
          params: {
            search: queryString
          }
        })
        .then(res => {
          let result = new Array();
          res.data.result.map(function(v) {
            result.push({ value: v.title, id: v.id });
          });
          cb(result);
        });
    },
    handleClose(done) {
      this.$confirm("数据还未提交，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
          console.log(this.role_options);
        });
    },

    sortChange: function(column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
    },

    viewUser() {
      console.log(this.cur_entity)
      if (this.cur_entity.id) {
        // this.$router.push({
        //   name: "n_viewvulndetail",
        //   params: this.cur_entity
        // });
        let routes = this.$router.resolve({ name: "n_viewvulndetail", query:{id:this.cur_entity.id}})

        window.open(routes.href, "_blank");

      } else {
        this.$message.info("请选择数据");
      }
    },

    getStatusGroup(){
          this.$axios.get("api/vul/my/status/group?vul_status=0").then(res => {
            this.status_options = res.data.result
          });
    },
    doCreate(e) {
      let cur_form = null;
      if (this.$refs["createForm"]) {
        cur_form = this.$refs["createForm"];
      } else {
        cur_form = this.$refs["editForm"];
      }

      cur_form.validate(valid => {
        if (valid) {
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
        } else {
          this.$message.error("提交失败，请填写相应信息");
        }
      });
    },

    doAudit(e) {

          this.$axios.post("api"+this.cur_audit_status, trans_params(this.form)).then(res => {
            if (res.data.status == 1) {
              this.$message.success("操作成功");
              this.getData();
            } else
              this.$message.error(
                "操作失败, 错误码:" + res.data.status + res.data.msg
              );
            this.auditVisible = false;
          });

 
    },
    doSolve(e) {

          this.$axios.post("api"+this.cur_audit_status, trans_params(this.form)).then(res => {
            if (res.data.status == 1) {
              this.$message.success("操作成功");
              this.getData();
            } else
              this.$message.error(
                "操作失败, 错误码:" + res.data.status + res.data.msg
              );
            this.solveVisible = false;
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
            vul_status:this.select_vul_status
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
      // this.multipleSelection = [selection]
      this.cur_entity = val;
    },

    search() {
      this.getData();
    },

    handleEdit(index, row) {
      this.form_errors = [];
      this.editVisible = true;
      this.form = row;
      delete this.form.create_time;
      this.form.enable = row.enable == 1 ? "1" : "0";
      this.form.app_name = row.appname

      this.form.vul_type = row.vul_type.toString()
      // delete this.form.username
      // delete this.form.update_time
      // delete this.form.login_time
      // delete this.from.role_name
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
    },
    filterVulStatus(value, row, column) {
      const property = column["property"];
      return row[property].toString() === value;
    }
  }
};
</script>

<style scoped>
th .el-checkbox {
display: none !important;
}
.already_read{
  color:#ad8386;border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    padding:1px 2px 2px 1px;
}
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

 
@keyframes blink{
  0%{opacity: 1;}
  100%{opacity: 0.15;} 
}
/* 添加兼容性前缀 */
@-webkit-keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0.15; }
}
@-moz-keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0.15; }
}
@-ms-keyframes blink {
    0% {opacity: 1; } 
    100% { opacity: 0.15;}
}
@-o-keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0.15; }
}

.blink{
    animation: blink 2s linear infinite;  
    -webkit-animation: blink 2s linear infinite;
    -moz-animation: blink 2s linear infinite;
    -ms-animation: blink 2s linear infinite;
    -o-animation: blink 2s linear infinite;
}
</style>
