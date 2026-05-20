import React from 'react'
import Orders from './Orders'

const StripeOrders = ({ token }) => {
  return <Orders token={token} title="Stripe Orders" fetchPath="/api/order/stripe-orders" />
}

export default StripeOrders
