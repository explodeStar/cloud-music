import React, {useState, useRef, useEffect, useCallback} from 'react'
import {CSSTransition} from "react-transition-group";
import Header from "../../baseUI/header";
import { Container, Menu, TopDesc, SongList, SongItem } from "./style";
import { HEADER_HEIGHT } from './../../api/config';
import Scroll from '../../baseUI/scroll/index';
import { getName, getCount, isEmptyObject } from './../../api/utils';
import style from "../../assets/global-style";
import {connect} from "react-redux";
import {getAlbumList, changeEnterLoading} from "./store/actionCreators";
import Loading from '../../baseUI/loading/index';

function Album(props) {

// 从路由中拿到歌单的 id
  const id = props.match.params.id;
  const { currentAlbum:currentAlbumImmutable, enterLoading } = props;
  const { getAlbumDataDispatch } = props;

  useEffect(() => {
    getAlbumDataDispatch(id)
  },[id])

  const currentAlbum = currentAlbumImmutable ? currentAlbumImmutable.toJS() : {}

  const [showStatus,setShowStatus] = useState(true)
  const [title, setTitle] = useState ("歌单");
  const [isMarquee,setIsMarquee] = useState(true)// 是否跑马灯

  const headerEl = useRef();

  const handleBack = useCallback(() => {
    setShowStatus(false)
  },[])

  const handleScroll = useCallback((pos) => {
    let minScrollY = - HEADER_HEIGHT;
    let percent = Math.abs(pos.y/minScrollY)
    let headerDom = headerEl.current
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.background = style['theme-color']
      headerDom.style.opacity = Math.min(1,(percent-1)/2)
      setTitle(currentAlbum.name)
      setIsMarquee(true)
    } else {
      headerDom.style.background = ''
      headerDom.style.opacity = 1
      setTitle('歌单')
      setIsMarquee(false)
    }
  },[currentAlbum])

  const renderTopDesc = () => {
    return(
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter" />
        </div>
        <div className="img_wrapper">
          <div className="decorate" />
          <img src={currentAlbum.coverImgUrl} alt=""/>
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor (currentAlbum.subscribedCount/1000)/10} 万 </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt=""/>
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }
  const renderMenu = () => {
    return(
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }
  const renderSongList = () => {
    return(
      <SongList>
        <div className="first_line">
          <div className="play_all">
            <i className="iconfont">&#xe6e3;</i>
            <span > 播放全部 <span className="sum">(共 {currentAlbum.tracks.length} 首)</span></span>
          </div>
          <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span > 收藏 ({getCount(currentAlbum.subscribedCount)})</span>
          </div>
        </div>
        <SongItem>
          {
            currentAlbum.tracks.map ((item, index) => {
              return (
                <li key={index}>
                  <span className="index">{index + 1}</span>
                  <div className="info">
                    <span>{item.name}</span>
                    <span>
                            { getName (item.ar) } - { item.al.name }
                          </span>
                  </div>
                </li>
              )
            })
          }
        </SongItem>
      </SongList>
    )
  }
  return(
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header ref={headerEl} isMarquee={isMarquee} title={title} handleClick={handleBack} />
        {
          !isEmptyObject(currentAlbum) && <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              { renderTopDesc() }
              { renderMenu() }
              { renderSongList() }
            </div>
          </Scroll>
        }
        {enterLoading && <Loading />}
      </Container>
    </CSSTransition>
  )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
});
const mapDispatchToProps = dispatch => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(false))
      dispatch(getAlbumList(id))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Album))
