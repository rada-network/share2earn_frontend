import React from 'react'

import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  title: {
    color: '#000',
    textAlign: 'center',
    padding: 24,
  },
})

export const About = () => {
  // send the brownie-config to our `src` folder
  // send the build folder
  const classes = useStyles()
  // const { chainId, error } = useEthers()

  return (
    <div>
      <h2 className={classes.title}>About us</h2>
    </div>
  )
}
