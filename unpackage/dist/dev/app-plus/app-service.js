if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_SHOW = "onShow";
  const ON_HIDE = "onHide";
  const ON_LAUNCH = "onLaunch";
  const ON_LOAD = "onLoad";
  const ON_READY = "onReady";
  const ON_UNLOAD = "onUnload";
  const ON_REACH_BOTTOM = "onReachBottom";
  const ON_SHARE_TIMELINE = "onShareTimeline";
  const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
  function requireNativePlugin(name) {
    return weex.requireModule(name);
  }
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createLifeCycleHook(
    ON_SHOW,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onHide = /* @__PURE__ */ createLifeCycleHook(
    ON_HIDE,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onLaunch = /* @__PURE__ */ createLifeCycleHook(
    ON_LAUNCH,
    1
    /* HookFlags.APP */
  );
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
    2
    /* HookFlags.PAGE */
  );
  const onReady = /* @__PURE__ */ createLifeCycleHook(
    ON_READY,
    2
    /* HookFlags.PAGE */
  );
  const onUnload = /* @__PURE__ */ createLifeCycleHook(
    ON_UNLOAD,
    2
    /* HookFlags.PAGE */
  );
  const onReachBottom = /* @__PURE__ */ createLifeCycleHook(
    ON_REACH_BOTTOM,
    2
    /* HookFlags.PAGE */
  );
  const onShareTimeline = /* @__PURE__ */ createLifeCycleHook(
    ON_SHARE_TIMELINE,
    2
    /* HookFlags.PAGE */
  );
  const onShareAppMessage = /* @__PURE__ */ createLifeCycleHook(
    ON_SHARE_APP_MESSAGE,
    2
    /* HookFlags.PAGE */
  );
  const pages = [
    {
      path: "pages/index/index",
      style: {
        navigationStyle: "custom",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/previewList/previewList",
      style: {
        navigationStyle: "custom",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/chatList/chatList",
      style: {
        navigationStyle: "custom",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/profile/profile",
      style: {
        navigationStyle: "custom",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/Homepage/Homepage",
      style: {
        navigationBarTitleText: "工人简介上传",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/EditProfile/EditProfile",
      style: {
        navigationBarTitleText: "编辑个人信息",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/login/login",
      style: {
        navigationBarTitleText: "登录/注册",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/terms/terms",
      style: {
        navigationBarTitleText: "服务条款",
        navigationStyle: "custom",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/HomepageDetail/HomepageDetail",
      style: {
        navigationBarTitleText: "主页",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/chatDetail/chatDetail",
      style: {
        navigationBarTitleText: "聊天页",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/applyTechnician/applyTechnician",
      style: {
        navigationBarTitleText: "申请认证",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/admin/ReviewApplications/ReviewApplications",
      style: {
        navigationBarTitleText: "审核申请",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/appointmentForm/appointmentForm",
      style: {
        navigationBarTitleText: "预约",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/worker-schedule/worker-schedule",
      style: {
        navigationBarTitleText: "预约记录",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/user-schedule/user-schedule",
      style: {
        navigationBarTitleText: "我的预约",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/newsDetail/newsDetail",
      style: {
        navigationBarTitleText: "新闻",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/allComments/allComments",
      style: {
        navigationBarTitleText: "用户评价",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/Payouts/Payouts",
      style: {
        navigationBarTitleText: "提现",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    },
    {
      path: "pages/admin/ReviewWithdrawals/ReviewWithdrawals",
      style: {
        navigationBarTitleText: "工人提现审核",
        enableShareAppMessage: true,
        enableShareTimeline: true
      }
    }
  ];
  const globalStyle = {
    navigationBarTextStyle: "black",
    navigationBarTitleText: "uni-app",
    navigationBarBackgroundColor: "#F8F8F8",
    backgroundColor: "#F8F8F8"
  };
  const uniIdRouter = {};
  const tabBar = {
    color: "#666666",
    selectedColor: "#007AFF",
    list: [
      {
        text: "首页",
        pagePath: "pages/index/index",
        iconPath: "static/images/home.png",
        selectedIconPath: "static/images/homefill2.png"
      },
      {
        text: "工人",
        pagePath: "pages/previewList/previewList",
        iconPath: "static/images/worker.png",
        selectedIconPath: "static/images/workerfill.png"
      },
      {
        text: "消息",
        pagePath: "pages/chatList/chatList",
        iconPath: "static/images/message.png",
        selectedIconPath: "static/images/messagefill.png"
      },
      {
        text: "我的",
        pagePath: "pages/profile/profile",
        iconPath: "static/images/profile.png",
        selectedIconPath: "static/images/profile2.png"
      }
    ]
  };
  const e = {
    pages,
    globalStyle,
    uniIdRouter,
    tabBar
  };
  var define_process_env_UNI_SECURE_NETWORK_CONFIG_default = [{ provider: "aliyun", spaceId: "mp-1240ebd5-749c-4abc-b593-fd807f0347fb", config: { accessControl: { enable: false, function: {} } } }];
  function t$1(e2) {
    return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
  }
  function n(e2, t2, n2) {
    return e2(n2 = { path: t2, exports: {}, require: function(e3, t3) {
      return function() {
        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
      }(null == t3 && n2.path);
    } }, n2.exports), n2.exports;
  }
  var s = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = n2 || function(e3, t3) {
      var n3 = Object.create || /* @__PURE__ */ function() {
        function e4() {
        }
        return function(t4) {
          var n4;
          return e4.prototype = t4, n4 = new e4(), e4.prototype = null, n4;
        };
      }(), s2 = {}, r2 = s2.lib = {}, i2 = r2.Base = { extend: function(e4) {
        var t4 = n3(this);
        return e4 && t4.mixIn(e4), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
          t4.$super.init.apply(this, arguments);
        }), t4.init.prototype = t4, t4.$super = this, t4;
      }, create: function() {
        var e4 = this.extend();
        return e4.init.apply(e4, arguments), e4;
      }, init: function() {
      }, mixIn: function(e4) {
        for (var t4 in e4)
          e4.hasOwnProperty(t4) && (this[t4] = e4[t4]);
        e4.hasOwnProperty("toString") && (this.toString = e4.toString);
      }, clone: function() {
        return this.init.prototype.extend(this);
      } }, o2 = r2.WordArray = i2.extend({ init: function(e4, n4) {
        e4 = this.words = e4 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e4.length;
      }, toString: function(e4) {
        return (e4 || c2).stringify(this);
      }, concat: function(e4) {
        var t4 = this.words, n4 = e4.words, s3 = this.sigBytes, r3 = e4.sigBytes;
        if (this.clamp(), s3 % 4)
          for (var i3 = 0; i3 < r3; i3++) {
            var o3 = n4[i3 >>> 2] >>> 24 - i3 % 4 * 8 & 255;
            t4[s3 + i3 >>> 2] |= o3 << 24 - (s3 + i3) % 4 * 8;
          }
        else
          for (i3 = 0; i3 < r3; i3 += 4)
            t4[s3 + i3 >>> 2] = n4[i3 >>> 2];
        return this.sigBytes += r3, this;
      }, clamp: function() {
        var t4 = this.words, n4 = this.sigBytes;
        t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e3.ceil(n4 / 4);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4.words = this.words.slice(0), e4;
      }, random: function(t4) {
        for (var n4, s3 = [], r3 = function(t5) {
          var n5 = 987654321, s4 = 4294967295;
          return function() {
            var r4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
            return r4 /= 4294967296, (r4 += 0.5) * (e3.random() > 0.5 ? 1 : -1);
          };
        }, i3 = 0; i3 < t4; i3 += 4) {
          var a3 = r3(4294967296 * (n4 || e3.random()));
          n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
        }
        return new o2.init(s3, t4);
      } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push((i3 >>> 4).toString(16)), s3.push((15 & i3).toString(16));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
          n4[s3 >>> 3] |= parseInt(e4.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
        return new o2.init(n4, t4 / 2);
      } }, u2 = a2.Latin1 = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push(String.fromCharCode(i3));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3++)
          n4[s3 >>> 2] |= (255 & e4.charCodeAt(s3)) << 24 - s3 % 4 * 8;
        return new o2.init(n4, t4);
      } }, h2 = a2.Utf8 = { stringify: function(e4) {
        try {
          return decodeURIComponent(escape(u2.stringify(e4)));
        } catch (e5) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function(e4) {
        return u2.parse(unescape(encodeURIComponent(e4)));
      } }, l2 = r2.BufferedBlockAlgorithm = i2.extend({ reset: function() {
        this._data = new o2.init(), this._nDataBytes = 0;
      }, _append: function(e4) {
        "string" == typeof e4 && (e4 = h2.parse(e4)), this._data.concat(e4), this._nDataBytes += e4.sigBytes;
      }, _process: function(t4) {
        var n4 = this._data, s3 = n4.words, r3 = n4.sigBytes, i3 = this.blockSize, a3 = r3 / (4 * i3), c3 = (a3 = t4 ? e3.ceil(a3) : e3.max((0 | a3) - this._minBufferSize, 0)) * i3, u3 = e3.min(4 * c3, r3);
        if (c3) {
          for (var h3 = 0; h3 < c3; h3 += i3)
            this._doProcessBlock(s3, h3);
          var l3 = s3.splice(0, c3);
          n4.sigBytes -= u3;
        }
        return new o2.init(l3, u3);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._data = this._data.clone(), e4;
      }, _minBufferSize: 0 });
      r2.Hasher = l2.extend({ cfg: i2.extend(), init: function(e4) {
        this.cfg = this.cfg.extend(e4), this.reset();
      }, reset: function() {
        l2.reset.call(this), this._doReset();
      }, update: function(e4) {
        return this._append(e4), this._process(), this;
      }, finalize: function(e4) {
        return e4 && this._append(e4), this._doFinalize();
      }, blockSize: 16, _createHelper: function(e4) {
        return function(t4, n4) {
          return new e4.init(n4).finalize(t4);
        };
      }, _createHmacHelper: function(e4) {
        return function(t4, n4) {
          return new d2.HMAC.init(e4, n4).finalize(t4);
        };
      } });
      var d2 = s2.algo = {};
      return s2;
    }(Math), n2);
  }), r = s, i = (n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [];
      !function() {
        for (var t4 = 0; t4 < 64; t4++)
          a2[t4] = 4294967296 * e3.abs(e3.sin(t4 + 1)) | 0;
      }();
      var c2 = o2.MD5 = i2.extend({ _doReset: function() {
        this._hash = new r2.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = 0; n3 < 16; n3++) {
          var s3 = t4 + n3, r3 = e4[s3];
          e4[s3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
        }
        var i3 = this._hash.words, o3 = e4[t4 + 0], c3 = e4[t4 + 1], p2 = e4[t4 + 2], f2 = e4[t4 + 3], g2 = e4[t4 + 4], m2 = e4[t4 + 5], y2 = e4[t4 + 6], _2 = e4[t4 + 7], w2 = e4[t4 + 8], I2 = e4[t4 + 9], v2 = e4[t4 + 10], S2 = e4[t4 + 11], T2 = e4[t4 + 12], b2 = e4[t4 + 13], E2 = e4[t4 + 14], k2 = e4[t4 + 15], A2 = i3[0], P2 = i3[1], C2 = i3[2], O2 = i3[3];
        A2 = u2(A2, P2, C2, O2, o3, 7, a2[0]), O2 = u2(O2, A2, P2, C2, c3, 12, a2[1]), C2 = u2(C2, O2, A2, P2, p2, 17, a2[2]), P2 = u2(P2, C2, O2, A2, f2, 22, a2[3]), A2 = u2(A2, P2, C2, O2, g2, 7, a2[4]), O2 = u2(O2, A2, P2, C2, m2, 12, a2[5]), C2 = u2(C2, O2, A2, P2, y2, 17, a2[6]), P2 = u2(P2, C2, O2, A2, _2, 22, a2[7]), A2 = u2(A2, P2, C2, O2, w2, 7, a2[8]), O2 = u2(O2, A2, P2, C2, I2, 12, a2[9]), C2 = u2(C2, O2, A2, P2, v2, 17, a2[10]), P2 = u2(P2, C2, O2, A2, S2, 22, a2[11]), A2 = u2(A2, P2, C2, O2, T2, 7, a2[12]), O2 = u2(O2, A2, P2, C2, b2, 12, a2[13]), C2 = u2(C2, O2, A2, P2, E2, 17, a2[14]), A2 = h2(A2, P2 = u2(P2, C2, O2, A2, k2, 22, a2[15]), C2, O2, c3, 5, a2[16]), O2 = h2(O2, A2, P2, C2, y2, 9, a2[17]), C2 = h2(C2, O2, A2, P2, S2, 14, a2[18]), P2 = h2(P2, C2, O2, A2, o3, 20, a2[19]), A2 = h2(A2, P2, C2, O2, m2, 5, a2[20]), O2 = h2(O2, A2, P2, C2, v2, 9, a2[21]), C2 = h2(C2, O2, A2, P2, k2, 14, a2[22]), P2 = h2(P2, C2, O2, A2, g2, 20, a2[23]), A2 = h2(A2, P2, C2, O2, I2, 5, a2[24]), O2 = h2(O2, A2, P2, C2, E2, 9, a2[25]), C2 = h2(C2, O2, A2, P2, f2, 14, a2[26]), P2 = h2(P2, C2, O2, A2, w2, 20, a2[27]), A2 = h2(A2, P2, C2, O2, b2, 5, a2[28]), O2 = h2(O2, A2, P2, C2, p2, 9, a2[29]), C2 = h2(C2, O2, A2, P2, _2, 14, a2[30]), A2 = l2(A2, P2 = h2(P2, C2, O2, A2, T2, 20, a2[31]), C2, O2, m2, 4, a2[32]), O2 = l2(O2, A2, P2, C2, w2, 11, a2[33]), C2 = l2(C2, O2, A2, P2, S2, 16, a2[34]), P2 = l2(P2, C2, O2, A2, E2, 23, a2[35]), A2 = l2(A2, P2, C2, O2, c3, 4, a2[36]), O2 = l2(O2, A2, P2, C2, g2, 11, a2[37]), C2 = l2(C2, O2, A2, P2, _2, 16, a2[38]), P2 = l2(P2, C2, O2, A2, v2, 23, a2[39]), A2 = l2(A2, P2, C2, O2, b2, 4, a2[40]), O2 = l2(O2, A2, P2, C2, o3, 11, a2[41]), C2 = l2(C2, O2, A2, P2, f2, 16, a2[42]), P2 = l2(P2, C2, O2, A2, y2, 23, a2[43]), A2 = l2(A2, P2, C2, O2, I2, 4, a2[44]), O2 = l2(O2, A2, P2, C2, T2, 11, a2[45]), C2 = l2(C2, O2, A2, P2, k2, 16, a2[46]), A2 = d2(A2, P2 = l2(P2, C2, O2, A2, p2, 23, a2[47]), C2, O2, o3, 6, a2[48]), O2 = d2(O2, A2, P2, C2, _2, 10, a2[49]), C2 = d2(C2, O2, A2, P2, E2, 15, a2[50]), P2 = d2(P2, C2, O2, A2, m2, 21, a2[51]), A2 = d2(A2, P2, C2, O2, T2, 6, a2[52]), O2 = d2(O2, A2, P2, C2, f2, 10, a2[53]), C2 = d2(C2, O2, A2, P2, v2, 15, a2[54]), P2 = d2(P2, C2, O2, A2, c3, 21, a2[55]), A2 = d2(A2, P2, C2, O2, w2, 6, a2[56]), O2 = d2(O2, A2, P2, C2, k2, 10, a2[57]), C2 = d2(C2, O2, A2, P2, y2, 15, a2[58]), P2 = d2(P2, C2, O2, A2, b2, 21, a2[59]), A2 = d2(A2, P2, C2, O2, g2, 6, a2[60]), O2 = d2(O2, A2, P2, C2, S2, 10, a2[61]), C2 = d2(C2, O2, A2, P2, p2, 15, a2[62]), P2 = d2(P2, C2, O2, A2, I2, 21, a2[63]), i3[0] = i3[0] + A2 | 0, i3[1] = i3[1] + P2 | 0, i3[2] = i3[2] + C2 | 0, i3[3] = i3[3] + O2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        n3[r3 >>> 5] |= 128 << 24 - r3 % 32;
        var i3 = e3.floor(s3 / 4294967296), o3 = s3;
        n3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), n3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
        for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
          var h3 = c3[u3];
          c3[u3] = 16711935 & (h3 << 8 | h3 >>> 24) | 4278255360 & (h3 << 24 | h3 >>> 8);
        }
        return a3;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      function u2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & n3 | ~t4 & s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function h2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & s3 | n3 & ~s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function l2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 ^ n3 ^ s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function d2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (n3 ^ (t4 | ~s3)) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      t3.MD5 = i2._createHelper(c2), t3.HmacMD5 = i2._createHmacHelper(c2);
    }(Math), n2.MD5);
  }), n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, void function() {
      var e3 = n2, t3 = e3.lib.Base, s2 = e3.enc.Utf8;
      e3.algo.HMAC = t3.extend({ init: function(e4, t4) {
        e4 = this._hasher = new e4.init(), "string" == typeof t4 && (t4 = s2.parse(t4));
        var n3 = e4.blockSize, r2 = 4 * n3;
        t4.sigBytes > r2 && (t4 = e4.finalize(t4)), t4.clamp();
        for (var i2 = this._oKey = t4.clone(), o2 = this._iKey = t4.clone(), a2 = i2.words, c2 = o2.words, u2 = 0; u2 < n3; u2++)
          a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
        i2.sigBytes = o2.sigBytes = r2, this.reset();
      }, reset: function() {
        var e4 = this._hasher;
        e4.reset(), e4.update(this._iKey);
      }, update: function(e4) {
        return this._hasher.update(e4), this;
      }, finalize: function(e4) {
        var t4 = this._hasher, n3 = t4.finalize(e4);
        return t4.reset(), t4.finalize(this._oKey.clone().concat(n3));
      } });
    }());
  }), n(function(e2, t2) {
    e2.exports = r.HmacMD5;
  })), o = n(function(e2, t2) {
    e2.exports = r.enc.Utf8;
  }), a = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function() {
      var e3 = n2, t3 = e3.lib.WordArray;
      function s2(e4, n3, s3) {
        for (var r2 = [], i2 = 0, o2 = 0; o2 < n3; o2++)
          if (o2 % 4) {
            var a2 = s3[e4.charCodeAt(o2 - 1)] << o2 % 4 * 2, c2 = s3[e4.charCodeAt(o2)] >>> 6 - o2 % 4 * 2;
            r2[i2 >>> 2] |= (a2 | c2) << 24 - i2 % 4 * 8, i2++;
          }
        return t3.create(r2, i2);
      }
      e3.enc.Base64 = { stringify: function(e4) {
        var t4 = e4.words, n3 = e4.sigBytes, s3 = this._map;
        e4.clamp();
        for (var r2 = [], i2 = 0; i2 < n3; i2 += 3)
          for (var o2 = (t4[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) << 16 | (t4[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255) << 8 | t4[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && i2 + 0.75 * a2 < n3; a2++)
            r2.push(s3.charAt(o2 >>> 6 * (3 - a2) & 63));
        var c2 = s3.charAt(64);
        if (c2)
          for (; r2.length % 4; )
            r2.push(c2);
        return r2.join("");
      }, parse: function(e4) {
        var t4 = e4.length, n3 = this._map, r2 = this._reverseMap;
        if (!r2) {
          r2 = this._reverseMap = [];
          for (var i2 = 0; i2 < n3.length; i2++)
            r2[n3.charCodeAt(i2)] = i2;
        }
        var o2 = n3.charAt(64);
        if (o2) {
          var a2 = e4.indexOf(o2);
          -1 !== a2 && (t4 = a2);
        }
        return s2(e4, t4, r2);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    }(), n2.enc.Base64);
  });
  const c = "uni_id_token", u = "uni_id_token_expired", h = "uniIdToken", l = { DEFAULT: "FUNCTION", FUNCTION: "FUNCTION", OBJECT: "OBJECT", CLIENT_DB: "CLIENT_DB" }, d = "pending", p = "fulfilled", f = "rejected";
  function g(e2) {
    return Object.prototype.toString.call(e2).slice(8, -1).toLowerCase();
  }
  function m(e2) {
    return "object" === g(e2);
  }
  function y(e2) {
    return "function" == typeof e2;
  }
  function _(e2) {
    return function() {
      try {
        return e2.apply(e2, arguments);
      } catch (e3) {
        console.error(e3);
      }
    };
  }
  const w = "REJECTED", I = "NOT_PENDING";
  class v {
    constructor({ createPromise: e2, retryRule: t2 = w } = {}) {
      this.createPromise = e2, this.status = null, this.promise = null, this.retryRule = t2;
    }
    get needRetry() {
      if (!this.status)
        return true;
      switch (this.retryRule) {
        case w:
          return this.status === f;
        case I:
          return this.status !== d;
      }
    }
    exec() {
      return this.needRetry ? (this.status = d, this.promise = this.createPromise().then((e2) => (this.status = p, Promise.resolve(e2)), (e2) => (this.status = f, Promise.reject(e2))), this.promise) : this.promise;
    }
  }
  class S {
    constructor() {
      this._callback = {};
    }
    addListener(e2, t2) {
      this._callback[e2] || (this._callback[e2] = []), this._callback[e2].push(t2);
    }
    on(e2, t2) {
      return this.addListener(e2, t2);
    }
    removeListener(e2, t2) {
      if (!t2)
        throw new Error('The "listener" argument must be of type function. Received undefined');
      const n2 = this._callback[e2];
      if (!n2)
        return;
      const s2 = function(e3, t3) {
        for (let n3 = e3.length - 1; n3 >= 0; n3--)
          if (e3[n3] === t3)
            return n3;
        return -1;
      }(n2, t2);
      n2.splice(s2, 1);
    }
    off(e2, t2) {
      return this.removeListener(e2, t2);
    }
    removeAllListener(e2) {
      delete this._callback[e2];
    }
    emit(e2, ...t2) {
      const n2 = this._callback[e2];
      if (n2)
        for (let e3 = 0; e3 < n2.length; e3++)
          n2[e3](...t2);
    }
  }
  function T(e2) {
    return e2 && "string" == typeof e2 ? JSON.parse(e2) : e2;
  }
  const b = true, E = "app", A = T(define_process_env_UNI_SECURE_NETWORK_CONFIG_default), P = E, C = T('{"address":["127.0.0.1","26.26.26.1","192.168.1.36","172.29.224.1"],"servePort":7000,"debugPort":9000,"initialLaunchType":"local","skipFiles":["<node_internals>/**","D:/HBuilderX.4.66.2025051912/HBuilderX/plugins/unicloud/**/*.js"]}'), O = T('[{"provider":"aliyun","spaceName":"fengdian-network","spaceId":"mp-1240ebd5-749c-4abc-b593-fd807f0347fb","clientSecret":"O19t2kwfrKNBTMlOW9URcA==","endpoint":"https://api.next.bspapp.com"}]') || [];
  let N = "";
  try {
    N = "__UNI__3B0C11F";
  } catch (e2) {
  }
  let R, L = {};
  function U(e2, t2 = {}) {
    var n2, s2;
    return n2 = L, s2 = e2, Object.prototype.hasOwnProperty.call(n2, s2) || (L[e2] = t2), L[e2];
  }
  function D() {
    return R || (R = function() {
      if ("undefined" != typeof globalThis)
        return globalThis;
      if ("undefined" != typeof self)
        return self;
      if ("undefined" != typeof window)
        return window;
      function e2() {
        return this;
      }
      return void 0 !== e2() ? e2() : new Function("return this")();
    }(), R);
  }
  L = uni._globalUniCloudObj ? uni._globalUniCloudObj : uni._globalUniCloudObj = {};
  const M = ["invoke", "success", "fail", "complete"], q = U("_globalUniCloudInterceptor");
  function F(e2, t2) {
    q[e2] || (q[e2] = {}), m(t2) && Object.keys(t2).forEach((n2) => {
      M.indexOf(n2) > -1 && function(e3, t3, n3) {
        let s2 = q[e3][t3];
        s2 || (s2 = q[e3][t3] = []), -1 === s2.indexOf(n3) && y(n3) && s2.push(n3);
      }(e2, n2, t2[n2]);
    });
  }
  function K(e2, t2) {
    q[e2] || (q[e2] = {}), m(t2) ? Object.keys(t2).forEach((n2) => {
      M.indexOf(n2) > -1 && function(e3, t3, n3) {
        const s2 = q[e3][t3];
        if (!s2)
          return;
        const r2 = s2.indexOf(n3);
        r2 > -1 && s2.splice(r2, 1);
      }(e2, n2, t2[n2]);
    }) : delete q[e2];
  }
  function j(e2, t2) {
    return e2 && 0 !== e2.length ? e2.reduce((e3, n2) => e3.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
  }
  function $(e2, t2) {
    return q[e2] && q[e2][t2] || [];
  }
  function B(e2) {
    F("callObject", e2);
  }
  const W = U("_globalUniCloudListener"), H = { RESPONSE: "response", NEED_LOGIN: "needLogin", REFRESH_TOKEN: "refreshToken" }, J = { CLIENT_DB: "clientdb", CLOUD_FUNCTION: "cloudfunction", CLOUD_OBJECT: "cloudobject" };
  function z(e2) {
    return W[e2] || (W[e2] = []), W[e2];
  }
  function V(e2, t2) {
    const n2 = z(e2);
    n2.includes(t2) || n2.push(t2);
  }
  function G(e2, t2) {
    const n2 = z(e2), s2 = n2.indexOf(t2);
    -1 !== s2 && n2.splice(s2, 1);
  }
  function Y(e2, t2) {
    const n2 = z(e2);
    for (let e3 = 0; e3 < n2.length; e3++) {
      (0, n2[e3])(t2);
    }
  }
  let Q, X = false;
  function Z() {
    return Q || (Q = new Promise((e2) => {
      X && e2(), function t2() {
        if ("function" == typeof getCurrentPages) {
          const t3 = getCurrentPages();
          t3 && t3[0] && (X = true, e2());
        }
        X || setTimeout(() => {
          t2();
        }, 30);
      }();
    }), Q);
  }
  function ee(e2) {
    const t2 = {};
    for (const n2 in e2) {
      const s2 = e2[n2];
      y(s2) && (t2[n2] = _(s2));
    }
    return t2;
  }
  class te extends Error {
    constructor(e2) {
      const t2 = e2.message || e2.errMsg || "unknown system error";
      super(t2), this.errMsg = t2, this.code = this.errCode = e2.code || e2.errCode || "SYSTEM_ERROR", this.errSubject = this.subject = e2.subject || e2.errSubject, this.cause = e2.cause, this.requestId = e2.requestId;
    }
    toJson(e2 = 0) {
      if (!(e2 >= 10))
        return e2++, { errCode: this.errCode, errMsg: this.errMsg, errSubject: this.errSubject, cause: this.cause && this.cause.toJson ? this.cause.toJson(e2) : this.cause };
    }
  }
  var ne = { request: (e2) => uni.request(e2), uploadFile: (e2) => uni.uploadFile(e2), setStorageSync: (e2, t2) => uni.setStorageSync(e2, t2), getStorageSync: (e2) => uni.getStorageSync(e2), removeStorageSync: (e2) => uni.removeStorageSync(e2), clearStorageSync: () => uni.clearStorageSync(), connectSocket: (e2) => uni.connectSocket(e2) };
  function se(e2) {
    return e2 && se(e2.__v_raw) || e2;
  }
  function re() {
    return { token: ne.getStorageSync(c) || ne.getStorageSync(h), tokenExpired: ne.getStorageSync(u) };
  }
  function ie({ token: e2, tokenExpired: t2 } = {}) {
    e2 && ne.setStorageSync(c, e2), t2 && ne.setStorageSync(u, t2);
  }
  let oe, ae;
  function ce() {
    return oe || (oe = uni.getSystemInfoSync()), oe;
  }
  function ue() {
    let e2, t2;
    try {
      if (uni.getLaunchOptionsSync) {
        if (uni.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
          return;
        const { scene: n2, channel: s2 } = uni.getLaunchOptionsSync();
        e2 = s2, t2 = n2;
      }
    } catch (e3) {
    }
    return { channel: e2, scene: t2 };
  }
  let he = {};
  function le() {
    const e2 = uni.getLocale && uni.getLocale() || "en";
    if (ae)
      return { ...he, ...ae, locale: e2, LOCALE: e2 };
    const t2 = ce(), { deviceId: n2, osName: s2, uniPlatform: r2, appId: i2 } = t2, o2 = ["appId", "appLanguage", "appName", "appVersion", "appVersionCode", "appWgtVersion", "browserName", "browserVersion", "deviceBrand", "deviceId", "deviceModel", "deviceType", "osName", "osVersion", "romName", "romVersion", "ua", "hostName", "hostVersion", "uniPlatform", "uniRuntimeVersion", "uniRuntimeVersionCode", "uniCompilerVersion", "uniCompilerVersionCode"];
    for (const e3 in t2)
      Object.hasOwnProperty.call(t2, e3) && -1 === o2.indexOf(e3) && delete t2[e3];
    return ae = { PLATFORM: r2, OS: s2, APPID: i2, DEVICEID: n2, ...ue(), ...t2 }, { ...he, ...ae, locale: e2, LOCALE: e2 };
  }
  var de = { sign: function(e2, t2) {
    let n2 = "";
    return Object.keys(e2).sort().forEach(function(t3) {
      e2[t3] && (n2 = n2 + "&" + t3 + "=" + e2[t3]);
    }), n2 = n2.slice(1), i(n2, t2).toString();
  }, wrappedRequest: function(e2, t2) {
    return new Promise((n2, s2) => {
      t2(Object.assign(e2, { complete(e3) {
        e3 || (e3 = {});
        const t3 = e3.data && e3.data.header && e3.data.header["x-serverless-request-id"] || e3.header && e3.header["request-id"];
        if (!e3.statusCode || e3.statusCode >= 400) {
          const n3 = e3.data && e3.data.error && e3.data.error.code || "SYS_ERR", r3 = e3.data && e3.data.error && e3.data.error.message || e3.errMsg || "request:fail";
          return s2(new te({ code: n3, message: r3, requestId: t3 }));
        }
        const r2 = e3.data;
        if (r2.error)
          return s2(new te({ code: r2.error.code, message: r2.error.message, requestId: t3 }));
        r2.result = r2.data, r2.requestId = t3, delete r2.data, n2(r2);
      } }));
    });
  }, toBase64: function(e2) {
    return a.stringify(o.parse(e2));
  } };
  var pe = class {
    constructor(e2) {
      ["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), this.config = Object.assign({}, { endpoint: 0 === e2.spaceId.indexOf("mp-") ? "https://api.next.bspapp.com" : "https://api.bspapp.com" }, e2), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = ne, this._getAccessTokenPromiseHub = new v({ createPromise: () => this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e3) => {
        if (!e3.result || !e3.result.accessToken)
          throw new te({ code: "AUTH_FAILED", message: "获取accessToken失败" });
        this.setAccessToken(e3.result.accessToken);
      }), retryRule: I });
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e2) {
      this.accessToken = e2;
    }
    requestWrapped(e2) {
      return de.wrappedRequest(e2, this.adapter.request);
    }
    requestAuth(e2) {
      return this.requestWrapped(e2);
    }
    request(e2, t2) {
      return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e2) : this.requestWrapped(e2).catch((t3) => new Promise((e3, n2) => {
        !t3 || "GATEWAY_INVALID_TOKEN" !== t3.code && "InvalidParameter.InvalidToken" !== t3.code ? n2(t3) : e3();
      }).then(() => this.getAccessToken()).then(() => {
        const t4 = this.rebuildRequest(e2);
        return this.request(t4, true);
      })) : this.getAccessToken().then(() => {
        const t3 = this.rebuildRequest(e2);
        return this.request(t3, true);
      }));
    }
    rebuildRequest(e2) {
      const t2 = Object.assign({}, e2);
      return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = de.sign(t2.data, this.config.clientSecret), t2;
    }
    setupRequest(e2, t2) {
      const n2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      return "auth" !== t2 && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = de.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
    }
    getAccessToken() {
      return this._getAccessTokenPromiseHub.exec();
    }
    async authorize() {
      await this.getAccessToken();
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request({ ...this.setupRequest(t2), timeout: e2.timeout });
    }
    getOSSUploadOptionsFromPath(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    uploadFileToOSS({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: i2 }) {
      return new Promise((o2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e3) {
          e3 && e3.statusCode < 400 ? o2(e3) : a2(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          a2(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof i2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
          i2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    reportOSSUpload(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    async uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", cloudPathAsRealPath: s2 = false, onUploadProgress: r2, config: i2 }) {
      if ("string" !== g(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const o2 = i2 && i2.envType || this.config.envType;
      if (s2 && ("/" !== t2[0] && (t2 = "/" + t2), t2.indexOf("\\") > -1))
        throw new te({ code: "INVALID_PARAM", message: "使用cloudPath作为路径时，cloudPath不可包含“\\”" });
      const a2 = (await this.getOSSUploadOptionsFromPath({ env: o2, filename: s2 ? t2.split("/").pop() : t2, fileId: s2 ? t2 : void 0 })).result, c2 = "https://" + a2.cdnDomain + "/" + a2.ossPath, { securityToken: u2, accessKeyId: h2, signature: l2, host: d2, ossPath: p2, id: f2, policy: m2, ossCallbackUrl: y2 } = a2, _2 = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: h2, Signature: l2, host: d2, id: f2, key: p2, policy: m2, success_action_status: 200 };
      if (u2 && (_2["x-oss-security-token"] = u2), y2) {
        const e3 = JSON.stringify({ callbackUrl: y2, callbackBody: JSON.stringify({ fileId: f2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
        _2.callback = de.toBase64(e3);
      }
      const w2 = { url: "https://" + a2.host, formData: _2, fileName: "file", name: "file", filePath: e2, fileType: n2 };
      if (await this.uploadFileToOSS(Object.assign({}, w2, { onUploadProgress: r2 })), y2)
        return { success: true, filePath: e2, fileID: c2 };
      if ((await this.reportOSSUpload({ id: f2 })).success)
        return { success: true, filePath: e2, fileID: c2 };
      throw new te({ code: "UPLOAD_FAILED", message: "文件上传失败" });
    }
    getTempFileURL({ fileList: e2 } = {}) {
      return new Promise((t2, n2) => {
        Array.isArray(e2) && 0 !== e2.length || n2(new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" })), this.getFileInfo({ fileList: e2 }).then((n3) => {
          t2({ fileList: e2.map((e3, t3) => {
            const s2 = n3.fileList[t3];
            return { fileID: e3, tempFileURL: s2 && s2.url || e3 };
          }) });
        });
      });
    }
    async getFileInfo({ fileList: e2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e2.map((e3) => e3.split("?")[0]).join(",") }) };
      return { fileList: (await this.request(this.setupRequest(t2))).result };
    }
  };
  var fe = { init(e2) {
    const t2 = new pe(e2), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  const ge = "undefined" != typeof location && "http:" === location.protocol ? "http:" : "https:";
  var me;
  !function(e2) {
    e2.local = "local", e2.none = "none", e2.session = "session";
  }(me || (me = {}));
  var ye = function() {
  }, _e = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [], c2 = [];
      !function() {
        function t4(t5) {
          for (var n4 = e3.sqrt(t5), s4 = 2; s4 <= n4; s4++)
            if (!(t5 % s4))
              return false;
          return true;
        }
        function n3(e4) {
          return 4294967296 * (e4 - (0 | e4)) | 0;
        }
        for (var s3 = 2, r3 = 0; r3 < 64; )
          t4(s3) && (r3 < 8 && (a2[r3] = n3(e3.pow(s3, 0.5))), c2[r3] = n3(e3.pow(s3, 1 / 3)), r3++), s3++;
      }();
      var u2 = [], h2 = o2.SHA256 = i2.extend({ _doReset: function() {
        this._hash = new r2.init(a2.slice(0));
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = this._hash.words, s3 = n3[0], r3 = n3[1], i3 = n3[2], o3 = n3[3], a3 = n3[4], h3 = n3[5], l2 = n3[6], d2 = n3[7], p2 = 0; p2 < 64; p2++) {
          if (p2 < 16)
            u2[p2] = 0 | e4[t4 + p2];
          else {
            var f2 = u2[p2 - 15], g2 = (f2 << 25 | f2 >>> 7) ^ (f2 << 14 | f2 >>> 18) ^ f2 >>> 3, m2 = u2[p2 - 2], y2 = (m2 << 15 | m2 >>> 17) ^ (m2 << 13 | m2 >>> 19) ^ m2 >>> 10;
            u2[p2] = g2 + u2[p2 - 7] + y2 + u2[p2 - 16];
          }
          var _2 = s3 & r3 ^ s3 & i3 ^ r3 & i3, w2 = (s3 << 30 | s3 >>> 2) ^ (s3 << 19 | s3 >>> 13) ^ (s3 << 10 | s3 >>> 22), I2 = d2 + ((a3 << 26 | a3 >>> 6) ^ (a3 << 21 | a3 >>> 11) ^ (a3 << 7 | a3 >>> 25)) + (a3 & h3 ^ ~a3 & l2) + c2[p2] + u2[p2];
          d2 = l2, l2 = h3, h3 = a3, a3 = o3 + I2 | 0, o3 = i3, i3 = r3, r3 = s3, s3 = I2 + (w2 + _2) | 0;
        }
        n3[0] = n3[0] + s3 | 0, n3[1] = n3[1] + r3 | 0, n3[2] = n3[2] + i3 | 0, n3[3] = n3[3] + o3 | 0, n3[4] = n3[4] + a3 | 0, n3[5] = n3[5] + h3 | 0, n3[6] = n3[6] + l2 | 0, n3[7] = n3[7] + d2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        return n3[r3 >>> 5] |= 128 << 24 - r3 % 32, n3[14 + (r3 + 64 >>> 9 << 4)] = e3.floor(s3 / 4294967296), n3[15 + (r3 + 64 >>> 9 << 4)] = s3, t4.sigBytes = 4 * n3.length, this._process(), this._hash;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      t3.SHA256 = i2._createHelper(h2), t3.HmacSHA256 = i2._createHmacHelper(h2);
    }(Math), n2.SHA256);
  }), we = _e, Ie = n(function(e2, t2) {
    e2.exports = r.HmacSHA256;
  });
  const ve = () => {
    let e2;
    if (!Promise) {
      e2 = () => {
      }, e2.promise = {};
      const t3 = () => {
        throw new te({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
      };
      return Object.defineProperty(e2.promise, "then", { get: t3 }), Object.defineProperty(e2.promise, "catch", { get: t3 }), e2;
    }
    const t2 = new Promise((t3, n2) => {
      e2 = (e3, s2) => e3 ? n2(e3) : t3(s2);
    });
    return e2.promise = t2, e2;
  };
  function Se(e2) {
    return void 0 === e2;
  }
  function Te(e2) {
    return "[object Null]" === Object.prototype.toString.call(e2);
  }
  function be(e2 = "") {
    return e2.replace(/([\s\S]+)\s+(请前往云开发AI小助手查看问题：.*)/, "$1");
  }
  function Ee(e2 = 32) {
    const t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let n2 = "";
    for (let s2 = 0; s2 < e2; s2++)
      n2 += t2.charAt(Math.floor(62 * Math.random()));
    return n2;
  }
  var ke;
  function Ae(e2) {
    const t2 = (n2 = e2, "[object Array]" === Object.prototype.toString.call(n2) ? e2 : [e2]);
    var n2;
    for (const e3 of t2) {
      const { isMatch: t3, genAdapter: n3, runtime: s2 } = e3;
      if (t3())
        return { adapter: n3(), runtime: s2 };
    }
  }
  !function(e2) {
    e2.WEB = "web", e2.WX_MP = "wx_mp";
  }(ke || (ke = {}));
  const Pe = { adapter: null, runtime: void 0 }, Ce = ["anonymousUuidKey"];
  class Oe extends ye {
    constructor() {
      super(), Pe.adapter.root.tcbObject || (Pe.adapter.root.tcbObject = {});
    }
    setItem(e2, t2) {
      Pe.adapter.root.tcbObject[e2] = t2;
    }
    getItem(e2) {
      return Pe.adapter.root.tcbObject[e2];
    }
    removeItem(e2) {
      delete Pe.adapter.root.tcbObject[e2];
    }
    clear() {
      delete Pe.adapter.root.tcbObject;
    }
  }
  function xe(e2, t2) {
    switch (e2) {
      case "local":
        return t2.localStorage || new Oe();
      case "none":
        return new Oe();
      default:
        return t2.sessionStorage || new Oe();
    }
  }
  class Ne {
    constructor(e2) {
      if (!this._storage) {
        this._persistence = Pe.adapter.primaryStorage || e2.persistence, this._storage = xe(this._persistence, Pe.adapter);
        const t2 = `access_token_${e2.env}`, n2 = `access_token_expire_${e2.env}`, s2 = `refresh_token_${e2.env}`, r2 = `anonymous_uuid_${e2.env}`, i2 = `login_type_${e2.env}`, o2 = "device_id", a2 = `token_type_${e2.env}`, c2 = `user_info_${e2.env}`;
        this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: r2, loginTypeKey: i2, userInfoKey: c2, deviceIdKey: o2, tokenTypeKey: a2 };
      }
    }
    updatePersistence(e2) {
      if (e2 === this._persistence)
        return;
      const t2 = "local" === this._persistence;
      this._persistence = e2;
      const n2 = xe(e2, Pe.adapter);
      for (const e3 in this.keys) {
        const s2 = this.keys[e3];
        if (t2 && Ce.includes(e3))
          continue;
        const r2 = this._storage.getItem(s2);
        Se(r2) || Te(r2) || (n2.setItem(s2, r2), this._storage.removeItem(s2));
      }
      this._storage = n2;
    }
    setStore(e2, t2, n2) {
      if (!this._storage)
        return;
      const s2 = { version: n2 || "localCachev1", content: t2 }, r2 = JSON.stringify(s2);
      try {
        this._storage.setItem(e2, r2);
      } catch (e3) {
        throw e3;
      }
    }
    getStore(e2, t2) {
      try {
        if (!this._storage)
          return;
      } catch (e3) {
        return "";
      }
      t2 = t2 || "localCachev1";
      const n2 = this._storage.getItem(e2);
      if (!n2)
        return "";
      if (n2.indexOf(t2) >= 0) {
        return JSON.parse(n2).content;
      }
      return "";
    }
    removeStore(e2) {
      this._storage.removeItem(e2);
    }
  }
  const Re = {}, Le = {};
  function Ue(e2) {
    return Re[e2];
  }
  class De {
    constructor(e2, t2) {
      this.data = t2 || null, this.name = e2;
    }
  }
  class Me extends De {
    constructor(e2, t2) {
      super("error", { error: e2, data: t2 }), this.error = e2;
    }
  }
  const qe = new class {
    constructor() {
      this._listeners = {};
    }
    on(e2, t2) {
      return function(e3, t3, n2) {
        n2[e3] = n2[e3] || [], n2[e3].push(t3);
      }(e2, t2, this._listeners), this;
    }
    off(e2, t2) {
      return function(e3, t3, n2) {
        if (n2 && n2[e3]) {
          const s2 = n2[e3].indexOf(t3);
          -1 !== s2 && n2[e3].splice(s2, 1);
        }
      }(e2, t2, this._listeners), this;
    }
    fire(e2, t2) {
      if (e2 instanceof Me)
        return console.error(e2.error), this;
      const n2 = "string" == typeof e2 ? new De(e2, t2 || {}) : e2;
      const s2 = n2.name;
      if (this._listens(s2)) {
        n2.target = this;
        const e3 = this._listeners[s2] ? [...this._listeners[s2]] : [];
        for (const t3 of e3)
          t3.call(this, n2);
      }
      return this;
    }
    _listens(e2) {
      return this._listeners[e2] && this._listeners[e2].length > 0;
    }
  }();
  function Fe(e2, t2) {
    qe.on(e2, t2);
  }
  function Ke(e2, t2 = {}) {
    qe.fire(e2, t2);
  }
  function je(e2, t2) {
    qe.off(e2, t2);
  }
  const $e = "loginStateChanged", Be = "loginStateExpire", We = "loginTypeChanged", He = "anonymousConverted", Je = "refreshAccessToken";
  var ze;
  !function(e2) {
    e2.ANONYMOUS = "ANONYMOUS", e2.WECHAT = "WECHAT", e2.WECHAT_PUBLIC = "WECHAT-PUBLIC", e2.WECHAT_OPEN = "WECHAT-OPEN", e2.CUSTOM = "CUSTOM", e2.EMAIL = "EMAIL", e2.USERNAME = "USERNAME", e2.NULL = "NULL";
  }(ze || (ze = {}));
  class Ve {
    constructor() {
      this._fnPromiseMap = /* @__PURE__ */ new Map();
    }
    async run(e2, t2) {
      let n2 = this._fnPromiseMap.get(e2);
      return n2 || (n2 = new Promise(async (n3, s2) => {
        try {
          await this._runIdlePromise();
          const e3 = t2();
          n3(await e3);
        } catch (e3) {
          s2(e3);
        } finally {
          this._fnPromiseMap.delete(e2);
        }
      }), this._fnPromiseMap.set(e2, n2)), n2;
    }
    _runIdlePromise() {
      return Promise.resolve();
    }
  }
  class Ge {
    constructor(e2) {
      this._singlePromise = new Ve(), this._cache = Ue(e2.env), this._baseURL = `https://${e2.env}.ap-shanghai.tcb-api.tencentcloudapi.com`, this._reqClass = new Pe.adapter.reqClass({ timeout: e2.timeout, timeoutMsg: `请求在${e2.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] });
    }
    _getDeviceId() {
      if (this._deviceID)
        return this._deviceID;
      const { deviceIdKey: e2 } = this._cache.keys;
      let t2 = this._cache.getStore(e2);
      return "string" == typeof t2 && t2.length >= 16 && t2.length <= 48 || (t2 = Ee(), this._cache.setStore(e2, t2)), this._deviceID = t2, t2;
    }
    async _request(e2, t2, n2 = {}) {
      const s2 = { "x-request-id": Ee(), "x-device-id": this._getDeviceId() };
      if (n2.withAccessToken) {
        const { tokenTypeKey: e3 } = this._cache.keys, t3 = await this.getAccessToken(), n3 = this._cache.getStore(e3);
        s2.authorization = `${n3} ${t3}`;
      }
      return this._reqClass["get" === n2.method ? "get" : "post"]({ url: `${this._baseURL}${e2}`, data: t2, headers: s2 });
    }
    async _fetchAccessToken() {
      const { loginTypeKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2, tokenTypeKey: s2 } = this._cache.keys, r2 = this._cache.getStore(e2);
      if (r2 && r2 !== ze.ANONYMOUS)
        throw new te({ code: "INVALID_OPERATION", message: "非匿名登录不支持刷新 access token" });
      const i2 = await this._singlePromise.run("fetchAccessToken", async () => (await this._request("/auth/v1/signin/anonymously", {}, { method: "post" })).data), { access_token: o2, expires_in: a2, token_type: c2 } = i2;
      return this._cache.setStore(s2, c2), this._cache.setStore(t2, o2), this._cache.setStore(n2, Date.now() + 1e3 * a2), o2;
    }
    isAccessTokenExpired(e2, t2) {
      let n2 = true;
      return e2 && t2 && (n2 = t2 < Date.now()), n2;
    }
    async getAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
      return this.isAccessTokenExpired(n2, s2) ? this._fetchAccessToken() : n2;
    }
    async refreshAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, loginTypeKey: n2 } = this._cache.keys;
      return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.setStore(n2, ze.ANONYMOUS), this.getAccessToken();
    }
    async getUserInfo() {
      return this._singlePromise.run("getUserInfo", async () => (await this._request("/auth/v1/user/me", {}, { withAccessToken: true, method: "get" })).data);
    }
  }
  const Ye = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Qe = { "X-SDK-Version": "1.3.5" };
  function Xe(e2, t2, n2) {
    const s2 = e2[t2];
    e2[t2] = function(t3) {
      const r2 = {}, i2 = {};
      n2.forEach((n3) => {
        const { data: s3, headers: o3 } = n3.call(e2, t3);
        Object.assign(r2, s3), Object.assign(i2, o3);
      });
      const o2 = t3.data;
      return o2 && (() => {
        var e3;
        if (e3 = o2, "[object FormData]" !== Object.prototype.toString.call(e3))
          t3.data = { ...o2, ...r2 };
        else
          for (const e4 in r2)
            o2.append(e4, r2[e4]);
      })(), t3.headers = { ...t3.headers || {}, ...i2 }, s2.call(e2, t3);
    };
  }
  function Ze() {
    const e2 = Math.random().toString(16).slice(2);
    return { data: { seqId: e2 }, headers: { ...Qe, "x-seqid": e2 } };
  }
  class et {
    constructor(e2 = {}) {
      var t2;
      this.config = e2, this._reqClass = new Pe.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `请求在${this.config.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] }), this._cache = Ue(this.config.env), this._localCache = (t2 = this.config.env, Le[t2]), this.oauth = new Ge(this.config), Xe(this._reqClass, "post", [Ze]), Xe(this._reqClass, "upload", [Ze]), Xe(this._reqClass, "download", [Ze]);
    }
    async post(e2) {
      return await this._reqClass.post(e2);
    }
    async upload(e2) {
      return await this._reqClass.upload(e2);
    }
    async download(e2) {
      return await this._reqClass.download(e2);
    }
    async refreshAccessToken() {
      let e2, t2;
      this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
      try {
        e2 = await this._refreshAccessTokenPromise;
      } catch (e3) {
        t2 = e3;
      }
      if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
        throw t2;
      return e2;
    }
    async _refreshAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: r2 } = this._cache.keys;
      this._cache.removeStore(e2), this._cache.removeStore(t2);
      let i2 = this._cache.getStore(n2);
      if (!i2)
        throw new te({ message: "未登录CloudBase" });
      const o2 = { refresh_token: i2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", o2);
      if (a2.data.code) {
        const { code: e3 } = a2.data;
        if ("SIGN_PARAM_INVALID" === e3 || "REFRESH_TOKEN_EXPIRED" === e3 || "INVALID_REFRESH_TOKEN" === e3) {
          if (this._cache.getStore(s2) === ze.ANONYMOUS && "INVALID_REFRESH_TOKEN" === e3) {
            const e4 = this._cache.getStore(r2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e4, refresh_token: t3 });
            return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
          }
          Ke(Be), this._cache.removeStore(n2);
        }
        throw new te({ code: a2.data.code, message: `刷新access token失败：${a2.data.code}` });
      }
      if (a2.data.access_token)
        return Ke(Je), this._cache.setStore(e2, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
      a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
    }
    async getAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
      if (!this._cache.getStore(n2))
        throw new te({ message: "refresh token不存在，登录状态异常" });
      let s2 = this._cache.getStore(e2), r2 = this._cache.getStore(t2), i2 = true;
      return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, r2) && (i2 = false), (!s2 || !r2 || r2 < Date.now()) && i2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: r2 };
    }
    async request(e2, t2, n2) {
      const s2 = `x-tcb-trace_${this.config.env}`;
      let r2 = "application/x-www-form-urlencoded";
      const i2 = { action: e2, env: this.config.env, dataVersion: "2019-08-16", ...t2 };
      let o2;
      if (-1 === Ye.indexOf(e2) && (this._cache.keys, i2.access_token = await this.oauth.getAccessToken()), "storage.uploadFile" === e2) {
        o2 = new FormData();
        for (let e3 in o2)
          o2.hasOwnProperty(e3) && void 0 !== o2[e3] && o2.append(e3, i2[e3]);
        r2 = "multipart/form-data";
      } else {
        r2 = "application/json", o2 = {};
        for (let e3 in i2)
          void 0 !== i2[e3] && (o2[e3] = i2[e3]);
      }
      let a2 = { headers: { "content-type": r2 } };
      n2 && n2.timeout && (a2.timeout = n2.timeout), n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
      const c2 = this._localCache.getStore(s2);
      c2 && (a2.headers["X-TCB-Trace"] = c2);
      const { parse: u2, inQuery: h2, search: l2 } = t2;
      let d2 = { env: this.config.env };
      u2 && (d2.parse = true), h2 && (d2 = { ...h2, ...d2 });
      let p2 = function(e3, t3, n3 = {}) {
        const s3 = /\?/.test(t3);
        let r3 = "";
        for (let e4 in n3)
          "" === r3 ? !s3 && (t3 += "?") : r3 += "&", r3 += `${e4}=${encodeURIComponent(n3[e4])}`;
        return /^http(s)?\:\/\//.test(t3 += r3) ? t3 : `${e3}${t3}`;
      }(ge, "//tcb-api.tencentcloudapi.com/web", d2);
      l2 && (p2 += l2);
      const f2 = await this.post({ url: p2, data: o2, ...a2 }), g2 = f2.header && f2.header["x-tcb-trace"];
      if (g2 && this._localCache.setStore(s2, g2), 200 !== Number(f2.status) && 200 !== Number(f2.statusCode) || !f2.data)
        throw new te({ code: "NETWORK_ERROR", message: "network request error" });
      return f2;
    }
    async send(e2, t2 = {}, n2 = {}) {
      const s2 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
      if (("ACCESS_TOKEN_DISABLED" === s2.data.code || "ACCESS_TOKEN_EXPIRED" === s2.data.code) && -1 === Ye.indexOf(e2)) {
        await this.oauth.refreshAccessToken();
        const s3 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
        if (s3.data.code)
          throw new te({ code: s3.data.code, message: be(s3.data.message) });
        return s3.data;
      }
      if (s2.data.code)
        throw new te({ code: s2.data.code, message: be(s2.data.message) });
      return s2.data;
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
  }
  const tt = {};
  function nt(e2) {
    return tt[e2];
  }
  class st {
    constructor(e2) {
      this.config = e2, this._cache = Ue(e2.env), this._request = nt(e2.env);
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
    setAccessToken(e2, t2) {
      const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
      this._cache.setStore(n2, e2), this._cache.setStore(s2, t2);
    }
    async refreshUserInfo() {
      const { data: e2 } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e2), e2;
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2);
    }
  }
  class rt {
    constructor(e2) {
      if (!e2)
        throw new te({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._envId = e2, this._cache = Ue(this._envId), this._request = nt(this._envId), this.setUserInfo();
    }
    linkWithTicket(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "ticket must be string" });
      return this._request.send("auth.linkWithTicket", { ticket: e2 });
    }
    linkWithRedirect(e2) {
      e2.signInWithRedirect();
    }
    updatePassword(e2, t2) {
      return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e2 });
    }
    updateEmail(e2) {
      return this._request.send("auth.updateEmail", { newEmail: e2 });
    }
    updateUsername(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      return this._request.send("auth.updateUsername", { username: e2 });
    }
    async getLinkedUidList() {
      const { data: e2 } = await this._request.send("auth.getLinkedUidList", {});
      let t2 = false;
      const { users: n2 } = e2;
      return n2.forEach((e3) => {
        e3.wxOpenId && e3.wxPublicId && (t2 = true);
      }), { users: n2, hasPrimaryUid: t2 };
    }
    setPrimaryUid(e2) {
      return this._request.send("auth.setPrimaryUid", { uid: e2 });
    }
    unlink(e2) {
      return this._request.send("auth.unlink", { platform: e2 });
    }
    async update(e2) {
      const { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 } = e2, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 });
      this.setLocalUserInfo(a2);
    }
    async refresh() {
      const e2 = await this._request.oauth.getUserInfo();
      return this.setLocalUserInfo(e2), e2;
    }
    setUserInfo() {
      const { userInfoKey: e2 } = this._cache.keys, t2 = this._cache.getStore(e2);
      ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e3) => {
        this[e3] = t2[e3];
      }), this.location = { country: t2.country, province: t2.province, city: t2.city };
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2), this.setUserInfo();
    }
  }
  class it {
    constructor(e2) {
      if (!e2)
        throw new te({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._cache = Ue(e2);
      const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, r2 = this._cache.getStore(t2), i2 = this._cache.getStore(n2), o2 = this._cache.getStore(s2);
      this.credential = { refreshToken: r2, accessToken: i2, accessTokenExpire: o2 }, this.user = new rt(e2);
    }
    get isAnonymousAuth() {
      return this.loginType === ze.ANONYMOUS;
    }
    get isCustomAuth() {
      return this.loginType === ze.CUSTOM;
    }
    get isWeixinAuth() {
      return this.loginType === ze.WECHAT || this.loginType === ze.WECHAT_OPEN || this.loginType === ze.WECHAT_PUBLIC;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
  }
  class ot extends st {
    async signIn() {
      this._cache.updatePersistence("local"), await this._request.oauth.getAccessToken(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.ANONYMOUS, persistence: "local" });
      const e2 = new it(this.config.env);
      return await e2.user.refresh(), e2;
    }
    async linkAndRetrieveDataWithTicket(e2) {
      const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: r2, ticket: e2 });
      if (i2.refresh_token)
        return this._clearAnonymousUUID(), this.setRefreshToken(i2.refresh_token), await this._request.refreshAccessToken(), Ke(He, { env: this.config.env }), Ke(We, { loginType: ze.CUSTOM, persistence: "local" }), { credential: { refreshToken: i2.refresh_token } };
      throw new te({ message: "匿名转化失败" });
    }
    _setAnonymousUUID(e2) {
      const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.setStore(t2, e2), this._cache.setStore(n2, ze.ANONYMOUS);
    }
    _clearAnonymousUUID() {
      this._cache.removeStore(this._cache.keys.anonymousUuidKey);
    }
  }
  class at extends st {
    async signIn(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "ticket must be a string" });
      const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e2, refresh_token: this._cache.getStore(t2) || "" });
      if (n2.refresh_token)
        return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new it(this.config.env);
      throw new te({ message: "自定义登录失败" });
    }
  }
  class ct extends st {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "email must be a string" });
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token: i2, access_token_expire: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), i2 && o2 ? this.setAccessToken(i2, o2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.EMAIL, persistence: this.config.persistence }), new it(this.config.env);
      throw s2.code ? new te({ code: s2.code, message: `邮箱登录失败: ${s2.message}` }) : new te({ message: "邮箱登录失败" });
    }
    async activate(e2) {
      return this._request.send("auth.activateEndUserMail", { token: e2 });
    }
    async resetPasswordWithToken(e2, t2) {
      return this._request.send("auth.resetPasswordWithToken", { token: e2, newPassword: t2 });
    }
  }
  class ut extends st {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      "string" != typeof t2 && (t2 = "", console.warn("password is empty"));
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: ze.USERNAME, username: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token_expire: i2, access_token: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), o2 && i2 ? this.setAccessToken(o2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.USERNAME, persistence: this.config.persistence }), new it(this.config.env);
      throw s2.code ? new te({ code: s2.code, message: `用户名密码登录失败: ${s2.message}` }) : new te({ message: "用户名密码登录失败" });
    }
  }
  class ht {
    constructor(e2) {
      this.config = e2, this._cache = Ue(e2.env), this._request = nt(e2.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), Fe(We, this._onLoginTypeChanged);
    }
    get currentUser() {
      const e2 = this.hasLoginState();
      return e2 && e2.user || null;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
    anonymousAuthProvider() {
      return new ot(this.config);
    }
    customAuthProvider() {
      return new at(this.config);
    }
    emailAuthProvider() {
      return new ct(this.config);
    }
    usernameAuthProvider() {
      return new ut(this.config);
    }
    async signInAnonymously() {
      return new ot(this.config).signIn();
    }
    async signInWithEmailAndPassword(e2, t2) {
      return new ct(this.config).signIn(e2, t2);
    }
    signInWithUsernameAndPassword(e2, t2) {
      return new ut(this.config).signIn(e2, t2);
    }
    async linkAndRetrieveDataWithTicket(e2) {
      this._anonymousAuthProvider || (this._anonymousAuthProvider = new ot(this.config)), Fe(He, this._onAnonymousConverted);
      return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e2);
    }
    async signOut() {
      if (this.loginType === ze.ANONYMOUS)
        throw new te({ message: "匿名用户不支持登出操作" });
      const { refreshTokenKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e2);
      if (!s2)
        return;
      const r2 = await this._request.send("auth.logout", { refresh_token: s2 });
      return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.removeStore(n2), Ke($e), Ke(We, { env: this.config.env, loginType: ze.NULL, persistence: this.config.persistence }), r2;
    }
    async signUpWithEmailAndPassword(e2, t2) {
      return this._request.send("auth.signUpWithEmailAndPassword", { email: e2, password: t2 });
    }
    async sendPasswordResetEmail(e2) {
      return this._request.send("auth.sendPasswordResetEmail", { email: e2 });
    }
    onLoginStateChanged(e2) {
      Fe($e, () => {
        const t3 = this.hasLoginState();
        e2.call(this, t3);
      });
      const t2 = this.hasLoginState();
      e2.call(this, t2);
    }
    onLoginStateExpired(e2) {
      Fe(Be, e2.bind(this));
    }
    onAccessTokenRefreshed(e2) {
      Fe(Je, e2.bind(this));
    }
    onAnonymousConverted(e2) {
      Fe(He, e2.bind(this));
    }
    onLoginTypeChanged(e2) {
      Fe(We, () => {
        const t2 = this.hasLoginState();
        e2.call(this, t2);
      });
    }
    async getAccessToken() {
      return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
    }
    hasLoginState() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
      return this._request.oauth.isAccessTokenExpired(n2, s2) ? null : new it(this.config.env);
    }
    async isUsernameRegistered(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e2 });
      return t2 && t2.isRegistered;
    }
    getLoginState() {
      return Promise.resolve(this.hasLoginState());
    }
    async signInWithTicket(e2) {
      return new at(this.config).signIn(e2);
    }
    shouldRefreshAccessToken(e2) {
      this._request._shouldRefreshAccessTokenHook = e2.bind(this);
    }
    getUserInfo() {
      return this._request.send("auth.getUserInfo", {}).then((e2) => e2.code ? e2 : { ...e2.data, requestId: e2.seqId });
    }
    getAuthHeader() {
      const { refreshTokenKey: e2, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2);
      return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
    }
    _onAnonymousConverted(e2) {
      const { env: t2 } = e2.data;
      t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
    }
    _onLoginTypeChanged(e2) {
      const { loginType: t2, persistence: n2, env: s2 } = e2.data;
      s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
    }
  }
  const lt = function(e2, t2) {
    t2 = t2 || ve();
    const n2 = nt(this.config.env), { cloudPath: s2, filePath: r2, onUploadProgress: i2, fileType: o2 = "image" } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      const { data: { url: a2, authorization: c2, token: u2, fileId: h2, cosFileId: l2 }, requestId: d2 } = e3, p2 = { key: s2, signature: c2, "x-cos-meta-fileid": l2, success_action_status: "201", "x-cos-security-token": u2 };
      n2.upload({ url: a2, data: p2, file: r2, name: s2, fileType: o2, onUploadProgress: i2 }).then((e4) => {
        201 === e4.statusCode ? t2(null, { fileID: h2, requestId: d2 }) : t2(new te({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e4.data}` }));
      }).catch((e4) => {
        t2(e4);
      });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, dt = function(e2, t2) {
    t2 = t2 || ve();
    const n2 = nt(this.config.env), { cloudPath: s2 } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      t2(null, e3);
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, pt = function({ fileList: e2 }, t2) {
    if (t2 = t2 || ve(), !e2 || !Array.isArray(e2))
      return { code: "INVALID_PARAM", message: "fileList必须是非空的数组" };
    for (let t3 of e2)
      if (!t3 || "string" != typeof t3)
        return { code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" };
    const n2 = { fileid_list: e2 };
    return nt(this.config.env).send("storage.batchDeleteFile", n2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.delete_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, ft = function({ fileList: e2 }, t2) {
    t2 = t2 || ve(), e2 && Array.isArray(e2) || t2(null, { code: "INVALID_PARAM", message: "fileList必须是非空的数组" });
    let n2 = [];
    for (let s3 of e2)
      "object" == typeof s3 ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是包含fileID和maxAge的对象" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : "string" == typeof s3 ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是字符串" });
    const s2 = { file_list: n2 };
    return nt(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.download_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, gt = async function({ fileID: e2 }, t2) {
    const n2 = (await ft.call(this, { fileList: [{ fileID: e2, maxAge: 600 }] })).fileList[0];
    if ("SUCCESS" !== n2.code)
      return t2 ? t2(n2) : new Promise((e3) => {
        e3(n2);
      });
    const s2 = nt(this.config.env);
    let r2 = n2.download_url;
    if (r2 = encodeURI(r2), !t2)
      return s2.download({ url: r2 });
    t2(await s2.download({ url: r2 }));
  }, mt = function({ name: e2, data: t2, query: n2, parse: s2, search: r2, timeout: i2 }, o2) {
    const a2 = o2 || ve();
    let c2;
    try {
      c2 = t2 ? JSON.stringify(t2) : "";
    } catch (e3) {
      return Promise.reject(e3);
    }
    if (!e2)
      return Promise.reject(new te({ code: "PARAM_ERROR", message: "函数名不能为空" }));
    const u2 = { inQuery: n2, parse: s2, search: r2, function_name: e2, request_data: c2 };
    return nt(this.config.env).send("functions.invokeFunction", u2, { timeout: i2 }).then((e3) => {
      if (e3.code)
        a2(null, e3);
      else {
        let t3 = e3.data.response_data;
        if (s2)
          a2(null, { result: t3, requestId: e3.requestId });
        else
          try {
            t3 = JSON.parse(e3.data.response_data), a2(null, { result: t3, requestId: e3.requestId });
          } catch (e4) {
            a2(new te({ message: "response data must be json" }));
          }
      }
      return a2.promise;
    }).catch((e3) => {
      a2(e3);
    }), a2.promise;
  }, yt = { timeout: 15e3, persistence: "session" }, _t = 6e5, wt = {};
  class It {
    constructor(e2) {
      this.config = e2 || this.config, this.authObj = void 0;
    }
    init(e2) {
      switch (Pe.adapter || (this.requestClient = new Pe.adapter.reqClass({ timeout: e2.timeout || 5e3, timeoutMsg: `请求在${(e2.timeout || 5e3) / 1e3}s内未完成，已中断` })), this.config = { ...yt, ...e2 }, true) {
        case this.config.timeout > _t:
          console.warn("timeout大于可配置上限[10分钟]，已重置为上限数值"), this.config.timeout = _t;
          break;
        case this.config.timeout < 100:
          console.warn("timeout小于可配置下限[100ms]，已重置为下限数值"), this.config.timeout = 100;
      }
      return new It(this.config);
    }
    auth({ persistence: e2 } = {}) {
      if (this.authObj)
        return this.authObj;
      const t2 = e2 || Pe.adapter.primaryStorage || yt.persistence;
      var n2;
      return t2 !== this.config.persistence && (this.config.persistence = t2), function(e3) {
        const { env: t3 } = e3;
        Re[t3] = new Ne(e3), Le[t3] = new Ne({ ...e3, persistence: "local" });
      }(this.config), n2 = this.config, tt[n2.env] = new et(n2), this.authObj = new ht(this.config), this.authObj;
    }
    on(e2, t2) {
      return Fe.apply(this, [e2, t2]);
    }
    off(e2, t2) {
      return je.apply(this, [e2, t2]);
    }
    callFunction(e2, t2) {
      return mt.apply(this, [e2, t2]);
    }
    deleteFile(e2, t2) {
      return pt.apply(this, [e2, t2]);
    }
    getTempFileURL(e2, t2) {
      return ft.apply(this, [e2, t2]);
    }
    downloadFile(e2, t2) {
      return gt.apply(this, [e2, t2]);
    }
    uploadFile(e2, t2) {
      return lt.apply(this, [e2, t2]);
    }
    getUploadMetadata(e2, t2) {
      return dt.apply(this, [e2, t2]);
    }
    registerExtension(e2) {
      wt[e2.name] = e2;
    }
    async invokeExtension(e2, t2) {
      const n2 = wt[e2];
      if (!n2)
        throw new te({ message: `扩展${e2} 必须先注册` });
      return await n2.invoke(t2, this);
    }
    useAdapters(e2) {
      const { adapter: t2, runtime: n2 } = Ae(e2) || {};
      t2 && (Pe.adapter = t2), n2 && (Pe.runtime = n2);
    }
  }
  var vt = new It();
  function St(e2, t2, n2) {
    void 0 === n2 && (n2 = {});
    var s2 = /\?/.test(t2), r2 = "";
    for (var i2 in n2)
      "" === r2 ? !s2 && (t2 += "?") : r2 += "&", r2 += i2 + "=" + encodeURIComponent(n2[i2]);
    return /^http(s)?:\/\//.test(t2 += r2) ? t2 : "" + e2 + t2;
  }
  class Tt {
    get(e2) {
      const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
      return new Promise((e3, i2) => {
        ne.request({ url: St("https:", t2), data: n2, method: "GET", header: s2, timeout: r2, success(t3) {
          e3(t3);
        }, fail(e4) {
          i2(e4);
        } });
      });
    }
    post(e2) {
      const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
      return new Promise((e3, i2) => {
        ne.request({ url: St("https:", t2), data: n2, method: "POST", header: s2, timeout: r2, success(t3) {
          e3(t3);
        }, fail(e4) {
          i2(e4);
        } });
      });
    }
    upload(e2) {
      return new Promise((t2, n2) => {
        const { url: s2, file: r2, data: i2, headers: o2, fileType: a2 } = e2, c2 = ne.uploadFile({ url: St("https:", s2), name: "file", formData: Object.assign({}, i2), filePath: r2, fileType: a2, header: o2, success(e3) {
          const n3 = { statusCode: e3.statusCode, data: e3.data || {} };
          200 === e3.statusCode && i2.success_action_status && (n3.statusCode = parseInt(i2.success_action_status, 10)), t2(n3);
        }, fail(e3) {
          n2(new Error(e3.errMsg || "uploadFile:fail"));
        } });
        "function" == typeof e2.onUploadProgress && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((t3) => {
          e2.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
        });
      });
    }
  }
  const bt = { setItem(e2, t2) {
    ne.setStorageSync(e2, t2);
  }, getItem: (e2) => ne.getStorageSync(e2), removeItem(e2) {
    ne.removeStorageSync(e2);
  }, clear() {
    ne.clearStorageSync();
  } };
  var Et = { genAdapter: function() {
    return { root: {}, reqClass: Tt, localStorage: bt, primaryStorage: "local" };
  }, isMatch: function() {
    return true;
  }, runtime: "uni_app" };
  vt.useAdapters(Et);
  const kt = vt, At = kt.init;
  kt.init = function(e2) {
    e2.env = e2.spaceId;
    const t2 = At.call(this, e2);
    t2.config.provider = "tencent", t2.config.spaceId = e2.spaceId;
    const n2 = t2.auth;
    return t2.auth = function(e3) {
      const t3 = n2.call(this, e3);
      return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e4) => {
        var n3;
        t3[e4] = (n3 = t3[e4], function(e5) {
          e5 = e5 || {};
          const { success: t4, fail: s2, complete: r2 } = ee(e5);
          if (!(t4 || s2 || r2))
            return n3.call(this, e5);
          n3.call(this, e5).then((e6) => {
            t4 && t4(e6), r2 && r2(e6);
          }, (e6) => {
            s2 && s2(e6), r2 && r2(e6);
          });
        }).bind(t3);
      }), t3;
    }, t2.customAuth = t2.auth, t2;
  };
  var Pt = kt;
  async function Ct(e2, t2) {
    const n2 = `http://${e2}:${t2}/system/ping`;
    try {
      const e3 = await (s2 = { url: n2, timeout: 500 }, new Promise((e4, t3) => {
        ne.request({ ...s2, success(t4) {
          e4(t4);
        }, fail(e5) {
          t3(e5);
        } });
      }));
      return !(!e3.data || 0 !== e3.data.code);
    } catch (e3) {
      return false;
    }
    var s2;
  }
  async function Ot(e2, t2) {
    let n2;
    for (let s2 = 0; s2 < e2.length; s2++) {
      const r2 = e2[s2];
      if (await Ct(r2, t2)) {
        n2 = r2;
        break;
      }
    }
    return { address: n2, port: t2 };
  }
  const xt = { "serverless.file.resource.generateProximalSign": "storage/generate-proximal-sign", "serverless.file.resource.report": "storage/report", "serverless.file.resource.delete": "storage/delete", "serverless.file.resource.getTempFileURL": "storage/get-temp-file-url" };
  var Nt = class {
    constructor(e2) {
      if (["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), !e2.endpoint)
        throw new Error("集群空间未配置ApiEndpoint，配置后需要重新关联服务空间后生效");
      this.config = Object.assign({}, e2), this.config.provider = "dcloud", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.adapter = ne;
    }
    async request(e2, t2 = true) {
      const n2 = t2;
      return e2 = n2 ? await this.setupLocalRequest(e2) : this.setupRequest(e2), Promise.resolve().then(() => n2 ? this.requestLocal(e2) : de.wrappedRequest(e2, this.adapter.request));
    }
    requestLocal(e2) {
      return new Promise((t2, n2) => {
        this.adapter.request(Object.assign(e2, { complete(e3) {
          if (e3 || (e3 = {}), !e3.statusCode || e3.statusCode >= 400) {
            const t3 = e3.data && e3.data.code || "SYS_ERR", s2 = e3.data && e3.data.message || "request:fail";
            return n2(new te({ code: t3, message: s2 }));
          }
          t2({ success: true, result: e3.data });
        } }));
      });
    }
    setupRequest(e2) {
      const t2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), n2 = { "Content-Type": "application/json" };
      n2["x-serverless-sign"] = de.sign(t2, this.config.clientSecret);
      const s2 = le();
      n2["x-client-info"] = encodeURIComponent(JSON.stringify(s2));
      const { token: r2 } = re();
      return n2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: t2, dataType: "json", header: JSON.parse(JSON.stringify(n2)) };
    }
    async setupLocalRequest(e2) {
      const t2 = le(), { token: n2 } = re(), s2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now(), clientInfo: t2, token: n2 }), { address: r2, servePort: i2 } = this.__dev__ && this.__dev__.debugInfo || {}, { address: o2 } = await Ot(r2, i2);
      return { url: `http://${o2}:${i2}/${xt[e2.method]}`, method: "POST", data: s2, dataType: "json", header: JSON.parse(JSON.stringify({ "Content-Type": "application/json" })) };
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request(t2, false);
    }
    getUploadFileOptions(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    reportUploadFile(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
      if (!t2)
        throw new te({ code: "CLOUDPATH_REQUIRED", message: "cloudPath不可为空" });
      let r2;
      return this.getUploadFileOptions({ cloudPath: t2 }).then((t3) => {
        const { url: i2, formData: o2, name: a2 } = t3.result;
        return r2 = t3.result.fileUrl, new Promise((t4, r3) => {
          const c2 = this.adapter.uploadFile({ url: i2, formData: o2, name: a2, filePath: e2, fileType: n2, success(e3) {
            e3 && e3.statusCode < 400 ? t4(e3) : r3(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
          }, fail(e3) {
            r3(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
          } });
          "function" == typeof s2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
            s2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
          });
        });
      }).then(() => this.reportUploadFile({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e2, fileID: r2 }) : s3(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
      }));
    }
    deleteFile({ fileList: e2 }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e2 }) };
      return this.request(t2).then((e3) => {
        if (e3.success)
          return e3.result;
        throw new te({ code: "DELETE_FILE_FAILED", message: "删除文件失败" });
      });
    }
    getTempFileURL({ fileList: e2, maxAge: t2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const n2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e2, maxAge: t2 }) };
      return this.request(n2).then((e3) => {
        if (e3.success)
          return { fileList: e3.result.fileList.map((e4) => ({ fileID: e4.fileID, tempFileURL: e4.tempFileURL })) };
        throw new te({ code: "GET_TEMP_FILE_URL_FAILED", message: "获取临时文件链接失败" });
      });
    }
  };
  var Rt = { init(e2) {
    const t2 = new Nt(e2), n2 = { signInAnonymously: function() {
      return Promise.resolve();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } }, Lt = n(function(e2, t2) {
    e2.exports = r.enc.Hex;
  });
  function Ut() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e2) {
      var t2 = 16 * Math.random() | 0;
      return ("x" === e2 ? t2 : 3 & t2 | 8).toString(16);
    });
  }
  function Dt(e2 = "", t2 = {}) {
    const { data: n2, functionName: s2, method: r2, headers: i2, signHeaderKeys: o2 = [], config: a2 } = t2, c2 = String(Date.now()), u2 = Ut(), h2 = Object.assign({}, i2, { "x-from-app-id": a2.spaceAppId, "x-from-env-id": a2.spaceId, "x-to-env-id": a2.spaceId, "x-from-instance-id": c2, "x-from-function-name": s2, "x-client-timestamp": c2, "x-alipay-source": "client", "x-request-id": u2, "x-alipay-callid": u2, "x-trace-id": u2 }), l2 = ["x-from-app-id", "x-from-env-id", "x-to-env-id", "x-from-instance-id", "x-from-function-name", "x-client-timestamp"].concat(o2), [d2 = "", p2 = ""] = e2.split("?") || [], f2 = function(e3) {
      const t3 = "HMAC-SHA256", n3 = e3.signedHeaders.join(";"), s3 = e3.signedHeaders.map((t4) => `${t4.toLowerCase()}:${e3.headers[t4]}
`).join(""), r3 = we(e3.body).toString(Lt), i3 = `${e3.method.toUpperCase()}
${e3.path}
${e3.query}
${s3}
${n3}
${r3}
`, o3 = we(i3).toString(Lt), a3 = `${t3}
${e3.timestamp}
${o3}
`, c3 = Ie(a3, e3.secretKey).toString(Lt);
      return `${t3} Credential=${e3.secretId}, SignedHeaders=${n3}, Signature=${c3}`;
    }({ path: d2, query: p2, method: r2, headers: h2, timestamp: c2, body: JSON.stringify(n2), secretId: a2.accessKey, secretKey: a2.secretKey, signedHeaders: l2.sort() });
    return { url: `${a2.endpoint}${e2}`, headers: Object.assign({}, h2, { Authorization: f2 }) };
  }
  function Mt({ url: e2, data: t2, method: n2 = "POST", headers: s2 = {}, timeout: r2 }) {
    return new Promise((i2, o2) => {
      ne.request({ url: e2, method: n2, data: "object" == typeof t2 ? JSON.stringify(t2) : t2, header: s2, dataType: "json", timeout: r2, complete: (e3 = {}) => {
        const t3 = s2["x-trace-id"] || "";
        if (!e3.statusCode || e3.statusCode >= 400) {
          const { message: n3, errMsg: s3, trace_id: r3 } = e3.data || {};
          return o2(new te({ code: "SYS_ERR", message: n3 || s3 || "request:fail", requestId: r3 || t3 }));
        }
        i2({ status: e3.statusCode, data: e3.data, headers: e3.header, requestId: t3 });
      } });
    });
  }
  function qt(e2, t2) {
    const { path: n2, data: s2, method: r2 = "GET" } = e2, { url: i2, headers: o2 } = Dt(n2, { functionName: "", data: s2, method: r2, headers: { "x-alipay-cloud-mode": "oss", "x-data-api-type": "oss", "x-expire-timestamp": Date.now() + 6e4 }, signHeaderKeys: ["x-data-api-type", "x-expire-timestamp"], config: t2 });
    return Mt({ url: i2, data: s2, method: r2, headers: o2 }).then((e3) => {
      const t3 = e3.data || {};
      if (!t3.success)
        throw new te({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
      return t3.data || {};
    }).catch((e3) => {
      throw new te({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
    });
  }
  function Ft(e2 = "") {
    const t2 = e2.trim().replace(/^cloud:\/\//, ""), n2 = t2.indexOf("/");
    if (n2 <= 0)
      throw new te({ code: "INVALID_PARAM", message: "fileID不合法" });
    const s2 = t2.substring(0, n2), r2 = t2.substring(n2 + 1);
    return s2 !== this.config.spaceId && console.warn("file ".concat(e2, " does not belong to env ").concat(this.config.spaceId)), r2;
  }
  function Kt(e2 = "") {
    return "cloud://".concat(this.config.spaceId, "/").concat(e2.replace(/^\/+/, ""));
  }
  class jt {
    constructor(e2) {
      this.config = e2;
    }
    signedURL(e2, t2 = {}) {
      const n2 = `/ws/function/${e2}`, s2 = this.config.wsEndpoint.replace(/^ws(s)?:\/\//, ""), r2 = Object.assign({}, t2, { accessKeyId: this.config.accessKey, signatureNonce: Ut(), timestamp: "" + Date.now() }), i2 = [n2, ["accessKeyId", "authorization", "signatureNonce", "timestamp"].sort().map(function(e3) {
        return r2[e3] ? "".concat(e3, "=").concat(r2[e3]) : null;
      }).filter(Boolean).join("&"), `host:${s2}`].join("\n"), o2 = ["HMAC-SHA256", we(i2).toString(Lt)].join("\n"), a2 = Ie(o2, this.config.secretKey).toString(Lt), c2 = Object.keys(r2).map((e3) => `${e3}=${encodeURIComponent(r2[e3])}`).join("&");
      return `${this.config.wsEndpoint}${n2}?${c2}&signature=${a2}`;
    }
  }
  var $t = class {
    constructor(e2) {
      if (["spaceId", "spaceAppId", "accessKey", "secretKey"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), e2.endpoint) {
        if ("string" != typeof e2.endpoint)
          throw new Error("endpoint must be string");
        if (!/^https:\/\//.test(e2.endpoint))
          throw new Error("endpoint must start with https://");
        e2.endpoint = e2.endpoint.replace(/\/$/, "");
      }
      this.config = Object.assign({}, e2, { endpoint: e2.endpoint || `https://${e2.spaceId}.api-hz.cloudbasefunction.cn`, wsEndpoint: e2.wsEndpoint || `wss://${e2.spaceId}.api-hz.cloudbasefunction.cn` }), this._websocket = new jt(this.config);
    }
    callFunction(e2) {
      return function(e3, t2) {
        const { name: n2, data: s2, async: r2 = false, timeout: i2 } = e3, o2 = "POST", a2 = { "x-to-function-name": n2 };
        r2 && (a2["x-function-invoke-type"] = "async");
        const { url: c2, headers: u2 } = Dt("/functions/invokeFunction", { functionName: n2, data: s2, method: o2, headers: a2, signHeaderKeys: ["x-to-function-name"], config: t2 });
        return Mt({ url: c2, data: s2, method: o2, headers: u2, timeout: i2 }).then((e4) => {
          let t3 = 0;
          if (r2) {
            const n3 = e4.data || {};
            t3 = "200" === n3.errCode ? 0 : n3.errCode, e4.data = n3.data || {}, e4.errMsg = n3.errMsg;
          }
          if (0 !== t3)
            throw new te({ code: t3, message: e4.errMsg, requestId: e4.requestId });
          return { errCode: t3, success: 0 === t3, requestId: e4.requestId, result: e4.data };
        }).catch((e4) => {
          throw new te({ code: e4.errCode, message: e4.errMsg, requestId: e4.requestId });
        });
      }(e2, this.config);
    }
    uploadFileToOSS({ url: e2, filePath: t2, fileType: n2, formData: s2, onUploadProgress: r2 }) {
      return new Promise((i2, o2) => {
        const a2 = ne.uploadFile({ url: e2, filePath: t2, fileType: n2, formData: s2, name: "file", success(e3) {
          e3 && e3.statusCode < 400 ? i2(e3) : o2(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          o2(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof r2 && a2 && "function" == typeof a2.onProgressUpdate && a2.onProgressUpdate((e3) => {
          r2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    async uploadFile({ filePath: e2, cloudPath: t2 = "", fileType: n2 = "image", onUploadProgress: s2 }) {
      if ("string" !== g(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const r2 = await qt({ path: "/".concat(t2.replace(/^\//, ""), "?post_url") }, this.config), { file_id: i2, upload_url: o2, form_data: a2 } = r2, c2 = a2 && a2.reduce((e3, t3) => (e3[t3.key] = t3.value, e3), {});
      return this.uploadFileToOSS({ url: o2, filePath: e2, fileType: n2, formData: c2, onUploadProgress: s2 }).then(() => ({ fileID: i2 }));
    }
    async getTempFileURL({ fileList: e2 }) {
      return new Promise((t2, n2) => {
        (!e2 || e2.length < 0) && t2({ code: "INVALID_PARAM", message: "fileList不能为空数组" }), e2.length > 50 && t2({ code: "INVALID_PARAM", message: "fileList数组长度不能超过50" });
        const s2 = [];
        for (const n3 of e2) {
          let e3;
          "string" !== g(n3) && t2({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
          try {
            e3 = Ft.call(this, n3);
          } catch (t3) {
            console.warn(t3.errCode, t3.errMsg), e3 = n3;
          }
          s2.push({ file_id: e3, expire: 600 });
        }
        qt({ path: "/?download_url", data: { file_list: s2 }, method: "POST" }, this.config).then((e3) => {
          const { file_list: n3 = [] } = e3;
          t2({ fileList: n3.map((e4) => ({ fileID: Kt.call(this, e4.file_id), tempFileURL: e4.download_url })) });
        }).catch((e3) => n2(e3));
      });
    }
    async connectWebSocket(e2) {
      const { name: t2, query: n2 } = e2;
      return ne.connectSocket({ url: this._websocket.signedURL(t2, n2), complete: () => {
      } });
    }
  };
  var Bt = { init: (e2) => {
    e2.provider = "alipay";
    const t2 = new $t(e2);
    return t2.auth = function() {
      return { signInAnonymously: function() {
        return Promise.resolve();
      }, getLoginState: function() {
        return Promise.resolve(true);
      } };
    }, t2;
  } };
  function Wt({ data: e2 }) {
    let t2;
    t2 = le();
    const n2 = JSON.parse(JSON.stringify(e2 || {}));
    if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
      const { token: e3 } = re();
      e3 && (n2.uniIdToken = e3);
    }
    return n2;
  }
  async function Ht(e2 = {}) {
    await this.__dev__.initLocalNetwork();
    const { localAddress: t2, localPort: n2 } = this.__dev__, s2 = { aliyun: "aliyun", tencent: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], r2 = this.config.spaceId, i2 = `http://${t2}:${n2}/system/check-function`, o2 = `http://${t2}:${n2}/cloudfunctions/${e2.name}`;
    return new Promise((t3, n3) => {
      ne.request({ method: "POST", url: i2, data: { name: e2.name, platform: P, provider: s2, spaceId: r2 }, timeout: 3e3, success(e3) {
        t3(e3);
      }, fail() {
        t3({ data: { code: "NETWORK_ERROR", message: "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下，自动切换为已部署的云函数。" } });
      } });
    }).then(({ data: e3 } = {}) => {
      const { code: t3, message: n3 } = e3 || {};
      return { code: 0 === t3 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
    }).then(({ code: t3, message: n3 }) => {
      if (0 !== t3) {
        switch (t3) {
          case "MODULE_ENCRYPTED":
            console.error(`此云函数（${e2.name}）依赖加密公共模块不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "FUNCTION_ENCRYPTED":
            console.error(`此云函数（${e2.name}）已加密不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "ACTION_ENCRYPTED":
            console.error(n3 || "需要访问加密的uni-clientDB-action，自动切换为云端环境");
            break;
          case "NETWORK_ERROR":
            console.error(n3 || "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下");
            break;
          case "SWITCH_TO_CLOUD":
            break;
          default: {
            const e3 = `检测本地调试服务出现错误：${n3}，请检查网络环境或重启客户端再试`;
            throw console.error(e3), new Error(e3);
          }
        }
        return this._callCloudFunction(e2);
      }
      return new Promise((t4, n4) => {
        const r3 = Wt.call(this, { data: e2.data });
        ne.request({ method: "POST", url: o2, data: { provider: s2, platform: P, param: r3 }, timeout: e2.timeout, success: ({ statusCode: e3, data: s3 } = {}) => !e3 || e3 >= 400 ? n4(new te({ code: s3.code || "SYS_ERR", message: s3.message || "request:fail" })) : t4({ result: s3 }), fail(e3) {
          n4(new te({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
        } });
      });
    });
  }
  const Jt = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "，云函数[{functionName}]在云端不存在，请检查此云函数名称是否正确以及该云函数是否已上传到服务空间", mode: "append" }];
  var zt = /[\\^$.*+?()[\]{}|]/g, Vt = RegExp(zt.source);
  function Gt(e2, t2, n2) {
    return e2.replace(new RegExp((s2 = t2) && Vt.test(s2) ? s2.replace(zt, "\\$&") : s2, "g"), n2);
    var s2;
  }
  const Yt = { NONE: "none", REQUEST: "request", RESPONSE: "response", BOTH: "both" }, Qt = "_globalUniCloudStatus", Xt = "_globalUniCloudSecureNetworkCache__{spaceId}", Zt = "uni-secure-network", en$1 = { SYSTEM_ERROR: { code: 2e4, message: "System error" }, APP_INFO_INVALID: { code: 20101, message: "Invalid client" }, GET_ENCRYPT_KEY_FAILED: { code: 20102, message: "Get encrypt key failed" } }, tn = { 10001: "Secure network is not supported on current playground or unimpsdk", 10003: "Config missing in current app. If the problem pesist, please contact DCloud.", 10009: "Encrypt payload failed", 10010: "Decrypt response failed" };
  function nn(e2) {
    const { errSubject: t2, subject: n2, errCode: s2, errMsg: r2, code: i2, message: o2, cause: a2 } = e2 || {};
    return new te({ subject: t2 || n2 || Zt, code: s2 || i2 || en$1.SYSTEM_ERROR.code, message: r2 || o2, cause: a2 });
  }
  class sn {
    constructor({ secretType: e2, uniCloudIns: t2 } = {}) {
      this.clientType = "", this.secretType = e2 || Yt.NONE, this.uniCloudIns = t2;
      const { provider: n2, spaceId: s2 } = this.uniCloudIns.config;
      var r2;
      this.provider = n2, this.spaceId = s2, this.scopedGlobalCache = (r2 = this.uniCloudIns, U(Xt.replace("{spaceId}", r2.config.spaceId)));
    }
    getSystemInfo() {
      return this._systemInfo || (this._systemInfo = ce()), this._systemInfo;
    }
    get appId() {
      return this.getSystemInfo().appId;
    }
    get deviceId() {
      return this.getSystemInfo().deviceId;
    }
    async encryptData(e2) {
      return this.secretType === Yt.NONE ? e2 : this.platformEncryptData(e2);
    }
    async decryptResult(e2) {
      if (this.secretType === Yt.NONE)
        return e2;
      const { errCode: t2, errMsg: n2, content: s2 } = e2 || {};
      return t2 || !s2 ? e2 : this.secretType === Yt.REQUEST ? s2 : this.platformDecryptResult(e2);
    }
    wrapVerifyClientCallFunction(e2) {
      const t2 = this;
      return async function({ name: n2, data: s2 = {} } = {}) {
        await t2.prepare(), (s2 = JSON.parse(JSON.stringify(s2)))._uniCloudOptions = await t2.platformGetSignOption();
        let r2 = await e2({ name: n2, data: s2 });
        return t2.isClientKeyNotFound(r2) && (await t2.prepare({ forceUpdate: true }), s2._uniCloudOptions = await t2.platformGetSignOption(), r2 = await e2({ name: n2, data: s2 })), r2;
      };
    }
    wrapEncryptDataCallFunction(e2) {
      const t2 = this;
      return async function({ name: n2, data: s2 = {} } = {}) {
        await t2.prepare();
        const r2 = await t2.encryptData(s2);
        let i2 = await e2({ name: n2, data: r2 });
        if (t2.isClientKeyNotFound(i2)) {
          await t2.prepare({ forceUpdate: true });
          const r3 = await t2.encryptData(s2);
          i2 = await e2({ name: n2, data: r3 });
        }
        return i2.result = await t2.decryptResult(i2.result), i2;
      };
    }
  }
  let Fn, Kn;
  function Bn(e2) {
    const t2 = ["hasClientKey", "encryptGetClientKeyPayload", "setClientKey", "encrypt", "decrypt"], n2 = {};
    for (let s2 = 0; s2 < t2.length; s2++) {
      const r2 = t2[s2];
      n2[r2] = function(...t3) {
        return new Promise((n3, s3) => {
          "function" == typeof e2[r2] ? e2[r2](...t3, function({ type: e3, data: t4, errCode: r3, errMsg: i2, errSubject: o2, message: a2 } = {}) {
            "success" === e3 ? n3(t4) : s3(nn({ errCode: r3, errMsg: tn[r3] || i2 || a2, errSubject: o2 }));
          }) : s3(nn({ message: "请检查manifest.json内是否开启安全网络模块，另外注意标准基座不支持安全网络模块" }));
        });
      };
    }
    return n2;
  }
  class Wn extends sn {
    constructor(e2) {
      super(e2), this.clientType = "app", this.appUtils = { ...Bn(requireNativePlugin("plus")) }, this.systemInfo = Fn || (Fn = ce());
    }
    async hasClientKey() {
      return this._hasClientKey = await this.appUtils.hasClientKey({ provider: this.provider, spaceId: this.spaceId }), this._hasClientKey;
    }
    async getAppClientKey() {
      const { data: e2, key: t2 } = await this.appUtils.encryptGetClientKeyPayload({ data: JSON.stringify({}) }), n2 = (await this.uniCloudIns.callFunction({ name: "DCloud-clientDB", data: { redirectTo: "encryption", action: "getAppClientKey", data: e2, key: t2 } })).result || {};
      if (0 !== n2.errCode)
        throw function(e3) {
          return new te({ subject: e3.errSubject || Zt, code: e3.errCode || e3.code || en$1.SYSTEM_ERROR.code, message: e3.errMsg || e3.message || en$1.SYSTEM_ERROR.message });
        }(n2);
      const { clientKey: s2, key: r2 } = n2;
      await this.appUtils.setClientKey({ provider: this.provider, spaceId: this.spaceId, clientKey: s2, key: r2 });
    }
    async ensureClientKey({ forceUpdate: e2 = false } = {}) {
      if (true !== await this.hasClientKey() || e2)
        return e2 && this.scopedGlobalCache.initPromise && this.scopedGlobalCache.initStatus === d || !e2 && this.scopedGlobalCache.initPromise && this.scopedGlobalCache.initStatus !== f || (this.scopedGlobalCache.initPromise = this.getAppClientKey(), this.scopedGlobalCache.initPromise.then((e3) => {
          this.scopedGlobalCache.initStatus = p;
        }).catch((e3) => {
          throw this.scopedGlobalCache.initStatus = f, e3;
        }), this.scopedGlobalCache.initStatus = d), this.scopedGlobalCache.initPromise;
    }
    async prepare({ forceUpdate: e2 = false } = {}) {
      await this.ensureClientKey({ forceUpdate: e2 });
    }
    async platformGetSignOption() {
      const { data: e2, key: t2 } = await this.appUtils.encrypt({ provider: this.provider, spaceId: this.spaceId, data: JSON.stringify({}) });
      return { verifyClientSign: e2, encryptKeyId: t2 };
    }
    async platformEncryptData(e2) {
      const { data: t2, key: n2 } = await this.appUtils.encrypt({ provider: this.provider, spaceId: this.spaceId, data: JSON.stringify(e2) }), s2 = { secretType: this.secretType, encryptKeyId: n2 };
      return this.secretType === Yt.RESPONSE ? { content: e2, _uniCloudOptions: s2 } : { content: t2, _uniCloudOptions: s2 };
    }
    async platformDecryptResult(e2) {
      const { content: t2, _uniCloudOptions: n2 = {} } = e2, s2 = n2.encryptKeyId, r2 = await this.appUtils.decrypt({ provider: this.provider, spaceId: this.spaceId, data: t2, key: s2 });
      return JSON.parse(r2.data);
    }
    isClientKeyNotFound(e2 = {}) {
      const t2 = e2.result || {};
      return 70009 === t2.errCode && t2.errSubject === Zt;
    }
  }
  function Hn({ secretType: e2 } = {}) {
    return e2 === Yt.REQUEST || e2 === Yt.RESPONSE || e2 === Yt.BOTH;
  }
  function Jn({ name: e2, data: t2 = {} } = {}) {
    return "DCloud-clientDB" === e2 && "encryption" === t2.redirectTo && "getAppClientKey" === t2.action;
  }
  function zn({ provider: e2, spaceId: t2, functionName: n2 } = {}) {
    const { appId: s2, uniPlatform: r2, osName: i2 } = ce();
    let o2 = r2;
    "app" === r2 && (o2 = i2);
    const a2 = function({ provider: e3, spaceId: t3 } = {}) {
      const n3 = A;
      if (!n3)
        return {};
      e3 = /* @__PURE__ */ function(e4) {
        return "tencent" === e4 ? "tcb" : e4;
      }(e3);
      const s3 = n3.find((n4) => n4.provider === e3 && n4.spaceId === t3);
      return s3 && s3.config;
    }({ provider: e2, spaceId: t2 });
    if (!a2 || !a2.accessControl || !a2.accessControl.enable)
      return false;
    const c2 = a2.accessControl.function || {}, u2 = Object.keys(c2);
    if (0 === u2.length)
      return true;
    const h2 = function(e3, t3) {
      let n3, s3, r3;
      for (let i3 = 0; i3 < e3.length; i3++) {
        const o3 = e3[i3];
        o3 !== t3 ? "*" !== o3 ? o3.split(",").map((e4) => e4.trim()).indexOf(t3) > -1 && (s3 = o3) : r3 = o3 : n3 = o3;
      }
      return n3 || s3 || r3;
    }(u2, n2);
    if (!h2)
      return false;
    if ((c2[h2] || []).find((e3 = {}) => e3.appId === s2 && (e3.platform || "").toLowerCase() === o2.toLowerCase()))
      return true;
    throw console.error(`此应用[appId: ${s2}, platform: ${o2}]不在云端配置的允许访问的应用列表内，参考：https://uniapp.dcloud.net.cn/uniCloud/secure-network.html#verify-client`), nn(en$1.APP_INFO_INVALID);
  }
  function Vn({ functionName: e2, result: t2, logPvd: n2 }) {
    if (this.__dev__.debugLog && t2 && t2.requestId) {
      const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e2, requestId: t2.requestId });
      console.log(`[${n2}-request]${s2}[/${n2}-request]`);
    }
  }
  function Gn(e2) {
    const t2 = e2.callFunction, n2 = function(n3) {
      const s2 = n3.name;
      n3.data = Wt.call(e2, { data: n3.data });
      const r2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], i2 = Hn(n3), o2 = Jn(n3), a2 = i2 || o2;
      return t2.call(this, n3).then((e3) => (e3.errCode = 0, !a2 && Vn.call(this, { functionName: s2, result: e3, logPvd: r2 }), Promise.resolve(e3)), (e3) => (!a2 && Vn.call(this, { functionName: s2, result: e3, logPvd: r2 }), e3 && e3.message && (e3.message = function({ message: e4 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
        for (let s3 = 0; s3 < n4.length; s3++) {
          const { rule: r3, content: i3, mode: o3 } = n4[s3], a3 = e4.match(r3);
          if (!a3)
            continue;
          let c2 = i3;
          for (let e5 = 1; e5 < a3.length; e5++)
            c2 = Gt(c2, `{$${e5}}`, a3[e5]);
          for (const e5 in t3)
            c2 = Gt(c2, `{${e5}}`, t3[e5]);
          return "replace" === o3 ? c2 : e4 + c2;
        }
        return e4;
      }({ message: `[${n3.name}]: ${e3.message}`, formatter: Jt, extraInfo: { functionName: s2 } })), Promise.reject(e3)));
    };
    e2.callFunction = function(t3) {
      const { provider: s2, spaceId: r2 } = e2.config, i2 = t3.name;
      let o2, a2;
      if (t3.data = t3.data || {}, e2.__dev__.debugInfo && !e2.__dev__.debugInfo.forceRemote && O ? (e2._callCloudFunction || (e2._callCloudFunction = n2, e2._callLocalFunction = Ht), o2 = Ht) : o2 = n2, o2 = o2.bind(e2), Jn(t3))
        a2 = n2.call(e2, t3);
      else if (Hn(t3)) {
        a2 = new Kn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapEncryptDataCallFunction(n2.bind(e2))(t3);
      } else if (zn({ provider: s2, spaceId: r2, functionName: i2 })) {
        a2 = new Kn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapVerifyClientCallFunction(n2.bind(e2))(t3);
      } else
        a2 = o2(t3);
      return Object.defineProperty(a2, "result", { get: () => (console.warn("当前返回结果为Promise类型，不可直接访问其result属性，详情请参考：https://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), a2.then((e3) => e3);
    };
  }
  Kn = Wn;
  const Yn = Symbol("CLIENT_DB_INTERNAL");
  function Qn(e2, t2) {
    return e2.then = "DoNotReturnProxyWithAFunctionNamedThen", e2._internalType = Yn, e2.inspect = null, e2.__v_raw = void 0, new Proxy(e2, { get(e3, n2, s2) {
      if ("_uniClient" === n2)
        return null;
      if ("symbol" == typeof n2)
        return e3[n2];
      if (n2 in e3 || "string" != typeof n2) {
        const t3 = e3[n2];
        return "function" == typeof t3 ? t3.bind(e3) : t3;
      }
      return t2.get(e3, n2, s2);
    } });
  }
  function Xn(e2) {
    return { on: (t2, n2) => {
      e2[t2] = e2[t2] || [], e2[t2].indexOf(n2) > -1 || e2[t2].push(n2);
    }, off: (t2, n2) => {
      e2[t2] = e2[t2] || [];
      const s2 = e2[t2].indexOf(n2);
      -1 !== s2 && e2[t2].splice(s2, 1);
    } };
  }
  const Zn = ["db.Geo", "db.command", "command.aggregate"];
  function es(e2, t2) {
    return Zn.indexOf(`${e2}.${t2}`) > -1;
  }
  function ts(e2) {
    switch (g(e2 = se(e2))) {
      case "array":
        return e2.map((e3) => ts(e3));
      case "object":
        return e2._internalType === Yn || Object.keys(e2).forEach((t2) => {
          e2[t2] = ts(e2[t2]);
        }), e2;
      case "regexp":
        return { $regexp: { source: e2.source, flags: e2.flags } };
      case "date":
        return { $date: e2.toISOString() };
      default:
        return e2;
    }
  }
  function ns(e2) {
    return e2 && e2.content && e2.content.$method;
  }
  class ss {
    constructor(e2, t2, n2) {
      this.content = e2, this.prevStage = t2 || null, this.udb = null, this._database = n2;
    }
    toJSON() {
      let e2 = this;
      const t2 = [e2.content];
      for (; e2.prevStage; )
        e2 = e2.prevStage, t2.push(e2.content);
      return { $db: t2.reverse().map((e3) => ({ $method: e3.$method, $param: ts(e3.$param) })) };
    }
    toString() {
      return JSON.stringify(this.toJSON());
    }
    getAction() {
      const e2 = this.toJSON().$db.find((e3) => "action" === e3.$method);
      return e2 && e2.$param && e2.$param[0];
    }
    getCommand() {
      return { $db: this.toJSON().$db.filter((e2) => "action" !== e2.$method) };
    }
    get isAggregate() {
      let e2 = this;
      for (; e2; ) {
        const t2 = ns(e2), n2 = ns(e2.prevStage);
        if ("aggregate" === t2 && "collection" === n2 || "pipeline" === t2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isCommand() {
      let e2 = this;
      for (; e2; ) {
        if ("command" === ns(e2))
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isAggregateCommand() {
      let e2 = this;
      for (; e2; ) {
        const t2 = ns(e2), n2 = ns(e2.prevStage);
        if ("aggregate" === t2 && "command" === n2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    getNextStageFn(e2) {
      const t2 = this;
      return function() {
        return rs({ $method: e2, $param: ts(Array.from(arguments)) }, t2, t2._database);
      };
    }
    get count() {
      return this.isAggregate ? this.getNextStageFn("count") : function() {
        return this._send("count", Array.from(arguments));
      };
    }
    get remove() {
      return this.isCommand ? this.getNextStageFn("remove") : function() {
        return this._send("remove", Array.from(arguments));
      };
    }
    get() {
      return this._send("get", Array.from(arguments));
    }
    get add() {
      return this.isCommand ? this.getNextStageFn("add") : function() {
        return this._send("add", Array.from(arguments));
      };
    }
    update() {
      return this._send("update", Array.from(arguments));
    }
    end() {
      return this._send("end", Array.from(arguments));
    }
    get set() {
      return this.isCommand ? this.getNextStageFn("set") : function() {
        throw new Error("JQL禁止使用set方法");
      };
    }
    _send(e2, t2) {
      const n2 = this.getAction(), s2 = this.getCommand();
      if (s2.$db.push({ $method: e2, $param: ts(t2) }), b) {
        const e3 = s2.$db.find((e4) => "collection" === e4.$method), t3 = e3 && e3.$param;
        t3 && 1 === t3.length && "string" == typeof e3.$param[0] && e3.$param[0].indexOf(",") > -1 && console.warn("检测到使用JQL语法联表查询时，未使用getTemp先过滤主表数据，在主表数据量大的情况下可能会查询缓慢。\n- 如何优化请参考此文档：https://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- 如果主表数据量很小请忽略此信息，项目发行时不会出现此提示。");
      }
      return this._database._callCloudFunction({ action: n2, command: s2 });
    }
  }
  function rs(e2, t2, n2) {
    return Qn(new ss(e2, t2, n2), { get(e3, t3) {
      let s2 = "db";
      return e3 && e3.content && (s2 = e3.content.$method), es(s2, t3) ? rs({ $method: t3 }, e3, n2) : function() {
        return rs({ $method: t3, $param: ts(Array.from(arguments)) }, e3, n2);
      };
    } });
  }
  function is({ path: e2, method: t2 }) {
    return class {
      constructor() {
        this.param = Array.from(arguments);
      }
      toJSON() {
        return { $newDb: [...e2.map((e3) => ({ $method: e3 })), { $method: t2, $param: this.param }] };
      }
      toString() {
        return JSON.stringify(this.toJSON());
      }
    };
  }
  class os {
    constructor({ uniClient: e2 = {}, isJQL: t2 = false } = {}) {
      this._uniClient = e2, this._authCallBacks = {}, this._dbCallBacks = {}, e2._isDefault && (this._dbCallBacks = U("_globalUniCloudDatabaseCallback")), t2 || (this.auth = Xn(this._authCallBacks)), this._isJQL = t2, Object.assign(this, Xn(this._dbCallBacks)), this.env = Qn({}, { get: (e3, t3) => ({ $env: t3 }) }), this.Geo = Qn({}, { get: (e3, t3) => is({ path: ["Geo"], method: t3 }) }), this.serverDate = is({ path: [], method: "serverDate" }), this.RegExp = is({ path: [], method: "RegExp" });
    }
    getCloudEnv(e2) {
      if ("string" != typeof e2 || !e2.trim())
        throw new Error("getCloudEnv参数错误");
      return { $env: e2.replace("$cloudEnv_", "") };
    }
    _callback(e2, t2) {
      const n2 = this._dbCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    _callbackAuth(e2, t2) {
      const n2 = this._authCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    multiSend() {
      const e2 = Array.from(arguments), t2 = e2.map((e3) => {
        const t3 = e3.getAction(), n2 = e3.getCommand();
        if ("getTemp" !== n2.$db[n2.$db.length - 1].$method)
          throw new Error("multiSend只支持子命令内使用getTemp");
        return { action: t3, command: n2 };
      });
      return this._callCloudFunction({ multiCommand: t2, queryList: e2 });
    }
  }
  function as(e2, t2 = {}) {
    return Qn(new e2(t2), { get: (e3, t3) => es("db", t3) ? rs({ $method: t3 }, null, e3) : function() {
      return rs({ $method: t3, $param: ts(Array.from(arguments)) }, null, e3);
    } });
  }
  class cs extends os {
    _parseResult(e2) {
      return this._isJQL ? e2.result : e2;
    }
    _callCloudFunction({ action: e2, command: t2, multiCommand: n2, queryList: s2 }) {
      function r2(e3, t3) {
        if (n2 && s2)
          for (let n3 = 0; n3 < s2.length; n3++) {
            const r3 = s2[n3];
            r3.udb && "function" == typeof r3.udb.setResult && (t3 ? r3.udb.setResult(t3) : r3.udb.setResult(e3.result.dataList[n3]));
          }
      }
      const i2 = this, o2 = this._isJQL ? "databaseForJQL" : "database";
      function a2(e3) {
        return i2._callback("error", [e3]), j($(o2, "fail"), e3).then(() => j($(o2, "complete"), e3)).then(() => (r2(null, e3), Y(H.RESPONSE, { type: J.CLIENT_DB, content: e3 }), Promise.reject(e3)));
      }
      const c2 = j($(o2, "invoke")), u2 = this._uniClient;
      return c2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: l.CLIENT_DB, data: { action: e2, command: t2, multiCommand: n2 } })).then((e3) => {
        const { code: t3, message: n3, token: s3, tokenExpired: c3, systemInfo: u3 = [] } = e3.result;
        if (u3)
          for (let e4 = 0; e4 < u3.length; e4++) {
            const { level: t4, message: n4, detail: s4 } = u3[e4];
            let r3 = "[System Info]" + n4;
            s4 && (r3 = `${r3}
详细信息：${s4}`), (console["warn" === t4 ? "error" : t4] || console.log)(r3);
          }
        if (t3) {
          return a2(new te({ code: t3, message: n3, requestId: e3.requestId }));
        }
        e3.result.errCode = e3.result.errCode || e3.result.code, e3.result.errMsg = e3.result.errMsg || e3.result.message, s3 && c3 && (ie({ token: s3, tokenExpired: c3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: c3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: c3 }]), Y(H.REFRESH_TOKEN, { token: s3, tokenExpired: c3 }));
        const h2 = [{ prop: "affectedDocs", tips: "affectedDocs不再推荐使用，请使用inserted/deleted/updated/data.length替代" }, { prop: "code", tips: "code不再推荐使用，请使用errCode替代" }, { prop: "message", tips: "message不再推荐使用，请使用errMsg替代" }];
        for (let t4 = 0; t4 < h2.length; t4++) {
          const { prop: n4, tips: s4 } = h2[t4];
          if (n4 in e3.result) {
            const t5 = e3.result[n4];
            Object.defineProperty(e3.result, n4, { get: () => (console.warn(s4), t5) });
          }
        }
        return function(e4) {
          return j($(o2, "success"), e4).then(() => j($(o2, "complete"), e4)).then(() => {
            r2(e4, null);
            const t4 = i2._parseResult(e4);
            return Y(H.RESPONSE, { type: J.CLIENT_DB, content: t4 }), Promise.resolve(t4);
          });
        }(e3);
      }, (e3) => {
        /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e3.message) && console.warn("clientDB未初始化，请在web控制台保存一次schema以开启clientDB");
        return a2(new te({ code: e3.code || "SYSTEM_ERROR", message: e3.message, requestId: e3.requestId }));
      });
    }
  }
  const us = "token无效，跳转登录页面", hs = "token过期，跳转登录页面", ls = { TOKEN_INVALID_TOKEN_EXPIRED: hs, TOKEN_INVALID_INVALID_CLIENTID: us, TOKEN_INVALID: us, TOKEN_INVALID_WRONG_TOKEN: us, TOKEN_INVALID_ANONYMOUS_USER: us }, ds = { "uni-id-token-expired": hs, "uni-id-check-token-failed": us, "uni-id-token-not-exist": us, "uni-id-check-device-feature-failed": us }, ps = { ...ls, ...ds, default: "用户未登录或登录状态过期，自动跳转登录页面" };
  function fs(e2, t2) {
    let n2 = "";
    return n2 = e2 ? `${e2}/${t2}` : t2, n2.replace(/^\//, "");
  }
  function gs(e2 = [], t2 = "") {
    const n2 = [], s2 = [];
    return e2.forEach((e3) => {
      true === e3.needLogin ? n2.push(fs(t2, e3.path)) : false === e3.needLogin && s2.push(fs(t2, e3.path));
    }), { needLoginPage: n2, notNeedLoginPage: s2 };
  }
  function ms(e2) {
    return e2.split("?")[0].replace(/^\//, "");
  }
  function ys() {
    return function(e2) {
      let t2 = e2 && e2.$page && e2.$page.fullPath;
      return t2 ? ("/" !== t2.charAt(0) && (t2 = "/" + t2), t2) : "";
    }(function() {
      const e2 = getCurrentPages();
      return e2[e2.length - 1];
    }());
  }
  function _s() {
    return ms(ys());
  }
  function ws(e2 = "", t2 = {}) {
    if (!e2)
      return false;
    if (!(t2 && t2.list && t2.list.length))
      return false;
    const n2 = t2.list, s2 = ms(e2);
    return n2.some((e3) => e3.pagePath === s2);
  }
  const Is = !!e.uniIdRouter;
  const { loginPage: vs, routerNeedLogin: Ss, resToLogin: Ts, needLoginPage: bs, notNeedLoginPage: Es, loginPageInTabBar: ks } = function({ pages: t2 = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: r2 = {} } = e) {
    const { loginPage: i2, needLogin: o2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = gs(t2), { needLoginPage: h2, notNeedLoginPage: l2 } = function(e2 = []) {
      const t3 = [], n3 = [];
      return e2.forEach((e3) => {
        const { root: s3, pages: r3 = [] } = e3, { needLoginPage: i3, notNeedLoginPage: o3 } = gs(r3, s3);
        t3.push(...i3), n3.push(...o3);
      }), { needLoginPage: t3, notNeedLoginPage: n3 };
    }(n2);
    return { loginPage: i2, routerNeedLogin: o2, resToLogin: a2, needLoginPage: [...c2, ...h2], notNeedLoginPage: [...u2, ...l2], loginPageInTabBar: ws(i2, r2) };
  }();
  if (bs.indexOf(vs) > -1)
    throw new Error(`Login page [${vs}] should not be "needLogin", please check your pages.json`);
  function As(e2) {
    const t2 = _s();
    if ("/" === e2.charAt(0))
      return e2;
    const [n2, s2] = e2.split("?"), r2 = n2.replace(/^\//, "").split("/"), i2 = t2.split("/");
    i2.pop();
    for (let e3 = 0; e3 < r2.length; e3++) {
      const t3 = r2[e3];
      ".." === t3 ? i2.pop() : "." !== t3 && i2.push(t3);
    }
    return "" === i2[0] && i2.shift(), "/" + i2.join("/") + (s2 ? "?" + s2 : "");
  }
  function Ps(e2) {
    const t2 = ms(As(e2));
    return !(Es.indexOf(t2) > -1) && (bs.indexOf(t2) > -1 || Ss.some((t3) => function(e3, t4) {
      return new RegExp(t4).test(e3);
    }(e2, t3)));
  }
  function Cs({ redirect: e2 }) {
    const t2 = ms(e2), n2 = ms(vs);
    return _s() !== n2 && t2 !== n2;
  }
  function Os({ api: e2, redirect: t2 } = {}) {
    if (!t2 || !Cs({ redirect: t2 }))
      return;
    const n2 = function(e3, t3) {
      return "/" !== e3.charAt(0) && (e3 = "/" + e3), t3 ? e3.indexOf("?") > -1 ? e3 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3;
    }(vs, t2);
    ks ? "navigateTo" !== e2 && "redirectTo" !== e2 || (e2 = "switchTab") : "switchTab" === e2 && (e2 = "navigateTo");
    const s2 = { navigateTo: uni.navigateTo, redirectTo: uni.redirectTo, switchTab: uni.switchTab, reLaunch: uni.reLaunch };
    setTimeout(() => {
      s2[e2]({ url: n2 });
    }, 0);
  }
  function xs({ url: e2 } = {}) {
    const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
      const { token: e3, tokenExpired: t3 } = re();
      let n3;
      if (e3) {
        if (t3 < Date.now()) {
          const e4 = "uni-id-token-expired";
          n3 = { errCode: e4, errMsg: ps[e4] };
        }
      } else {
        const e4 = "uni-id-check-token-failed";
        n3 = { errCode: e4, errMsg: ps[e4] };
      }
      return n3;
    }();
    if (Ps(e2) && n2) {
      n2.uniIdRedirectUrl = e2;
      if (z(H.NEED_LOGIN).length > 0)
        return setTimeout(() => {
          Y(H.NEED_LOGIN, n2);
        }, 0), t2.abortLoginPageJump = true, t2;
      t2.autoToLoginPage = true;
    }
    return t2;
  }
  function Ns() {
    !function() {
      const e3 = ys(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = xs({ url: e3 });
      t2 || n2 && Os({ api: "redirectTo", redirect: e3 });
    }();
    const e2 = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
    for (let t2 = 0; t2 < e2.length; t2++) {
      const n2 = e2[t2];
      uni.addInterceptor(n2, { invoke(e3) {
        const { abortLoginPageJump: t3, autoToLoginPage: s2 } = xs({ url: e3.url });
        return t3 ? e3 : s2 ? (Os({ api: n2, redirect: As(e3.url) }), false) : e3;
      } });
    }
  }
  function Rs() {
    this.onResponse((e2) => {
      const { type: t2, content: n2 } = e2;
      let s2 = false;
      switch (t2) {
        case "cloudobject":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in ps;
          }(n2);
          break;
        case "clientdb":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in ls;
          }(n2);
      }
      s2 && function(e3 = {}) {
        const t3 = z(H.NEED_LOGIN);
        Z().then(() => {
          const n3 = ys();
          if (n3 && Cs({ redirect: n3 }))
            return t3.length > 0 ? Y(H.NEED_LOGIN, Object.assign({ uniIdRedirectUrl: n3 }, e3)) : void (vs && Os({ api: "navigateTo", redirect: n3 }));
        });
      }(n2);
    });
  }
  function Ls(e2) {
    !function(e3) {
      e3.onResponse = function(e4) {
        V(H.RESPONSE, e4);
      }, e3.offResponse = function(e4) {
        G(H.RESPONSE, e4);
      };
    }(e2), function(e3) {
      e3.onNeedLogin = function(e4) {
        V(H.NEED_LOGIN, e4);
      }, e3.offNeedLogin = function(e4) {
        G(H.NEED_LOGIN, e4);
      }, Is && (U(Qt).needLoginInit || (U(Qt).needLoginInit = true, Z().then(() => {
        Ns.call(e3);
      }), Ts && Rs.call(e3)));
    }(e2), function(e3) {
      e3.onRefreshToken = function(e4) {
        V(H.REFRESH_TOKEN, e4);
      }, e3.offRefreshToken = function(e4) {
        G(H.REFRESH_TOKEN, e4);
      };
    }(e2);
  }
  let Us;
  const Ds = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Ms = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
  function qs() {
    const e2 = re().token || "", t2 = e2.split(".");
    if (!e2 || 3 !== t2.length)
      return { uid: null, role: [], permission: [], tokenExpired: 0 };
    let n2;
    try {
      n2 = JSON.parse((s2 = t2[1], decodeURIComponent(Us(s2).split("").map(function(e3) {
        return "%" + ("00" + e3.charCodeAt(0).toString(16)).slice(-2);
      }).join(""))));
    } catch (e3) {
      throw new Error("获取当前用户信息出错，详细错误信息为：" + e3.message);
    }
    var s2;
    return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
  }
  Us = "function" != typeof atob ? function(e2) {
    if (e2 = String(e2).replace(/[\t\n\f\r ]+/g, ""), !Ms.test(e2))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e2 += "==".slice(2 - (3 & e2.length));
    for (var n2, s2, r2 = "", i2 = 0; i2 < e2.length; )
      t2 = Ds.indexOf(e2.charAt(i2++)) << 18 | Ds.indexOf(e2.charAt(i2++)) << 12 | (n2 = Ds.indexOf(e2.charAt(i2++))) << 6 | (s2 = Ds.indexOf(e2.charAt(i2++))), r2 += 64 === n2 ? String.fromCharCode(t2 >> 16 & 255) : 64 === s2 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return r2;
  } : atob;
  var Fs = n(function(e2, t2) {
    Object.defineProperty(t2, "__esModule", { value: true });
    const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
    function r2(e3, t3) {
      return e3.tempFiles.forEach((e4, n3) => {
        e4.name || (e4.name = e4.path.substring(e4.path.lastIndexOf("/") + 1)), t3 && (e4.fileType = t3), e4.cloudPath = Date.now() + "_" + n3 + e4.name.substring(e4.name.lastIndexOf("."));
      }), e3.tempFilePaths || (e3.tempFilePaths = e3.tempFiles.map((e4) => e4.path)), e3;
    }
    function i2(e3, t3, { onChooseFile: s3, onUploadProgress: r3 }) {
      return t3.then((e4) => {
        if (s3) {
          const t4 = s3(e4);
          if (void 0 !== t4)
            return Promise.resolve(t4).then((t5) => void 0 === t5 ? e4 : t5);
        }
        return e4;
      }).then((t4) => false === t4 ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e4, t5, s4 = 5, r4) {
        (t5 = Object.assign({}, t5)).errMsg = n2;
        const i3 = t5.tempFiles, o2 = i3.length;
        let a2 = 0;
        return new Promise((n3) => {
          for (; a2 < s4; )
            c2();
          function c2() {
            const s5 = a2++;
            if (s5 >= o2)
              return void (!i3.find((e5) => !e5.url && !e5.errMsg) && n3(t5));
            const u2 = i3[s5];
            e4.uploadFile({ provider: u2.provider, filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, cloudPathAsRealPath: u2.cloudPathAsRealPath, onUploadProgress(e5) {
              e5.index = s5, e5.tempFile = u2, e5.tempFilePath = u2.path, r4 && r4(e5);
            } }).then((e5) => {
              u2.url = e5.fileID, s5 < o2 && c2();
            }).catch((e5) => {
              u2.errMsg = e5.errMsg || e5.message, s5 < o2 && c2();
            });
          }
        });
      }(e3, t4, 5, r3));
    }
    t2.initChooseAndUploadFile = function(e3) {
      return function(t3 = { type: "all" }) {
        return "image" === t3.type ? i2(e3, function(e4) {
          const { count: t4, sizeType: n3, sourceType: i3 = ["album", "camera"], extension: o2 } = e4;
          return new Promise((e5, a2) => {
            uni.chooseImage({ count: t4, sizeType: n3, sourceType: i3, extension: o2, success(t5) {
              e5(r2(t5, "image"));
            }, fail(e6) {
              a2({ errMsg: e6.errMsg.replace("chooseImage:fail", s2) });
            } });
          });
        }(t3), t3) : "video" === t3.type ? i2(e3, function(e4) {
          const { camera: t4, compressed: n3, maxDuration: i3, sourceType: o2 = ["album", "camera"], extension: a2 } = e4;
          return new Promise((e5, c2) => {
            uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: i3, sourceType: o2, extension: a2, success(t5) {
              const { tempFilePath: n4, duration: s3, size: i4, height: o3, width: a3 } = t5;
              e5(r2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: i4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: o3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
            }, fail(e6) {
              c2({ errMsg: e6.errMsg.replace("chooseVideo:fail", s2) });
            } });
          });
        }(t3), t3) : i2(e3, function(e4) {
          const { count: t4, extension: n3 } = e4;
          return new Promise((e5, i3) => {
            let o2 = uni.chooseFile;
            if ("undefined" != typeof wx && "function" == typeof wx.chooseMessageFile && (o2 = wx.chooseMessageFile), "function" != typeof o2)
              return i3({ errMsg: s2 + " 请指定 type 类型，该平台仅支持选择 image 或 video。" });
            o2({ type: "all", count: t4, extension: n3, success(t5) {
              e5(r2(t5));
            }, fail(e6) {
              i3({ errMsg: e6.errMsg.replace("chooseFile:fail", s2) });
            } });
          });
        }(t3), t3);
      };
    };
  }), Ks = t$1(Fs);
  const js = { auto: "auto", onready: "onready", manual: "manual" };
  function $s(e2) {
    return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {}, mixinDatacomError: null }), created() {
      this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
        var e3 = [];
        return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
          e3.push(this[t2]);
        }), e3;
      }, (e3, t2) => {
        if (this.loadtime === js.manual)
          return;
        let n2 = false;
        const s2 = [];
        for (let r2 = 2; r2 < e3.length; r2++)
          e3[r2] !== t2[r2] && (s2.push(e3[r2]), n2 = true);
        e3[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
      });
    }, methods: { onMixinDatacomPropsChange(e3, t2) {
    }, mixinDatacomEasyGet({ getone: e3 = false, success: t2, fail: n2 } = {}) {
      this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomError = null, this.mixinDatacomGet().then((n3) => {
        this.mixinDatacomLoading = false;
        const { data: s2, count: r2 } = n3.result;
        this.getcount && (this.mixinDatacomPage.count = r2), this.mixinDatacomHasMore = s2.length < this.pageSize;
        const i2 = e3 ? s2.length ? s2[0] : void 0 : s2;
        this.mixinDatacomResData = i2, t2 && t2(i2);
      }).catch((e4) => {
        this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e4, this.mixinDatacomError = e4, n2 && n2(e4);
      }));
    }, mixinDatacomGet(t2 = {}) {
      let n2;
      t2 = t2 || {}, n2 = "undefined" != typeof __uniX && __uniX ? e2.databaseForJQL(this.spaceInfo) : e2.database(this.spaceInfo);
      const s2 = t2.action || this.action;
      s2 && (n2 = n2.action(s2));
      const r2 = t2.collection || this.collection;
      n2 = Array.isArray(r2) ? n2.collection(...r2) : n2.collection(r2);
      const i2 = t2.where || this.where;
      i2 && Object.keys(i2).length && (n2 = n2.where(i2));
      const o2 = t2.field || this.field;
      o2 && (n2 = n2.field(o2));
      const a2 = t2.foreignKey || this.foreignKey;
      a2 && (n2 = n2.foreignKey(a2));
      const c2 = t2.groupby || this.groupby;
      c2 && (n2 = n2.groupBy(c2));
      const u2 = t2.groupField || this.groupField;
      u2 && (n2 = n2.groupField(u2));
      true === (void 0 !== t2.distinct ? t2.distinct : this.distinct) && (n2 = n2.distinct());
      const h2 = t2.orderby || this.orderby;
      h2 && (n2 = n2.orderBy(h2));
      const l2 = void 0 !== t2.pageCurrent ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = void 0 !== t2.pageSize ? t2.pageSize : this.mixinDatacomPage.size, p2 = void 0 !== t2.getcount ? t2.getcount : this.getcount, f2 = void 0 !== t2.gettree ? t2.gettree : this.gettree, g2 = void 0 !== t2.gettreepath ? t2.gettreepath : this.gettreepath, m2 = { getCount: p2 }, y2 = { limitLevel: void 0 !== t2.limitlevel ? t2.limitlevel : this.limitlevel, startWith: void 0 !== t2.startwith ? t2.startwith : this.startwith };
      return f2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d2 * (l2 - 1)).limit(d2).get(m2), n2;
    } } };
  }
  function Bs(e2) {
    return function(t2, n2 = {}) {
      n2 = function(e3, t3 = {}) {
        return e3.customUI = t3.customUI || e3.customUI, e3.parseSystemError = t3.parseSystemError || e3.parseSystemError, Object.assign(e3.loadingOptions, t3.loadingOptions), Object.assign(e3.errorOptions, t3.errorOptions), "object" == typeof t3.secretMethods && (e3.secretMethods = t3.secretMethods), e3;
      }({ customUI: false, loadingOptions: { title: "加载中...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
      const { customUI: s2, loadingOptions: r2, errorOptions: i2, parseSystemError: o2 } = n2, a2 = !s2;
      return new Proxy({}, { get(s3, c2) {
        switch (c2) {
          case "toString":
            return "[object UniCloudObject]";
          case "toJSON":
            return {};
        }
        return function({ fn: e3, interceptorName: t3, getCallbackArgs: n3 } = {}) {
          return async function(...s4) {
            const r3 = n3 ? n3({ params: s4 }) : {};
            let i3, o3;
            try {
              return await j($(t3, "invoke"), { ...r3 }), i3 = await e3(...s4), await j($(t3, "success"), { ...r3, result: i3 }), i3;
            } catch (e4) {
              throw o3 = e4, await j($(t3, "fail"), { ...r3, error: o3 }), o3;
            } finally {
              await j($(t3, "complete"), o3 ? { ...r3, error: o3 } : { ...r3, result: i3 });
            }
          };
        }({ fn: async function s4(...u2) {
          let h2;
          a2 && uni.showLoading({ title: r2.title, mask: r2.mask });
          const d2 = { name: t2, type: l.OBJECT, data: { method: c2, params: u2 } };
          "object" == typeof n2.secretMethods && function(e3, t3) {
            const n3 = t3.data.method, s5 = e3.secretMethods || {}, r3 = s5[n3] || s5["*"];
            r3 && (t3.secretType = r3);
          }(n2, d2);
          let p2 = false;
          try {
            h2 = await e2.callFunction(d2);
          } catch (e3) {
            p2 = true, h2 = { result: new te(e3) };
          }
          const { errSubject: f2, errCode: g2, errMsg: m2, newToken: y2 } = h2.result || {};
          if (a2 && uni.hideLoading(), y2 && y2.token && y2.tokenExpired && (ie(y2), Y(H.REFRESH_TOKEN, { ...y2 })), g2) {
            let e3 = m2;
            if (p2 && o2) {
              e3 = (await o2({ objectName: t2, methodName: c2, params: u2, errSubject: f2, errCode: g2, errMsg: m2 })).errMsg || m2;
            }
            if (a2)
              if ("toast" === i2.type)
                uni.showToast({ title: e3, icon: "none" });
              else {
                if ("modal" !== i2.type)
                  throw new Error(`Invalid errorOptions.type: ${i2.type}`);
                {
                  const { confirm: t3 } = await async function({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3 } = {}) {
                    return new Promise((i3, o3) => {
                      uni.showModal({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3, success(e5) {
                        i3(e5);
                      }, fail() {
                        i3({ confirm: false, cancel: true });
                      } });
                    });
                  }({ title: "提示", content: e3, showCancel: i2.retry, cancelText: "取消", confirmText: i2.retry ? "重试" : "确定" });
                  if (i2.retry && t3)
                    return s4(...u2);
                }
              }
            const n3 = new te({ subject: f2, code: g2, message: m2, requestId: h2.requestId });
            throw n3.detail = h2.result, Y(H.RESPONSE, { type: J.CLOUD_OBJECT, content: n3 }), n3;
          }
          return Y(H.RESPONSE, { type: J.CLOUD_OBJECT, content: h2.result }), h2.result;
        }, interceptorName: "callObject", getCallbackArgs: function({ params: e3 } = {}) {
          return { objectName: t2, methodName: c2, params: e3 };
        } });
      } });
    };
  }
  function Ws(e2) {
    return U(Xt.replace("{spaceId}", e2.config.spaceId));
  }
  async function Hs({ openid: e2, callLoginByWeixin: t2 = false } = {}) {
    Ws(this);
    throw new Error(`[SecureNetwork] API \`initSecureNetworkByWeixin\` is not supported on platform \`${P}\``);
  }
  async function Js(e2) {
    const t2 = Ws(this);
    return t2.initPromise || (t2.initPromise = Hs.call(this, e2).then((e3) => e3).catch((e3) => {
      throw delete t2.initPromise, e3;
    })), t2.initPromise;
  }
  function zs(e2) {
    return function({ openid: t2, callLoginByWeixin: n2 = false } = {}) {
      return Js.call(e2, { openid: t2, callLoginByWeixin: n2 });
    };
  }
  function Vs(e2) {
    !function(e3) {
      he = e3;
    }(e2);
  }
  function Gs(e2) {
    const n2 = { getAppBaseInfo: uni.getSystemInfo, getPushClientId: uni.getPushClientId };
    return function(s2) {
      return new Promise((r2, i2) => {
        n2[e2]({ ...s2, success(e3) {
          r2(e3);
        }, fail(e3) {
          i2(e3);
        } });
      });
    };
  }
  class Ys extends S {
    constructor() {
      super(), this._uniPushMessageCallback = this._receivePushMessage.bind(this), this._currentMessageId = -1, this._payloadQueue = [];
    }
    init() {
      return Promise.all([Gs("getAppBaseInfo")(), Gs("getPushClientId")()]).then(([{ appId: e2 } = {}, { cid: t2 } = {}] = []) => {
        if (!e2)
          throw new Error("Invalid appId, please check the manifest.json file");
        if (!t2)
          throw new Error("Invalid push client id");
        this._appId = e2, this._pushClientId = t2, this._seqId = Date.now() + "-" + Math.floor(9e5 * Math.random() + 1e5), this.emit("open"), this._initMessageListener();
      }, (e2) => {
        throw this.emit("error", e2), this.close(), e2;
      });
    }
    async open() {
      return this.init();
    }
    _isUniCloudSSE(e2) {
      if ("receive" !== e2.type)
        return false;
      const t2 = e2 && e2.data && e2.data.payload;
      return !(!t2 || "UNI_CLOUD_SSE" !== t2.channel || t2.seqId !== this._seqId);
    }
    _receivePushMessage(e2) {
      if (!this._isUniCloudSSE(e2))
        return;
      const t2 = e2 && e2.data && e2.data.payload, { action: n2, messageId: s2, message: r2 } = t2;
      this._payloadQueue.push({ action: n2, messageId: s2, message: r2 }), this._consumMessage();
    }
    _consumMessage() {
      for (; ; ) {
        const e2 = this._payloadQueue.find((e3) => e3.messageId === this._currentMessageId + 1);
        if (!e2)
          break;
        this._currentMessageId++, this._parseMessagePayload(e2);
      }
    }
    _parseMessagePayload(e2) {
      const { action: t2, messageId: n2, message: s2 } = e2;
      "end" === t2 ? this._end({ messageId: n2, message: s2 }) : "message" === t2 && this._appendMessage({ messageId: n2, message: s2 });
    }
    _appendMessage({ messageId: e2, message: t2 } = {}) {
      this.emit("message", t2);
    }
    _end({ messageId: e2, message: t2 } = {}) {
      this.emit("end", t2), this.close();
    }
    _initMessageListener() {
      uni.onPushMessage(this._uniPushMessageCallback);
    }
    _destroy() {
      uni.offPushMessage(this._uniPushMessageCallback);
    }
    toJSON() {
      return { appId: this._appId, pushClientId: this._pushClientId, seqId: this._seqId };
    }
    close() {
      this._destroy(), this.emit("close");
    }
  }
  async function Qs(e2) {
    {
      const { osName: e3, osVersion: t3 } = ce();
      "ios" === e3 && function(e4) {
        if (!e4 || "string" != typeof e4)
          return 0;
        const t4 = e4.match(/^(\d+)./);
        return t4 && t4[1] ? parseInt(t4[1]) : 0;
      }(t3) >= 14 && console.warn("iOS 14及以上版本连接uniCloud本地调试服务需要允许客户端查找并连接到本地网络上的设备（仅开发期间需要，发行后不需要）");
    }
    const t2 = e2.__dev__;
    if (!t2.debugInfo)
      return;
    const { address: n2, servePort: s2 } = t2.debugInfo, { address: r2 } = await Ot(n2, s2);
    if (r2)
      return t2.localAddress = r2, void (t2.localPort = s2);
    const i2 = console["error"];
    let o2 = "";
    if ("remote" === t2.debugInfo.initialLaunchType ? (t2.debugInfo.forceRemote = true, o2 = "当前客户端和HBuilderX不在同一局域网下（或其他网络原因无法连接HBuilderX），uniCloud本地调试服务不对当前客户端生效。\n- 如果不使用uniCloud本地调试服务，请直接忽略此信息。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。") : o2 = "无法连接uniCloud本地调试服务，请检查当前客户端是否与主机在同一局域网下。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。", o2 += "\n- 如果在HBuilderX开启的状态下切换过网络环境，请重启HBuilderX后再试\n- 检查系统防火墙是否拦截了HBuilderX自带的nodejs\n- 检查是否错误的使用拦截器修改uni.request方法的参数", 0 === P.indexOf("mp-") && (o2 += "\n- 小程序中如何使用uniCloud，请参考：https://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), !t2.debugInfo.forceRemote)
      throw new Error(o2);
    i2(o2);
  }
  function Xs(e2) {
    e2._initPromiseHub || (e2._initPromiseHub = new v({ createPromise: function() {
      let t2 = Promise.resolve();
      var n2;
      n2 = 1, t2 = new Promise((e3) => {
        setTimeout(() => {
          e3();
        }, n2);
      });
      const s2 = e2.auth();
      return t2.then(() => s2.getLoginState()).then((e3) => e3 ? Promise.resolve() : s2.signInAnonymously());
    } }));
  }
  const Zs = { tcb: Pt, tencent: Pt, aliyun: fe, private: Rt, dcloud: Rt, alipay: Bt };
  let er = new class {
    init(e2) {
      let t2 = {};
      const n2 = Zs[e2.provider];
      if (!n2)
        throw new Error("未提供正确的provider参数");
      t2 = n2.init(e2), function(e3) {
        const t3 = {};
        e3.__dev__ = t3, t3.debugLog = "app" === P;
        const n3 = C;
        n3 && !n3.code && (t3.debugInfo = n3);
        const s2 = new v({ createPromise: function() {
          return Qs(e3);
        } });
        t3.initLocalNetwork = function() {
          return s2.exec();
        };
      }(t2), Xs(t2), Gn(t2), function(e3) {
        const t3 = e3.uploadFile;
        e3.uploadFile = function(e4) {
          return t3.call(this, e4);
        };
      }(t2), function(e3) {
        e3.database = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).database();
          if (this._database)
            return this._database;
          const n3 = as(cs, { uniClient: e3 });
          return this._database = n3, n3;
        }, e3.databaseForJQL = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).databaseForJQL();
          if (this._databaseForJQL)
            return this._databaseForJQL;
          const n3 = as(cs, { uniClient: e3, isJQL: true });
          return this._databaseForJQL = n3, n3;
        };
      }(t2), function(e3) {
        e3.getCurrentUserInfo = qs, e3.chooseAndUploadFile = Ks.initChooseAndUploadFile(e3), Object.assign(e3, { get mixinDatacom() {
          return $s(e3);
        } }), e3.SSEChannel = Ys, e3.initSecureNetworkByWeixin = zs(e3), e3.setCustomClientInfo = Vs, e3.importObject = Bs(e3);
      }(t2);
      return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e3) => {
        if (!t2[e3])
          return;
        const n3 = t2[e3];
        t2[e3] = function() {
          return n3.apply(t2, Array.from(arguments));
        }, t2[e3] = (/* @__PURE__ */ function(e4, t3) {
          return function(n4) {
            let s2 = false;
            if ("callFunction" === t3) {
              const e5 = n4 && n4.type || l.DEFAULT;
              s2 = e5 !== l.DEFAULT;
            }
            const r2 = "callFunction" === t3 && !s2, i2 = this._initPromiseHub.exec();
            n4 = n4 || {};
            const { success: o2, fail: a2, complete: c2 } = ee(n4), u2 = i2.then(() => s2 ? Promise.resolve() : j($(t3, "invoke"), n4)).then(() => e4.call(this, n4)).then((e5) => s2 ? Promise.resolve(e5) : j($(t3, "success"), e5).then(() => j($(t3, "complete"), e5)).then(() => (r2 && Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 }), Promise.resolve(e5))), (e5) => s2 ? Promise.reject(e5) : j($(t3, "fail"), e5).then(() => j($(t3, "complete"), e5)).then(() => (Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 }), Promise.reject(e5))));
            if (!(o2 || a2 || c2))
              return u2;
            u2.then((e5) => {
              o2 && o2(e5), c2 && c2(e5), r2 && Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 });
            }, (e5) => {
              a2 && a2(e5), c2 && c2(e5), r2 && Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 });
            });
          };
        }(t2[e3], e3)).bind(t2);
      }), t2.init = this.init, t2;
    }
  }();
  (() => {
    const e2 = O;
    let t2 = {};
    if (e2 && 1 === e2.length)
      t2 = e2[0], er = er.init(t2), er._isDefault = true;
    else {
      const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile"], n2 = ["database", "getCurrentUserInfo", "importObject"];
      let s2;
      s2 = e2 && e2.length > 0 ? "应用有多个服务空间，请通过uniCloud.init方法指定要使用的服务空间" : "应用未关联服务空间，请在uniCloud目录右键关联服务空间", [...t3, ...n2].forEach((e3) => {
        er[e3] = function() {
          if (console.error(s2), -1 === n2.indexOf(e3))
            return Promise.reject(new te({ code: "SYS_ERR", message: s2 }));
          console.error(s2);
        };
      });
    }
    if (Object.assign(er, { get mixinDatacom() {
      return $s(er);
    } }), Ls(er), er.addInterceptor = F, er.removeInterceptor = K, er.interceptObject = B, uni.__uniCloud = er, "app" === P) {
      const e3 = D();
      e3.uniCloud = er, e3.UniCloudError = te;
    }
  })();
  var tr = er;
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$n = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v2) => v2.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$n], ["__scopeId", "data-v-d31e1c47"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const _sfc_main$m = {
    __name: "news-item",
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const __returned__ = { props };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("navigator", {
      url: "/pages/NewsDetail/NewsDetail?id=" + $props.item._id,
      class: "nsitem"
    }, [
      vue.createElementVNode("view", { class: "pic" }, [
        vue.createElementVNode("image", {
          class: "img",
          src: $props.item.picurl,
          mode: "aspectFill"
        }, null, 8, ["src"])
      ]),
      vue.createElementVNode("view", { class: "text" }, [
        vue.createElementVNode(
          "view",
          { class: "title" },
          vue.toDisplayString($props.item.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "info" }, [
          vue.createElementVNode("view", { class: "block" }, [
            vue.createVNode(_component_uni_icons, {
              type: "calendar",
              size: "18",
              class: "icon-class"
            }),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($props.item.publish_date),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "block" }, [
            vue.createVNode(_component_uni_icons, {
              type: "eye",
              size: "18",
              class: "icon-class"
            }),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($props.item.view_count_display),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "block" }, [
            vue.createVNode(_component_uni_icons, {
              type: "person",
              size: "18",
              class: "icon-class"
            }),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($props.item.author),
              1
              /* TEXT */
            )
          ])
        ])
      ])
    ], 8, ["url"]);
  }
  const NewsItem = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$m], ["__scopeId", "data-v-3492b3e8"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/news-item.vue"]]);
  const _imports_0$4 = "/static/images/kefufill.png";
  const _sfc_main$l = {
    __name: "footer",
    setup(__props, { expose: __expose }) {
      __expose();
      const year = vue.ref((/* @__PURE__ */ new Date()).getFullYear());
      const __returned__ = { year, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode('  <view class="footer">\n    <view class="row">解释权归乐清市蜂点网络技术所有</view>\n    <view class="row">Copyright © {{ year }} 有帮手 版权所有</view>\n    <view class="row">浙江省温州市乐清市</view>\n  </view> '),
        vue.createElementVNode("view", { class: "kefu" }, [
          vue.createElementVNode("button", {
            class: "btn",
            disabled: ""
          }),
          vue.createElementVNode("image", {
            src: _imports_0$4,
            mode: "aspectFill",
            class: "pic"
          }),
          vue.createElementVNode("view", { class: "line" })
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l], ["__scopeId", "data-v-a34d9ea7"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/footer.vue"]]);
  const _imports_0$3 = "/static/images/my location.png";
  const _sfc_main$k = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const navArr = vue.ref([]);
      const latitude = vue.ref(0);
      const longitude = vue.ref(0);
      const newsArr = vue.ref([]);
      function handleNavClick(categoryId) {
        formatAppLog("log", "at pages/index/index.vue:85", "[index] 点击分类，缓存 categoryId=", categoryId);
        uni.setStorageSync("initialCategoryId", categoryId);
        uni.switchTab({
          url: "/pages/previewList/previewList"
        });
      }
      function handleImageError(e2) {
        formatAppLog("error", "at pages/index/index.vue:93", "图片加载失败", e2);
      }
      function getUserLocation() {
        uni.showLoading({ title: "定位中..." });
        uni.getLocation({
          type: "gcj02",
          success(res) {
            uni.hideLoading();
            latitude.value = res.latitude;
            longitude.value = res.longitude;
            uni.setStorageSync("userLocation", {
              latitude: res.latitude,
              longitude: res.longitude
            });
          },
          fail() {
            uni.hideLoading();
            uni.showToast({ title: "获取位置失败", icon: "none" });
          }
        });
      }
      async function getNavData() {
        try {
          uni.showLoading({ title: "加载中..." });
          const res = await tr.callFunction({ name: "getNavData" });
          uni.hideLoading();
          if (res.result.code === 0) {
            navArr.value = res.result.data.filter((i2) => i2.icon && i2.classname);
          }
        } catch {
          uni.hideLoading();
          uni.showToast({ title: "导航加载失败", icon: "none" });
        }
      }
      async function getNewsData() {
        try {
          const res = await tr.callFunction({ name: "getNewsData" });
          if (res.result.data) {
            newsArr.value = res.result.data.map((item) => ({
              ...item,
              view_count_display: formatNum(item.view_count),
              publish_date: formatTime(item.publish_date)
            }));
          }
        } catch {
          uni.showToast({ title: "新闻加载失败", icon: "none" });
        }
      }
      function formatNum(n2) {
        return n2 > 1e4 ? (n2 / 1e4).toFixed(1) + "万" : n2;
      }
      function formatTime(d2) {
        const dt2 = new Date(d2);
        return `${dt2.getMonth() + 1}-${dt2.getDate()}`;
      }
      async function onNewsClick(id, idx) {
        uni.vibrateShort && uni.vibrateShort();
        await tr.callFunction({ name: "upNewsview_count", data: { id } });
        newsArr.value[idx].view_count++;
        newsArr.value[idx].view_count_display = formatNum(newsArr.value[idx].view_count);
        uni.navigateTo({
          url: `/pages/newsDetail/newsDetail?id=${id}`
        });
      }
      vue.onMounted(() => {
        getNavData();
        getUserLocation();
        getNewsData();
      });
      function handleLogout() {
        uni.removeStorageSync("userinfo");
        uni.removeStorageSync("token");
        uni.$emit("user-logout");
        uni.showToast({
          title: "已退出登录",
          icon: "none"
        });
        uni.reLaunch({
          url: "/pages/login/login"
        });
      }
      onShareAppMessage(() => {
        return {
          title: "蜂点到家 - 本地靠谱的家政技工平台",
          path: "/pages/index/index"
        };
      });
      onShareTimeline(() => {
        return {
          title: "蜂点到家 - 快速预约本地服务"
        };
      });
      const __returned__ = { navArr, latitude, longitude, newsArr, handleNavClick, handleImageError, getUserLocation, getNavData, getNewsData, formatNum, formatTime, onNewsClick, handleLogout, get onShareAppMessage() {
        return onShareAppMessage;
      }, get onShareTimeline() {
        return onShareTimeline;
      }, ref: vue.ref, onMounted: vue.onMounted, NewsItem, Footer };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "header-emptybox" }, [
          vue.createElementVNode("text", { class: "profile-title" }, "首页")
        ]),
        vue.createElementVNode("view", null, [
          vue.createCommentVNode(" 地图容器 "),
          vue.createElementVNode("view", { class: "map-container" }, [
            vue.createElementVNode("map", {
              latitude: $setup.latitude,
              longitude: $setup.longitude,
              scale: 16,
              "show-location": "",
              style: { "width": "100%", "height": "420rpx" }
            }, null, 8, ["latitude", "longitude"]),
            vue.createElementVNode("button", {
              class: "location-button",
              onClick: $setup.getUserLocation
            }, [
              vue.createElementVNode("image", {
                src: _imports_0$3,
                mode: "aspectFit"
              })
            ])
          ]),
          vue.createCommentVNode(" 分类导航 "),
          vue.createElementVNode("view", { class: "scroollNav" }, [
            $setup.navArr.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-state"
            }, [
              vue.createElementVNode("text", null, "暂无分类")
            ])) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.navArr, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item._id,
                  class: "item",
                  onClick: ($event) => $setup.handleNavClick(item._id)
                }, [
                  vue.createElementVNode("view", { class: "pic" }, [
                    vue.createElementVNode("image", {
                      src: item.icon || "/static/images/default-icon.png",
                      mode: "aspectFit",
                      onError: $setup.handleImageError
                    }, null, 40, ["src"])
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "text" },
                    vue.toDisplayString(item.classname),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 新闻资讯 "),
          vue.createElementVNode("view", { class: "news" }, [
            vue.createElementVNode("view", { class: "pubTitle" }, [
              vue.createElementVNode("view", { class: "cn" }, "新闻资讯")
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.newsArr, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item._id,
                  class: "content",
                  onClick: ($event) => $setup.onNewsClick(item._id, index)
                }, [
                  vue.createElementVNode("view", { class: "box" }, [
                    vue.createVNode($setup["NewsItem"], { item }, null, 8, ["item"])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 关于我们 "),
          vue.createElementVNode("view", { class: "about" }, [
            vue.createElementVNode("view", { class: "pubTitle" }, [
              vue.createElementVNode("view", { class: "cn" }, "蜂点到家")
            ]),
            vue.createElementVNode("view", { class: "content" }, [
              vue.createElementVNode("view", { class: "row" }, [
                vue.createElementVNode("view", null, "欢迎使用「蜂点到家」小程序"),
                vue.createElementVNode("view", null, "本平台专注于本地家政与上门服务的高效预约与对接。"),
                vue.createElementVNode("view", null, "我们致力于为用户打造一个透明、便捷、安全的服务环境。"),
                vue.createElementVNode("view", null, "每一位服务人员都可以清晰展示自己的服务范围、技能优势和可预约时间。"),
                vue.createElementVNode("view", null, "无论是家政保洁、家电清洗，还是上门维修，「蜂点到家」都为你提供可靠选择。"),
                vue.createElementVNode("view", null, "让优质服务直达用户家门，让服务人员高效获取订单，蜂点到家，让服务更简单。")
              ])
            ])
          ])
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/index/index.vue"]]);
  const _sfc_main$j = {
    __name: "previewList",
    setup(__props, { expose: __expose }) {
      __expose();
      const categories = vue.ref([]);
      const navArr = vue.ref([]);
      const serviceList = vue.ref([]);
      const filteredList = vue.ref([]);
      const isLoaded = vue.ref(false);
      const hasError = vue.ref(false);
      const scrollLeft = vue.ref(0);
      const currentCategory = vue.ref("all");
      const animateActive = vue.ref(false);
      const isFading = vue.ref(false);
      const initialCategoryId = vue.ref(null);
      let lastKnownScrollLeft = 0;
      let scrollTimer = null;
      vue.watch(categories, (newVal) => {
        if (newVal.length > 0 && initialCategoryId.value) {
          applyInitialCategory();
        }
      });
      onShow(() => {
        const initId = uni.getStorageSync("initialCategoryId");
        if (initId) {
          uni.removeStorageSync("initialCategoryId");
          initialCategoryId.value = initId;
          if (categories.value.length > 0) {
            applyInitialCategory();
          }
        }
      });
      vue.onMounted(async () => {
        await initialLoadData();
      });
      async function initialLoadData() {
        isLoaded.value = false;
        hasError.value = false;
        uni.showLoading({ title: "加载中...", mask: true });
        try {
          await loadNav();
          await loadServices();
        } catch (e2) {
          formatAppLog("error", "at pages/previewList/previewList.vue:158", "Initial data load failed:", e2);
          hasError.value = true;
          uni.showToast({ title: "数据加载失败，请重试", icon: "none" });
        } finally {
          isLoaded.value = true;
          uni.hideLoading();
        }
      }
      function retryLoad() {
        initialLoadData();
      }
      async function loadNav() {
        try {
          const { result } = await tr.callFunction({ name: "getNavData" });
          const navData = result.data || [];
          navArr.value = navData;
          categories.value = [{ type: "all", name: "全部" }].concat(
            navData.map((i2) => ({ type: i2._id, name: i2.classname }))
          );
        } catch (e2) {
          formatAppLog("error", "at pages/previewList/previewList.vue:182", "加载分类数据失败:", e2);
          throw new Error("加载分类失败");
        }
      }
      async function loadServices() {
        try {
          const { result } = await tr.callFunction({
            name: "getRecommendedHomepages",
            data: { userLocation: uni.getStorageSync("userLocation") || {} }
          });
          const data = result.data || [];
          const userLocation = uni.getStorageSync("userLocation") || {};
          const formatted = data.map((i2) => {
            let distance = "";
            if (userLocation.latitude != null && userLocation.longitude != null && i2.latitude != null && i2.longitude != null) {
              const d2 = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                i2.latitude,
                i2.longitude
              );
              distance = `${d2.toFixed(1)}公里`;
            }
            const categoriesDisplay = (i2.categories || []).map((id) => {
              const cat = navArr.value.find((c2) => c2._id === id);
              return cat ? cat.classname : "";
            }).filter(Boolean).join(", ") || "暂无分类";
            return {
              id: i2._id,
              title: (i2.name || "未命名").slice(0, 5),
              serviceArea: i2.serviceArea,
              avatar: i2.avatar || "",
              description: i2.description || "",
              skills: i2.skills || [],
              categories: i2.categories || [],
              distance,
              categoriesDisplay
            };
          });
          serviceList.value = formatted;
          filteredList.value = formatted;
        } catch (e2) {
          formatAppLog("error", "at pages/previewList/previewList.vue:237", "加载服务列表数据失败:", e2);
          throw new Error("加载服务列表失败");
        }
      }
      function applyInitialCategory() {
        const initId = initialCategoryId.value;
        if (!initId)
          return;
        const idx = categories.value.findIndex((c2) => c2.type === initId);
        if (idx !== -1) {
          switchCategory(initId, idx);
        }
        initialCategoryId.value = null;
      }
      function switchCategory(type, idx) {
        if (currentCategory.value === type)
          return;
        isFading.value = true;
        setTimeout(() => {
          currentCategory.value = type;
          animateActive.value = true;
          filteredList.value = type === "all" ? serviceList.value : serviceList.value.filter((i2) => i2.categories.includes(type));
          vue.nextTick(() => scrollToCategory(idx));
          setTimeout(() => {
            isFading.value = false;
            animateActive.value = false;
          }, 300);
        }, 10);
      }
      function scrollToCategory(idx) {
        uni.createSelectorQuery().select(`#nav_${idx}`).boundingClientRect().select(".nav-scroll").boundingClientRect().exec(([itemRect, scrollRect]) => {
          if (!itemRect || !scrollRect)
            return;
          const offset = lastKnownScrollLeft + (itemRect.left + itemRect.width / 2) - scrollRect.width / 2;
          scrollLeft.value = offset;
          lastKnownScrollLeft = offset;
        });
      }
      function onScroll(e2) {
        if (scrollTimer)
          clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          lastKnownScrollLeft = e2.detail.scrollLeft;
        }, 100);
      }
      function navigateDetail(id) {
        if (!id)
          return;
        uni.navigateTo({ url: `/pages/HomepageDetail/HomepageDetail?id=${id}` });
      }
      function calculateDistance(lat1, lng1, lat2, lng2) {
        const rad = (d2) => d2 * Math.PI / 180;
        const R2 = 6371;
        const dLat = rad(lat2 - lat1);
        const dLng = rad(lng2 - lng1);
        const a2 = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
        return 2 * R2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));
      }
      function handleLogout() {
        uni.removeStorageSync("userinfo");
        uni.removeStorageSync("token");
        uni.$emit("user-logout");
        uni.showToast({
          title: "已退出登录",
          icon: "none"
        });
        uni.reLaunch({
          url: "/pages/login/login"
        });
      }
      onShareAppMessage(() => {
        return {
          title: "蜂点到家 - 本地靠谱的家政技工平台",
          path: "/pages/index/index"
        };
      });
      onShareTimeline(() => {
        return {
          title: "蜂点到家 - 快速预约本地服务"
        };
      });
      const __returned__ = { categories, navArr, serviceList, filteredList, isLoaded, hasError, scrollLeft, currentCategory, animateActive, isFading, initialCategoryId, get lastKnownScrollLeft() {
        return lastKnownScrollLeft;
      }, set lastKnownScrollLeft(v2) {
        lastKnownScrollLeft = v2;
      }, get scrollTimer() {
        return scrollTimer;
      }, set scrollTimer(v2) {
        scrollTimer = v2;
      }, initialLoadData, retryLoad, loadNav, loadServices, applyInitialCategory, switchCategory, scrollToCategory, onScroll, navigateDetail, calculateDistance, handleLogout, get onShareAppMessage() {
        return onShareAppMessage;
      }, get onShareTimeline() {
        return onShareTimeline;
      }, ref: vue.ref, onMounted: vue.onMounted, nextTick: vue.nextTick, watch: vue.watch, get onShow() {
        return onShow;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "header-emptybox" }, [
          vue.createElementVNode("text", { class: "profile-title" }, "工人")
        ]),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createCommentVNode(" 分类导航 "),
          vue.createElementVNode("scroll-view", {
            class: "nav-scroll",
            "scroll-x": "",
            "scroll-with-animation": "",
            "scroll-left": $setup.scrollLeft,
            onScroll: $setup.onScroll
          }, [
            vue.createElementVNode("view", { class: "nav-container" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.categories, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.type,
                    id: `nav_${index}`,
                    class: vue.normalizeClass(["nav-item", {
                      active: $setup.currentCategory === item.type,
                      "animate-active": $setup.currentCategory === item.type && $setup.animateActive
                    }]),
                    onClick: ($event) => $setup.switchCategory(item.type, index)
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "nav-item-inner" },
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    )
                  ], 10, ["id", "onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ], 40, ["scroll-left"]),
          vue.createCommentVNode(" 服务列表 "),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["list-container", { fade: $setup.isFading }])
            },
            [
              vue.createCommentVNode(" 骨架屏 "),
              !$setup.isLoaded && !$setup.hasError ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "skeleton"
              }, [
                (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(3, (i2) => {
                    return vue.createElementVNode("view", {
                      class: "skeleton-card",
                      key: i2
                    }, [
                      vue.createElementVNode("view", { class: "skeleton-avatar" }),
                      vue.createElementVNode("view", { class: "skeleton-content" }, [
                        vue.createElementVNode("view", { class: "skeleton-title" }),
                        vue.createElementVNode("view", { class: "skeleton-desc" })
                      ])
                    ]);
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])) : $setup.hasError ? (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 1 },
                [
                  vue.createCommentVNode(" 错误提示 "),
                  vue.createElementVNode("view", { class: "error-state" }, [
                    vue.createElementVNode("text", { class: "error-message" }, "网络不佳，数据加载失败。"),
                    vue.createElementVNode("button", {
                      class: "retry-btn",
                      onClick: $setup.retryLoad
                    }, "点击重试")
                  ])
                ],
                2112
                /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
              )) : (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 2 },
                [
                  vue.createCommentVNode(" 列表或无数据 "),
                  vue.createElementVNode("view", null, [
                    $setup.filteredList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($setup.filteredList, (item, idx) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "service-card",
                            key: item.id,
                            onClick: ($event) => $setup.navigateDetail(item.id)
                          }, [
                            vue.createCommentVNode(" 你的卡片渲染逻辑保持不变 "),
                            vue.createElementVNode("view", { class: "top-right-container" }, [
                              vue.createElementVNode(
                                "text",
                                { class: "service-area" },
                                vue.toDisplayString(item.serviceArea || "未知"),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "view",
                                {
                                  class: vue.normalizeClass(["distance-container", { hidden: !item.distance }])
                                },
                                [
                                  vue.createElementVNode(
                                    "text",
                                    { class: "distance-text" },
                                    vue.toDisplayString(item.distance),
                                    1
                                    /* TEXT */
                                  )
                                ],
                                2
                                /* CLASS */
                              )
                            ]),
                            vue.createElementVNode("view", { class: "left-column" }, [
                              vue.createElementVNode("view", { class: "img-container" }, [
                                vue.createElementVNode("image", {
                                  class: "service-img",
                                  src: item.avatar || "/static/images/default-avatar.jpg",
                                  mode: "aspectFill"
                                }, null, 8, ["src"])
                              ])
                            ]),
                            vue.createElementVNode("view", { class: "content-wrapper" }, [
                              vue.createElementVNode("view", { class: "title-row" }, [
                                vue.createElementVNode(
                                  "text",
                                  { class: "service-title" },
                                  vue.toDisplayString(item.title),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              vue.createElementVNode("view", { class: "info-section" }, [
                                vue.createElementVNode("view", { class: "info-item" }, [
                                  vue.createElementVNode(
                                    "text",
                                    { class: "info-value" },
                                    vue.toDisplayString(item.categoriesDisplay || "暂无分类"),
                                    1
                                    /* TEXT */
                                  )
                                ]),
                                vue.createElementVNode("view", { class: "info-item" }, [
                                  vue.createElementVNode(
                                    "text",
                                    { class: "info-value desc-text" },
                                    vue.toDisplayString(item.description || ""),
                                    1
                                    /* TEXT */
                                  )
                                ])
                              ]),
                              vue.createElementVNode("view", { class: "skills-container" }, [
                                (vue.openBlock(true), vue.createElementBlock(
                                  vue.Fragment,
                                  null,
                                  vue.renderList(item.skills, (skill, skillIndex) => {
                                    return vue.openBlock(), vue.createElementBlock(
                                      "view",
                                      {
                                        class: "skill-tag",
                                        key: skillIndex
                                      },
                                      vue.toDisplayString(skill),
                                      1
                                      /* TEXT */
                                    );
                                  }),
                                  128
                                  /* KEYED_FRAGMENT */
                                ))
                              ])
                            ])
                          ], 8, ["onClick"]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])) : (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "no-data"
                    }, "当前分类没有用户数据"))
                  ])
                ],
                2112
                /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
              ))
            ],
            2
            /* CLASS */
          )
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesPreviewListPreviewList = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/previewList/previewList.vue"]]);
  const _imports_0$2 = "/static/images/empty-chat.png";
  const DEFAULT_AVATAR$1 = "/static/images/avatar-placeholder.png";
  const _sfc_main$i = {
    __name: "chatList",
    setup(__props, { expose: __expose }) {
      __expose();
      const myPhoneNumber = vue.ref("");
      const chatList = vue.ref([]);
      const isLoading = vue.ref(true);
      const isFirstLoad = vue.ref(true);
      let pollingTimer = null;
      onLoad(() => {
        const ui = uni.getStorageSync("userinfo");
        if (!(ui == null ? void 0 : ui.phoneNumber)) {
          isLoading.value = false;
          uni.showToast({ title: "请先登录", icon: "none" });
          return;
        }
        myPhoneNumber.value = ui.phoneNumber;
      });
      onShow(() => {
        if (!myPhoneNumber.value)
          return;
        if (isFirstLoad.value) {
          isLoading.value = true;
          fetchChatList().then(() => {
            isLoading.value = false;
            isFirstLoad.value = false;
          });
          fetchTotalUnreadCount();
        } else {
          fetchChatList();
          fetchTotalUnreadCount();
        }
        if (pollingTimer)
          clearInterval(pollingTimer);
        pollingTimer = setInterval(() => {
          fetchChatList();
          fetchTotalUnreadCount();
        }, 2e4);
      });
      onHide(() => {
        if (pollingTimer) {
          clearInterval(pollingTimer);
          pollingTimer = null;
        }
      });
      onUnload(() => {
        if (pollingTimer) {
          clearInterval(pollingTimer);
          pollingTimer = null;
        }
      });
      const fetchChatList = async () => {
        if (!myPhoneNumber.value)
          return;
        try {
          const res = await tr.callFunction({
            name: "get-chat-list",
            data: { userPhoneNumber: myPhoneNumber.value }
          });
          if (res.result.success) {
            const newData = res.result.data.map((session) => ({
              ...session,
              unread: session.unreadCount || 0
            }));
            newData.forEach((newItem) => {
              const index = chatList.value.findIndex((item) => item.sessionId === newItem.sessionId);
              if (index !== -1) {
                chatList.value[index] = newItem;
              } else {
                chatList.value.push(newItem);
              }
            });
            chatList.value = chatList.value.filter(
              (item) => newData.some((newItem) => newItem.sessionId === item.sessionId)
            );
          }
        } catch (e2) {
          formatAppLog("error", "at pages/chatList/chatList.vue:152", "获取会话列表失败:", e2);
        }
      };
      const fetchTotalUnreadCount = async () => {
        try {
          const res = await tr.callFunction({
            name: "get-total-unread-count",
            data: { userPhoneNumber: myPhoneNumber.value }
          });
          if (res.result.success) {
            const total = res.result.totalUnread || 0;
            if (total > 0) {
              uni.setTabBarBadge({
                index: 2,
                text: total > 99 ? "99+" : total.toString()
              });
            } else {
              uni.removeTabBarBadge({ index: 2 });
            }
          }
        } catch (e2) {
          formatAppLog("error", "at pages/chatList/chatList.vue:174", "获取总未读数失败:", e2);
        }
      };
      const getAvatarSrc = (item) => {
        return item.avatar || DEFAULT_AVATAR$1;
      };
      const handleAvatarError = (item) => {
        if (item.avatar !== DEFAULT_AVATAR$1) {
          item.avatar = DEFAULT_AVATAR$1;
        }
        formatAppLog("error", "at pages/chatList/chatList.vue:191", "头像加载失败:", item.avatar);
      };
      const goToChatDetail = (item) => {
        uni.navigateTo({
          url: `/pages/chatDetail/chatDetail?sessionId=${item.sessionId}&name=${encodeURIComponent(item.name)}`
        });
      };
      const formatTime = (timestamp) => {
        if (!timestamp)
          return "";
        const date = new Date(timestamp);
        const now = /* @__PURE__ */ new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday.getTime() - 864e5);
        if (date >= startOfToday) {
          return date.toTimeString().slice(0, 5);
        } else if (date >= startOfYesterday) {
          return "昨天";
        } else {
          const m2 = String(date.getMonth() + 1).padStart(2, "0");
          const d2 = String(date.getDate()).padStart(2, "0");
          return `${date.getFullYear()}/${m2}/${d2}`;
        }
      };
      onShareAppMessage(() => {
        return {
          title: "蜂点到家 - 本地靠谱的家政技工平台",
          path: "/pages/index/index"
        };
      });
      onShareTimeline(() => {
        return {
          title: "蜂点到家 - 快速预约本地服务"
        };
      });
      const __returned__ = { myPhoneNumber, chatList, isLoading, isFirstLoad, DEFAULT_AVATAR: DEFAULT_AVATAR$1, get pollingTimer() {
        return pollingTimer;
      }, set pollingTimer(v2) {
        pollingTimer = v2;
      }, fetchChatList, fetchTotalUnreadCount, getAvatarSrc, handleAvatarError, goToChatDetail, formatTime, get onShareAppMessage() {
        return onShareAppMessage;
      }, get onShareTimeline() {
        return onShareTimeline;
      }, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, get onHide() {
        return onHide;
      }, get onUnload() {
        return onUnload;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "header-emptybox" }, [
          vue.createElementVNode("text", { class: "profile-title" }, "消息")
        ]),
        vue.createElementVNode("view", { class: "chat-list-page" }, [
          $setup.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "skeleton-container"
          }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(3, (i2) => {
                return vue.createElementVNode("view", {
                  key: i2,
                  class: "skeleton-item"
                }, [
                  vue.createElementVNode("view", { class: "skeleton-avatar" }),
                  vue.createElementVNode("view", { class: "skeleton-details" }, [
                    vue.createElementVNode("view", { class: "skeleton-line-long" }),
                    vue.createElementVNode("view", { class: "skeleton-line-short" })
                  ])
                ]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])) : $setup.chatList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "chat-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.chatList, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.sessionId,
                  class: "chat-item",
                  onClick: ($event) => $setup.goToChatDetail(item)
                }, [
                  vue.createElementVNode("image", {
                    class: "avatar",
                    src: $setup.getAvatarSrc(item),
                    mode: "aspectFill",
                    onError: ($event) => $setup.handleAvatarError(item)
                  }, null, 40, ["src", "onError"]),
                  vue.createElementVNode("view", { class: "chat-details" }, [
                    vue.createElementVNode("view", { class: "header" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "nickname" },
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "last-time" },
                        vue.toDisplayString($setup.formatTime(item.lastTime)),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "footer" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "last-message" },
                        vue.toDisplayString(item.lastMessage),
                        1
                        /* TEXT */
                      ),
                      item.unread > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "badge"
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "badge-text" },
                          vue.toDisplayString(item.unread > 99 ? "99+" : item.unread),
                          1
                          /* TEXT */
                        )
                      ])) : vue.createCommentVNode("v-if", true)
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "empty-state"
          }, [
            vue.createElementVNode("image", {
              src: _imports_0$2,
              class: "empty-icon",
              mode: "widthFix"
            }),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无会话消息"),
            vue.createElementVNode("text", { class: "empty-tip" }, "去和工人们打招呼吧")
          ]))
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesChatListChatList = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i], ["__scopeId", "data-v-ee09427d"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/chatList/chatList.vue"]]);
  const isObject = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
    if (messages2 && Object.keys(messages2).length > 0) {
      locales = Object.keys(messages2);
    }
    const lang = startsWith(locale, locales);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater: formater2 }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater2 || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      const options = [
        messages2,
        locale
      ];
      locale = options[0];
      messages2 = options[1];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const en = {
    "uni-load-more.contentdown": "Pull up to show more",
    "uni-load-more.contentrefresh": "loading...",
    "uni-load-more.contentnomore": "No more data"
  };
  const zhHans = {
    "uni-load-more.contentdown": "上拉显示更多",
    "uni-load-more.contentrefresh": "正在加载...",
    "uni-load-more.contentnomore": "没有更多数据了"
  };
  const zhHant = {
    "uni-load-more.contentdown": "上拉顯示更多",
    "uni-load-more.contentrefresh": "正在加載...",
    "uni-load-more.contentnomore": "沒有更多數據了"
  };
  const messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  let platform;
  setTimeout(() => {
    platform = uni.getSystemInfoSync().platform;
  }, 16);
  const {
    t
  } = initVueI18n(messages);
  const _sfc_main$h = {
    name: "UniLoadMore",
    emits: ["clickLoadMore"],
    props: {
      status: {
        // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
        type: String,
        default: "more"
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      iconType: {
        type: String,
        default: "auto"
      },
      iconSize: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: "#777777"
      },
      contentText: {
        type: Object,
        default() {
          return {
            contentdown: "",
            contentrefresh: "",
            contentnomore: ""
          };
        }
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        webviewHide: false,
        platform,
        imgBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlBMzU3OTlEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlBMzU3OUFEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOUEzNTc5N0Q5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOUEzNTc5OEQ5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt+ALSwAAA6CSURBVHja1FsLkFZVHb98LM+F5bHL8khA1iSeiyQBCRM+YGqKUnnJTDLGI0BGZlKDIU2MMglUiDApEZvSsZnQtBRJtKwQNKQMFYeRDR10WOLd8ljYXdh+v8v5fR3Od+797t1dnOnO/Ofce77z+J//+b/P+ZqtXbs2sJ9MJhNUV1cHJ06cCJo3bx7EPc2aNcvpy7pWrVoF+/fvDyoqKoI2bdoE9fX1F7TjN8a+EXBn/fkfvw942Tf+wYMHg9mzZwfjxo0LDhw4EPa1x2MbFw/fOGfPng1qa2tzcCkILsLDydq2bRsunpOTMM7TD/W/tZDZhPdeKD+yGxHhdu3aBV27dg3OnDlzMVANMheLAO3btw8KCwuDmpoaX5OxbgUIMEq7K8IcPnw4KCsrC/r37x8cP378/4cAXAB3vqSkJMuiDhTkw+XcuXNhOWbMmKBly5YhUT8xArhyFvP0BfwRsAuwxJZJsm/nzp2DTp06he/OU+cZ64K6o0ePBkOHDg2GDx8e6gEbJ5Q/NHNuAJQ1hgBeHUDlR7nVTkY8rQAvAi4z34vR/mPs1FoRsaCgIJThI0eOBC1atEiFGGV+5MiRoS45efJkqFjJFXV1dQuA012m2WcwTw98fy6CqBdsaiIO4CScrGPHjvk4odhavPquRtFWXEC25VgkREKOCh/qDSq+vn37htzD/mZTOmOc5U7zKzBPEedygWshcDyWvs30igAbU+6oyMgJBCFhwQE0fccxN60Ay9iebbjoDh06hMowjQxT4fXq1SskArmHZpkArvixp/kWzHdMeArExSJEaiXIjjRjRJ4DaAGWpibLzXN3Fm1vA5teBgh3j1Rv3bp1YgKwPdmf2p9zcyNYYgPKMfY0T5f5nNYdw158nJ8QawW4CLKwiOBSEgO/hok2eBydR+3dYH+PLxA5J8Vv0KBBwenTp0P2JWAx6+yFEBfs8lMY+y0SWMBNI9E4ThKi58VKTg3FQZS1RQF1cz27eC0QHMu+3E0SkUowjhVt5VdaWhp07949ZHv2Qd1EjDXM2cla1M0nl3GxAs3J9yREzyTdFVKVFOaE9qRA8GM0WebRuo9JGZKA7Mv2SeS/Z8+eoQ9BArMfFrLGo6jvxbhHbJZnKX2Rzz1O7QhJJ9Cs2ZMaWIyq/zhdeqPNfIoHd58clIQD+JSXl4dKlyIAuBdVXZwFVWKspSSoxE++h8x4k3uCnEhE4I5KwRiFWGOU0QWKiCYLbdoRMRKAu2kQ9vkfLU6dOhX06NEjlH+yMRZSinnuyWnYosVcji8CEA/6Cg2JF+IIUBqnGKUTCNwtwBN4f89RiK1R96DEgO2o0NDmtEdvVFdVVYV+P3UAPUEs6GFwV3PHmXkD4vh74iDFJysVI/MlaQhwKeBNTLYX5VuA8T4/gZxA4MRGFxDB6R7OmYPfyykGRJbyie+XnGYnQIC/coH9+vULiYrxrkL9ZA9+0ykaHIfEpM7ge8TiJ2CsHYwyMfafAF1yCGBHYIbCVDjDjKt7BeB51D+LgQa6OkG7IDYEEtvQ7lnXLKLtLdLuJBpE4gPUXcW2+PkZwOex+4cGDhwYDBkyRL7/HFcEwUGPo/8uWRUpYnfxGHco8HkewLHLyYmAawAPuIFZxhOpDfJQ8gbUv41yORAptMWBNr6oqMhWird5+u+iHmBb2nhjDV7HWBNQTgK8y11l5NetWzc5ULscAtSj7nbNI0skhWeUZCc0W4nyH/jO4Vz0u1IeYhbk4AiwM6tjxIWByHsoZ9qcIBPJd/y+DwPfBESOmCa/QF3WiZHucLlEDpNxcNhmheEOPgdQNx6/VZFQzFZ5TN08AHXQt2Ii3EdyFuUsPtTcGPhW5iMiCNELvz+Gdn9huG4HUJaW/w3g0wxV0XaG7arG2WeKiUWYM4Y7GO5ezshTARbbWGw/DvXkpp/ivVvE0JVoMxN4rpGzJMhE5Pl+xlATsDIqikP9F9D2z3h9nOksEUFhK+qO4rcPkoalMQ/HqJLIyb3F3JdjrCcw1yZ8joyJLR5gCo54etlag7qIoeNh1N1BRYj3DTFJ0elotxPlVzkGuYAmL0VSJVGAJA41c4Z6A3BzTLfn0HYwYKEI6CUAMzZEWvLsIcQOo1AmmyyM72nHJCfYsogflGV6jEk9vyQZXSuq6w4c16NsGcGZbwOPr+H1RkOk2LEzjNepxQkihHSCQ4ynAYNRx2zMKV92CQMWqj8J0BRE8EShxRFN6YrfCRhC0x3r/Zm4IbQCcmJoV0kMamllccR6FjHqUC5F2R/wS2dcymOlfAKOS4KmzQb5cpNC2MC7JhVn5wjXoJ44rYhLh8n0eXOCorJxa7POjbSlCGVczr34/RsAmrcvo9s+wGp3tzVhntxiXiJ4nvEYb4FJkf0O8HocAePmLvCxnL0AORraVekJk6TYjDabRVXfRE2lCN1h6ZQRN1+InUbsCpKwoBZHh0dODN9JBCUffItXxEavTQkUtnfTVAplCWL3JISz29h4NjotnuSsQKJCk8dF+kJR6RARjrqFVmfPnj3ZbK8cIJ0msd6jgHPGtfVTQ8VLmlvh4mct9sobRmPic0DyDQQnx/NlfYUgyz59+oScsH379pAwXABD32nTpoUHIToESeI5mnbE/UqDdyLcafEBf2MCqgC7NwxIbMREJQ0g4D4sfJwnD+AmRrII05cfMWJE+L1169bQr+fip06dGp4oJ83lmYd5wj/EmMa4TaHivo4EeCguYZBnkB5g2aWA69OIEnUHOaGysjIYMGBAMGnSpODYsWPZwCpFmm4lNq+4gSLQA7jcX8DwtjEyRC8wjabnXEx9kfWnTJkSJkAo90xpJVV+FmcVNeYAF5zWngS4C4O91MBxmAv8blLEpbjI5sz9MTdAhcgkCT1RO8mZkAjfiYpTEvStAS53Uw1vAiUGgZ3GpuQEYvoiBqlIan7kSDHnTwJQFNiPu0+5VxCVYhcZIjNrdXUDdp+Eq5AZ3Gkg8QAyVZRZIk4Tl4QAbF9cXJxNYZMAtAokgs4BrNxEpCtteXg7DDTMDKYNSuQdKsnJBek7HxewvxaosWxLYXtw+cJp18217wql4aKCfBNoEu0O5VU+PhctJ0YeXD4C6JQpyrlpSLTojpGGGN5YwNziChdIZLk4lvLcFJ9jMX3QdiImY9bmGQU+TRUL5CHITTRlgF8D9ouD1MfmLoEPl5xokIumZ2cfgMpHt47IW9N64Hsh7wQYYjyIugWuF5fCqYncXRd5vPMWyizzvhi/32+nvG0dZc9vR6fZOu0md5e+uC408FvKSIOZwXlGvxPv95izA2Vtvg1xKFWARI+vMX66HUhpQQb643uW1bSjuTWyw2SBvDrBvjFic1eGGlz5esq3ko9uSIlBRqPuFcCv8F4WIcN12nVaBd0SaYwI6PDDImR11JkqgHcPmQssjxIn6bUshygDFJUTxPMpHk+jfjPgupgdnYV2R/g7xSjtpah8RJBewhwf0gGK6XI92u4wXFEU40afJ4DN4h5LcAd+40HI3JgJecuT0c062W0i2hQJUTcxan3/CMW1PF2K6bbA+Daz4xRs1D3Br1Cm0OihKCqizW78/nXAF/G5TXrEcVzaNMH6CyMswqsAHqDyDLEyou8lwOXnKF8DjI6KjV3KzMBiXkDH8ij/H214J5A596ekrZ3F0zXlWeL7+P5eUrNo3/QwC15uxthuzidy7DzKRwEDaAViiDgKbTbz7CJnzo0bN7pIfIiid8SuPwn25o3QCmpnyjlZkyxPP8EomCJzrGb7GJMx7tNsq4MT2xMUYaiErZOluTzKsnz3gwCeCZyVRZJfYplNEokEjwrPtxlxjeYAk+F1F74VAzPxQRNYYdtpOUvWs8J1sGhBJMNsb7igN8plJs1eSmLIhLKE4rvaCX27gOhLpLOsIzJ7qn/i+wZzcvSOZ23/du8TZjwV8zHIXoP4R3ifBxiFz1dcVpa3aPntPE+c6TmIWE9EtcMmAcPdWAhYhAXxcLOQi9L1WhD1Sc8p1d2oL7XGiRKp8F4A2i8K/nfI+y/gsTDJ/YC/8+AD5Uh04KHiGl+cIFPnBDDrPMjwRGkLXyxO4VGbfQWnDH2v0bVWE3C9QOXlepbgjEfIJQI6XDG3z5ahD9cw2pS78ipB85wyScNTvsVzlzzhL8/jRrnmVjfFJK/m3m4nj9vbgQTguT8XZTjsm672R5uJKEaQmBI/c58gyus8ZDagLpEVSJBIyHp4jn++xqPV71OgQgJYEWOtZ/haxRtKmWOBu8xdBLftWltsY84zE6WIEy/eIOWL+BaayMx+KHtL7EAkqdNDLiEXmEMUHniedtJqg9HmZtfvt26vNi0BdG3Ft3g8ZOf7PAu59TxtzivLNIekyi+wD1i8CuUiD9FXAa8C+/xS3JPmZnomyc7H+fb4/Se0bk41Fel621r4cgVxbq91V4jVqwB7HTe2M7jgB+QWHavZkDRPmZcASoZEmBx6i75bGjPcMdL4/VKGFAGWZkGzPG0XAbdL9A81G5LOmUnC9hHKJeO7dcUMjblSl12867ElFTtaGl20xvvLGPdVz/8TVuU7y0x1PG7vtNg24oz9Uo/Z412++VFWI7Fcog9tu9Lm6gvRmIPv9x1xmQAu6RDkXtbOtlGEmpgD5Nvnyc0dcv0EE6cfdi1HmhMf9wDF3k3gtRvEedhxjpgfqPb9PU9iEJHnyOUA7bQUXh6kq/D7l2iTjWv7XOD530BDr8jIrus+srXjt4MzumJMHuTsBa63YKE1+RR5lBjEikCCnWKWiHdzOgKO+nRIBAF88za/IFmJ3eMZov4CYxGBabcpGL8EYx+SeMXJeRwHNsV/h+vdxeuhEpN3ZyNY78Gm2fknJxVGhyjixPiQvVkNzT1elD9Py/aTAL64Hb9vcYmC9zfdXdT/C1LeGbg4rnBaAihDFJH12W5ulfNCNe/xTsP3bp8ikzJs5BF+5PNfAQYAPaseTdsEcaYAAAAASUVORK5CYII="
      };
    },
    computed: {
      iconSnowWidth() {
        return (Math.floor(this.iconSize / 24) || 1) * 2;
      },
      contentdownText() {
        return this.contentText.contentdown || t("uni-load-more.contentdown");
      },
      contentrefreshText() {
        return this.contentText.contentrefresh || t("uni-load-more.contentrefresh");
      },
      contentnomoreText() {
        return this.contentText.contentnomore || t("uni-load-more.contentnomore");
      }
    },
    mounted() {
      var pages2 = getCurrentPages();
      var page = pages2[pages2.length - 1];
      var currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    },
    methods: {
      onClick() {
        this.$emit("clickLoadMore", {
          detail: {
            status: this.status
          }
        });
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "uni-load-more",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      !$data.webviewHide && ($props.iconType === "circle" || $props.iconType === "auto" && $data.platform === "android") && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--android-MP"
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      )) : !$data.webviewHide && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--ios-H5"
        },
        [
          vue.createElementVNode("image", {
            src: $data.imgBase64,
            mode: "widthFix"
          }, null, 8, ["src"])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true),
      $props.showText ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 2,
          class: "uni-load-more__text",
          style: vue.normalizeStyle({ color: $props.color })
        },
        vue.toDisplayString($props.status === "more" ? $options.contentdownText : $props.status === "loading" ? $options.contentrefreshText : $options.contentnomoreText),
        5
        /* TEXT, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h], ["__scopeId", "data-v-9245e42c"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue"]]);
  const _sfc_main$g = {
    __name: "profile",
    setup(__props, { expose: __expose }) {
      __expose();
      const userinfo = vue.ref({});
      onShow(() => {
        const info = uni.getStorageSync("userinfo");
        userinfo.value = info && info._id ? info : {};
      });
      function goToLoginPage() {
        uni.navigateTo({ url: "/pages/login/login" });
      }
      function exitLogin() {
        uni.showModal({
          title: "提示",
          content: "确认退出？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("userinfo");
              userinfo.value = {};
            }
          }
        });
      }
      function goToWithdrawalPage() {
        uni.navigateTo({ url: "/pages/Payouts/Payouts" });
      }
      function goToWorkerHomepage() {
        uni.navigateTo({ url: "/pages/Homepage/Homepage" });
      }
      function goToWorkerSchedule() {
        uni.navigateTo({ url: "/pages/worker-schedule/worker-schedule" });
      }
      function goToApplyPage() {
        uni.navigateTo({ url: "/pages/applyTechnician/applyTechnician" });
      }
      function onEditProfile() {
        uni.navigateTo({ url: "/pages/EditProfile/EditProfile" });
      }
      function goToUserSchedule() {
        uni.navigateTo({ url: "/pages/user-schedule/user-schedule" });
      }
      function goToReviewApplications() {
        uni.navigateTo({ url: "/pages/admin/ReviewApplications/ReviewApplications" });
      }
      function goToReviewWithdrawals() {
        uni.navigateTo({ url: "/pages/admin/ReviewWithdrawals/ReviewWithdrawals" });
      }
      onShareAppMessage(() => {
        return {
          title: "蜂点到家 - 本地靠谱的家政技工平台",
          path: "/pages/index/index"
        };
      });
      onShareTimeline(() => {
        return {
          title: "蜂点到家 - 快速预约本地服务"
        };
      });
      const __returned__ = { userinfo, goToLoginPage, exitLogin, goToWithdrawalPage, goToWorkerHomepage, goToWorkerSchedule, goToApplyPage, onEditProfile, goToUserSchedule, goToReviewApplications, goToReviewWithdrawals, get onShareAppMessage() {
        return onShareAppMessage;
      }, get onShareTimeline() {
        return onShareTimeline;
      }, ref: vue.ref, Footer, get onShow() {
        return onShow;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "profile-page" }, [
      !$setup.userinfo._id ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "welcome-container"
      }, [
        vue.createElementVNode("view", { class: "welcome-content" }, [
          vue.createElementVNode("view", { class: "logo-placeholder" }, [
            vue.createVNode(_component_uni_icons, {
              type: "paperplane-filled",
              size: "80",
              color: "#007aff"
            })
          ]),
          vue.createElementVNode("text", { class: "welcome-title" }, "欢迎使用"),
          vue.createElementVNode("text", { class: "welcome-subtitle" }, "登录以发现更多精彩内容和服务")
        ]),
        vue.createElementVNode("button", {
          class: "primary-button login-button",
          onClick: $setup.goToLoginPage
        }, " 登录 / 注册 ")
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createElementVNode("view", { class: "header-emptybox" }, [
            vue.createElementVNode("text", { class: "profile-title" }, "个人中心")
          ]),
          vue.createElementVNode("view", {
            class: "profile-header logged-in",
            onClick: $setup.onEditProfile
          }, [
            vue.createElementVNode("view", { class: "avatar-wrapper" }, [
              vue.createElementVNode("image", {
                class: "avatar",
                src: $setup.userinfo.avatar || "/static/images/default-avatar.png",
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createCommentVNode(" 仅当身份为 worker 且审核状态为 approved 时显示徽章 "),
              $setup.userinfo.userType === "worker" && $setup.userinfo.technicianApplicationStatus === "approved" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "verification-badge"
              }, [
                vue.createVNode(_component_uni_icons, {
                  type: "auth-filled",
                  color: "#ffffff",
                  size: "14"
                })
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("view", { class: "user-info" }, [
              vue.createElementVNode(
                "text",
                { class: "user-name" },
                vue.toDisplayString($setup.userinfo.name || "设置昵称"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "edit-hint" }, "查看并编辑个人资料")
            ]),
            vue.createVNode(_component_uni_icons, {
              class: "arrow-icon",
              type: "forward",
              size: "20",
              color: "#c0c4cc"
            })
          ]),
          vue.createCommentVNode(" 管理员入口 "),
          vue.createElementVNode("view", { class: "action-list" }, [
            $setup.userinfo.userType === "admin" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "action-item",
              onClick: $setup.goToReviewApplications
            }, [
              vue.createVNode(_component_uni_icons, {
                type: "checkbox-filled",
                size: "24",
                color: "#ff0852"
              }),
              vue.createElementVNode("view", { class: "action-text-wrapper" }, [
                vue.createElementVNode("text", { class: "action-text" }, "审核技工申请"),
                vue.createElementVNode("text", { class: "action-subtitle" }, "管理员审核技工认证申请")
              ]),
              vue.createVNode(_component_uni_icons, {
                class: "arrow-icon",
                type: "forward",
                size: "18",
                color: "#c0c4cc"
              })
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 新增：审核提现申请入口 "),
            $setup.userinfo.userType === "admin" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "action-item",
              onClick: $setup.goToReviewWithdrawals
            }, [
              vue.createVNode(_component_uni_icons, {
                type: "wallet-filled",
                size: "24",
                color: "#ff0852"
              }),
              vue.createElementVNode("view", { class: "action-text-wrapper" }, [
                vue.createElementVNode("text", { class: "action-text" }, "审核提现申请"),
                vue.createElementVNode("text", { class: "action-subtitle" }, "处理工人提现请求")
              ]),
              vue.createVNode(_component_uni_icons, {
                class: "arrow-icon",
                type: "forward",
                size: "18",
                color: "#c0c4cc"
              })
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 我的预约入口 (已调换位置) "),
          vue.createElementVNode("view", { class: "action-list" }, [
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: $setup.goToUserSchedule
            }, [
              vue.createVNode(_component_uni_icons, {
                type: "calendar-filled",
                size: "24",
                color: "#ff9500"
              }),
              vue.createElementVNode("view", { class: "action-text-wrapper" }, [
                vue.createElementVNode("text", { class: "action-text" }, "我的预约"),
                vue.createElementVNode("text", { class: "action-subtitle" }, "查看和管理我预约的服务")
              ]),
              vue.createVNode(_component_uni_icons, {
                class: "arrow-icon",
                type: "forward",
                size: "18",
                color: "#c0c4cc"
              })
            ])
          ]),
          vue.createCommentVNode(" 申请成为技工/技工相关入口 (已调换位置) "),
          vue.createElementVNode("view", { class: "action-list" }, [
            $setup.userinfo.userType === "worker" && $setup.userinfo.technicianApplicationStatus === "approved" ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 0 },
              [
                vue.createElementVNode("view", {
                  class: "action-item",
                  onClick: $setup.goToWorkerHomepage
                }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "person-filled",
                    size: "24",
                    color: "#007aff"
                  }),
                  vue.createElementVNode("view", { class: "action-text-wrapper" }, [
                    vue.createElementVNode("text", { class: "action-text" }, "我的工人主页"),
                    vue.createElementVNode("text", { class: "action-subtitle" }, "管理服务项目与个人信息")
                  ]),
                  vue.createVNode(_component_uni_icons, {
                    class: "arrow-icon",
                    type: "forward",
                    size: "18",
                    color: "#c0c4cc"
                  })
                ]),
                vue.createElementVNode("view", {
                  class: "action-item",
                  onClick: $setup.goToWorkerSchedule
                }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "calendar-filled",
                    size: "24",
                    color: "#34c759"
                  }),
                  vue.createElementVNode("view", { class: "action-text-wrapper" }, [
                    vue.createElementVNode("text", { class: "action-text" }, "我的工单"),
                    vue.createElementVNode("text", { class: "action-subtitle" }, "查看和处理客户预约")
                  ]),
                  vue.createVNode(_component_uni_icons, {
                    class: "arrow-icon",
                    type: "forward",
                    size: "18",
                    color: "#c0c4cc"
                  })
                ]),
                vue.createCommentVNode(" 新增提现入口 "),
                vue.createElementVNode("view", {
                  class: "action-item",
                  onClick: $setup.goToWithdrawalPage
                }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "wallet-filled",
                    size: "24",
                    color: "#ff9500"
                  }),
                  vue.createElementVNode("view", { class: "action-text-wrapper" }, [
                    vue.createElementVNode("text", { class: "action-text" }, "提现"),
                    vue.createElementVNode("text", { class: "action-subtitle" }, "申请提现您未结算的金额")
                  ]),
                  vue.createVNode(_component_uni_icons, {
                    class: "arrow-icon",
                    type: "forward",
                    size: "18",
                    color: "#c0c4cc"
                  })
                ])
              ],
              64
              /* STABLE_FRAGMENT */
            )) : $setup.userinfo.technicianApplicationStatus === "pending" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "action-item disabled"
            }, [
              vue.createElementVNode("view", { class: "spinner-container" }, [
                vue.createVNode(_component_uni_load_more, {
                  status: "loading",
                  showText: false,
                  color: "#999"
                })
              ]),
              vue.createElementVNode("view", { class: "action-text-wrapper" }, [
                vue.createElementVNode("text", { class: "action-text" }, "技工认证审核中"),
                vue.createElementVNode("text", { class: "action-subtitle" }, "我们正在加紧处理您的申请")
              ])
            ])) : $setup.userinfo.technicianApplicationStatus === "rejected" ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 2 },
              [
                vue.createElementVNode("view", { class: "action-item-header" }, [
                  vue.createElementVNode("view", { class: "status-badge rejected" }, [
                    vue.createVNode(_component_uni_icons, {
                      type: "close-filled",
                      color: "#ff3b30",
                      size: "16"
                    }),
                    vue.createElementVNode("text", null, "技工认证被拒绝")
                  ])
                ]),
                vue.createElementVNode("view", {
                  class: "action-item",
                  onClick: $setup.goToApplyPage
                }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "compose",
                    size: "24",
                    color: "#ff9500"
                  }),
                  vue.createElementVNode("view", { class: "action-text-wrapper" }, [
                    vue.createElementVNode("text", { class: "action-text" }, "重新申请认证"),
                    vue.createElementVNode("text", { class: "action-subtitle" }, "查看拒绝原因并修改资料")
                  ]),
                  vue.createVNode(_component_uni_icons, {
                    class: "arrow-icon",
                    type: "forward",
                    size: "18",
                    color: "#c0c4cc"
                  })
                ])
              ],
              64
              /* STABLE_FRAGMENT */
            )) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 3,
              class: "action-item",
              onClick: $setup.goToApplyPage
            }, [
              vue.createVNode(_component_uni_icons, {
                type: "plus-filled",
                size: "24",
                color: "#007aff"
              }),
              vue.createElementVNode("view", { class: "action-text-wrapper" }, [
                vue.createElementVNode("text", { class: "action-text" }, "申请成为技工"),
                vue.createElementVNode("text", { class: "action-subtitle" }, "发布您的技能，开始接单")
              ]),
              vue.createVNode(_component_uni_icons, {
                class: "arrow-icon",
                type: "forward",
                size: "18",
                color: "#c0c4cc"
              })
            ]))
          ]),
          vue.createElementVNode("view", { class: "action-list" }, [
            vue.createElementVNode("view", {
              class: "action-item danger",
              onClick: $setup.exitLogin
            }, [
              vue.createElementVNode("text", { class: "action-text" }, "退出登录")
            ])
          ])
        ],
        64
        /* STABLE_FRAGMENT */
      ))
    ]);
  }
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g], ["__scopeId", "data-v-dd383ca2"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/profile/profile.vue"]]);
  const cloudEnv = "mp-1240ebd5-749c-4abc-b593-fd807f0347fb";
  const _sfc_main$f = {
    __name: "Homepage",
    setup(__props, { expose: __expose }) {
      __expose();
      let qqmapsdk = null;
      const QQMapWX = require("../../static/js/qqmap-wx-jssdk.js");
      qqmapsdk = new QQMapWX({
        key: "ZOYBZ-S7V6G-OSQQ2-QA54H-2PBHE-CXF46"
      });
      const userInfo = uni.getStorageSync("userinfo") || {};
      function validateUserInfo(info) {
        return info.phoneNumber && info.name && info.avatar;
      }
      if (!validateUserInfo(userInfo)) {
        uni.showToast({ title: "用户信息不完整", icon: "none" });
      }
      const providerShowcase = vue.reactive({
        age: "",
        serviceArea: "",
        latitude: null,
        longitude: null,
        maxServiceDistance: 10,
        skills: [],
        price: "",
        description: "",
        categories: [],
        phoneNumber: userInfo.phoneNumber || "",
        // 数据库中存储的 bannerImages 和 media 的 cloud:// ID
        bannerCloudIDs: [],
        // 新增：存储轮播图的 cloud:// ID
        mediaCloudItems: []
        // 新增：存储媒体的 cloud:// ID 和类型，格式为 [{ src: 'cloud://', type: 'image' }]
      });
      const bannerImages = vue.ref([]);
      const media = vue.ref([]);
      const navArr = vue.ref([]);
      const categories = vue.ref([]);
      const selectedCategories = vue.ref([]);
      const showTagInput = vue.ref(false);
      const newTagText = vue.ref("");
      const showAgeInput = vue.ref(false);
      const tempAge = vue.ref("");
      async function loadHomepageData(phoneNumber) {
        try {
          const res = await tr.callFunction({
            name: "getHomepage",
            data: { phoneNumber }
          });
          if (res.result.success) {
            await updatePageData(res.result.data || {});
          } else {
            uni.showToast({ title: "数据加载失败", icon: "none" });
          }
        } catch (err) {
          formatAppLog("error", "at pages/Homepage/Homepage.vue:241", "加载失败:", err);
          uni.showToast({ title: "加载出错", icon: "none" });
        }
      }
      async function updatePageData(cloudData) {
        Object.assign(providerShowcase, {
          age: cloudData.age || "",
          serviceArea: cloudData.serviceArea || "",
          latitude: cloudData.latitude || null,
          longitude: cloudData.longitude || null,
          maxServiceDistance: cloudData.maxServiceDistance || 10,
          skills: cloudData.skills || [],
          price: cloudData.price || "",
          description: cloudData.description || "",
          categories: cloudData.categories || [],
          phoneNumber: cloudData.phoneNumber || providerShowcase.phoneNumber,
          // 从数据库加载原始 cloud:// ID 到 providerShowcase
          bannerCloudIDs: cloudData.bannerImages || [],
          mediaCloudItems: cloudData.media || []
        });
        if (providerShowcase.bannerCloudIDs.length > 0) {
          try {
            const tempFileURLsResult = await tr.getTempFileURL({
              fileList: providerShowcase.bannerCloudIDs
            });
            bannerImages.value = tempFileURLsResult.fileList.map((file) => ({
              url: file.tempFileURL,
              fileID: file.fileID
              // 保存 cloud ID 以便后续操作，如删除
            }));
          } catch (err) {
            formatAppLog("error", "at pages/Homepage/Homepage.vue:275", "获取轮播图临时链接失败:", err);
            bannerImages.value = [];
          }
        } else {
          bannerImages.value = [];
        }
        if (providerShowcase.mediaCloudItems.length > 0) {
          const mediaFileIDs = providerShowcase.mediaCloudItems.map((item) => item.src);
          try {
            const tempMediaURLsResult = await tr.getTempFileURL({
              fileList: mediaFileIDs
            });
            media.value = tempMediaURLsResult.fileList.map((file, index) => ({
              url: file.tempFileURL,
              type: providerShowcase.mediaCloudItems[index].type,
              fileID: file.fileID
              // 保存 cloud ID
            }));
          } catch (err) {
            formatAppLog("error", "at pages/Homepage/Homepage.vue:295", "获取媒体临时链接失败:", err);
            media.value = [];
          }
        } else {
          media.value = [];
        }
        selectedCategories.value = mapCategories(providerShowcase.categories || []);
      }
      async function getNavData() {
        try {
          const res = await tr.callFunction({ name: "getNavData" });
          const arr = res.result.data || [];
          navArr.value = arr;
          categories.value = arr.map((i2) => i2.classname);
          if (providerShowcase.categories.length) {
            selectedCategories.value = mapCategories(providerShowcase.categories);
          }
        } catch (err) {
          formatAppLog("error", "at pages/Homepage/Homepage.vue:316", err);
          uni.showToast({ title: "分类加载失败", icon: "none" });
        }
      }
      function mapCategories(ids) {
        return ids.map((id) => navArr.value.find((c2) => c2._id === id)).filter(Boolean);
      }
      function onCategorySelect(e2) {
        const idx = e2.detail.value;
        const cat = navArr.value[idx];
        let sel = [...selectedCategories.value];
        if (!sel.some((c2) => c2._id === cat._id) && sel.length >= 5) {
          return uni.showToast({ title: "最多选择 5 个", icon: "none" });
        }
        if (sel.some((c2) => c2._id === cat._id)) {
          sel = sel.filter((c2) => c2._id !== cat._id);
        } else {
          sel.push(cat);
        }
        selectedCategories.value = sel;
        providerShowcase.categories = sel.map((c2) => c2._id);
      }
      function removeCategory(index) {
        const sel = [...selectedCategories.value];
        sel.splice(index, 1);
        selectedCategories.value = sel;
        providerShowcase.categories = sel.map((c2) => c2._id);
      }
      function addMedia() {
        uni.chooseMedia({
          count: 1,
          mediaType: ["image", "video"],
          sourceType: ["album", "camera"],
          success: (res) => {
            const f2 = res.tempFiles[0];
            const ext = f2.fileType === "video" ? "mp4" : f2.tempFilePath.split(".").pop() || "jpg";
            const cloudPath = `Homepage/media/${Date.now()}-${Math.random().toString().slice(2)}.${ext}`;
            tr.uploadFile({
              filePath: f2.tempFilePath,
              cloudPath,
              success: async (up) => {
                formatAppLog("log", "at pages/Homepage/Homepage.vue:365", "上传文件成功，fileID:", up.fileID);
                const newCloudFileID = up.fileID;
                providerShowcase.mediaCloudItems.push({ src: newCloudFileID, type: f2.fileType || "image" });
                try {
                  const tempURLResult = await tr.getTempFileURL({
                    fileList: [newCloudFileID]
                  });
                  if (tempURLResult.fileList && tempURLResult.fileList.length > 0) {
                    const tempFileURL = tempURLResult.fileList[0].tempFileURL;
                    media.value.push({ url: tempFileURL, type: f2.fileType || "image", fileID: newCloudFileID });
                    uni.showToast({ title: "上传成功", icon: "success" });
                  } else {
                    uni.showToast({ title: "获取临时链接失败，请重试", icon: "none" });
                  }
                } catch (tempErr) {
                  formatAppLog("error", "at pages/Homepage/Homepage.vue:384", "上传后获取临时链接失败:", tempErr);
                  uni.showToast({ title: "上传后处理失败", icon: "none" });
                }
              },
              fail: (e2) => {
                uni.showToast({ title: "上传失败: " + e2.message, icon: "none" });
                formatAppLog("error", "at pages/Homepage/Homepage.vue:390", "上传失败:", e2);
              }
            });
          }
        });
      }
      function uploadSingleBannerImage() {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            const fp = res.tempFilePaths[0];
            const ext = fp.split(".").pop() || "jpg";
            const cloudPath = `Homepage/banners/${Date.now()}-${Math.random().toString().slice(2)}.${ext}`;
            tr.uploadFile({
              filePath: fp,
              cloudPath,
              success: async (up) => {
                formatAppLog("log", "at pages/Homepage/Homepage.vue:409", "上传轮播图成功，fileID:", up.fileID);
                const newCloudFileID = up.fileID;
                providerShowcase.bannerCloudIDs.push(newCloudFileID);
                try {
                  const tempURLResult = await tr.getTempFileURL({
                    fileList: [newCloudFileID]
                  });
                  if (tempURLResult.fileList && tempURLResult.fileList.length > 0) {
                    const tempFileURL = tempURLResult.fileList[0].tempFileURL;
                    bannerImages.value.push({ url: tempFileURL, fileID: newCloudFileID });
                    uni.showToast({ title: "上传成功", icon: "success" });
                  } else {
                    uni.showToast({ title: "获取临时链接失败，请重试", icon: "none" });
                  }
                } catch (tempErr) {
                  formatAppLog("error", "at pages/Homepage/Homepage.vue:428", "上传后获取临时链接失败:", tempErr);
                  uni.showToast({ title: "上传后处理失败", icon: "none" });
                }
              },
              fail: (e2) => {
                uni.showToast({ title: "上传失败: " + e2.message, icon: "none" });
                formatAppLog("error", "at pages/Homepage/Homepage.vue:434", "上传失败:", e2);
              }
            });
          }
        });
      }
      function selectServiceArea() {
        uni.authorize({
          scope: "scope.userLocation",
          success: () => getLocation()
        });
      }
      function getLocation() {
        uni.showLoading({ title: "定位...", mask: true });
        uni.getLocation({
          type: "gcj02",
          success: (loc) => {
            const { latitude, longitude } = loc;
            providerShowcase.latitude = latitude;
            providerShowcase.longitude = longitude;
            qqmapsdk.reverseGeocoder({
              location: { latitude, longitude },
              success: (r2) => {
                uni.hideLoading();
                const comp = r2.result.address_component;
                const district = comp.district || "";
                const town = comp.town || "";
                const street = comp.street || "";
                let area = district;
                if (town)
                  area += `·${town}`;
                else if (street)
                  area += `·${street}`;
                if (!area)
                  area = "未知";
                providerShowcase.serviceArea = area;
              },
              fail: () => {
                uni.hideLoading();
                uni.showToast({ title: "地址解析失败", icon: "none" });
              }
            });
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({ title: "定位失败", icon: "none" });
          }
        });
      }
      function onMaxServiceDistanceBlur() {
        let v2 = providerShowcase.maxServiceDistance;
        if (isNaN(v2) || v2 <= 0) {
          uni.showToast({ title: "请输入正确的距离", icon: "none" });
          providerShowcase.maxServiceDistance = 1;
        } else if (v2 > 10) {
          uni.showToast({ title: "最大距离不能超过 10km", icon: "none" });
          providerShowcase.maxServiceDistance = 10;
        } else {
          providerShowcase.maxServiceDistance = Math.round(v2 * 10) / 10;
        }
      }
      async function saveProviderShowcase() {
        if (!validateUserInfo(userInfo))
          return;
        uni.showLoading({ title: "保存中...", mask: true });
        const updateData = {
          phoneNumber: providerShowcase.phoneNumber,
          accountPhoneNumber: userInfo.phoneNumber,
          userId: userInfo._id,
          // 直接使用 providerShowcase 中的 cloud:// ID 数组
          bannerImages: providerShowcase.bannerCloudIDs,
          media: providerShowcase.mediaCloudItems,
          // 存储 {src: cloud://, type: string}
          age: providerShowcase.age,
          serviceArea: providerShowcase.serviceArea,
          latitude: providerShowcase.latitude,
          longitude: providerShowcase.longitude,
          maxServiceDistance: providerShowcase.maxServiceDistance,
          skills: providerShowcase.skills,
          price: providerShowcase.price,
          description: providerShowcase.description,
          categories: providerShowcase.categories,
          avatar: userInfo.avatar,
          name: userInfo.name
        };
        try {
          const res = await tr.callFunction({
            name: "updateHomepage",
            data: {
              action: "update",
              phoneNumber: userInfo.phoneNumber,
              data: updateData
            }
          });
          uni.hideLoading();
          if (res.result.success) {
            uni.showToast({ title: "保存成功", icon: "success" });
            await loadHomepageData(userInfo.phoneNumber);
          } else {
            uni.showToast({ title: res.result.error || "保存失败", icon: "none" });
          }
        } catch (err) {
          uni.hideLoading();
          formatAppLog("error", "at pages/Homepage/Homepage.vue:545", "保存失败:", err);
          uni.showToast({ title: "网络错误", icon: "none" });
        }
      }
      function showAddTagInput() {
        showTagInput.value = true;
        newTagText.value = "";
      }
      function confirmAddTag() {
        const newTag = newTagText.value.trim();
        if (newTag) {
          providerShowcase.skills.push(newTag);
          showTagInput.value = false;
          newTagText.value = "";
        }
      }
      function cancelAddTag() {
        showTagInput.value = false;
        newTagText.value = "";
      }
      function onSkillLongPress(index) {
        uni.showActionSheet({
          itemList: ["删除该项"],
          success: () => {
            providerShowcase.skills.splice(index, 1);
          }
        });
      }
      function onBannerTap(index) {
        uni.previewImage({
          urls: bannerImages.value.map((item) => item.url),
          // 预览使用临时 URL
          current: bannerImages.value[index].url
        });
      }
      async function onBannerLongPress(index) {
        uni.showActionSheet({
          itemList: ["删除该图片"],
          success: async () => {
            const fileIdToDelete = bannerImages.value[index].fileID;
            uni.showLoading({ title: "删除中...", mask: true });
            try {
              const res = await tr.callFunction({
                name: "deleteFile",
                // 你创建的删除文件的云函数名称
                data: { fileId: fileIdToDelete }
              });
              if (res.result && res.result.success) {
                bannerImages.value.splice(index, 1);
                const cloudIndex = providerShowcase.bannerCloudIDs.indexOf(fileIdToDelete);
                if (cloudIndex > -1) {
                  providerShowcase.bannerCloudIDs.splice(cloudIndex, 1);
                }
                await saveProviderShowcase();
                uni.hideLoading();
                uni.showToast({ title: "删除成功", icon: "success" });
              } else {
                uni.hideLoading();
                uni.showToast({ title: res.result.message || "云存储文件删除失败", icon: "none" });
                formatAppLog("error", "at pages/Homepage/Homepage.vue:620", "云存储文件删除失败:", res.result);
              }
            } catch (err) {
              uni.hideLoading();
              formatAppLog("error", "at pages/Homepage/Homepage.vue:624", "删除轮播图失败:", err);
              uni.showToast({ title: "删除失败: " + err.message, icon: "none" });
            }
          }
        });
      }
      async function onMediaLongPress(index) {
        uni.showActionSheet({
          itemList: ["删除该内容"],
          success: async () => {
            const fileIdToDelete = media.value[index].fileID;
            uni.showLoading({ title: "删除中...", mask: true });
            try {
              const res = await tr.callFunction({
                name: "deleteFile",
                // 你创建的删除文件的云函数名称
                data: { fileId: fileIdToDelete }
              });
              if (res.result && res.result.success) {
                media.value.splice(index, 1);
                const cloudIndex = providerShowcase.mediaCloudItems.findIndex((item) => item.src === fileIdToDelete);
                if (cloudIndex > -1) {
                  providerShowcase.mediaCloudItems.splice(cloudIndex, 1);
                }
                await saveProviderShowcase();
                uni.hideLoading();
                uni.showToast({ title: "删除成功", icon: "success" });
              } else {
                uni.hideLoading();
                uni.showToast({ title: res.result.message || "云存储文件删除失败", icon: "none" });
                formatAppLog("error", "at pages/Homepage/Homepage.vue:661", "云存储文件删除失败:", res.result);
              }
            } catch (err) {
              uni.hideLoading();
              formatAppLog("error", "at pages/Homepage/Homepage.vue:665", "删除媒体失败:", err);
              uni.showToast({ title: "删除失败: " + err.message, icon: "none" });
            }
          }
        });
      }
      function openAgeInput() {
        showAgeInput.value = true;
        tempAge.value = providerShowcase.age;
      }
      function confirmAgeInput() {
        if (!/^\d+$/.test(tempAge.value)) {
          uni.showToast({ title: "请输入有效数字", icon: "none" });
          return;
        }
        providerShowcase.age = tempAge.value;
        showAgeInput.value = false;
      }
      function cancelAgeInput() {
        showAgeInput.value = false;
      }
      vue.onMounted(() => {
        loadHomepageData(userInfo.phoneNumber);
        getNavData();
      });
      const __returned__ = { get qqmapsdk() {
        return qqmapsdk;
      }, set qqmapsdk(v2) {
        qqmapsdk = v2;
      }, QQMapWX, userInfo, validateUserInfo, providerShowcase, bannerImages, media, navArr, categories, selectedCategories, showTagInput, newTagText, showAgeInput, tempAge, cloudEnv, loadHomepageData, updatePageData, getNavData, mapCategories, onCategorySelect, removeCategory, addMedia, uploadSingleBannerImage, selectServiceArea, getLocation, onMaxServiceDistanceBlur, saveProviderShowcase, showAddTagInput, confirmAddTag, cancelAddTag, onSkillLongPress, onBannerTap, onBannerLongPress, onMediaLongPress, openAgeInput, confirmAgeInput, cancelAgeInput, ref: vue.ref, reactive: vue.reactive, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "homepage-container" }, [
      !$setup.providerShowcase || Object.keys($setup.providerShowcase).length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        style: { "padding": "50rpx 30rpx", "min-height": "50vh" }
      }, [
        vue.createElementVNode("view", { class: "skeleton-title" }),
        (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(5, (i2) => {
            return vue.createElementVNode("view", {
              class: "skeleton-row",
              key: i2
            });
          }),
          64
          /* STABLE_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "worker-detail"
      }, [
        vue.createElementVNode("swiper", {
          class: "banner-swiper",
          autoplay: "",
          interval: "3000",
          circular: "",
          "indicator-dots": ""
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.bannerImages, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
                vue.createElementVNode("image", {
                  src: item.url,
                  class: "banner-image",
                  onClick: ($event) => $setup.onBannerTap(index),
                  onLongpress: ($event) => $setup.onBannerLongPress(index),
                  mode: "aspectFill"
                }, null, 40, ["src", "onClick", "onLongpress"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $setup.bannerImages.length === 0 ? (vue.openBlock(), vue.createElementBlock("swiper-item", { key: 0 }, [
            vue.createElementVNode("view", { class: "empty-banner" }, [
              vue.createElementVNode("text", null, "点击下方按钮上传展示图片")
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", {
          class: "upload-banner-btn",
          onClick: $setup.uploadSingleBannerImage
        }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.bannerImages.length ? "管理轮播图" : "上传轮播图"),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "category-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "服务分类（最多5个）"),
          vue.createElementVNode("view", { class: "category-selector" }, [
            vue.createElementVNode("view", { class: "selected-categories" }, [
              $setup.selectedCategories.length === 0 ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "placeholder-text"
              }, "请选择服务分类")) : vue.createCommentVNode("v-if", true),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.selectedCategories, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "category-tag"
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.classname),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", {
                      class: "remove-btn",
                      onClick: ($event) => $setup.removeCategory(index)
                    }, "×", 8, ["onClick"])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("picker", {
              mode: "selector",
              range: $setup.categories,
              onChange: $setup.onCategorySelect
            }, [
              vue.createElementVNode("view", { class: "picker-btn" }, [
                vue.createElementVNode("text", null, "+ 添加分类")
              ])
            ], 40, ["range"])
          ])
        ]),
        vue.createElementVNode("view", { class: "basic-info" }, [
          vue.createElementVNode("image", {
            class: "avatar",
            src: $setup.userInfo.avatar,
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "info-text" }, [
            vue.createElementVNode(
              "view",
              { class: "name" },
              vue.toDisplayString($setup.userInfo.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "tags" }, [
              vue.createElementVNode(
                "view",
                {
                  class: "editable-field",
                  onClick: $setup.openAgeInput
                },
                vue.toDisplayString($setup.providerShowcase.age ? $setup.providerShowcase.age + "岁" : "请填写年龄"),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode(
              "view",
              { class: "area" },
              vue.toDisplayString($setup.providerShowcase.serviceArea || "请选择服务区域"),
              1
              /* TEXT */
            )
          ])
        ]),
        $setup.showAgeInput ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "input-mask"
        }, [
          vue.createElementVNode("view", { class: "input-box" }, [
            vue.createElementVNode("view", { class: "input-header" }, "编辑年龄"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "tag-input",
                placeholder: "请输入年龄（数字）",
                type: "number",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.tempAge = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.tempAge]
            ]),
            vue.createElementVNode("view", { class: "input-actions" }, [
              vue.createElementVNode("view", {
                class: "action-btn cancel",
                onClick: $setup.cancelAgeInput
              }, "取消"),
              vue.createElementVNode("view", {
                class: "action-btn confirm",
                onClick: $setup.confirmAgeInput
              }, "确定")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "input-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "服务区域"),
          vue.createElementVNode("view", { class: "service-area" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($setup.providerShowcase.serviceArea || "点击选择服务区域"),
              1
              /* TEXT */
            ),
            vue.createElementVNode("button", {
              class: "select-area-btn",
              onClick: $setup.selectServiceArea
            }, "选择区域")
          ])
        ]),
        vue.createElementVNode("view", { class: "input-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "最远可服务距离（km）"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "common-input",
              type: "number",
              inputmode: "decimal",
              step: "0.1",
              max: "10",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.providerShowcase.maxServiceDistance = $event),
              placeholder: "请输入最远服务距离，1~10 之间",
              onBlur: $setup.onMaxServiceDistanceBlur
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [
              vue.vModelText,
              $setup.providerShowcase.maxServiceDistance,
              void 0,
              { number: true }
            ]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "手机号"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "common-input",
              type: "number",
              placeholder: "请输入手机号",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.providerShowcase.phoneNumber = $event)
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.providerShowcase.phoneNumber]
          ])
        ]),
        vue.createElementVNode("view", { class: "service-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "服务项目"),
          vue.createElementVNode("view", { class: "tag-list" }, [
            $setup.providerShowcase.skills.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-tips"
            }, "点击下方 + 添加服务项目")) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.providerShowcase.skills, (skill, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "tag-item",
                  onLongpress: ($event) => $setup.onSkillLongPress(index)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "skill-tag" },
                    vue.toDisplayString(skill),
                    1
                    /* TEXT */
                  )
                ], 40, ["onLongpress"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            vue.createElementVNode("view", {
              class: "add-tag",
              onClick: $setup.showAddTagInput
            }, "+")
          ])
        ]),
        vue.createElementVNode("view", { class: "input-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "服务报价"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "common-input",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.providerShowcase.price = $event),
              placeholder: "请输入服务价格（示例：300元/天）"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.providerShowcase.price]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "个人简介"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              class: "common-textarea",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.providerShowcase.description = $event),
              placeholder: "请描述您的专业技能和服务特色..."
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.providerShowcase.description]
          ])
        ]),
        vue.createElementVNode("view", { class: "case-section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "案例展示"),
          vue.createElementVNode("view", { class: "media-list" }, [
            $setup.media.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-tips"
            }, "点击 + 上传施工案例（图片/视频）")) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.media, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "media-item",
                  onLongpress: ($event) => $setup.onMediaLongPress(index)
                }, [
                  item.type === "image" ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    src: item.url,
                    mode: "aspectFill"
                  }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true),
                  item.type === "video" ? (vue.openBlock(), vue.createElementBlock("video", {
                    key: 1,
                    src: item.url,
                    controls: ""
                  }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
                ], 40, ["onLongpress"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            vue.createElementVNode("view", {
              class: "add-tag",
              onClick: $setup.addMedia
            }, "+")
          ])
        ]),
        vue.createElementVNode("view", {
          class: "save-btn",
          onClick: $setup.saveProviderShowcase
        }, "保存信息"),
        $setup.showTagInput ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "input-mask"
        }, [
          vue.createElementVNode("view", { class: "input-box" }, [
            vue.createElementVNode("view", { class: "input-header" }, "添加服务项目"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "tag-input",
                placeholder: "请输入服务内容（最多12字）",
                maxlength: "12",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.newTagText = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.newTagText]
            ]),
            vue.createElementVNode("view", { class: "input-actions" }, [
              vue.createElementVNode("view", {
                class: "action-btn cancel",
                onClick: $setup.cancelAddTag
              }, "取消"),
              vue.createElementVNode("view", {
                class: "action-btn confirm",
                onClick: $setup.confirmAddTag
              }, "确定")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ]))
    ]);
  }
  const PagesHomepageHomepage = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f], ["__scopeId", "data-v-d71a3e1b"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/Homepage/Homepage.vue"]]);
  const _sfc_main$e = {
    __name: "EditProfile",
    setup(__props, { expose: __expose }) {
      __expose();
      const name = vue.ref("");
      const avatarOld = vue.ref("");
      const avatarTemp = vue.ref("");
      const avatarNewFileID = vue.ref("");
      const isLoading = vue.ref(false);
      const isWorker = vue.ref(false);
      const weChatId = vue.ref("");
      const weChatQrCodeUrlOld = vue.ref("");
      const weChatQrCodeTemp = vue.ref("");
      const weChatQrCodeNewFileID = vue.ref("");
      const isUploadingQrCode = vue.ref(false);
      vue.onMounted(async () => {
        var _a, _b;
        let user = uni.getStorageSync("userinfo") || {};
        formatAppLog("log", "at pages/EditProfile/EditProfile.vue:85", "EditProfile - onMounted: 初始本地 userinfo:", user);
        if (user._id) {
          try {
            const { result } = await tr.callFunction({
              name: "getUserInfoById",
              // 调用新的云函数
              data: { userId: user._id }
            });
            if (result.success && result.data) {
              user = result.data;
              uni.setStorageSync("userinfo", user);
              formatAppLog("log", "at pages/EditProfile/EditProfile.vue:98", "EditProfile - onMounted: 已从云端获取最新 userinfo 并更新本地缓存:", user);
            } else {
              formatAppLog("warn", "at pages/EditProfile/EditProfile.vue:100", "EditProfile - onMounted: 从云端获取用户数据失败:", result.message);
            }
          } catch (err) {
            formatAppLog("error", "at pages/EditProfile/EditProfile.vue:104", "EditProfile - onMounted: 调用 getUserInfoById 云函数异常:", err);
          }
        }
        name.value = user.name || "";
        avatarOld.value = user.avatar || "";
        if (user.userType === "worker" && user.technicianApplicationStatus === "approved") {
          isWorker.value = true;
          weChatId.value = ((_a = user.technicianInfo) == null ? void 0 : _a.weChatId) || "";
          weChatQrCodeUrlOld.value = ((_b = user.technicianInfo) == null ? void 0 : _b.weChatQrCodeUrl) || "";
        } else {
          isWorker.value = false;
        }
      });
      function chooseAvatar() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            avatarTemp.value = res.tempFilePaths[0];
            avatarNewFileID.value = "";
          },
          fail: (err) => {
            formatAppLog("error", "at pages/EditProfile/EditProfile.vue:134", "选择头像失败:", err);
            uni.showToast({ title: "选择头像失败", icon: "none" });
          }
        });
      }
      async function chooseQrCode() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            weChatQrCodeTemp.value = res.tempFilePaths[0];
            weChatQrCodeNewFileID.value = "";
          },
          fail: (err) => {
            formatAppLog("error", "at pages/EditProfile/EditProfile.vue:151", "选择收款码失败:", err);
            uni.showToast({ title: "选择收款码失败", icon: "none" });
          }
        });
      }
      function removeQrCode() {
        weChatQrCodeTemp.value = "";
        weChatQrCodeNewFileID.value = "";
        weChatQrCodeUrlOld.value = "";
      }
      async function submitProfile() {
        if (!name.value.trim()) {
          return uni.showToast({ title: "姓名不能为空", icon: "none" });
        }
        if (isWorker.value && !weChatQrCodeTemp.value && !weChatQrCodeUrlOld.value) {
          return uni.showToast({ title: "请上传微信收款码", icon: "none" });
        }
        const userInfo = uni.getStorageSync("userinfo") || {};
        const phoneNumber = userInfo.phoneNumber;
        if (!phoneNumber) {
          return uni.showToast({ title: "缺少用户标识符", icon: "none" });
        }
        isLoading.value = true;
        uni.showLoading({ title: "保存中..." });
        try {
          if (avatarTemp.value) {
            const cloudPath = `User-Avatar/${Date.now()}.jpg`;
            const uploadRes = await tr.uploadFile({
              cloudPath,
              filePath: avatarTemp.value
            });
            if (!uploadRes.fileID) {
              throw new Error("头像上传失败");
            }
            avatarNewFileID.value = uploadRes.fileID;
          }
          if (isWorker.value && weChatQrCodeTemp.value) {
            isUploadingQrCode.value = true;
            const cloudPathQr = `Worker-QrCodes/${userInfo._id}_${Date.now()}.png`;
            const uploadQrRes = await tr.uploadFile({
              cloudPath: cloudPathQr,
              filePath: weChatQrCodeTemp.value
            });
            if (!uploadQrRes.fileID) {
              throw new Error("收款码上传失败");
            }
            weChatQrCodeNewFileID.value = uploadQrRes.fileID;
            isUploadingQrCode.value = false;
          }
          const dataToSend = {
            phoneNumber,
            name: name.value,
            avatar: avatarNewFileID.value || "",
            // 新头像 ID 或空字符串
            oldAvatarFileID: avatarOld.value || "",
            // 旧头像 ID，用于云端删除
            // 工人专属数据
            isWorker: isWorker.value,
            // 告诉云函数是否是工人
            weChatId: isWorker.value ? weChatId.value : "",
            // 仅工人身份时发送微信号
            weChatQrCodeUrl: isWorker.value ? weChatQrCodeNewFileID.value || weChatQrCodeUrlOld.value || "" : "",
            // 新收款码 ID，或旧的，或空
            oldWeChatQrCodeUrl: isWorker.value ? weChatQrCodeUrlOld.value : ""
            // 旧收款码 ID，用于云端删除
          };
          const { result } = await tr.callFunction({
            name: "updateUserProfile",
            // 这个云函数需要被更新以处理工人信息
            data: dataToSend
          });
          if (result.code !== 200 || !result.success) {
            throw new Error(result.msg || "云函数返回错误");
          }
          uni.setStorageSync("userinfo", result.data);
          uni.hideLoading();
          uni.showToast({ title: "更新成功", icon: "success" });
          setTimeout(() => uni.navigateBack(), 800);
        } catch (err) {
          formatAppLog("error", "at pages/EditProfile/EditProfile.vue:246", "更新过程出错:", err);
          uni.hideLoading();
          isLoading.value = false;
          isUploadingQrCode.value = false;
          uni.showToast({ title: err.message || "更新失败，请重试", icon: "none" });
        }
      }
      const __returned__ = { name, avatarOld, avatarTemp, avatarNewFileID, isLoading, isWorker, weChatId, weChatQrCodeUrlOld, weChatQrCodeTemp, weChatQrCodeNewFileID, isUploadingQrCode, chooseAvatar, chooseQrCode, removeQrCode, submitProfile, ref: vue.ref, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 头像区域（点击更换） "),
      vue.createElementVNode("view", {
        class: "avatar-edit",
        onClick: $setup.chooseAvatar
      }, [
        vue.createElementVNode("image", {
          class: "avatar",
          src: $setup.avatarTemp || $setup.avatarOld || "/static/images/default-avatar.png",
          mode: "aspectFill"
        }, null, 8, ["src"])
      ]),
      vue.createElementVNode("text", { class: "tip" }, "点击更换头像"),
      vue.createCommentVNode(" 姓名输入 "),
      vue.createElementVNode("view", { class: "field" }, [
        vue.createElementVNode("text", { class: "label" }, "姓名："),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "input",
            placeholder: "请输入您的姓名",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.name = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.name]
        ])
      ]),
      vue.createCommentVNode(" 工人专属：收款信息修改区域 "),
      $setup.isWorker ? (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 0 },
        [
          vue.createElementVNode("view", { class: "section-title" }, "收款信息"),
          vue.createElementVNode("text", { class: "section-tip" }, "请确保收款信息准确无误，以便正常提现。"),
          vue.createCommentVNode(" 微信号 "),
          vue.createElementVNode("view", { class: "field" }, [
            vue.createElementVNode("text", { class: "label" }, "微信号："),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                placeholder: "请输入您的微信号 (可选)",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.weChatId = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.weChatId]
            ])
          ]),
          vue.createCommentVNode(" 微信收款码 "),
          vue.createElementVNode("view", { class: "field" }, [
            vue.createElementVNode("text", { class: "label required-label" }, "收款码："),
            vue.createElementVNode("view", { class: "qr-code-uploader" }, [
              $setup.weChatQrCodeTemp || $setup.weChatQrCodeUrlOld ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "image-preview"
              }, [
                vue.createElementVNode("image", {
                  src: $setup.weChatQrCodeTemp || $setup.weChatQrCodeUrlOld,
                  mode: "aspectFill",
                  class: "uploaded-image"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", {
                  class: "delete-btn",
                  onClick: $setup.removeQrCode
                }, "×")
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "upload-btn",
                onClick: $setup.chooseQrCode
              }, [
                vue.createElementVNode("text", null, "+")
              ]))
            ]),
            vue.createElementVNode("text", { class: "tip" }, "点击上传或更换收款码图片"),
            $setup.isUploadingQrCode ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 0,
              class: "uploading-tip"
            }, "收款码上传中...")) : vue.createCommentVNode("v-if", true)
          ])
        ],
        64
        /* STABLE_FRAGMENT */
      )) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 保存按钮 "),
      vue.createElementVNode("button", {
        class: "save-btn",
        onClick: $setup.submitProfile,
        loading: $setup.isLoading || $setup.isUploadingQrCode
      }, "保存修改", 8, ["loading"])
    ]);
  }
  const PagesEditProfileEditProfile = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__scopeId", "data-v-f1aa6899"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/EditProfile/EditProfile.vue"]]);
  const _sfc_main$d = {
    __name: "login",
    setup(__props, { expose: __expose }) {
      __expose();
      const isLoading = vue.ref(false);
      const sendingCode = vue.ref(false);
      const countdown = vue.ref(0);
      let timerInterval = null;
      const loginForm = vue.reactive({
        phone: "",
        code: ""
      });
      const isPhoneValid = vue.computed(() => /^1\d{10}$/.test(loginForm.phone));
      function onPhoneInput(e2) {
        loginForm.phone = e2.detail.value.replace(/\D/g, "");
      }
      function onCodeInput(e2) {
        loginForm.code = e2.detail.value.replace(/\D/g, "");
      }
      async function sendSmsCode() {
        if (!isPhoneValid.value) {
          uni.showToast({ title: "请输入有效手机号", icon: "none" });
          return;
        }
        sendingCode.value = true;
        countdown.value = 60;
        timerInterval = setInterval(() => {
          countdown.value--;
          if (countdown.value <= 0) {
            clearInterval(timerInterval);
            sendingCode.value = false;
          }
        }, 1e3);
        try {
          const { result } = await tr.callFunction({
            name: "sendSmsCode",
            data: { phone: loginForm.phone }
          });
          if (result.success) {
            uni.showToast({ title: "验证码已发送", icon: "none" });
            if (result.code) {
              formatAppLog("log", "at pages/login/login.vue:116", "[开发调试] 验证码:", result.code);
            }
          } else {
            throw new Error(result.errorMsg || "验证码发送失败");
          }
        } catch (err) {
          clearInterval(timerInterval);
          sendingCode.value = false;
          uni.showToast({ title: err.message || "验证码发送异常", icon: "none" });
        }
      }
      function redirectToHomePage(userType) {
        let targetPath = "/pages/profile/profile";
        if (userType === "admin") {
          targetPath = "/pages/profile/profile";
        } else if (userType === "worker") {
          targetPath = "/pages/profile/profile";
        } else {
          targetPath = "/pages/profile/profile";
        }
        uni.reLaunch({
          url: targetPath,
          success: () => formatAppLog("log", "at pages/login/login.vue:141", `[Login] 跳转成功: ${targetPath}`),
          fail: (e2) => formatAppLog("error", "at pages/login/login.vue:142", `[Login] 跳转失败: ${targetPath}`, e2)
        });
      }
      async function handleLogin() {
        if (!isPhoneValid.value) {
          uni.showToast({ title: "请输入有效手机号", icon: "none" });
          return;
        }
        if (!/^\d{4}$/.test(loginForm.code)) {
          uni.showToast({ title: "请输入4位验证码", icon: "none" });
          return;
        }
        uni.showLoading({ title: "登录中..." });
        isLoading.value = true;
        try {
          const pushClientId = uni.getPushClientId();
          const { result } = await tr.callFunction({
            name: "loginByPhone",
            data: { phone: loginForm.phone, code: loginForm.code, pushClientId }
          });
          formatAppLog("log", "at pages/login/login.vue:167", "[Login] 登录结果:", result);
          if (result.code === 0 && result.userInfo) {
            uni.setStorageSync("userinfo", result.userInfo);
            uni.$emit("user-login");
            uni.showToast({ title: "登录成功！", icon: "none" });
            redirectToHomePage(result.userInfo.userType);
          } else {
            uni.showToast({ title: result.errorMsg || "登录失败", icon: "none" });
          }
        } catch (err) {
          formatAppLog("error", "at pages/login/login.vue:178", "[Login] 登录异常:", err);
          uni.showToast({ title: err.message || "登录异常", icon: "none" });
        } finally {
          uni.hideLoading();
          isLoading.value = false;
        }
      }
      const __returned__ = { isLoading, sendingCode, countdown, get timerInterval() {
        return timerInterval;
      }, set timerInterval(v2) {
        timerInterval = v2;
      }, loginForm, isPhoneValid, onPhoneInput, onCodeInput, sendSmsCode, redirectToHomePage, handleLogin, ref: vue.ref, reactive: vue.reactive, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-page" }, [
      vue.createCommentVNode('    <view class="page-header">\n      <navigator class="back-btn" open-type="switchTab" url="/pages/profile/profile">\n        <uni-icons type="left" size="22" color="#1c1c1e"></uni-icons>\n      </navigator>\n      <view class="header-title">登录 / 注册</view>\n    </view> '),
      vue.createElementVNode("view", { class: "content-area" }, [
        vue.createElementVNode("view", { class: "form-card" }, [
          vue.createElementVNode("view", { class: "input-row" }, [
            vue.createVNode(_component_uni_icons, {
              type: "phone-filled",
              size: "22",
              color: "#8a8a8e"
            }),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input-field",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.loginForm.phone = $event),
                type: "number",
                placeholder: "请输入手机号",
                onInput: $setup.onPhoneInput,
                maxlength: "11"
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $setup.loginForm.phone]
            ])
          ]),
          vue.createElementVNode("view", { class: "input-row" }, [
            vue.createVNode(_component_uni_icons, {
              type: "locked-filled",
              size: "22",
              color: "#8a8a8e"
            }),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input-field",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.loginForm.code = $event),
                type: "number",
                placeholder: "请输入验证码",
                maxlength: "4",
                onInput: $setup.onCodeInput
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $setup.loginForm.code]
            ]),
            vue.createElementVNode("button", {
              class: "code-btn",
              onClick: $setup.sendSmsCode,
              disabled: $setup.sendingCode || !$setup.isPhoneValid
            }, vue.toDisplayString($setup.sendingCode ? `${$setup.countdown}s` : "获取验证码"), 9, ["disabled"])
          ]),
          vue.createElementVNode("button", {
            class: "confirm-btn",
            onClick: $setup.handleLogin,
            loading: $setup.isLoading
          }, " 登录 / 注册 ", 8, ["loading"])
        ]),
        vue.createElementVNode("view", { class: "terms-agreement" }, [
          vue.createElementVNode("text", null, "登录/注册即表示您已阅读并同意"),
          vue.createElementVNode("navigator", {
            url: "/pages/terms/terms",
            class: "link-text"
          }, " 《服务条款与隐私政策》 ")
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/login/login.vue"]]);
  const navbarHeight = "88rpx";
  const _sfc_main$c = {
    __name: "terms",
    setup(__props, { expose: __expose }) {
      __expose();
      function goBack() {
        uni.navigateBack();
      }
      const __returned__ = { navbarHeight, goBack, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "terms-container" }, [
      vue.createCommentVNode(" 自定义导航栏 "),
      vue.createElementVNode("view", { class: "custom-navbar" }, [
        vue.createElementVNode("view", {
          class: "back-icon",
          onClick: $setup.goBack
        }, "←"),
        vue.createElementVNode("view", { class: "navbar-title" }, "服务条款与隐私")
      ]),
      vue.createCommentVNode(" 生效日期 "),
      vue.createCommentVNode(' <view class="effective-date">生效日期：2025年6月3日</view> '),
      vue.createCommentVNode(" 服务条款部分 "),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "一、服务条款"),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 1. 本平台旨在为用户提供“技工搜索与对接”服务，主要涵盖水电、家电、家具维修清洗等领域的技工信息发布与预约。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 2. 本服务仅面向年满18周岁的成年人开放，任何具有完全民事行为能力的个人均可注册并使用本平台功能。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 3. 用户注册并登录后，可在平台上发布需求、浏览技工信息、发起私聊、拨打电话、查看评价、提交评价、添加收藏等操作；技工用户可在平台上发布服务信息、设置服务区域、更新个人资料、管理订单、查看用户评价等。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 4. 本服务目前仅支持微信小程序端和 Android、iOS 原生 App（基于 uni-app 打包）；暂不支持 H5 访问。 ")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "二、账户注册与登录"),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 1. 用户注册/登录仅需提供有效手机号码，并通过阿里云短信服务（仅用于发送验证码）完成手机号验证，无需填写密码。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 2. 注册成功后，系统会自动生成唯一账号（与手机号一致）及用户ID。用户可选择性地在“个人中心”补充昵称、头像、年龄、技能标签、地理位置等信息。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 3. 若用户更换手机或归属地，请及时登录更新手机号码或重新进行验证，以保证账号安全。用户应妥善保管自己的手机与验证码信息，对因个人原因造成的账户泄漏或损失，平台不承担责任。 ")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "三、用户信息与行为规范"),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 1. 用户在平台发布的所有信息（包括但不限于姓名、手机号、技能介绍、服务区域、图片、评价等）均需真实、合法、有效，不得包含违法、色情、暴力、恶意欺诈等内容。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 2. 用户不得将其账号转借、出租、出售或以其他任何方式向第三方提供使用。如发生上述情况，一切后果由账号持有人自行承担，并将被平台视作违规处理。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createCommentVNode(" 第一行标题 "),
            vue.createElementVNode("text", { class: "item-text" }, " 3. 平台对以下行为有权进行警告、限制功能使用、永久封禁账号等处罚： "),
            vue.createCommentVNode(" 每一条单独成行 "),
            vue.createElementVNode("view", { class: "item-text indent" }, "• 发布虚假或侵权信息；"),
            vue.createElementVNode("view", { class: "item-text indent" }, "• 恶意骚扰他人、故意诋毁他人；"),
            vue.createElementVNode("view", { class: "item-text indent" }, "• 利用平台漏洞作弊或实施违法犯罪活动；"),
            vue.createElementVNode("view", { class: "item-text indent" }, "• 其他违反国家法律法规或平台约定的行为。")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "四、内容版权与平台权利"),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 1. 用户通过本平台发布的所有原创文字、图片、音视频等作品，其著作权归用户所有；用户同时授予平台在全球范围内免费、永久、可转授权的使用许可，平台可在平台内外展示、传播、存储、转载、衍生（如为推广、截图、宣传等用途）。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 2. 用户保证其上传内容不侵犯任何第三方的合法权益；若因用户上传内容导致任何第三方或政府机关对平台或平台关联主体提出索赔或行政处罚，用户应当独立承担所有法律责任，并保证平台免受损失。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 3. 平台对服务的界面、功能、Logo、商标、运营活动等拥有完整的知识产权，未经平台书面同意，任何个人或机构不得以任何方式擅自复制、模仿、使用、发布、发布含有平台标识的同类或相似产品。 ")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "五、免责声明"),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 1. 本平台仅提供技工信息展示、在线沟通与交互，技工的服务质量、水平、合法资质等因素均由用户自行判断并承担风险。平台无法也不对任何用户（无论是技工还是需求方）提供的服务结果承担连带责任。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 2. 平台对网络环境、服务器、软件、硬件、第三方短信、第三方地图等服务供应商的稳定性与安全性不做保证。如因设备损坏、网络故障、中断、黑客攻击、不可抗力等非平台原因导致服务中断或数据丢失，平台不承担赔偿责任。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 3. 对于用户在平台上发生的纠纷，平台会在能力范围内提供协调、投诉通道和证据保存帮助，但对纠纷最终结果不承担法律责任。 ")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "六、用户投诉与申诉"),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 1. 如用户发现其他用户/技工存在虚假信息、侵犯自己合法权益等行为，可通过“个人中心→投诉与反馈”提交相关证据及说明。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 2. 平台收到投诉后，将在七个工作日内审核并视情况对涉嫌违规内容进行下架或账号处理，并及时向投诉方反馈处理结果。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 3. 如用户对平台处罚有异议，可在收到通知后15日内提交申诉材料，平台将再次审核并给出最终答复。 ")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "七、条款变更与终止"),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 1. 本条款在必要时可进行修改，修改内容会在平台公告并以弹窗或消息推送形式提醒所有用户，无需单独通知。若用户在条款更新后继续使用本服务，即视为接受修改后的条款；如不同意修改，可停止使用并注销账号。 ")
          ]),
          vue.createElementVNode("view", { class: "item" }, [
            vue.createElementVNode("text", { class: "item-text" }, " 2. 平台保留因业务调整、中断或终止服务的权利，并会提前十个工作日通知用户。因平台原因导致的损失，平台将与用户协商妥善处置，但不承担额外赔偿责任。 ")
          ])
        ])
      ]),
      vue.createCommentVNode(" 隐私政策部分 "),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "隐私政策"),
        vue.createElementVNode("view", { class: "subsection" }, [
          vue.createElementVNode("view", { class: "sub-title" }, "一、总则"),
          vue.createElementVNode("view", { class: "sub-content" }, [
            vue.createElementVNode("text", null, " 为向您提供更加安全、可靠的“技工搜索与对接”服务，保护您的个人信息安全，特制定本《隐私政策》。您使用本平台即表示同意本政策所述内容（包括政策不时更新后的版本）。 ")
          ])
        ]),
        vue.createElementVNode("view", { class: "subsection" }, [
          vue.createElementVNode("view", { class: "sub-title" }, "二、信息的收集"),
          vue.createElementVNode("view", { class: "sub-content" }, [
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 1. 必填信息： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 手机号码：用于注册/登录时发送验证码验证。该信息为用户唯一标识，不对外公开。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 2. 可选信息： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 昵称、头像、年龄、性别、技能标签：供用户个性化展示；用户不填写时，平台会赋予默认值（如“用户_后四位”、“系统默认头像”）。 "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 地理位置信息：用于计算与技工距离、搜索附近服务、推送本地热门技工，用户可在“个人中心”随时开启/关闭位置授权。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 3. 自动收集信息： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 本平台不会主动采集设备型号、系统版本、IP等信息，但可能在日志里记录访问时间、请求接口、错误日志等，用于技术维护和故障排查。 "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 不会使用 Cookie 或第三方 SDK 来跟踪用户行为，也不会对用户进行跨站点跟踪。 ")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "subsection" }, [
          vue.createElementVNode("view", { class: "sub-title" }, "三、信息的使用与存储"),
          vue.createElementVNode("view", { class: "sub-content" }, [
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 1. 使用方式： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 手机验证：发送登录/注册验证码，确保账户安全。 "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 功能提供：展示技工列表、计算距离、推送附近服务。 "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 沟通与评价：如用户发起私聊、拨打电话、查看评论等功能，需要在平台内关联真实手机号或加密后数据，以保证沟通顺畅，但平台不会泄露完整号码给第三方。 "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 个性化体验：根据用户填写的年龄、技能、地理位置信息，为用户推荐匹配度更高的技工信息。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 2. 存储时长： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 用户的账号基本信息（手机号、昵称、头像、地理位置、技能标签等）会一直保存在阿里云数据库中，直至用户主动注销账号。 "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 登录记录、浏览记录、聊天记录会保存6个月，用于平台优化、客服介入或纠纷核查；若无特殊需求，6个月后自动清除。 "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 短信验证码在数据库中保存时长为5分钟，用于校验验证码有效性；校验完成后立即删除。 ")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "subsection" }, [
          vue.createElementVNode("view", { class: "sub-title" }, "四、信息的共享与披露"),
          vue.createElementVNode("view", { class: "sub-content" }, [
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 1. 本平台不向任何第三方出售、出租、共享用户个人信息。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 2. 平台仅在以下情形下，部分或全部披露用户信息： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 法律法规要求或应司法、行政机关的要求； "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 平台安全维护：如出现账号被恶意盗用、黑灰产攻击等情况，需要披露给安全审计部门或技术合作方，仅限于查明安全事件原因； "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 用户明确授权：如用户在其他系统内主动授权本平台获取相应数据（目前暂无此需求）。 ")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "subsection" }, [
          vue.createElementVNode("view", { class: "sub-title" }, "五、信息安全保护措施"),
          vue.createElementVNode("view", { class: "sub-content" }, [
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 1. 传输安全： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 平台一切网络请求均采用 HTTPS 加密传输，防止第三方网络监听或篡改。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 2. 存储安全： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 用户信息和聊天记录等保存在阿里云 UniCloud（阿里云数据库与存储服务），阿里云具有完善的物理与网络安全机制，包括但不限于：主机防火墙、DDoS 防护、数据加密、访问控制、定期漏洞扫描。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 3. 访问权限控制： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 仅限平台授权的运维人员或系统管理员可以访问生产环境数据库，所有访问都有审计日志；普通开发人员仅能访问测试环境。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 4. 加密与脱敏： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 在业务场景中，会对用户手机号码进行部分脱敏处理（如展示仅保留前三位和后四位）。 "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 聊天记录存储时，对手机号等敏感字段进行 AES 加密（仅内部解密权限，用于纠纷核查），避免明文存储。 ")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "subsection" }, [
          vue.createElementVNode("view", { class: "sub-title" }, "六、用户权利"),
          vue.createElementVNode("view", { class: "sub-content" }, [
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 1. 访问与更正： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 用户可在“个人中心”随时查看和修改自己的昵称、头像、性别、年龄、技能标签、地理位置等可选信息。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 2. 删除与注销： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 用户如果希望注销账号，可在“个人中心→设置→注销账号”中操作；账号注销后，用户的手机号、昵称、头像、浏览记录及订单数据将立即从平台数据库中删除，但聊天记录与评价记录会在6个月后自动删除。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 3. 关闭授权： "),
              vue.createElementVNode("text", { class: "item-text indent" }, " • 用户可随时在微信小程序或 App 设置中撤销“位置授权”，此后平台将无法获取地理位置信息。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 4. 投诉与反馈： "),
              vue.createElementVNode("text", { class: "item-text indent" }, [
                vue.createTextVNode(" • 如对个人信息使用方式有异议，可通过邮箱 "),
                vue.createElementVNode("text", { class: "email" }, "3327261595@qq.com"),
                vue.createTextVNode(" 联系我们，平台将在7个工作日内回复并妥善处理。 ")
              ])
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "subsection" }, [
          vue.createElementVNode("view", { class: "sub-title" }, "七、儿童信息保护"),
          vue.createElementVNode("view", { class: "sub-content" }, [
            vue.createElementVNode("text", null, " 本平台仅面向成年人开放，18岁以下人士（含未成年人）请勿注册。如平台发现注册信息明显属于未成年人，将立即封禁该账号并删除相关信息。如您为监护人且发现孩子误操作注册，可及时向我们发送证明材料（身份证明、监护人身份证明）申请账号删除。 ")
          ])
        ]),
        vue.createElementVNode("view", { class: "subsection" }, [
          vue.createElementVNode("view", { class: "sub-title" }, "八、政策更新"),
          vue.createElementVNode("view", { class: "sub-content" }, [
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 1. 平台有权随时修订本《隐私政策》，修订后会在小程序内“服务条款与隐私政策”页面以弹窗或公告形式提示所有用户，并在文首注明“生效日期”。 ")
            ]),
            vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("text", { class: "item-text" }, " 2. 若用户在本政策修订后，继续使用本平台服务，则视为已接受更新内容；如不同意更新，可随时停止使用并申请注销账号。 ")
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 联系方式 "),
      vue.createElementVNode("view", { class: "contact-us" }, [
        vue.createElementVNode("text", null, "如对本“服务条款”或“隐私政策”有任何疑问，请联系："),
        vue.createElementVNode("text", { class: "email" }, "3327261595@qq.com")
      ])
    ]);
  }
  const PagesTermsTerms = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/terms/terms.vue"]]);
  const _sfc_main$b = {
    __name: "HomepageDetail",
    setup(__props, { expose: __expose }) {
      __expose();
      const db = tr.database();
      const detail = vue.ref(null);
      const id = vue.ref("");
      const loading = vue.ref(true);
      const maskedPhone = vue.ref("");
      const replyState = vue.reactive({});
      const visibleComments = vue.computed(() => {
        if (!detail.value || !detail.value.comments) {
          return [];
        }
        return detail.value.comments.slice(0, 2);
      });
      const formatMonthDay = (timestamp) => {
        const date = new Date(timestamp);
        const m2 = date.getMonth() + 1;
        const d2 = date.getDate();
        return `${m2.toString().padStart(2, "0")}月${d2.toString().padStart(2, "0")}日`;
      };
      onLoad((options) => {
        if (options.id) {
          id.value = options.id;
          getDetail();
          recordView(options.id);
        } else {
          uni.showToast({
            title: "无法加载详情",
            icon: "none"
          });
          loading.value = false;
        }
      });
      const getDetail = async () => {
        try {
          const res = await tr.callFunction({
            name: "getHomepageDetail",
            data: { id: id.value }
          });
          if (res.result && res.result.data) {
            let workerDetail = res.result.data;
            const userInfo = uni.getStorageSync("userinfo") || {};
            const currentUserPhone = userInfo.phoneNumber;
            let hasLikedToday = false;
            if (workerDetail.likedBy && Array.isArray(workerDetail.likedBy) && currentUserPhone) {
              const today = (/* @__PURE__ */ new Date()).toDateString();
              hasLikedToday = workerDetail.likedBy.some(
                (item) => item.phoneNumber === currentUserPhone && new Date(item.likeTime).toDateString() === today
              );
            }
            workerDetail.userLiked = hasLikedToday;
            if (!workerDetail.bannerImages || !Array.isArray(workerDetail.bannerImages) || workerDetail.bannerImages.length === 0) {
              workerDetail.bannerImages = ["/static/images/logo.jpg"];
            }
            if (workerDetail.comments && Array.isArray(workerDetail.comments)) {
              workerDetail.comments.sort((a2, b2) => b2.createdAt - a2.createdAt);
            }
            if (workerDetail.comments) {
              workerDetail.comments.forEach((comment) => {
                replyState[comment.appointmentId] = {
                  showReplies: false,
                  // 默认不显示回复
                  showInput: false,
                  // 默认不显示输入框
                  content: ""
                  // 回复内容
                };
              });
            }
            const rawPhone = workerDetail.phoneNumber || "";
            maskedPhone.value = rawPhone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
            detail.value = workerDetail;
          } else {
            uni.showToast({ title: "加载失败，无数据返回", icon: "none" });
          }
        } catch (err) {
          formatAppLog("error", "at pages/HomepageDetail/HomepageDetail.vue:233", "加载详情失败", err);
          uni.showToast({ title: "加载失败，请稍后重试", icon: "none" });
        } finally {
          loading.value = false;
        }
      };
      const toggleLike = async () => {
        const userInfo = uni.getStorageSync("userinfo");
        if (!userInfo || !userInfo.phoneNumber) {
          return uni.showToast({ title: "请先登录", icon: "none" });
        }
        const originalLiked = detail.value.userLiked;
        const originalCount = detail.value.likeCount;
        detail.value.userLiked = !originalLiked;
        detail.value.likeCount += originalLiked ? -1 : 1;
        uni.vibrateShort();
        try {
          const res = await tr.callFunction({
            name: "updateLike",
            data: {
              id: id.value,
              phoneNumber: userInfo.phoneNumber
            }
          });
          if (!res.result.success) {
            detail.value.userLiked = originalLiked;
            detail.value.likeCount = originalCount;
            uni.showToast({ title: res.result.message || "操作失败", icon: "none" });
          }
        } catch (err) {
          detail.value.userLiked = originalLiked;
          detail.value.likeCount = originalCount;
          uni.showToast({ title: "点赞失败，请检查网络", icon: "none" });
        }
      };
      const recordView = (workerId) => {
        const userInfo = uni.getStorageSync("userinfo") || {};
        tr.callFunction({
          name: "recordHomepageView",
          data: {
            id: workerId,
            phoneNumber: userInfo.phoneNumber || "匿名用户"
          }
        }).then((res) => {
          formatAppLog("log", "at pages/HomepageDetail/HomepageDetail.vue:286", "浏览记录成功", res);
        }).catch((err) => {
          formatAppLog("error", "at pages/HomepageDetail/HomepageDetail.vue:288", "记录浏览失败", err);
        });
      };
      const handlePhoneCall = () => {
        var _a;
        const realPhone = (_a = detail.value) == null ? void 0 : _a.phoneNumber;
        if (!realPhone) {
          return uni.showToast({ title: "电话号码未提供", icon: "none" });
        }
        uni.showModal({
          title: "确认拨打",
          content: `确定拨打 ${maskedPhone.value} 吗？`,
          success: (res) => {
            if (res.confirm) {
              uni.makePhoneCall({
                phoneNumber: realPhone,
                success: () => {
                  recordCallEvent();
                },
                fail: (err) => {
                  formatAppLog("log", "at pages/HomepageDetail/HomepageDetail.vue:309", "拨打失败", err);
                }
              });
            }
          }
        });
      };
      const recordCallEvent = () => {
        const userInfo = uni.getStorageSync("userinfo") || {};
        tr.callFunction({
          name: "recordUserPhoneCallAction",
          data: {
            actionType: "phone_call",
            targetId: id.value,
            targetPhoneNumber: detail.value.phoneNumber,
            callerPhoneNumber: userInfo.phoneNumber || "未登录用户"
          }
        }).then(() => {
          formatAppLog("log", "at pages/HomepageDetail/HomepageDetail.vue:328", "拨打事件已记录");
        }).catch((err) => {
          formatAppLog("error", "at pages/HomepageDetail/HomepageDetail.vue:330", "记录拨打行为失败", err);
        });
      };
      const handleStartChat = async () => {
        const userInfo = uni.getStorageSync("userinfo") || {};
        const userA_phone = userInfo.phoneNumber;
        const userB_phone = detail.value.phoneNumber;
        if (!userA_phone) {
          return uni.showToast({ title: "请先登录", icon: "none" });
        }
        if (!userB_phone) {
          return uni.showToast({ title: "无效的聊天对象", icon: "none" });
        }
        if (userA_phone === userB_phone) {
          return uni.showToast({ title: "不能和自己聊天", icon: "none" });
        }
        uni.showLoading({ title: "正在创建会话..." });
        try {
          const res = await tr.callFunction({
            name: "createOrUpdateChatSession",
            data: {
              userAPhone: userA_phone,
              userBPhone: userB_phone
            }
          });
          uni.hideLoading();
          if (res.result.success && res.result.sessionId) {
            uni.navigateTo({
              url: `/pages/chatDetail/chatDetail?sessionId=${res.result.sessionId}`
            });
          } else {
            uni.showToast({ title: res.result.message || "会话创建失败", icon: "none" });
          }
        } catch (err) {
          uni.hideLoading();
          formatAppLog("error", "at pages/HomepageDetail/HomepageDetail.vue:370", "ChatSession 创建失败", err);
          uni.showToast({ title: "会话创建出错，请重试", icon: "none" });
        }
      };
      const handleAppointment = () => {
        var _a, _b;
        const userInfo = uni.getStorageSync("userinfo");
        if (!userInfo || !userInfo._id) {
          uni.showToast({
            title: "请先登录再预约",
            icon: "none"
          });
          return;
        }
        const userId = ((_a = detail.value) == null ? void 0 : _a.userId) || "";
        const accountPhoneNumber = ((_b = detail.value) == null ? void 0 : _b.accountPhoneNumber) || "";
        if (!userId || !accountPhoneNumber) {
          return uni.showToast({
            title: "预约信息不完整",
            icon: "none"
          });
        }
        uni.navigateTo({
          url: `/pages/appointmentForm/appointmentForm?userId=${userId}&accountPhoneNumber=${accountPhoneNumber}`
        });
      };
      const toggleReplies = (commentId) => {
        if (replyState[commentId]) {
          replyState[commentId].showReplies = !replyState[commentId].showReplies;
        }
      };
      const toggleReplyInput = (commentId) => {
        const userInfo = uni.getStorageSync("userinfo");
        if (!userInfo || !userInfo._id) {
          uni.showToast({ title: "请先登录再回复", icon: "none" });
          return;
        }
        if (replyState[commentId]) {
          replyState[commentId].showInput = !replyState[commentId].showInput;
        }
      };
      const handleReplySubmit = async (commentId) => {
        const replyContent = replyState[commentId].content;
        if (!replyContent.trim()) {
          uni.showToast({ title: "回复内容不能为空", icon: "none" });
          return;
        }
        const storageUser = uni.getStorageSync("userinfo");
        if (!storageUser || !storageUser._id) {
          uni.showToast({ title: "请先登录再回复", icon: "none" });
          return;
        }
        const caller = {
          _id: storageUser._id,
          nickname: storageUser.name || storageUser.nickname || "",
          // 优先用 name 或 nickname
          avatar: storageUser.avatar || ""
          // 本地存的 avatar 字段
        };
        uni.showLoading({ title: "正在提交..." });
        try {
          const res = await tr.callFunction({
            name: "addCommentReply",
            data: {
              homepageId: detail.value._id,
              // 或 technicianId.value
              commentId,
              content: replyContent.trim(),
              userInfo: caller
              // 透传 caller 对象
            }
          });
          uni.hideLoading();
          if (res.result.success) {
            uni.showToast({ title: "回复成功", icon: "success" });
            replyState[commentId].content = "";
            replyState[commentId].showInput = false;
            getDetail();
          } else {
            uni.showToast({ title: res.result.message || "回复失败", icon: "none" });
          }
        } catch (err) {
          uni.hideLoading();
          uni.showToast({ title: "回复失败，请重试", icon: "none" });
          formatAppLog("error", "at pages/HomepageDetail/HomepageDetail.vue:470", "回复提交失败", err);
        }
      };
      const navigateToAllComments = () => {
        uni.navigateTo({
          url: `/pages/allComments/allComments?technicianId=${detail.value._id}`
        });
      };
      const __returned__ = { db, detail, id, loading, maskedPhone, replyState, visibleComments, formatMonthDay, getDetail, toggleLike, recordView, handlePhoneCall, recordCallEvent, handleStartChat, handleAppointment, toggleReplies, toggleReplyInput, handleReplySubmit, navigateToAllComments, ref: vue.ref, reactive: vue.reactive, computed: vue.computed, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          style: { "padding": "50rpx 30rpx", "min-height": "50vh" }
        }, [
          vue.createElementVNode("view", { class: "skeleton" }, [
            vue.createElementVNode("view", { class: "skeleton-title" }),
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(5, (i2) => {
                return vue.createElementVNode("view", {
                  class: "skeleton-row",
                  key: i2
                });
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ])) : vue.createCommentVNode("v-if", true),
        !$setup.loading && $setup.detail ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "worker-detail"
        }, [
          vue.createElementVNode("swiper", {
            class: "banner-swiper",
            autoplay: "",
            interval: "3000",
            circular: "",
            "indicator-dots": ""
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.detail.bannerImages, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
                  vue.createElementVNode("image", {
                    class: "banner-img",
                    src: item,
                    mode: "aspectFill"
                  }, null, 8, ["src"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "basic-info" }, [
            vue.createElementVNode("image", {
              class: "avatar",
              src: $setup.detail.avatar,
              mode: "aspectFill"
            }, null, 8, ["src"]),
            vue.createElementVNode("view", { class: "info-text" }, [
              vue.createElementVNode(
                "view",
                { class: "name" },
                vue.toDisplayString($setup.detail.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "tags" }, [
                $setup.detail.age ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 0 },
                  vue.toDisplayString($setup.detail.age) + "岁",
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode(
                "view",
                { class: "area" },
                "服务区域：" + vue.toDisplayString($setup.detail.serviceArea),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", {
              class: "like-container",
              onClick: $setup.toggleLike
            }, [
              vue.createElementVNode("image", {
                class: "like-icon",
                src: `/static/images/${$setup.detail.userLiked ? "like.png" : "like.no.png"}`
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "text",
                { class: "like-count" },
                vue.toDisplayString($setup.detail.likeCount),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "service-section" }, [
            vue.createElementVNode("view", { class: "section-title" }, "服务内容"),
            vue.createElementVNode("view", { class: "tag-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.detail.skills, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      class: "skill-tag",
                      key: index
                    },
                    vue.toDisplayString(item),
                    1
                    /* TEXT */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode(
              "view",
              { class: "price" },
              "参考价格：" + vue.toDisplayString($setup.detail.price),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "desc-section" }, [
            vue.createElementVNode("view", { class: "section-title" }, "个人简介"),
            vue.createElementVNode(
              "text",
              { class: "desc-text" },
              vue.toDisplayString($setup.detail.description),
              1
              /* TEXT */
            )
          ]),
          $setup.detail.comments && $setup.detail.comments.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "comment-section"
          }, [
            vue.createElementVNode("view", { class: "section-title" }, "用户评价"),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.visibleComments, (item) => {
                var _a, _b, _c;
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "comment-item",
                  key: item.appointmentId
                }, [
                  vue.createElementVNode("view", { class: "comment-header" }, [
                    vue.createElementVNode("image", {
                      class: "comment-avatar",
                      src: item.avatar
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "comment-info" }, [
                      vue.createElementVNode(
                        "view",
                        { class: "comment-name" },
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "comment-date" },
                        vue.toDisplayString($setup.formatMonthDay(item.createdAt)),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  item.rating ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "comment-rating"
                  }, [
                    (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(5, (star) => {
                        return vue.createElementVNode(
                          "text",
                          {
                            key: star,
                            class: vue.normalizeClass(["star", { "active": star <= item.rating }])
                          },
                          "★",
                          2
                          /* CLASS */
                        );
                      }),
                      64
                      /* STABLE_FRAGMENT */
                    ))
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "view",
                    { class: "comment-content" },
                    vue.toDisplayString(item.comment),
                    1
                    /* TEXT */
                  ),
                  item.images && item.images.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "comment-images"
                  }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(item.images, (img, imgIndex) => {
                        return vue.openBlock(), vue.createElementBlock("image", {
                          key: imgIndex,
                          src: img,
                          mode: "aspectFill",
                          class: "comment-img"
                        }, null, 8, ["src"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("view", { class: "comment-actions" }, [
                    vue.createElementVNode("view", {
                      class: "reply-btn",
                      onClick: ($event) => $setup.toggleReplyInput(item.appointmentId)
                    }, "回复", 8, ["onClick"])
                  ]),
                  item.replies && item.replies.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 2,
                    class: "replies-wrapper"
                  }, [
                    vue.withDirectives(vue.createElementVNode(
                      "view",
                      { class: "reply-list" },
                      [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList(item.replies, (reply) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              class: "reply-item",
                              key: reply.replyId
                            }, [
                              vue.createElementVNode("image", {
                                class: "reply-avatar",
                                src: reply.userAvatar
                              }, null, 8, ["src"]),
                              vue.createElementVNode("view", { class: "reply-content" }, [
                                vue.createElementVNode("view", { class: "reply-header" }, [
                                  vue.createElementVNode(
                                    "text",
                                    { class: "reply-name" },
                                    vue.toDisplayString(reply.userName),
                                    1
                                    /* TEXT */
                                  ),
                                  vue.createElementVNode(
                                    "text",
                                    { class: "reply-date" },
                                    vue.toDisplayString($setup.formatMonthDay(reply.createdAt)),
                                    1
                                    /* TEXT */
                                  )
                                ]),
                                vue.createElementVNode(
                                  "view",
                                  { class: "reply-text" },
                                  vue.toDisplayString(reply.content),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ],
                      512
                      /* NEED_PATCH */
                    ), [
                      [vue.vShow, (_a = $setup.replyState[item.appointmentId]) == null ? void 0 : _a.showReplies]
                    ]),
                    vue.createElementVNode("view", {
                      class: "toggle-replies",
                      onClick: ($event) => $setup.toggleReplies(item.appointmentId)
                    }, vue.toDisplayString(((_b = $setup.replyState[item.appointmentId]) == null ? void 0 : _b.showReplies) ? "收起回复" : `查看全部 ${item.replies.length} 条回复`), 9, ["onClick"])
                  ])) : vue.createCommentVNode("v-if", true),
                  ((_c = $setup.replyState[item.appointmentId]) == null ? void 0 : _c.showInput) ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 3,
                    class: "reply-input-area"
                  }, [
                    vue.withDirectives(vue.createElementVNode("input", {
                      class: "reply-input",
                      "onUpdate:modelValue": ($event) => $setup.replyState[item.appointmentId].content = $event,
                      placeholder: "输入你的回复..."
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vue.vModelText, $setup.replyState[item.appointmentId].content]
                    ]),
                    vue.createElementVNode("button", {
                      class: "reply-submit-btn",
                      size: "mini",
                      onClick: ($event) => $setup.handleReplySubmit(item.appointmentId)
                    }, " 发送 ", 8, ["onClick"])
                  ])) : vue.createCommentVNode("v-if", true)
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            vue.createElementVNode(
              "view",
              {
                class: "toggle-more",
                onClick: $setup.navigateToAllComments
              },
              " 查看全部 " + vue.toDisplayString($setup.detail.comments.length) + " 条评论 ",
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "contact-section" }, [
            vue.createElementVNode("button", {
              class: "call-btn",
              onClick: $setup.handlePhoneCall
            }, "拨打电话"),
            vue.createElementVNode("button", {
              class: "start-chat-btn",
              onClick: $setup.handleStartChat
            }, "发起聊天"),
            vue.createElementVNode("button", {
              class: "appointment-btn",
              onClick: $setup.handleAppointment
            }, "预约服务")
          ]),
          $setup.detail.media && $setup.detail.media.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "media-section"
          }, [
            vue.createElementVNode("view", { class: "section-title" }, "施工过程案例展示"),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.detail.media, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "media-item",
                  key: index
                }, [
                  item.type === "image" ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    class: "media-img",
                    src: item.src,
                    mode: "widthFix"
                  }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true),
                  item.type === "video" ? (vue.openBlock(), vue.createElementBlock("video", {
                    key: 1,
                    class: "media-video",
                    src: item.src,
                    controls: ""
                  }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true)
        ])) : vue.createCommentVNode("v-if", true)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesHomepageDetailHomepageDetail = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/HomepageDetail/HomepageDetail.vue"]]);
  const _imports_0$1 = "/static/images/appointment-time.png";
  const _imports_1 = "/static/images/sendImg.png";
  const _imports_2 = "/static/images/location.png";
  const QQ_MAP_KEY_MP$1 = "ZOYBZ-S7V6G-OSQQ2-QA54H-2PBHE-CXF46";
  const QQ_MAP_KEY_APP$1 = "3QUBZ-FFCCB-6GYUO-NQI2R-WDUB5-BJFIY";
  const DEFAULT_AVATAR = "/static/images/avatar-placeholder.png";
  const PAGE_SIZE = 15;
  const _sfc_main$a = {
    __name: "chatDetail",
    setup(__props, { expose: __expose }) {
      __expose();
      const sessionId = vue.ref("");
      const myPhoneNumber = vue.ref("");
      const messages2 = vue.ref([]);
      const messageInput = vue.ref("");
      const scrollIntoView = vue.ref("");
      const scrollViewHeight = vue.ref(0);
      const keyboardHeight = vue.ref(0);
      const isLoadingMore = vue.ref(false);
      const noMoreMessages = vue.ref(false);
      let pollingTimer = null;
      const lastMessageTimestamp = vue.ref(0);
      const formatTimestamp = (ts2) => {
        if (!ts2)
          return "未知时间";
        const d2 = new Date(ts2);
        if (isNaN(d2.getTime()))
          return "无效时间";
        const mm = String(d2.getMonth() + 1).padStart(2, "0");
        const dd = String(d2.getDate()).padStart(2, "0");
        const HH = String(d2.getHours()).padStart(2, "0");
        const MM = String(d2.getMinutes()).padStart(2, "0");
        return `${d2.getFullYear()}/${mm}/${dd} ${HH}:${MM}`;
      };
      const calcScrollHeight = () => {
        const inst = vue.getCurrentInstance();
        if (!inst)
          return;
        uni.createSelectorQuery().in(inst).select(".input-bar").boundingClientRect((rect) => {
          if (!rect)
            return;
          const winH = uni.getSystemInfoSync().windowHeight;
          scrollViewHeight.value = winH - rect.height - keyboardHeight.value;
          scrollToBottom();
        }).exec();
      };
      const scrollToBottom = () => {
        vue.nextTick(() => {
          if (messages2.value.length > 0) {
            const lastMessage = messages2.value[messages2.value.length - 1];
            scrollIntoView.value = "msg-" + lastMessage._id;
          }
        });
      };
      const fetchInitialMessages = async () => {
        try {
          const res = await tr.callFunction({
            name: "get-history-messages",
            data: {
              sessionId: sessionId.value,
              lastTimestamp: Date.now(),
              pageSize: PAGE_SIZE
            }
          });
          if (res.result.success) {
            const arr = await processMessages(res.result.data);
            messages2.value = arr;
            noMoreMessages.value = arr.length < PAGE_SIZE;
            if (arr.length > 0) {
              lastMessageTimestamp.value = arr[arr.length - 1].timestamp;
            } else {
              lastMessageTimestamp.value = Date.now();
            }
            scrollToBottom();
          } else {
            uni.showToast({ title: "获取消息失败", icon: "none" });
          }
        } catch (e2) {
          formatAppLog("error", "at pages/chatDetail/chatDetail.vue:201", "获取初始消息失败:", e2);
        }
      };
      const loadMoreMessages = async () => {
        var _a, _b;
        if (isLoadingMore.value || noMoreMessages.value)
          return;
        isLoadingMore.value = true;
        try {
          const firstTs = ((_a = messages2.value[0]) == null ? void 0 : _a.timestamp) || Date.now();
          const res = await tr.callFunction({
            name: "get-history-messages",
            data: {
              sessionId: sessionId.value,
              lastTimestamp: firstTs,
              pageSize: PAGE_SIZE
            }
          });
          if (res.result.success && res.result.data.length > 0) {
            const arr = await processMessages(res.result.data);
            const oldFirstMsgId = "msg-" + ((_b = messages2.value[0]) == null ? void 0 : _b._id);
            messages2.value = [...arr, ...messages2.value];
            noMoreMessages.value = res.result.data.length < PAGE_SIZE;
            vue.nextTick(() => {
              scrollIntoView.value = oldFirstMsgId;
            });
          } else {
            noMoreMessages.value = true;
          }
        } catch (e2) {
          formatAppLog("error", "at pages/chatDetail/chatDetail.vue:231", "加载更多消息失败:", e2);
        } finally {
          isLoadingMore.value = false;
        }
      };
      const processMessages = async (raw) => {
        const imgs = raw.filter((m2) => m2.type === "image" && m2.fileUrl.startsWith("cloud://")).map((m2) => m2.fileUrl);
        let urlMap = {};
        if (imgs.length) {
          const tmp = await tr.getTempFileURL({ fileList: imgs });
          tmp.fileList.forEach((item) => {
            urlMap[item.fileID] = item.tempFileURL;
          });
        }
        return raw.map((m2) => ({
          ...m2,
          avatarUrl: m2.avatarUrl || DEFAULT_AVATAR,
          fileUrl: m2.type === "image" ? urlMap[m2.fileUrl] || m2.fileUrl : m2.fileUrl
        }));
      };
      const pollForNewMessages = async () => {
        if (!sessionId.value || !lastMessageTimestamp.value)
          return;
        try {
          const res = await tr.callFunction({
            name: "get-latest-messages",
            data: {
              sessionId: sessionId.value,
              lastTimestamp: lastMessageTimestamp.value
            }
          });
          if (res.result.success && res.result.data.length > 0) {
            const allNewMessages = res.result.data;
            const otherNewMessages = allNewMessages.filter((m2) => m2.sender !== myPhoneNumber.value);
            if (otherNewMessages.length > 0) {
              const uniqueNewMessages = otherNewMessages.filter(
                (newMsg) => !messages2.value.some((existingMsg) => existingMsg._id === newMsg._id)
              );
              if (uniqueNewMessages.length > 0) {
                const processedMessages = await processMessages(uniqueNewMessages);
                messages2.value.push(...processedMessages);
                scrollToBottom();
                markMessagesAsRead();
              }
            }
            lastMessageTimestamp.value = allNewMessages[allNewMessages.length - 1].timestamp;
          }
        } catch (error) {
          formatAppLog("error", "at pages/chatDetail/chatDetail.vue:291", "轮询出错:", error);
        }
      };
      const _sendMessage = async (content) => {
        const ui = uni.getStorageSync("userinfo") || {};
        const localMessage = {
          _id: `local_${Date.now()}`,
          type: content.type,
          sender: myPhoneNumber.value,
          avatarUrl: ui.avatar || DEFAULT_AVATAR,
          name: ui.name || "用户",
          sessionId: sessionId.value,
          timestamp: Date.now(),
          isRevoked: false,
          ...content.type === "text" ? { message: content.text } : {},
          ...content.type === "image" ? { fileUrl: content.tempPath, _tempPath: true } : {},
          ...content.type === "location" ? { location: content.location } : {}
        };
        messages2.value.push(localMessage);
        scrollToBottom();
        if (content.type === "image") {
          try {
            uni.showLoading({ title: "上传中..." });
            const uploadResult = await tr.uploadFile({
              filePath: content.tempPath,
              cloudPath: `chat-images/${sessionId.value}/${Date.now()}`
            });
            content.fileID = uploadResult.fileID;
            uni.hideLoading();
          } catch (e2) {
            uni.hideLoading();
            uni.showToast({ title: "图片上传失败", icon: "none" });
            const index = messages2.value.findIndex((m2) => m2._id === localMessage._id);
            if (index > -1)
              messages2.value.splice(index, 1);
            return;
          }
        }
        try {
          const res = await tr.callFunction({
            name: "send-chat-message",
            data: {
              sessionId: sessionId.value,
              message: {
                type: content.type,
                sender: myPhoneNumber.value,
                avatarUrl: ui.avatar || DEFAULT_AVATAR,
                name: ui.name || "用户",
                ...content.type === "text" ? { message: content.text } : {},
                ...content.type === "image" ? { fileUrl: content.fileID } : {},
                ...content.type === "location" ? { location: content.location } : {}
              }
            }
          });
          if (res.result.success) {
            const index = messages2.value.findIndex((m2) => m2._id === localMessage._id);
            if (index > -1) {
              messages2.value[index]._id = res.result.messageId;
              if (messages2.value[index]._tempPath)
                delete messages2.value[index]._tempPath;
            }
          } else {
            uni.showToast({ title: res.result.message || "发送失败", icon: "none" });
            const index = messages2.value.findIndex((m2) => m2._id === localMessage._id);
            if (index > -1)
              messages2.value.splice(index, 1);
          }
        } catch (e2) {
          formatAppLog("error", "at pages/chatDetail/chatDetail.vue:362", "发送消息出错:", e2);
          uni.showToast({ title: "发送异常", icon: "none" });
          const index = messages2.value.findIndex((m2) => m2._id === localMessage._id);
          if (index > -1)
            messages2.value.splice(index, 1);
        }
      };
      const sendTextMessage = () => {
        if (!messageInput.value.trim())
          return;
        _sendMessage({ type: "text", text: messageInput.value });
        messageInput.value = "";
      };
      const sendImage = async () => {
        try {
          const res = await uni.chooseImage({ count: 1 });
          const tempPath = res.tempFilePaths[0];
          _sendMessage({ type: "image", tempPath });
        } catch (e2) {
        }
      };
      const sendLocation = async () => {
        var _a, _b;
        uni.showLoading({ title: "正在定位..." });
        try {
          let latitude, longitude;
          {
            await new Promise((resolve, reject) => {
              plus.geolocation.getCurrentPosition(
                (pos) => {
                  latitude = pos.coords.latitude;
                  longitude = pos.coords.longitude;
                  resolve();
                },
                (err) => {
                  reject(err);
                },
                { provider: "system", geocode: false }
              );
            });
          }
          formatAppLog("log", "at pages/chatDetail/chatDetail.vue:425", "【sendLocation】定位结果:", latitude, longitude);
          if (latitude == null || longitude == null) {
            uni.hideLoading();
            return uni.showModal({
              title: "定位失败",
              content: "设备未返回定位，请检查权限或模拟器地理位置设置。",
              showCancel: false
            });
          }
          let key = "";
          key = QQ_MAP_KEY_APP$1;
          const { statusCode, data } = await uni.request({
            url: "https://apis.map.qq.com/ws/geocoder/v1/",
            method: "GET",
            data: { location: `${latitude},${longitude}`, key }
          });
          if (statusCode !== 200 || data.status !== 0) {
            throw new Error(`位置服务异常: ${data.message || "网络请求失败"}`);
          }
          const r2 = data.result;
          const loc = {
            latitude,
            longitude,
            name: ((_a = r2.formatted_addresses) == null ? void 0 : _a.recommend) || ((_b = r2.address_component) == null ? void 0 : _b.street_number) || "未知位置",
            address: r2.address || "详细地址未知",
            thumbUrl: `https://apis.map.qq.com/ws/staticmap/v2/?center=${latitude},${longitude}&zoom=16&size=800x400&markers=size:large|color:0x3399FF|label:D|${latitude},${longitude}&key=${key}`
          };
          _sendMessage({ type: "location", location: loc });
        } catch (e2) {
          formatAppLog("error", "at pages/chatDetail/chatDetail.vue:474", "sendLocation 失败:", e2);
          uni.showToast({ title: e2.message || "获取位置失败", icon: "none", duration: 3e3 });
        } finally {
          uni.hideLoading();
        }
      };
      const getMapThumbUrl = (location2) => {
        const platform2 = uni.getSystemInfoSync().platform;
        const key = platform2 === "mp-weixin" ? QQ_MAP_KEY_MP$1 : QQ_MAP_KEY_APP$1;
        return `https://apis.map.qq.com/ws/staticmap/v2/?center=${location2.latitude},${location2.longitude}&zoom=16&size=800x400&markers=size:large|color:0x3399FF|label:D|${location2.latitude},${location2.longitude}&key=${key}`;
      };
      const previewImage = (url) => {
        const urls = messages2.value.filter((m2) => m2.type === "image" && !m2.isRevoked).map((m2) => m2.fileUrl);
        uni.previewImage({ current: url, urls });
      };
      const previewLocation = (loc) => {
        uni.openLocation({
          latitude: loc.latitude,
          longitude: loc.longitude,
          name: loc.name,
          address: loc.address,
          scale: 18
        });
      };
      const markMessagesAsRead = async () => {
        try {
          await tr.callFunction({
            name: "clear-unread-count",
            data: { sessionId: sessionId.value, userPhoneNumber: myPhoneNumber.value }
          });
        } catch (e2) {
          formatAppLog("error", "at pages/chatDetail/chatDetail.vue:513", "标记已读出错:", e2);
        }
      };
      uni.onKeyboardHeightChange((res) => {
        keyboardHeight.value = res.height;
        calcScrollHeight();
      });
      const onMessageLongPress = async (msg) => {
        if (msg.sender !== myPhoneNumber.value) {
          uni.showToast({ title: "只能撤回自己的消息", icon: "none" });
          return;
        }
        const now = Date.now();
        if (now - msg.timestamp > 2 * 60 * 1e3) {
          uni.showToast({ title: "消息发送超过2分钟，无法撤回", icon: "none" });
          return;
        }
        uni.showActionSheet({
          itemList: ["撤回"],
          success: async (res) => {
            if (res.tapIndex === 0) {
              uni.showLoading({ title: "正在撤回..." });
              try {
                const result = await tr.callFunction({
                  name: "revoke-chat-message",
                  data: { messageId: msg._id }
                });
                if (result.result.success) {
                  const targetMsg = messages2.value.find((m2) => m2._id === msg._id);
                  if (targetMsg)
                    targetMsg.isRevoked = true;
                  uni.showToast({ title: "消息已撤回", icon: "success" });
                } else {
                  uni.showToast({ title: result.result.message || "撤回失败", icon: "none" });
                }
              } catch (e2) {
                uni.showToast({ title: "撤回失败，请稍后重试", icon: "none" });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      };
      onLoad(async (options) => {
        if (options.name) {
          const title = decodeURIComponent(options.name);
          uni.setNavigationBarTitle({
            title
          });
        }
        if (!options.sessionId) {
          uni.showToast({ title: "缺少会话ID", icon: "none", duration: 2e3 });
          setTimeout(() => uni.switchTab({ url: "/pages/index/index" }), 2e3);
          return;
        }
        sessionId.value = options.sessionId;
        const ui = uni.getStorageSync("userinfo");
        if (!ui || !ui.phoneNumber) {
          uni.showToast({ title: "请先登录", icon: "none" });
          return;
        }
        myPhoneNumber.value = ui.phoneNumber;
        await fetchInitialMessages();
        await markMessagesAsRead();
      });
      onReady(() => {
        calcScrollHeight();
      });
      onShow(() => {
        if (pollingTimer)
          clearInterval(pollingTimer);
        pollingTimer = setInterval(pollForNewMessages, 45e3);
        markMessagesAsRead();
      });
      onHide(() => {
        if (pollingTimer) {
          clearInterval(pollingTimer);
          pollingTimer = null;
        }
      });
      vue.onUnmounted(() => {
        if (pollingTimer) {
          clearInterval(pollingTimer);
          pollingTimer = null;
        }
        uni.offKeyboardHeightChange();
      });
      const __returned__ = { QQ_MAP_KEY_MP: QQ_MAP_KEY_MP$1, QQ_MAP_KEY_APP: QQ_MAP_KEY_APP$1, DEFAULT_AVATAR, PAGE_SIZE, sessionId, myPhoneNumber, messages: messages2, messageInput, scrollIntoView, scrollViewHeight, keyboardHeight, isLoadingMore, noMoreMessages, get pollingTimer() {
        return pollingTimer;
      }, set pollingTimer(v2) {
        pollingTimer = v2;
      }, lastMessageTimestamp, formatTimestamp, calcScrollHeight, scrollToBottom, fetchInitialMessages, loadMoreMessages, processMessages, pollForNewMessages, _sendMessage, sendTextMessage, sendImage, sendLocation, getMapThumbUrl, previewImage, previewLocation, markMessagesAsRead, onMessageLongPress, ref: vue.ref, nextTick: vue.nextTick, onUnmounted: vue.onUnmounted, getCurrentInstance: vue.getCurrentInstance, get onLoad() {
        return onLoad;
      }, get onReady() {
        return onReady;
      }, get onShow() {
        return onShow;
      }, get onHide() {
        return onHide;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-container" }, [
      vue.createCommentVNode('\r\n      【关键修改 #1】\r\n      - 移除 :scroll-top="scrollTop"\r\n      - 新增 :scroll-into-view="scrollIntoView"\r\n      - scroll-into-view 会将视图滚动到指定 id 的子元素位置，比设置 scrollTop 更可靠。\r\n    '),
      vue.createElementVNode("scroll-view", {
        class: "message-scroll-view",
        "scroll-y": "",
        style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" }),
        "scroll-into-view": $setup.scrollIntoView,
        "scroll-with-animation": "",
        onScrolltoupper: $setup.loadMoreMessages
      }, [
        $setup.isLoadingMore ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "loading-more"
        }, "正在加载更多...")) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 每条消息都拥有一个唯一的 id，用于 scroll-into-view 定位 "),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.messages, (msg) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: msg._id,
              id: "msg-" + msg._id
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["message-item", [msg.sender === $setup.myPhoneNumber ? "mine" : "other", { "system-message": msg.isSystemMessage }, msg.messageType ? msg.messageType : ""]])
                },
                [
                  msg.isSystemMessage ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    class: "system-icon",
                    src: _imports_0$1,
                    mode: "aspectFill"
                  })) : (vue.openBlock(), vue.createElementBlock("image", {
                    key: 1,
                    class: "avatar",
                    src: msg.avatarUrl,
                    mode: "aspectFill",
                    onError: ($event) => _ctx.handleAvatarError(msg)
                  }, null, 40, ["src", "onError"])),
                  vue.createElementVNode("view", { class: "msg-content" }, [
                    vue.createElementVNode("view", {
                      class: vue.normalizeClass(["bubble", { revoked: msg.isRevoked }]),
                      onLongpress: ($event) => $setup.onMessageLongPress(msg)
                    }, [
                      msg.type === "text" && !msg.isRevoked ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        { key: 0 },
                        vue.toDisplayString(msg.message),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true),
                      msg.type === "image" && !msg.isRevoked ? (vue.openBlock(), vue.createElementBlock("image", {
                        key: 1,
                        class: "msg-image",
                        src: msg.fileUrl,
                        mode: "aspectFit",
                        onClick: ($event) => $setup.previewImage(msg.fileUrl)
                      }, null, 8, ["src", "onClick"])) : vue.createCommentVNode("v-if", true),
                      msg.type === "location" && !msg.isRevoked ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 2,
                        class: "location-msg",
                        onClick: ($event) => $setup.previewLocation(msg.location)
                      }, [
                        vue.createElementVNode("image", {
                          class: "map-thumb",
                          src: $setup.getMapThumbUrl(msg.location),
                          mode: "aspectFill",
                          onError: _cache[0] || (_cache[0] = (...args) => _ctx.handleMapThumbError && _ctx.handleMapThumbError(...args))
                        }, null, 40, ["src"]),
                        vue.createElementVNode("view", { class: "map-info" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "map-title" },
                            vue.toDisplayString(msg.location.name || "位置"),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            { class: "map-address" },
                            vue.toDisplayString(msg.location.address),
                            1
                            /* TEXT */
                          )
                        ])
                      ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                      msg.isRevoked ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 3,
                          class: "revoked-text"
                        },
                        vue.toDisplayString(msg.sender === $setup.myPhoneNumber ? "你" : "对方") + "撤回了一条消息",
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true),
                      vue.createElementVNode(
                        "view",
                        { class: "time" },
                        vue.toDisplayString($setup.formatTimestamp(msg.timestamp)),
                        1
                        /* TEXT */
                      )
                    ], 42, ["onLongpress"])
                  ])
                ],
                2
                /* CLASS */
              )
            ], 8, ["id"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ], 44, ["scroll-into-view"]),
      vue.createElementVNode(
        "view",
        {
          class: "input-bar",
          style: vue.normalizeStyle({ bottom: $setup.keyboardHeight + "px" })
        },
        [
          vue.createElementVNode("image", {
            src: _imports_1,
            class: "icon-btn",
            onClick: $setup.sendImage
          }),
          vue.createElementVNode("image", {
            src: _imports_2,
            class: "icon-btn",
            onClick: $setup.sendLocation
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.messageInput = $event),
              placeholder: "请输入消息...",
              "confirm-type": "send",
              onConfirm: $setup.sendTextMessage,
              "adjust-position": false,
              "cursor-spacing": "20"
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $setup.messageInput]
          ]),
          vue.createElementVNode("button", {
            class: "send-btn",
            onClick: $setup.sendTextMessage
          }, "发送")
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesChatDetailChatDetail = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/chatDetail/chatDetail.vue"]]);
  const _sfc_main$9 = {
    __name: "applyTechnician",
    setup(__props, { expose: __expose }) {
      __expose();
      const formData = vue.reactive({
        realName: "",
        // 真实姓名
        idCard: "",
        // 身份证号
        skills: "",
        // 技能简介
        certificates: [],
        // 存储上传后的证件图片 URL 列表
        weChatId: "",
        // 新增：微信号
        weChatQrCodeUrl: ""
        // 新增：微信收款码图片的 URL
      });
      const imageValue = vue.ref([]);
      const imageValueQrCode = vue.ref([]);
      const isLoading = vue.ref(false);
      async function chooseAndUploadImage(type, limit) {
        return new Promise((resolve, reject) => {
          uni.chooseImage({
            count: limit - (type === "cert" ? imageValue.value.length : imageValueQrCode.value.length),
            // 可选图片数量
            sizeType: ["compressed"],
            // 压缩图
            sourceType: ["album", "camera"],
            // 从相册选择或拍照
            success: async (res) => {
              const tempFilePaths = res.tempFilePaths;
              const uploadedUrls = [];
              const currentImages = type === "cert" ? imageValue.value : imageValueQrCode.value;
              const newImages = tempFilePaths.map((path) => ({ url: path, cloudUrl: "", loading: true }));
              if (type === "cert") {
                imageValue.value = [...currentImages, ...newImages];
              } else {
                imageValueQrCode.value = newImages;
              }
              for (let i2 = 0; i2 < tempFilePaths.length; i2++) {
                const filePath = tempFilePaths[i2];
                try {
                  const uploadRes = await tr.uploadFile({
                    filePath,
                    cloudPath: `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.png`
                    // 随机文件名
                  });
                  uploadedUrls.push(uploadRes.fileID);
                  const indexToUpdate = (type === "cert" ? imageValue.value : imageValueQrCode.value).findIndex((img) => img.url === filePath);
                  if (indexToUpdate !== -1) {
                    if (type === "cert") {
                      imageValue.value[indexToUpdate].cloudUrl = uploadRes.fileID;
                      imageValue.value[indexToUpdate].loading = false;
                    } else {
                      imageValueQrCode.value[indexToUpdate].cloudUrl = uploadRes.fileID;
                      imageValueQrCode.value[indexToUpdate].loading = false;
                    }
                  }
                  formatAppLog("log", "at pages/applyTechnician/applyTechnician.vue:158", `文件上传成功: ${uploadRes.fileID}`);
                } catch (uploadError) {
                  formatAppLog("error", "at pages/applyTechnician/applyTechnician.vue:161", `文件上传失败: ${filePath}`, uploadError);
                  uni.showToast({ title: `图片上传失败: ${uploadError.errMsg || "未知错误"}`, icon: "none" });
                  if (type === "cert") {
                    imageValue.value = imageValue.value.filter((img) => img.url !== filePath);
                  } else {
                    imageValueQrCode.value = imageValueQrCode.value.filter((img) => img.url !== filePath);
                  }
                  reject(uploadError);
                  return;
                }
              }
              resolve(uploadedUrls);
            },
            fail: (err) => {
              formatAppLog("error", "at pages/applyTechnician/applyTechnician.vue:176", "选择图片失败:", err);
              if (err.errMsg !== "chooseImage:fail cancel") {
                uni.showToast({ title: "选择图片失败", icon: "none" });
              }
              reject(err);
            }
          });
        });
      }
      async function chooseCertImage() {
        try {
          const uploadedFileIds = await chooseAndUploadImage("cert", 3);
          formData.certificates = imageValue.value.map((img) => img.cloudUrl).filter((url) => url);
        } catch (e2) {
        }
      }
      function removeCertImage(index) {
        imageValue.value.splice(index, 1);
        formData.certificates = imageValue.value.map((img) => img.cloudUrl).filter((url) => url);
      }
      async function chooseQrCodeImage() {
        try {
          const uploadedFileIds = await chooseAndUploadImage("qrCode", 1);
          if (uploadedFileIds.length > 0) {
            formData.weChatQrCodeUrl = uploadedFileIds[0];
          } else {
            formData.weChatQrCodeUrl = "";
          }
        } catch (e2) {
        }
      }
      function removeQrCodeImage(index) {
        imageValueQrCode.value.splice(index, 1);
        formData.weChatQrCodeUrl = "";
      }
      async function submitApplication() {
        const userInfo = uni.getStorageSync("userinfo");
        if (!userInfo || !userInfo._id) {
          return uni.showToast({ title: "请先登录", icon: "none" });
        }
        if (!formData.realName || !formData.idCard) {
          return uni.showToast({
            title: "真实姓名和身份证号为必填项",
            icon: "none"
          });
        }
        if (!formData.weChatQrCodeUrl) {
          return uni.showToast({
            title: "请上传微信收款码",
            icon: "none"
          });
        }
        isLoading.value = true;
        uni.showLoading({ title: "正在提交..." });
        try {
          const { result } = await tr.callFunction({
            name: "applyForTechnician",
            data: {
              uid: userInfo._id,
              applicationData: formData
              // 包含所有表单数据，包括新的微信信息
            }
          });
          if (result.success) {
            uni.showToast({ title: "申请已提交！", icon: "success" });
            userInfo.technicianApplicationStatus = "pending";
            uni.setStorageSync("userinfo", userInfo);
            setTimeout(() => {
              uni.switchTab({ url: "/pages/profile/profile" });
            }, 1500);
          } else {
            throw new Error(result.message || "提交失败");
          }
        } catch (error) {
          uni.showToast({
            title: error.message || "提交申请时发生错误",
            icon: "none"
          });
        } finally {
          isLoading.value = false;
          uni.hideLoading();
        }
      }
      const __returned__ = { formData, imageValue, imageValueQrCode, isLoading, chooseAndUploadImage, chooseCertImage, removeCertImage, chooseQrCodeImage, removeQrCodeImage, submitApplication, ref: vue.ref, reactive: vue.reactive, get onShow() {
        return onShow;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "apply-container" }, [
      vue.createElementVNode("view", { class: "title" }, "工人认证申请"),
      vue.createElementVNode("view", { class: "form-card" }, [
        vue.createCommentVNode(" 真实姓名 "),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "真实姓名"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formData.realName = $event),
              placeholder: "请输入您的真实姓名"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.realName]
          ])
        ]),
        vue.createCommentVNode(" 身份证号 "),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "身份证号"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formData.idCard = $event),
              type: "idcard",
              placeholder: "请输入您的身份证号"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.idCard]
          ])
        ]),
        vue.createCommentVNode(" 技能简介 "),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "技能简介"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              class: "textarea",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formData.skills = $event),
              placeholder: "简单介绍您的专业技能、服务范围等"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.skills]
          ])
        ]),
        vue.createCommentVNode(" 上传证件图片 (纯手写实现) "),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "相关证件 (可选)"),
          vue.createElementVNode("view", { class: "custom-file-picker" }, [
            vue.createElementVNode("view", { class: "image-grid" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.imageValue, (image, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "image-item"
                  }, [
                    vue.createElementVNode("image", {
                      src: image.url,
                      mode: "aspectFill",
                      class: "uploaded-image"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", {
                      class: "delete-btn",
                      onClick: ($event) => $setup.removeCertImage(index)
                    }, "×", 8, ["onClick"])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $setup.imageValue.length < 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "upload-btn",
                onClick: $setup.chooseCertImage
              }, [
                vue.createElementVNode("text", null, "+")
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          vue.createElementVNode("text", { class: "tip-text" }, "用于辅助证明您的专业能力，如资格证书、作品图等。")
        ]),
        vue.createCommentVNode(" 新增：提现收款信息 "),
        vue.createElementVNode("view", { class: "form-section-title" }, "提现收款信息"),
        vue.createElementVNode("text", { class: "section-tip" }, "请务必填写正确的收款信息，以便平台为您结算服务费用。"),
        vue.createCommentVNode(" 微信号 (可选) "),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "微信号 (可选)"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formData.weChatId = $event),
              placeholder: "请输入您的微信号"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.formData.weChatId]
          ]),
          vue.createElementVNode("text", { class: "tip-text" }, "作为备用联系方式或打款参考。")
        ]),
        vue.createCommentVNode(" 微信收款码 (必填) "),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label required-label" }, "微信收款码"),
          vue.createElementVNode("view", { class: "custom-file-picker" }, [
            vue.createElementVNode("view", { class: "image-grid" }, [
              $setup.imageValueQrCode.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "image-item"
              }, [
                vue.createElementVNode("image", {
                  src: $setup.imageValueQrCode[0].url,
                  mode: "aspectFill",
                  class: "uploaded-image"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", {
                  class: "delete-btn",
                  onClick: _cache[4] || (_cache[4] = ($event) => $setup.removeQrCodeImage(0))
                }, "×")
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "upload-btn",
                onClick: $setup.chooseQrCodeImage
              }, [
                vue.createElementVNode("text", null, "+")
              ]))
            ])
          ]),
          vue.createElementVNode("text", { class: "warning-text" }, [
            vue.createElementVNode("text", { class: "warning-icon" }, "!"),
            vue.createTextVNode(" 请务必上传清晰有效的微信收款码截图。若因收款码错误导致打款失败或流向错误，平台不承担责任。 ")
          ])
        ])
      ]),
      vue.createElementVNode("button", {
        class: "submit-btn",
        onClick: $setup.submitApplication,
        loading: $setup.isLoading,
        disabled: $setup.isLoading
      }, vue.toDisplayString($setup.isLoading ? "提交中..." : "确认提交申请"), 9, ["loading", "disabled"])
    ]);
  }
  const PagesApplyTechnicianApplyTechnician = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-b0c9ddc7"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/applyTechnician/applyTechnician.vue"]]);
  const _sfc_main$8 = {
    __name: "ReviewApplications",
    setup(__props, { expose: __expose }) {
      __expose();
      const list = vue.ref([]);
      async function loadPending() {
        const { result } = await tr.callFunction({
          name: "getPendingApplications"
        });
        if (result.success) {
          list.value = result.data;
        } else {
          uni.showToast({ title: result.msg || "加载失败", icon: "none" });
        }
      }
      async function review(uid, action) {
        let reason = "";
        if (action === "reject") {
          const { confirm, content } = await new Promise((resolve) => {
            uni.showModal({
              title: "拒绝原因",
              placeholderText: "请输入原因",
              editable: true,
              success: resolve
            });
          });
          if (!confirm)
            return;
          reason = content;
        }
        uni.showLoading({ title: "提交审核..." });
        try {
          const res = await tr.callFunction({
            name: "reviewTechnicianApplication",
            data: { uid, action, reason }
          });
          formatAppLog("log", "at pages/admin/ReviewApplications/ReviewApplications.vue:64", "reviewTechnicianApplication 返回：", res);
          uni.hideLoading();
          if (res.result && res.result.success) {
            uni.showToast({ title: "操作成功", icon: "success" });
            await loadPending();
          } else {
            uni.showToast({ title: res.result && res.result.msg || "操作失败", icon: "none" });
          }
        } catch (err) {
          uni.hideLoading();
          formatAppLog("error", "at pages/admin/ReviewApplications/ReviewApplications.vue:74", "调用 reviewTechnicianApplication 错误：", err);
          uni.showToast({ title: "网络或服务异常", icon: "none" });
        }
      }
      vue.onMounted(() => {
        const user = uni.getStorageSync("userinfo") || {};
        if (user.userType !== "admin") {
          uni.showToast({ title: "无权限访问", icon: "none" });
          uni.reLaunch({ url: "/pages/profile/profile" });
        } else {
          loadPending();
        }
      });
      const __returned__ = { list, loadPending, review, ref: vue.ref, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createElementVNode("view", { class: "title" }, "待审核技工申请"),
      vue.createElementVNode("scroll-view", {
        class: "list",
        "scroll-y": ""
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.list, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item._id,
              class: "card"
            }, [
              vue.createElementVNode(
                "view",
                { class: "label" },
                "姓名：" + vue.toDisplayString(item.technicianInfo.realName),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "label" },
                "身份证号：" + vue.toDisplayString(item.technicianInfo.idCard),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "label" },
                "技能：" + vue.toDisplayString(item.technicianInfo.skills),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "certs" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(item.technicianInfo.certificates, (c2, i2) => {
                    return vue.openBlock(), vue.createElementBlock("image", {
                      key: i2,
                      src: c2,
                      class: "cert-img",
                      mode: "aspectFill"
                    }, null, 8, ["src"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("view", { class: "actions" }, [
                vue.createElementVNode("button", {
                  onClick: ($event) => $setup.review(item._id, "approve"),
                  type: "primary"
                }, "通过", 8, ["onClick"]),
                vue.createElementVNode("button", {
                  onClick: ($event) => $setup.review(item._id, "reject"),
                  type: "warn"
                }, "拒绝", 8, ["onClick"])
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesAdminReviewApplicationsReviewApplications = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-4b5c6fc7"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/admin/ReviewApplications/ReviewApplications.vue"]]);
  const QQ_MAP_KEY_MP = "ZOYBZ-S7V6G-OSQQ2-QA54H-2PBHE-CXF46";
  const QQ_MAP_KEY_APP = "3QUBZ-FFCCB-6GYUO-NQI2R-WDUB5-BJFIY";
  const _sfc_main$7 = {
    __name: "appointmentForm",
    setup(__props, { expose: __expose }) {
      __expose();
      const targetUserId = vue.ref("");
      const targetPhone = vue.ref("");
      const remark = vue.ref("");
      const userInfo = vue.ref(uni.getStorageSync("userinfo") || {});
      const availableDays = vue.ref([]);
      const timeSlots = vue.ref([]);
      const selectedDate = vue.ref("");
      const selectedTime = vue.ref("");
      const isLoading = vue.ref(false);
      const serviceAddress = vue.ref({
        name: "",
        // 地点名称，如「XX小区」
        address: "",
        // 完整地址
        latitude: null,
        longitude: null,
        detail: ""
        // 手动输入的详细地址，如「A栋1201室」
      });
      onLoad((options) => {
        const { userId, accountPhoneNumber } = options;
        if (userId) {
          targetUserId.value = userId;
          targetPhone.value = accountPhoneNumber;
        } else {
          uni.showToast({ title: "缺少师傅信息", icon: "error" });
          uni.navigateBack();
        }
      });
      vue.onMounted(() => {
        generateAvailableDays();
        if (availableDays.value.length > 0) {
          selectDate(availableDays.value[0].dateString);
        }
      });
      vue.watch(selectedDate, (newDate) => {
        if (newDate) {
          selectedTime.value = "";
          fetchBookedSlots(newDate);
        }
      });
      const handleChooseLocation = () => {
        uni.chooseLocation({
          latitude: serviceAddress.value.latitude || void 0,
          longitude: serviceAddress.value.longitude || void 0,
          success: (loc) => {
            let name = loc.name;
            let address = loc.address;
            if (!name && address) {
              const parts = address.split(/[,，·-]/);
              if (parts.length > 0) {
                name = parts[0].trim();
                address = parts.slice(1).join("").trim() || address;
              } else {
                name = address;
              }
            } else if (name && address && address.startsWith(name)) {
              address = address.substring(name.length).trim();
            }
            serviceAddress.value = {
              ...serviceAddress.value,
              name,
              address,
              latitude: loc.latitude,
              longitude: loc.longitude
            };
          },
          fail: (err) => {
            formatAppLog("error", "at pages/appointmentForm/appointmentForm.vue:172", "选择地点失败", err);
            if (err.errMsg === "chooseLocation:fail cancel" || err.errMsg === "chooseLocation:fail") {
              uni.showToast({ title: "已取消选点", icon: "none" });
            } else {
              uni.showToast({ title: "选点失败: " + err.errMsg, icon: "none" });
            }
          }
        });
      };
      const generateAvailableDays = () => {
        const days = [];
        const today = /* @__PURE__ */ new Date();
        const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        const dayNamesShort = ["今天", "明天", "后天"];
        for (let i2 = 0; i2 < 7; i2++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i2);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const dayOfMonth = date.getDate().toString().padStart(2, "0");
          let name = i2 < 3 ? dayNamesShort[i2] : dayNames[date.getDay()];
          days.push({
            name,
            shortDate: `${month}-${dayOfMonth}`,
            dateString: `${year}-${month}-${dayOfMonth}`
          });
        }
        availableDays.value = days;
      };
      const generateStandardTimeSlots = () => {
        const slots = [];
        for (let i2 = 9; i2 <= 18; i2++) {
          slots.push({
            time: `${i2.toString().padStart(2, "0")}:00`,
            isBooked: false,
            isPast: false
          });
        }
        return slots;
      };
      const selectDate = (dateString) => {
        selectedDate.value = dateString;
      };
      const fetchBookedSlots = async (date) => {
        if (!targetUserId.value)
          return;
        isLoading.value = true;
        timeSlots.value = [];
        try {
          const res = await tr.callFunction({
            name: "getAppointmentsByWorker",
            data: { workerId: targetUserId.value, date }
          });
          const bookedHours = res.result.data || [];
          const standardSlots = generateStandardTimeSlots();
          const today = /* @__PURE__ */ new Date();
          const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
          const currentHour = today.getHours();
          timeSlots.value = standardSlots.map((slot) => {
            const slotHour = parseInt(slot.time.split(":")[0]);
            const isPast = date === todayString && slotHour <= currentHour;
            return {
              ...slot,
              isBooked: bookedHours.includes(slot.time),
              isPast
            };
          });
        } catch (error) {
          formatAppLog("error", "at pages/appointmentForm/appointmentForm.vue:245", "获取预约时段失败:", error);
          uni.showToast({ title: "加载时间失败", icon: "none" });
          timeSlots.value = generateStandardTimeSlots();
        } finally {
          isLoading.value = false;
        }
      };
      const selectTime = (slot) => {
        if (slot.isBooked) {
          uni.showToast({ title: "该时段已被预约", icon: "none" });
          return;
        }
        if (slot.isPast) {
          uni.showToast({ title: "不能选择过去的时间", icon: "none" });
          return;
        }
        selectedTime.value = slot.time;
      };
      const submitForm = async () => {
        var _a;
        if (!selectedTime.value) {
          return uni.showToast({ title: "请选择服务时间", icon: "none" });
        }
        if (!serviceAddress.value.name || !serviceAddress.value.address) {
          return uni.showToast({ title: "请选择服务地点", icon: "none" });
        }
        if (!serviceAddress.value.detail.trim()) {
          return uni.showToast({ title: "请填写详细地址", icon: "none" });
        }
        if (!remark.value.trim()) {
          return uni.showToast({ title: "请填写具体服务需求", icon: "none" });
        }
        if (!userInfo.value._id) {
          return uni.showToast({ title: "请先登录", icon: "none" });
        }
        uni.showLoading({ title: "正在提交预约..." });
        try {
          const mockOutTradeNo = "mock_order_" + Date.now();
          const mockTotalFee = 30;
          const res = await tr.callFunction({
            name: "createAppointment",
            data: {
              workerId: targetUserId.value,
              workerPhone: targetPhone.value,
              userId: userInfo.value._id,
              userPhone: userInfo.value.phoneNumber,
              userName: userInfo.value.name || "匿名用户",
              serviceDate: selectedDate.value,
              serviceHour: selectedTime.value,
              serviceAddress: serviceAddress.value,
              remark: remark.value,
              orderId: mockOutTradeNo,
              payStatus: "MOCK_PAID",
              // 标记为模拟支付成功
              total_fee: mockTotalFee,
              clientInfo: ((_a = getApp().globalData) == null ? void 0 : _a.clientInfo) || uni.getSystemInfoSync()
            }
          });
          uni.hideLoading();
          if (res.result.success) {
            uni.showToast({ title: "预约成功！(跳过支付)", icon: "success" });
            setTimeout(() => uni.navigateBack(), 1500);
          } else {
            uni.showToast({ title: res.result.message || "预约失败", icon: "none" });
            if (res.result.code === "SLOT_TAKEN") {
              fetchBookedSlots(selectedDate.value);
            }
          }
        } catch (err) {
          uni.hideLoading();
          uni.showToast({ title: "提交预约失败，请稍后重试", icon: "none" });
          formatAppLog("error", "at pages/appointmentForm/appointmentForm.vue:394", "submitForm (without payment) error:", err);
        }
      };
      const __returned__ = { targetUserId, targetPhone, remark, userInfo, availableDays, timeSlots, selectedDate, selectedTime, isLoading, serviceAddress, QQ_MAP_KEY_MP, QQ_MAP_KEY_APP, handleChooseLocation, generateAvailableDays, generateStandardTimeSlots, selectDate, fetchBookedSlots, selectTime, submitForm, ref: vue.ref, onMounted: vue.onMounted, watch: vue.watch, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
      vue.createElementVNode("view", { class: "form-container" }, [
        vue.createElementVNode("view", { class: "form-title" }, "预约服务"),
        vue.createElementVNode(
          "view",
          { class: "form-subtitle" },
          "师傅号码: " + vue.toDisplayString($setup.targetPhone),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "选择服务时间"),
          vue.createElementVNode("view", { class: "date-selector" }, [
            vue.createElementVNode("scroll-view", {
              class: "scroll-view",
              "scroll-x": "true",
              "show-scrollbar": "false"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.availableDays, (day, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["day-item", { "active-day": $setup.selectedDate === day.dateString }]),
                    onClick: ($event) => $setup.selectDate(day.dateString)
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "day-name" },
                      vue.toDisplayString(day.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "day-date" },
                      vue.toDisplayString(day.shortDate),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "time-slot-container" }, [
            $setup.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "loading-text"
            }, "时间加载中...")) : $setup.timeSlots.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "no-slots-text"
            }, "暂无可用时间段")) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "time-slot-grid"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.timeSlots, (slot, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["time-slot-item", { "selected-slot": $setup.selectedTime === slot.time, "booked-slot": slot.isBooked, "past-slot": slot.isPast }]),
                    onClick: ($event) => $setup.selectTime(slot)
                  }, vue.toDisplayString(slot.time), 11, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]))
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, [
            vue.createTextVNode("服务地点 "),
            vue.createElementVNode("text", { class: "required-star" }, "*")
          ]),
          vue.createCommentVNode(" 点击触发：小程序走地图选点，App 端走定位+逆地址 "),
          vue.createElementVNode("view", {
            class: "location-selector",
            onClick: $setup.handleChooseLocation
          }, [
            vue.createElementVNode("view", { class: "location-text-wrapper" }, [
              $setup.serviceAddress.name ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "location-name"
                },
                vue.toDisplayString($setup.serviceAddress.name),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true),
              $setup.serviceAddress.address ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 1,
                  class: "location-address"
                },
                vue.toDisplayString($setup.serviceAddress.address),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true),
              !$setup.serviceAddress.name ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 2,
                class: "location-placeholder"
              }, "点击选择服务地点")) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createVNode(_component_uni_icons, {
              type: "location-filled",
              size: "24",
              color: "#999"
            })
          ]),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "detail-address-input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.serviceAddress.detail = $event),
              placeholder: "请补充详细地址，如楼层、门牌号"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.serviceAddress.detail]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, [
            vue.createTextVNode("服务需求 "),
            vue.createElementVNode("text", { class: "required-star" }, "*")
          ]),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              class: "remark-textarea",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.remark = $event),
              placeholder: "请详细描述您的服务需求，例如：清洗两台挂式空调，型号为..."
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.remark]
          ])
        ]),
        vue.createElementVNode("view", { class: "payment-notice" }, [
          vue.createElementVNode("view", { class: "notice-title" }, [
            vue.createVNode(_component_uni_icons, {
              type: "help-filled",
              size: "18",
              color: "#ff9900"
            }),
            vue.createElementVNode("text", null, "预约须知")
          ]),
          vue.createElementVNode("view", { class: "notice-content" }, [
            vue.createElementVNode("text", null, "为保障双方权益，预约需预付30元师傅跑腿费，该费用可抵扣总服务费。"),
            vue.createElementVNode("view", { class: "notice-list-item" }, " ● 若师傅取消预约，跑腿费将自动全额原路退回。"),
            vue.createElementVNode("view", { class: "notice-list-item" }, " ● 用户取消退款规则："),
            vue.createElementVNode("view", { class: "notice-list-item" }, ' ● 若您在服务开始前 "24小时以上" 取消，将 "全额退款"。'),
            vue.createElementVNode("view", { class: "notice-list-item" }, ' ● 若您在服务开始前 "12小时（含）至24小时内" 取消，将退还 "70%" 的费用。'),
            vue.createElementVNode("view", { class: "notice-list-item" }, ' ● 若您在服务开始前 "2小时（含）至12小时内" 取消，将退还 "50%" 的费用。'),
            vue.createElementVNode("view", { class: "notice-list-item" }, ' ● 服务事件开始 "1小时" 后不可取消预约。'),
            vue.createElementVNode("view", { class: "notice-list-item" }, " ● 对订单有任何争议，您可以在“我的预约”中点击“联系客服”按钮发起申诉。")
          ])
        ]),
        vue.createElementVNode("button", {
          class: "submit-btn",
          onClick: $setup.submitForm,
          disabled: !$setup.selectedTime
        }, " 支付并确认预约 ", 8, ["disabled"])
      ])
    ]);
  }
  const PagesAppointmentFormAppointmentForm = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-91af7e50"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/appointmentForm/appointmentForm.vue"]]);
  const _imports_0 = "/static/images/empty-box.png";
  const _sfc_main$6 = {
    __name: "worker-schedule",
    setup(__props, { expose: __expose }) {
      __expose();
      const availableDays = vue.ref([]);
      const timeSlots = vue.ref([]);
      const selectedDate = vue.ref("");
      const isLoading = vue.ref(false);
      const appointments = vue.ref([]);
      const selectedAppointment = vue.ref(null);
      const scrollIntoViewId = vue.ref("");
      onShow(() => {
        const userInfo = uni.getStorageSync("userinfo");
        if (!userInfo || !userInfo._id) {
          uni.showToast({ title: "请先登录", icon: "none" });
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        if (availableDays.value.length === 0) {
          generateAvailableDays();
          const today = /* @__PURE__ */ new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          const todayDateString = `${yyyy}-${mm}-${dd}`;
          selectDate(todayDateString);
          vue.nextTick(() => {
            const todayItem = availableDays.value.find((day) => day.dateString === todayDateString);
            if (todayItem) {
              scrollIntoViewId.value = todayItem.id;
            }
          });
        } else {
          fetchAppointmentsForDate(selectedDate.value);
        }
      });
      const generateAvailableDays = () => {
        const days = [];
        const today = /* @__PURE__ */ new Date();
        const specialNames = {
          "-2": "前天",
          "-1": "昨天",
          "0": "今天",
          "1": "明天",
          "2": "后天"
        };
        const weekNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        for (let i2 = -4; i2 <= 4; i2++) {
          const d2 = new Date(today);
          d2.setDate(today.getDate() + i2);
          const yyyy = d2.getFullYear();
          const mm = String(d2.getMonth() + 1).padStart(2, "0");
          const dd = String(d2.getDate()).padStart(2, "0");
          const dateString = `${yyyy}-${mm}-${dd}`;
          days.push({
            name: specialNames[i2] || weekNames[d2.getDay()],
            shortDate: `${mm}-${dd}`,
            dateString,
            id: "day" + dateString.replace(/-/g, "")
          });
        }
        availableDays.value = days;
      };
      const generateStandardTimeSlots = () => {
        const slots = [];
        for (let i2 = 9; i2 <= 18; i2++) {
          slots.push({ time: `${String(i2).padStart(2, "0")}:00`, isBooked: false, isPast: false, isCancelled: false, appointment: null });
        }
        return slots;
      };
      const selectDate = async (dateString) => {
        selectedDate.value = dateString;
        await fetchAppointmentsForDate(dateString);
      };
      const fetchAppointmentsForDate = async (date) => {
        isLoading.value = true;
        timeSlots.value = [];
        try {
          const userInfo = uni.getStorageSync("userinfo") || {};
          const workerId = userInfo._id;
          if (!workerId)
            throw new Error("无法获取师傅ID，请重新登录");
          const res = await tr.callFunction({
            name: "getAppointmentsForWorker",
            data: { workerId, date }
          });
          if (res.result.success) {
            appointments.value = res.result.data;
            updateTimeSlots(date);
          } else {
            throw new Error(res.result.message || "加载预约失败");
          }
        } catch (err) {
          formatAppLog("error", "at pages/worker-schedule/worker-schedule.vue:216", err);
          uni.showToast({ title: err.message, icon: "none" });
          timeSlots.value = generateStandardTimeSlots();
        } finally {
          isLoading.value = false;
        }
      };
      const updateTimeSlots = (date) => {
        const now = /* @__PURE__ */ new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const currentHour = now.getHours();
        timeSlots.value = generateStandardTimeSlots().map((slot) => {
          const h2 = parseInt(slot.time.split(":")[0]);
          const isPast = date < todayStr || date === todayStr && h2 < currentHour;
          const appsForSlot = appointments.value.filter((a2) => a2.serviceHour === slot.time);
          let app = appsForSlot.find((a2) => a2.status === "confirmed");
          if (!app) {
            app = appsForSlot.find((a2) => a2.status === "completed");
          }
          if (!app) {
            app = appsForSlot[0];
          }
          const status = app ? app.status : "available";
          const isBooked = !!app;
          const isConfirmed = status === "confirmed";
          const isCompleted = status === "completed";
          const isCancelled = status === "cancelled_by_user" || status === "cancelled_by_worker";
          return {
            ...slot,
            isBooked,
            isPast,
            appointment: app,
            // 绑定具有最高优先级的预约记录
            isConfirmed,
            isCompleted,
            isCancelled
          };
        });
      };
      const selectTimeSlot = (slot) => {
        if (!slot.isBooked)
          return;
        selectedAppointment.value = slot.appointment;
      };
      const handleCancel = (appointment) => {
        uni.showModal({
          title: "取消预约",
          editable: true,
          placeholderText: "请输入取消原因（必填）",
          success: async (res) => {
            if (res.confirm) {
              const reason = res.content;
              if (!reason.trim()) {
                uni.showToast({ title: "必须填写取消原因", icon: "none" });
                return;
              }
              uni.showLoading({ title: "正在提交..." });
              try {
                const userInfo = uni.getStorageSync("userinfo") || {};
                const workerPhone = userInfo.phoneNumber;
                const cancelRes = await tr.callFunction({
                  name: "cancelAppointmentByWorker",
                  data: {
                    appointmentId: appointment._id,
                    workerPhone,
                    cancellationReason: reason
                  }
                });
                uni.hideLoading();
                if (cancelRes.result.success) {
                  uni.showToast({ title: "取消成功", icon: "success" });
                  closeModal();
                  fetchAppointmentsForDate(selectedDate.value);
                } else {
                  throw new Error(cancelRes.result.message || "取消失败");
                }
              } catch (error) {
                uni.hideLoading();
                uni.showToast({ title: error.message, icon: "none" });
              }
            }
          }
        });
      };
      const closeModal = () => {
        selectedAppointment.value = null;
      };
      const makePhoneCall = (num) => uni.makePhoneCall({ phoneNumber: num });
      const navigateToLocation = (serviceAddress) => {
        if (!serviceAddress || !serviceAddress.latitude || !serviceAddress.longitude) {
          uni.showToast({
            title: "地址信息不完整",
            icon: "none"
          });
          return;
        }
        uni.openLocation({
          latitude: serviceAddress.latitude,
          longitude: serviceAddress.longitude,
          name: serviceAddress.name,
          address: serviceAddress.address + serviceAddress.detail,
          fail: (err) => {
            uni.showToast({
              title: "打开地图失败",
              icon: "none"
            });
            formatAppLog("error", "at pages/worker-schedule/worker-schedule.vue:342", "uni.openLocation failed:", err);
          }
        });
      };
      const __returned__ = { availableDays, timeSlots, selectedDate, isLoading, appointments, selectedAppointment, scrollIntoViewId, generateAvailableDays, generateStandardTimeSlots, selectDate, fetchAppointmentsForDate, updateTimeSlots, selectTimeSlot, handleCancel, closeModal, makePhoneCall, navigateToLocation, ref: vue.ref, nextTick: vue.nextTick, get onShow() {
        return onShow;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0);
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
      vue.createCommentVNode(" 日期选择器 "),
      vue.createElementVNode("view", { class: "date-selector-container" }, [
        vue.createElementVNode("scroll-view", {
          class: "scroll-view",
          "scroll-x": "true",
          "show-scrollbar": "false",
          "scroll-into-view": $setup.scrollIntoViewId
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.availableDays, (day, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                id: day.id,
                class: vue.normalizeClass(["day-item", { "active-day": $setup.selectedDate === day.dateString }]),
                onClick: ($event) => $setup.selectDate(day.dateString)
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "day-name" },
                  vue.toDisplayString(day.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "day-date" },
                  vue.toDisplayString(day.shortDate),
                  1
                  /* TEXT */
                )
              ], 10, ["id", "onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ], 8, ["scroll-into-view"])
      ]),
      vue.createCommentVNode(" 时间段容器 "),
      vue.createElementVNode("view", { class: "time-slot-container" }, [
        $setup.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "loading-container"
        }, [
          vue.createVNode(_component_uni_load_more, { status: "loading" })
        ])) : $setup.timeSlots.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-container"
        }, [
          vue.createElementVNode("image", {
            src: _imports_0,
            class: "empty-image"
          }),
          vue.createElementVNode("text", { class: "empty-text" }, "当日暂无预约")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "time-slot-grid"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.timeSlots, (slot, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: vue.normalizeClass(["time-slot-item", {
                  "booked-slot": slot.isConfirmed,
                  "completed-slot": slot.isCompleted,
                  "cancelled-slot": slot.isCancelled,
                  "past-slot": slot.isPast && !slot.isBooked
                }]),
                onClick: ($event) => $setup.selectTimeSlot(slot)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "time-text" },
                  vue.toDisplayString(slot.time),
                  1
                  /* TEXT */
                ),
                slot.isBooked ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 0,
                    class: vue.normalizeClass(["booked-badge", {
                      "completed-badge": slot.isCompleted,
                      "cancelled-badge": slot.isCancelled
                    }])
                  },
                  vue.toDisplayString(slot.isCompleted ? "已完成" : slot.isCancelled ? "已取消" : "已预约"),
                  3
                  /* TEXT, CLASS */
                )) : vue.createCommentVNode("v-if", true)
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]))
      ]),
      vue.createCommentVNode(" 预约详情弹窗 "),
      $setup.selectedAppointment ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-mask",
        onClick: $setup.closeModal
      }, [
        vue.createElementVNode("view", {
          class: "modal-container",
          onClick: _cache[3] || (_cache[3] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "预约详情")
          ]),
          vue.createElementVNode("view", { class: "modal-content" }, [
            vue.createElementVNode("view", { class: "detail-item" }, [
              vue.createVNode(_component_uni_icons, {
                type: "calendar",
                size: "20",
                color: "#666"
              }),
              vue.createElementVNode("text", { class: "detail-label" }, "服务时间："),
              vue.createElementVNode(
                "text",
                { class: "detail-value" },
                vue.toDisplayString($setup.selectedAppointment.serviceDate) + " " + vue.toDisplayString($setup.selectedAppointment.serviceHour),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "detail-item" }, [
              vue.createVNode(_component_uni_icons, {
                type: "person",
                size: "20",
                color: "#666"
              }),
              vue.createElementVNode("text", { class: "detail-label" }, "客户姓名："),
              vue.createElementVNode(
                "text",
                { class: "detail-value" },
                vue.toDisplayString($setup.selectedAppointment.userName),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "detail-item" }, [
              vue.createVNode(_component_uni_icons, {
                type: "phone",
                size: "20",
                color: "#666"
              }),
              vue.createElementVNode("text", { class: "detail-label" }, "联系电话："),
              vue.createElementVNode(
                "text",
                {
                  class: "detail-value phone",
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.makePhoneCall($setup.selectedAppointment.userPhone))
                },
                vue.toDisplayString($setup.selectedAppointment.userPhone),
                1
                /* TEXT */
              )
            ]),
            $setup.selectedAppointment.serviceAddress ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "detail-item"
            }, [
              vue.createVNode(_component_uni_icons, {
                type: "location",
                size: "20",
                color: "#666"
              }),
              vue.createElementVNode("text", { class: "detail-label" }, "服务地址："),
              vue.createElementVNode(
                "text",
                { class: "detail-value address-text" },
                vue.toDisplayString($setup.selectedAppointment.serviceAddress.address) + vue.toDisplayString($setup.selectedAppointment.serviceAddress.detail),
                1
                /* TEXT */
              ),
              vue.createElementVNode("button", {
                class: "nav-btn",
                onClick: _cache[1] || (_cache[1] = vue.withModifiers(($event) => $setup.navigateToLocation($setup.selectedAppointment.serviceAddress), ["stop"]))
              }, "导航")
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "detail-item" }, [
              vue.createVNode(_component_uni_icons, {
                type: "chat",
                size: "20",
                color: "#666"
              }),
              vue.createElementVNode("text", { class: "detail-label" }, "服务需求：")
            ]),
            vue.createElementVNode("view", { class: "remark-container" }, [
              vue.createElementVNode(
                "text",
                { class: "remark-text" },
                vue.toDisplayString($setup.selectedAppointment.remark),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            $setup.selectedAppointment.status === "confirmed" ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 0,
              class: "action-btn cancel-btn",
              onClick: _cache[2] || (_cache[2] = ($event) => $setup.handleCancel($setup.selectedAppointment))
            }, "取消此预约")) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesWorkerScheduleWorkerSchedule = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__scopeId", "data-v-516443f4"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/worker-schedule/worker-schedule.vue"]]);
  const _sfc_main$5 = {
    __name: "user-schedule",
    setup(__props, { expose: __expose }) {
      __expose();
      const appointments = vue.ref([]);
      const loading = vue.ref(true);
      const reviewModalVisible = vue.ref(false);
      const selectedAppointment = vue.ref(null);
      const reviewForm = vue.reactive({
        rating: 5,
        // 默认5星好评
        comment: "",
        images: [],
        // 本地临时路径
        imageUrls: [],
        // 上传后的云存储路径
        anonymous: false
        // 新增匿名选项，默认不匿名
      });
      const CUSTOMER_SERVICE_CONTACTS = {
        phone: "19357501597",
        // 您的客服电话
        wechat: "Chen_100peng",
        // 您的客服微信号
        qq: "3327261595"
        // 您的客服QQ号
      };
      function translateStatus(status) {
        const map = {
          confirmed: "预约成功",
          cancelled_by_worker: "师傅已取消",
          cancelled_by_user: "用户已取消",
          completed: "已完成"
        };
        return map[status] || status;
      }
      async function fetchAppointments() {
        loading.value = true;
        const userinfo = uni.getStorageSync("userinfo");
        if (!userinfo || !userinfo._id) {
          uni.showToast({ title: "请先登录", icon: "none" });
          loading.value = false;
          return;
        }
        try {
          const res = await tr.callFunction({
            name: "getUserAppointments",
            data: { userId: userinfo._id }
          });
          if (res.result.success) {
            appointments.value = res.result.data;
            formatAppLog("log", "at pages/user-schedule/user-schedule.vue:183", "获取到的预约数据:", appointments.value);
          } else {
            formatAppLog("error", "at pages/user-schedule/user-schedule.vue:185", "云函数返回错误", res.result.message);
          }
        } catch (e2) {
          formatAppLog("error", "at pages/user-schedule/user-schedule.vue:188", "调用云函数失败", e2);
        } finally {
          loading.value = false;
        }
      }
      const contactCustomerService = () => {
        uni.showActionSheet({
          itemList: ["拨打电话", "复制微信号", "复制QQ号"],
          success: (res) => {
            if (res.tapIndex === 0) {
              uni.makePhoneCall({
                phoneNumber: CUSTOMER_SERVICE_CONTACTS.phone
              });
            } else if (res.tapIndex === 1) {
              uni.setClipboardData({
                data: CUSTOMER_SERVICE_CONTACTS.wechat,
                success: () => {
                  uni.showToast({
                    title: "微信号已复制",
                    icon: "success"
                  });
                },
                fail: (err) => {
                  formatAppLog("error", "at pages/user-schedule/user-schedule.vue:214", "复制微信号失败:", err);
                  uni.showToast({
                    title: "复制失败，请手动复制",
                    icon: "none"
                  });
                }
              });
            } else if (res.tapIndex === 2) {
              uni.setClipboardData({
                data: CUSTOMER_SERVICE_CONTACTS.qq,
                success: () => {
                  uni.showToast({
                    title: "QQ号已复制",
                    icon: "success"
                  });
                },
                fail: (err) => {
                  formatAppLog("error", "at pages/user-schedule/user-schedule.vue:232", "复制QQ号失败:", err);
                  uni.showToast({
                    title: "复制失败，请手动复制",
                    icon: "none"
                  });
                }
              });
            }
          },
          fail: (res) => {
            formatAppLog("log", "at pages/user-schedule/user-schedule.vue:242", "用户取消选择", res.errMsg);
          }
        });
      };
      const getButtonGroupClass = (item) => {
        let buttonCount = 0;
        if (item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime > Date.now()) {
          buttonCount = 2;
        } else if (item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime <= Date.now()) {
          buttonCount = 2;
        } else if (item.status === "completed" && !item.review) {
          buttonCount = 2;
        } else if (item.status === "completed" && item.review) {
          buttonCount = 1;
        } else if (item.status.startsWith("cancelled") && item.refundInfo) {
          buttonCount = 1;
        }
        return {
          "justify-two-buttons": buttonCount === 2,
          "justify-one-button": buttonCount === 1
        };
      };
      const viewRefundDetail = (appointmentItem) => {
        let refundMessage = `总金额: ¥${(appointmentItem.total_fee / 100).toFixed(2)}
`;
        if (appointmentItem.refundInfo) {
          refundMessage += `用户退款: ¥${(appointmentItem.refundInfo.userRefundAmount / 100).toFixed(2)}
`;
          refundMessage += `师傅补偿: ¥${(appointmentItem.refundInfo.workerCompensation / 100).toFixed(2)}
`;
          refundMessage += `平台扣费: ¥${(appointmentItem.refundInfo.platformFee / 100).toFixed(2)}
`;
          if (appointmentItem.refundInfo.refundNo) {
            refundMessage += `退款单号: ${appointmentItem.refundInfo.refundNo}
`;
          }
          if (appointmentItem.refundInfo.refundAt) {
            const refundDate = new Date(appointmentItem.refundInfo.refundAt);
            refundMessage += `退款时间: ${refundDate.toLocaleString()}
`;
          }
        } else {
          refundMessage += "无详细退款信息。";
        }
        uni.showModal({
          title: "退款详情",
          content: refundMessage,
          showCancel: false,
          confirmText: "确定"
        });
      };
      async function cancelAppointment(appointmentItem) {
        if (appointmentItem.status !== "confirmed" || !appointmentItem.expectedEndTime || appointmentItem.expectedEndTime <= Date.now()) {
          uni.showToast({ title: "该预约无法取消", icon: "none" });
          return;
        }
        const res = await uni.showModal({
          title: "确认取消预约？",
          editable: true,
          placeholderText: "请输入取消原因（必填）",
          confirmText: "确认取消",
          cancelText: "点错了"
        });
        if (res.confirm) {
          const reason = res.content;
          if (!reason || !reason.trim()) {
            uni.showToast({ title: "必须填写取消原因", icon: "none" });
            return;
          }
          uni.showLoading({ title: "正在取消..." });
          try {
            const userinfo = uni.getStorageSync("userinfo");
            if (!userinfo || !userinfo._id) {
              throw new Error("无法获取用户信息，请重新登录");
            }
            const dataToSend = {
              appointmentId: appointmentItem._id,
              cancellationReason: reason,
              userId: userinfo._id
            };
            formatAppLog("log", "at pages/user-schedule/user-schedule.vue:342", "即将发送给 cancelAppointmentByUser 云函数的参数:", dataToSend);
            const result = await tr.callFunction({
              name: "cancelAppointmentByUser",
              data: dataToSend
            });
            if (result.result.success) {
              uni.showToast({ title: "取消成功", icon: "success" });
              fetchAppointments();
            } else {
              throw new Error(result.result.message || "取消失败");
            }
          } catch (error) {
            uni.showToast({ title: error.message, icon: "none" });
          } finally {
            uni.hideLoading();
          }
        }
      }
      async function completeAppointment(appointmentItem) {
        const res = await uni.showModal({
          title: "确认完成服务？",
          content: "完成后可选择评价"
        });
        if (!res.confirm)
          return;
        uni.showLoading({ title: "请稍候..." });
        try {
          const res2 = await tr.callFunction({
            name: "updateAppointmentStatusByuser",
            data: {
              appointmentId: appointmentItem._id,
              status: "completed"
            }
          });
          if (res2.result.success) {
            uni.showToast({ title: "服务已完成", icon: "success" });
            fetchAppointments();
          } else {
            uni.showToast({ title: "操作失败", icon: "none" });
          }
        } catch (e2) {
          uni.showToast({ title: "操作失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      }
      function openReviewModal(appointmentItem) {
        selectedAppointment.value = appointmentItem;
        reviewForm.rating = 5;
        reviewForm.comment = "";
        reviewForm.images = [];
        reviewForm.imageUrls = [];
        reviewForm.anonymous = false;
        reviewModalVisible.value = true;
      }
      function closeReviewModal() {
        reviewModalVisible.value = false;
      }
      function setRating(star) {
        reviewForm.rating = star;
      }
      async function chooseImage() {
        try {
          const res = await uni.chooseImage({
            count: 3 - reviewForm.images.length,
            sizeType: ["compressed"],
            sourceType: ["album", "camera"]
          });
          reviewForm.images.push(...res.tempFilePaths);
        } catch (e2) {
        }
      }
      function removeImage(index) {
        reviewForm.images.splice(index, 1);
      }
      function toggleAnonymous(e2) {
        reviewForm.anonymous = e2.detail.value.length > 0;
      }
      async function submitReview() {
        uni.showLoading({ title: "正在提交..." });
        const userinfo = uni.getStorageSync("userinfo");
        let reviewerName = "";
        let reviewerAvatar = "/static/images/avatar-placeholder.png";
        if (!reviewForm.anonymous && userinfo) {
          if (userinfo.name)
            reviewerName = userinfo.name;
          if (userinfo.avatar)
            reviewerAvatar = userinfo.avatar;
        }
        try {
          for (const imagePath of reviewForm.images) {
            const uploadResult = await tr.uploadFile({
              filePath: imagePath,
              cloudPath: `review-images/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`,
              cloudPathAsRealPath: true
            });
            reviewForm.imageUrls.push(uploadResult.fileID);
          }
        } catch (e2) {
          uni.hideLoading();
          uni.showToast({ title: "图片上传失败", icon: "none" });
          return;
        }
        try {
          const res = await tr.callFunction({
            name: "submitReview",
            data: {
              appointmentId: selectedAppointment.value._id,
              workerPhone: selectedAppointment.value.workerPhone,
              reviewData: {
                rating: reviewForm.rating,
                comment: reviewForm.comment,
                images: reviewForm.imageUrls,
                name: reviewerName,
                avatar: reviewerAvatar
              }
            }
          });
          uni.hideLoading();
          if (res.result.success) {
            uni.showToast({ title: "评价成功", icon: "success" });
            closeReviewModal();
            fetchAppointments();
          } else {
            uni.showToast({ title: res.result.message || "提交失败", icon: "none" });
          }
        } catch (e2) {
          uni.hideLoading();
          uni.showToast({ title: "提交失败，请重试", icon: "none" });
        }
      }
      onShow(fetchAppointments);
      const __returned__ = { appointments, loading, reviewModalVisible, selectedAppointment, reviewForm, CUSTOMER_SERVICE_CONTACTS, translateStatus, fetchAppointments, contactCustomerService, getButtonGroupClass, viewRefundDetail, cancelAppointment, completeAppointment, openReviewModal, closeReviewModal, setRating, chooseImage, removeImage, toggleAnonymous, submitReview, ref: vue.ref, reactive: vue.reactive, get onShow() {
        return onShow;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
      $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "feedback-view"
      }, [
        vue.createElementVNode("view", { class: "loading-indicator" }, "加载中...")
      ])) : $setup.appointments.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "feedback-view"
      }, [
        vue.createElementVNode("view", { class: "empty-message" }, "暂无预约记录")
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "appointment-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.appointments, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "appointment-card",
              key: item._id
            }, [
              vue.createElementVNode("view", { class: "card-body" }, [
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "label" }, "服务时间"),
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    vue.toDisplayString(item.serviceDate) + " " + vue.toDisplayString(item.serviceHour),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "label" }, "师傅电话"),
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    vue.toDisplayString(item.workerPhone),
                    1
                    /* TEXT */
                  )
                ]),
                item.remark ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "info-row"
                }, [
                  vue.createElementVNode("text", { class: "label" }, "备注信息"),
                  vue.createElementVNode(
                    "text",
                    { class: "value" },
                    vue.toDisplayString(item.remark),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "label" }, "服务状态"),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["value status-text", `status-${item.status}`])
                    },
                    vue.toDisplayString($setup.translateStatus(item.status)),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                item.review && item.review.comment ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "info-row"
                }, [
                  vue.createElementVNode("text", { class: "label" }, "我的评价"),
                  vue.createElementVNode(
                    "text",
                    { class: "value review-comment" },
                    vue.toDisplayString(item.review.comment),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createCommentVNode(" 动态绑定类名，根据按钮数量调整布局 "),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["button-group", $setup.getButtonGroupClass(item)])
                  },
                  [
                    vue.createCommentVNode(" 场景1: 预约成功，服务时间未到 (取消 + 完成) "),
                    item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime > Date.now() ? (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 0 },
                      [
                        vue.createElementVNode("button", {
                          class: "btn cancel",
                          onClick: ($event) => $setup.cancelAppointment(item)
                        }, "取消预约", 8, ["onClick"]),
                        vue.createElementVNode("button", {
                          class: "btn finish",
                          onClick: ($event) => $setup.completeAppointment(item)
                        }, "完成服务", 8, ["onClick"])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : item.status === "confirmed" && item.expectedEndTime && item.expectedEndTime <= Date.now() ? (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createCommentVNode(" 场景2: 预约成功，服务时间已过但未自动完成 (联系客服 + 完成服务) "),
                        vue.createElementVNode("button", {
                          class: "btn contact",
                          onClick: $setup.contactCustomerService
                        }, "联系客服"),
                        vue.createElementVNode("button", {
                          class: "btn finish",
                          onClick: ($event) => $setup.completeAppointment(item)
                        }, "完成服务", 8, ["onClick"])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : item.status === "completed" && !item.review ? (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 2 },
                      [
                        vue.createCommentVNode(" 场景3: 已完成，未评价 (联系客服 + 评价服务) "),
                        vue.createElementVNode("button", {
                          class: "btn contact",
                          onClick: $setup.contactCustomerService
                        }, "联系客服"),
                        vue.createElementVNode("button", {
                          class: "btn review",
                          onClick: ($event) => $setup.openReviewModal(item)
                        }, "评价服务", 8, ["onClick"])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : item.status === "completed" && item.review ? (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 3 },
                      [
                        vue.createCommentVNode(" 场景4: 已完成，已评价 (仅 联系客服) "),
                        vue.createElementVNode("button", {
                          class: "btn contact",
                          onClick: $setup.contactCustomerService
                        }, "联系客服")
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : item.status.startsWith("cancelled") && item.refundInfo ? (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 4 },
                      [
                        vue.createCommentVNode(" 场景5: 已取消，有退款信息 (仅 查看退款详情) "),
                        vue.createElementVNode("button", {
                          class: "btn detail",
                          onClick: ($event) => $setup.viewRefundDetail(item)
                        }, "查看退款详情", 8, ["onClick"])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : vue.createCommentVNode("v-if", true)
                  ],
                  2
                  /* CLASS */
                )
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])),
      vue.createCommentVNode(" 评价模态框 (保持不变) "),
      $setup.reviewModalVisible ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "modal-overlay",
        onClick: $setup.closeReviewModal
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "服务评价"),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: $setup.closeReviewModal
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createElementVNode("view", { class: "rating-section" }, [
              vue.createElementVNode("view", { class: "stars" }, [
                (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(5, (star) => {
                    return vue.createElementVNode("text", {
                      key: star,
                      class: vue.normalizeClass(["star", { "active": star <= $setup.reviewForm.rating }]),
                      onClick: ($event) => $setup.setRating(star)
                    }, "★", 10, ["onClick"]);
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ]),
            vue.createElementVNode("view", { class: "comment-section" }, [
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.reviewForm.comment = $event),
                  placeholder: "服务满足您的期望吗？分享您的使用体验吧～",
                  class: "comment-textarea",
                  maxlength: "200"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.reviewForm.comment]
              ])
            ]),
            vue.createElementVNode("view", { class: "image-section" }, [
              vue.createElementVNode("view", { class: "image-uploader" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.reviewForm.images, (image, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "image-preview",
                      key: index
                    }, [
                      vue.createElementVNode("image", {
                        src: image,
                        mode: "aspectFill"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", {
                        class: "remove-image",
                        onClick: ($event) => $setup.removeImage(index)
                      }, "×", 8, ["onClick"])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                $setup.reviewForm.images.length < 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "upload-btn",
                  onClick: $setup.chooseImage
                }, [
                  vue.createElementVNode("text", null, "+")
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("text", { class: "image-tip" }, "最多上传3张图片")
            ]),
            vue.createElementVNode("view", { class: "anonymous-section" }, [
              vue.createElementVNode(
                "checkbox-group",
                { onChange: $setup.toggleAnonymous },
                [
                  vue.createElementVNode("label", null, [
                    vue.createElementVNode("checkbox", {
                      checked: $setup.reviewForm.anonymous
                    }, null, 8, ["checked"]),
                    vue.createTextVNode(" 匿名评价 ")
                  ])
                ],
                32
                /* NEED_HYDRATION */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("button", {
              class: "submit-review-btn",
              onClick: $setup.submitReview
            }, "提交评价")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesUserScheduleUserSchedule = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-3ba41579"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/user-schedule/user-schedule.vue"]]);
  const _sfc_main$4 = {
    __name: "newsDetail",
    setup(__props, { expose: __expose }) {
      __expose();
      const detail = vue.ref(null);
      function formatNum(n2) {
        return n2 > 1e4 ? (n2 / 1e4).toFixed(1) + "万" : n2;
      }
      function formatTime(d2) {
        if (!d2)
          return "";
        const dt2 = new Date(d2);
        return `${dt2.getMonth() + 1}-${dt2.getDate()}`;
      }
      onLoad((options) => {
        const id = options.id;
        getDetail(id);
      });
      async function getDetail(id) {
        try {
          uni.showLoading({ title: "加载中..." });
          const res = await tr.callFunction({
            name: "getNewsDetail",
            data: { id }
          });
          if (res.result && res.result.data) {
            const data = res.result.data;
            data.publish_date = formatTime(data.publish_date);
            data.view_count = formatNum(data.view_count);
            data.content = data.content.replace(/<p/gi, "<p class='pstyle'");
            data.content = data.content.replace(/<img/gi, "<img class='imgstyle'");
            detail.value = data;
          }
        } catch (error) {
          formatAppLog("error", "at pages/newsDetail/newsDetail.vue:75", "获取新闻详情失败", error);
          uni.showToast({ title: "加载失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      }
      const __returned__ = { detail, formatNum, formatTime, getDetail, ref: vue.ref, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_skeleton = vue.resolveComponent("uni-skeleton");
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      !$setup.detail ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        style: { "padding": "80rpx 30rpx" }
      }, [
        vue.createVNode(_component_uni_skeleton, {
          title: "",
          row: 5
        })
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "detail"
      }, [
        vue.createElementVNode(
          "view",
          { class: "title" },
          vue.toDisplayString($setup.detail.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "info" }, [
          vue.createElementVNode("view", { class: "left" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($setup.detail.publish_date),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($setup.detail.author),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($setup.detail.view_count) + "阅读",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "right" }, [
            vue.createVNode(_component_uni_icons, {
              type: "paperplane",
              size: "18",
              class: "icon-class"
            }),
            vue.createElementVNode("text", null, "分享")
          ])
        ]),
        vue.createElementVNode("view", { class: "content" }, [
          vue.createElementVNode("rich-text", {
            nodes: $setup.detail.content
          }, null, 8, ["nodes"])
        ])
      ]))
    ]);
  }
  const PagesNewsDetailNewsDetail = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-eca9fe72"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/newsDetail/newsDetail.vue"]]);
  const pageSize = 10;
  const _sfc_main$3 = {
    __name: "allComments",
    setup(__props, { expose: __expose }) {
      __expose();
      const technicianId = vue.ref("");
      const technicianInfo = vue.ref(null);
      const comments = vue.ref([]);
      const replyState = vue.reactive({});
      const loading = vue.ref(true);
      const isLoadMore = vue.ref(false);
      const hasMoreData = vue.ref(true);
      const page = vue.ref(1);
      onLoad((options) => {
        if (options.technicianId) {
          technicianId.value = options.technicianId;
          fetchComments();
        } else {
          uni.showToast({ title: "参数错误", icon: "none" });
          loading.value = false;
        }
      });
      onReachBottom(() => {
        if (hasMoreData.value && !isLoadMore.value) {
          page.value++;
          fetchComments(true);
        }
      });
      const fetchComments = async (isLoadMoreAction = false) => {
        if (isLoadMoreAction) {
          isLoadMore.value = true;
        } else {
          loading.value = true;
          page.value = 1;
          comments.value = [];
        }
        try {
          const res = await tr.callFunction({
            name: "getCommentsByTechnicianId",
            data: {
              technicianId: technicianId.value,
              page: page.value,
              pageSize
            }
          });
          if (res.result.success) {
            const { commentData, total, techInfo } = res.result;
            if (!technicianInfo.value) {
              technicianInfo.value = techInfo;
            }
            commentData.forEach((comment) => {
              if (!replyState[comment.appointmentId]) {
                replyState[comment.appointmentId] = {
                  showReplies: false,
                  showInput: false,
                  content: ""
                };
              }
            });
            comments.value = isLoadMoreAction ? [...comments.value, ...commentData] : commentData;
            hasMoreData.value = comments.value.length < total;
          } else {
            uni.showToast({ title: res.result.message || "加载失败", icon: "none" });
          }
        } catch (error) {
          formatAppLog("error", "at pages/allComments/allComments.vue:149", "加载评论失败: ", error);
          uni.showToast({ title: "网络错误，请稍后再试", icon: "none" });
        } finally {
          loading.value = false;
          isLoadMore.value = false;
        }
      };
      const toggleReplyInput = (appointmentId) => {
        if (!replyState[appointmentId])
          return;
        replyState[appointmentId].showInput = !replyState[appointmentId].showInput;
      };
      const toggleReplies = (appointmentId) => {
        if (!replyState[appointmentId])
          return;
        replyState[appointmentId].showReplies = !replyState[appointmentId].showReplies;
      };
      const handleReplySubmit = async (appointmentId) => {
        const currentState = replyState[appointmentId];
        const content = currentState.content.trim();
        if (!content) {
          uni.showToast({ title: "回复内容不能为空", icon: "none" });
          return;
        }
        const userInfo = uni.getStorageSync("userinfo");
        if (!userInfo || !userInfo._id) {
          uni.showToast({ title: "请先登录", icon: "none" });
          return;
        }
        uni.showLoading({ title: "正在发送..." });
        try {
          const replyData = {
            content,
            userId: userInfo._id,
            userName: userInfo.name,
            userAvatar: userInfo.avatar
          };
          const res = await tr.callFunction({
            name: "addCommentReply",
            data: {
              appointmentId,
              replyData
            }
          });
          if (res.result.success) {
            const comment = comments.value.find((c2) => c2.appointmentId === appointmentId);
            if (comment) {
              if (!comment.replies) {
                comment.replies = [];
              }
              comment.replies.push({
                ...replyData,
                replyId: res.result.replyId,
                // 假设后端返回了新回复的ID
                createdAt: Date.now()
              });
            }
            currentState.content = "";
            currentState.showInput = false;
            currentState.showReplies = true;
            uni.hideLoading();
            uni.showToast({ title: "回复成功", icon: "success" });
          } else {
            throw new Error(res.result.message || "回复失败");
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/allComments/allComments.vue:241", "回复失败: ", error);
          uni.showToast({ title: error.message || "网络错误，请稍后重试", icon: "none" });
        }
      };
      const previewCommentImage = (images, currentImage) => {
        uni.previewImage({
          urls: images,
          current: currentImage
        });
      };
      const formatDate = (timestamp) => {
        if (!timestamp)
          return "";
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
      };
      const __returned__ = { technicianId, technicianInfo, comments, replyState, loading, isLoadMore, hasMoreData, page, pageSize, fetchComments, toggleReplyInput, toggleReplies, handleReplySubmit, previewCommentImage, formatDate, ref: vue.ref, reactive: vue.reactive, get onLoad() {
        return onLoad;
      }, get onReachBottom() {
        return onReachBottom;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "all-comments-page" }, [
      $setup.technicianInfo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "technician-header"
      }, [
        vue.createElementVNode("image", {
          src: $setup.technicianInfo.avatar,
          class: "header-avatar"
        }, null, 8, ["src"]),
        vue.createElementVNode(
          "view",
          { class: "header-name" },
          vue.toDisplayString($setup.technicianInfo.name) + " 的全部评价",
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "comment-list" }, [
        $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "loading-tip"
        }, "加载中...")) : vue.createCommentVNode("v-if", true),
        !$setup.loading && $setup.comments.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "no-data-tip"
        }, "暂无用户评价")) : vue.createCommentVNode("v-if", true),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.comments, (item) => {
            var _a, _b, _c;
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "comment-item",
              key: item.appointmentId
            }, [
              vue.createElementVNode("view", { class: "comment-header" }, [
                vue.createElementVNode("image", {
                  class: "comment-avatar",
                  src: item.avatar
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "comment-info" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "comment-name" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "comment-date" },
                    vue.toDisplayString($setup.formatDate(item.createdAt)),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              item.rating ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "comment-rating"
              }, [
                (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(5, (star) => {
                    return vue.createElementVNode(
                      "text",
                      {
                        key: star,
                        class: vue.normalizeClass(["star", { "active": star <= item.rating }])
                      },
                      "★",
                      2
                      /* CLASS */
                    );
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "view",
                { class: "comment-content" },
                vue.toDisplayString(item.comment),
                1
                /* TEXT */
              ),
              item.images && item.images.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "comment-images"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(item.images, (img, imgIndex) => {
                    return vue.openBlock(), vue.createElementBlock("image", {
                      key: imgIndex,
                      src: img,
                      mode: "aspectFill",
                      class: "comment-img",
                      onClick: ($event) => $setup.previewCommentImage(item.images, img)
                    }, null, 8, ["src", "onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "comment-actions" }, [
                vue.createElementVNode("view", {
                  class: "reply-btn",
                  onClick: ($event) => $setup.toggleReplyInput(item.appointmentId)
                }, "回复", 8, ["onClick"])
              ]),
              item.replies && item.replies.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "replies-wrapper"
              }, [
                vue.withDirectives(vue.createElementVNode(
                  "view",
                  { class: "reply-list" },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(item.replies, (reply) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          class: "reply-item",
                          key: reply.replyId
                        }, [
                          vue.createElementVNode("image", {
                            class: "reply-avatar",
                            src: reply.userAvatar
                          }, null, 8, ["src"]),
                          vue.createElementVNode("view", { class: "reply-content" }, [
                            vue.createElementVNode("view", { class: "reply-header" }, [
                              vue.createElementVNode(
                                "text",
                                { class: "reply-name" },
                                vue.toDisplayString(reply.userName),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "text",
                                { class: "reply-date" },
                                vue.toDisplayString($setup.formatDate(reply.createdAt)),
                                1
                                /* TEXT */
                              )
                            ]),
                            vue.createElementVNode(
                              "view",
                              { class: "reply-text" },
                              vue.toDisplayString(reply.content),
                              1
                              /* TEXT */
                            )
                          ])
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, (_a = $setup.replyState[item.appointmentId]) == null ? void 0 : _a.showReplies]
                ]),
                vue.createElementVNode("view", {
                  class: "toggle-replies",
                  onClick: ($event) => $setup.toggleReplies(item.appointmentId)
                }, vue.toDisplayString(((_b = $setup.replyState[item.appointmentId]) == null ? void 0 : _b.showReplies) ? "收起回复" : `查看全部 ${item.replies.length} 条回复`), 9, ["onClick"])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createCommentVNode(" 回复输入区域 "),
              ((_c = $setup.replyState[item.appointmentId]) == null ? void 0 : _c.showInput) ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 3,
                class: "reply-input-area"
              }, [
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "reply-input",
                  "onUpdate:modelValue": ($event) => $setup.replyState[item.appointmentId].content = $event,
                  placeholder: "输入你的回复..."
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vue.vModelText, $setup.replyState[item.appointmentId].content]
                ]),
                vue.createElementVNode("button", {
                  class: "reply-submit-btn",
                  size: "mini",
                  onClick: ($event) => $setup.handleReplySubmit(item.appointmentId)
                }, "发送", 8, ["onClick"])
              ])) : vue.createCommentVNode("v-if", true)
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "load-more-tip" }, [
        $setup.isLoadMore ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "正在加载...")) : vue.createCommentVNode("v-if", true),
        !$setup.hasMoreData && $setup.comments.length > 0 ? (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "没有更多评价了")) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesAllCommentsAllComments = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-6fb01808"], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/allComments/allComments.vue"]]);
  const _sfc_main$2 = {
    __name: "Payouts",
    setup(__props, { expose: __expose }) {
      __expose();
      const availableBalance = vue.ref(0);
      const pendingWithdrawalAmount = vue.ref(0);
      const withdrawalHistory = vue.ref([]);
      const isRequesting = vue.ref(false);
      const historyLoading = vue.ref(true);
      const popupVisible = vue.ref(false);
      const popupMessageType = vue.ref("success");
      const popupMessageText = vue.ref("");
      let popupTimer = null;
      const statusBarHeight = vue.ref(0);
      vue.onMounted(() => {
        uni.getSystemInfo({
          success: (res) => {
            statusBarHeight.value = res.statusBarHeight;
          }
        });
      });
      const goBack = () => {
        uni.navigateBack();
      };
      const formatTimestamp = (timestamp) => {
        if (!timestamp)
          return "";
        const date = new Date(timestamp);
        return date.toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
          // 24小时制
        });
      };
      const formatWithdrawalStatus = (status) => {
        const map = {
          pending_review: "待审核",
          completed: "已打款",
          rejected: "已拒绝",
          failed: "打款失败"
        };
        return map[status] || "未知状态";
      };
      const getStatusClass = (status) => {
        switch (status) {
          case "pending_review":
            return "status-pending";
          case "completed":
            return "status-completed";
          case "rejected":
          case "failed":
            return "status-failed";
          default:
            return "";
        }
      };
      const showMessage = (type, text, duration = 2e3) => {
        if (popupTimer) {
          clearTimeout(popupTimer);
        }
        popupMessageType.value = type;
        popupMessageText.value = text;
        popupVisible.value = true;
        popupTimer = setTimeout(() => {
          popupVisible.value = false;
          popupTimer = null;
        }, duration);
      };
      const fetchBalances = async () => {
        const userinfo = uni.getStorageSync("userinfo");
        if (!userinfo || !userinfo._id) {
          showMessage("error", "请先登录");
          return;
        }
        try {
          const res = await tr.callFunction({
            name: "getWorkerAvailableBalance",
            data: { userId: userinfo._id }
          });
          if (res.result && res.result.success) {
            availableBalance.value = res.result.availableBalance;
            pendingWithdrawalAmount.value = res.result.pendingWithdrawalAmount;
          } else {
            formatAppLog("error", "at pages/Payouts/Payouts.vue:169", "获取金额失败:", res.result.message);
            showMessage("error", res.result.message || "获取余额失败");
          }
        } catch (e2) {
          formatAppLog("error", "at pages/Payouts/Payouts.vue:173", "调用云函数 getWorkerAvailableBalance 失败:", e2);
          showMessage("error", "获取余额网络错误");
        }
      };
      const fetchWithdrawalHistory = async () => {
        historyLoading.value = true;
        const userinfo = uni.getStorageSync("userinfo");
        if (!userinfo || !userinfo._id) {
          historyLoading.value = false;
          return;
        }
        try {
          const res = await tr.callFunction({
            name: "getWithdrawalHistory",
            data: { userId: userinfo._id }
          });
          if (res.result && res.result.success) {
            withdrawalHistory.value = res.result.data.map((record) => ({
              ...record,
              amount: record.amount / 100
              // 假设数据库存储的是分
            }));
          } else {
            formatAppLog("error", "at pages/Payouts/Payouts.vue:198", "获取提现历史失败:", res.result.message);
            showMessage("error", res.result.message || "获取历史失败");
          }
        } catch (e2) {
          formatAppLog("error", "at pages/Payouts/Payouts.vue:202", "调用云函数 getWithdrawalHistory 失败:", e2);
          showMessage("error", "获取历史网络错误");
        } finally {
          historyLoading.value = false;
        }
      };
      const requestWithdrawal = async () => {
        if (availableBalance.value <= 0) {
          showMessage("info", "当前无可提现金额");
          return;
        }
        const confirmRes = await uni.showModal({
          title: "确认提现",
          content: `您确定要提现所有可提现金额 ¥${availableBalance.value.toFixed(2)} 吗？`,
          confirmText: "确认提现",
          cancelText: "取消"
        });
        if (!confirmRes.confirm) {
          return;
        }
        isRequesting.value = true;
        uni.showLoading({ title: "正在提交提现申请...", mask: true });
        const userinfo = uni.getStorageSync("userinfo");
        if (!userinfo || !userinfo._id || !userinfo.phoneNumber) {
          showMessage("error", "无法获取用户信息，请重新登录");
          isRequesting.value = false;
          uni.hideLoading();
          return;
        }
        try {
          const res = await tr.callFunction({
            name: "requestWorkerFullWithdrawal",
            data: {
              userId: userinfo._id,
              workerPhone: userinfo.phoneNumber
            }
          });
          if (res.result && res.result.success) {
            showMessage("success", "提现申请已提交，请等待平台审核");
            fetchBalances();
            fetchWithdrawalHistory();
          } else {
            formatAppLog("error", "at pages/Payouts/Payouts.vue:253", "提现申请失败:", res.result.message);
            showMessage("error", res.result.message || "提现申请失败");
          }
        } catch (e2) {
          formatAppLog("error", "at pages/Payouts/Payouts.vue:257", "调用云函数 requestWorkerFullWithdrawal 失败:", e2);
          showMessage("error", "提现网络错误，请重试");
        } finally {
          isRequesting.value = false;
          uni.hideLoading();
        }
      };
      vue.onMounted(() => {
        fetchBalances();
        fetchWithdrawalHistory();
      });
      onShow(() => {
        fetchBalances();
        fetchWithdrawalHistory();
      });
      const __returned__ = { availableBalance, pendingWithdrawalAmount, withdrawalHistory, isRequesting, historyLoading, popupVisible, popupMessageType, popupMessageText, get popupTimer() {
        return popupTimer;
      }, set popupTimer(v2) {
        popupTimer = v2;
      }, statusBarHeight, goBack, formatTimestamp, formatWithdrawalStatus, getStatusClass, showMessage, fetchBalances, fetchWithdrawalHistory, requestWithdrawal, ref: vue.ref, onMounted: vue.onMounted, get onShow() {
        return onShow;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
      vue.createCommentVNode(" 提现信息卡片 "),
      vue.createElementVNode("view", { class: "card balance-card" }, [
        vue.createElementVNode("view", { class: "card-header" }, [
          vue.createElementVNode("text", { class: "card-title" }, "我的余额")
        ]),
        vue.createElementVNode("view", { class: "card-body" }, [
          vue.createElementVNode("view", { class: "balance-row" }, [
            vue.createElementVNode("text", { class: "balance-label" }, "可提现金额:"),
            vue.createElementVNode("view", { class: "balance-amount" }, [
              vue.createElementVNode("text", { class: "currency-symbol" }, "¥"),
              vue.createElementVNode(
                "text",
                { class: "amount" },
                vue.toDisplayString($setup.availableBalance.toFixed(2)),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "balance-row" }, [
            vue.createElementVNode("text", { class: "balance-label" }, "提现审核中:"),
            vue.createElementVNode("view", { class: "balance-amount" }, [
              vue.createElementVNode("text", { class: "currency-symbol" }, "¥"),
              vue.createElementVNode(
                "text",
                { class: "amount status-pending" },
                vue.toDisplayString($setup.pendingWithdrawalAmount.toFixed(2)),
                1
                /* TEXT */
              )
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "card-footer" }, [
          vue.createElementVNode("button", {
            class: "btn primary-btn",
            onClick: $setup.requestWithdrawal,
            disabled: $setup.availableBalance <= 0 || $setup.isRequesting
          }, vue.toDisplayString($setup.isRequesting ? "正在申请..." : "一键提现"), 9, ["disabled"])
        ])
      ]),
      vue.createCommentVNode(" 提现历史记录 "),
      vue.createElementVNode("view", { class: "card history-card" }, [
        vue.createElementVNode("view", { class: "card-header" }, [
          vue.createElementVNode("text", { class: "card-title" }, "提现记录")
        ]),
        vue.createElementVNode("view", { class: "card-body" }, [
          $setup.historyLoading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "loading-state"
          }, [
            vue.createElementVNode("text", null, "加载中...")
          ])) : $setup.withdrawalHistory.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", null, "暂无提现记录")
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "history-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.withdrawalHistory, (record) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: record._id,
                  class: "history-item"
                }, [
                  vue.createElementVNode("view", { class: "item-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "item-amount" },
                      "¥" + vue.toDisplayString(record.amount.toFixed(2)),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "item-date" },
                      vue.toDisplayString($setup.formatTimestamp(record.requestAt)),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["item-status", $setup.getStatusClass(record.status)])
                    },
                    vue.toDisplayString($setup.formatWithdrawalStatus(record.status)),
                    3
                    /* TEXT, CLASS */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ])
      ]),
      vue.createCommentVNode(" 自定义消息提示框 "),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["custom-message-popup", { "show": $setup.popupVisible, [$setup.popupMessageType]: true }])
        },
        [
          vue.createElementVNode(
            "text",
            { class: "popup-text" },
            vue.toDisplayString($setup.popupMessageText),
            1
            /* TEXT */
          )
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const PagesPayoutsPayouts = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/Payouts/Payouts.vue"]]);
  const _sfc_main$1 = {
    __name: "ReviewWithdrawals",
    setup(__props, { expose: __expose }) {
      __expose();
      const loading = vue.ref(true);
      const withdrawalRequests = vue.ref([]);
      const showReviewModal = vue.ref(false);
      const selectedRequest = vue.ref(null);
      const adminRemarks = vue.ref("");
      const popupVisible = vue.ref(false);
      const popupMessageType = vue.ref("success");
      const popupMessageText = vue.ref("");
      let popupTimer = null;
      vue.onMounted(() => {
        fetchWithdrawalRequests();
      });
      onShow(() => {
        fetchWithdrawalRequests();
      });
      const goBack = () => {
        uni.navigateBack();
      };
      const formatTimestamp = (timestamp) => {
        if (!timestamp)
          return "";
        const date = new Date(timestamp);
        return date.toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
          // 24小时制
        });
      };
      const formatWithdrawalStatus = (status) => {
        const map = {
          pending_review: "待审核",
          completed: "已打款",
          rejected: "已拒绝",
          failed: "打款失败"
        };
        return map[status] || "未知状态";
      };
      const getStatusClass = (status) => {
        switch (status) {
          case "pending_review":
            return "status-pending-review";
          case "completed":
            return "status-completed";
          case "rejected":
          case "failed":
            return "status-failed";
          default:
            return "";
        }
      };
      const showMessage = (type, text, duration = 2e3) => {
        if (popupTimer) {
          clearTimeout(popupTimer);
        }
        popupMessageType.value = type;
        popupMessageText.value = text;
        popupVisible.value = true;
        popupTimer = setTimeout(() => {
          popupVisible.value = false;
          popupTimer = null;
        }, duration);
      };
      const fetchWithdrawalRequests = async () => {
        loading.value = true;
        try {
          const res = await tr.callFunction({
            name: "getAdminWithdrawalRequests",
            data: {}
          });
          if (res.result && res.result.success) {
            withdrawalRequests.value = res.result.data;
          } else {
            formatAppLog("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:195", "获取提现申请失败:", res.result.message);
            showMessage("error", res.result.message || "获取申请失败");
          }
        } catch (e2) {
          formatAppLog("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:199", "调用云函数 getAdminWithdrawalRequests 失败:", e2);
          showMessage("error", "获取申请网络错误");
        } finally {
          loading.value = false;
        }
      };
      const openReviewModal = (request) => {
        selectedRequest.value = request;
        adminRemarks.value = "";
        showReviewModal.value = true;
      };
      const closeReviewModal = () => {
        showReviewModal.value = false;
        selectedRequest.value = null;
      };
      const onQrCodeError = (e2) => {
        formatAppLog("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:221", "收款码图片加载失败:", e2.detail.errMsg);
        if (selectedRequest.value) {
          showMessage("info", "收款码图片加载失败，请联系工人核实");
        }
      };
      const previewQrCode = (url) => {
        if (url) {
          uni.previewImage({
            urls: [url],
            current: url
          });
        } else {
          uni.showToast({ title: "无收款码可预览", icon: "none" });
        }
      };
      const processWithdrawal = async (newStatus) => {
        if (!selectedRequest.value)
          return;
        const actionText = newStatus === "completed" ? "批准打款" : "拒绝提现";
        const confirmContent = newStatus === "completed" ? `确定要批准工人 ${selectedRequest.value.workerPhone} 提现 ¥${(selectedRequest.value.amount / 100).toFixed(2)} 吗？` : `确定要拒绝工人 ${selectedRequest.value.workerPhone} 的提现申请吗？`;
        const confirmRes = await uni.showModal({
          title: `确认${actionText}`,
          content: confirmContent,
          confirmText: actionText,
          cancelText: "取消"
        });
        if (!confirmRes.confirm) {
          return;
        }
        uni.showLoading({ title: `正在${actionText}...`, mask: true });
        const adminInfo = uni.getStorageSync("userinfo");
        const adminId = adminInfo ? adminInfo._id : "unknown_admin";
        try {
          const res = await tr.callFunction({
            name: "updateWithdrawalStatusByAdmin",
            data: {
              withdrawalRequestId: selectedRequest.value._id,
              newStatus,
              adminId,
              remarks: adminRemarks.value
            }
          });
          if (res.result && res.result.success) {
            if (newStatus === "completed") {
              showMessage("success", `${actionText}成功！请立即进行微信转账。`);
            } else {
              showMessage("success", `${actionText}成功！`);
            }
            closeReviewModal();
            fetchWithdrawalRequests();
          } else {
            formatAppLog("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:286", `${actionText}失败:`, res.result.message);
            showMessage("error", res.result.message || `${actionText}失败`);
          }
        } catch (e2) {
          formatAppLog("error", "at pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue:290", `调用云函数 updateWithdrawalStatusByAdmin 失败:`, e2);
          showMessage("error", `${actionText}网络错误，请重试`);
        } finally {
          uni.hideLoading();
        }
      };
      const __returned__ = { loading, withdrawalRequests, showReviewModal, selectedRequest, adminRemarks, popupVisible, popupMessageType, popupMessageText, get popupTimer() {
        return popupTimer;
      }, set popupTimer(v2) {
        popupTimer = v2;
      }, goBack, formatTimestamp, formatWithdrawalStatus, getStatusClass, showMessage, fetchWithdrawalRequests, openReviewModal, closeReviewModal, onQrCodeError, previewQrCode, processWithdrawal, ref: vue.ref, onMounted: vue.onMounted, get onShow() {
        return onShow;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
      vue.createCommentVNode(" 顶部导航栏将由 pages.json 配置和原生实现 "),
      vue.createCommentVNode(" 提现申请列表 "),
      vue.createElementVNode("view", { class: "card application-list-card" }, [
        vue.createElementVNode("view", { class: "card-header" }, [
          vue.createElementVNode("text", { class: "card-title" }, "待审核申请")
        ]),
        vue.createElementVNode("view", { class: "card-body" }, [
          $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "loading-state"
          }, [
            vue.createElementVNode("text", null, "加载中...")
          ])) : $setup.withdrawalRequests.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", null, "暂无待审核提现申请")
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "application-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.withdrawalRequests, (request) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: request._id,
                  class: "application-item",
                  onClick: ($event) => $setup.openReviewModal(request)
                }, [
                  vue.createElementVNode("view", { class: "item-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "item-worker-name" },
                      "工人: " + vue.toDisplayString(request.workerName) + " (" + vue.toDisplayString(request.workerPhone) + ")",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "item-amount" },
                      "提现金额: ¥" + vue.toDisplayString((request.amount / 100).toFixed(2)),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "item-date" },
                      "申请时间: " + vue.toDisplayString($setup.formatTimestamp(request.requestAt)),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "item-status status-pending-review" },
                    vue.toDisplayString($setup.formatWithdrawalStatus(request.status)),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "arrow-icon" }, "›"),
                  vue.createCommentVNode(" 替换 uni-icons ")
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ])
      ]),
      vue.createCommentVNode(" 提现详情审核弹窗 "),
      $setup.showReviewModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "popup-overlay",
        onClick: $setup.closeReviewModal
      }, [
        vue.createElementVNode("view", {
          class: "popup-content",
          onClick: _cache[4] || (_cache[4] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "popup-header" }, [
            vue.createElementVNode("text", { class: "popup-title" }, "提现详情"),
            vue.createElementVNode("text", {
              class: "popup-close",
              onClick: $setup.closeReviewModal
            }, "×")
          ]),
          $setup.selectedRequest ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "popup-body"
          }, [
            vue.createElementVNode("view", { class: "detail-row" }, [
              vue.createElementVNode("text", { class: "detail-label" }, "工人姓名:"),
              vue.createElementVNode(
                "text",
                { class: "detail-value" },
                vue.toDisplayString($setup.selectedRequest.workerName),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "detail-row" }, [
              vue.createElementVNode("text", { class: "detail-label" }, "工人电话:"),
              vue.createElementVNode(
                "text",
                { class: "detail-value" },
                vue.toDisplayString($setup.selectedRequest.workerPhone),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "detail-row" }, [
              vue.createElementVNode("text", { class: "detail-label" }, "提现金额:"),
              vue.createElementVNode(
                "text",
                { class: "detail-value amount-value" },
                "¥" + vue.toDisplayString(($setup.selectedRequest.amount / 100).toFixed(2)),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "detail-row" }, [
              vue.createElementVNode("text", { class: "detail-label" }, "申请时间:"),
              vue.createElementVNode(
                "text",
                { class: "detail-value" },
                vue.toDisplayString($setup.formatTimestamp($setup.selectedRequest.requestAt)),
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" 微信收款信息 "),
            vue.createElementVNode("view", { class: "detail-row" }, [
              vue.createElementVNode("text", { class: "detail-label" }, "微信号:"),
              vue.createElementVNode(
                "text",
                { class: "detail-value" },
                vue.toDisplayString($setup.selectedRequest.weChatId || "未设置"),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "detail-row qr-code-row" }, [
              vue.createElementVNode("text", { class: "detail-label" }, "收款码:"),
              vue.createElementVNode("view", { class: "detail-value qr-code-wrapper" }, [
                vue.createCommentVNode(" 添加点击预览功能 "),
                $setup.selectedRequest.weChatQrCodeUrl ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 0,
                  src: $setup.selectedRequest.weChatQrCodeUrl,
                  mode: "aspectFit",
                  class: "wechat-qr-code-img",
                  onError: $setup.onQrCodeError,
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.previewQrCode($setup.selectedRequest.weChatQrCodeUrl))
                }, null, 40, ["src"])) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "no-qr-code"
                }, "未上传收款码"))
              ])
            ]),
            vue.createCommentVNode(" 关联收入ID可以保留，方便审计 "),
            vue.createElementVNode("view", { class: "detail-row" }, [
              vue.createElementVNode("text", { class: "detail-label" }, "关联收入ID:"),
              vue.createElementVNode("view", { class: "detail-value related-ids" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.selectedRequest.relatedSettlementIds, (id) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: id,
                        class: "id-tag"
                      },
                      vue.toDisplayString(id),
                      1
                      /* TEXT */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                !$setup.selectedRequest.relatedSettlementIds || $setup.selectedRequest.relatedSettlementIds.length === 0 ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "无")) : vue.createCommentVNode("v-if", true)
              ])
            ]),
            vue.createElementVNode("view", { class: "detail-row" }, [
              vue.createElementVNode("text", { class: "detail-label" }, "管理员备注:"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.adminRemarks = $event),
                  placeholder: "请输入备注（可选）",
                  class: "remarks-input",
                  "auto-height": ""
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.adminRemarks]
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "popup-actions" }, [
            vue.createCommentVNode(" 重新加入拒绝提现按钮 "),
            vue.createElementVNode("button", {
              class: "btn reject-btn",
              onClick: _cache[2] || (_cache[2] = ($event) => $setup.processWithdrawal("rejected"))
            }, "拒绝提现"),
            vue.createElementVNode("button", {
              class: "btn approve-btn",
              onClick: _cache[3] || (_cache[3] = ($event) => $setup.processWithdrawal("completed"))
            }, "批准打款")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 自定义消息提示框 "),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["custom-message-popup", { "show": $setup.popupVisible, [$setup.popupMessageType]: true }])
        },
        [
          vue.createElementVNode(
            "text",
            { class: "popup-text" },
            vue.toDisplayString($setup.popupMessageText),
            1
            /* TEXT */
          )
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const PagesAdminReviewWithdrawalsReviewWithdrawals = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/pages/admin/ReviewWithdrawals/ReviewWithdrawals.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/previewList/previewList", PagesPreviewListPreviewList);
  __definePage("pages/chatList/chatList", PagesChatListChatList);
  __definePage("pages/profile/profile", PagesProfileProfile);
  __definePage("pages/Homepage/Homepage", PagesHomepageHomepage);
  __definePage("pages/EditProfile/EditProfile", PagesEditProfileEditProfile);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/terms/terms", PagesTermsTerms);
  __definePage("pages/HomepageDetail/HomepageDetail", PagesHomepageDetailHomepageDetail);
  __definePage("pages/chatDetail/chatDetail", PagesChatDetailChatDetail);
  __definePage("pages/applyTechnician/applyTechnician", PagesApplyTechnicianApplyTechnician);
  __definePage("pages/admin/ReviewApplications/ReviewApplications", PagesAdminReviewApplicationsReviewApplications);
  __definePage("pages/appointmentForm/appointmentForm", PagesAppointmentFormAppointmentForm);
  __definePage("pages/worker-schedule/worker-schedule", PagesWorkerScheduleWorkerSchedule);
  __definePage("pages/user-schedule/user-schedule", PagesUserScheduleUserSchedule);
  __definePage("pages/newsDetail/newsDetail", PagesNewsDetailNewsDetail);
  __definePage("pages/allComments/allComments", PagesAllCommentsAllComments);
  __definePage("pages/Payouts/Payouts", PagesPayoutsPayouts);
  __definePage("pages/admin/ReviewWithdrawals/ReviewWithdrawals", PagesAdminReviewWithdrawalsReviewWithdrawals);
  const _sfc_main = {
    __name: "App",
    setup(__props, { expose: __expose }) {
      __expose();
      let pollingTimer = null;
      const safeSetTabBarBadge = (total) => {
        const pages2 = getCurrentPages();
        const currentPage = pages2[pages2.length - 1];
        const tabBarRoutes = [
          "pages/index/index",
          "pages/previewList/previewList",
          "pages/chatList/chatList",
          "pages/profile/profile"
        ];
        if (!tabBarRoutes.includes(currentPage.route))
          return;
        try {
          if (total > 0) {
            uni.setTabBarBadge({
              index: 2,
              text: total > 99 ? "99+" : total.toString()
            });
          } else {
            uni.removeTabBarBadge({ index: 2 });
          }
        } catch (e2) {
          formatAppLog("warn", "at App.vue:34", "[Global Polling] 设置/移除 TabBarBadge 失败:", e2);
        }
      };
      const fetchTotalUnreadCount = async (phoneNumber) => {
        if (!phoneNumber)
          return;
        try {
          const res = await tr.callFunction({
            name: "get-total-unread-count",
            data: { userPhoneNumber: phoneNumber }
          });
          if (res.result.success) {
            safeSetTabBarBadge(res.result.totalUnread || 0);
          }
        } catch (error) {
          formatAppLog("error", "at App.vue:52", "[Global Polling] 获取总未读数失败:", error);
        }
      };
      const syncUserInfo = async () => {
        const userInfo = uni.getStorageSync("userinfo");
        if (!(userInfo == null ? void 0 : userInfo._id))
          return;
        try {
          const res = await tr.callFunction({
            name: "getUserInfo",
            data: { userId: userInfo._id }
          });
          if (res.result.code === 0 && res.result.userInfo) {
            uni.setStorageSync("userinfo", res.result.userInfo);
            formatAppLog("log", "at App.vue:69", "[SyncUserInfo] 已同步最新 userInfo");
          }
        } catch (e2) {
          formatAppLog("error", "at App.vue:72", "[SyncUserInfo] 同步失败:", e2);
        }
      };
      const startPolling = () => {
        const userInfo = uni.getStorageSync("userinfo");
        const phone = userInfo == null ? void 0 : userInfo.phoneNumber;
        if (!phone)
          return;
        fetchTotalUnreadCount(phone);
        pollingTimer = setInterval(() => fetchTotalUnreadCount(phone), 45e3);
      };
      const stopPolling = () => {
        if (pollingTimer) {
          clearInterval(pollingTimer);
          pollingTimer = null;
        }
      };
      onLaunch(() => {
        formatAppLog("log", "at App.vue:99", "App 启动");
        startPolling();
      });
      onShow(async () => {
        formatAppLog("log", "at App.vue:104", "App 显示");
        await syncUserInfo();
        const userInfo = uni.getStorageSync("userinfo");
        if (userInfo == null ? void 0 : userInfo.phoneNumber) {
          if (!pollingTimer) {
            startPolling();
          } else {
            fetchTotalUnreadCount(userInfo.phoneNumber);
          }
        }
      });
      onHide(() => {
        formatAppLog("log", "at App.vue:119", "App 隐藏");
        stopPolling();
      });
      uni.$on("user-login", () => {
        stopPolling();
        startPolling();
      });
      uni.$on("user-logout", () => {
        stopPolling();
      });
      uni.$on("refresh-unread", () => {
        const userInfo = uni.getStorageSync("userinfo");
        if (userInfo == null ? void 0 : userInfo.phoneNumber) {
          fetchTotalUnreadCount(userInfo.phoneNumber);
        }
      });
      const __returned__ = { get pollingTimer() {
        return pollingTimer;
      }, set pollingTimer(v2) {
        pollingTimer = v2;
      }, safeSetTabBarBadge, fetchTotalUnreadCount, syncUserInfo, startPolling, stopPolling, get onLaunch() {
        return onLaunch;
      }, get onShow() {
        return onShow;
      }, get onHide() {
        return onHide;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 根模板无需改动 "),
        vue.renderSlot(_ctx.$slots, "default")
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/peng.folder/fengdian-main/蜂点到家/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
