import React, {forwardRef, useState, useRef, useEffect, useImperativeHandle } from "react";
import BScroll from 'better-scroll'
import { ScrollContainer } from './style'
import PropTypes from "prop-types"
/*Scroll.propTypes = {
  direction: PropTypes.oneOf (['vertical', 'horizental']),// 滚动的方向
  click: true,// 是否支持点击
  refresh: PropTypes.bool,// 是否刷新
  onScroll: PropTypes.func,// 滑动触发的回调函数
  pullUp: PropTypes.func,// 上拉加载逻辑
  pullDown: PropTypes.func,// 下拉加载逻辑
  pullUpLoading: PropTypes.bool,// 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool,// 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool,// 是否支持向上吸顶
  bounceBottom: PropTypes.bool// 是否支持向下吸底
};*/

const Scroll = forwardRef((props,ref) => {
  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props
  const { pullUp, pullDown, onScroll } = props;

  const [bScroll, setBScroll] = useState()
  const scrollContaninerRef  = useRef()

  //创建 better-scroll
  useEffect(() => {
    const scroll = new BScroll(scrollContaninerRef.current,{
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
  },[])

  //每次重新渲染都要刷新实例，防止无法滑动:
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })

  //给实例绑定 scroll 事件
  useEffect(() => {
    if(!bScroll || !onScroll) return
    bScroll.on('scroll',(scroll) => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  },[onScroll,bScroll])

  //上拉刷新
  useEffect(() => {
    if (!bScroll || !pullUp) return
    bScroll.on('scrollEnd',() => {
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUp()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  },[pullUp, bScroll])
  //下拉刷新
  useEffect(() => {
    if (!bScroll || !pullDown) return
    bScroll.on('touchEnd',(pos) => {
      if (pos.y > 50) {
        pullDown()
      }
    })
    return () => {
      bScroll.off('touchEnd')
    }
  },[pullDown, bScroll])

  //让父页面调用子页面方法
  // 一般和 forwardRef 一起使用，ref 已经在 forWardRef 中默认传入
  useImperativeHandle(ref,() => ({
    // 给外界暴露 refresh 方法
    refresh() {
      if(bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0,0)
      }
    },
    // 给外界暴露 getBScroll 方法，提供 bs 实例
    getBScroll() {
      if (bScroll) {
        return bScroll
      }
    }
  }))

  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
    </ScrollContainer>
  )
})

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUploading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
}
Scroll.propTypes = {
  direction: PropTypes.oneOf (['vertical', 'horizental']),
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool,// 是否支持向上吸顶
  bounceBottom: PropTypes.bool// 是否支持向上吸顶
};

export default Scroll;