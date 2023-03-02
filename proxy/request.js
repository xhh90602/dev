console.log('------------------------------------刷新');
const createProxyObj = (obj = {}) => {
    const objProxy = new Proxy(obj, {
        get: (target, key, rec) => {
            console.log("get-target:", target)
            console.log("get-key:", key)
            console.log("get-rec:", rec)
            return target[key]
        },
        set: (target, key, val, rec) => {
            console.log("set-target:", target)
            console.log("set-key:", key)
            console.log("set-val:", val)
            console.log("set-rec:", rec)
            target[key] = val
        }
    })
    return objProxy;
}


class RequestProxy {
    constructor(request, info = {}) {
        this.request = this.createRequest(request);
        this.info = this.createInfo(info);
        this.requestList = [];
    }

    createRequest(request) {
        return new Proxy(request, {
            get: (target, key) => {
                console.log("🚀 ~ file: main.js:32 ~ RequestProxy ~ get ~ target:", target)
                const infoKeys = Object.keys(info);
                console.log("🚀 ~ file: main.js:34 ~ RequestProxy ~ createRequest ~ info:", info)
                const stop = infoKeys.map((k) => info[k]).some((v) => !v);
                console.log("🚀 ~ file: main.js:36 ~ RequestProxy ~ createRequest ~ stop:", stop)
                if (infoKeys.length > 0 && stop) {
                    this.requestList.push(key);
                } else {
                    return target[key];
                }
            }
        })
    }

    createInfo(info) {
        return new Proxy(info, {
            set: (target, key, val) => {
                target[key] = val;
                console.log("🚀 ~ file: main.js:47 ~ RequestProxy ~ set ~ target:", target)
                const infoKeys = Object.keys(target);
                console.log("🚀 ~ file: main.js:52 ~ RequestProxy ~ set ~ infoKeys:", infoKeys)
                const stop = infoKeys.map((k) => target[k]).some((v) => !v);
                console.log("🚀 ~ file: main.js:54 ~ RequestProxy ~ set ~ stop:", stop)
                if (!stop) {
                    console.log(this.requestList)
                }
            }
        })
    }
}


const { request, info } = new RequestProxy({ a: '1', b: '2' }, { c: '', d: '' });

const proxyCache = new Proxy({a: '', b: '', c: '', d: ''}, {
    set: (target, key, val) => {
        target[key] = val;
        if (info.hasOwnProperty(key)) {
            info[key] = val
        }
    }
})

request.a

proxyCache.c = 1
proxyCache.d = 2



