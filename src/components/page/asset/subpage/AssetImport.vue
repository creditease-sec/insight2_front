<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          导入漏洞
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">


    <div style="display:inline">
    <el-upload
        class="upload-demo"
        action=""
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :limit="limitUpload"
        :auto-upload="false">
    <el-button size="mini" type="primary" >添加表格</el-button>
    
    <div slot="tip" class="el-upload__tip">支持格式 xlsx/xls/csv</div>

    </el-upload>
    <el-button size="mini" type="primary" @click="upload" >导入</el-button>
    <div style="float:right;">
    <!-- <div style="display:inline">示例下载 </div>
    <div >XLSX </div>
    <div >CSV </div> -->
    </div>
    </div>

<!-- obj.ip = v['主机IP']
obj.user_group=v['用户组']
obj.leader = v['leader']
obj.app = v['应用']
obj.responser = v['负责人']
obj.framework_name = v['框架名称']
obj.framework_version = v['框架版本']
obj.app_path = v['应用路径']
obj.business_group = v['业务组']
obj.risk = v['风险']
obj.remark = v['备注'] -->
    <!-- 数据展示 -->
      <el-main>
          <el-table :data="da">
            <el-table-column prop="ip" label="主机IP">
            </el-table-column>
            <el-table-column prop="user_group" label="用户组">
            </el-table-column>
            <el-table-column prop="leader" label="leader">
            </el-table-column>
            <el-table-column prop="app" label="应用">
            </el-table-column>
             <el-table-column prop="responser" label="负责人">
            </el-table-column>
            <el-table-column prop="framework_name" label="框架名称">
            </el-table-column>
            <el-table-column prop="framework_version" label="框架版本">
            </el-table-column>
            <el-table-column prop="app_path" label="应用路径">
            </el-table-column>
            <el-table-column prop="business_group" label="业务组">
            </el-table-column>
            <el-table-column prop="risk" label="风险">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column prop="" label="">
            </el-table-column>
          </el-table>
        </el-main>

       
  </div></div></div>
</template>
<script>
  export default {
    data() {
      return {
        limitUpload:1,
        fileTemp:null,
        file:null,
        da:[],
        dalen:0
      };
    },
    methods:{
        upload(){


      this.$axios({
        url: "/api/vul/import",
        method: "POST",
        data: this.da,
        headers: { "Content-Type": "application/json" }
      }).then(url => {
        console.log(url);
      
      });

        },
        handleChange(file, fileList){
            this.fileTemp = file.raw;
            if(this.fileTemp){
                console.log(this.fileTemp.type)
                if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') 
                    || (this.fileTemp.type == 'application/vnd.ms-excel'||(this.fileTemp.type== 'application/wps-office.xlsx'))
                    )
                    {
                    this.importfxx(this.fileTemp);
                } 
                
                else if(this.fileTemp.type== 'text/csv'){
                    this.readCSVFile(this.fileTemp)

                }else {
                    this.$message({
                        type:'warning',
                        message:'不支持的附件格式:'+this.fileTemp.type+'，请删除后重新上传！'
                    })
                }
            } else {
                this.$message({
                    type:'warning',
                    message:'请上传附件！'
                })
            }
        },
        handleExceed(){
            this.$message({
                type:'warning',
                message:'超出最大上传文件数量的限制！'
            })
            return;
        },
        handleRemove(file,fileList){
            this.fileTemp = null
        },
        csvToObject(csvString){
        var csvarry = csvString.split("\r\n");
        var datas = [];
        var headers = csvarry[0].split(",");
        for(var i = 1;i<csvarry.length;i++){
            var data = {};
            var temp = csvarry[i].split(",");
                 for(var j = 0;j<temp.length;j++){
                     data[headers[j]] = temp[j];
                 }
            datas.push(data);
        }
         return datas;
        },
        readCSVFile(obj) {
         var reader = new FileReader();
         reader.readAsText(obj);
         let that = this
         reader.onload = function () {
               var data = that.csvToObject(this.result);
                console.log(data);//data为csv转换后的对象
                let arr = [];
                data.map(v => {
                    let obj = {}
                    obj.ip = v['主机IP']
                    obj.user_group=v['用户组']
                    obj.leader = v['leader']
                    obj.app = v['应用']
                    obj.responser = v['负责人']
                    obj.framework_name = v['框架名称']
                    obj.framework_version = v['框架版本']
                    obj.app_path = v['应用路径']
                    obj.business_group = v['业务组']
                    obj.risk = v['风险']
                    obj.remark = v['备注']
                    arr.push(obj)
                });
                that.da=arr;
                that.dalen=arr.length;
                return arr;

        }
        },
        importfxx(obj) {
            let _this = this;
            let inputDOM = this.$refs.inputer;
            // 通过DOM取文件数据

            this.file = event.currentTarget.files[0];
            
            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;
            this.readCSVFile(f)
            var reader = new FileReader();
            //if (!FileReader.prototype.readAsBinaryString) {
            FileReader.prototype.readAsBinaryString = function(f) {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function(e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require("xlsx");
                    if (rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), {
                        //手动转化
                        type: "base64"
                        });
                    } else {
                        wb = XLSX.read(binary, {
                        type: "binary"
                        });
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
                    console.log('未处理的原始数据如下：');
                    console.log(outdata);
                    //此处可对数据进行处理
                    let arr = [];
                    outdata.map(v => {
                        let obj = {}
                        obj.ip = v['主机IP']
                        obj.user_group=v['用户组']
                        obj.leader = v['leader']
                        obj.app = v['应用']
                        obj.responser = v['负责人']
                        obj.framework_name = v['框架名称']
                        obj.framework_version = v['框架版本']
                        obj.app_path = v['应用路径']
                        obj.business_group = v['业务组']
                        obj.risk = v['风险']
                        obj.remark = v['备注']
                        arr.push(obj)
                    });
                    _this.da=arr;
                    _this.dalen=arr.length;
                    return arr;
                };
                reader.readAsArrayBuffer(f);
            };
            if (rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        }
    }
  }
</script>
