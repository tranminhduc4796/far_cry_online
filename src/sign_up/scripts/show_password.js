let passwordField = document.getElementById("window-main__password").getElementsByTagName('input');
let passwordIcon = document.getElementById('window-main__show-password');

passwordIcon.addEventListener('click', () => {
    if (passwordField[0].type === "text") {
        Array.prototype.forEach.call(passwordField,(field, index) => {
            field.type = "password";
            passwordIcon.className = "far fa-eye-slash"
        })
    } else {
        Array.prototype.forEach.call(passwordField,(field, index) => {
            field.type = "text";
            passwordIcon.className = "far fa-eye"
        })
    }
});