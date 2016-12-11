export interface ActivityType {
    name: string;
    types: [{
        name: string,
        met: number
    }]
}

export class Activity {
    constructor(
        public name: string = "",
        public duration: number = 0,
        public energyConsumption: number = 0
    ) { }
}

export class ActivityTime {
    constructor(
        public time: string = "",
        public activities: Activity[] = [],
        public duration: number = 0,
        public energyConsumption: number = 0
    ) { }
}

export class ActivityTracker {
    constructor(
        public date: string = "",
        public activityTimes: ActivityTime[] = [],
        public duration: number = 0,
        public energyConsumption: number = 0
    ) { }
}