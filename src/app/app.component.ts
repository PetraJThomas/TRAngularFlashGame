import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Import RouterModule

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Ensure standalone mode
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule] // ✅ Explicitly import routing features
})
export class AppComponent {
  title = 'TRAngularFlashGame';
}
