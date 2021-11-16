import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import {
  Box,
  Button,
  Snackbar,
  Card,
  Typography,
  CardActions,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Chip,
  DialogTitle,
  Dialog,
  DialogContent,
} from '@mui/material'

import { makeStyles } from '@mui/styles'

import { useEthers } from '@usedapp/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import config from '../network-config'

import { useCall } from '../hooks'
import { TramRounded } from '@mui/icons-material'
const walletConnect = new WalletConnectConnector({
  rpc: {
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    56: 'https://bsc-dataseed.binance.org/',
  },
  qrcode: true,
})

const useStyles = makeStyles({
  container: {
    padding: 16,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 4,
  },
})

export const Header = () => {
  const classes = useStyles()

  const {
    chainId,
    account,
    activateBrowserWallet,
    deactivate,
    activate,
    error,
  } = useEthers()
  const [activateError, setActivateError] = useState('')
  const [nameNetwork, setNameNetwork] = useState('')

  const [openConnect, setOpenConnect] = useState(false)

  const isConnected = account !== undefined
  const contractAddress = chainId ? config[chainId]['referral_contract'] : ''

  var isAdmin = useCall('admins', contractAddress, [account])

  const handleClose = () => {
    setOpenConnect(false)
  }
  const handleClickOpen = () => {
    setOpenConnect(true)
  }

  const handleChooseWallet = wallet => {
    if (wallet === 'metaMask') {
      activateBrowserWallet()
    } else if (wallet === 'walletConnect') {
      activate(walletConnect)
    }
    setOpenConnect(false)
  }

  useEffect(() => {
    if (error) {
      setActivateError(error.message)
    }
  }, [error])

  useEffect(() => {
    if (chainId) {
      setNameNetwork(config[chainId]['nameNetwork'])
    }
  }, [chainId])

  /* const handleClose = () => {
    setActivateError('')
  } */

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton> */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Referral | Rada.network
          </Typography>
          <Typography
            variant="span"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            {account}{' '}
            {isAdmin === true && (
              <Chip
                style={{ color: 'yellow' }}
                label={'Admin'}
                variant="warning"
              />
            )}
          </Typography>
          {/* <Link to="/home" style={{ textDecoration: 'none' }}>
            <Button variant="text" style={{ color: 'white' }}>
              Homepage
            </Button>
          </Link> */}
          {/* <Link to="/about" style={{ textDecoration: 'none' }}>
            <Button variant="text" style={{ color: 'white' }}>
              About us
            </Button>
          </Link> */}
          {isConnected ? (
            <Button color="secondary" variant="contained" onClick={deactivate}>
              Disconnect | {nameNetwork}
            </Button>
          ) : (
            <Button
              disabled={activateError !== ''}
              color="secondary"
              variant="contained"
              onClick={() => handleClickOpen()}>
              Connect Wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Dialog onClose={handleClose} open={openConnect}>
        <DialogTitle>Choose Wallet</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleChooseWallet('metaMask')}>
              MetaMask
            </Button>
            <Box sx={{ m: 1 }} />
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleChooseWallet('walletConnect')}>
              WalletConnect
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={activateError !== ''}
        autoHideDuration={6000}
        message={activateError}
      />
    </Box>
  )
}
