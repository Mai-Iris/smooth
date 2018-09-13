<template>
  <div class="scroll-wrapper" ref="wrapper">
    <slot>
    </slot>
  </div>

</template>

<script>
  import Scrollbar from 'smooth-scrollbar';
  import OverscrollPlugin from "smooth-scrollbar/plugins/overscroll";

  Scrollbar.use(OverscrollPlugin);
  export default {
    name: 'SmScroll',
    props: {
      // scroll配置
      // 滚动速度
      speed: {
        type: Number,
        default: 1
      },
      // 减少阻尼，在(0,1)之间的浮动值，值越低，滚动就越平滑。
      damping: {
        type: Number,
        default: 0.1
      },
      // 滚动条拇指的最小尺寸。
      thumbMinSize: {
        type: Number,
        default: 20
      },
      // 同步或异步执行侦听器。
      syncCallbacks: {
        type: Boolean,
        default: false
      },
      // 渲染滚动的整数像素，设置为true以提高性能。
      renderByPixels: {
        type: Boolean,
        default: false
      },
      //滚动时候，是否保持滚动条跟踪可见
      alwaysShowTracks: {
        type: Boolean,
        default: true
      },
      //“自动”是否允许上滚动内容在当前滚动条到达边缘时继续滚动。当设置为“auto”时，它将在嵌套的滚动条上启用，并在一级滚动条上禁用。
      continuousScrolling: {
        type: [String, Boolean],
        default: "auto"
      },
      wheelEventTarget: {
        type: EventTarget,
        default: null
      },
      //overScroll配置
      //与阻尼相同，但用于过度滚动。
      overscrollDamping: {
        type: Number,
        default: 0.2
      },
      // 过渡的开关或者效果
      overscrollEffect: {
        type: [Boolean, String],
        default: "bounce"
      },
      // 过渡的颜色等，只有在glow时候有作用
      overscrollEffectColor: {
        type: String,
        default: '#87ceeb'
      },
      // 自定义配置
      // 过渡滚动开关
      overEnable: {
        type: Boolean,
        default: false
      },
      // 监听的数据
      listenData: {
        type: null,
        default: function () {
          return []
        }
      },
      // 初始化默认位置
      initPos:{
        type:String,
        default:'top'
      }
    },
    data: function () {
      return {
        initLimit:{}
      }
    },
    watch: {
      listenData(nVal) {
        if (nVal) {
          setTimeout(() => {
            this.update(true)
          }, 20)
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this.initScroll();
        this._initPos()
      }, 20)
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) return;
        // overcroll配置
        let initOverScrollOptions = {
          damping: this.overscrollDamping,
          effect: this.overscrollEffect,
          glowColor: this.overscrollEffectColor,
          maxOverscroll: 150,
          onScroll: this.overScollCallBack()
        };
        // 初始化滚动条配置
        let initOptions = {
          speed: this.speed,
          damping: this.damping,
          thumbMinSize: this.thumbMinSize,
          syncCallbacks: this.syncCallbacks,
          renderByPixels: this.renderByPixels,
          alwaysShowTracks: this.alwaysShowTracks,
          continuousScrolling: this.continuousScrolling,
          plugins: {
            overscroll: this.overEnable && initOverScrollOptions
          }
        };
        this.scroll = Scrollbar.init(this.$refs.wrapper, initOptions);

        // 监听滚动事件
        this.scroll.addListener(pos => {
          this.$emit("listenScroll", pos);
        });

        // 代理属性
        setTimeout(() => {
          if (this.scroll) {
            this.getSize = this.scroll.getSize();
            this.offset = this.scroll.offset;
            this.limit = this.initLimit = this.scroll.limit;
            this.scrollTop = this.scroll.scrollTop;
            this.scrollLeft = this.scroll.scrollLeft;
            this.track = this.scroll.track;
            this.containerEl = this.scroll.containerEl;
            this.contentEl = this.scroll.contentEl;
          }
          this.setThumbStyle()
        }, 20);
      },
      // overscroll 回调监听函数
      overScollCallBack(pos) {
        this.$emit("pullScroll", pos);
      },
      // 方法代理
      // 跳到指定位置{x,y}
      setPosition() {
        this.scroll && this.scroll.setPosition.apply(this.scroll, arguments)
      },
      // 滚动到指定位置（x,y,duration,options=>{callback:function}）
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      //将目标元素滚动到滚动条的可见区域，喜欢DOM方法元素.scrollintoview（）。当你想要创建一些锚时，这个方法将会很有帮助。
      // 滚动条指定元素，指定位置{
      // alignToTop,是否要对齐到容器的顶部或底部边缘
      // onlyScrollIfNeeded,当目标元素可见时，设置为true以防止滚动。
      // offsetLeft,在容器的左边缘偏移
      // offsetTop,偏移到容器的顶部边缘（仅在“alignToTop=true”时使用）
      // offsetBottom与容器的底边偏移（仅在“alignToTop=false”）
      // }
      scrollIntoView() {
        this.scroll && this.scroll.scrollIntoView.apply(this.scroll, arguments)
      },
      // 滚动条更新
      update() {
        this.scroll && this.scroll.update()
      },
      // 滚动条销毁
      destroy() {
        let wrapper = this.$refs.wrapper;
        this.scroll && this.scroll.destroy(wrapper);
      },
      // 设置滚动条宽高样式等
      setThumbStyle() {
        // dome 相关的
        function hasClass(el, className) {
          let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
          return reg.test(el.className)
        }
        // 设置样式
        let thumbBar = this.$refs.wrapper.querySelectorAll('.scrollbar-thumb');
        let trackBar = this.$refs.wrapper.querySelectorAll('.scrollbar-track');
        thumbBar.forEach((item) => {
          if (hasClass(item, 'scrollbar-thumb-y')) {
            item.style.width = '6px'
            item.style.background = 'rgba(136,139,143,.6)'
          } else if (hasClass(item, 'scrollbar-thumb-x')) {
            item.style.height = '6px'
            item.style.background = 'rgba(136,139,143,.6)'
          }
        })
        trackBar.forEach((item) => {
          if (hasClass(item, 'scrollbar-track-y')) {
            item.style.width = '6px'
            item.style.background = 'transparent'
          } else if (hasClass(item, 'scrollbar-track-x')) {
            item.style.height = '6px'
            item.style.background = 'transparent'
          }
        })
      },
      // 初始化滚动条默认位置
      _initPos(){
        // 初始化位置
        if(!this.initPos) return
        if(this.initPos === 'top'){
          this.scroll.setPosition(0,0)
        }else if(this.initPos === 'bottom'){
          let maxY = this.scroll.limit.y
         this.$nextTick(()=>{
           this.scroll.setPosition(0,maxY)
         })
        }
      }
    },
    destroyed() {
      this.destroy();
      // 取消监听滚动事件
      this.scroll.removeListener(pos => {
        this.$emit("listenScroll", pos);
      });
    }
  }
</script>

<style scoped>
  .scroll-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
