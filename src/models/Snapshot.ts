import { createId } from "../utils/createId";

export class Snapshot {
    id: string;
    
    constructor(public balances, public mostRecentEvent) {
        this.id = createId()
    }
}
