<template>
  <div class="app-container">
    <div class="app-content content-padding">
      <el-form :inline="true" :model="getUserParm" ref="getUserParm" empty-text class="demo-form-inline">
        <el-form-item>
          <el-input v-model="getUserParm.account" placeholder="用户账号" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="getUserParm.userName" placeholder="用户名称" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="getUserParm.phone" placeholder="用户手机" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="getUserParm.email" placeholder="用户邮箱" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown trigger="click">
            <el-button type="primary">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="dropdownAddUser">添加</el-dropdown-item>
              <el-dropdown-item @click.native="dropdownDelUser">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        v-loading="tableLoading"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="id"
          prop="userId"
          :show-overflow-tooltip='true'
        />
        <el-table-column
          prop="userName"
          label="用户名称"
          :show-overflow-tooltip='true'
        />
        <el-table-column
          prop="userAccount"
          label="用户账号"
          :show-overflow-tooltip='true'
        />
        <el-table-column
          label="头像"
        >
          <template slot-scope="scope">
            <el-avatar :src="scope.row.userHead"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="userEmail"
          label="邮箱"
          :formatter="formatString"
          :show-overflow-tooltip='true'
        />
        <el-table-column
          prop="userPhone"
          label="手机"
          :formatter="formatString"
          :show-overflow-tooltip='true'
        />
        <el-table-column
          prop="userSignature"
          label="签名"
          :formatter="formatString"
          :show-overflow-tooltip='true'
        />
        <el-table-column
          label="是否注销"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.userIslogout"
              :active-value="one"
              :inactive-value="zero"
              @change="LogoutSwitchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="是否封禁"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.userIsseal"
              :active-value="one"
              :inactive-value="zero"
              @change="sealSwitchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="userCreatedate"
          label="创建时间"
          :show-overflow-tooltip='true'
        />
        <el-table-column
          :formatter="dateFormat"
          prop="userUpdatedate"
          label="更新时间"
          :show-overflow-tooltip='true'
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" content="编辑" placement="bottom" effect="light">
              <el-link class="margin-left" icon="el-icon-edit" @click="handleEdit(scope.row)" />
            </el-tooltip>
             <el-tooltip class="item" content="分配角色" placement="bottom" effect="light">
               <el-link class="margin-left" icon="el-icon-s-tools" @click="assignationRole(scope.row.userId)" />
            </el-tooltip>
            <el-tooltip class="item" content="删除" placement="bottom" effect="light">
              <el-link class="margin-left" icon="el-icon-delete" @click="tableDel(scope.row.userId)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="getUserParm.pageTotal"
        :page-size="getUserParm.pageSize"
        class="pagination-padding"
        background
        :hide-on-single-page="true"
        layout="total, prev, pager, next"
        @current-change="userTableCurrent"
      />
    </div>

    <el-dialog :visible.sync="dialogFormVisible" width="40%">
      <div slot="title" class="header-title">
        <p class="title-name">{{ dialogTitle?'新增':'修改' }}</p>
      </div>
      <el-form :model="userForm" ref="userForm" :rules="user" label-width="100px">
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="userForm.userAccount" :disabled="!dialogTitle" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="userForm.userName" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" />
        </el-form-item>
        <el-form-item label="用户手机" prop="userPhone">
          <el-input v-model="userForm.userPhone" />
        </el-form-item>
        <el-form-item label="用户微信" prop="userWechatid">
          <el-input v-model="userForm.userWechatid" />
        </el-form-item>
        <el-form-item label="用户头像" prop="userHead">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model="userForm.userHead" />
            </el-col>
            <el-col :span="5">
              <el-avatar :src="userForm.userHead"></el-avatar>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否注销" prop="userIslogout">
          <el-switch
            v-model="userForm.userIslogout"
            :active-value="one"
            :inactive-value="zero"
          />
        </el-form-item>
        <el-form-item label="是否封禁" prop="userIsseal">
          <el-switch
            v-model="userForm.userIsseal"
            :active-value="one"
            :inactive-value="zero"
          />
        </el-form-item>
        <el-form-item label="用户签名" prop="userSignature">
          <el-input v-model="userForm.userSignature" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="userDiaSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title=""
      :visible.sync="userRoledialogVisible"
      width="40%"
    >
      <div slot="title" class="header-title">
        <p class="title-name" style="font-size: 20px">分配角色</p>
      </div>
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>角色资源</span>
        </div>
        <div class="item">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            :props="{
              key: 'roleId',
              label: 'roleName'
            }"
            :titles="['未选择角色', '已选择角色']"
            :button-texts="['取消', '选择']"
            filter-placeholder="请输入角色名称"
            v-model="Rolevalue"
            :data="RoleData">
          </el-transfer>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
          <el-button @click="userRoledialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="userRoledialogSubmit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

