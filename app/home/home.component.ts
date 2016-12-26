import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'thg-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
   
    constructor(private changeDetectionRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.changeDetectionRef.detectChanges();
    }
}