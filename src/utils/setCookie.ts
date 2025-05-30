const setCookie = (cookieKey: string, value: string, path: string = "/") =>
    (document.cookie = `${cookieKey}=${value}; PATH=${path}`);
  
  export default setCookie;