import React, {useEffect} from "react";
import {connect} from "react-redux";
import {getRankList} from "./store";
import { filterIndex, filterIdx } from '../../api/utils';
import Scroll from '../../baseUI/scroll'
import {SongList, List, ListItem, Container, EnterLoading} from "./style";
import { renderRoutes } from 'react-router-config';
import Loading from '../../baseUI/loading';


function Rank(props){

  const {rankList:list,loading} = props
  const {getRankListDataDispatch} = props

  let rankList = list.toJS()
  let globalStartIndex = filterIndex (rankList);
  let officialList = rankList.slice (0, globalStartIndex);
  let globalList = rankList.slice (globalStartIndex);

  useEffect(() => {
    if(!rankList.length){
      getRankListDataDispatch();
    }
  },[])

  const enterDetail = (detail) => {
    console.log(detail)
    props.history.push(`/rank/${detail.id}`)
  }

  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item,index) => {
            return (
              <ListItem key={index} tracks={item.tracks} onClick={() => enterDetail(item)}>
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt=""/>
                  <div className="decorate" />
                  {/*<span>{item.updateFrequency}</span>*/}
                </div>
                { renderSongList(item.tracks) }
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  const renderSongList = (list = []) => {
    return list.length ? (
      <SongList>
        {
          list.map ((item, index) => {
            return <li key={index}>{index+1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  }

  let displayStyle = loading ? {"display": "none"} : {"display": ""}

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}> 官方榜 </h1>
          { renderRankList(officialList) }
          <h1 className="global" style={displayStyle}> 全球榜 </h1>
          { renderRankList(globalList, true) }
          { loading ? <EnterLoading><Loading /></EnterLoading> : null }
        </div>
      </Scroll>
      {renderRoutes (props.route.routes)}
    </Container>
  )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading']),
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    getRankListDataDispatch () {
      dispatch(getRankList());
    }
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Rank));
