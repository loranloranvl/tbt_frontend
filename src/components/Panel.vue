<template>
  <div id="panel">
    <h3>导航面板</h3>
    <div id="cars-wrapper" class="w3-card w3-display-container w3-hide-small">
      <div id="cars-label" class="w3-display-middle" v-if="!vehicle_capacities.length">车库</div>
      <div id="cars">
        <div class="car" v-for="(v, i) in vehicle_capacities" v-bind:key="i">
          <i class="fa fa-minus-circle" @click="remove_car(i)"></i>
          <i class="fa fa-truck" :style="'color:'+colors[i % colors.length]"></i>
          <div class="weight">{{v}}kg</div>
        </div>
        <div class="car-add" id="ca1" v-if="!vehicle_capacities.length" @click="add_car">
          <i class="fa fa-plus-circle"></i>
        </div>
        <div class="car-add" id="ca2" v-else @click="add_car">
          <i class="fa fa-plus-circle"></i>
        </div>
      </div>
    </div>
    <canvas id="map" ref="map" class="w3-card w3-hide-small" width="2000" height="1000"></canvas>
    <div id="note" class="w3-card w3-hide-medium w3-hide-large">请在电脑上使用导航面板</div>
    <div id="btns">
      <button class="w3-button w3-black w3-round-large w3-hide-small" @click="add_point">新增配送点</button>
      <button class="w3-button w3-black w3-round-large w3-hide-small" @click="delete_point">删除配送点</button>
      <br />
      <button class="w3-button w3-black w3-round-large w3-hide-small" @click="choose_preset">获取预设示例</button>
      <button class="w3-button w3-black w3-round-large w3-hide-small" @click="submit">计算导航路线</button>
    </div>
  </div>
</template>

<script>
import "../assets/Panel.less";
import Swal from "../SwalInit";
import SwalRaw from "sweetalert2";

const colors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf"
];
const radius = 50;

