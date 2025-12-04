# LonaFlow - Bütçe Takip Uygulaması

Modern, kullanıcı dostu bir bütçe takip ve gelir-gider yönetim uygulaması.

## 🎯 Özellikler

### ✅ Tamamlanan Özellikler
- ✅ Kullanıcı kaydı ve girişi (JWT Authentication)
- ✅ Gelir ve gider kayıtları ekleme/düzenleme/silme
- ✅ Kategori yönetimi
- ✅ Alacaklı/Banka yönetimi
- ✅ Ödeme yöntemi yönetimi (Kredi, Kredi Kartı, Elden, Kredili Mevduat Hesabı)
- ✅ Tekrarlayan ödemeler (Günlük/Haftalık/Aylık)
- ✅ Otomatik tekrarlayan ödeme oluşturma (Background Service)
- ✅ Dashboard API'leri (Gelir/Gider özeti, grafikler)
- ✅ Tarih aralığı ve aylık filtreleme

### 🚧 Devam Eden Geliştirmeler
- 🚧 Dashboard UI (Grafikler ve KPI kartları)
- 🚧 Transaction yönetim sayfaları
- 🚧 Tekrarlayan ödemeler UI
- 🚧 Category/Creditor/PaymentMethod yönetim sayfaları

## 🛠️ Teknoloji Stack

### Backend
- **.NET 8 Web API**
- **Entity Framework Core 8** (Code First)
- **Microsoft SQL Server**
- **ASP.NET Identity** (Kullanıcı yönetimi)
- **JWT Bearer Authentication**
- **Swagger/OpenAPI** (API dokümantasyonu)
- **Background Services** (Tekrarlayan ödemeler)

### Frontend
- **Angular 18**
- **Angular Material** (UI Component Library)
- **NGX-Charts** (Grafik kütüphanesi)
- **RxJS** (Reactive programming)
- **TypeScript**
- **SCSS** (Styling)

### Veritabanı Yapısı
- **Users** (Identity tabloları)
- **Categories** (Kategoriler)
- **Creditors** (Alacaklılar/Bankalar)
- **PaymentMethods** (Ödeme yöntemleri)
- **Transactions** (Gelir/Gider kayıtları)
- **RecurringTransactions** (Tekrarlayan ödemeler)
- **RecurringTransactionInstances** (Oluşturulan otomatik kayıtlar)

## 📋 Kurulum

