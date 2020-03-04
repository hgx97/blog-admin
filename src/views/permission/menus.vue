<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="grid-content bg-purple content-padding">
          <el-row :gutter="20">
            <el-col :xl="12" :lg="13" :md="14" :sm="18" :xs="24">
              <el-input v-model="searchMenuiInput" placeholder="名称" @keyup.enter.native="searchMenu" />
            </el-col>
            <el-col :xl="12" :lg="11" :md="10" :sm="8" :xs="24">
              <el-dropdown trigger="click">
                <el-button type="primary">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="dropdownAddMenu">添加</el-dropdown-item>
                  <el-dropdown-item @click.native="dropdownDelMenu">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-tree
                ref="menuTree"
                :data="menus"
                show-checkbox
                node-key="mId"
                :check-strictly="true"
                highlight-current
                default-expand-all
                v-loading="treeLoading"
                :expand-on-click-node="false"
                :props="defaultProps"
                @node-click="treeClick"
              />
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-purple content-padding">
          <el-row>
            <el-col :span="24">
              <p>{{ menustile?'新增':'修改' }}</p>
            </el-col>
            <el-col :span="24">
              <el-form ref="menuForm" :model="menuForm" :rules="menuFormRules" class="demo-ruleForm">
                <el-form-item label="父ID" label-width="100px" prop="mParentid">
                  <el-tooltip class="item" effect="light" content="父ID为0代表为根节点" placement="top-end">
                    <el-input v-model="menuForm.mParentid" :readonly="true" />
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="名称" label-width="100px" prop="mName">
                  <el-input v-model="menuForm.mName" />
                </el-form-item>
                <el-form-item label="编码" label-width="100px" prop="mCode">
                  <el-input v-model="menuForm.mCode" />
                </el-form-item>
                <el-form-item label="路由URL" label-width="100px" prop="mUrl">
                  <el-input v-model="menuForm.mUrl" />
                </el-form-item>
                <el-form-item label="面包屑URL" label-width="100px" prop="mRedirect">
                  <el-input v-model="menuForm.mRedirect" />
                </el-form-item>
                <el-form-item label="面包屑名称" label-width="100px" prop="mTitle">
                  <el-input v-model="menuForm.mTitle" />
                </el-form-item>
                <el-form-item label="组件" label-width="100px" prop="mComponent">
                  <el-input v-model="menuForm.mComponent" />
                </el-form-item>
                <el-form-item label="图标" label-width="100px" prop="mIcon">
                  <el-input v-model="menuForm.mIcon">
                    <el-button slot="append" icon="el-icon-s-open" />
                  </el-input>
                </el-form-item>
                <el-form-item label-width="100px" label="状态">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="是否有效">
                        <el-switch
                          v-model="menuForm.mIsvalid"
                          :active-value="zero"
                          :inactive-value="one"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="是否不在侧边栏显示">
                        <el-switch
                          v-model="menuForm.mHidden"
                          :active-value="zero"
                          :inactive-value="one"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="是否一直显示根路由">
                        <el-switch
                          v-model="menuForm.mAlwaysShow"
                          :active-value="zero"
                          :inactive-value="one"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="是否缓存">
                        <el-switch
                          v-model="menuForm.mNoCache"
                          :active-value="zero"
                          :inactive-value="one"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="是否在面包屑显示">
                      <el-switch
                        v-model="menuForm.mBreadcrumb"
                        :active-value="zero"
                        :inactive-value="one"
                      />
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item label="排序" label-width="100px" prop="mOrder">
                  <el-input-number v-model="menuForm.mOrder" :min="1" />
                </el-form-item>
                <el-form-item label="描述" label-width="100px" prop="mInfo">
                  <el-input
                    v-model="menuForm.mInfo"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                  />
                </el-form-item>
                <el-form-item label-width="100px">
                  <el-button type="primary" @click="submitForm('menuForm')">立即提交</el-button>
                  <el-button @click="resetForm('menuForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-purple content-padding">
          <el-row>
            <el-col>
              <el-form :inline="true" :model="authParm" empty-text class="demo-form-inline">
                <el-form-item>
                  <el-input v-model="authParm.authCode" placeholder="编码" />
                </el-form-item>
                <el-form-item>
                  <el-input v-model="authParm.authName" placeholder="名称" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-dropdown trigger="click">
                    <el-button type="primary">
                      更多<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="dropdownAddAuth">添加</el-dropdown-item>
                      <el-dropdown-item @click.native="dropdownDelAuth">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col>
              <el-table
                ref="multipleTable"
                v-loading="tableLoading"
                border
                :data="authData"
                tooltip-effect="dark"
                style="width: 100%"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  prop="authCode"
                  label="编码"
                  width="120"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="authName"
                  label="名称"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="状态"
                >
                  <template slot-scope="scope">
                    <el-switch
                      @change="authSwitchChange(scope.row)"
                      v-model="scope.row.authIsrequired"
                      :active-value="zero"
                      :inactive-value="one"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      icon="el-icon-edit"
                      @click="authEdit(scope.row.authId, scope.row)"
                    />
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="authDelete(scope.row.authId)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col class="col-padding">
              <el-pagination
                background
                @current-change="authCurrent"
                :hide-on-single-page="true"
                layout="prev, pager, next"
                :total="authParm.pageTotal"
                :page-size="authParm.pageSize"
              />
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="AuthdialogFormVisible" width="25%">
      <div slot="title" class="header-title">
        <p class="title-name">{{ authFormTitle?'新增':'修改' }}</p>
      </div>
      <el-form ref="authForm" :model="authForm" :rules="auth" label-width="100px" class="demo-ruleForm">
        <el-form-item label="编码" prop="authCode">
          <el-input v-model="authForm.authCode" />
        </el-form-item>
        <el-form-item label="名称" prop="authName">
          <el-input v-model="authForm.authName" />
        </el-form-item>
        <el-form-item label="描述" prop="authInfo">
          <el-input v-model="authForm.authInfo" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AuthdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="authFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenusList, addMenu, putMenu, deleteMenu } from '@/api/menus'
