import React from 'react'
import { Button } from '@material-ui/core'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import { gql, useMutation } from '@apollo/client'
import Router from 'next/router'

import Link from '../components/Link'
import CartItems from '../components/CartItems'
import { cartState, customerInfoState } from '../states/atom'
import CustomerInfo from '../components/CustomerInfo'

const CREATE_ORDER_MUTATION = gql`
mutation ($record: CreateOneOrderInput!) {
  createOrder (record: $record) {
    recordId
  }
}
`
const CREATE_ORDER_ITEMS_MUTATION = gql`
mutation ($records: [CreateManyOrderItemInput!]!) {
  createOrderItems (records: $records) {
    recordIds
  }
}
`

const Cart = () => {
  const cart = useRecoilValue(cartState)
  const customerInfo = useRecoilValue(customerInfoState)
  const resetCart = useResetRecoilState(cartState)
  const resetCustomerInfo = useResetRecoilState(customerInfoState)
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION)
  const [createOrderItems] = useMutation(CREATE_ORDER_ITEMS_MUTATION)
  const handleCheckout = async () => {
    const { data: { createOrder: { recordId: orderId } } } = await createOrder({
      variables: {
        record: customerInfo
      }
    })
    const orderItems = await createOrderItems({
      variables: {
        records: cart.map(product => ({
          orderId,
          productId: product._id,
          quantity: 1,
        }))
      }
    })
    console.log(orderId)
    resetCart()
    resetCustomerInfo()
    Router.push('/products')
  }
  return (
    <>
      <CartItems />
      <CustomerInfo />
      <Button
        variant="outlined"
        color="primary"
        component={Link}
        href="/products"
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckout}
      >
        Checkout
      </Button>
    </>
  )
}

export default Cart