<template>
  <div id="panel">
    <h3>导航面板</h3>
    <div id="cars-wrapper" class="w3-card w3-display-container w3-hide-small">
      <div id="cars-label" class="w3-display-middle" v-if="cqm.length == 0">车库</div>
      <div id="cars">
        <div class="car" v-for="cq in cqm" v-bind:key="cq.c">
          <i class="fa fa-truck"></i>
          <span class="times">X</span>
          <span class="quantity">{{cq.q}}</span>
          <div class="weight">{{cq.c}}kg</div>
        </div>
        <div id="car-add">
          <i class="fa fa-plus-circle"></i>
        </div>
      </div>
    </div>
    <canvas id="map" ref="map" class="w3-card w3-hide-small" width="2000" height="1000"></canvas>
    <div id="note" class="w3-card w3-hide-medium w3-hide-large">请在电脑上使用导航面板</div>
    <button class="w3-button w3-black w3-round-large w3-hide-small" @click="draw_route">开始计算导航路线</button>
  </div>
</template>

<script>
import "../assets/Panel.less";
export default {
  name: "Panel",
  data() {
    return {
      ctx: null,
      radius: 50,
      cqm: [
        // capacity-quantity mapping of cars
        { c: 15, q: 2 },
        { c: 16, q: 2 }
      ],
      topology: [
        { name: "P", x: 456, y: 320, demand: 0 }, // 0
        { name: "A", x: 228, y: 0, demand: 0 },
        { name: "B", x: 912, y: 0, demand: 1 },
        { name: "C", x: 0, y: 80, demand: 2 },
        { name: "D", x: 114, y: 80, demand: 4 },
        { name: "E", x: 570, y: 160, demand: 2 },
        { name: "F", x: 798, y: 160, demand: 4 },
        { name: "G", x: 342, y: 240, demand: 8 },
        { name: "H", x: 684, y: 240, demand: 8 },
        { name: "I", x: 570, y: 400, demand: 1 },
        { name: "J", x: 912, y: 400, demand: 2 },
        { name: "K", x: 114, y: 480, demand: 1 },
        { name: "L", x: 228, y: 480, demand: 2 },
        { name: "M", x: 342, y: 560, demand: 4 },
        { name: "N", x: 684, y: 560, demand: 4 },
        { name: "O", x: 0, y: 640, demand: 8 },
        { name: "Q", x: 798, y: 640, demand: 8 } // 16
      ],
      routes: [
        [0, 14, 16, 10, 0],
        [0, 9, 8, 6, 2, 0],
        [1, 11, 15, 13, 12, 1],
        [1, 4, 3, 7, 5, 1]
      ]
    };
  },
  mounted: function() {
    const canvas = this.$refs.map;
    const ctx = canvas.getContext("2d");
    this.ctx = ctx;

    const cw = canvas.width;
    const ch = canvas.height;
    const radius = this.radius;

    const max_y = Math.max.apply(
      Math,
      this.topology.map(function(o) {
        return o.y;
      })
    );

    const max_x = Math.max.apply(
      Math,
      this.topology.map(function(o) {
        return o.x;
      })
    );

    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < this.topology.length; i++) {
      const x = ((cw - 2 * radius) * this.topology[i].x) / max_x + radius;
      const y = ((ch - 2 * radius) * this.topology[i].y) / max_y + radius;
      this.topology[i].new_x = x;
      this.topology[i].new_y = y;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillText(this.topology[i].name, x, y);
    }
  },
  methods: {
    draw_route: function() {
      function canvas_arrow(ctx, fromx, fromy, tox, toy) {
        const headlen = 20; // length of head in pixels
        const dx = tox - fromx;
        const dy = toy - fromy;
        const angle = Math.atan2(dy, dx);
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.lineTo(
          tox - headlen * Math.cos(angle - Math.PI / 6),
          toy - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(tox, toy);
        ctx.lineTo(
          tox - headlen * Math.cos(angle + Math.PI / 6),
          toy - headlen * Math.sin(angle + Math.PI / 6)
        );
      }

      function canvas_arrow_radius(ctx, fromx, fromy, tox, toy, radius) {
        const angle = Math.atan2(toy - fromy, tox - fromx);
        const fromx_ = fromx + radius * Math.cos(angle);
        const fromy_ = fromy + radius * Math.sin(angle);
        const tox_ = tox - radius * Math.cos(angle);
        const toy_ = toy - radius * Math.sin(angle);
        canvas_arrow(ctx, fromx_, fromy_, tox_, toy_);
      }

      const radius = this.radius;
      const ctx = this.ctx;

      for (let i = 0; i < this.routes.length; i++) {
        for (let j = 0; j < this.routes[i].length - 1; j++) {
          ctx.beginPath();
          canvas_arrow_radius(
            ctx,
            this.topology[this.routes[i][j]].new_x,
            this.topology[this.routes[i][j]].new_y,
            this.topology[this.routes[i][j + 1]].new_x,
            this.topology[this.routes[i][j + 1]].new_y,
            radius
          );
          ctx.stroke();
        }
      }
    }
  }
};
</script>