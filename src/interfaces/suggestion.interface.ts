export interface iSuggestion {
    title: string,
    content: string,
    date: string,
    userID: string
    state: string
}

/*
State:
-SENDING: user send suggestion to app
-SEND_ACK: app send ack & thanks to user
-UNDERVIEW: app is under review suggestion
-UNDERDEV: app is under developement suggestion
-GOLIVE: suggestion go live
-CLOSE: suggestion closed
-CANCEL: suggestion is canceled;
*/