<template>
  <div class="skin-blue" data-spy="scroll" data-target="#scrollspy">
      <div class="wrapper">

        <header class="main-header">
          <nav class="navbar navbar-static-top" role="navigation">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
              <span class="sr-only">Toggle navigation</span>
            </a>
            <!-- Navbar Right Menu -->
            <div class="navbar-custom-menu">
              <ul class="nav navbar-nav">
                <li><a href="https://adminlte.io">Almsaeed Studio</a></li>
                <li><a href="https://adminlte.io/premium">Premium Templates</a></li>
              </ul>
            </div>
          </nav>
        </header>
        <aside class="main-sidebar">
          <div class="sidebar" id="scrollspy">
            <ul class="nav sidebar-menu">
              <li class="header">TABLE OF CONTENTS</li>
              <li class="active"><a href="#introduction"><i class="fa fa-circle-o"></i> Introduction</a></li>
              <li><a href="#download"><i class="fa fa-circle-o"></i> Download</a></li>
              <li><a href="#dependencies"><i class="fa fa-circle-o"></i> Dependencies</a></li>
              <li><a href="#advice"><i class="fa fa-circle-o"></i> Advice</a></li>
              <li><a href="#layout"><i class="fa fa-circle-o"></i> Layout</a></li>
              <li><a href="#adminlte-options"><i class="fa fa-circle-o"></i> Javascript Options</a></li>
              <li class="treeview" id="scrollspy-components">
                <a href="javascript:void(0)"><i class="fa fa-circle-o"></i> Components</a>
                <ul class="nav treeview-menu">
                  <li><a href="#component-main-header">Main Header</a></li>
                  <li><a href="#component-sidebar">Sidebar</a></li>
                  <li><a href="#component-control-sidebar">Control Sidebar</a></li>
                  <li><a href="#component-info-box">Info Box</a></li>
                  <li><a href="#component-box">Boxes</a></li>
                  <li><a href="#component-direct-chat">Direct Chat</a></li>
                </ul>
              </li>
              <li><a href="#plugins"><i class="fa fa-circle-o"></i> Plugins</a></li>
              <li><a href="#browsers"><i class="fa fa-circle-o"></i> Browser Support</a></li>
              <li><a href="#upgrade"><i class="fa fa-circle-o"></i> Upgrade Guide</a></li>
              <li><a href="#implementations"><i class="fa fa-circle-o"></i> Implementations</a></li>
              <li><a href="#faq"><i class="fa fa-circle-o"></i> FAQ</a></li>
              <li><a href="#license"><i class="fa fa-circle-o"></i> License</a></li>
            </ul>
          </div>
        </aside>
        <div class="content-wrapper">
          <!-- Content Header (Page header) -->
          <div class="content-header">
            <h1>
              AdminLTE Documentation
              <small>Version 2.3</small>
            </h1>
            <ol class="breadcrumb">
              <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
              <li class="active">Documentation</li>
            </ol>
          </div>
          <!-- Main content -->
          <div class="content body">
            <p class="lead">
              This documentation is for versions 2.3 and under.
              If you are looking for documentation for version 2.4 and above,
              please visit <a href="https://adminlte.io/docs">our online documentation</a>.
            </p>

            <section id="introduction">
              <h2 class="page-header"><a href="#introduction">Introduction</a></h2>
              <p class="lead">
                <b>AdminLTE</b> is a popular open source WebApp template for admin dashboards and control panels.
                It is a responsive HTML template that is based on the CSS framework Bootstrap 3.
                It utilizes all of the Bootstrap components in its design and re-styles many
                commonly used plugins to create a consistent design that can be used as a user
                interface for backend applications. AdminLTE is based on a modular design, which
                allows it to be easily customized and built upon. This documentation will guide you through
                installing the template and exploring the various components that are bundled with the template.
              </p>
            </section><!-- /#introduction -->
          </div>
        </div>
      </div>
    <footer class="main-footer">
      <div class="pull-right hidden-xs">
        <b>Version</b> 2.3.12
      </div>
      <strong>Copyright &copy; 2014-2016 <a href="https://adminlte.io">Almsaeed Studio</a>.</strong> All rights
      reserved.
    </footer>
  </div>
</template>

<script>
  import { getList } from '@/api/table';
</script>
<style>
  @import '../../../static/css/temp/style.css';
  /*@import '../../../static/css/temp/_all-skins.css';
  @import '../../../static/css/temp/AdminLTE.css';*/

  /*.icon-bar{border: 1px solid #fff;}
  .navbar{background: #d9534f;}
  .navbar .navbar-brand,.navbar .navbar-brand:hover{color: #fff;}
  #navbar li a{color: #fff;}
  #navbar li.active a{background:#fff;color: #d9534f;font-weight: bold}
  #navbar li.dropdown .dropdown-toggle{background: #d9534f;}
  #navbar li.dropdown .dropdown-menu{background: #d9534f;}
  #navbar li.dropdown .dropdown-menu li a:hover{background: #900;}*/

</style>
