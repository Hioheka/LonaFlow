import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Eğer kullanıcı oturum açmışsa, dashboard'a yönlendir
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
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
