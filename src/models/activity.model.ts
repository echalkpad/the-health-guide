export class Activity {
    constructor(
        public name: string = "",
        public met: number = 1,
        public time: number = 1,
        public energy: number = 0
    ) { }
}

export class ActivityGroup {
    constructor(
        public name: string = "",
        public types: Activity[] = [new Activity()]
    ) { }
}

export class ActivityJournal {
    constructor(
        public date: string = "",
        public activities: Activity[] = [],
        public totalEnergy: number = 0,
        public totalDuration: number = 0
    ) { }
}