//登陆前校验接口
const auth = "user/before";
//登陆注册复合接口
const loginOrReg = "user/after";

//获取全部菜单，可选参数为id，menuName，不传返回全部
const getMenu = "menu/all";

export default {
    auth,
    loginOrReg,
    getMenu
}