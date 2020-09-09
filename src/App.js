import React from 'react';
import { GlobalStyle } from "./style";
import { IconStyle } from "./assets/iconfont/iconfont";
import { renderRoutes } from "react-router-config";//renderRoutes 读取路由配置转化为 Route 标签
import { HashRouter } from "react-router-dom";
import routes from "./routes/index";
import { Provider } from "react-redux";
import store from "./store/index";
import {Data} from "./application/Singers/data";


function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle />
        <IconStyle />
        <Data>
          { renderRoutes(routes) }
        </Data>
      </HashRouter>
    </Provider>
  );
}

export default App;
