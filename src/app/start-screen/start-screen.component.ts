import {ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-start-screen',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatCardModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

}
