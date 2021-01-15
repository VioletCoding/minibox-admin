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

export default {
    auth,
    loginOrReg,
    getMenu,
    logout,
    getCount
}