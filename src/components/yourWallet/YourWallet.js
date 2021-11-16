import React, { useState, useEffect } from 'react'
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
} from '@mui/material'

import { styled, alpha } from '@mui/material/styles'

import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'

import { makeStyles } from '@mui/styles'
import { useEthers } from '@usedapp/core'
import { formatUnits } from '@ethersproject/units'
import md5 from 'md5'

import { WalletBalance } from './WalletBalance'
import { ContractBalance } from './ContractBalance'

import config from '../../network-config'
import {
  useContractMethod,
  useGetProgram,
  useEnableValidUser,
  useDisableValidUser,
  useCheckJoin,
  useJoined,
  useCall,
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

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
)

export const YourWallet = ({ supportedTokens }) => {
  const { chainId, account } = useEthers()
  const [errorMessage, setErrorMessage] = React.useState('')

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
    setErrorMessage('')
  }

  const [programCode, setProgramCode] = useState('')

  const classes = useStyles()

  /* useEffect(() => {
    if (programCode) {
      console.log(programCode)
    }
  }, [programCode]) */

  const { state: joinState, send: joinProgram } = useContractMethod(
    'joinProgram'
  )

  useEffect(() => {
    if (joinState.status === 'Success') {
      // window.location.reload();
    } else if (joinState.status === 'Exception') {
      setErrorMessage(joinState.errorMessage)
    }
  }, [joinState])

  var programDetail = useGetProgram(programCode, contractAddress)

  var joinedProgram = useCheckJoin(programCode, myUid, contractAddress)

  if (joinedProgram === '0x0000000000000000000000000000000000000000')
    joinedProgram = null

  var isAdmin = useCall('admins', contractAddress, [account])

  const handleJoin = event => {
    var url_string = window.location.href
    var url = new URL(url_string)
    var referral = url.searchParams.get('ref')

    joinProgram(programCode, myUid, referral ?? '')
  }

  const [rows, setRows] = useState([])

  useEffect(() => {
    if (Object.keys(programDetail).length > 0 && programDetail.code !== '') {
      setRows([
        createData('Frozen yoghurt', 159, 6.0),
        createData('Ice cream sandwich', 237, 9.0),
        createData('Eclair', 262, 16.0),
        createData('Cupcake', 305, 3.7),
        createData('Gingerbread', 356, 16.0),
      ])
    }
  }, [programDetail])

  function createData(uid, tokenOwn, tokenIncentive) {
    return { uid, tokenOwn, tokenIncentive }
  }

  return (
    <Box className={classes.boxMain}>
      {account && (
        <Box className={classes.box}>
          <div> Your Wallet is {account}</div>
          {false && (
            <div className={classes.uid}>
              Your UID (fake): <b>{myUid}</b>
            </div>
          )}
          {chainId === 97 && false && (
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
            <Typography align="left" variant="h5" component="div">
              #{programDetail.code}
            </Typography>
            <Typography align="left" component="div">
              Status: {programDetail.paused ? 'Stopped' : 'Running'}
            </Typography>
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

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>UID</TableCell>
                    <TableCell align="right">Own</TableCell>
                    <TableCell align="right">Incentive</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow
                      key={row.uid}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}>
                      <TableCell component="th" scope="row">
                        {row.uid}
                      </TableCell>
                      <TableCell align="right">{row.tokenOwn}</TableCell>
                      <TableCell align="right">{row.tokenIncentive}</TableCell>
                      <TableCell align="right">BTN</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <CardActions className={classes.rightAlignItem}>
            <Button
              disabled={rows.length === 0}
              variant="contained"
              onClick={e => handleJoin(programDetail.code, e)}>
              Approve All
              {joinState.status === 'Mining' && ', joining (30s)...'}
            </Button>

            {account && !joinedProgram && false && (
              <Button
                disabled={!myUid || joinState.status === 'Mining'}
                variant="contained"
                onClick={e => handleJoin(programDetail.code, e)}>
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

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorMessage !== ''}
        autoHideDuration={10000}
        onClose={handleClose}
        message={errorMessage}
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
