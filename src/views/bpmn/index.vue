<!--
 * @Author       : daiwei
 * @Date         : 2021-07-13 11:07:28
 * @LastEditors  : daiwei
 * @LastEditTime : 2021-07-13 17:43:50
 * @FilePath     : \vue-bpmn-flow\src\views\bpmn\index.vue
-->
<template>
  <div class="container">
    <div class="btn-group">
      <el-tooltip class="item" effect="dark" content="后退" placement="bottom">
        <el-button type="primary" icon="el-icon-d-arrow-left" circle @click="handleUndo"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="前进" placement="bottom">
        <el-button type="primary" icon="el-icon-d-arrow-right" circle @click="handleRedo"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="下载BPMN" placement="bottom">
        <el-button type="primary" circle icon="el-icon-download" @click="handleDownloadBpmn"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="下载SVG" placement="bottom">
        <el-button type="primary" circle icon="el-icon-download" @click="handleDownloadSVG"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="放大" placement="bottom">
        <el-button type="success" circle icon="el-icon-zoom-in" @click="handleZoomEnlarge"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩小" placement="bottom">
        <el-button type="info" circle icon="el-icon-zoom-out" @click="handleZoomNarrow"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="撤销" placement="bottom">
        <el-button type="warning" circle icon="el-icon-refresh-left"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="恢复" placement="bottom">
        <el-button type="danger" circle icon="el-icon-refresh-right"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
        <el-button type="success" circle icon="el-icon-check"></el-button>
      </el-tooltip>
    </div>
    <panel v-if='bpmnModeler' :modeler="bpmnModeler"></panel>
    <div id="cavans" class="cavans" ref='cavans' v-bind:style="{width: 100 * zonm + '%',height: 100 * zonm + '%'}"></div>
  </div>
