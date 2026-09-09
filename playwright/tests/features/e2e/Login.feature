Feature: Frontend - Login

  @Frontend @Example @TC-1 
  Scenario: Login con credenciales válidas
    Given el usuario abre la web de Practicas
    When ingresa el usuario "student"
    And ingresa la contraseña "Password123"
    And el usuario hace clic en el botón ingresar
    Then el sistema muestra el titulo "Logged In Successfully"
    And el sistema muestra el mensaje "Congratulations student. You successfully logged in!"


  @Frontend @Example @TC-2 
  Scenario: Login con usuario no valido
    Given el usuario abre la web de Practicas
    When ingresa el usuario "studentIncorrect"
    And ingresa la contraseña "Password123"
    And el usuario hace clic en el botón ingresar
    Then el sistema muestra el mensaje de error "Your username is invalid!"

    

  @Frontend @Example @TC-2
  Scenario: Login con password no valida
    Given el usuario abre la web de Practicas
    When ingresa el usuario "student"
    And ingresa la contraseña "PasswordIncorrect"
    And el usuario hace clic en el botón ingresar
    Then el sistema muestra el mensaje de error "Your password is invalid!"