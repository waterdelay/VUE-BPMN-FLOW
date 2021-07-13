<!--
 * @Author       : daiwei
 * @Date         : 2021-07-13 17:18:14
 * @LastEditors  : daiwei
 * @LastEditTime : 2021-07-13 17:58:08
 * @FilePath     : \vue-bpmn-flow\src\views\bpmn\components\panel\index.vue
-->
<template>
  <div class="panel">
    <el-card shadow="hover"></el-card>
  </div>
</template>
<script>
export default {
  name: "panel",
  props: {
    modeler: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      element: {}, //当前的对象
      form: {}
    };
  },
  mounted() {
      this.handleModeler();
  },
  methods: {
    handleModeler() {
      // 监听节点选择变化
      this.modeler.on("selection.changed", e => {
        const element = e.newSelection[0];
        this.element = element;
        console.log(this.element);
        if (!element) return;
        this.form = {
          ...element.businessObject,
          ...element.businessObject.$attrs
        };
        if (this.form.userType === "candidateUsers") {
          this.form["candidateUsers"] =
            this.form["candidateUsers"].split(",") || [];
        }
      });
      //  监听节点属性变化
      this.modeler.on("element.changed", e => {
        const { element } = e;
        if (!element) return;
        //  新增节点需要更新回属性面板
        if (element.id === this.form.id) {
          this.form.name = element.businessObject.name;
          this.form = { ...this.form };
        }
      });
    }
  }
};
</script>
<style scoped>
.panel {
  position: absolute;
  width: 300px;
  height: calc(100% - 70px);
  right: 0;
  padding: 10px;
  z-index: 99999;
}
.el-card {
  width: 100%;
  height: 100%;
}
</style>
