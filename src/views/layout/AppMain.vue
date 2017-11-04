<template>
    <section class="app-main main-diy">
        <transition name="fade" mode="out-in">
            <router-view :key="key"></router-view>
        </transition>
    </section>
</template>

<script>
    export default {
      name: 'AppMain',
      computed: {
        key() {
          return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
        }
      }
    }
</script>
<style>
    .main-diy{
        /*background: -webkit-gradient(linear, 0 0, 100% 100%, from(#40537D), to(#5675A4));*/
    }
</style>