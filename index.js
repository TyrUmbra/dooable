import DOMHandler from "./dom-handler.js";
import LoginPage from "./src/pages/login-page.js";
import HomePage from "./src/pages/home-page.js";
import { tokenKey } from "./config.js";

async function init(){
    try {
        const token = sessionStorage.getItem(tokenKey)
        if(!token) throw new Error();

        DOMHandler.load(HomePage)
    } catch (error) {
        sessionStorage.removeItem(tokenKey)
        DOMHandler.load(LoginPage)
    }
}

init();