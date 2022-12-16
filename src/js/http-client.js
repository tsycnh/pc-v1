import axios from "axios";
import utils from "@/js/utils";
import router from "../router";
import Store from "../store";

class HttpClient {
  constructor(uri) {
    this.axios = axios.create({
      baseURL: uri,
      timeout: 15000,
      withCredentials: false,
    });

    this.axios.interceptors.request.use(
      (config) => {
        const token = utils.getToken();
        token && (config.headers.Authorization = "Bearer " + token);
        config.headers.common["meedu-platform"] = "PC";
        return config;
      },
      (error) => {
        return Promise.error(error);
      }
    );

    this.axios.interceptors.response.use(
      (response) => {
        let apiCode = response.data.code;
        if (apiCode !== 0) {
          // 未登录错误
          if (apiCode === 401) {
            Store.commit("logout");
            router.replace({
              name: "login",
            });
          }
          // api请求返回错误
          return Promise.reject(response);
        } else {
          return Promise.resolve(response);
        }
      },
      // 当http的状态码非0
      (error) => {
        let httpCode = error.response.status;
        if (httpCode === 401) {
          Store.commit("logout");
          router.replace({
            name: "login",
          });
        } else if (httpCode === 404) {
          router.replace({
            name: "Error404",
          });
        } else if (httpCode === 500) {
          router.replace({
            name: "Error500",
          });
        } else {
          // 其他错误
        }
        return Promise.reject(error.response);
      }
    );
  }

  get(url, params) {
    return new Promise((resolve, reject) => {
      this.axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  }

  destroy(url) {
    return new Promise((resolve, reject) => {
      this.axios
        .delete(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  }

  post(url, params) {
    return new Promise((resolve, reject) => {
      this.axios
        .post(url, params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  }

  put(url, params) {
    return new Promise((resolve, reject) => {
      this.axios
        .put(url, params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  }
}

export default HttpClient;
