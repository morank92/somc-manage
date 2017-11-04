<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">

        <el-menu class="el-menu-demo diy-menu" mode="horizontal">
            <div style="margin-top: -10px;margin-left: 20px;">
                <a href="#" class="navbar-brand">
                    <small> <img style="height:48px;" src="../../../static/images/lanyunlogo.png"> <span class="white">兰云科技</span>
                    </small>
                </a>
            </div>
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu class="user-dropdown" slot="dropdown">
                    <router-link class='inlineBlock' to="/">
                        <el-dropdown-item>
                            首页
                        </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-menu>

        <div class="sidebar-wrapper">
            <sidebar class="sidebar-container"></sidebar>
        </div>
        <div class="main-container" style="">
            <navbar></navbar>
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
    import { Navbar, Sidebar, AppMain } from '@/views/layout';
    //datatable
    import datatable from '@/components/jq-datatable/datatable';
    import Hamburger from '@/components/Hamburger';


    export default {
      name: 'layout',
      components: {
        Navbar,
        Sidebar,
        AppMain,
      Hamburger
      },
      computed: {
        sidebar() {
          return this.$store.state.app.sidebar;
        }
      },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar')
        },
        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.reload();  // 为了重新实例化vue-router对象 避免bug
            });
        }
    }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../styles/mixin.scss";
    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        &.hideSidebar {
            .sidebar-wrapper {
                transform: translate(-140px, 0);
                .sidebar-container {
                    transform: translate(132px, 0);
                }
                &:hover {
                    transform: translate(0, 0);
                    .sidebar-container {
                        transform: translate(0, 0);
                    }
                }
            }
            .main-container {
                margin-left: 40px;
                margin-top: 54px;
                background-color: #374F7D;
            }
        }
        .sidebar-wrapper {
            width: 180px;
            position: fixed;
            margin-top:54px;//与top的距离
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 1001;
            overflow: hidden;
            transition: all .28s ease-out;
            //box-shadow: 0 0 2px #1876A2 inset;
            /*box-shadow:0 0 2px #1876A2;*/
        }
        .sidebar-container {
            transition: all .28s ease-out;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: -17px;
            overflow-y: scroll;
            background: -webkit-gradient(linear, 0 0, 100% 100%, from(#40537D), to(#142C4C));
        }
        .main-container {
            min-height: 100%;
            transition: all .28s ease-out;
            margin-left: 180px;

            margin-top: 54px;
            //background-color: #374F7D;//#303F5C
        }
        .app-main {
            margin-top:-19px;
        }

        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
    .diy-menu{
        position:fixed;
        top:0;
        left: 0;
        width:100%;
        height:56px;
        background: -webkit-gradient(linear, 100% 0, 100% 0, from(#213E67), to(#2E4E80));
        /*background-color: #142C4C;*/
        color: #fff;
        z-index: 10000;
        /*box-shadow:0 0 2px #1876A2;*/
        /*border-bottom:1px solid;
        border-bottom-color: #616372;*/
    }

    .sidebar-wrapper > ul > div > li > div{
        height: 40px !important;
        color: red !important;
    }


</style>
