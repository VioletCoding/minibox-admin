//检查有没有登陆者的id
function isLoginUserIdExist() {
    let local = localStorage.getItem("userId");
    let session = sessionStorage.getItem("userId");
    if (local != "" || local != null || local != undefined)
        return true;
    if (session != "" || session != null || session != undefined)
        return true;
    else
        return false;
}

//获取登陆者id
function getLoginUserId() {
    let local = localStorage.getItem("userId");
    let session = sessionStorage.getItem("userId");
    if (local != "" || local != null || local != undefined)
        return local;
    if (session != "" || session != null || session != undefined)
        return session;
    else
        return null;
}

//检查有没有登陆者的token
function isLoginUserTokenExist() {
    let local = localStorage.getItem("accessToken");
    let session = sessionStorage.getItem("accessToken");
    if (local != "" || local != null || local != undefined)
        return true;
    if (session != "" || session != null || session != undefined)
        return true;
    else
        return false;
}

//获取登陆者的token
function getLoginUserToken() {
    let local = localStorage.getItem("accessToken");
    let session = sessionStorage.getItem("accessToken");
    if (local != "" || local != null || local != undefined)
        return local;
    if (session != "" || session != null || session != undefined)
        return session;
    else
        return null;
}

//删除所有用户认证
function removeAllAuthenticate() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userId");
}

//错误信息
function errMessage(err) {
    return err.response.message == null ? "服务器开小差了" : err.response.message;
}

//判空
function isNullOrEmpty(value) {
    return value == null || value == "";
}

//校验正则表达式，传入正则和要校验的值
function checkRegularExpression(regex, value) {
    return new RegExp(regex).test(value);
}

export default {
    isLoginUserIdExist,
    getLoginUserId,
    isLoginUserTokenExist,
    getLoginUserToken,
    removeAllAuthenticate,
    errMessage,
    isNullOrEmpty,
    checkRegularExpression
}