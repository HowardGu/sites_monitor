(function() {
    window.HOST_TYPE = "2";
    window.BMap_loadScriptTime = (new Date).getTime();
    window.BMap = window.BMap || {};
    window.BMap.apiLoad = function() {
        delete window.BMap.apiLoad;
        if (typeof _initBaiduMap == "function") {
            _initBaiduMap()
        }
    };
    var s = document.createElement('script');
    const hostname = self.location.hostname;
    console.log('baidu-init.js calls ' + hostname);
    s.src = 'http://' + hostname + ':8080/baidu/baidu-api.js';
    document.body.appendChild(s);
})();