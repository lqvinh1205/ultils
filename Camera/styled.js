import styled from "vue-styled-components";

export const Wrapper = styled.div`
  z-index: 99999;
`;

export const ButtonTakePhoto = styled.div``;

export const ButtonChangeType = styled.div``;

export const MainContent = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  padding: 0 !important;
  background: #000;
  video,
  canvas {
    z-index: 9999;
    padding: 0 !important;
  }
`;

export const MainAction = styled.div`
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Close = styled.div`
  position: fixed;
  top: 5%;
  right: 10px;
`;
export const RevertCamera = styled.div`
  position: fixed;
  bottom: 30px;
  right: 20px;
`;
