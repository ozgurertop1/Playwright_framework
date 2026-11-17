Feature: Ana Sayfa Smoke Testi
  Temel sayfaların erişilebilir olduğunu doğrular.

  Scenario: Kullanıcı ana sayfayı açabilir
    Given kullanıcı ana sayfayı açar
    Then sayfa başlığı görünür
    And sayfa URL'i doğrudur
