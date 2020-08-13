<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 系统
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="el-icon-configuration iconfont_no_margin"></i> 系统设置
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="tab_cur" tab-position="left" @tab-click="handleTabClick">
        <el-tab-pane :label="`全局配置`" name="global_setting" >
          <div class="form-box">
            <el-form ref="form" label-width="120px" :rules="rules">

              <el-form-item label="站点地址" prop="domain">
                <el-input  v-model="normalSettingForm.domian"  class="insight_sensitive"> </el-input>
              </el-form-item>

              <el-form-item label="负责人联系方式" prop="domain">
                <el-input  v-model="normalSettingForm.contact" class="insight_sensitive"> </el-input>
              </el-form-item>

              <el-form-item label="消息发送">
                <el-checkbox v-model="normalSettingForm.isSendEmail" true-label="1" false-label="0">邮件通知</el-checkbox>
                <!-- <el-checkbox v-model="normalSettingForm.isSendSMS"    true-label="1" false-label="0">短信通知</el-checkbox> -->
              </el-form-item>

              <el-form-item label="用户组" prop="group">
                <el-checkbox v-model="normalSettingForm.isCreateGroup" true-label="1" false-label="0">允许新建用户组</el-checkbox>
              </el-form-item>
              
              <el-form-item label="组最大成员数">
                 <el-input-number v-model="normalSettingForm.group_member_limit"  :min="1" :max="500" label="组最大成员数" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item label="全局水印选项">
                <el-checkbox v-model="normalSettingForm.isWaterMarkOn" true-label="1" false-label="0">开启</el-checkbox>
                <!-- <el-checkbox v-model="normalSettingForm.isSendSMS"    true-label="1" false-label="0">短信通知</el-checkbox> -->
              </el-form-item>

            <el-form-item label="">

                <el-button type="primary" size="mini" @click="saveConfigSetting" >保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="`积分参数`" name="point_setting" >
          <div class="form-box">
            <el-form ref="form" label-width="120px" :rules="rules">

              <el-form-item label="一级资产系数">
                 <el-input-number v-model="paramSettingForm.one_level_point"  :min="1" :max="500" label="一级资产系数" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item label="二级资产系数">
                 <el-input-number v-model="paramSettingForm.two_level_point"  :min="1" :max="500" label="一级资产系数" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item label="三级资产系数">
                 <el-input-number v-model="paramSettingForm.three_level_point"  :min="1" :max="500" label="一级资产系数" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item label="其他资产系数">
                 <el-input-number v-model="paramSettingForm.other_level_point"  :min="1" :max="500" label="一级资产系数" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item label="威胁情报系数">
                 <el-input-number v-model="paramSettingForm.ti_level_point"  :min="1" :max="500" label="一级资产系数" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item label="倍数奖励">
                 <el-input-number v-model="paramSettingForm.times_level_point"  :min="1" :max="500" label="一级资产系数" size="mini"></el-input-number>
              </el-form-item>

            <el-form-item label="">

                <el-button type="primary" size="mini"  @click="saveParamSetting" >保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="'认证'" name="auth_setting" >
          <div class="form-box">
            <el-form ref="form"   label-width="120px" style="width:800px" >
              <el-form-item label="新增认证方式">
                <el-select
                  size="mini"
                  v-model="current_auth_type"
                  placeholder="选择认证方式"
                  class="handle-select mr10"
                >
                  <el-option
                    v-for="item in status_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span style="float: left">{{ item.label }}</span>

                  </el-option>
                </el-select>
                <el-button size="mini" @click="$router.push({name: 'editldap' })">+</el-button>
              </el-form-item>
              <el-form-item label="认证方式" >
                <el-table
                  :data="authTableData"
                  border
                  @current-change="handleCurrentChangeRow"
                  highlight-current-row
                  style="width: 100%"
                  ref="multipleTable"
                >
                  <el-table-column label="认证名称" prop="name" min-width="80"></el-table-column>
                  <el-table-column label="认证类型" prop="mode" min-width="55"></el-table-column>
                  <el-table-column label="主机" prop="config.host" min-width="80">
                    
                        <template slot-scope="scope">
           <span  class="insight_sensitive">     {{scope.row.config.host}}  </span>
          </template>
                  </el-table-column>
                  <el-table-column label="人数" prop="usercount" min-width="55"></el-table-column>
                  <el-table-column label="默认" prop="config.default" min-width="40">
                    
                        <template slot-scope="scope">
           <span  class="insight_sensitive">     {{scope.row.config.default?"✓":""}}  </span>
          </template>
                  </el-table-column>
                  <el-table-column label="状态" prop="enable">
              <template slot-scope="scope">
            {{scope.row.enable ===1 ? "启用":"禁用"}}
          </template>
                  </el-table-column>
                  <el-table-column label="操作" min-width="100">
                    <template slot-scope="scope">
                      <el-button size="mini"    @click="testAuth(scope.$index, scope.row)">
                        测试
                      </el-button>
                      <span size="mini"   @click="handleEdit(scope.$index, scope.row)">
                        <i class="el-iconbianji2 iconfont_no_margin sumeru_op_button"></i>
                      </span>
                      <span size="mini" type="danger" @click="dataDel(scope.row.id)">
                        <i class="el-iconshanchu1 iconfont_no_margin sumeru_op_button sumeru_red"></i>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`漏洞审核流程配置`" name="vul_audit_setting" >
          <el-transfer
            filterable 
            :filter-method="filterMethod"
            :titles="['未选择', '已选择']"
            filter-placeholder="请输入流程拼音"
            v-model="vulnsSetting"
            :data="data"
          ></el-transfer>
          <br>
          <el-button type="primary" @click="saveVulnsSetting">保存</el-button>
        </el-tab-pane>

        <el-tab-pane :label="`邮箱配置`" name="email_setting">
          <div class="form-box">
            <el-form ref="form" :model="emailForm" label-width="120px">
              <el-form-item label="SMTP服务器">
                <el-input v-model="emailForm.smtp_host" class="insight_sensitive"></el-input>
              </el-form-item>

              <el-form-item label="SMTP端口号">
                <el-input v-model="emailForm.smtp_port" class="insight_sensitive"></el-input>
              </el-form-item>

              <el-form-item label="SMTP用户">
                <el-input v-model="emailForm.smtp_user" class="insight_sensitive"></el-input>
              </el-form-item>

              <el-form-item label="SMTP密码">
                <el-input v-model="emailForm.smtp_pass" type="password"></el-input>
              </el-form-item>
              <el-form-item label="认证方式">
       <el-radio v-model="emailForm.smtp_auth_type" label="pure">默认</el-radio>
  <el-radio v-model="emailForm.smtp_auth_type" label="ssl">SSL</el-radio>
  <el-radio v-model="emailForm.smtp_auth_type" label="tls">TLS</el-radio>
              </el-form-item>
              <el-form-item label="邮件列表">
                <el-input type="textarea" rows="5" v-model="emailForm.mail_list" class="insight_sensitive"></el-input>
              </el-form-item>

              <el-form-item label="邮件头">
                <el-input type="textarea" rows="5" v-model="emailForm.smtp_head"></el-input>
              </el-form-item>

              <el-form-item label="邮件签名">
                <el-input type="textarea" rows="5" v-model="emailForm.smtp_sign"></el-input>
              </el-form-item>


              <el-form-item>
                <el-button type="primary" @click="testMail">测试邮件</el-button>
                <el-button type="primary" @click="saveEmailSetting">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="`管理员操作`" name="admin_op">
          <!-- <el-button type="primary" @click="initDB">开启服务</el-button>
          <el-button type="primary" @click="initDB">暂停服务</el-button> -->

            <el-form ref="form"  label-width="120px">
              <el-form-item label="操作">
                <el-button type="warning" @click="genEgData">生成示例数据</el-button>
              </el-form-item>

            </el-form>

        </el-tab-pane>
      </el-tabs>
    </div>




  </div>
