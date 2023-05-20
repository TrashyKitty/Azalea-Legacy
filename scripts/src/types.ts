type Announcement = {
    text: string,
    author: string,
    date: number
};
type Rule = {
    text: string,
    date: number
};
type NotificationCenterAnnouncements = Announcement[];
type NotificationCenterRules = Rule[];
type PollVotes = {
    player: string,
    playerID: number,
    voteIndex: number
}
type Poll = {
    start: number,
    end: number,
    options: string[],
    author: string,
    votes: PollVotes[]
}
type PollList = Poll[];
type GuildMember = {
    id: number,
    name: string
}
type Guild = {
    ownerID: number,
    members: GuildMember[],
    name: string,
    description: string,
    id: number,
    channels: string[]
}