import moment from 'moment'
import { list, addUser, addUserRole, getUserRole, delUser, updateUser } from '@/api/user'
export default {
  name: 'UserPermission',
  data() {
    return {
      user: {
        userAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        userHead: [
          { required: true, message: '请输入头像', trigger: 'blur' }
        ]
      },
      Rolevalue: [1],
      RoleData: [],
      loading: false,
      userRoledialogVisible: false,
      userForm: {},
      dialogTitle: true,
      dialogFormVisible: false,
      one: 1,
      zero: 0,
      tableData: [],
      tableLoading: false,
      getUserParm: {
        account: '',
        userName: '',
        phone: '',
        email: '',
        pageNum: 1,
        pageSize: 10,
        pageTotal: 0
      },
      userId: ''
    }
  },
  created: function() {
    this.getUserList()
  },
  methods: {
    getUserList: function() {
      this.tableLoading = true
      list(this.getUserParm).then(res => {
        this.tableData = res.data
        this.getUserParm.pageNum = res.pageNum
        this.getUserParm.pageSize = res.pageSize
        this.getUserParm.pageTotal = res.pageTotal
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    filterMethod: function(query, item) {
      if (item.roleName.indexOf(query) === 0) {
        return item
      }
    },
    userRoledialogSubmit: function() {
      console.log(this.Rolevalue)
      if (this.userId !== '') {
        addUserRole({ roleIds: this.Rolevalue.join(), userId: this.userId }).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
        this.userRoledialogVisible = false
      } else {
        this.$message({
          message: '请选择用户',
          type: 'warning',
          duration: 3 * 1000
        })
      }
    },
    // 弹出框点击确定
    userDiaSubmit: function() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.dialogTitle) {
            // 添加
            this.addUser()
          } else {
            // 修改
            this.updateUser(this.userForm, 0)
          }
        } else {
          return false
        }
      })
    },
    // 更新用户信息
    updateUser: function(data, d) {
      delete data.userUpdatedate
      updateUser(data).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 5 * 1000
        })
        if (d === 0) {
          this.resetUser()
        }
      })
    },
    // 更新表单和表格
    resetUser: function() {
      this.getUserList()
      this.$refs.userForm.resetFields()
      this.dialogFormVisible = false
    },
    // 新增用户
    addUser: function() {
      addUser(this.userForm).then(() => {
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.resetUser()
      })
    },
    // 分页事件
    userTableCurrent: function(page) {
      this.getUserParm.pageNum = page
      this.getUserList()
    },
    tableDel: function(userId) {
      this.$confirm('此操作将永久删除该用户及其相关权限与资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser({ id: userId }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.getUserList()
        })
      })
    },
    handleEdit: function(row) {
      if (this.$refs.userForm) {
        this.$refs.userForm.clearValidate()
      }
      this.dialogTitle = false
      this.userForm = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    dropdownAddUser: function() {
      if (this.$refs.userForm) {
        this.$refs.userForm.clearValidate()
      }
      this.dialogTitle = true
      this.userForm = {}
      this.dialogFormVisible = true
    },
    dropdownDelUser: function() {
      const roles = this.$refs.multipleTable.selection
      // const ids = roles.map(v => v.roleId).join()
      if (roles.length > 0) {
        this.$confirm('此操作将永久删除该用户及其相关权限与资源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const userIds = roles.map(v => v.userId)
          console.log(userIds)
          delUser({ id: userIds.join() }).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.getUserList()
          })
        })
      } else {
        this.$message({
          message: '请选择用户',
          type: 'warning',
          duration: 3 * 1000
        })
      }
    },
    onSubmit: function() {
      this.getUserList()
    },
    LogoutSwitchChange: function(d) {
      const parm = {
        userId: d.userId,
        userIslogout: d.userIslogout
      }
      console.log(parm)
      this.updateUser(parm, 1)
    },
    sealSwitchChange: function(d) {
      const parm = {
        userId: d.userId,
        userIsseal: d.userIsseal
      }
      console.log(parm)
      this.updateUser(parm, 1)
    },
    // 点击分配角色按钮
    assignationRole: function(userId) {
      this.userRoledialogVisible = true
      this.userId = userId
      getUserRole({ id: userId }).then((res) => {
        this.RoleData = res.data.roles
        this.Rolevalue = res.data.userRoleIds
      })
    },
    onReset: function() {
      this.getUserParm = {
        account: '',
        userName: '',
        phone: '',
        email: '',
        pageNum: 1,
        pageSize: 10,
        pageTotal: 0
      }
    },
    // 时间格式化
    dateFormat(row, column, cellValue, index) {
      var date = row[column.property]
      if (date === undefined) { return '' }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    formatString: function(row, column, cellValue) {
      if (cellValue === '-1' || cellValue === -1) {
        return '--'
      } else {
        return cellValue
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    background-color: #f3f3f3;
  }
  .pagination-padding{
    padding-top: 15px;
  }
  .margin-left{
    margin-left: 10px;
  }
  .app-content{
    border-radius: 4px;
    background-color: white;
  }
  .content-padding{
    padding: 10px;
  }
</style>

