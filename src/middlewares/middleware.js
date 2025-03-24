import { jwtDecode } from "jwt-decode";

const checkTokenExpiration = () => {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const token = localStorage.getItem('token');
    if (!token || typeof token !== 'string') {
      reject('Token tidak valid');
      return;
    }
    const decoded = jwtDecode(token);
    const expirationTimeMillis = decoded.exp * 1000;
    if (now >= expirationTimeMillis) {
      localStorage.removeItem('token');
      resolve('Token kadaluwarsa');
    } else {
      resolve('Token masih berlaku');
    }
  })
}

const forbiddenAccess = () => {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const token = localStorage.getItem('token');
    if (!token || typeof token !== 'string') {
      reject('Dilarang masuk!');
      return;
    }
    const decoded = jwtDecode(token);
    const expirationTimeMillis = decoded.exp * 1000;
    if (now < expirationTimeMillis) {
      resolve('Token kadaluwarsa');
    } else {
      resolve('Token masih berlaku');
    }
  })
}

export { checkTokenExpiration, forbiddenAccess };