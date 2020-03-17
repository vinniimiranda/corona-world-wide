import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export const Image  = styled.img`
    width: 5rem;
    height: 5rem;
    animation: rotate;
    animation-iteration-count:infinite;
    animation-duration: 1s;
    animation-timing-function: linear;
    filter: drop-shadow(1px 0px 2px #01DBCC);
    @keyframes rotate {
        from {
            transform: rotateZ(10deg)
        }
        to {
            transform: rotateZ(360deg)
        }
    }
`;