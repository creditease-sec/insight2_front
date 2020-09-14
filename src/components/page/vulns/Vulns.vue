<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 漏洞
        </el-breadcrumb-item>
        <el-breadcrumb-item>漏洞管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="createVisible=true; form={enable:'1'}"
          size="mini"
        >新增漏洞</el-button>
        <el-input
          size="mini"
          v-model="query_params.search"
          placeholder="请输入关键词"
          class="handle-input"
          @keyup.enter.native="search()"
        ></el-input>
        <el-select
          size="mini"
          v-model="query_params.vul_status"
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

        <el-checkbox
          :checked="is_related_me()"
          @change="isRelatedMeChange"
          style="margin-left:10px"
        >只看我</el-checkbox>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>

        <div style="float:right">
          <span
            v-show="isShowText"
            class="blink"
            style="font-weight: 400; color: #606266;  font-size: 13px"
          >请选择一条数据以显示可操作项</span>
          <span
            v-show="isShowNoOp"
            class="blink"
            style="font-weight: 400; color: #606266;  font-size: 13px"
          >无可用的操作</span>
          <el-button
            size="mini"
            type="primary"
            v-show="isShowAuditButton"
            @click="updateCur_entity(); temp_audit_app_name=form.appname;form.real_rank=form.self_rank;auditVisible=true;"
          >审核</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="updateCur_entity();solveVisible=true;cur_audit_status='/auditing/fixing' "
            v-show="isShowConfirmButton"
          >已知悉</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="updateCur_entity();solveVisible=true;cur_audit_status='/auditing/retest' "
            v-show="isShowApplyRetestButton"
          >申请复测</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="updateCur_entity();solveVisible=true;cur_audit_status='/auditing/fixed' "
            v-show="isShowSubmitRetestButton"
          >提交复测</el-button>

          <el-button size="mini" icon="iconfont  el-iconCSV1" @click="exportCSV()">导出CSV</el-button>
          <el-button size="mini" icon="search" @click="dataDel()">批量删除</el-button>
        </div>
      </div>

      <el-table
        :data="tableData"
        ref="tableDataRef"
        border
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChangeRow"
        highlight-current-row
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <!-- <el-table-column prop="id" label="ID" min-width="40"></el-table-column> -->
        <el-table-column
          v-if="colData[0].istrue"
          prop="vul_name"
          label="名称"
          min-width="150"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span
              class="primary-title insight_sensitive"
              @click="cur_entity = scope.row;viewUser()"
              style="cursor:pointer !important"
            >{{scope.row.vul_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colData[1].istrue"
          prop="appname"
          label="应用"
          min-width="100"
          sortable="custom"
        >
            <template slot-scope="scope">
            <span
              class="primary-title insight_sensitive"
              @click="jumpApp(scope.row.app_id)"
              style="cursor:pointer !important"
            >{{scope.row.appname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colData[2].istrue"
          prop="group_name"
          label="团队"
          min-width="100"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span
              class="primary-title insight_sensitive"
              @click="jumpUserGroup(scope.row.group_id,scope.row.group_name)"
              style="cursor:pointer !important"
            >{{scope.row.group_name+ (scope.row.parent_name?" "+scope.row.parent_name:"") }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="colData[3].istrue"
          prop="vul_type"
          label="类型"
          min-width="100"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span
              class="in-tag"
              :style="{'color':statusColor(scope.row.vul_type) }"
            >{{scope.row.vul_type | statusNameFilter("VUL_TYPE")}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colData[4].istrue"
          prop="self_rank"
          label="Rank"
          min-width="70"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span
              :style="{'color':rankColor(scope.row.self_rank) ,'font-weight':'bold' }"
            >{{scope.row.self_rank}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colData[5].istrue"
          prop="username"
          label="提交人"
          min-width="100"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span class="insight_sensitive">{{scope.row.username }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="colData[8].istrue"
          prop="delay_days"
          label="延期天数"
          min-width="50"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.delay_days }}</template>
        </el-table-column>

        <el-table-column
          v-if="colData[6].istrue"
          prop="submit_time"
          label="提交时间"
          min-width="80"
          sortable="custom"
        >
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
          sortable="custom"
          v-if="colData[7].istrue"
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
        <el-table-column label="操作" min-width="100">
          <template slot="header">
            <el-popover placement="right" trigger="click">
              <el-checkbox-group v-model="colOptions" @change="filterChange">
                <el-checkbox v-for="item in colSelect" :label="item" :key="item"></el-checkbox>
              </el-checkbox-group>
              <el-button slot="reference" size="mini">筛选列</el-button>
            </el-popover>
          </template>

          <template slot-scope="scope">
            <span size="mini" v-tooltip="'编辑'" @click="handleEdit(scope.$index, scope.row)">
              <i class="el-iconbianji2 iconfont_no_margin sumeru_op_button"></i>
            </span>

            <span
              size="mini"
              v-tooltip="'时间线'"
              type="danger"
              @click="showTimeLine(scope.row.id,scope.row.vul_name)"
            >
              <svg
                t="1578992339496"
                class="icon sumeru_op_button"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2958"
                width="15"
                height="15"
              >
                <path
                  d="M593.92 549.888c0-45.56800001-36.864-82.432-82.432-82.432s-82.432 36.864-82.43199999 82.432L428.544 819.2 304.64 819.2l0-545.792c0-45.56800001-36.864-82.432-82.432-82.432s-82.432 36.864-82.432 82.432L139.264 819.2 20.48 819.2c-11.264 0-20.47999999 9.216-20.48 20.48s9.216 20.47999999 20.48 20.48l118.784 0 0 20.48c0 45.56800001 36.864 82.432 82.432 82.432S304.128 926.208 304.128 880.64l0-20.48 123.904 0 0 20.48c0 45.56800001 36.864 82.432 82.432 82.432s82.432-36.864 82.432-82.432l0-20.48L716.8 860.16l0 20.48c0 45.56800001 36.864 82.432 82.432 82.432 45.56800001 0 82.432-36.864 82.432-82.432l0-20.48 119.296 0c10.752 0 20.48-7.68 21.504-18.432 1.024-12.288-8.704-22.528-20.48-22.528l-120.32 0 0-682.496c0-45.56800001-36.864-82.432-82.43200001-82.432-45.56800001 0-82.432 36.864-82.43199999 82.432L716.8 819.2l-122.88 1e-8 0-269.31200001zM263.168 880.64c0 23.04-18.432 41.472-41.472 41.472s-41.472-18.432-41.472-41.472l0-607.232c0-23.04 18.432-41.472 41.472-41.472s41.472 18.432 41.472 41.472L263.168 880.64z m496.128-743.936c0-23.04 18.432-41.472 41.472-41.472s41.472 18.432 41.472 41.472L842.24 880.64c0 23.04-18.432 41.472-41.472 41.47200001s-41.472-18.432-41.472-41.47200001l0-743.936zM552.448 880.64c0 23.04-18.432 41.472-41.472 41.472s-41.472-18.432-41.472-41.472l0-330.752c0-23.04 18.432-41.472 41.472-41.472s41.472 18.432 41.472 41.472L552.448 880.64z"
                  p-id="2959"
                />
              </svg>
            </span>

            <el-dropdown style="margin-left:3px;">
              <span class="el-dropdown-link">
                <i>
                  <svg
                    t="1586761903202"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2172"
                    width="15"
                    height="15"
                  >
                    <path
                      d="M576.0999 511.294942c0 35.056424-28.41926 63.475683-63.475683 63.475684s-63.475683-28.41926-63.475684-63.475684 28.41926-63.475683 63.475684-63.475683 63.475683 28.41926 63.475683 63.475683z m255.82655-63.272046c-35.056424 0-63.475683 28.41926-63.475684 63.475684s28.41926 63.475683 63.475684 63.475683 63.475683-28.41926 63.475683-63.475683-28.41926-63.475683-63.475683-63.475684z m-638.60549 0c-35.056424 0-63.475683 28.41926-63.475683 63.475684s28.41926 63.475683 63.475683 63.475683 63.475683-28.41926 63.475684-63.475683-28.418236-63.475683-63.475684-63.475684z"
                      p-id="2173"
                      fill="#707070"
                    />
                  </svg>
                </i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span size="mini" type="danger" @click="sendEmail(scope.row.id)">
                    <i>
                      <svg
                        t="1586762376540"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="1380"
                        width="15"
                        height="15"
                      >
                        <path
                          d="M945.664 128h-867.328c-43.008 0-78.336 35.328-78.336 78.336v611.328c0 43.008 35.328 78.336 78.336 78.336h867.328c43.008 0 78.336-35.328 78.336-78.336V206.336c0-43.008-35.328-78.336-78.336-78.336z m17.92 273.92s-430.08 179.712-435.2 181.248c-5.12 1.536-13.824 4.096-31.232-3.072l-437.248-178.688v-65.024l456.704 186.88 446.976-185.856v64.512z"
                          p-id="1381"
                        />
                      </svg>
                    </i>
                    发送邮件
                  </span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span
                    size="mini"
                    type="danger"
                    @click="delayForm.id=scope.row.id;delayForm.delay_days=scope.row.delay_days;delayVisible=true"
                  >
                    <i>
                      <svg
                        t="1586765543659"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="1676"
                        width="15"
                        height="15"
                      >
                        <path
                          d="M896 896v128h-64v-128h-128v-64h128v-128h64v128h128v64h-128zM576 192v384H256V512h256V192h64z m363.2 448c12.224-40.832 20.8-83.2 20.8-128a448 448 0 1 0-448 448c44.8 0 87.168-8.576 128-20.8v68.032A511.488 511.488 0 0 1 512 1024a512 512 0 1 1 512-512c0 44.288-6.208 87.04-16.768 128h-68.032z"
                          p-id="1677"
                        />
                      </svg>
                    </i>
                    延期处理
                  </span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <span size="mini" type="danger" @click="dataDel(scope.row.id)">
                    <i class="el-iconshanchu1 iconfont_no_margin sumeru_red"></i>
                    <span class="sumeru_red">删除漏洞</span>
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="query_params.page_index"
          :page-sizes="[10, 20, 50,100]"
          :page-size.sync="query_params.page_size"
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
            style="width:350px;"
            v-model="form.app_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入关键字"
            @select="handleSelect"
            clearable
          ></el-autocomplete>
          <!-- <span style="color:#7e7ed2">新增</span>
          <div style="float:right">
          关联资产:
          <el-autocomplete
            style="width:350px;"
            v-model="form.app_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入关键字"
            @select="handleSelect"
            clearable
          ></el-autocomplete>
          </div>
          
          <br> <div style="float:right">关联部门:
          <el-autocomplete
            style="width:350px;"
            v-model="form.app_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入关键字"
            @select="handleSelect"
            clearable
          ></el-autocomplete>
 </div> -->
        </el-form-item>

        <el-form-item label="关联解决方案" prop="solution_id">
          <el-autocomplete
            style="width:350px;"
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
    <el-dialog title="编辑漏洞" :visible.sync="editVisible" width="80%" :before-close="handleClose">
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
          {{old_app_name}}
          <span style="color:#8c153e">变更为</span>
          <el-autocomplete
            style="width:350px;"
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
        <el-form-item label="漏洞状态">
          <el-select
            size="mini"
            v-model="form.vul_status"
            placeholder="状态"
            class="handle-select mr10"
          >
            <el-option
              v-for="item in status_options_tochange"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }}</span>
            </el-option>
          </el-select>
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
      <el-form ref="editForm" :model="form" label-width="90px">
        <el-form-item label="漏洞标题" prop="vul_name">{{form.vul_name}}</el-form-item>

        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="form.vul_type" placeholder="请选择" size="mini" :disabled="true">
            <el-option
              v-for="(key,item) in static_config.VUL_TYPE"
              :key="item"
              :label="key"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="自评Rank" prop="self_rank">{{form.self_rank}}</el-form-item>
        <el-form-item label="风险等级" prop="risklevel">
          <el-tag :type="colortype" size="medium">{{risklevel}}</el-tag>
        </el-form-item>
        <el-form-item label="审核状态">
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
            v-model="temp_audit_app_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            clearable
            ref="elautocomplete"
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
        <el-form-item label="风险等级" v-show="isShowAuditDetail">
          <el-tag :type="colortype" size="medium">{{real_risklevel}}</el-tag>
        </el-form-item>
        <el-form-item label="回复作者" prop="return">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.content"></el-input>
        </el-form-item>

        <el-form-item label="详情备注" prop="return">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.msg"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doAudit()">审 核</el-button>
      </span>
    </el-dialog>

    <!-- 处理 -->
    <el-dialog title="处理漏洞" :visible.sync="solveVisible" width="50%">
      <el-form ref="editForm" :model="form" label-width="90px">
        <el-form-item label="漏洞标题" prop="vul_name">{{form.vul_name}}</el-form-item>

        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="form.vul_type" placeholder="请选择" size="mini" :disabled="true">
            <el-option
              v-for="(key,item) in static_config.VUL_TYPE"
              :key="item"
              :label="key"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="自评Rank" prop="self_rank">{{form.self_rank}}</el-form-item>
        <el-form-item label="风险等级" prop="risklevel">
          <el-tag :type="colortype" size="medium">{{risklevel}}</el-tag>
        </el-form-item>

        <el-form-item label="回复作者" prop="return">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="doSolve()">确 认</el-button>
      </span>
    </el-dialog>

    <!-- 延期处理 -->
    <el-dialog title="延期处理" :visible.sync="delayVisible" width="50%">
      <el-form ref="editForm" :model="form" label-width="100px">
        <el-form-item label="当前延期(天)" prop="return">
          <el-slider v-model="delayForm.delay_days" show-input></el-slider>
        </el-form-item>
        <el-form-item label="缘由" prop="return">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="delayForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="delayVul()">更 新</el-button>
      </span>
    </el-dialog>

    <!-- 时间线 -->
    <el-dialog :title="vullog_vul_name" :visible.sync="timelineVisible" width="50%">
      <div class="radio" style="margin-bottom:20px;">
        <el-radio-group v-model="reverse">
          <el-radio :label="true">正序</el-radio>
          <el-radio :label="false">倒序</el-radio>
        </el-radio-group>
      </div>

      <div class="block">
        <span v-if="current_vullog_list.length == 0">暂无记录</span>
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in current_vullog_list"
            :key="index"
            :icon="activity.icon"
            :type="'primary'"
            :color="getTimeColor(activity.action)"
            size="large"
            :timestamp="activity.create_time|formatDate"
          >
            <span style="font-weight: bold;">{{activity.action}}</span> 操作人:
            <span
              :style="{'color':getTimeNameColor(activity.username),'font-weight':'bold'} "
            >{{activity.username}}</span>
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="timelineVisible=false">知道了</el-button>
      </span>
    </el-dialog>

    <!-- 漏洞快速查看 -->
    <el-drawer title="漏洞快速查看" :visible.sync="drawer" :with-header="false">
      <div style="margin:5%">
        <span>漏洞快速查看</span>
        <el-divider content-position="left">漏洞快速查看</el-divider>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Vue from "vue";
import {
  getDateDiff_timestamp,
  formatDate,
  trans_params,
  getStaticColors,
  getRankColors,
} from "@/utils/common";
import { global_config } from "@/utils/global_config";

export default {
  name: "curd",
  components: {},
  data() {
    let that = this;
    var checkAppID = (rule, value, callback) => {
      console.log(rule, value, callback);
      console.log(this.form);
      that.$nextTick(() => {
        console.log(this.form.app_id);
      });
      if (!value) {
        return callback(new Error("请选择关联应用!!!"));
      } else {
        return true;
      }
    };

    return {
      query_params: {
        // search: "",
        // sort: null,
        // direction: null,
        // vul_status: null,
        page_index: 1,
        page_size: 10,
        is_related_me: this.is_related_me() ? 1 : 0,
      },
      drawer: false,
      temp_audit_app_name: "",
      app_list: [],
      colData: [
        { title: "名称", istrue: true },
        { title: "应用", istrue: false },
        { title: "团队", istrue: false },
        { title: "类型", istrue: true },
        { title: "Rank", istrue: true },
        { title: "提交人", istrue: true },
        { title: "提交时间", istrue: true },
        { title: "状态", istrue: true },
        { title: "延期天数", istrue: false },
      ],
      colOptions: ["名称", "Rank", "提交人", "提交时间", "状态", "类型"],
      colSelect: [],
      reverse: false,
      // activities: [
      //   {
      //     content: "提交漏洞",
      //     timestamp: "2018-04-12 20:46",
      //     size: "large",
      //     type: "primary",
      //     icon: "el-icon-more",
      //   },
      //   {
      //     content: "修改漏洞",
      //     timestamp: "2018-04-03 20:46",
      //     color: "#0bbd87",
      //   },
      //   {
      //     content: "处理漏洞",
      //     timestamp: "2018-04-03 20:46",
      //     size: "large",
      //   },
      //   {
      //     content: "完成漏洞",
      //     timestamp: "2018-04-03 20:46",
      //   },
      // ],
      old_app_name: "",
      // is_related_me: 1,
      timelineVisible: false,
      isShowEditAppID: false,
      cur_audit_status: "/auditing/confirm",
      auditVisible: false,
      solveVisible: false,
      delayVisible: false,
      select_vul_status: null,
      app_id: null,
      app_id_name: null,
      status_options: [
        {
          value: "0",
          label: "未审核",
        },
      ],
      status_options_tochange:[
 
      ],
      rules: {
        vul_name: [
          { required: true, message: "请输入漏洞标题", trigger: "blur" },
        ],
        app_id: [
          { required: true, message: "请选择关联应用", trigger: "change" },
        ],
        layer: [{ required: true, message: "请选择漏洞层面", trigger: "blur" }],
        vul_type: [
          { required: true, message: "请选择漏洞类型", trigger: "blur" },
        ],
        self_rank: [
          { required: true, message: "请填写Rank值", trigger: "blur" },
        ],
        vul_source: [
          { required: true, message: "请选择漏洞来源", trigger: "blur" },
        ],
      },
      app_list_url: "/api/app/select",
      paper_list_url: "/api/paper/list",
      add_url: "/api/vul/add",
      list_url: "/api/vul/list",
      del_url: "/api/vul/del",
      send_email_url: "/api/vul/send_notification_email",
      delay_url: "/api/vul/delay",
      role_list_url: "/api/role/select",
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
      current_vullog_list: [],
      vullog_vul_name: "",
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
        app_id: -1,
      },
      delayForm: {},
      role_options: [
        {
          value: "-",
          label: "-",
        },
      ],
      static_config: global_config,
    };
  },
  mounted() {
    window.onbeforeunload = function (e) {
      e = e || window.event;
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = "关闭提示";
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return "关闭提示";
    };
  },
  updated() {
    this.$desensitive();
  },
  watch: {
    colOptions(valArr) {
      var arr = this.colSelect.filter((i) => valArr.indexOf(i) < 0); // 未选中
      this.colData.filter((i) => {
        console.log(arr.toString(), i.title, arr.toString().indexOf(i.title));
        if (arr.indexOf(i.title) != -1) {
          i.istrue = false;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        } else {
          i.istrue = true;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        }
      });
    },
  },
  created() {
    if (Object.keys(this.$route.query).length > 0) {
      this.query_params = this.$route.query;
      if (this.query_params.page_index) {
        this.query_params.page_index = parseInt(this.query_params.page_index)
      }
      if (this.query_params.page_size) {
        this.query_params.page_size = parseInt(this.query_params.page_size)
      }
      if (this.query_params.vul_status!="" && this.query_params.vul_status!=undefined) {
        this.query_params.vul_status = parseInt(this.query_params.vul_status)
      }
   
    }


    if (localStorage.getItem("__USER_CONF__") == null || JSON.parse(localStorage.getItem("__USER_CONF__")).filter == undefined){
       
    } else{
      this.colOptions =  JSON.parse(localStorage.getItem("__USER_CONF__")).filter;
    }
    
    var _this = this;
    for (let i = 0; i < _this.colData.length; i++) {
      _this.colSelect.push(_this.colData[i].title);
      if (_this.colData[i].title == "名称") {
        continue;
      }
    }
    
    for (let key in global_config["VUL_STATUS"]) {
    　　let item = global_config["VUL_STATUS"][key];
        this.status_options_tochange.push({'id':parseInt(key),'name':item})
    }

  
    this.getStatusGroup();
    this.getRoleList();
    this.getData(false);
  },

  computed: {
    isShowText: function () {
      if (JSON.stringify(this.cur_entity) == "{}") {
        return true;
      } else {
        return false;
      }
    },

    isShowNoOp: function () {
      return (
        !this.isShowText &&
        !this.isShowConfirmButton &&
        !this.isShowApplyRetestButton &&
        !this.isShowAuditButton &&
        !this.isShowSubmitRetestButton
      );
    },
    isShowAuditDetail: function () {
      return this.cur_audit_status == "/auditing/confirm";
    },
    isShowAuditButton: function () {
      if (this.cur_entity) {
        return this.cur_entity.vul_status == "10";
      } else {
        return false;
      }
    },
    isShowConfirmButton: function () {
      if (this.cur_entity) {
        return this.cur_entity.vul_status == "40";
      } else {
        return false;
      }
    },
    isShowApplyRetestButton: function () {
      if (this.cur_entity) {
        return this.cur_entity.vul_status == "50";
      } else {
        return false;
      }
    },
    isShowSubmitRetestButton: function () {
      if (this.cur_entity) {
        return this.cur_entity.vul_status == "55";
      } else {
        return false;
      }
    },
    colortype: function () {
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
    risklevel: function () {
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
    real_risklevel: function () {
      if (this.form.real_rank >= 0 && this.form.real_rank < 6) {
        return "低危";
      } else if (this.form.real_rank < 11) {
        return "中危";
      } else if (this.form.real_rank < 16) {
        return "高危";
      } else if (this.form.real_rank <= 20) {
        return "严重";
      }
    },
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
        "-1": "danger",
      };
      return statusMap[status];
    },
    statusNameFilter(status, name, default_status = "其他") {
      let statusName = global_config[name][status];
      if (global_config[name][status]) {
        return global_config[name][status]; 
      } else {
        return default_status;
      }
    },
  },

  methods: {
    jumpApp(id) {
      this.$router.push({
        name: "app",
        params: { id: id },
      });
    },

    jumpUserGroup(id, group_name) {
      this.$router.push({
        name: "editgroupuser",
        params: { id: id, name: group_name },
      });
    },
    delayVul(id) {
      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(this.delay_url, trans_params(this.delayForm))
            .then((res) => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("成功");
              } else this.$message.error("失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
      this.delayVisible = false;
    },
    sendEmail(id) {
      this.$confirm("是否确认此操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(this.send_email_url, trans_params({ id: id }))
            .then((res) => {
              if (res.data.status >= 1) {
                this.getData();
                this.$message.success("发送成功");
              } else
                this.$message.error("发送失败, 错误码: " + res.data.status);
            });
        })
        .catch(() => {});
    },
    showTimeLine(id, vul_name) {
      this.timelineVisible = true;
      this.vullog_vul_name = vul_name;
      this.$axios.get("api/vullog/list?vul_id=" + id).then((res) => {
        console.log(res.data.result);
        this.current_vullog_list = res.data.result;
      });
    },
    is_related_me() {
      console.log("LOCAL STOARGE", localStorage.getItem("__USER_CONF__"));
      if (localStorage.getItem("__USER_CONF__") == null || JSON.parse(localStorage.getItem("__USER_CONF__")).is_onlyme == undefined){
        return false
      }else{
        return JSON.parse(localStorage.getItem("__USER_CONF__")).is_onlyme
      }
    },
    isRelatedMeChange(val) {
      console.log(val);

      if (localStorage.getItem("__USER_CONF__") == null){
         localStorage.setItem("__USER_CONF__", JSON.stringify({"is_onlyme":val,"filter":this.colOptions}))
      }else{
         let user_conf = JSON.parse(localStorage.getItem("__USER_CONF__"))
         user_conf["is_onlyme"] = val
         localStorage.setItem("__USER_CONF__", JSON.stringify(user_conf))
      }
     
      this.getData();
      this.getStatusGroup();
    },
    desensitive() {
      let arr = document.querySelectorAll(".insight_sensitive");
      for (let t in arr) {
        if (arr[t] && typeof arr[t] == "object") {
          arr[t].innerHTML = "*******";
        }
      }
    },
    exportCSV() {
      let that = this;
      this.$axios({
        method: "get",
        url: "/api/vul/export",
        data: that.query_params,
        responseType: "blob",
      }).then((res) => {
        if (!res.data) {
          return;
        }
        let url = window.URL.createObjectURL(res.data);
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "vulns_export.csv");
        document.body.appendChild(link);
        link.click();
      });
    },
    updateCur_entity() {
      this.form = this.cur_entity;
      this.form.vul_type = this.cur_entity.vul_type.toString();
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
      var formdata = new FormData();
      formdata.append("image", $file);
      this.$axios({
        url: "/api/image/upload",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((url) => {
        console.log(url);
        this.$refs.poc_editor.$img2Url(pos, url.data.path);
      });
    },
    $imgAddSolution(pos, $file) {
      var formdata = new FormData();
      formdata.append("image", $file);
      this.$axios({
        url: "/api/image/upload",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((url) => {
        console.log(url);
        this.$refs.solution_editor.$img2Url(pos, url.data.path);
      });
    },
    handleSelect(item) {
      this.form.app_id = item.id;
      this.form.app_name = item.value;
    },
    handleSelectPaper(item) {
      this.form.article_id = item.id;
      this.form.solution_name = item.value;
    },

    querySearchAsync(queryString, cb) {
      let that = this;
      this.$axios
        .get(this.app_list_url, {
          params: {
            search: queryString,
          },
        })
        .then((res) => {
          that.app_list = new Array();
          res.data.result.map(function (v) {
            that.app_list.push({ value: v.appname, id: v.id.toString() });
          });
          cb(that.app_list);
          // this.$refs.elautocomplete.handleFocus()
        });
    },
    querySearchPaperAsync(queryString, cb) {
      this.$axios
        .get(this.paper_list_url, {
          params: {
            search: queryString,
          },
        })
        .then((res) => {
          let result = new Array();
          res.data.result.map(function (v) {
            result.push({ value: v.title, id: v.id });
          });
          cb(result);
        });
    },
    handleClose(done) {
      this.$confirm("数据还未提交，确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getRoleList: function () {
      this.$axios
        .get(this.role_list_url, {
          params: {
            type: 0,
          },
        })
        .then((res) => {
          this.role_options = res.data.result;
          console.log(this.role_options);
        });
    },

    sortChange: function (column, prop, order) {
      this.query_params.sort = column.prop;
      this.query_params.direction = column.order;
      this.getData();
    },

    viewUser() {
      if (this.cur_entity.id) {
        let routes = this.$router.resolve({
          name: "viewvulndetail",
          query: { id: this.cur_entity.id },
        });

        window.open(routes.href, "_blank");
        // this.$router.push({
        //   name: "viewvulndetail",
        //   params: this.cur_entity
        // });
      } else {
        this.$message.info("请选择数据");
      }
    },

    getStatusGroup() {
      console.log(this.is_related_me);
      this.$axios
        .get(
          "api/vul/status/group?is_related_me=" + (this.is_related_me() ? 1 : 0)
        )
        .then((res) => {
          this.status_options = res.data.result;
        });
    },
    doCreate(e) {
      let cur_form = null;

      if (this.$refs["createForm"]) {
        cur_form = this.$refs["createForm"];
      } else {
        cur_form = this.$refs["editForm"];
      }

      cur_form.validate((valid) => {
        if (valid) {
          this.$axios
            .post(this.add_url, trans_params(this.form))
            .then((res) => {
              if (res.data.status == 1) {
                this.$message.success("操作成功");
                this.getData();
                this.getStatusGroup()
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
      this.$axios
        .post("api" + this.cur_audit_status, trans_params(this.form))
        .then((res) => {
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
      this.$axios
        .post("api" + this.cur_audit_status, trans_params(this.form))
        .then((res) => {
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
    getData(isJump = true) {
      let that = this;

      this.query_params.is_related_me = this.is_related_me() ? 1 : 0

      if (isJump) {
        this.$router.push({
          name: "vulns",
          query: that.query_params,
        });
      }  
        this.$axios
          .get(this.list_url, {
            params: that.query_params,
          })
          .then((res) => {
            this.tableData = res.data.result;
            this.total = res.data.total;
            this.cur_entity = {};
          });
       
    },
    filterChange(val){
      console.log(val)
      if (localStorage.getItem("__USER_CONF__") == null){
         localStorage.setItem("__USER_CONF__", JSON.stringify({"filter":val}))
      }else{
         let user_conf = JSON.parse(localStorage.getItem("__USER_CONF__"))
         user_conf["filter"] = val
         localStorage.setItem("__USER_CONF__", JSON.stringify(user_conf))
      }
    },
    handleSizeChange(val) {
      this.query_params.page_size = val;
      this.getData();
    },

    handleCurrentChange(val) {
      this.query_params.page_index = val;
      this.getData();
    },

    handleCurrentChangeRow(val) {
      this.cur_entity = val;
    },

    search() {
      // let that = this
      // this.$router.push({
      //   name: "vulns",
      //   query: that.query_params
      // }
      // )
      this.getData();
    },

    handleEdit(index, row) {
      this.form_errors = [];
      this.editVisible = true;
      this.form = row;
      delete this.form.create_time;
      this.form.enable = row.enable == 1 ? "1" : "0";
      this.form.app_name = row.appname;
      this.form.article_id = row.article_id;
      this.form.vul_poc = filterXSS(row.vul_poc);
      this.form.vul_solution = filterXSS(row.vul_solution);
      this.form.vul_type = row.vul_type.toString();
      this.old_app_name = this.form.app_name;
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
    filterVulType(value, row, column) {
      console.log(value, row, column);
      const property = column["property"];
      return row[property] === value;
    },
    getTimeColor(op_name) {
      switch (op_name) {
        // ['漏洞确认', '漏洞完成', '漏洞已知悉(开始修复)', '漏洞忽略', '漏洞驳回', '漏洞申请复测', '漏洞暂不处理']

        // ['漏洞新增/编辑',
        //  '漏洞删除',
        //  '漏洞延期处理',
        //  '单个漏洞查询',
        //  '漏洞手动发送邮件']
        case "单个漏洞查询":
          return "#3e9b87f3";
        case "漏洞新增/编辑":
          return "#BF6EE0";
        case "漏洞忽略":
          return "#BF7130";
        case "漏洞确认":
          return "#269926";
        case "漏洞驳回":
          return "#992667";
        case "漏洞暂不处理":
          return "#FF4040";
        case "漏洞完成":
          return "#1D7373";
        case "漏洞申请复测":
          return "#FF9640";
        case "漏洞已知悉(开始修复)":
          return "#BF7130";
        default:
          return "#fff";
      }
    },
    getTimeNameColor(op_name) {
      let hash_num = 0;
      for (let i = 0; i < op_name.length; i++) {
        hash_num += op_name[i].charCodeAt();
      }

      let n = (((hash_num / 1000.0) * 0xfffff) | 0).toString(16);
      return (
        "#" +
        (n.length !== 6
          ? (((hash_num / 1000.0) * 0xf) | 0).toString(16) + n
          : n)
      );
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
