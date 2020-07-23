<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> LDAP配置
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="block">
        <div class="handle-box">
          <el-button size="mini" icon="search" @click="$router.go(-1)">返回</el-button>
        </div>
        <div style="width:30%;">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="名称 *">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="主机 *">
              <el-input v-model="form.host"></el-input>
            </el-form-item>
            <el-form-item label="端口 *">
              <el-input v-model="form.port"></el-input>
            </el-form-item>
            <el-form-item label="帐号 *">
              <el-input v-model="form.account"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password"></el-input>
            </el-form-item>

            <el-form-item label="Base DN *">
              <el-input v-model="form.basedn"></el-input>
            </el-form-item>

            <el-form-item label="登录名属性">
              <el-input v-model="form.loginname_property"></el-input>
            </el-form-item>

            <el-form-item label="名字属性">
              <el-input v-model="form.name_property"></el-input>
            </el-form-item>

            <el-form-item label="姓氏属性">
              <el-input v-model="form.sn_property"></el-input>
            </el-form-item>

            <el-form-item label="邮件属性">
              <el-input v-model="form.email_property"></el-input>
            </el-form-item>

        <el-form-item label="启用状态">
          <el-select v-model="form.enable" placeholder="请选择">
            <el-option key="1" label="启用" value="1">启用</el-option>
            <el-option key="0" label="禁用" value="0">禁用</el-option>
          </el-select>
        </el-form-item>
 
        <el-form-item label="默认">
          <el-select v-model="form.default" placeholder="请选择">
            <el-option key="1" label="是" value="1">是</el-option>
            <el-option key="0" label="否" 否="0">否</el-option>
          </el-select>
        </el-form-item>
            <el-form-item v-if="form_errors.length" style="color:#f78989">
              <b>出现以下问题 :</b>
              <ul>
                <li v-for="error in form_errors" :key="error">{{ error }}</li>
              </ul>
            </el-form-item>
                <el-button type="primary" @click="checkForm()&&doCreate()">{{buttton_name}}</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
import { formatDate,trans_params } from "@/utils/common";
export default {
  data() {
    return {
    add_url:"/api/authmode/add",

      form: {
        mode:"LDAP",
        },
      form_errors: [],
      buttton_name:"创建"
    };
  },
  created() {
    this.viewuser = this.$route.params;
    if(JSON.stringify( this.$route.params)=="{}"){
      this.form ={
        mode:"LDAP",
        }
      }
    
    if (this.viewuser.id){
          this.form = this.viewuser.config
          this.form.id =  this.viewuser.id
          this.buttton_name = "保存"
    }
  },
  methods: {

    doCreate(e) {
      if (!this.viewuser.id){
      this.form.config = JSON.stringify(this.form)
      }else{
        delete this.form.config
        this.form.config = JSON.stringify(this.form)
      }
      
      this.$axios.post(this.add_url, trans_params(this.form)).then(res => {
        if (res.data.status == 1) {
          this.$message.success("操作成功")

        this.$router.push({
          path: "/setting?id=auth_setting"
        });

        } else
          this.$message.error(
            "操作失败, 错误码:" + res.data.status + res.data.msg
          );
        this.createVisible = false;
        this.editVisible = false;
      });
    },
    checkForm: function() {
      if (this.form.name &&
          this.form.host &&
          this.form.port &&
          this.form.basedn &&
          this.form.account) {
        return true;
      }

      this.form_errors = [];

      if (!this.form.name) {
        this.form_errors.push("请输入用户组名");
      }
      if (!this.form.host) {
        this.form_errors.push("请输入主机名");
      }
      if (!this.form.port) {
        this.form_errors.push("请输入端口");
      }
      if (!this.form.basedn) {
        this.form_errors.push("请输入Base DN");
      }
      if (!this.form.account) {
        this.form_errors.push("请输入帐号");
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
  width: 150px;

  display: inline-block;
}

.view-user {
  word-break: break-all;
  line-height: 23px;
  position: relative;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  color: #606266;
}
</style>
