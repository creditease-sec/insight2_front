<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 密码修改
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="block" style="width:50%">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="200px"
          class="demo-ruleForm"
        >
          <el-form-item label="旧密码(未设置请置空)" prop="old_password">
            <el-input v-model="ruleForm.old_password"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="new_password">
            <el-input type="password" v-model="ruleForm.new_password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="re_password">
            <el-input type="password" v-model="ruleForm.re_password" autocomplete="off"></el-input>
          </el-form-item>
          <br />
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { trans_params } from "@/utils/common";
export default {
  data() {
    var validateold_password = (rule, value, callback) => {
       callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.re_password !== "") {
          this.$refs.ruleForm.validateField("re_password");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.new_password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        new_password: "",
        re_password: "",
        old_password: ""
      },
      rules: {
        new_password: [{ validator: validatePass, trigger: "blur" }],
        re_password: [{ validator: validatePass2, trigger: "blur" }],
        old_password: [{ validator: validateold_password, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.$confirm("是否确认此操作", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            that.$axios.post("/api/user/password", trans_params(this.ruleForm))
              .then(res => {
                if (res.data.status >= 1) {
                  this.$message.success("修改成功");
                } else
                  this.$message.error("失败,  " + res.data.msg);
              });
          })
          .catch(() => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

