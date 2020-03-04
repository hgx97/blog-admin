<template>
  <div class="app-container">
    <div class="app-content content-padding">
      <el-form :inline="true" :model="getRolesParm" empty-text class="demo-form-inline">
        <el-form-item>
          <el-input v-model="getRolesParm.roleName" placeholder="角色名称" />
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
              <el-dropdown-item @click.native="dropdownAddRole">添加</el-dropdown-item>
              <el-dropdown-item @click.native="dropdownDelRole">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        tooltip-effect="dark"
        v-loading="tableLoading"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="id"
          prop="roleId"
        />
        <el-table-column
          prop="roleName"
          label="角色名称"
        />
        <el-table-column
          prop="roleInfo"
          label="描述"
        />
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <el-switch
              @change="roleSwitchChange(scope.row)"
              v-model="scope.row.roleValid"
              :active-value="zero"
              :inactive-value="one"
            />
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="roleCreatedate"
          label="创建时间"
        />
        <el-table-column
          :formatter="dateFormat"
          prop="roleUpdatedate"
          label="更新时间"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" content="编辑" placement="bottom" effect="light">
              <el-link class="margin-left" icon="el-icon-edit" @click="handleEdit(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" content="分配权限" placement="bottom" effect="light">
              <el-link class="margin-left" icon="el-icon-s-tools" @click="assignationAuth(scope.row.roleId)" />
            </el-tooltip>
            <el-tooltip class="item" content="删除" placement="bottom" effect="light">
              <el-link class="margin-left" icon="el-icon-delete" @click="tableDel(scope.row.roleId)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="getRolesParm.pageTotal"
        :page-size="getRolesParm.pageSize"
        class="pagination-padding"
        background
        :hide-on-single-page="true"
        layout="total, prev, pager, next"
        @current-change="roleTableCurrent"
      />

      <el-dialog :visible.sync="dialogFormVisible" width="30%">
        <div slot="title" class="header-title">
          <p class="title-name">{{ dialogTitle?'新增':'修改' }}</p>
        </div>
        <el-form :model="form" ref="form" :rules="role" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" />
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
              v-model="form.roleValid"
              :active-value="zero"
              :inactive-value="one"
            />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.roleInfo" type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="roleDiaSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title=""
        :visible.sync="RoleAuthdialogVisible"
        width="60%"
      >
        <div slot="title" class="header-title">
          <p class="title-name" style="font-size: 20px">分配菜单权限功能<span style="color: #F56C6C;font-size: 10px">(最终权限以选中菜单为准，如果菜单没有勾选，对应的权限就会被去除！)</span></p>
        </div>
        <el-row :gutter="10">
          <el-col :span="9">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>菜单资源</span>
              </div>
              <div class="item">
                <el-tree
                  ref="menuTree"
                  :data="menus"
                  show-checkbox
                  node-key="mId"
                  highlight-current
                  default-expand-all
                  @check="chenkMenu"
                  :check-strictly="true"
                  :expand-on-click-node="false"
                  :props="defaultProps"
                  v-loading="treeLoading"
                  @node-click="treeClick"
                />
              </div>
            </el-card>
          </el-col>
          <el-col :span="14">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>权限资源</span>
              </div>
              <div class="item">
                <el-table
                  ref="AuthMultipleTable"
                  border
                  :data="authData"
                  tooltip-effect="dark"
                  @select="authTableSelect"
                  @select-all="onAllSelect"
                  v-loading="loading"
                  style="width: 100%"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                  />
                  <el-table-column
                    prop="authCode"
                    label="编码"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="authName"
                    label="名称"
                    show-overflow-tooltip
                  />
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="RoleAuthdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="RoleAuthdialogSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getMenusList } from '@/api/menus'
import { listAuth } from '@/api/auth'
import { getRoles, getRoleAuths, addRole, updateRole, deleteRole, addRoleAuth } from '@/api/role'
import moment from 'moment'
export default {
  data() {
    return {
      role: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      treeLoading: false,
      tableLoading: true,
      loading: false,
      authData: [],
      menus: [],
      defaultProps: {
        children: 'menus',
        label: 'mName'
      },
      RoleAuthdialogVisible: false,
      dialogTitle: true,
      one: 1,
      zero: 0,
      dialogFormVisible: false,
      tableData: [],
      form: {
        roleName: '',
        roleValid: 0,
        roleInfo: ''
      },
      getRolesParm: {
        roleName: '',
        pageNum: 1,
        pageSize: 10,
        pageTotal: 0
      },
      roleId: '',
      roleMenuIds: [],
      roleAuthIds: [],
      clearMenuId: ''
    }
  },
  created: function() {
    this.getRoles()
  },
  methods: {
    // 修改角色状态
    roleSwitchChange: function(d) {
      const parm = {
        roleId: d.roleId,
        roleValid: d.roleValid
      }
      updateRole(parm).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 3 * 1000
        })
      })
    },
    // 添加角色
    addRole: function() {
      addRole(this.form).then(() => {
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 3 * 1000
        })
      })
    },
    // 修改角色
    updateRole: function() {
      delete this.form.roleCreatedate
      delete this.form.roleUpdatedate
      updateRole(this.form).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 3 * 1000
        })
      })
    },
    // 弹框点击确认
    roleDiaSubmit: function() {
      this.$refs.form.validate(valid => {
        console.log(valid)
        if (valid) {
          if (this.dialogTitle) {
            this.addRole()
          } else {
            this.updateRole()
          }
          this.getRoles()
          this.form = {}
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    // 角色表格点击分页
    roleTableCurrent: function(page) {
      this.getRolesParm.pageNum = page
      this.getRoles()
    },
    // 获取全部角色
    getRoles: function() {
      this.tableLoading = true
      getRoles(this.getRolesParm).then(res => {
        this.tableData = res.data
        this.getRolesParm.pageNum = res.pageNum
        this.getRolesParm.pageSize = res.pageSize
        this.getRolesParm.pageTotal = res.pageTotal
        this.tableLoading = false
      })
    },
    // 点击分配权限
    assignationAuth: function(roleId) {
      this.treeLoading = true
      this.authData = []
      this.RoleAuthdialogVisible = true
      getMenusList({ mIsvalid: 0 }).then(res => {
        this.menus = res.data
        this.$nextTick(() => {
          this.roleId = roleId
          getRoleAuths({ roleId }).then(res => {
            const auths = res.data
            if (auths) {
              this.roleMenuIds = auths.menuId
              this.roleAuthIds = auths.authIds
              // const menuIds = auths.map(v => v.menuId)
              this.$refs.menuTree.setCheckedKeys(this.roleMenuIds)
            } else {
              this.roleMenuIds = []
              this.roleAuthIds = []
              this.$refs.menuTree.setCheckedKeys([])
            }
            this.treeLoading = false
          })
        })
      })
    },
    // 点击树节点
    treeClick: function(d) {
      this.loading = true
      this.clearMenuId = d.mId
      listAuth({ menuId: d.mId, pageIndex: 1, pageSize: 100 }).then(res => {
        const data = res.data
        this.authData = data
        this.$nextTick(() => {
          this.$refs.AuthMultipleTable.clearSelection()
          data.forEach(row => {
            this.roleAuthIds.forEach(i => {
              if (i.authId === row.authId) {
                this.$refs.AuthMultipleTable.toggleRowSelection(row, true)
              }
            })
          })
        })
        this.loading = false
      }).catch(() => {
        this.authData = []
      })
    },
    onAllSelect(selection) {
      if (selection.length > 0) {
        this.authTableSelect(selection)
      } else {
        const authIds = this.authData.map(v => v.authId)
        authIds.forEach(v => {
          var index = this.roleAuthIds.findIndex(item => {
            if (item.authId === v) {
              return true
            }
          })
          this.roleAuthIds.splice(index, 1)
        })
      }
    },
    authTableSelect: function(selection, row) {
      this.mergeResourceIdList(selection, row)

      const old = this.$refs.menuTree.getCheckedKeys()
      const must = selection.map(item => item.authMenuId)
      const newSelect = new Set([...old, ...must])
      this.$refs.menuTree.setCheckedKeys(newSelect)
    },
    mergeResourceIdList(selection, row) {
      // true就是选中，0或者false是取消选中
      let selected = true
      if (row) {
        selected = selection.length && selection.indexOf(row) !== -1
      } else {
        selected = selection.length > 0
      }
      // 本次选中的
      const curResourceIdList = selection.map(item => {
        return { authId: item.authId, menuId: item.authMenuId }
      })
      const ridList = this.roleAuthIds
      if (!selected && row) {
        var index = ridList.findIndex(item => {
          if (item.authId === row.authId) {
            return true
          }
        })
        ridList.splice(index, 1)
      }
      // 本次选中的 + 回显的 然后去重
      this.roleAuthIds = [
        ...new Set([...curResourceIdList, ...ridList])
      ]
    },
    onSubmit() {
      this.getRoles()
    },
    // 编辑
    handleEdit(b) {
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      this.form = b
      this.dialogFormVisible = true
      this.dialogTitle = false
    },
    // 下拉框点击添加
    dropdownAddRole: function() {
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      this.form = {}
      this.dialogFormVisible = true
      this.dialogTitle = true
    },
    // 下拉框点击删除
    dropdownDelRole: function() {
      const roles = this.$refs.multipleTable.selection
      const ids = roles.map(v => v.roleId).join()
      if (roles.length > 0) {
        this.$confirm('此操作将永久删除该角色及其相关权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole({ ids }).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.getRoles()
          })
        })
      } else {
        this.$message({
          message: '请选择菜单',
          type: 'warning',
          duration: 3 * 1000
        })
      }
    },
    // 删除
    tableDel: function(id) {
      this.$confirm('此操作将永久删除该角色及其相关权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ ids: id }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.getRoles()
        })
      })
    },
    // 时间格式化
    dateFormat(row, column, cellValue, index) {
      var date = row[column.property]
      if (date === undefined) { return '' }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    // 分配权限点击确认
    RoleAuthdialogSubmit: function() {
      const menuIds = this.$refs.menuTree.getCheckedKeys()
      const authIds = this.roleAuthIds
      // 获取到最终的权限  如果权限有选中而菜单没有选中 则在这里去除过滤  把有选中菜单以及权限的authIds提交到服务器
      const newAuthIds = authIds.filter(v => {
        if (menuIds.indexOf(v.menuId) !== -1) {
          return v
        }
      }).map(v => v.authId)
      if (this.roleId) {
        const newAuthIds2 = [
          ...new Set([...newAuthIds])
        ]
        const parm = { roleId: this.roleId, authIds: { authIds: newAuthIds2.join() }}
        console.log(parm)
        addRoleAuth(parm).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      }
      this.RoleAuthdialogVisible = false
    },
    chenkMenu: function(data, node) {
      let selected = node.checkedKeys.indexOf(data.mId) !== -1 // -1未选中
      if (this.clearMenuId === data.mId && !selected) {
        const authIds = this.$refs.AuthMultipleTable.selection
        // 判断是否有选中的  如果有那就去掉选中
        if (authIds.length > 0) {
          authIds.forEach(v => {
            var index = this.roleAuthIds.findIndex(item => {
              if (item.authId === v.authId) {
                return true
              }
            })
            this.roleAuthIds.splice(index, 1)
          })
        }
        this.$refs.AuthMultipleTable.clearSelection()
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  .content-padding{
    padding: 10px;
  }
  .app-container{
    background-color: #f3f3f3;
  }
  .app-content{
    border-radius: 4px;
    background-color: white;
  }
  .pagination-padding{
    padding-top: 15px;
  }
  .col-bo{
    margin: 5px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .margin-left{
    margin-left: 10px;
  }
</style>
