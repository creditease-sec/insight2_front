export function formatDate(date, fmt) {
  //时间戳 -> 字符串

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

export function trans_params(form_data) {
  // 参数转换 axios转换为传统Post formData

  let params = new URLSearchParams();
  for (let [key, value] of Object.entries(form_data)) {

    if (typeof value == "object" && value != null) {
      for (let val of Object.values(value)) {
        params.append(key, val);
      }
    } else if (value == null) {
      console.log(key + "-----" + value);
    } else {
      params.append(key, value);
    }
  }
  return params;
}

export function padLeftZero(str) {
  // 左边0补全
  return ("00" + str).substr(str.length);
}

export function randomString(len) {
  //随机字符串
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


export function getDateDiff(diffValue) {
  //日期差异

  var minute = 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var year = month * 12;

  if (diffValue < 0) { return "刚刚"; }
  if (diffValue == 0) {return "很久很久以前";}
  var yearC = diffValue / year;
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  let result; ''

  if (yearC >= 1) {
    result = "" + parseInt(yearC) + "年前";
  }
  else if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  }
  else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  }
  else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}

export function getDateDiff_timestamp(str_datetime) {
  let dateTimeStamp = "";

  if (typeof (str_datetime) == "number") {
    dateTimeStamp = str_datetime * 1000;
  } else {
    dateTimeStamp = Date.parse(str_datetime)
  }


  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var year = month * 12;


  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;

  if (diffValue < 0) { return "刚刚"; }
  if (dateTimeStamp == 0) {return "很久之前";}
  var yearC = diffValue / year;
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  let result; ''

  if (yearC >= 1) {
    result = "" + parseInt(yearC) + "年前";
  }
  else if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  }
  else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  }
  else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}


export function in_array(search, array) {

  for (var i in array) {
    if (array[i] == search) {
      return true;
    }
  }
  return false;

}


export function getStaticColors(NO) {
  switch (NO) {
    case 10: return "#269926"
    case 20: return "#1D7373"
    case 30: return "#BF7130"
    case 40: return "#BF3030"
    case 50: return "#992667"
    case 60: return "#FF9640"
    case 70: return "#FF4040"
  }
}


export function getRankColors(NO) {
  if (NO < 6) {
    return "#3e9b87f3"
  } else if (NO < 11) {
    return "#409EFF"
  } else if (NO < 16) {
    return "#f56c6c"
  } else if (NO < 21) {
    return "#e6a23c"
  } else {
    return "#606266"
  }

  switch (NO) {
    case 10: return "#269926"
    case 20: return "#1D7373"
    case 30: return "#BF7130"
    case 40: return "#BF3030"
    case 50: return "#992667"
    case 60: return "#FF9640"
    case 70: return "#FF4040"
  }
}

const IS_DEBUG = true;

export function console_log(...args) {

  let current_router = null
  // if (that != undefined){
  //   current_router = that.$route.query
  //   console.log(`ROUTE : ${current_router}`)
  // }

  const show_args = args.slice(0, arguments.length - 1).map(x => {
    if (typeof x == "object") {
      return JSON.stringify(x)
    } else {
      return x
    }
  });

  if (IS_DEBUG) {
    // console.log(window.location.href)
    if (args.length < 2) {
      console.log(`APP: 未指定 MSG: ${show_args}`)
    } else {
      console.log(`:::::: APP: ${args[args.length - 1]}  MSG: ${show_args}  ::::::`)
    }
  }

}


String.prototype.startWith = function (str) {
  var reg = new RegExp("^" + str);
  return reg.test(this);
}

String.prototype.contains = function (ss) {
  return this.indexOf(ss) >= 0;
}

String.prototype.containsList = function (ss) {
  if (ss == undefined || ss.constructor !== Array) {
    return false
  }
  for (let idx = 0; idx < ss.length; idx++) {

    if (this.indexOf(ss[idx]) >= 0) {
      return true
    }
  }
  return false;
}

export function getCookie(NameOfCookie) {
  if (document.cookie.length > 0) {
    let begin = document.cookie.indexOf(NameOfCookie + "=");
    if (begin !== -1) {
      begin += NameOfCookie.length + 1;
      let end = document.cookie.indexOf(";", begin);
      if (end === -1) end = document.cookie.length;
      return unescape(document.cookie.substring(begin, end));
    }
  }
  return null;
}

export function desensitive() {
  let isDesensitive  = JSON.parse(localStorage.getItem("__IS_DESENSITIVE__"))
   if(isDesensitive){
    let arr = document.querySelectorAll(".insight_sensitive");
   
    for (let t in arr) {
      if (arr[t] && typeof arr[t] == "object") {
 
      //   let temp_str = "";
      //   for(let x= 0;x<  arr[t].innerHTML.length;x++  ){
      //     if(x%2 == 0){
      //       temp_str  +="*"
      //     }else{
      //       temp_str  += arr[t].innerHTML[x]
      //     }
      //   }
      //   arr[t].innerHTML = temp_str;
      // }

      let temp_str = "";
      for(let x= 0;x<  arr[t].innerHTML.length;x++  ){
          temp_str  +="*"
      }
      arr[t].innerHTML = temp_str;
    }
    }
   }else{
    //  console.log("未开启前端脱敏")
   }

}