import { listAuth, addAuth, updateAuth, delAuth } from '@/api/auth'
export default {
  name: 'MenuPermission',
  // components: {  },
  data() {
    return {
      tableLoading: false,
      treeLoading: true,
      AuthdialogFormVisible: false,
      authFormTitle: true,
      authForm: {
        authName: '',
        authCode: '',
        authInfo: ''
      },
      auth: {
        authName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        authCode: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ]
      },
      authParm: {
        menuId: '',
        authName: '',
        authCode: '',
        pageIndex: 1,
        pageTotal: 0,
        pageSize: 10
      },
      one: 1,
      zero: 0,
      menustile: true, // 判断是新增还是修改
      authData: [],
      searchMenuiInput: '',
      menus: [],
      defaultProps: {
        children: 'menus',
        label: 'mName'
      },
      menuForm: {
        mParentid: 0,
        mName: '',
        mUrl: '',
        mComponent: 'Layout',
        mIcon: '',
        mOrder: '',
        mInfo: '',
        mIsvalid: 0,
        mHidden: 1,
        mBreadcrumb: 0,
        mNoCache: 0,
        mAlwaysShow: 1,
        mRedirect: '',
        mTitle: '',
        mCode: ''
      },
      menuFormRules: {
        mTitle: [{
          required: true, message: '请输入面包屑名称', trigger: 'blur'
        }],
        mCode: [{
          required: true, message: '请输入编码', trigger: 'blur'
        }],
        mParentid: [
          { required: true, message: '请输入父ID', trigger: 'blur' }
        ],
        mName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        mUrl: [
          { required: true, message: '请输入路由URL', trigger: 'blur' }
        ],
        mComponent: [
          { required: true, message: '请输入组件', trigger: 'blur' }
        ],
        mOrder: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  created: function() {
    this.getMenusList()
  },
  methods: {
    // 点击删除菜单
    dropdownDelMenu: function() {
      const menus = this.$refs.menuTree.getCheckedKeys()
      if (menus.length > 0) {
        this.$confirm('此操作将永久删除该节点、子节点及相关权限,请确定是否要?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenu({ ids: menus.join() }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 5 * 1000
            })
            this.resetMenu('menuForm')
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请勾选菜单!',
          duration: 5 * 1000
        })
      }
    },
    // 点击添加菜单按钮
    dropdownAddMenu: function() {
      const menus = this.$refs.menuTree.getCheckedNodes()
      const defMenuForm = { mParentid: 0,
        mComponent: 'Layout',
        mIsvalid: 0,
        mHidden: 1,
        mBreadcrumb: 0,
        mNoCache: 0,
        mAlwaysShow: 1,
        mOrder: 0
      }
      if (menus.length === 1) {
        const menu = menus[0]
        if (menu.mParentid === 0) {
          this.menustile = true
          // this.$refs.menuForm.resetFields()
          this.menuForm = defMenuForm
          this.menuForm.mParentid = menu.mId
        } else {
          this.$message({
            message: '只能选择根节点作为父节点',
            type: 'warning',
            duration: 5 * 1000
          })
        }
      } else if (menus.length === 0) {
        this.menustile = true
        this.menuForm = defMenuForm
        // this.$refs.menuForm.resetFields()
      } else {
        this.$message({
          message: '只能选择一个菜单作为父节点',
          type: 'warning',
          duration: 5 * 1000
        })
      }
    },
    // 刷新菜单和form
    resetMenu: function(formName) {
      this.getMenusList()
      if (formName) this.$refs[formName].resetFields()
    },
    // 新增菜单
    addMenu: function(formName) {
      addMenu(this.menuForm).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.resetMenu(formName)
      })
    },
    // 修改菜单
    updateMenu: function() {
      putMenu(this.menuForm).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.resetMenu()
      })
    },
    // 获取所有菜单
    getMenusList: function(name) {
      this.treeLoading = true
      getMenusList(name).then(response => {
        this.menus = response.data
        this.treeLoading = false
      })
    },
    // 查询菜单
    searchMenu: function() {
      this.getMenusList({ mName: this.searchMenuiInput })
    },
    // 点击树节点时间
    treeClick(data) {
      this.menustile = false
      // 因为vue的对象是引用传递 会影响其他数据  所以要转换一下  没有找到好的方法
      this.menuForm = JSON.parse(JSON.stringify(data))
      console.log()
      this.listAuth(data.mId)
    },
    // 查询该菜单权限
    listAuth: function(menuId) {
      this.authParm.menuId = menuId
      this.getAuths()
    },
    getAuths: function() {
      this.tableLoading = true
      listAuth(this.authParm).then(res => {
        const data = res.data
        if (data) {
          this.authData = data
        }
        this.authParm.pageIndex = res.pageNum
        this.authParm.pageTotal = res.pageTotal
        this.authParm.pageSize = res.pageSize
        this.tableLoading = false
      }).catch(() => {
        this.authData = {}
        this.tableLoading = false
      })
    },
    // 菜单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.menustile) {
            this.addMenu(formName)
          } else {
            this.updateMenu()
          }
          console.log(this.menuForm)
        } else {
          return false
        }
      })
    },
    // 重置菜单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    onSubmit() {
      this.getAuths()
    },
    // 权限点击编辑
    authEdit: function(id, row) {
      this.AuthdialogFormVisible = true
      this.authFormTitle = false
      this.authForm = row
    },
    // 权限点击删除
    authDelete: function(id) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const parm = {
          ids: id
        }
        delAuth(parm).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.resetAuth()
        })
      })
    },
    // 权限更多点击添加
    dropdownAddAuth: function() {
      if (this.authParm.menuId) {
        this.authForm = {}
        this.AuthdialogFormVisible = true
        this.authFormTitle = true
      } else {
        this.$message({
          message: '请选择菜单',
          type: 'warning',
          duration: 5 * 1000
        })
      }
    },
    // 权限更多点击删除
    dropdownDelAuth: function() {
      const authList = this.$refs.multipleTable.selection
      if (authList.length > 0) {
        const authIds = authList.map(v => v.authId).join()
        this.authDelete(authIds)
      } else {
        this.$message({
          message: '请选择菜单',
          type: 'warning',
          duration: 5 * 1000
        })
      }
    },
    // 权限表单点击确定
    authFormSubmit: function() {
      if (this.authFormTitle) {
        // 添加
        this.authForm.authMenuId = this.authParm.menuId
        addAuth(this.authForm).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.resetAuth()
        })
      } else {
        // 更新
        updateAuth(this.authForm).then(res => {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.resetAuth()
        })
      }
    },
    // 重置auth
    resetAuth: function() {
      this.authForm = {}
      this.getAuths()
      this.AuthdialogFormVisible = false
    },
    // 权限分页
    authCurrent: function(page) {
      this.authParm.pageIndex = page
      this.getAuths()
    },
    // 权限状态改变
    authSwitchChange: function(d) {
      const data = {
        authId: d.authId,
        authIsrequired: d.authIsrequired
      }
      console.log(data)
      updateAuth(data).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: white;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .content-padding{
    padding: 10px;
  }
  .app-container{
    background-color: #f3f3f3;
  }
  .col-padding{
    padding-top: 15px;
  }
</style>
