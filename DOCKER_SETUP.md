# LonaFlow Docker Kurulum Kılavuzu

## Swagger Başlatma Sorunu Çözümü

Swagger'ın çalışmamasının nedeni sistemde .NET SDK'nın kurulu olmamasıdır. Bu sorunu çözmek için Docker kullanıyoruz.

## Gereksinimler

- Docker Desktop veya Docker Engine
- Docker Compose

## Hızlı Başlangıç

### 1. Docker Container'ları Başlatma

Proje kök dizininde aşağıdaki komutu çalıştırın:

```bash
docker-compose up -d
```

Bu komut:
- SQL Server veritabanını başlatır (port: 1433)
- .NET Backend API'yi başlatır (port: 5000)
- Tüm bağımlılıkları otomatik olarak kurar

### 2. Swagger UI'a Erişim

Container'lar başladıktan sonra, tarayıcınızda şu adresi açın:

```
http://localhost:5000
```

Swagger UI otomatik olarak root path'de (/) açılacaktır.

### 3. API Endpoint'leri Test Etme

Swagger UI üzerinden:
- Tüm endpoint'leri görebilirsiniz
- API isteklerini test edebilirsiniz
- JWT token ile authentication yapabilirsiniz

## Veritabanı Migration

İlk çalıştırmada veritabanı migration'larını uygulamak için:

```bash
# Backend container'ına bağlan
docker exec -it lonaflow-backend bash

# Migration'ları uygula
dotnet ef database update

# Container'dan çık
exit
```

## Logları İzleme

```bash
# Tüm servislerin loglarını izle
docker-compose logs -f

# Sadece backend loglarını izle
docker-compose logs -f backend

# Sadece veritabanı loglarını izle
docker-compose logs -f sqlserver
```

## Container'ları Durdurma

```bash
# Container'ları durdur
docker-compose down

# Container'ları ve volume'leri sil (veritabanı verilerini temizler)
docker-compose down -v
```

## Sorun Giderme

### Swagger Açılmıyorsa

1. Container'ın çalıştığından emin olun:
   ```bash
   docker ps
   ```

2. Backend loglarını kontrol edin:
   ```bash
   docker-compose logs backend
   ```

3. Container'ı yeniden başlatın:
   ```bash
   docker-compose restart backend
   ```

### Veritabanı Bağlantı Hatası

1. SQL Server'ın tamamen başladığından emin olun (10-15 saniye sürebilir)
2. Health check durumunu kontrol edin:
   ```bash
   docker-compose ps
   ```

### Port Çakışması

Eğer 5000 veya 1433 portları kullanımdaysa, `docker-compose.yml` dosyasında port numaralarını değiştirebilirsiniz:

```yaml
ports:
  - "5001:5000"  # 5000 yerine 5001 kullan
```

## Yapılan Değişiklikler

- ✅ .NET 10.0'dan 9.0'a güncelleme (stabil sürüm)
- ✅ Tüm NuGet paketleri 9.0.0'a güncellendi
- ✅ Dockerfile oluşturuldu (multi-stage build)
- ✅ docker-compose.yml eklendi
- ✅ SQL Server 2022 container yapılandırması
- ✅ Development environment otomatik aktif
- ✅ Swagger UI root path'de (/) kullanıma hazır

## Bağlantı Bilgileri

- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000
- **SQL Server**: localhost:1433
  - User: sa
  - Password: YourStrong@Passw0rd
  - Database: LonaFlowDB
