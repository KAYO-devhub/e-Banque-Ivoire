export function checkAuth(forceRedirect = true) {
  const token = localStorage.getItem('userToken');
  const user = JSON.parse(localStorage.getItem('userData'));

  if (forceRedirect && (!token || !user)) {
    window.location.href = 'login.html';
    return { user: null, token: null };
  }
  return { user, token };
}