<template>
  <div class="skeleton">
    <div class="nav"></div>
    <div class="video-box"></div>
  </div>
</template>
<style lang="less" scoped>
@keyframes el-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  to {
    background-position: 0 50%;
  }
}
.skeleton {
  width: 100%;
  display: flex;
  flex-direction: column;
  .nav {
    width: 1200px;
    height: 14px;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .video-box {
    width: 1200px;
    height: 578px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
}
</style>
