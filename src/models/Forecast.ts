import { newMoment } from "../utils/dateUtils";
import { Snapshot } from "./Snapshot";

/** A structure that holds all computed transactions for easy access */
/*
NEEDED OPERATIONS
-----------------

INSERT
Will be used when calculating forecasts and saving new
transaction events. This could be caused by scheduling
a new transaction or updating an existing transaction
in some way that triggers new events to be created.

This will happen once for all transactions the very
first time that the forecast is calculated, and again
for small numbers of events as needed. The events
will not necessarily be added in chronological order.

GET_INTERVAL
Will return all snapshots IN ORDER between two dates.
Will happen frequently, whenever any portion of the forecast
is displayed to the user, or when new calculations are made.

GET_AT_DATE
Not sure yet if this will be necessary externally, but would use
the same logic that GET_INTERVAL would use to find the
state at the beginning of an interval.

CONCLUSION
----------
Reads will be prioritized over writes. Reads will need
to get sequences of data in order, starting at a particular
date. The date may or may not have data associated with it,
so the data that is most recent as of that date will be
used.

Many writes will also require a cascade of changes in
chronological order. Some changes MIGHT require that a
particular snapshot is referenced by ID and located
in order (perhaps for dynamic calculations).

DATA STRUCTURE
--------------
BST sorted by timestamp. Nodes contain timestamp and event ID.
Event ID stored in map with event data and index of tree node.

binary search tree allows quick searching for date.
binary search tree node can be quickly accessed by index.
binary search tree can be traversed in order.

*/

export class ForecastTree {
    private static NearestUnder = "NearestUnder";
    private static NearestAbove = "NearestAbove";

    snapshots = new Map<string, ForecastMapItem>(); // <snapshotId,data>
    treeArray: ForecastTreeNode[] = [];

    constructor() {}

    getById(id) {
        return this.snapshots.get(id);
    }

    getSnapshotAtDate(date): Snapshot {
        date = newMoment(date);
        this.findNearDate(date, ForecastTree.NearestUnder)
    }

	findNearDate() {

	}

    public insert (node:ForecastTreeNode) {
        this.treeArray.push(node)
        this.bubbleUp(this.treeArray.length - 1);
    }

    private isLessThan(a:ForecastTreeNode, b:ForecastTreeNode): boolean {
        return a.timestamp < b.timestamp;
    }

    private bubbleUp(idx:number) {
        if (idx === 0) return;
        let parentIdx = this.parentIdx(idx)
        if (this.isLessThan(this.treeArray[idx], this.treeArray[parentIdx])) {
            // swap places
            let temp = this.treeArray[idx];
            this.treeArray[idx] = this.treeArray[parentIdx];
            this.treeArray[parentIdx] = temp;
            this.bubbleUp(parentIdx)
        }
    }

    private parentIdx(idx:number) {
        return Math.floor((idx-1)/2)
    }


    private leftChildIdx(idx:number) {
        return (idx*2)+1
    }
    private rightChildIdx(idx:number) {
        return (idx*2)+2
    }

    private siftDown(idx:number) {
        let idxToSwap;
        let leftIdx = this.leftChildIdx(idx)
        if (this.treeArray[leftIdx] && this.isLessThan(this.treeArray[leftIdx], this.treeArray[idx])) {
            idxToSwap = leftIdx;
        }
        if (!idxToSwap) {
            let rightIdx = this.rightChildIdx(idx)
            if (this.treeArray[rightIdx] && this.isLessThan(this.treeArray[rightIdx], this.treeArray[idx])) {
                idxToSwap = rightIdx;
            }   
        }
        if (!idxToSwap) return;

        // swap places
        let temp = this.treeArray[idx];
        this.treeArray[idx] = this.treeArray[idxToSwap];
        this.treeArray[idxToSwap] = temp;
        this.siftDown(idxToSwap)
    }


    
    public delete(idx:number): ForecastTreeNode|null {
        if (this.treeArray.length === 0) {
            return null
        }

        let smallest = this.treeArray[idx]

        /* When there are more than one elements in the array, we put the right most element at the first position
            and start comparing nodes with the child nodes
        */
        if (this.treeArray.length === 1) {
            this.treeArray = [];
        }
        else {
            this.treeArray[idx] = this.treeArray[this.treeArray.length-1]
            this.treeArray.splice(this.treeArray.length - 1,1)

            this.siftDown(0);
        }

        return smallest
    }

    updateIndex(id: string, idx: number) {
        let data = this.snapshots.get(id);
        if (data) data.nodeIdx = idx;
    }
}


class ForecastTreeNode {
    private bucket = new Array<string>(); // snapshot ids

    constructor(
        public timestamp: string,
        snapshotId?: string
    ) {
        if (snapshotId) this.bucket.push(snapshotId)
    };

    getAllSnapshots() {
        return this.bucket;
    }

    getSnapshot(snapshotId) {
        return this.bucket.find(id => id === snapshotId)
    }

}

type ForecastMapItem = {
    nodeIdx: number;
    snapshot: Snapshot;

}