import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'

import { styled, alpha } from '@mui/material/styles'

// import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded'
import { makeStyles } from '@mui/styles'
import { useEthers } from '@usedapp/core'
import { formatUnits } from '@ethersproject/units'
// import md5 from 'md5'

import { WalletBalance } from './WalletBalance'
import { ContractBalance } from './ContractBalance'

import config from '../../network-config'
import {
  useContractMethod,
  useGetProgram,
  useCheckJoin,
  useJoined,
  useCall,
  useGetIncentiveHolder,
  useGetIncentive,
  useGetTotalUser,
  useGetTotalIncentive,
  useGetJoiner,
  useGetAddressJoiner,
  // useGetHoldersTotal,
} from '../../hooks'

const useStyles = makeStyles({
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    gap: 24,
  },
  boxMain: {
    paddingBottom: 20,
  },
  box: {
    padding: 16,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: '25px',
  },
  header: {
    color: '#000',
  },
  rightAlignItem: {
    justifyContent: 'end',
  },
  uid: {
    paddingTop: 8,
    paddingBottom: 8,
  },
})

/* const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
) */

export const YourWallet = ({ supportedTokens }) => {
  const { chainId, account } = useEthers()
  const [alertMessage, setAlertMessage] = React.useState('')

  const contractAddress = chainId ? config[chainId]['referral_contract'] : ''

  // const cookies = new Cookies();

  /* const makeUid = (length) => {
        var result           = '';
        var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() *charactersLength));
        }
        return result;
    } */

  // var myUid = account ? md5(account).substr(3, 15) : ''
  const [myUid, setMyUid] = useState('')

  var addressJoined = useJoined(myUid, contractAddress)
  var joined =
    addressJoined &&
    addressJoined !== '0x0000000000000000000000000000000000000000'

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlertMessage('')
  }

  const [programCode, setProgramCode] = useState('')

  const classes = useStyles()

  /* useEffect(() => {
    if (programCode) {
      console.log(programCode)
    }
  }, [programCode]) */

  const allowJoinProgram = false

  const { state: joinState, send: joinProgram } = useContractMethod(
    'joinProgram'
  )
  const { state: approveAllState, send: approveAll } = useContractMethod(
    'approveAllIncentive'
  )
  const { state: denyState, send: denyIncentive } = useContractMethod(
    'denyIncentive'
  )

  useEffect(() => {
    if (
      joinState.status === 'Success' ||
      approveAllState.status === 'Success' ||
      denyState.status === 'Success'
    ) {
      setAlertMessage('Success')
      setOpenConfirm(false)
      setUserUid('')
      // setUserIndex(0)

      // Close confirm approveAll
      setOpenConfirmApprove(false)
    } else if (joinState.status === 'Exception') {
      setAlertMessage(joinState.errorMessage)
    } else if (denyState.status === 'Exception') {
      setAlertMessage(denyState.errorMessage)
    } else if (approveAllState.status === 'Exception') {
      setAlertMessage(approveAllState.errorMessage)
    }
  }, [joinState, denyState, approveAllState])

  const programDetail = useGetProgram(programCode, contractAddress)

  var joinedProgram = useCheckJoin(programDetail, myUid, contractAddress)
  // console.log(joinedProgram)
  if (joinedProgram === '0x0000000000000000000000000000000000000000')
    joinedProgram = null

  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [openConfirmApprove, setOpenConfirmApprove] = React.useState(false)
  const [openUsers, setOpenUsers] = React.useState(false)
  const [userUid, setUserUid] = React.useState(false)
  // const [userIndex, setUserIndex] = React.useState(0)

  var isAdmin = useCall('admins', contractAddress, [account])
  /*
  // Cách số 1 dùng functionCallS
  var totalHolders = useGetHoldersTotal(programDetail, contractAddress) ?? 0
  totalHolders = formatUnits(totalHolders, 0)

  const incentiveHolders = useGetIncentiveHolder(
    programDetail,
    totalHolders,
    contractAddress
  ) */
  const incentiveHolders = useGetIncentiveHolder(programDetail, contractAddress)
  const joiner = useGetJoiner(programDetail, openUsers, contractAddress)

  const addressJoiners = useGetAddressJoiner(
    programDetail,
    joiner,
    contractAddress
  )
  // console.log(addressJoiners)

  // console.log(incentiveHolders, 'incentiveHolders')
  const incentiveAmount = useGetIncentive(
    programDetail,
    incentiveHolders,
    contractAddress
  )

  const totalJoiner = useGetTotalUser(programDetail, contractAddress)
  const totalIncentive = useGetTotalIncentive(programDetail, contractAddress)

  // console.log(incentiveAmount, 'incentiveHolders')

  const handleJoin = () => {
    var url_string = window.location.href
    var url = new URL(url_string)
    var referral = url.searchParams.get('ref')
    joinProgram(programCode, myUid, referral ?? '')
  }

  const handleApproval = () => {
    approveAll(programCode)
  }

  const handleClickOpenConfirm = (uid, index) => () => {
    setUserUid(uid)
    // setUserIndex(index)
    setOpenConfirm(true)
  }

  const handleConfirm = () => {
    denyIncentive(programDetail.code, userUid)
  }
  const handleCloseConfirm = () => {
    setOpenConfirm(false)
    setUserUid('')
    // setUserIndex(0)
  }
  const handleCloseConfirmApprove = () => {
    setOpenConfirmApprove(false)
  }
  const handleClickOpenConfirmApprove = () => {
    setOpenConfirmApprove(true)
  }
  const handleClickCloseListUser = () => {
    setOpenUsers(false)
  }
  const handleClickOpenListUser = () => {
    setOpenUsers(true)
  }

  const [rows, setRows] = useState([])

  useEffect(() => {
    if (
      Object.keys(programDetail).length > 0 &&
      programDetail.code !== '' &&
      incentiveHolders &&
      incentiveHolders[0] &&
      incentiveAmount &&
      incentiveAmount[0]
    ) {
      // console.log(incentiveHolders)
      // console.log(incentiveAmount, 'incentiveAmount')

      const holders = incentiveHolders
        .filter(
          (aUid, index) => formatUnits(incentiveAmount[index][0], 18) !== '0.0'
        )
        .map((aUid, index) =>
          createData(aUid, formatUnits(incentiveAmount[index][0], 18))
        )
      setRows(holders)
    }
    // console.log('useEffect')
  }, [programDetail, incentiveHolders, incentiveAmount])

  function createData(uid, tokenIncentive) {
    return { uid, tokenIncentive }
  }

  return (
    <Box className={classes.boxMain}>
      {account && (
        <Box className={classes.box}>
          <div> Your Wallet is {account}</div>
          {/* {isAdmin && (
            <div className={classes.uid}>
              Your UID (fake): <b>{myUid}</b>
            </div>
          )} */}
          {allowJoinProgram && isAdmin && (
            <div style={{ marginTop: 15 }}>
              <TextField
                label="Your UID (in rada.network)"
                id="outlined-size-small"
                size="small"
                value={myUid}
                onChange={e => setMyUid(e.target.value)}
              />
            </div>
          )}
          {account && joined && (
            <div>
              Link referral: <br />
              <b>
                {config.appUrl}/?ref={myUid}
              </b>
            </div>
          )}
        </Box>
      )}
      <Divider style={{ marginTop: 16, marginBottom: 16 }} />
      <Box className={classes.box}>
        <h3>Your Balance</h3>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {supportedTokens.map((token, index) => {
            return (
              <Box
                key={`your-balance-${index}`}
                sx={{
                  borderRadius: 1,
                  flexGrow: 1,
                }}>
                <WalletBalance token={supportedTokens[index]} />
              </Box>
            )
          })}
        </Box>
        <h3>Referral Contract Balance</h3>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {supportedTokens.map((token, index) => {
            return (
              <Box
                key={`contract-balance-${index}`}
                sx={{
                  borderRadius: 1,
                  flexGrow: 1,
                }}>
                <ContractBalance
                  token={supportedTokens[index]}
                  account={config['97']['referral_contract']}
                />
              </Box>
            )
          })}
        </Box>
      </Box>
      <Divider style={{ marginTop: 16, marginBottom: 16 }} />

      {isAdmin && (
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
                Projects
              </Typography>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  value={programCode}
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={e => setProgramCode(e.target.value.toUpperCase())}
                />
              </Search>
            </Toolbar>
          </AppBar>
        </Box>
      )}

      {Object.keys(programDetail).length > 0 && programDetail.code !== '' && (
        <Card sx={{ minWidth: 275, marginTop: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              <Typography align="left" variant="h5" component="div">
                #{programDetail.code}
              </Typography>
              <Typography align="left" component="div">
                Status: {programDetail.paused ? 'Stopped' : 'Running'}
              </Typography>
              <Typography align="left" component="div">
                Joiner: {totalJoiner && formatUnits(totalJoiner, 0)}
              </Typography>
              <Typography align="left" component="div">
                Reward: {totalIncentive && formatUnits(totalIncentive, 18)}
              </Typography>
            </Box>
            <Divider style={{ marginTop: 5 }} />
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Incentive level 1"
                  secondary={formatUnits(programDetail.incentiveL0, 18)}
                />
                <ListItemText
                  primary="Incentive level 2"
                  secondary={formatUnits(programDetail.incentiveL1, 18)}
                />
                <ListItemText
                  primary="Incentive level 3"
                  secondary={formatUnits(programDetail.incentiveL2, 18)}
                />
              </ListItem>
            </List>
            <div sx={{ overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 450 }} component={Paper}>
                <Table stickyHeader aria-label="simple table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>UID</TableCell>
                      <TableCell align="right">Incentive</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length === 0 && (
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}>
                        <TableCell component="th" scope="row">
                          No Referrer
                        </TableCell>
                      </TableRow>
                    )}
                    {rows.map((row, index) => (
                      <TableRow
                        key={`${row.uid}-${index}`}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}>
                        <TableCell component="th" scope="row">
                          {row.uid}
                        </TableCell>
                        <TableCell align="right">
                          {row.tokenIncentive}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            onClick={handleClickOpenConfirm(row.uid, index)}>
                            <RemoveCircleRoundedIcon style={{ color: 'red' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
          <CardActions className={classes.rightAlignItem}>
            <Button variant="contained" onClick={handleClickOpenListUser}>
              Joiners
            </Button>
            <Button
              disabled={
                rows.length === 0 || approveAllState.status === 'Mining'
              }
              variant="contained"
              onClick={handleClickOpenConfirmApprove}>
              Approve All
              {approveAllState.status === 'Mining' &&
                ', please wait (15 -> 30s)...'}
            </Button>

            {allowJoinProgram && account && !joinedProgram && isAdmin && (
              <Button
                disabled={!myUid || joinState.status === 'Mining'}
                variant="contained"
                onClick={handleJoin}>
                Join Program{' '}
                {joinState.status === 'Mining' && ', joining (30s)...'}
              </Button>
            )}
            {account && joinedProgram && (
              <Chip label="Joined" color="success" />
            )}
          </CardActions>
        </Card>
      )}

      <Dialog
        open={openUsers}
        onClose={handleClickCloseListUser}
        scroll={'paper'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Program {programCode}</DialogTitle>
        <DialogContent dividers>
          <TableContainer sx={{ maxHeight: 450 }} component={Paper}>
            <Table stickyHeader aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>UID</TableCell>
                  <TableCell align="right">Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {joiner && joiner.length === 0 && (
                  <TableRow
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}>
                    <TableCell component="th" scope="row">
                      No Joiner
                    </TableCell>
                  </TableRow>
                )}
                {joiner &&
                  joiner.map((uid, index) => (
                    <TableRow
                      key={`${uid}-${index}`}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}>
                      <TableCell component="th" scope="row">
                        {uid}
                      </TableCell>
                      <TableCell align="right">
                        {addressJoiners[index]}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={denyState.status === 'Mining'}
            onClick={handleClickCloseListUser}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Remove incentive #{userUid}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action will clean all incentive of user as you see on screen.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={denyState.status === 'Mining'}
            onClick={handleCloseConfirm}>
            Disagree
          </Button>
          <Button
            disabled={denyState.status === 'Mining'}
            variant="contained"
            onClick={handleConfirm}
            autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmApprove}
        onClose={handleCloseConfirmApprove}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Approve all incentive</DialogTitle>
        <DialogActions>
          <Button
            disabled={approveAllState.status === 'Mining'}
            onClick={handleCloseConfirmApprove}>
            Disagree
          </Button>
          <Button
            disabled={approveAllState.status === 'Mining'}
            variant="contained"
            onClick={handleApproval}
            autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alertMessage !== ''}
        autoHideDuration={10000}
        onClose={handleClose}
        message={alertMessage}
      />
    </Box>
  )
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    textTransform: 'uppercase',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))