</template>
<script>
import Qs from "qs";
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params
} from "@/utils/common";
export default {
  name: "Setting",

  data: function() {
    const generateData = _ => {
      const data = [];
      const cities = [
        "未审核",
        "新通告",
        "暂不处理",
        "修复中",
        "复测中",
        "已完成",
        "已驳回",
      ];
      const pinyin = [
        "weishenhe",
        "xintonggao",
        "zanbuchuli",
        "xiufuzhong",
        "fucezhong",
        "yiwancheng",
        "yibohui"
      ];

      const index_key = [
        "10",
        "40",
        "20",
        "50",
        "55",
        "60",
        "30"
      ];

      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index_key[index],
          pinyin: pinyin[index]
        });
      });
      return data
    };
    return {

      rules: {
          group: [
            { required: true, message: '请输入群组名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
      del_url:"/api/authmode/del",
      form_errors:[],
      createVisible:false,
      editVisible:false,
      cur_entity:null,
      data: generateData(),
      current_auth_type: "LDAP",
      vulnsSetting: [],
      normalSettingForm:{},
      paramSettingForm:{},
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      authTableData: [
      ],
      tab_cur: "global_setting",
      status_options: [
        {
          value: "LDAP",
          label: "LDAP"
        }
      ],
      emailForm: {
        smtp_host: "127.0.0.1",
        smtp_port: "25",
        smtp_user: "root",
        smtp_pass: "",
        mail_list: "guest@guest.com"
      }
    };
  },
  created() {
    this.getAllSetting("global_setting");
    if(this.$route.query.id){
      this.tab_cur = this.$route.query.id;
      this.getAuthList();
    }
  },
    updated() {
    this.$desensitive()
  },

  methods: {
    dataDel(cur_del_node_id) {
      // 数据删除，支持多个和单个删除

      let to_del = null;

      if (cur_del_node_id) {
        to_del = cur_del_node_id;
      }else{
        return
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
                this.getAuthList();
                this.$message.success("删除成功");
              } else
                this.$message.error("删除失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
    },
    handleCurrentChangeRow(val) {
      this.cur_entity = val;
    },
    testAuth(index, row){
    this.$axios.post("/api/authmode/test ",trans_params({"id":row.id})).then(res=>{
              if (res.data.status == 1) {
                this.$message.success("测试成功");
              } else
                this.$message.error(
                  "操作失败, 错误码:" + res.data.status + res.data.msg
                );
            })
    },
    handleEdit(index, row) {
    this.cur_entity = row;
    this.jumpToEditLdap()
    },
    jumpToEditLdap(){
      if (this.cur_entity.id) {
        this.$router.push({
          name: "editldap",
          params: this.cur_entity
        });
      } else {
        this.$message.info("请选择数据");
      }
    },
    handleTabClick(tab, event) {
        console.log(tab.name);
        if(tab.name === "auth_setting"){
          this.getAuthList()
        }else if(tab.name === "vul_audit_setting"){
          this.getVulnsSetting()
        }else if(tab.name === "global_setting"){
          this.getAllSetting("global_setting");
        }else if(tab.name === "point_setting"){
          this.getAllSetting("point_setting");
        }else if(tab.name === "email_setting"){
          this.getAllSetting("email_setting");
        }


       

    },

    getAuthList(){
      this.$axios.get("/api/authmode/list ").then(res => {
        this.authTableData = res.data.result;
      });
    },

    getVulnsSetting(){
      this.$axios.get("/api/system/config/get",{}).then(res => {
        console.log(res)
        if (res.data.result.vul_setting){
        this.vulnsSetting = res.data.result.vul_setting;
        }
      });
    },



    getAllSetting(name){
      this.$axios.get("/api/system/config/get",{}).then(res => {
        console.log(res)
        if (res.data.result[name]){
          if(name=="global_setting"){
              this.normalSettingForm = res.data.result[name];
          }
          if(name=="point_setting"){
                  this.paramSettingForm = res.data.result[name];
          }
          if(name=="email_setting"){
                  this.emailForm = res.data.result[name];
          }

        }
      });
    },
    

    saveConfigSetting(){

      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            this.normalSettingForm.type = this.tab_cur
            this.$axios.post("/api/system/config",trans_params(this.normalSettingForm)).then(res=>{
              if (res.data.status == 1) {
                this.$message.success("操作成功");
                this.getAllSetting("global_setting")
              } else
                this.$message.error(
                  "操作失败, 错误码:" + res.data.status + res.data.msg
                );
            })

        })
        .catch(() => {});

    },

    saveParamSetting(){


      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            this.paramSettingForm.type = this.tab_cur
            this.$axios.post("/api/system/config",trans_params(this.paramSettingForm)).then(res=>{
              if (res.data.status == 1) {
                this.$message.success("操作成功");
                 this.getAllSetting("point_setting")
              } else
                this.$message.error(
                  "操作失败, 错误码:" + res.data.status + res.data.msg
                );
            })

        })
        .catch(() => {});

    },

    saveVulnsSetting(){
            this.$axios.post("/api/system/vulconfig",trans_params({"id":this.vulnsSetting})).then(res=>{
              if (res.data.status == 1) {
                this.$message.success("操作成功");
                this.getVulnsSetting()
              } else
                this.$message.error(
                  "操作失败, 错误码:" + res.data.status + res.data.msg
                );
            })
    },

    saveEmailSetting() {
      this.$confirm("是否确认此操作?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .post("/api/system/mailconfig", Qs.stringify(this.emailForm))
          .then(res => {
            if (res.data.status == 1) {
              this.$message.success("配置保存成功!");
            } else {
              this.$message.error(res.data.msg);
            }
          });
      });
    },

    clearTask() {
      this.$confirm(
        "是否确认此操作,此操作可能会造成数据丢失!!!无法恢复!!!慎重执行!!!",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$axios
          .post("/api/system/op", Qs.stringify({ OP: "CLEAR_TASK_INS" }))
          .then(res => {
            if (res.data.status == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
          });
      });
    },

    initDB() {
      this.$confirm(
        "是否确认此操作,此操作可能会造成数据丢失!!!无法恢复!!!慎重执行!!!",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$axios
          .post("/api/system/op", Qs.stringify({ OP: "INIT_DB" }))
          .then(res => {
            if (res.data.status == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
          });
      });
    },
    initDB() {

      this.$confirm(
        "是否确认此操作,此操作可能会造成数据丢失!!!无法恢复!!!慎重执行!!!",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$axios
          .get("/api/init/db")
          .then(res => {
            if (res.data.status == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
          });
      });
    },
    genEgData() {
  
      this.$confirm(
        "是否确认此操作,此操作可能会造成数据丢失!!!无法恢复!!!慎重执行!!!",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$axios
          .get("/api/example/data")
          .then(res => {
            if (res.data.status == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
          });
      });
    },
    testMail() {
      this.$confirm("是否确认此操作?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .post("/api/system/mailtest")
          .then(res => {
            if (res.data.status == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败 - "+res.data.msg);
            }
          });
      });
    }
  }
};
</script>