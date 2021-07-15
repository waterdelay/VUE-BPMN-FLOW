<!--
 * @Author       : daiwei
 * @Date         : 2021-07-13 11:07:28
 * @LastEditors  : daiwei
 * @LastEditTime : 2021-07-15 18:39:54
 * @FilePath     : \VUE-BPMN-FLOW\src\views\bpmn\index.vue
-->
<template>
  <div class="container">
    <div class="btn-group">
      <el-tooltip class="item" effect="dark" content="导入" placement="bottom">
        <el-upload
          style="display: inline-block;margin-right: 10px;"
          :file-list="fileList"
          class="upload-demo"
          action
          :auto-upload="false"
          :show-file-list="false"
          :http-request="httpRequest"
          :on-change="handleOnchangeFile"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
        >
          <el-button type="primary" circle icon="el-icon-upload"></el-button>
        </el-upload>
      </el-tooltip>
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
        <el-button type="success" circle icon="el-icon-check" @click="saveBtn"></el-button>
      </el-tooltip>
    </div>
    <panel v-if="bpmnModeler" :modeler="bpmnModeler"></panel>
    <div
      id="cavans"
      class="cavans"
      ref="cavans"
      v-bind:style="{width: 100 * zonm + '%',height: 100 * zonm + '%'}"
    ></div>
    <div id="properties-panel">
      
    </div>
  </div>
</template>
<script>
/**操作流程的左边操作栏模块 */
import BpmnModeler from "bpmn-js/lib/Modeler";
/**流程图的预览模块 不能更改节点 */
import BpmnViewer from "bpmn-js/lib/Viewer";
import camundaExtension from "@/utils/camunda.json";
import BpmData from "@/utils/BpmData.js";
const panel = () => import("./components/panel");
export default {
  name: "bpmn",
  components: {
    panel
  },
  data() {
    return {
      containerEl: null,
      bpmnModeler: null,
      fileList: [],
      bpmData: new BpmData(), //继承引用的实例对象
      zonm: 1, //记录放大缩小的比例
      form: {} //这个form应该是从panel里面配置好的数据
    };
  },
  methods: {
    /**初始化 */
    create() {
      const bpmnXmlStr = "";
      // 将字符串转换成图显示出来
      if (bpmnXmlStr) {
        this.bpmnModeler.importXML(bpmnXmlStr, err => {
          if (err) {
            console.error(err);
          } else {
            this.adjustPalette();
            /**获取所有的流程图结点信息 */
          }
        });
      } else {
        this.adjustPalette();
        this.bpmnModeler.createDiagram(() => {
          this.bpmnModeler.get("cavans").zoom("fit-viewport");
        });
      }
      /**监听元素的事件 */
      this.addEventBusListener();
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
    /**监听元素方法 */
    addEventBusListener() {
      let eventBus = this.bpmnModeler.get("eventBus");
      // 注册节点事件，eventTypes中可以写多个事件
      let eventTypes = ["element.click"];
      eventTypes.forEach(eventType => {
        eventBus.on(eventType, e => {
          let { element } = e;
          if (!element.parent) return;
          if (!e || element.type === "bpmn:Process") {
            return false;
          } else {
            if (eventType === "element.click") {
              let businessObject = element.businessObject || element;
            }
          }
        });
      });
    },
    /**后退方法 */
    handleUndo() {
      /**获取节点的控制板 */
      this.bpmnModeler.get("commandStack").undo();
    },
    /**前进 */
    handleRedo() {
      this.bpmnModeler.get("commandStack").redo();
    },
    /**移除 */
    handleRemove(file) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.name === this.fileList[i].name) {
          this.fileList.splice(i, 1);
        }
      }
    },
    /**移除前 */
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    httpRequest(file) {},
    /**导入方法bpmn 得需要elemen上传组件 */
    handleOnchangeFile(file) {
      const reader = new FileReader();
      let data = "";
      reader.readAsText(file.raw);
      reader.onload = event => {
        data = event.target.result;
        this.bpmnModeler.importXML(data, err => {
          if (err) {
            this.$message.info("导入失败");
          } else {
            this.$message.success("导入成功");
          }
        });
      };
    },
    /**下载bpmn */
    handleDownloadBpmn() {
      this.bpmnModeler.saveXML({ format: true }, (err, data) => {
        const dataTrack = "bpmn";
        const a = document.createElement("a");
        const name = `diagram.${dataTrack}`;
        a.setAttribute(
          "href",
          `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(
            data
          )}`
        );
        a.setAttribute("target", "_blank");
        a.setAttribute("dataTrack", `diagram:download-${dataTrack}`);
        a.setAttribute("download", name);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    },
    /**下载SVG */
    handleDownloadSVG() {
      this.bpmnModeler.saveSVG((err, data) => {
        const dataTrack = "svg";
        const a = document.createElement("a");
        const name = `diagram.${dataTrack}`;
        a.setAttribute(
          "href",
          `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(
            data
          )}`
        );
        a.setAttribute("target", "_blank");
        a.setAttribute("dataTrack", `diagram:download-${dataTrack}`);
        a.setAttribute("download", name);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    },
    /**放大方法 */
    handleZoomEnlarge() {
      this.zonm = this.zonm * 2;
      // this.$nextTick(() => {
      //   this.bpmnModeler.get('canvas').zoom('fit-viewport');
      // });
    },
    /**缩小方法 */
    handleZoomNarrow() {
      this.zonm = this.zonm / 2;
      // this.$nextTick(() => {
      //   this.bpmnModeler.get('canvas').zoom('fit-viewport');
      // });
    },
    /**点击保存按钮 */
    saveBtn() {
      if(!this.bpmnModeler._definitions.rootElements[0].isExecutable){
        this.bpmnModeler._definitions.rootElements[0].isExecutable = true
      }
      console.log(this.bpmnModeler._definitions.rootElements[0].isExecutable,'5555');
      this.saveDiagram(function(err, xml) {
        console.log(xml); // 这里获取到的就是最新的xml信息
      });
    },
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml);
      });
    }
  },
  mounted() {
    /**获取操作dome */
    this.containerEl = document.getElementById("cavans");
    /**判断是否有缓存存在 存在 进入页面前先清除一遍 */
    // this.bpmnModeler && this.bpmnModeler.destroy();
    /**生成bpmn对象 */
    this.bpmnModeler = new BpmnModeler({
      container: this.containerEl,
      propertiesPanel: { // 添加控制板
          parent: '#properties-panel'
      },
      //   moddleExtensions: { camunda: camundaExtension }
    });
    this.BpmnViewer = new BpmnViewer({
      container: this.containerEl
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