
# MeEdu PC站前台程序 - 本程序已经停止已维护，最高支持 MeEdu <= v4.9.8 版本。

### 常用链接

- [MeEdu 官网](https://meedu.vip)
- [MeEdu 开源程序](https://github.com/Qsnh/meedu)
- [MeEdu 付费解决方案](https://meedu.vip/price.html)
- [MeEdu 付费版本演示站](https://meedu.vip/cases.html)
- [MeEdu 功能概览](https://www.yuque.com/meedu/fvvkbf/gpx5ed)
- [MeEdu 使用手册](https://www.yuque.com/meedu/fvvkbf)
- [MeEdu API文档](https://meedu-v2-xiaoteng.doc.coding.io/)

### 使用限制

[**使用限制条款**](https://www.yuque.com/meedu/fvvkbf/amfw7z)

### 快速上手

#### 一、安装依赖：

```
npm install
```

#### 二、修改配置：

```
cp .env.example .env
```

打开 `.env` 文件，修改其中的配置如下：

```
VUE_APP_URL=meedu的API服务地址
VUE_APP_GO_MEEDU_URL=go-meedu地址(如果你是开源用户则留空即可)
```

例如，我的 meedu 的 API 地址是 `https://demo-api.meedu.xyz` ，我的 go-meedu 的 API 地址是 `https://demo-go.meedu.xyz` 那么我的 `.env` 文件内容如下：

```
VUE_APP_URL=https://demo-api.meedu.xyz
VUE_APP_GO_MEEDU_URL=https://demo-go.meedu.xyz
```

#### 三、编译：

```
npm run build
```

编译好，将会生成 `dist` 目录。将 `dist` 目录下的文件部署到新的站点。
