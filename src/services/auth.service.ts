import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable()


export class AuthService {
    isSigned: boolean = false;
    uid: string;
    email: string;
    signIn(email: string, pass: string): firebase.Promise<any>{
        return firebase.auth().signInWithEmailAndPassword(email, pass)
    }

    signUp(email: string, pass: string): firebase.Promise<any>{
        return firebase.auth().createUserWithEmailAndPassword(email, pass)
    }

    signOut(): firebase.Promise<any>{
        return firebase.auth().signOut();
    }

    resetAccount(email: string): firebase.Promise<any>{
        return firebase.auth().sendPasswordResetEmail(email);
    }

    

}