<template>
  <div id="panel">
    <h3>导航面板</h3>
    <div id="form" class="w3-card w3-hide-small"></div>
    <canvas id="map" class="w3-card w3-hide-small"></canvas>
    <div id="note" class="w3-card w3-hide-medium w3-hide-large">请在电脑上使用导航面板</div>
  </div>
</template>

<script>
import "../assets/Panel.less";
export default {
  name: "Panel",
  props: {}
};
</script>