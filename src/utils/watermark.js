var watermark = (function () {
  var zIndex = 99999999999999
  var watermark_hide_ele = 'water_yrd_' + 'V2F0ZXJNYXJrSGlkZQ'
  var watermark_point_ele = 'water_yrd_' + 'cG9pbnRXYXRlcg'
  var watermark_dynamic_ele = 'water_yrd_' + 'ZHluYW1pYw'
  /**
   * 隐藏水印
   * 这种水印可以全屏铺开，不会影响页面内容，截图后通过ps软件特殊处理可以识别具体信息
   */
  var WaterMarkHide = function (options) {
    var eleId = watermark_hide_ele
    var warterMarkEle = document.getElementById(eleId);
    if (!warterMarkEle || !warterMarkEle.children || warterMarkEle.children.length == 0) {
      warterMarkEle && document.body.removeChild(warterMarkEle);
      var defaultSettings = {
        text: "",//水印名称
        watermark_alpha: 0.01,//水印透明度，要求设置在大于等于0.003
        watermark_x: 20,//水印起始位置x轴坐标
        watermark_y: 20,//水印起始位置Y轴坐标
        watermark_rows: 0,//水印行数
        watermark_cols: 0,//水印列数
        watermark_x_space: 100,//水印x轴间隔
        watermark_y_space: 50,//水印y轴间隔
        watermark_font: '微软雅黑',//水印字体
        watermark_color: '#000',//水印字体颜色
        watermark_fontsize: '18px',//水印字体大小
        watermark_width: 150,//水印宽度
        watermark_height: 30,//水印长度
        watermark_angle: 15,//水印倾斜度数
      };
      if (arguments.length === 1 && typeof arguments[0] === "object") {
        var src = arguments[0] || {}
        for (var key in src) {
          if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
            continue
          else if (src[key]) defaultSettings[key] = src[key]
        }
      }
      var tmp_text = defaultSettings.text;
      //这里初略计算下宽度，肯定会有多余部分
      defaultSettings.watermark_width = tmp_text.length * 18;
      var _ele = document.createElement('div')
      _ele.id = eleId
      _ele.style.pointerEvents = "none"
      document.body.appendChild(_ele)

      //初始化水印
      var oTemp = document.createDocumentFragment();

      //宽高直接取全屏，全用fixed布局，防止多余元素生成
      //获取页面最大宽度
      var page_width = window.innerWidth;
      //获取页面最大长度
      var page_height = window.innerHeight;

      //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
      if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
        defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space))
        defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1))
      }
      //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
      if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
        defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space))
        defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1))
      }


      var x, y
      for (var i = 0; i < defaultSettings.watermark_rows; i++) {
        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i
        for (var j = 0; j < defaultSettings.watermark_cols; j++) {
          x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j
          var mask_div = document.createElement('div')
          var oText = document.createTextNode(defaultSettings.text)
          mask_div.appendChild(oText)
          mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)"
          mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)"
          mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)"
          mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)"
          mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)"
          mask_div.style.visibility = ""
          mask_div.style.position = "fixed"
          //选不中
          mask_div.style.left = x + 'px'
          mask_div.style.top = y + 'px'
          mask_div.style.overflow = "hidden"
          mask_div.style.zIndex = zIndex + ''
          mask_div.style.pointerEvents = "none"
          //mask_div.style.border="solid #eee 1px"
          mask_div.style.opacity = defaultSettings.watermark_alpha
          mask_div.style.fontSize = defaultSettings.watermark_fontsize
          mask_div.style.fontFamily = defaultSettings.watermark_font
          mask_div.style.color = defaultSettings.watermark_color
          mask_div.style.textAlign = "center"
          mask_div.style.width = defaultSettings.watermark_width + 'px'
          mask_div.style.height = defaultSettings.watermark_height + 'px'
          mask_div.style.lineHeight = defaultSettings.watermark_height + 'px'
          mask_div.style.display = "block"

          mask_div.style.padding = 0
          mask_div.style.margin = 0
          //设置水印相关属性end
          //附加到文档碎片中
          oTemp.appendChild(mask_div)
        }
      }
      var tmp_ele = document.getElementById(eleId)
      tmp_ele.appendChild(oTemp)
    }
  }
  /**
   * 点阵水印
   * 这种水印跟二维码有点类似，不过这种水印相比较增加了破解难度
   */
  var WaterMarkPoint = function (options) {
    /**
     * 0123456789abcdefghijklmnopqrstuvwxyz@_.-, 对应的二进制转成十进制即代表当前字符的位置
     * 如：000001->十进制1->对应字符串0
     * 111111   起点
     * 000000   错误
     * 000001   数字0
     * 000010   数字1
     * ....
     * 001010   数字9
     * 001011   数字a
     * 001100   数字b
     * ...
     * 100100   数字z
     */

    //    String.fromCharCode(97)
    //    'a'.charCodeAt

    var startBit = ['1', '1', '1', '1', '1', '1'], errorBit = ['0', '0', '0', '0', '0', '0'];
    var allBits = (function () {
      var all_bit = '0123456789abcdefghijklmnopqrstuvwxyz@_.-,', all_bit_arr = all_bit.split(''), result = {};
      for (var i = 0; i < all_bit_arr.length; i++) {
        var tmp_key = i + 1, tmp_binary = (Array(6).join(0) + tmp_key.toString(2)).slice(-6);
        result[all_bit_arr[i]] = tmp_binary.split('');
      }
      return result;
    })();


    // function arrToInt(arr){
    //
    // }

    function getBits(num) {
      return allBits[num] || errorBit;
      //       return num != 0 ? num != 1 ? num != 2 ? num != 3 ? num != 4 ? num != 5 ? num != 6 ? num != 7 ? num != 8 ? num != 9
      //         ? [0, 0, 0, 0] : [1, 0, 1, 0] : [1, 0, 0, 1] : [1, 0, 0, 0] : [0, 1, 1, 1] : [0, 1, 1, 0] : [0, 1, 0, 1] : [0, 1, 0, 0] : [0, 0, 1, 1] : [0, 0, 1, 0] : [0, 0, 0, 1]
    }

    function getPoints(bits, radios, margin) {
      var points = []
      for (var i = 0; i < bits.length; i++) {
        var tmpDiv = document.createElement('div')
        tmpDiv.style.padding = radios + 'px'
        tmpDiv.style.margin = margin + 'px'
        tmpDiv.style.background = bits[i] === '0' ? "#fff" : "#000"
        tmpDiv.style.borderRadius = '100%'// bits[i] === '0' ? '100%' : '0'
        tmpDiv.style.borderColor = '#fff'//bits[i] === '0'?'#000':'#fff'
        tmpDiv.style.borderStyle = 'solid'
        tmpDiv.style.borderWidth = '1px'// bits[i] === '0'?'1px':'0'
        tmpDiv.style.display = "inline-block"
        tmpDiv.style.opacity = .1
        points.push(tmpDiv)
      }
      return points
    }

    var info = (options.text || '').toLowerCase();
    var perRadios = options.radios || 4,//每个点的宽高
      perPointMargin = options.margin || 6,//每个点的边距
      countCol = options.col || 6,//行数
      countRow = options.row || 6;//列数
    (function () {
      var chats = []
      for (var i = 0; i < info.length; i++) {
        chats.push(info[i] + '')
      }
      var rootEleId = watermark_point_ele, rootEle = document.getElementById(rootEleId)
      var tmpPointRootEle = document.getElementById(rootEleId)

      //6行6列表示信息加密，总共可以加密36个数字
      var
        maxLen = countCol * countRow,//能容纳的最大数字个数
        perNumBit = startBit.length,//数字用的位数
        perPointSize = (perRadios + perPointMargin) * 2 + 2,//每个点占的宽高
        perNumWidth = perNumBit * perPointSize,//每个数字占用的总宽度
        perNumHeight = perPointSize//每个数字占用的总高度

      var needRefresh = !tmpPointRootEle || !tmpPointRootEle.children || (tmpPointRootEle.children.length == (chats.length > maxLen ? maxLen : chats.length))

      if (needRefresh) {
        tmpPointRootEle && document.body.removeChild(tmpPointRootEle);
        rootEle = document.createElement('div')
        rootEle.id = rootEleId
        rootEle.style.position = "fixed"
        rootEle.style.left = "50%"
        rootEle.style.top = "50%"
        rootEle.style.padding = 0
        rootEle.style.marginRight = 0
        rootEle.style.marginBottom = 0
        rootEle.style.pointerEvents = "none"
        rootEle.style.marginLeft = "-" + (perNumWidth * countCol / 2) + "px"
        rootEle.style.marginTop = "-" + (perNumHeight * countRow / 2) + "px"
        rootEle.style.zIndex = (zIndex + 1) + ''
        document.body.appendChild(rootEle)

        for (var i = 0; i <= chats.length && i <= maxLen; i++) {
          var row = Math.floor(i / countRow)//第几行
          var col = i % countRow//第几列

          var x = perNumWidth * col//一个字符的起点x坐标
          var y = perNumHeight * row//一个数字的起点y坐标
          var tmpDiv = document.createElement('div')
          tmpDiv.style.width = perNumWidth + "px"
          tmpDiv.style.height = perNumHeight + "px"
          tmpDiv.style.position = 'absolute'
          tmpDiv.style.left = x + "px"
          tmpDiv.style.top = y + "px"
          tmpDiv.style.padding = 0
          tmpDiv.style.margin = 0
          rootEle.appendChild(tmpDiv)
          var bits;
          if (i == 0) {
            bits = startBit
          }
          else {
            bits = getBits(chats[i - 1])
          }
          var bitsEles = getPoints(bits, perRadios, perPointMargin)
          for (var j = 0; j < bitsEles.length; j++) {
            tmpDiv.appendChild(bitsEles[j])
          }
        }
      }
    })();
  }

  /**
   * 动态水印
   * @param options
   * @constructor
   */
  var WaterMarkDynamic = function (options, interval_arr) {
    var eleId = watermark_dynamic_ele
    var waterDynamicEle = document.getElementById(watermark_dynamic_ele)

    //位置
    var cur_x = options.x || 0, cur_y = options.y || 0,
      _target = undefined, speed_x = options.speed_x || 1
      , speed_y = options.speed_y || 1, speed = options.speed || 10
    //内容
    var tmp_text = options.text;
    //获取页面最大宽度
    var page_width = window.innerWidth;
    //获取页面最大长度
    var page_height = window.innerHeight;

    if (!waterDynamicEle || !waterDynamicEle.children || waterDynamicEle.children.length != 1) {
      waterDynamicEle && document.body.removeChild(waterDynamicEle);

      var _ele = document.createElement('div')
      _ele.id = eleId
      _ele.style.pointerEvents = "none"
      document.body.appendChild(_ele)

      _target = document.createElement('div')
      var oText = document.createTextNode(tmp_text)
      _target.appendChild(oText)
      _ele.appendChild(_target)
      _target.style.position = 'fixed'
      _target.style.fontSize = '24px'
      _target.style.lineHeight = '30px'
      _target.style.padding = 0
      _target.style.margin = 0
      _target.style.background = "rgba(255,255,255,1)"
      _target.style.color = '#000'
      _target.style.zIndex = zIndex + 2
    }
    else {
      _target = waterDynamicEle.children[0]
    }
    // interval_arr[3]&&clearInterval(interval_arr[3])
    interval_arr[3] = setInterval(function () {
      let cur_width = _target.offsetWidth
      let cur_height = _target.offsetHeight
      if (speed_x > 0) {
        //右走
        if (cur_x + cur_width + speed > page_width) {
          //马上撞到最右边了
          cur_x = page_width - cur_width
          speed_x = -1
        }
        else {
          cur_x = cur_x + speed
        }
      }
      else {
        //左走
        if (cur_x - speed < 0) {
          cur_x = 0
          speed_x = 1
        }
        else {
          cur_x = cur_x - speed
        }
      }
      if (speed_y > 0) {
        //下走
        if (cur_y + cur_height + speed > page_height) {
          //马上撞到最右边了
          cur_y = page_height - cur_height
          speed_y = -1
        }
        else {
          cur_y = cur_y + speed
        }
      }
      else {
        //上走
        if (cur_y - speed < 0) {
          cur_y = 0
          speed_y = 1
        }
        else {
          cur_y = cur_y - speed
        }
      }
      _target.style.top = cur_y
      _target.style.left = cur_x
    }, 100)

  }

  /**
   * 水印初始化
   */
  var watermark = {}
  var interval_arr = [undefined, undefined, undefined, undefined, undefined]
  var initByType = function (type, options) {
    //统一加上计时器吧，防止别人debug模式直接删除
    if (type == 1 || type == 3 || type == 4) {
      interval_arr[type - 1] && clearInterval(interval_arr[type - 1])
    }
    if (type == 1) {
      //隐藏水印
      interval_arr[type - 1] = setInterval(function () {
        WaterMarkHide(options)
      }, 500)
    }
    else if (type == 3) {
      //点阵水印
      interval_arr[type - 1] = setInterval(function () {
        WaterMarkPoint(options)
      }, 500)
    }
    else if (type == 4) {
      //动态水印
      WaterMarkDynamic(options, interval_arr)
    }
  }

  //外部接口
  //隐藏水印
  watermark.hideMark = function (text, options) {
    if (text) {
      options = options || {}
      options.text = text
      initByType(1, options)
    }
  }
  //点阵水印
  watermark.pointMark = function (text, options) {
    if (text) {
      options = options || {}
      options.text = text
      initByType(3, options)
    }
  }
  //动态水印
  watermark.dynamicMark = function (text, options) {
    if (text) {
      options = options || {}
      options.text = text
      initByType(4, options)
    }
  }

  //初始化水印
  watermark.init = function (text) {
    watermark.hideMark(text)
    // watermark.pointMark(text)
    // watermark.dynamicMark(text)
    //暂时加一个隐藏水印，别的要加直接在这初始化
  }
  //就露在外面吧，当隐藏接口，单页应用如果需要控制只有某些页面需要水印会用到
  watermark.securityClear = function () {
    for (var i = 0; i < interval_arr.length; i++) {
      if (interval_arr[i]) {
        clearInterval(interval_arr[i])
      }
    }
    var $watermark_hide_ele = document.getElementById(watermark_hide_ele)
    var $watermark_point_ele = document.getElementById(watermark_point_ele)
    var $watermark_dynamic_ele = document.getElementById(watermark_dynamic_ele)
    $watermark_hide_ele && document.body.removeChild($watermark_hide_ele)
    $watermark_point_ele && document.body.removeChild($watermark_point_ele)
    $watermark_dynamic_ele && document.body.removeChild($watermark_dynamic_ele)
  }
  return watermark;
})()

export default watermark