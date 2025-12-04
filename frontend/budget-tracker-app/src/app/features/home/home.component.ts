import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  features = [
    {
      icon: '💰',
      title: 'Bütçe Yönetimi',
      description: 'Gelir ve giderlerinizi kolayca takip edin ve bütçenizi kontrol altında tutun.'
    },
    {
      icon: '📊',
      title: 'Detaylı Raporlar',
      description: 'Harcama alışkanlıklarınızı analiz edin ve bilinçli kararlar alın.'
    },
    {
      icon: '🎯',
      title: 'Hedef Belirleme',
      description: 'Finansal hedeflerinizi belirleyin ve ilerlemenizi takip edin.'
    },
    {
      icon: '📱',
      title: 'Kolay Kullanım',
      description: 'Sade ve kullanıcı dostu arayüz ile hızlı işlem yapın.'
    },
    {
      icon: '🔒',
      title: 'Güvenli',
      description: 'Verileriniz güvenli bir şekilde saklanır ve korunur.'
    },
    {
      icon: '📈',
      title: 'Gelişmiş Analiz',
      description: 'Grafik ve tablolarla mali durumunuzu görselleştirin.'
    }
  ];
}
