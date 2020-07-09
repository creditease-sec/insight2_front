<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 个人设置
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
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="ruleForm.nickname"></el-input>
          </el-form-item>
           <el-form-item label="头像" prop="avatar">
                <el-upload
                  class="avatar-uploader"
                  action="/api/avatar/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
            <img v-if="upload_cover_url" :src="upload_cover_url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
                 </el-form-item>
          <br />
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { trans_params } from "@/utils/common";
import bus from "@/components/common/bus";
export default {
  data() {

    return {
      upload_cover_url:false,
      ruleForm: {
      },
      rules: {
      }
    };
  },
  methods: {
      handleAvatarSuccess(res, file) {
        this.ruleForm.avatar = res.path
        this.upload_cover_url =  res.path
        console.log(this.ruleForm.avatar)
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


    submitForm(formName) {
          this.$confirm("是否确认此操作", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
         
            this.$axios.post("/api/user/setting", trans_params(this.ruleForm))
              .then(res => {
                if (res.data.status >= 1) {
                  this.$message.success("修改成功");
                  bus.$emit("updateUserInfo","")
                } else
                  this.$message.error("失败,  " + res.data.msg);
              });
          })
         
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
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
    width: 178px;
    height: 178px;
    display: block;
  }
</style>