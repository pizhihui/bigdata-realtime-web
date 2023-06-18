<template>
  <div class="app">
    <h2>这是主页</h2>
    <router-link to="/login">login</router-link>
    <hr />
    <router-link to="/main">main</router-link>
    <hr />
    <router-link to="/task">task</router-link>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">

</style>
