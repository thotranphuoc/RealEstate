export interface iMessage {
    type: string,
    title: string,
    content: string
    userID: string,
    date: string,
    state: string,
    pre_state: string,
}

/*
STATE:
- SENDING
- SOLVING
- SOLVED
- CLOSE

 */