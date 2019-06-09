let errorLog = document.getElementById('window-main__error-log');

async function signUp(userName, password, email) {
    const rawResponse = await fetch('http://localhost:8000/users', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user: {user_name: userName, password: password, email: email, email_verified: false, token: ""},
        action: "sign up"
    })
  });
  const content = await rawResponse.json();
  if (!content.status) {
    errorLog.innerHTML = content.message;
  }
  return content
}

module.exports = {
  signUp
};