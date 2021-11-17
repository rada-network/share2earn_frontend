import React from 'react'
import PropTypes from 'prop-types'

// import { Token } from "../Main"
import { useTokenBalance } from '@usedapp/core'
import { formatUnits } from '@ethersproject/units'
import { BalanceMsg } from '../BalanceMsg'

export const ContractBalance = ({ token, account }) => {
  const { image, address, name } = token
  const tokenBalance = useTokenBalance(address, account)
  const formattedTokenBalance = tokenBalance
    ? formatUnits(tokenBalance, 18)
    : ''
  return (
    <BalanceMsg
      label={`${name} balance`}
      tokenImgSrc={image}
      amount={formattedTokenBalance}
    />
  )
}

ContractBalance.propTypes = {
  token: PropTypes.object,
  account: PropTypes.string,
  image: PropTypes.arrayOf(PropTypes.string),
  address: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.arrayOf(PropTypes.string),
}
