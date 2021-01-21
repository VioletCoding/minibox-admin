//登陆前校验接口
const auth = "user/before";
//登陆注册复合接口
const loginOrReg = "user/after";
//登出接口
const logout = "user/logout";

//获取全部菜单，可选参数为id，menuName，不传返回全部
const getMenu = "admin/allMenu";
//获取首页的「帖子数量」「用户数量」「游戏数量」「评论数量」
const getCount = "admin/allCount";
//获取用户列表
const getUserList = "admin/userList";
//更新用户信息
const updateUser = "admin/updateUser";
//删除用户
const deleteUser = "admin/deleteUser";
//删除用户管理员角色
const deleteRole = "admin/deleteRole";
//添加管理员角色
const addRole = "admin/addRole";
//显示角色列表
const showRoles = "admin/showRoles";
//修改父菜单信息
const updateParentMenu = "admin/updateParentMenu";
//修改子菜单信息
const updateSubMenu = "admin/updateSubMenu";
//添加父菜单
const addParentMenu = "admin/addParentMenu";
//添加子菜单
const addSubMenu = "admin/addSubMenu";

export default {
    auth,
    loginOrReg,
    getMenu,
    logout,
    getCount,
    getUserList,
    deleteUser,
    updateUser,
    deleteRole,
    addRole,
    showRoles,
    updateParentMenu,
    updateSubMenu,
    addParentMenu,
    addSubMenu
}