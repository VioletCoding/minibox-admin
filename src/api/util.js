//检查有没有登陆者的id
function getLoginUserId() {
    let local = localStorage.getItem("userId");
    let session = sessionStorage.getItem("userId");
    if (local != "" || local != null || local != undefined) return local;
    if (session != "" || session != null || session != undefined) return session;
}

//检查有没有登陆者的token
function getLoginUserToken() {
    let local = localStorage.getItem("accessToken");
    let session = sessionStorage.getItem("accessToken");
    if (local != "" || local != null || local != undefined) return local;
    if (session != "" || session != null || session != undefined) return session;
}

export default {
    getLoginUserId,
    getLoginUserToken
}