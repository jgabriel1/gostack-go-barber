import 'jest-styled-components'
import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import Input from '../../components/Input'

jest.mock('@unform/core', () => ({
  useField() {
    return {
      fieldName: 'email',
      defaultValue: '',
      error: '',
      registerField: jest.fn(),
    }
  },
}))

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    )

    expect(getByPlaceholderText('E-mail')).toBeTruthy()
  })

  it('should render higlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    )

    const inputElement = getByPlaceholderText('E-mail')
    const containerElement = getByTestId('input-container')

    fireEvent.focus(inputElement)

    await waitFor(() => {
      expect(containerElement).toHaveStyleRule('border-color', '#ff9000')
      expect(containerElement).toHaveStyleRule('color', '#ff9000')
    })

    fireEvent.blur(inputElement)

    await waitFor(() => {
      expect(containerElement).not.toHaveStyleRule('border-color', '#ff9000')
      expect(containerElement).not.toHaveStyleRule('color', '#ff9000')
    })
  })

  it('should keep orange border when input is filled and not in focus anymore', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    )

    const inputElement = getByPlaceholderText('E-mail')
    const containerElement = getByTestId('input-container')

    fireEvent.change(inputElement, {
      target: { value: 'johndoe@example.com' },
    })

    fireEvent.blur(inputElement)

    await waitFor(() => {
      expect(containerElement).toHaveStyleRule('color', '#ff9000')
    })
  })
})
