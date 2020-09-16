import styled from 'styled-components'
import style from '../../../assets/global-style'

export const PlayListWrapper = styled.div `
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background-color: ${style["background-color-shadow"]};
  &.list-fade-enter{
    opacity: 0;
  }
  &.list-fade-enter-active{
    opacity: 1;
    transition: all 0.3s;
  }
  &.list-fade-exit{
    opacity: 1;
  }
  &.list-fade-exit-active{
    opacity: 0;
    transition: all 0.3s;
  }
  .list_wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    opacity: 1;
    border-radius: 10px 10px 0 0;
    background-color: ${style["highlight-background-color"]};
    transform: translate3d(0, 0, 0);
    .list_close{
      text-align: center;
      line-height: 50px;
      background: ${style["background-color"]};
      font-size: ${style["font-size-l"]};
      color: ${style["font-color-desc"]};
    }
  }
`;

export const ScrollWrapper = styled.div`
  height: 400px;
  overflow: hidden
`;

export const ListHeader = styled.div`
  position: relative;
  padding: 20px 30px 10px
  .title{
    display: flex;
    align-item:center;
    >div {
      flex: 1;
      .text{
        flex: 1;
        font-size: ${style['']}
      }
    }
  }
`
