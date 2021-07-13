<!--
 * @Author       : daiwei
 * @Date         : 2021-07-13 17:18:14
 * @LastEditors  : daiwei
 * @LastEditTime : 2021-07-13 20:31:34
 * @FilePath     : \VUE-BPMN-FLOW\src\views\bpmn\components\panel\index.vue
-->
<template>
  <div class="panel">
    <el-card shadow="hover">
      <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
         <i class="header-icon el-icon-setting"></i>基本设置
        </template>
        <el-form label-width="80px" :model="form.setting">
          <el-form-item label="节点key:">
            <el-input v-model="form.setting.nodeKey" placeholder="请输入节点key"></el-input>
          </el-form-item>
          <el-form-item label="节点名称:">
            <el-input v-model="form.setting.nodeName" placeholder="请输入节点名称"></el-input>
          </el-form-item>
          <el-form-item label="节点颜色:" style="text-align: left" class="item-color">
            <el-color-picker v-model="form.setting.nodeColor"></el-color-picker>
          </el-form-item>
          <el-form-item label="描述:">
            <el-input v-model="form.setting.nodeTextarea" type="textarea" :rows="2" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item>
        <template slot="title">
         <i class="header-icon el-icon-user"></i>审核者
        </template>
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
      <el-collapse-item title="效率 Efficiency">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
      </el-collapse-item>
      <el-collapse-item title="可控 Controllability">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
      </el-collapse-item>
    </el-collapse>
    </el-card>
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
      form: {
        setting:{//基本设置
          nodeKey:'',//节点id
          nodeName:'',//节点名称
          nodeColor:null,//节点颜色
          nodeTextarea:'',//节点描述
        },
      }
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
  z-index: 99;
}
.el-card {
  width: 100%;
  height: 100%;
}
.el-collapse /deep/ .el-collapse-item__content{
  padding-bottom: 10px;
}
.el-input /deep/ .el-input__inner{
  height: 32px;
  line-height: 32px;
}
.el-form /deep/ .el-form-item{
  margin-bottom: 18px;
}
.item-color /deep/ .el-form-item__content{
  height:40px;
  display: flex;
  align-items: center;
}
.el-color-picker{
  height: 32px;
}
.el-color-picker /deep/ .el-color-picker__trigger{
  height: 32px;
  width: 32px;
}
</style>
