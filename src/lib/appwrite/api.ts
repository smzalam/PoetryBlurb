import { ID, Query } from 'appwrite';

import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from './config';

// creates new user through appwrite accounts in the Auth section
// gets the avatar picture of the user
// calls the saveUserToDB function to save the new created user into the users collection in the db
// returns the newly created account details
export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if (!newAccount) throw Error;
        const avatarURL = avatars.getInitials(user.name);
        const newUser = await saveUserToDB({
            accountId: newAccount.$id, 
            email: newAccount.email,
            name: newAccount.name,
            username: user.username,
            imageUrl: avatarURL
        })
        console.log(newUser);

        return newAccount;
    } catch (error) {
        console.log(error)
        return error
    }
}

// saves user to specified database and collection and returns new user, otherwise throws error
export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseID, appwriteConfig.usersCollectionID, ID.unique(), user
        )

        return newUser;
    } catch (error) {
        console.log(error)
    }
}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;

    } catch (error) {
        console.log(error)
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseID, 
            appwriteConfig.usersCollectionID, 
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error)
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current")
        console.log(session)
        return session;
    } catch (error) {
        console.log(error)
    }
}