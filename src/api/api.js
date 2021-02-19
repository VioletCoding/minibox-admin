//-----------------校验---------------------
//登陆前校验接口
const auth = "authApi/authCode";
//登陆注册复合接口
const loginOrReg = "authApi/auth";
//密码登陆
const passwordLogin = "authApi/passwordLogin";
//登出接口
const logout = "authApi/logout";
//--------------------菜单---------------------------
const menuList = "menuApi/find";
//增加菜单
const menuAdd = "menuApi/add";
//修改菜单
const menuModify = "menuApi/modify";
//删除菜单
const menuDelete = "menuApi/delete";
//----------------------用户-------------------------
//用户个人信息
const userInfo = "userApi/userInfo";
//修改用户信息
const userModify = "userApi/userModify";
//用户列表
const userList = "userApi/withRoles";
//删除用户
const userDelete = "userApi/delete";
//增加用户管理员角色
const userAddAdmin = "userApi/addAdmin";
//删除用户管理员角色
const deleteAdmin = "userApi/deleteAdmin";
//更新密码
const userPwdModify = "userApi/userPwdModify";
//--------------------公用---------------------------
//图片上传接口
const upload = "publicApi/upload";
//echarts 数据接口
const echarts = "publicApi/echarts";
//----------------------帖子---------------------
//帖子列表
const postList = "postApi/list";
//帖子删除
const postDel = "postApi/del";
//帖子修改
const postModify = "postApi/modify";
//----------------------版块---------------------
//版块列表
const blockList = "blockApi/list";
//新增版块
const blockAdd = "blockApi/add";
//修改版块
const blockModify = "blockApi/modify";
//删除版块
const blockDelete = "blockApi/delete";
//---------------------游戏--------------------------
//游戏列表
const gameList = "gameApi/list";
//游戏添加
const gameAdd = "gameApi/add";
//游戏修改
const gameModify = "gameApi/modify";
//游戏删除
const gameDelete = "gameApi/delete";
//---------------------标签--------------------------
const tagSave = "tagApi/save";
const tagRemove = "tagApi/remove";
const tagList = "tagApi/list";
//---------------------游戏图片--------------------------
const photoSave = "photoApi/save";
const photoRemove = "photoApi/remove";
const photoList = "photoApi/list";


export default {
    auth, loginOrReg, passwordLogin, logout,
    menuList, menuAdd, menuModify, menuDelete,
    userInfo, userModify, userList, userDelete, deleteAdmin, userAddAdmin, userPwdModify,
    upload, echarts,
    postList, postDel, postModify,
    blockList, blockAdd, blockModify, blockDelete,
    gameList, gameAdd, gameModify, gameDelete,
    tagSave, tagRemove, tagList,
    photoSave, photoRemove, photoList
}