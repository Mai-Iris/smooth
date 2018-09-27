<template>
    <div class="content">
        <div class="top" ref="msgShowBox">
           <div class="top-left">
                <scrollBar ref="topLeftBox" 
                    @listenScroll="listenScroll" 
                    @pullDownScroll="leftPullDownScrollSync"
                    :thumbMinSize="0"
                    :overScroll="true"
                    keep-bottom='bottom'>
                <ul>
                    <li v-for="(item,index) in 50" :key="index">
                        {{item}}
                    </li>
                </ul>
            </scrollBar>
           </div>
           <div class="top-right">
            <scrollBar ref="topRightBox" 
                @listenScroll="listenScroll" 
                keep-top="top">
                <ul>
                    <li v-for="(item,index) in 50" :key="index">
                        {{item}}
                    </li>
                </ul>
            </scrollBar>
           </div>
        </div>
        <div class="bottom" ref="msgSendBox">
            <div class="drag-line" @mousedown="handleDragPosMove"></div>
            <button @click="setPosition">设置</button>
        </div>
    </div>
</template>

<script>
import scrollBar from "./ScrollBar";
export default {
  name: "Demo",
  data: function() {
    return {
      setPosY: 0,
      test: ""
    };
  },
  mounted() {},
  methods: {
    handleDragPosMove(e) {
      // 获取
      let msgSendBox = this.$refs.msgSendBox,
          msgShowBox = this.$refs.msgShowBox,
          scroll = getScrollOffsets(),
          startY = e.clientY + scroll.y,
          _startY = parseInt(startY);
          document.addEventListener("mousemove", moveHandler, true);
          document.addEventListener("mouseup", upHandler, true);
        if (event.stopPropagation) event.stopPropagation();
      //标准模型
      else event.cancelBubble = true;
      //现在阻止任何默认操作
      if (event.preventDefault) event.preventDefault();
      else event.returnValue = false;
      function moveHandler(e) {
        if (!e) e = window.event; //ie事件模型
        let startY = parseInt(e.clientY);
        let deltaY = startY - _startY;
        if (_startY > startY) {
          if (msgSendBox.style.height >= "480px") {
            return false;
          } else {
            let nowHeight = msgSendBox.offsetHeight - deltaY;
            msgSendBox.style.height = nowHeight + "px";
            msgShowBox.setAttribute(
              "style",
              "height:calc(100% - " + nowHeight + "px" + ")"
            );
          }
        } else {
          if (msgSendBox.style.height <= "140px") {
            return false;
          } else {
            let nowHeight = msgSendBox.offsetHeight - deltaY;
            msgSendBox.style.height = nowHeight + "px";
            msgShowBox.setAttribute(
              "style",
              "height:calc(100% - " + nowHeight + "px" + ")"
            );
          }
        }
        _startY = startY;
        if (msgSendBox.style.height > "480px") {
          msgSendBox.style.height = "480px";
          msgShowBox.setAttribute("style", "height:calc(100% - 480px)");
        } else if (msgSendBox.style.height < "140px") {
          msgSendBox.style.height = "140px";
          msgShowBox.setAttribute("style", "height:calc(100% - 140px)");
        }
        if (e.stopPropagation) e.stopPropagation();
        //标准模型
        else e.cancelBubble = true;
      }
      function upHandler(e) {
        if (!e) e = window.event; //ie事件模型
        //注销捕获事件处理程序
        document.removeEventListener("mousemove", moveHandler, true);
        document.removeEventListener("mouseup", upHandler, true);
        if (e.stopPropagation) e.stopPropagation();
        //标准模型
        else e.cancelBubble = true;
      }
      function getScrollOffsets(w) {
        // 使用指定的窗口，如果不带参数则使用当前窗口
        w = w || window;
        // 对标准模式下的IE（或任何浏览器）
        var d = w.document;
        if (document.compatMode == "CSS1Compat")
          return {
            x: d.documentElement.scrollLeft,
            y: d.documentElement.scrollTop
          };
      }
    },
    setPosition() {
      let maxY = this.$refs.topLeftBox.limit.y;
      this.$refs.topLeftBox.scrollTo(0, -40, 300);
    },
    listenScroll(pos) {},
    leftPullDownScrollSync(pos) {
      // console.log(pos)
    }
  },
  components: { scrollBar }
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.content {
  width: 800px;
  height: 800px;
  border: 1px solid red;
  margin: 0 auto;
}
.top {
  width: 100%;
  height: calc(100% - 140px);
  background: peru;
  overflow: hidden;
}
.bottom {
  width: 100%;
  height: 140px;
  border-top: 1px solid #000;
  position: relative;
  background: palevioletred;
}
.top .top-left,
.top .top-right {
  height: 100%;
  width: 50%;
  float: left;
}
.top li {
  list-style: none;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.drag-line {
  width: 100%;
  height: 4px;
  background: blue;
  position: absolute;
  left: 0;
  top: 0;
  cursor: n-resize;
}
</style>