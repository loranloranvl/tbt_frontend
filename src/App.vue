<template>
  <div id="app">
    <!-- Navbar (sit on top) -->
    <div id="nav" class="w3-top">
      <div class="w3-bar w3-white w3-padding w3-card">
        <a href="#home" class="w3-bar-item w3-button">
          <b class="w3-margin-right">TBT</b> The Best Transportation
        </a>
        <!-- Float links to the right. Hide them on small screens -->
        <div class="w3-right w3-hide-small">
          <a href="#panel" class="w3-bar-item w3-button">导航面板</a>
          <a href="#about" class="w3-bar-item w3-button">关于我们</a>
        </div>
      </div>
    </div>

    <!-- Header -->
    <header class="w3-conetnt" id="home">
      <img class="w3-image" src="./assets/tbtlogo.png" width="600" />
    </header>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->

    <Panel></Panel>
    <About></About>

    <footer class="w3-center w3-black w3-padding-16">
      <p>
        @
        <a
          href="http://www.hdu.edu.cn"
          title="杭州电子科技大学"
          target="_blank"
          class="w3-hover-text-blue w3-margin-right"
        >杭州电子科技大学</a>
        某吴姓菜鸡和他的大腿
      </p>
    </footer>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Panel from "./components/Panel.vue";
import About from "./components/About.vue";
import "./assets/App.less";

export default {
  name: "App",
  components: {
    HelloWorld,
    Panel,
    About
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
