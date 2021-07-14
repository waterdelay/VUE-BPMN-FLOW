<!--
 * @Author       : daiwei
 * @Date         : 2021-07-13 17:18:14
 * @LastEditors  : daiwei
 * @LastEditTime : 2021-07-14 21:03:37
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
        <el-form label-width="80px" :model="flowObj" v-if="elementNode.nodeType == 'Process' || !elementNode.nodeType">
          <el-form-item label="流程id:">
            <el-input v-model="flowObj.id" placeholder="请输入流程id" @input="processIdChange"></el-input>
          </el-form-item>
           <el-form-item label="流程名称:">
            <el-input v-model="flowObj.label" placeholder="请输入流程名称" @input="processNameChange"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-width="80px" :model="form" v-else>
          <el-form-item label="节点key:">
            <el-input v-model="form.nodeKey" placeholder="请输入节点key"></el-input>
          </el-form-item>
          <el-form-item label="节点名称:">
            <el-input v-model="form.nodeName" placeholder="请输入节点名称" @input="nameChange"></el-input>
          </el-form-item>
          <el-form-item label="节点颜色:" style="text-align: left" class="item-color">
            <el-color-picker v-model="form.nodeColor" @active-change="colorChange"></el-color-picker>
          </el-form-item>
          <el-form-item label="描述:">
            <el-input v-model="form.nodeTextarea" type="textarea" :rows="2" placeholder="请输入描述" @input="nodeTextareaChange"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item v-if="elementNode.nodeType == 'Task'">
        <template slot="title">
         <i class="header-icon el-icon-user"></i>审核者
        </template>
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
      </el-collapse-item>
      <el-collapse-item v-if="elementNode.nodeType == 'SequenceFlow'">
        <template slot="title">
         <i class="header-icon el-icon-share"></i>流转条件
        </template>
        <el-form label-width="80px" :model="form">
           <el-form-item label="表达式:">
            <el-input v-model="form.conditionExpression" placeholder="请输入表达式" @input="conditionExpressionChange"></el-input>
          </el-form-item>
        </el-form>
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
      elementNode: {}, //记录当前的点击的节点对象   如果有流程图 默认选中流程图的第一个开始节点
      form: {
        nodeKey:'',//节点id
        nodeName:'',//节点名称
        nodeColor:null,//节点颜色
        nodeTextarea:'',//节点描述
        conditionExpression:'',//表达式
      },
      flowObj:{
        id:'25656656555',//应该是接过来的id  这个id可以改 但是流程图里面的id不能进行修改 得后台设置
        label:'xxxx',
      },
      currentNode:'',/**记录当前节点的id信息 */
    };
  },
  mounted() {
      this.handleModeler();
      this.handleViews();
  },
  methods: {
    /**监听画板 */
    handleViews(){
      this.modeler.on("element.click", e => {
        let {element} = e;
        if(!e || element.type !== 'bpmn:Process'){
          return false;
        }else{
          this.elementNode = this.judgeNodeType(e.element);
          this.getProcessInfo()
          console.log(e)
        }
      })
    },
    /**调用数据获取流程基础信息 */
    getProcessInfo(){
      for(let key in this.flowObj){
        if(key ==='id' || key ==='lebal'){
          this.flowObj[key] = this.elementNode[key] || ''
        }else{
          continue
        }
      }
    },
    /**事件监听节点元素 */
    handleModeler() {
      /**给节点注册点击监听事件 */
      let eventBus = this.modeler.get('eventBus');
      // 注册节点事件，eventTypes中可以写多个事件
      let eventTypes = ['element.click'];
      eventTypes.forEach((eventType) => {
        eventBus.on(eventType, (e) => {
          let {element} = e;
          if (!element.parent) return;
          if (!e || element.type === 'bpmn:Process') {
            return false;
          } else {
            if (eventType === 'element.click') {
              let businessObject = element.businessObject || element;
              this.elementNode = this.judgeNodeType(e.element);
              console.log(businessObject,'9999')
              this.recordCurrentNode(businessObject)
              /**调用点击当前节点的方法 */
            }
          }
        });
      });
    },
    /**调用节点方法 去给当前节点赋值一个nodeType */
    judgeNodeType(e){
      switch (e.type) {
        case 'bpmn:StartEvent'://开始
          e.nodeType = 'StartEvent';
          break;
        case 'bpmn:ExclusiveGateway'://网关
          e.nodeType = 'ExclusiveGateway';
          break;
        case 'bpmn:IntermediateThrowEvent'://中间
          e.nodeType = 'IntermediateThrowEvent';
          break;
        case 'bpmn:EndEvent'://结束
          e.nodeType = 'EndEvent';
          break;
        case 'bpmn:Task'://任务框
          e.nodeType = 'Task';
          break;
        case 'bpmn:SubProcess'://子流程
          e.nodeType = 'SubProcess';
          break;
        case 'bpmn:DataObjectReference'://数据对象
          e.nodeType = 'DataObjectReference';
          break;
        case 'bpmn:DataStoreReference'://数据存储
          e.nodeType = 'DataStoreReference';
          break;
        case 'bpmn:Participant'://扩展流程
          e.nodeType = 'Participant';
          break;
        case 'bpmn:Group'://组别
          e.nodeType = 'Group';
          break;
        case 'bpmn:SequenceFlow'://线
          e.nodeType = 'SequenceFlow';
          break;
        case 'bpmn:Process'://流程图外面
          e.nodeType = 'Process';
          break; 
        default:
          break;
      }
      return e
    },
    /**调用记录当前节点id数据 */
    recordCurrentNode(businessObject){
      /**给对应的当前form赋值 */
      this.form.nodeKey = businessObject.id;
      this.form.nodeName = businessObject.name || '';
      for(let key in this.form){
        if(key == 'nodeKey' || key == 'nodeName'){
          continue
        }else if(key == 'nodeColor'){
          this.form[key] = businessObject.$attrs.color || null
        }else{
          this.form[key] = businessObject.$attrs[key] || ''
        }
      }
      this.currentNode = businessObject.id;
      this.flowObj[this.currentNode] = this.form;
    },
    /**修改流程名称的时候的变化 */
    processIdChange(id){
      this.updateProperties({id:id})
    },
    /**修改流程名称 */
    processNameChange(val){
      this.updateProperties({name:val})
    },
    // 属性面板名称，更新回流程节点
    nameChange(name) {
      const modeling = this.modeler.get("modeling");
      modeling.updateLabel(this.elementNode, name);
    },
    /** 设置备注 */
    nodeTextareaChange(val){
      this.updateProperties({nodeTextarea:val})
    },
    // 属性面板颜色，更新回流程节点
    colorChange(color) {
      const modeling = this.modeler.get("modeling");
      modeling.setColor(this.elementNode, {
        fill: null,
        stroke: color
      });
      modeling.updateProperties(this.elementNode, { color: color });
    },
    // 在这里我们封装一个通用的更新节点属性的方法
    updateProperties(properties) {
      const modeling = this.modeler.get("modeling");
      modeling.updateProperties(this.elementNode, properties);
    },
    /**定义流程线路条件 添加conditionExpression */
    conditionExpressionChange(val){
      const modeling = this.modeler.get("modeling");
      const moddle = this.modeler._moddle;
      let conditionExpression = moddle.create("bpmn:FormalExpression",{
        body:val
      })
      modeling.updateProperties(this.elementNode,{
        conditionExpression
      })
    },
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
