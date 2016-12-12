export interface Activity {
    name: string;
    types: ActivityType[];
}

export class ActivityType {
    constructor(
        public name: string = "",
        public label: string = "",
        public duration: number = 0,
        public energyConsumption: number = 0,
        public met: number = 1
    ) { }
}

export class ActivityTime {
    constructor(
        public time: string = "",
        public activities: ActivityType[] = [],
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