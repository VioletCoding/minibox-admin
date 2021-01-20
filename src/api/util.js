//检查有没有登陆者的id
function isLoginUserIdExist() {
    let local = localStorage.getItem("userId");
    let session = sessionStorage.getItem("userId");
    if (local != "" || local != null || local != undefined) return true;
    if (session != "" || session != null || session != undefined) return true;
    return false;
}

//获取登陆者id
function getLoginUserId() {
    let local = localStorage.getItem("userId");
    let session = sessionStorage.getItem("userId");
    if (local != "" || local != null || local != undefined) return local;
    if (session != "" || session != null || session != undefined) return session;
    return null;
}

//检查有没有登陆者的token
function isLoginUserTokenExist() {
    let local = localStorage.getItem("accessToken");
    let session = sessionStorage.getItem("accessToken");
    if (local != "" || local != null || local != undefined) return true;
    if (session != "" || session != null || session != undefined) return true;
    return false;
}

//获取登陆者的token
function getLoginUserToken() {
    let local = localStorage.getItem("accessToken");
    let session = sessionStorage.getItem("accessToken");
    if (local != "" || local != null || local != undefined) return local;
    if (session != "" || session != null || session != undefined) return session;
    return null;
}
//删除所有用户认证
function removeAllAuthenticate(){
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userId");
}

export default {
    isLoginUserIdExist,
    getLoginUserId,
    isLoginUserTokenExist,
    getLoginUserToken,
    removeAllAuthenticate
}