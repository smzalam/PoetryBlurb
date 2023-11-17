import {
    useMutation,
} from '@tanstack/react-query'
import { createUserAccount, signInAccount } from '../appwrite/api'
import { INewUser } from '@/types'

// returns a mutation that allows to create a new user account in appwrite 
// and save it to the users collection in the database
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string, 
            password: string
        }) => signInAccount(user)
    })
}