import { Component, Input } from '@angular/core';
import { Achievement } from '../../models/achievement.model';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent {
  @Input() achievement?: Achievement;
}
