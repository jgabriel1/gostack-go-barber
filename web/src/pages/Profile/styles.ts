import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.div`
  > header {
    width: 100%;
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;

      max-width: 1120px;
      margin: 0 auto;

      a {
        width: 36px;
        height: 36px;

        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          color: #999591;
          width: 28px;
          height: 28px;
        }
      }
    }
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  /* place-content: center; does the same as justify and align! */
  justify-content: center;
  align-items: center;
  margin: -176px 0 auto;

  width: 100%;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }

    fieldset {
      border: 0;
    }

    .identification-inputs {
      margin-bottom: 8px;
    }

    .password-inputs {
      margin-top: 24px;
    }
  }
`

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    right: 77px;
    bottom: 0;

    width: 48px;
    height: 48px;
    background: #ff9000;
    border-radius: 50%;
    border: 0;
    cursor: pointer;

    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`
