import { Database } from "./db";

export function test() {
    let db = new Database(50);
    db.get("a").then(a=>{
        console.warn(a)
    });
}