# KRI Api v1.5.2

## 2023-04-06
1. RS [ADD] Se agregaron los modelos y schemas de Sales, SalesDetails y Customers, para poder realizar las operaciones de ventas
2. RS [FIX] Se cambiaron los mensajes que arrojaban las rutas y ahora se utilizan los mensajes de traducción.
3. RS [ADD] Se agregó la tabla ExpiredAccessTokens para guardar los tokens que se vencen y no se pueden utilizar.

## 2023-02-23
1. RS [FIX] The endpoints /api/auth/refreshtoken and /api/auth/logout now receive the user id in the body

## 2023-02-19
1. RS [ADD] Added mocha and chai dependencies for the tests
2. RS [ADD] Added test folder with the first test
3. RS [ADD] Added test script in package.json
4. RS [ADD] Added I18n-node-yaml dependencies and configuration for translations
