/*
This is used for storing random things such as player command mode data, commands, database cache, uptime, and more.
This is widely used throughout the project like env.ts, so dont modify too much
*/

const cache = new Map<string, any>();
export { cache };

// Heres a smaller variable, mainly used for storing some players
type AzaleaPlayer = {
  sessionID: number,
  joinedAt: number,
  name: string,
  nameTag: string,
  id: number,
  extras?: string[]
}
const playerCache = new Map<string, AzaleaPlayer>();

export { playerCache }