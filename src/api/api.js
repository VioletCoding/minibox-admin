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
//修改菜单信息
const updateMenu = "admin/updateMenu";
//添加菜单
const addMenu = "admin/addMenu";
//删除菜单
const delMenu = "admin/delMenu";
//游戏列表
const gameList = "admin/gameList";
//上传
const upload = "admin/upload";
//更新游戏信息
const updateGameInfo = "admin/updateGameInfo";
//新增游戏
const addGame = "admin/addGame";
//删除游戏
const delGame = "admin/delGame";
//帖子列表
const postList = "admin/postList";
//编辑帖子
const modifyPost = "admin/modifyPost";
//删除帖子
const delPost = "admin/delPost";
//获取版块信息
const getBlock = "admin/getBlock";
//更新版块信息
const updateBlock = "admin/updateBlock";
//删除版块信息
const delBlock = "admin/delBlock";
//添加版块
const addBlock = "admin/addBlock";

export default {
    auth, loginOrReg, logout,
    getMenu, updateMenu, addMenu, delMenu,
    getCount,
    getUserList, deleteUser, updateUser,
    deleteRole, addRole, showRoles,
    gameList, upload, updateGameInfo, addGame, delGame,
    postList, modifyPost, delPost,
    getBlock, updateBlock, delBlock, addBlock
}