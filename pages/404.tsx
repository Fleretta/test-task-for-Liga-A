import styled from "styled-components";

export default function Error() {
  const Title = styled.h1`
    margin: 0;

    color: #e1e5f0;
    font-size: 64px;
    text-align: center;
    line-height: 100vh;

    @media (max-width: 1366px) {
      font-size: 48px;
    }
  `;

  return <Title>ERROR</Title>;
}