export default {
  name: "Panel",
  data() {
    return {
      ctx: null,
      mode: "",
      colors: colors,
      cqm: [
        // capacity-quantity mapping of cars
        // { c: 15, q: 2 }
        // { c: 16, q: 2 }
      ],
      loc: [
        // { name: "P", x: 456, y: 320, demand: 0 }, // 0
        // { name: "A", x: 228, y: 0, demand: 0 },
        // { name: "B", x: 912, y: 0, demand: 1 },
        // { name: "C", x: 0, y: 80, demand: 2 },
        // { name: "D", x: 114, y: 80, demand: 4 },
        // { name: "E", x: 570, y: 160, demand: 2 },
        // { name: "F", x: 798, y: 160, demand: 4 },
        // { name: "G", x: 342, y: 240, demand: 8 },
        // { name: "H", x: 684, y: 240, demand: 8 },
        // { name: "I", x: 570, y: 400, demand: 1 },
        // { name: "J", x: 912, y: 400, demand: 2 },
        // { name: "K", x: 114, y: 480, demand: 1 },
        // { name: "L", x: 228, y: 480, demand: 2 },
        // { name: "M", x: 342, y: 560, demand: 4 },
        // { name: "N", x: 684, y: 560, demand: 4 },
        // { name: "O", x: 0, y: 640, demand: 8 },
        // { name: "Q", x: 798, y: 640, demand: 8 } // 16
      ],
      vehicle_capacities: [],
      routes: [
        [0, 14, 16, 10, 0],
        [0, 9, 8, 6, 2, 0],
        [1, 11, 15, 13, 12, 1],
        [1, 4, 3, 7, 5, 1]
      ],
      demands: [],
      distance_matrix: [],
      num_vehicles: 0
    };
  },
  mounted: function() {
    const vm = this;
    this.draw_points();
    // this.choose_preset();
    // this.axios.get(`/preset/?id=0&case=1`).then(response => {
    //   vm.set_preset(response.data);
    //   return response;
    // });
  },
  methods: {
    draw_routes: function() {
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

      const ctx = this.ctx;

      for (let i = 0; i < this.routes.length; i++) {
        for (let j = 0; j < this.routes[i].length - 1; j++) {
          ctx.beginPath();
          canvas_arrow_radius(
            ctx,
            this.loc[this.routes[i][j]].new_x,
            this.loc[this.routes[i][j]].new_y,
            this.loc[this.routes[i][j + 1]].new_x,
            this.loc[this.routes[i][j + 1]].new_y,
            radius + 10
          );
          ctx.strokeStyle = colors[i];
          ctx.stroke();
          ctx.strokeStyle = "#000000";
        }
      }
    },
    draw_points: function() {
      const canvas = this.$refs.map;
      const ctx = canvas.getContext("2d");
      this.ctx = ctx;
      ctx.lineWidth = 4;

      const cw = canvas.width;
      const ch = canvas.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const max_y = Math.max.apply(
        Math,
        this.loc.map(function(o) {
          return o.y;
        })
      );

      const max_x = Math.max.apply(
        Math,
        this.loc.map(function(o) {
          return o.x;
        })
      );

      ctx.font = "50px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < this.loc.length; i++) {
        const x = ((cw - 2 * radius) * this.loc[i].x) / max_x + radius;
        const y = ((ch - 2 * radius) * this.loc[i].y) / max_y + radius;
        this.loc[i].new_x = x;
        this.loc[i].new_y = y;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        if (i > 0) ctx.fillText(this.loc[i].name, x, y);
        else ctx.strokeText(this.loc[i].name, x, y);
        if (i && y < 900) ctx.fillText(this.demands[i] + "kg", x, y + 82);
        if (i && y >= 900) ctx.fillText(this.demands[i] + "kg", x, y - 82);
      }
    },
    choose_preset: function() {
      const set_preset = this.set_preset;
      Swal.fire({
        title: "选择预设场景",
        input: "select",
        inputOptions: {
          1: "预设一"
          // 2: "预设二",
          // 3: "预设三"
          // 4: "预设四"
        },

        preConfirm: id => {
          return this.axios.get(`/preset/?id=0&case=${id}`).then(response => {
            set_preset(response.data);
            return response;
          });
        }
      });
    },
    set_preset: function(data) {
      this.demands = data.demands;
      this.distance_matrix = data.distance_matrix;
      this.loc = data.loc;
      this.mode = data.mode;
      this.num_vehicles = data.num_vehicles;
      this.vehicle_capacities = data.vehicle_capacities;
      this.draw_points();
    },
    add_car: function() {
      const vm = this;
      Swal.fire({
        title: "输入车辆载重（kg）",
        input: "text",
        preConfirm: capa => {
          vm.vehicle_capacities.push(parseInt(capa));
        }
      });
    },
    remove_car: function(i) {
      this.vehicle_capacities.splice(i, 1);
    },
    add_point: function() {
      const vm = this;
      Swal.fire({
        title: "新增配送点",
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="标签">' +
          '<input id="swal-input2" class="swal2-input" placeholder="货物需求（不填表示这是个配送中心）">' +
          '<input id="swal-input3" class="swal2-input" placeholder="横坐标">' +
          '<input id="swal-input4" class="swal2-input" placeholder="纵坐标">',
        footer: "新增的配送中心会使旧配送中心变成配送点",
        preConfirm: function() {
          let name = document.getElementById("swal-input1").value;
          let demand = document.getElementById("swal-input2").value;
          let x = document.getElementById("swal-input3").value;
          let y = document.getElementById("swal-input4").value;
          if (demand === "") {
            vm.loc.splice(0, 0, {
              name: name,
              x: x,
              y: y,
              demand: 0
            });
            vm.demands.splice(0, 0, 0);
          } else {
            demand = parseInt(demand);
            vm.loc.push({
              name: name,
              x: x,
              y: y,
              demand: demand
            });
            vm.demands.push(demand);
            // console.log(vm.demands);
          }
          vm.draw_points();
        }
      });
    },
    delete_point: function() {
      const vm = this;
      const options = {};
      for (let i = 0; i < this.loc.length; i++) {
        options[i] = this.loc[i].name;
      }
      Swal.fire({
        title: "选择要删除的配送点",
        input: "select",
        inputOptions: options,
        preConfirm: i => {
          vm.loc.splice(i, 1);
          vm.demands.splice(i, 1);
          vm.draw_points();
        }
      });
    },
    submit: function() {
      const vm = this;
      const data = {
        mode: vm.mode,
        distance_matrix: vm.distance_matrix,
        num_vehicles: vm.num_vehicles,
        vehicle_capacities: vm.vehicle_capacities,
        demands: vm.demands,
        dep_starts: [0, 0, 0, 0],
        dep_ends: [0, 0, 0, 0]
      };
      // this.axios.post("/routes", data).then(response => {
      //   vm.routes = response.data.routes;
      //   vm.draw_routes();
      //   return response;
      // });

      SwalRaw.fire({
        title: "正在求解",
        onBeforeOpen: () => {
          Swal.showLoading();
          this.axios.post("/routes", data).then(response => {
            vm.routes = response.data.routes;
            vm.draw_routes();
            SwalRaw.close();
          });
        }
      });
    }
  }
};
</script>