### Gereksinimler
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 22.x](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server) (LocalDB veya Express)
- [Angular CLI 18](https://angular.io/cli)

### 1. Backend Kurulumu

```bash
# Repository'yi klonlayın
cd backend

# NuGet paketlerini yükleyin
dotnet restore

# Connection string'i düzenleyin
# backend/src/BudgetTracker.API/appsettings.json dosyasını açın
# "DefaultConnection" değerini kendi SQL Server bağlantınıza göre güncelleyin

# Örnek:
# "DefaultConnection": "Server=localhost;Database=LonaFlowDB;Trusted_Connection=True;TrustServerCertificate=True"

# Database migration oluşturun
cd src/BudgetTracker.API
dotnet ef migrations add InitialCreate --project ../BudgetTracker.Data/BudgetTracker.Data.csproj

# Database'i oluşturun
dotnet ef database update --project ../BudgetTracker.Data/BudgetTracker.Data.csproj

# API'yi çalıştırın
dotnet run
# API şu adreste çalışacak: https://localhost:5001
# Swagger UI: https://localhost:5001/swagger

# Not: İlk çalıştırmada otomatik olarak seed data yüklenecektir
# - Demo kullanıcı
# - Türkiye'deki bankalar
# - Örnek kategoriler
# - Örnek ödeme yöntemleri
```

### 2. Frontend Kurulumu

```bash
cd frontend/budget-tracker-app

# NPM paketlerini yükleyin
npm install

# API URL'ini kontrol edin (gerekirse düzenleyin)
# src/app/core/services/auth.service.ts içinde API_URL değişkenini kontrol edin
# Varsayılan: http://localhost:5000/api

# Angular uygulamasını çalıştırın
ng serve

# Uygulama şu adreste çalışacak: http://localhost:4200
```

## 🚀 Çalıştırma

### Backend
```bash
cd backend/src/BudgetTracker.API
dotnet run
```

### Frontend
```bash
cd frontend/budget-tracker-app
ng serve
```

**Tarayıcınızda açın:** http://localhost:4200

## 📱 Kullanım

### Demo Kullanıcı 🎭

Uygulamayı hızlıca test etmek için hazır demo kullanıcısı:

**Email:** demo@lonaflow.com
**Şifre:** Demo123!

Demo kullanıcı ile birlikte otomatik olarak şunlar yüklenmiştir:
- ✅ **11 Türk Bankası:** Akbank, Garanti BBVA, İş Bankası, Yapı Kredi, Ziraat Bankası, Halkbank, Vakıfbank, QNB Finansbank, Denizbank, TEB, ING
- ✅ **Fatura Alacaklıları:** Ev Sahibi, Elektrik, Su, Doğalgaz şirketleri
- ✅ **11 Ödeme Yöntemi:** Kredi kartları, krediler, KMH'ler ve nakit
- ✅ **18 Kategori:** Kira, Market, Faturalar, Ulaşım, Sağlık, Eğitim, Eğlence, Abonelikler vb.

### 1. Kayıt Ol
- Uygulamayı açın
- "Kayıt Ol" butonuna tıklayın
- Ad, Soyad, Email ve Şifre bilgilerinizi girin
- "Kayıt Ol" butonuna tıklayın

### 2. Giriş Yap
- Email ve şifrenizi girin (veya demo kullanıcıyı kullanın)
- "Giriş Yap" butonuna tıklayın

### 3. Dashboard
- Giriş yaptıktan sonra Dashboard sayfasına yönlendirileceksiniz
- Hızlı işlemler bölümünden kategori, ödeme yöntemi, alacaklı ve işlem ekleyebilirsiniz

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Transactions
- `GET /api/transactions` - Tüm işlemleri listele
- `GET /api/transactions/{id}` - İşlem detayı
- `GET /api/transactions/date-range?startDate={date}&endDate={date}` - Tarih aralığına göre listele
- `POST /api/transactions` - Yeni işlem ekle
- `PUT /api/transactions/{id}` - İşlem güncelle
- `DELETE /api/transactions/{id}` - İşlem sil

### Categories
- `GET /api/categories` - Tüm kategorileri listele
- `POST /api/categories` - Yeni kategori ekle
- `PUT /api/categories/{id}` - Kategori güncelle
- `DELETE /api/categories/{id}` - Kategori sil

### Creditors
- `GET /api/creditors` - Tüm alacaklıları listele
- `POST /api/creditors` - Yeni alacaklı ekle
- `PUT /api/creditors/{id}` - Alacaklı güncelle
- `DELETE /api/creditors/{id}` - Alacaklı sil

### Payment Methods
- `GET /api/paymentmethods` - Tüm ödeme yöntemlerini listele
- `POST /api/paymentmethods` - Yeni ödeme yöntemi ekle
- `PUT /api/paymentmethods/{id}` - Ödeme yöntemi güncelle
- `DELETE /api/paymentmethods/{id}` - Ödeme yöntemi sil

### Recurring Transactions
- `GET /api/recurringtransactions` - Tüm tekrarlayan ödemeleri listele
- `GET /api/recurringtransactions/active` - Aktif tekrarlayan ödemeleri listele
- `POST /api/recurringtransactions` - Yeni tekrarlayan ödeme ekle
- `PUT /api/recurringtransactions/{id}` - Tekrarlayan ödeme güncelle
- `DELETE /api/recurringtransactions/{id}` - Tekrarlayan ödeme sil

### Dashboard
- `GET /api/dashboard/summary?startDate={date}&endDate={date}` - Tarih aralığı özeti
- `GET /api/dashboard/monthly?year={year}&month={month}` - Aylık özet

## 📊 Veri Modeli

### Transaction Types
- `1` - Gelir (Income)
- `2` - Gider (Expense)

### Payment Method Types
- `1` - Kredi
- `2` - Kredi Kartı
- `3` - Elden Ödeme
- `4` - Kredili Mevduat Hesabı (KMH)

### Recurrence Frequency
- `1` - Günlük (Daily)
- `2` - Haftalık (Weekly)
- `3` - Aylık (Monthly)

## 🔐 Güvenlik

- JWT token tabanlı authentication
- Password hashing (ASP.NET Identity)
- Token süre sonu kontrolü
- HTTP interceptor ile otomatik token ekleme
- Auth guard ile route koruması

## 🎨 UI/UX Özellikleri

- Material Design
- Responsive tasarım
- Form validasyonları
- Loading states
- Error handling ve kullanıcı bildirimleri (Snackbar)

## 🔄 Background Service

Uygulama, her saat başı çalışan bir background service içerir:
- Aktif tekrarlayan ödemeleri kontrol eder
- Vadesi gelen ödemeleri otomatik olarak oluşturur
- Bir sonraki vade tarihini hesaplar
- İşlem kayıtlarını oluşturur

## 🎁 Seed Data (Otomatik Yüklenen Veriler)

Backend ilk kez çalıştırıldığında otomatik olarak şu veriler yüklenir:

### 🏦 Bankalar ve Alacaklılar (15 adet)
- Akbank, Garanti BBVA, İş Bankası, Yapı Kredi, Ziraat Bankası
- Halkbank, Vakıfbank, QNB Finansbank, Denizbank, TEB, ING
- Ev Sahibi, Elektrik Dağıtım Şirketi, Su ve Kanalizasyon İdaresi, Doğalgaz Dağıtım Şirketi

### 💳 Ödeme Yöntemleri (11 adet)
**Kredi Kartları:**
- Akbank Kredi Kartı (Maximum, Axess)
- Garanti BBVA Kredi Kartı (Bonus, Wings)
- İş Bankası Kredi Kartı
- Yapı Kredi WorldCard

**Krediler:**
- Akbank İhtiyaç Kredisi
- Ziraat Bankası Konut Kredisi
- Garanti BBVA Taşıt Kredisi

**KMH ve Nakit:**
- Akbank KMH, İş Bankası KMH
- Nakit, Banka Kartı (Vadesiz)

### 📂 Kategoriler (18 adet)

**Gider Kategorileri:**
- Kira (Ev, ofis veya işyeri kirası)
- Market (Gıda ve temizlik)
- Elektrik, Su, Doğalgaz (Faturalar)
- İnternet (İnternet ve telefon)
- Ulaşım (Yakıt, toplu taşıma)
- Sağlık (İlaç, doktor)
- Eğitim (Okul, kurs)
- Eğlence (Sinema, tiyatro)
- Giyim (Kıyafet, ayakkabı)
- Abonelikler (Netflix, Spotify, YouTube Premium)
- Restoran & Cafe
- Tamirat & Bakım
- Sigorta

**Gelir Kategorileri:**
- Maaş
- Yatırım Geliri
- Serbest Çalışma

## 📝 Gelecek Geliştirmeler

### UI Components (Yüksek Öncelik)
- [x] Ürün ekleme sayfaları (PaymentMethod, Category, Creditor)
- [x] Dashboard hızlı işlemler bölümü
- [ ] Dashboard grafikler (Pasta, Çizgi, Bar grafikleri)
- [ ] KPI kartları (Toplam gelir, gider, bakiye, tasarruf oranı)
- [ ] Transaction list ve form sayfaları
- [ ] Recurring transaction yönetim sayfası
- [ ] Category/Creditor/PaymentMethod yönetim sayfaları (listeleme ve düzenleme)

### Ek Özellikler
- [ ] Excel export
- [ ] PDF raporlar
- [ ] E-posta bildirimleri
- [ ] Döviz kuru desteği
- [ ] Bütçe hedefleri
- [ ] Kategori bazlı bütçe limitleri
- [ ] Mobil uygulama (Ionic/React Native)

### Teknik İyileştirmeler
- [ ] Unit tests (xUnit)
- [ ] Integration tests
- [ ] Angular test coverage
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Logging (Serilog)
- [ ] Caching (Redis)

## 🐛 Bilinen Sorunlar

- Frontend'de bazı CRUD sayfaları henüz tamamlanmadı
- Dashboard grafikleri görsel olarak eklenmedi (API hazır)
- NGX-Charts entegrasyonu yapılacak

## 📖 Geliştirici Notları

### Database Migration Komutları
```bash
# Yeni migration oluştur
dotnet ef migrations add MigrationName --project ../BudgetTracker.Data/BudgetTracker.Data.csproj

# Database güncelle
dotnet ef database update --project ../BudgetTracker.Data/BudgetTracker.Data.csproj

# Son migration'ı geri al
dotnet ef migrations remove --project ../BudgetTracker.Data/BudgetTracker.Data.csproj
```

### Angular Component Oluşturma
```bash
# Yeni component oluştur
ng generate component features/transactions/transaction-list --standalone

# Yeni service oluştur
ng generate service shared/services/transaction
```

## 📄 Lisans

Bu proje özel kullanım içindir.

## 👥 İletişim

Sorularınız için:
- GitHub Issues kullanabilirsiniz

---

**Not:** Proje aktif geliştirme aşamasındadır. Katkılarınızı bekliyoruz! 🚀
