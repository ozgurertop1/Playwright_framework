Feature: Kullanıcı Girişi
  Kullanıcıların geçerli ve geçersiz kimlik bilgileriyle
  giriş yapabildiğini/yapamadığını doğrular.

  Background:
    Given kullanıcı login sayfasındadır

  Scenario: Geçerli kimlik bilgileriyle başarılı giriş
    When kullanıcı "student" kullanıcı adı ve "Password123" şifresiyle giriş yapar
    Then başarılı giriş mesajı görünür

  Scenario: Geçersiz şifreyle başarısız giriş
    When kullanıcı "student" kullanıcı adı ve "wrongPassword" şifresiyle giriş yapar
    Then hata mesajı "Your password is invalid!" içerir

  Scenario: Geçersiz kullanıcı adıyla başarısız giriş
    When kullanıcı "wrongUser" kullanıcı adı ve "Password123" şifresiyle giriş yapar
    Then hata mesajı "Your username is invalid!" içerir

  Scenario Outline: Farklı geçersiz kimlik bilgileriyle giriş denemeleri
    When kullanıcı "<username>" kullanıcı adı ve "<password>" şifresiyle giriş yapar
    Then hata mesajı "<expectedError>" içerir

    Examples:
      | username   | password      | expectedError            |
      | wrongUser  | Password123   | Your username is invalid |
      | student    | wrongPassword | Your password is invalid |
