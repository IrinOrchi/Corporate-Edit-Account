import { Component } from '@angular/core';
import { FooterBottomComponent } from '../footer-bottom/footer-bottom.component';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FooterBottomComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
