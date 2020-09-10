import { combineReducers } from "redux-immutable";
import { reducer as recommendReducer } from "../application/Recommend/store";
import { reducer as singerReducer } from "../application/Singers/store";
import { reducer as rankReducer } from '../application/Rank/store/index';
import { reducer as albumReducer } from '../application/Album/store';


export default combineReducers({
  // 之后开发具体功能模块的时候添加 reducer
  recommend: recommendReducer,
  singers: singerReducer,
  rank: rankReducer,
  album: albumReducer
})
