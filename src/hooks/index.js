import { useEffect } from 'react'
import { constants, ethers } from 'ethers'
import {
  useEthers,
  useContractCall,
  useContractFunction,
  useContractCalls,
} from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import ReferralContract from '../chain-info/contracts/ReferralContract.json'
import ValidUserContract from '../chain-info/contracts/ValidUserContract.json'

import networkMapping from '../network-config'

const { abi: abiReferral } = ReferralContract
const referralContractInterface = new ethers.utils.Interface(abiReferral)
const { abi: abiValidUser } = ValidUserContract
const validUserContractInterface = new ethers.utils.Interface(abiValidUser)

export function useContractMethod(methodName) {
  const { chainId } = useEthers()
  const contractAddress = chainId
    ? networkMapping[String(chainId)]['referral_contract']
    : constants.AddressZero
  const contract = new Contract(contractAddress, referralContractInterface)

  const { state, send } = useContractFunction(contract, methodName)

  // useEffect
  /* useEffect(() => {
    console.log(state)
  }, [state]) */

  return { state, send }
}
export function useEnableValidUser() {
  const { chainId } = useEthers()
  const contractAddress = chainId
    ? networkMapping[String(chainId)]['valid_user_contract']
    : constants.AddressZero
  const contract = new Contract(contractAddress, validUserContractInterface)

  const { state, send } = useContractFunction(contract, 'setUser')

  return { state, send }
}
export function useDisableValidUser() {
  const { chainId } = useEthers()
  const contractAddress = chainId
    ? networkMapping[String(chainId)]['valid_user_contract']
    : constants.AddressZero
  const contract = new Contract(contractAddress, validUserContractInterface)

  const { state, send } = useContractFunction(contract, 'unsetUser')

  return { state, send }
}
export function useTokenAddress() {
  const { chainId } = useEthers()
  const contractAddress = chainId
    ? networkMapping[String(chainId)]['referral_contract']
    : constants.AddressZero

  const [token] =
    useContractCall({
      abi: referralContractInterface,
      address: contractAddress,
      method: 'token',
      args: [],
    }) ?? []

  return token
}

/* export function useGetMyUid() {

  const { chainId, account } = useEthers()

  const contractAddress = networkMapping[chainId]["valid_user_contract"];
  const [uid] = useContractCall(account && {
    abi: validUserContractInterface,
    address: contractAddress,
    method: "addressUsers",
    args: [account],
  }) ?? [];
  return uid;
} */
export function useGetProgram(code, contractAddress) {
  const { account } = useEthers()

  const program =
    useContractCall(
      account &&
        contractAddress && {
          abi: referralContractInterface,
          address: contractAddress,
          method: 'programs',
          args: [code],
        }
    ) ?? []
  return program === [] ? null : program
}

export function useJoined(uid, contractAddress) {
  const [addressJoined] =
    useContractCall(
      contractAddress &&
        uid && {
          abi: referralContractInterface,
          address: contractAddress,
          method: 'userJoined',
          args: [uid],
        }
    ) ?? []

  return addressJoined
}
export function useJoinedAddress(account, contractAddress) {
  const [uid] =
    useContractCall(
      account &&
        contractAddress && {
          abi: referralContractInterface,
          address: contractAddress,
          method: 'addressJoined',
          args: [account],
        }
    ) ?? []

  return uid
}

export function useCheckJoin(programDetail, uid, contractAddress) {
  const [joined] =
    useContractCall(
      uid &&
        programDetail.code &&
        contractAddress && {
          abi: referralContractInterface,
          address: contractAddress,
          method: 'uidJoined',
          args: [programDetail.code, uid],
        }
    ) ?? []

  return joined
}

export function useCall(functionCall, contractAddress, args = []) {
  const [joined] =
    useContractCall(
      contractAddress && {
        abi: referralContractInterface,
        address: contractAddress,
        method: functionCall,
        args: args,
      }
    ) ?? []

  return joined
}

export function useGetIncentiveHolder(programDetail, contractAddress) {
  const { account } = useEthers()

  var indexList = [0, 1, 3, 4]

  indexList.map(index => {
    console.log(index)
  })

  return useContractCalls(
    account && programDetail.code && contractAddress
      ? indexList.map(index => ({
          abi: referralContractInterface,
          address: contractAddress,
          method: 'holdReferrer',
          args: [programDetail.code, index],
        }))
      : []
  )
}

/* export function useGetIncentiveHolder(programDetail, index, contractAddress) {
  const { account } = useEthers()
  const [uid] =
    useContractCall(
      account &&
        programDetail.code &&
        contractAddress && {
          abi: referralContractInterface,
          address: contractAddress,
          method: 'holdReferrer',
          args: [programDetail.code, index],
        }
    ) ?? {}
  return uid === '' ? null : uid
} */
