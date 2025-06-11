
  document.getElementById('pswdBtn').addEventListener('click', () => {
  const pwd = document.getElementById('password')
  if (pwd.type === 'password') {
    pwd.type = 'text'
    pswdBtn.textContent = 'Hide Password'
  } else {
    pwd.type = 'password'
    pswdBtn.textContent = 'Show Password'
  }
})




