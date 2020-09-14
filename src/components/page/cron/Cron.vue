<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 计划任务
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="getAssetList();createVisible=true; form={enable:'1'};curFormName='createForm'"
          size="mini"
        >新增</el-button>
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入关键词"
          class="handle-input"
          @keyup.enter.native="search()"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>

        <div style="float:right">
          <el-button
            size="mini"
            icon="search"
            @click="JSON.stringify(cur_entity) == '{}'||cur_entity == null ? $message.info('请选择应用' ):secTestRecordVisible=true"
          >记录安全测试</el-button>
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
        <el-table-column prop="name" min-width="120" label="名称">
          <template slot-scope="scope">
            <span
              class="primary-title hover-pointer insight_sensitive"
              @click="jumpAsset(scope.row)"
            >{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="eid" min-width="65" label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.eid }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="exec_count" min-width="100" label="执行次数">
          <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.exec_count}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="crontab" min-width="100" label="表达式">
          <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.crontab}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="level" min-width="50" label="重要等级">
          <template slot-scope="scope">
            <span
              :style="{'color':statusColor(scope.row.level) }"
            >{{scope.row.level | statusNameFilter("ASSET_LEVEL")}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sec_level" min-width="50" label="安全等级">
          <template slot-scope="scope">
            <span
              :style="{'color':statusColor(scope.row.sec_level) }"
              class="in-tag"
            >{{scope.row.sec_level | statusNameFilter("APP_SEC_LEVEL")}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="enable" min-width="40" label="状态">
          <template slot-scope="scope">
            <span
              :style="{'color':statusColor(scope.row.enable) }"
              class="in-tag"
            >{{scope.row.enable==1?'启用':'禁用'}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" min-width="40" label="状态">
          <template slot-scope="scope">
            <span
              :style="{'color':statusColor(scope.row.status) }"
              class="in-tag"
            >{{scope.row.status | statusNameFilter("APP_STATUS")}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="last_time"
          label="上次执行"
          min-width="80"
          sortable
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.last_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.last_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          prop="next_time"
          label="下次执行"
          min-width="80"
          sortable
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.next_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.next_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
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

        <el-table-column
          prop="update_time"
          label="测试时间"
          min-width="80"
          sortable
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.check_time | formatDate"
              placement="right"
            >
              <span>{{scope.row.check_time | getDateDiff_timestamp}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <span
              size="mini"
              v-tooltip="'计划任务'"
              @click="form={};form.id=scope.row.id;schedulerVisible=true"
            >
              <i class="el-iconjihuarenwu2 iconfont_no_margin sumeru_op_button"></i>
            </span>

            <span
              size="mini"
              v-tooltip="'编辑'"
              @click="curFormName='editForm';isChangeVisible=false;getData();handleEdit(scope.$index, scope.row)"
            >
              <i class="el-iconbianji2 iconfont_no_margin sumeru_op_button"></i>
            </span>

            <span
              size="mini"
              v-tooltip="'安全测试'"
              @click="form={};form.app_id=scope.row.id;secTestVisible=true"
            >
              <i class="el-iconceshi4 iconfont_no_margin sumeru_op_button"></i>
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
    <el-dialog title="新增任务" :visible.sync="createVisible" width="50%">
      <el-form ref="createForm" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" clearable placeholder="任务名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="扩展类型" prop="eid">
          <el-select v-model="form.eid" filterable placeholder="请选择">
            <el-option v-for="value in extension_list" :key="value._id" :label="value.name" :value="value.eid"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="CRON表达式" prop="cron_expression">
          {{form.crontab}}
          <VueCronEditorBuefy
            v-model="form.crontab"
            locale="test"
            :custom-locales="{ test:local_lang }"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.APP_STATUS"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="说明">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreate()">创建</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑应用" :visible.sync="editVisible" width="50%">
      <el-form ref="editForm" :model="form" label-width="100px" :rules="editRules">
        <el-form-item label="应用名称" prop="appname">
          <el-input v-model="form.appname" clearable placeholder="应用名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="应用类型" prop="apptype">
          <el-select v-model="form.apptype" filterable placeholder="请选择">
            <el-option
              v-for="(key,value) in static_config.APP_TYPE"
              :key="key"
              :label="key"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联资产" prop="asset_list">
          <el-select
            size="medium"
            v-model="form.asset_list"
            multiple
            filterable
            default-first-option
            placeholder="请选择关联资产"
          >
            <el-option
              v-for=" item in asset_options"
              :value-key="item.id"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.app_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="重要程度">
          <el-radio-group v-model="form.level" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.ASSET_LEVEL"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="安全重要等级">
          <el-radio-group v-model="form.sec_level" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.APP_SEC_LEVEL"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="部门" prop="group_name">
          <el-autocomplete
            v-model="form.group_name"
            :fetch-suggestions="querySearchAsyncGroup"
            placeholder="请输入内容"
            @select="handleSelectGroup"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="负责人">{{form.group_owner}}</el-form-item>

        <el-form-item label="安全官">
          <span style="    font-weight: bold;
    ">{{old_sec_owner}}</span>
          <el-button
            size="mini"
            style="color: #3e9b87f3;box-sizing:
    white-space: normal;
    word-break: break-all;
   cursor:pointer"
            @click="isChangeVisible=true"
          >变更</el-button>
          <el-autocomplete
            v-if="isChangeVisible"
            v-model="form.sec_owner_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.APP_STATUS"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="敏感数据条数">
          <el-radio-group v-model="form.sensitive_data_count" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.APP_SENSITIVE_DATA_COUNT"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="允许宕机时长">
          <el-radio-group v-model="form.downtime" size="mini">
            <el-radio-button
              v-for="(key,value) in static_config.APP_DOWNTIME"
              :label="value"
              v-bind:key="key"
            >{{key}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选项">
          <el-checkbox v-model="form.is_open" true-label="1" false-label="0">外网</el-checkbox>
          <el-checkbox v-model="form.is_https" true-label="1" false-label="0">HTTPS</el-checkbox>
          <el-checkbox v-model="form.is_interface" true-label="1" false-label="0">接口</el-checkbox>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doCreate()">修 改</el-button>
      </span>
    </el-dialog>

    <!-- 计划任务 -->
    <el-dialog title="新建计划任务" :visible.sync="schedulerVisible" width="50%">
      <el-form ref="form" label-width="100px">
        <el-form-item label="计划时间">
          <div class="cron">
            <el-popover v-model="cronPopover">
              <cron @change="changeCron" @close="cronPopover=false" i18n="cn"></cron>
              <el-input
                slot="reference"
                @click="cronPopover=true"
                v-model="form.crontab"
                placeholder="请输入定时策略"
              ></el-input>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="form.eid" filterable placeholder="请选择">
            <el-option
              v-for="(value) in userinfo.extension['0']"
              :key="value.eid"
              :label="value.name"
              :value="value.eid"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCreateScheduler()">创建</el-button>
      </span>
    </el-dialog>

    <!-- 安全测试记录 -->
    <el-dialog title="安全测试记录" :visible.sync="secTestRecordVisible" width="50%">
      <el-form ref="form" label-width="100px">
        <el-form-item label="测试类型">
          <el-select v-model="form.title" filterable placeholder="请选择">
            <el-option
              v-for="(key,value) in static_config.SEC_UTEST_TYPE"
              :key="key"
              :label="key"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="说明">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSecTestRecord()">记录</el-button>
      </span>
    </el-dialog>

    <!-- 安全测试 -->
    <el-dialog title="安全测试" :visible.sync="secTestVisible" width="50%">
      <el-form ref="form" label-width="100px">
        <el-form-item label="扫描器选择">
          <el-select v-model="form.eid" filterable placeholder="请选择">
            <el-option
              v-for="(value) in userinfo.extension['0']"
              :key="value.eid"
              :label="value.name"
              :value="value.eid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="说明">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSecTest()">开始扫描</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params,
  getStaticColors,
} from "@/utils/common";
import { global_config } from "@/utils/global_config";
import VueCronEditorBuefy from "vue-cron-editor-buefy";

export default {
  name: "curd",
  template: "<cron/>",
  components: { VueCronEditorBuefy },
  data() {
    var validateSecOwner = (rule, value, callback) => {
      console.log(rule, value);
      if (value === "") {
        callback(new Error("请选择安全官"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          // this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };

    return {
      extension_list: [],
      local_lang: {
        every: "每",
        mminutes: "分",
        hoursOnMinute: "小时 ， 分钟为",
        daysAt: "天,在",
        at: "在",
        onThe: "在",
        dayOfEvery: "天, 每",
        monthsAt: "月, 在",
        everyDay: "每",
        mon: "周一",
        tue: "周二",
        wed: "周三",
        thu: "周四",
        fri: "周五",
        sat: "周六",
        sun: "周日",
        hasToBeBetween: "Has to be between",
        and: "and",
        minutes: "分钟",
        hourly: "小时",
        daily: "天",
        weekly: "星期",
        monthly: "月",
        advanced: "自定义填写",
        cronExpression: "cron 表达式:",
      },
      cronExpression: "*/1 * * * *",
      isChangeVisible: false,
      curFormName: "createForm",
      old_sec_owner: "",
      cronPopover: false,
      cron: "",
      userinfo: { extension: {} },
      schedulerVisible: false,
      secTestRecordVisible: false,
      principal: "",
      asset_options: [],
      asset_option_without_app: [],
      form_errors: [],
      cur_entity: {},
      extension_list_url: "/api/extension/list",
      user_list_url: "/api/user/list",
      group_list_url: "/api/group/list",
      asset_list_url: "/api/asset/select",
      add_url: "/api/crontab/add",
      list_url: "/api/crontab/list",
      del_url: "/api/crontab/del",
      role_list_url: "/api/role/select",
      del_list: new URLSearchParams(),
      tableData: [],
      select_word: "",
      cur_page: 1,
      page_size: 10,
      total: 0,
      multipleSelection: [],
      secTestVisible: false,
      editVisible: false,
      createVisible: false,
      form: {
        enable: "1",
        role_id: "",
        sec_owner: "",
      },
      editFrom: {},
      rules: {
        appname: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
        ],
        asset_list: [
          { required: true, message: "请选择关联资产", trigger: "change" },
        ],
        apptype: [
          { required: true, message: "请选择应用类型", trigger: "change" },
        ],
        group_name: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        sec_owner_name: [
          { required: true, message: "请选择安全官", trigger: "change" },
        ],
      },
      editRules: {
        appname: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
        ],
        asset_list: [
          { required: true, message: "请选择关联应用", trigger: "change" },
        ],
        apptype: [
          { required: true, message: "请选择应用类型", trigger: "change" },
        ],
        group_name: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
      },
      static_config: global_config,
    };
  },

  created() {
    this.getAssetList();
    this.getExtensionList()
    this.getData();

    let ui = JSON.parse(sessionStorage.getItem("userinfo"));
    if (ui) {
      this.userinfo = ui;
    } else {
      this.userinfo = { extension: {} };
    }

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

    statusColorFilter(status) {
      return getStaticColors(status);
    },
    statusNameFilter(status, name) {
      return global_config[name][status];
    },
  },

  methods: {
    getExtensionList() {
      this.$axios.get(this.extension_list_url + "?page_size=99999").then((res) => {
        this.extension_list = res.data.result;
      });
    },
    changeCron(val) {
      this.form.crontab = val;
    },
    jumpAsset(app) {
      let routes = this.$router.resolve({
        path: "/asset",
        query: {
          app: app.id,
        },
      });
      window.open(routes.href, "_blank");
    },
    statusColor(status) {
      return getStaticColors(status);
    },
    querySearchAsync(queryString, cb) {
      this.form.sec_owner = null;
      this.$axios
        .get(this.user_list_url, {
          params: {
            search: queryString,
          },
        })
        .then((res) => {
          let result = new Array();
          res.data.result.map(function (v) {
            result.push({ value: v.username, id: v.id });
          });
          cb(result);
        });
    },
    querySearchAsyncGroup(queryString, cb) {
      this.$axios
        .get(this.group_list_url, {
          params: {
            search: queryString,
          },
        })
        .then((res) => {
          let result = new Array();
          res.data.result.map(function (v) {
            result.push({ value: v.name, id: v.id, owner: v.owner });
          });
          cb(result);
        });
    },
    handleSelect(item) {
      this.form.sec_owner_name = item.value;
      this.form.sec_owner = item.id;
    },

    handleSelectGroup(item) {
      this.form.group_id = item.id;
      if (item.owner) this.form.group_owner = item.owner;
    },
    getAssetList: function () {
      this.$axios.get(this.asset_list_url + "?page_size=99999").then((res) => {
        this.asset_options = res.data.result;
      });
      this.$axios
        .get(this.asset_list_url + "?app_id=0&page_size=99999")
        .then((res) => {
          this.asset_option_without_app = res.data.result;
        });
    },

    sortChange: function (column, prop, order) {
      this.sortcolumn = column.prop;
      this.sortorder = column.order;
      this.getData();
    },

    viewGroupUser() {
      if (this.cur_entity.id) {
        this.$router.push({
          name: "editgroupuser",
          params: this.cur_entity,
        });
      } else {
        this.$message.info("请选择数据");
      }
    },
    checkForm: function () {
      if (this.form.name) {
        return true;
      }

      this.form_errors = [];

      if (!this.form.name) {
        this.form_errors.push("请输入用户组名");
      }
    },

    doCreate(e) {
      let cur_form = null;

      if (this.$refs["createForm"] && this.curFormName == "createForm") {
        cur_form = this.$refs["createForm"];
        console.log("create");
      } else {
        cur_form = this.$refs["editForm"];
        console.log("edit");
      }

      cur_form.validate((valid) => {
        if (valid) {
          this.$axios
            .post(this.add_url, trans_params(this.form))
            .then((res) => {
              if (res.data.status == 1) {
                this.$message.success("操作成功");
                this.getData();
              } else if (!res.data.status) {
                this.$message.error("操作失败, " + res.data.msg);
              }
              this.createVisible = false;
              this.editVisible = false;
            });
        } else {
          this.$message.error("提交失败，请填写相应信息");
        }
      });
    },

    doSecTestRecord(e) {
      this.form.app_id = this.cur_entity.id;
      this.$axios
        .post("/api/extension/log/add", trans_params(this.form))
        .then((res) => {
          if (res.data.status == 1) {
            this.$message.success("操作成功");
            this.getData();
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status + res.data.msg
            );
          this.secTestRecordVisible = false;
        });
    },

    doSecTest(e) {
      this.$axios
        .post("/api/extension/run", trans_params(this.form))
        .then((res) => {
          if (res.data.status == 1) {
            this.$message.success("操作成功");
            this.getData();
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status + res.data.msg
            );
          this.secTestVisible = false;
        });
    },

    doCreateScheduler(e) {
      this.$axios
        .post("/api/app/extension/config", trans_params(this.form))
        .then((res) => {
          if (res.data.status == 1) {
            this.$message.success("操作成功");
            this.getData();
          } else
            this.$message.error(
              "操作失败, 错误码:" + res.data.status + res.data.msg
            );
          this.createVisible = false;
          this.editVisible = false;
          this.schedulerVisible = false;
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
          },
        })
        .then((res) => {
          this.tableData = res.data.result;
          this.total = res.data.total;
          this.cur_entity = {};
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
      this.old_sec_owner = this.form.sec_owner_name;
      this.form.sec_owner = row.sec_owner;
      this.form.sec_owner_name = "";
      this.form.is_https = this.form.is_https.toString();
      this.form.is_open = this.form.is_open.toString();
      this.form.is_interface = this.form.is_interface.toString();
      this.form.apptype = this.form.apptype.toString();
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
                this.$message.error("删除失败, 错误码: " + res.data.status);
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
  width: 200px;
  display: inline-block;
}

.hover-pointer:hover {
  cursor: pointer;
}

.cron-button-group {
  display: inline !important;
}
</style>
