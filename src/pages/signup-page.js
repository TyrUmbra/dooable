import { input } from "../components/input.js";
import DOMHandler from "../../dom-handler.js";
import LoginPage from "./login-page.js";
import { createUser } from "../services/user-service.js";

function render() {
    return `
    <main class="section">
        <section class="conteiner">
            <h1 class="heading heading--lg text-center mb-4">sign up</h1>
            <form class="flex flex-column gap-4 mb-4 js-signup-form">
                ${input({
                    id: "email",
                    label: "email",
                    placeholder: "john@example.com",
                    type: "email",
                    required: true,
                    name: "email",
                })}
                ${input({
                    label: "password",
                    id: "password",
                    name: "password",
                    placeholder: "********",
                    type: "password",
                    required: true,
                })}
            
                <button type="submit" class="button button--primary">SIGN UP</button>
                <a href="#" class="block text-center js-login-link">Login</a>
            </form>
        </section>
    </main>
  `;
}


function listenSubmitSignUp() {
    const form = document.querySelector(".js-signup-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const { email, password } = event.target;
  
      const credentials = {
        email: email.value,
        password: password.value
      };

      const user = await createUser(credentials);
      DOMHandler.load(LoginPage);
    });
}
  
function listenLogin() {
    const form = document.querySelector(".js-login-link");

    form.addEventListener("click", async (event) => {
      event.preventDefault();

      DOMHandler.load(LoginPage);
    });
}

const SignUpPage = {
    toString() {
        return render();
    },
    addListeners() {
        listenSubmitSignUp();
        listenLogin();
    }
}

export default SignUpPage