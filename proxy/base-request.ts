import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class RequestProxyManager {
  // 保存代理后的实例
  private proxyList: Record<string, any[]> = {};

  // 添加代理实例
  addProxy(proxy: BaseRequest, key) {
    if (!this.proxyList[key]) {
      this.proxyList[key] = [];
    }
    this.proxyList[key].push(proxy);
  }

  // 清空代理实例
  clearProxy(key) {
    if (this.proxyList[key]) {
      this.proxyList[key].forEach(proxy => proxy.clear())
    }
  }
}

const requestProxyManager = new RequestProxyManager();

// 判断条件是否满足
const isNext = (condition: Record<string, boolean | string>) => {
  const keys = Object.keys(condition);
  return keys.every(key => condition[key]);
}

class BaseRequest {
  request: AxiosInstance; // 代理后的axios实例
  conditionProxy: Record<string, boolean | string> = {}; // 代理后的条件对象
  interceList: any[] = []; // 拦截器列表
  interceMethods = ["get", "post", "request"]; // 拦截的方法

  constructor(config: AxiosRequestConfig, proxyKey: string = '', condition: Record<string, boolean | string> = {}) {
    // 如果有proxyKey，说明需要代理
    if (proxyKey) {
      // 将实例添加到代理管理器中
      requestProxyManager.addProxy(this, proxyKey);
      // 代理axios实例
      this.request = new Proxy(axios.create(config), {
        get: (target, prop) => {
          // 如果不是拦截的方法或者条件已经满足，直接返回
          if (!this.interceMethods.includes(prop as string) || isNext(condition)) {
            return target[prop];
          }

          let finalResolve; // 保存resolve方法
          let finalArgs; // 保存参数

          // 通过promise实现拦截
          const promise = new Promise((resolve) => {
            finalResolve = resolve;
          })

          // 将resolve方法保存到拦截器列表中
          this.interceList.push(() => {
            // 拦截器执行时，调用resolve方法，返回请求结果
            finalResolve(target[prop](...finalArgs));
            // 清空保存的方法和参数
            finalResolve = null;
            finalArgs = null;
          })

          // 返回一个函数，保存参数
          return (...args) => {
            finalArgs = args
            return promise;
          }
        }
      });

      // 代理条件对象
      this.conditionProxy = new Proxy(condition, {
        // 每次设置属性时，都会判断条件是否满足，如果满足，清空拦截器列表
        set(target, prop, value, receiver) {
          target[prop as any] = value;
          if (isNext(target)) {
            requestProxyManager.clearProxy(proxyKey);
          }
          return Reflect.set(target, prop, value, receiver);
        }
      })


    } else {
      // 不需要代理，直接创建axios实例
      this.request = axios.create(config);
    }
  }

  clear() {
    // 清空拦截器列表, 重新发起请求
    this.interceList.forEach((item) => item());
    this.interceList = [];
  }

}