</template>
<script>
/**操作流程的左边操作栏模块 */
import BpmnModeler from "bpmn-js/lib/Modeler";
/**流程图的预览模块 不能更改节点 */
import BpmnViewer from 'bpmn-js/lib/Viewer';
import camundaExtension from "@/utils/camunda.json";
import BpmData from "@/utils/BpmData.js";
import panel from "./components/panel"
export default {
  name: "bpmn",
  components:{
      panel,
  },
  data() {
    return {
      containerEl: null,
      bpmnModeler: null,
      fileList: [],
      bpmData: new BpmData(), //继承引用的实例对象
      zonm:1,//记录放大缩小的比例
    };
  },
  methods: {
    /**初始化 */
    create() {
    //   const bpmnXmlStr =  `<?xml version="1.0" encoding="UTF-8"?>
    //     <bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
    //       <bpmn2:process id="process1567044459787" name="流程1567044459787">
    //         <bpmn2:documentation>描述</bpmn2:documentation>
    //         <bpmn2:startEvent id="StartEvent_01ydzqe" name="开始">
    //           <bpmn2:outgoing>SequenceFlow_1qw929z</bpmn2:outgoing>
    //         </bpmn2:startEvent>
    //         <bpmn2:sequenceFlow id="SequenceFlow_1qw929z" sourceRef="StartEvent_01ydzqe" targetRef="Task_1piqdk6" />
    //         <bpmn2:userTask id="Task_1piqdk6" name="请假申请">
    //           <bpmn2:incoming>SequenceFlow_1qw929z</bpmn2:incoming>
    //           <bpmn2:outgoing>SequenceFlow_11h4o22</bpmn2:outgoing>
    //         </bpmn2:userTask>
    //         <bpmn2:exclusiveGateway id="ExclusiveGateway_0k39v3u">
    //           <bpmn2:incoming>SequenceFlow_11h4o22</bpmn2:incoming>
    //           <bpmn2:outgoing>SequenceFlow_1iu7pfe</bpmn2:outgoing>
    //           <bpmn2:outgoing>SequenceFlow_04uqww2</bpmn2:outgoing>
    //         </bpmn2:exclusiveGateway>
    //         <bpmn2:sequenceFlow id="SequenceFlow_11h4o22" sourceRef="Task_1piqdk6" targetRef="ExclusiveGateway_0k39v3u" />
    //         <bpmn2:sequenceFlow id="SequenceFlow_1iu7pfe" sourceRef="ExclusiveGateway_0k39v3u" targetRef="Task_10fqcwp" />
    //         <bpmn2:userTask id="Task_10fqcwp" name="经理审批">
    //           <bpmn2:incoming>SequenceFlow_1iu7pfe</bpmn2:incoming>
    //           <bpmn2:outgoing>SequenceFlow_1xod8nh</bpmn2:outgoing>
    //         </bpmn2:userTask>
    //         <bpmn2:sequenceFlow id="SequenceFlow_04uqww2" sourceRef="ExclusiveGateway_0k39v3u" targetRef="Task_15n23yh" />
    //         <bpmn2:userTask id="Task_15n23yh" name="总部审批">
    //           <bpmn2:incoming>SequenceFlow_04uqww2</bpmn2:incoming>
    //           <bpmn2:outgoing>SequenceFlow_0c8wrs4</bpmn2:outgoing>
    //         </bpmn2:userTask>
    //         <bpmn2:exclusiveGateway id="ExclusiveGateway_1sq33g6">
    //           <bpmn2:incoming>SequenceFlow_0c8wrs4</bpmn2:incoming>
    //           <bpmn2:incoming>SequenceFlow_1xod8nh</bpmn2:incoming>
    //           <bpmn2:outgoing>SequenceFlow_0h8za82</bpmn2:outgoing>
    //         </bpmn2:exclusiveGateway>
    //         <bpmn2:sequenceFlow id="SequenceFlow_0c8wrs4" sourceRef="Task_15n23yh" targetRef="ExclusiveGateway_1sq33g6" />
    //         <bpmn2:sequenceFlow id="SequenceFlow_1xod8nh" sourceRef="Task_10fqcwp" targetRef="ExclusiveGateway_1sq33g6" />
    //         <bpmn2:endEvent id="EndEvent_0pnmjd3">
    //           <bpmn2:incoming>SequenceFlow_0h8za82</bpmn2:incoming>
    //         </bpmn2:endEvent>
    //         <bpmn2:sequenceFlow id="SequenceFlow_0h8za82" sourceRef="ExclusiveGateway_1sq33g6" targetRef="EndEvent_0pnmjd3" />
    //       </bpmn2:process>
    //       <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    //         <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="process1567044459787">
    //           <bpmndi:BPMNShape id="StartEvent_01ydzqe_di" bpmnElement="StartEvent_01ydzqe">
    //             <dc:Bounds x="532" y="72" width="36" height="36" />
    //             <bpmndi:BPMNLabel>
    //               <dc:Bounds x="539" y="53" width="22" height="14" />
    //             </bpmndi:BPMNLabel>
    //           </bpmndi:BPMNShape>
    //           <bpmndi:BPMNEdge id="SequenceFlow_1qw929z_di" bpmnElement="SequenceFlow_1qw929z">
    //             <di:waypoint x="550" y="108" />
    //             <di:waypoint x="550" y="150" />
    //           </bpmndi:BPMNEdge>
    //           <bpmndi:BPMNShape id="UserTask_1qxjy46_di" bpmnElement="Task_1piqdk6">
    //             <dc:Bounds x="500" y="150" width="100" height="80" />
    //           </bpmndi:BPMNShape>
    //           <bpmndi:BPMNShape id="ExclusiveGateway_0k39v3u_di" bpmnElement="ExclusiveGateway_0k39v3u" isMarkerVisible="true">
    //             <dc:Bounds x="525" y="275" width="50" height="50" />
    //           </bpmndi:BPMNShape>
    //           <bpmndi:BPMNEdge id="SequenceFlow_11h4o22_di" bpmnElement="SequenceFlow_11h4o22">
    //             <di:waypoint x="550" y="230" />
    //             <di:waypoint x="550" y="275" />
    //           </bpmndi:BPMNEdge>
    //           <bpmndi:BPMNEdge id="SequenceFlow_1iu7pfe_di" bpmnElement="SequenceFlow_1iu7pfe">
    //             <di:waypoint x="575" y="300" />
    //             <di:waypoint x="680" y="300" />
    //             <di:waypoint x="680" y="380" />
    //           </bpmndi:BPMNEdge>
    //           <bpmndi:BPMNShape id="UserTask_18pwui1_di" bpmnElement="Task_10fqcwp">
    //             <dc:Bounds x="630" y="380" width="100" height="80" />
    //           </bpmndi:BPMNShape>
    //           <bpmndi:BPMNEdge id="SequenceFlow_04uqww2_di" bpmnElement="SequenceFlow_04uqww2">
    //             <di:waypoint x="525" y="300" />
    //             <di:waypoint x="430" y="300" />
    //             <di:waypoint x="430" y="380" />
    //           </bpmndi:BPMNEdge>
    //           <bpmndi:BPMNShape id="UserTask_1j0us24_di" bpmnElement="Task_15n23yh">
    //             <dc:Bounds x="380" y="380" width="100" height="80" />
    //           </bpmndi:BPMNShape>
    //           <bpmndi:BPMNShape id="ExclusiveGateway_1sq33g6_di" bpmnElement="ExclusiveGateway_1sq33g6" isMarkerVisible="true">
    //             <dc:Bounds x="525" y="515" width="50" height="50" />
    //           </bpmndi:BPMNShape>
    //           <bpmndi:BPMNEdge id="SequenceFlow_0c8wrs4_di" bpmnElement="SequenceFlow_0c8wrs4">
    //             <di:waypoint x="430" y="460" />
    //             <di:waypoint x="430" y="540" />
    //             <di:waypoint x="525" y="540" />
    //           </bpmndi:BPMNEdge>
    //           <bpmndi:BPMNEdge id="SequenceFlow_1xod8nh_di" bpmnElement="SequenceFlow_1xod8nh">
    //             <di:waypoint x="680" y="460" />
    //             <di:waypoint x="680" y="540" />
    //             <di:waypoint x="575" y="540" />
    //           </bpmndi:BPMNEdge>
    //           <bpmndi:BPMNShape id="EndEvent_0pnmjd3_di" bpmnElement="EndEvent_0pnmjd3">
    //             <dc:Bounds x="532" y="602" width="36" height="36" />
    //           </bpmndi:BPMNShape>
    //           <bpmndi:BPMNEdge id="SequenceFlow_0h8za82_di" bpmnElement="SequenceFlow_0h8za82">
    //             <di:waypoint x="550" y="565" />
    //             <di:waypoint x="550" y="602" />
    //           </bpmndi:BPMNEdge>
    //         </bpmndi:BPMNPlane>
    //       </bpmndi:BPMNDiagram>
    //     </bpmn2:definitions>
    //   `;
      const bpmnXmlStr = '';
      // 将字符串转换成图显示出来
      if (bpmnXmlStr) {
        this.bpmnModeler.importXML(bpmnXmlStr, err => {
          if (err) {
            console.error(err);
          }else{
            this.adjustPalette();
            /**获取所有的流程图结点信息 */
          }
        });
      }else{
        this.adjustPalette();
        this.bpmnModeler.createDiagram(() => {
            this.bpmnModeler.get("cavans").zoom("fit-viewport");
        });
      } 
    },
    /**调整左侧工具栏排版*/
    adjustPalette() {
      try {
        // 获取 bpmn 设计器实例
        const cavans = this.$refs.cavans;
        const djsPalette = cavans.children[0].children[1].children[4];
        const djsPalStyle = {
          width: "130px",
          padding: "5px",
          background: "white",
          left: "20px",
          borderRadius: 0
        };
        for (var key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key];
        }
        const palette = djsPalette.children[0];
        const allGroups = palette.children;
        allGroups[0].style["display"] = "none";
        // 修改控件样式
        for (var gKey in allGroups) {
          const group = allGroups[gKey];
          for (var cKey in group.children) {
            const control = group.children[cKey];
            const controlStyle = {
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              padding: "5px"
            };
            if (
              control.className &&
              control.dataset &&
              control.className.indexOf("entry") !== -1
            ) {
              const controlProps = this.bpmData.getControl(
                control.dataset.action
              );
              control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${
                controlProps["title"]
              }</div>`;
              for (var csKey in controlStyle) {
                control.style[csKey] = controlStyle[csKey];
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    /**后退方法 */
    handleUndo () {
        /**获取节点的控制板 */
        this.bpmnModeler.get('commandStack').undo()
    },
    /**前进 */
    handleRedo () {
        this.bpmnModeler.get('commandStack').redo();
    },
    /**导入方法bpmn 得需要elemen上传组件 */
    handleOnchangeFile (file) {
        const reader = new FileReader()
        let data = ''
        reader.readAsText(file.raw)
        reader.onload = (event) => {
          data = event.target.result
          this.bpmnModeler.importXML(data, (err) => {
            if (err) {
              this.$message.info('导入失败')
            } else {
              this.$message.success('导入成功')
            }
          })
        }
    },
    /**下载bpmn */
    handleDownloadBpmn () {
        this.bpmnModeler.saveXML({format: true}, (err, data) => {
            const dataTrack = 'bpmn'
            const a = document.createElement('a')
            const name = `diagram.${dataTrack}`
            a.setAttribute(
                'href',
                `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`
            )
            a.setAttribute('target', '_blank')
            a.setAttribute('dataTrack', `diagram:download-${dataTrack}`)
            a.setAttribute('download', name)
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        })
    },
    /**下载SVG */
    handleDownloadSVG(){
        this.bpmnModeler.saveSVG((err,data)=>{
            const dataTrack = 'svg'
            const a = document.createElement('a')
            const name = `diagram.${dataTrack}`
            a.setAttribute(
                'href',
                `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`
            )
            a.setAttribute('target', '_blank')
            a.setAttribute('dataTrack', `diagram:download-${dataTrack}`)
            a.setAttribute('download', name)
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        })
    },
    /**放大方法 */
    handleZoomEnlarge(){
        this.zonm = this.zonm*2
        // this.$nextTick(() => {
        //   this.bpmnModeler.get('canvas').zoom('fit-viewport');
        // });
    },
    /**缩小方法 */
    handleZoomNarrow(){
        this.zonm = this.zonm/2
        // this.$nextTick(() => {
        //   this.bpmnModeler.get('canvas').zoom('fit-viewport');
        // });
    },
  },
  mounted() {
    /**获取操作dome */
    this.containerEl = document.getElementById("cavans");
    /**判断是否有缓存存在 存在 进入页面前先清除一遍 */
    // this.bpmnModeler && this.bpmnModeler.destroy();
    /**生成bpmn对象 */
    this.bpmnModeler = new BpmnModeler({
      container: this.containerEl,
    //   moddleExtensions: { camunda: camundaExtension }
    });
    this.create();
  }
};
</script>
<style  scoped>
.container {
  position: relative;
  width: 100%;
  height: calc(100% - 78px);
  overflow: hidden;
}
.cavans {
  width: 100%;
  height: calc(100% - 42px);
}
.btn-group {
  height: 42px;
  display: flex;
  align-items: center;
  padding-left: 20px;
}
.el-button.is-circle {
  padding: 10px;
}
</style>