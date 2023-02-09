/*
    let obj = {
        id: 1234,
        search: 'query string parameters in JavaScript',
        token: '123412341341',
    }
    expect => https://anonystick.com?id=1234&search=query%20string%20parameters%20in%20JavaScript&token=123412341341 
*/

const queryString_v1 = Object.keys(params)
  .map((key) => key + "=" + params[key])
  .join("&");

const queryString_v2 = Object.keys(params)
  .map((key) => {
    return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
  })
  .join("&");
