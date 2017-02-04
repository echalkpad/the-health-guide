// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit  } from '@angular/core';

// THG
import { Auth } from '../auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent  implements OnDestroy, OnInit {
  public auth: Auth = new Auth('', 'https://firebasestorage.googleapis.com/v0/b/the-health-guide.appspot.com/o/user-avatars%2Frazvan.jpg?alt=media&token=d68004d9-36c6-4952-b449-3f6facd40267', 'Razvan');
  constructor(private _detectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
  }

}
