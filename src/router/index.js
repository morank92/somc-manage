import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');

/* dashboard */
const dashboard = _import('dashboard/index');

/* error page */
const Err404 = _import('404');

/* demo page */
const Form = _import('page/form');
const Table = _import('table/index');

const dash02 = _import('temp/index');
//节点
//const ManageNode = _import('page/node/manage_node');//本身import只负责引入，不执行该引入的模块行数，

//运营
//const WorkWorder = _import('page/operation/work_order');//工单管理




Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta : `{ role: ['admin'] }`  will control the page role
  **/
export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  },
];

export const asyncRouterMap = [
    {//节点
        path: '/node',
        component: Layout,
        redirect: 'noredirect',
        //redirect: '/node/manage_node',
        name: '节点',
        icon: 'zujian',
        children: [
            { path: 'manage_node', component: resolve => require(['../views/page/node/manage_node'],resolve), name: '节点管理', icon: 'zonghe'},
            { path: 'device_node', component: resolve => require(['../views/page/node/device_node'],resolve), name: '设备管理', icon: 'zonghe'},
            { path: 'proxy_node', component: resolve => require(['../views/page/node/proxy_node'],resolve), name: '代理服务器',
                children:[
                    { path: 'proxyNodeIp', component: resolve => require(['../views/page/node/proxy_node_ip'],resolve), name: '代理服务器IP',hidden:true},
                ],
            }
        ]
    },

    {//运营
        path: '/operation',
        component: Layout,
        //redirect: 'noredirect',
        redirect: '/operation/customer',
        name: '运营',
        icon: 'tubiaoleixingzhengchang',
        noDropdown: false,
        children: [{ path: 'customer', component: resolve => require(['../views/page/operation/customer_op'],resolve), name: '用户管理', meta: { role: ['admin']},
                children:[
                    {path:'domain',name:'域名',component: resolve => require(['../views/page/operation/domain_op'],resolve),hidden:true},//为隐藏页面，菜单栏不会构造
                    {path:'fenceip',name:'高防IP',component: resolve => require(['../views/page/operation/fenceip_op'],resolve),hidden:true},
                    {path:'subscribe',name:'购买',component: resolve => require(['../views/page/operation/subscribe_op'],resolve),hidden:true},
                    {path:'waf',name:'WAF',component: resolve => require(['../views/page/operation/waf_op'],resolve),hidden:true},
                    {path:'config',name:'安全配置',component:resolve => require(['../views/page/operation/ipconfig_op'],resolve),hidden:true},
                    {path:'waf_config',name:'站点配置',component:resolve => require(['../views/page/operation/wafconfig_op'],resolve),hidden:true}
                ]},

            { path: 'order', component: resolve => require(['../views/page/operation/order'],resolve), name: '订单管理',
                children:[
                    { path: 'allot', component: resolve => require(['../views/page/operation/order_allot'],resolve), name: '分配IP',hidden:true}
                ]
            },
            { path: 'work_order', component: resolve => require(['../views/page/operation/work_order'],resolve), name: '工单管理'},
            { path: 'invoice', component: resolve => require(['../views/page/operation/invoice'],resolve), name: '发票管理',meta: { role: ['admin']}},
        ]
    },

    {//配置
        path: '/config',
        component: Layout,
        //redirect: 'noredirect',
        redirect: '/config/index',
        name: '配置',
        icon: 'tubiaoleixingzhengchang',
        noDropdown: false,
        children: [
            { path: 'serviceParam', component: resolve => require(['../views/page/config/service_param'],resolve), name: '服务参数', meta: { role: ['admin'] } },
            { path: 'serviceConf', component: resolve => require(['../views/page/config/service_conf'],resolve), name: '服务配置', meta: { role: ['admin'] } },
            { path: 'reportConf', component: resolve => require(['../views/page/config/report_conf'],resolve), name: '告警配置', meta: { role: ['admin'] } },
        ]
    },
    {//报表
        path: '/report',
        component: Layout,
        //redirect: 'noredirect',
        redirect: '/report/node',
        name: '报表',
        icon: 'tubiaoleixingzhengchang',
        noDropdown: false,
        children: [{ path: 'node', component: resolve => require(['../views/page/report/node-reprot/index'],resolve), name: '节点报表', meta: { role: ['admin'] } },
            { path: 'customer', component: resolve => require(['../views/page/report/customer-reprot/index'],resolve), name: 'DDOS报表'},
            /*{ path: 'operation', component: resolve => require(['../views/page/report/operation-reprot/index'],resolve), name: 'WAF报表'},*/
            { path: 'waf', component: resolve => require(['../views/page/report/waf-reprot/index'],resolve), name: 'WAF报表'},
        ]
    },

    {//监控
        path: '/monitor',
        component: Layout,
        //redirect: 'noredirect',
        redirect: '/monitor/index',
        name: '监控',
        icon: 'tubiaoleixingzhengchang',
        noDropdown: false,
        children: [{ path: 'index', component: Table, name: '防御对象监控', meta: { role: ['admin'] } },
        ]
    },


    {//监控
        path: '/dash02',
        component: dash02,
        //redirect: 'noredirect',
        redirect: '/dash02/index',
        name: '风格',
        icon: 'tubiaoleixingzhengchang',
        noDropdown: false,
        children: [{ path: 'index', component: dash02, name: '风格02', meta: { role: ['admin'] } },
        ]
    },


    { path: '*', redirect: '/404', hidden: true }
];


export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

//异步的路由

