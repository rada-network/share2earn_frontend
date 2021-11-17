const configDefault = {
  development: {
    appUrl: 'http://localhost:3000',
    '4': {
      valid_user_contract: '',
      rir_token: '',
      meo_token: '',
      referral_contract: '',
    },
    '97': {
      nameNetwork: 'BSC Testnet',
      valid_user_contract: '0x5734169930CDc94274F8Bc4E4cf3B4ea86D269eE',
      rir_token: '0xDbe74d7239E2Ba9019855422da99f4a3Fd4BBEeb',
      meo_token: '0xD0E081Ace2c861457516FE6F47F57C3010a54AE7',
      referral_contract: '0x998353AfD99A73262337974e2E732118ed557600',
    },
    '56': {
      nameNetwork: 'BSC',
      valid_user_contract: '0x5734169930CDc94274F8Bc4E4cf3B4ea86D269eE',
      rir_token: '0xDbe74d7239E2Ba9019855422da99f4a3Fd4BBEeb',
      meo_token: '0xD0E081Ace2c861457516FE6F47F57C3010a54AE7',
      referral_contract: '0x998353AfD99A73262337974e2E732118ed557600',
    },
  },
  production: {
    appUrl: 'https://referral-demo.1alo.com',
    '4': {
      nameNetwork: 'Rinkeby',
      valid_user_contract: '',
      rir_token: '',
      meo_token: '',
      referral_contract: '',
    },
    '97': {
      nameNetwork: 'BSC Testnet',
      valid_user_contract: '0x5734169930CDc94274F8Bc4E4cf3B4ea86D269eE',
      rir_token: '0xDbe74d7239E2Ba9019855422da99f4a3Fd4BBEeb',
      meo_token: '0xD0E081Ace2c861457516FE6F47F57C3010a54AE7',
      referral_contract: '0x998353AfD99A73262337974e2E732118ed557600',
    },
    '56': {
      nameNetwork: 'BSC',
      valid_user_contract: '0x5734169930CDc94274F8Bc4E4cf3B4ea86D269eE',
      rir_token: '0xDbe74d7239E2Ba9019855422da99f4a3Fd4BBEeb',
      meo_token: '0xD0E081Ace2c861457516FE6F47F57C3010a54AE7',
      referral_contract: '0x998353AfD99A73262337974e2E732118ed557600',
    },
  },
}

export default {
  ...configDefault[process.env.NODE_ENV],
  version: '0.0.2',
}
