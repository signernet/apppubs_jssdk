/*v1.1.0*/
(function() {
  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
        document.documentElement.removeChild(WVJBIframe)
      },
      0)
  }

  function setupAndroidWebViewJSBridge() {
    if (window.WebViewJavascriptBridge) {
      return;
    }

    var messagingIframe;
    var sendMessageQueue = [];
    var receiveMessageQueue = [];
    var messageHandlers = {};

    var CUSTOM_PROTOCOL_SCHEME = 'yy';
    var QUEUE_HAS_MESSAGE = '__QUEUE_MESSAGE__/';

    var responseCallbacks = {};
    var uniqueId = 1;

    function _createQueueReadyIframe(doc) {
      messagingIframe = doc.createElement('iframe');
      messagingIframe.style.display = 'none';
      doc.documentElement.appendChild(messagingIframe);
    }

    //set default messageHandler
    function init(messageHandler) {
      if (WebViewJavascriptBridge._messageHandler) {
        throw new Error('WebViewJavascriptBridge.init called twice');
      }
      WebViewJavascriptBridge._messageHandler = messageHandler;
      var receivedMessages = receiveMessageQueue;
      receiveMessageQueue = null;
      for (var i = 0; i < receivedMessages.length; i++) {
        _dispatchMessageFromNative(receivedMessages[i]);
      }
    }

    function send(data, responseCallback) {
      _doSend({
        data: data
      }, responseCallback);
    }

    function registerHandler(handlerName, handler) {
      messageHandlers[handlerName] = handler;
    }

    function callHandler(handlerName, data, responseCallback) {
      _doSend({
        handlerName: handlerName,
        data: data
      }, responseCallback);
    }

    //sendMessage add message, 触发native处理 sendMessage
    function _doSend(message, responseCallback) {
      if (responseCallback) {
        var callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        message.callbackId = callbackId;
      }

      sendMessageQueue.push(message);
      messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
    }

    // 提供给native调用,该函数作用:获取sendMessageQueue返回给native,由于android不能直接获取返回的内容,所以使用url shouldOverrideUrlLoading 的方式返回内容
    function _fetchQueue() {
      var messageQueueString = JSON.stringify(sendMessageQueue);
      sendMessageQueue = [];
      //android can't read directly the return data, so we can reload iframe src to communicate with java
      messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString);
    }

    //提供给native使用,
    function _dispatchMessageFromNative(messageJSON) {
      setTimeout(function() {
        var message = JSON.parse(messageJSON);
        var responseCallback;
        //java call finished, now need to call js callback function
        if (message.responseId) {
          responseCallback = responseCallbacks[message.responseId];
          if (!responseCallback) {
            return;
          }
          responseCallback(message.responseData);
          delete responseCallbacks[message.responseId];
        } else {
          //直接发送
          if (message.callbackId) {
            var callbackResponseId = message.callbackId;
            responseCallback = function(responseData) {
              _doSend({
                responseId: callbackResponseId,
                responseData: responseData
              });
            };
          }

          var handler = WebViewJavascriptBridge._messageHandler;
          if (message.handlerName) {
            handler = messageHandlers[message.handlerName];
          }
          //查找指定handler
          try {
            handler(message.data, responseCallback);
          } catch (exception) {
            if (typeof console != 'undefined') {
              console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
            }
          }
        }
      });
    }

    //提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
    function _handleMessageFromNative(messageJSON) {
      console.log(messageJSON);
      if (receiveMessageQueue) {
        receiveMessageQueue.push(messageJSON);
      } else {
        _dispatchMessageFromNative(messageJSON);
      }
    }

    var WebViewJavascriptBridge = window.WebViewJavascriptBridge = {
      init: init,
      send: send,
      registerHandler: registerHandler,
      callHandler: callHandler,
      _fetchQueue: _fetchQueue,
      _handleMessageFromNative: _handleMessageFromNative
    };

    var doc = document;
    _createQueueReadyIframe(doc);
    var readyEvent = doc.createEvent('Events');
    readyEvent.initEvent('WebViewJavascriptBridgeReady');
    readyEvent.bridge = WebViewJavascriptBridge;
    doc.dispatchEvent(readyEvent);
  }

  function getBrowserType() {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      return 0;
    } else if (isiOS) {
      return 1;
    }
  }
  var apppubs = {
    vars: {
      browserType: 0,
      bridge: undefined
    },
    menuItemId: {
      refresh: "menu_item_refresh"
    },
    init: function(data, callback) {
      this.vars.browserType = getBrowserType();
      if (this.vars.browserType == 1) {
        var vars = this.vars;
        setupWebViewJavascriptBridge(function(bridge) {
          vars.bridge = bridge;
        })
      } else {
        setupAndroidWebViewJSBridge();
      }
    },
    hideMenuItems: function(arr) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('hideMenuItems', arr.toString());
      } else {

        window.WebViewJavascriptBridge.callHandler(
          'hideMenuItems', "menu_item_refresh",
          function(responseData) {

            data.success(responseData);
          }
        );
      }
    },
    openWindow: function(location) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('openWindow', location);
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'openWindow', location,
          function(responseData) {

            data.success(responseData);
          }
        );
      }
    },
    closeWindow: function() {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('closeWindow');
      } else {

        window.WebViewJavascriptBridge.callHandler('closeWindow');
      }

    },
    chooseImage: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('chooseImage', "",
          function responseCallback(responseData) {

            data.success(responseData);
            console.log("JS received response:", responseData);
          })
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'chooseImage', "",
          function(responseData) {
            data.success(eval(responseData));
          }
        );

      }

    },
    getLocation: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('chooseImage', "",
          function responseCallback(responseData) {

            data.success(responseData);
            console.log("JS received response:", responseData);
          })
      } else {

        window.WebViewJavascriptBridge.callHandler(
          'getLocation', "",
          function(responseData) {

            data.success(eval("(" + responseData + ")"));
          }
        );

      }

    },
    getDeviceId: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('getDeviceId', "",
          function responseCallback(responseData) {
            data.success(responseData);
          })
      } else {

        window.WebViewJavascriptBridge.callHandler(
          'getDeviceId', "",
          function(responseData) {

            data.success(responseData);
          }
        );

      }

    },
    scanQRCode: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('scanQRCode', data,
          function responseCallback(responseData) {
            data.success(responseData);
          })
      } else {

        window.WebViewJavascriptBridge.callHandler(
          'scanQRCode', data,
          function(responseData) {
            data.success(eval('(' + responseData + ')'))
          }
        );

      }

    },
    changeApp: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('changeApp', data);
      } else {
        window.WebViewJavascriptBridge.callHandler('changeApp', data);
      }
    },
    alipay: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('alipay', data);
      } else {
        window.WebViewJavascriptBridge.callHandler('alipay', data);
      }
    },
    wxpay: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('wxpay', data);
      } else {
        window.WebViewJavascriptBridge.callHandler('wxpay', data);
      }
    },
    amap: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('amap', '', function responseCallback(responseData) {

          data.success(responseData);
          console.log("JS received response:", responseData);
        })
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'amap', "",
          function(responseData) {
            data.success(responseData);
          }
        )
      }
    },
    handwriting: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('handWriting', data.data, function responseCallback(responseData) {
          data.success(responseData);
          console.log("JS received response:", responseData);
        })
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'handwriting', data.data,
          function(responseData) {
            data.success(eval('(' + responseData + ')'));
          }
        )
      }
    },
    userPicker: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('userPicker', data.data, function responseCallback(responseData) {
          data.success(responseData);
          console.log("JS received response:", responseData);
        })
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'userpicker', data.data,
          function(responseData) {
            data.success(eval('(' + responseData + ')'))
          }
        )
      }
    },
    deptPicker: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('deptPicker', data.data, function responseCallback(responseData) {
          data.success(responseData);
          console.log("JS received response:", responseData);
        })
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'deptpicker', data.data,
          function(responseData) {
            data.success(eval('(' + responseData + ')'))
          }
        )
      }
    },
    getAddress: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('getAddress', "", function responseCallback(responseData) {
          data.success(responseData);
          console.log("JS received response:", responseData);
        })
      } else {
        window.WebViewJavascriptBridge.callHandler('getaddress', data.data,
          function(responseData) {
            data.success(eval('(' + responseData + ')'))
          }
        )
      }
    },

    displayImg: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('displayImg', data.data, function responseCallback(responseData) {
          data.success(responseData);
          console.log("JS received response:", responseData);
        })
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'displayImg', data.data,
          function(responseData) {
            data.success(eval('(' + responseData + ')'))
          }
        )
      }
    },
    checkVersion: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('checkVersion', '', function responseCallback(responseData) {
          data.success(responseData);
          console.log("JS received response:", responseData);
        })
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'checkVersion', '',
          function(responseData) {
            data.success(eval('(' + responseData + ')'))
          }
        )
      }
    },
    timePicker: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('timePicker', '', function responseCallback(responseData) {
          data.success(responseData);
          console.log("JS received response:", responseData);
        })
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'timePicker', '',
          function(responseData) {
            data.success(eval('(' + responseData + ')'))
          }
        )
      }
    },
    getUserInfo: function(data) {
      if (this.vars.browserType == 1) {
        this.vars.bridge.callHandler('getUserInfo', '', function responseCallback(responseData) {
          data.success(responseData);
          console.log("JS received response:", responseData);
        })
      } else {
        window.WebViewJavascriptBridge.callHandler(
          'getUserInfo', '',
          function(responseData) {
            data.success(eval('(' + responseData + ')'))
          }
        )
      }
    }

  }

  function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady',
        function() {
          callback(WebViewJavascriptBridge)
        },
        false
      );
    }
  }

  connectWebViewJavascriptBridge(function(bridge) {
    bridge.init(function(message, responseCallback) {
      console.log('JS got a message', message);
      var data = {
        'Javascript Responds': '测试中文!'
      };
      console.log('JS responding with', data);
      responseCallback(data);
    });
  })

  window.apppubs = apppubs;
  apppubs.init();
})()
