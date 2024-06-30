export const setToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem("token", token);
    }
};

export const setUser = (user) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(user));
    }
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("token");
    }
    return null;
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem("user"));
    }
    return null;
};

function parseJwt(token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        return {};
    }
}

export const isLogined = () => {
    const token = getToken();

    if (token === null || token === undefined || token === "") {
        return false;
    }

    const obj = parseJwt(token);
    const exp = obj.exp ? obj.exp : 0;
    return (Date.now() < +(exp * 1000));
};
