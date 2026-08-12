# PLATAFORMA DE RISCO LOCATÍCIO

Resumo do conceito e fluxo funcional — material para apresentação ao programador

## 1. Objetivo da plataforma

- Criar uma plataforma simples para apoiar imobiliárias na análise de risco antes de uma nova locação.
- A plataforma será uma base colaborativa de informações sobre ocorrências locatícias anteriores.
- O objetivo é reduzir riscos para as imobiliárias, sem transformar o sistema em um cadastro completo de inquilinos.
- A operação deve utilizar o mínimo possível de dados.

## 2. Acesso da imobiliária

- Cada imobiliária terá login e senha próprios.
- Cada imobiliária poderá ter 1 ou 2 usuários autorizados.
- Dados do usuário: nome completo, CPF, data de nascimento, e-mail, login e senha.
- Os usuários terão acesso administrativo dentro da própria imobiliária.

## 3. Tela principal

Após o login, o usuário verá três opções, nesta ordem:

1. CONSULTAR INFORMAÇÕES
2. INSERIR INFORMAÇÕES
3. EXCLUIR INFORMAÇÕES

## 4. Consultar informações

- O usuário clica em CONSULTAR INFORMAÇÕES.
- Será exibido apenas um campo: CPF DO INQUILINO.
- O CPF será a chave principal da consulta.
- Após a consulta, o sistema mostrará uma das duas respostas: NÃO CONSTAM INFORMAÇÕES ou CONSTAM INFORMAÇÕES.
- Quando houver registros, aparecerá o botão VER DETALHES.

## 5. Ver detalhes

- Ao clicar em VER DETALHES, o usuário verá quais tipos de ocorrências existem para aquele CPF.
- Exemplos: inadimplência locatícia, abandono do imóvel, depredação/danos ao imóvel, multa contratual e descumprimento contratual.
- Também poderá aparecer a imobiliária responsável, a data do registro e uma descrição resumida da ocorrência.
- O sistema deve mostrar somente as informações necessárias à finalidade da plataforma.

## 6. Inserir informações

- O usuário clica em INSERIR INFORMAÇÕES.
- Campos: NOME COMPLETO DO INQUILINO e CPF.
- Em seguida, seleciona o tipo de ocorrência.
- Categorias iniciais: abandono do imóvel; inadimplência locatícia; depredação/danos ao imóvel; multa contratual; descumprimento contratual; outros.
- Depois haverá apenas um campo de texto: DESCREVA A OCORRÊNCIA.
- A imobiliária fará uma descrição simples, objetiva e resumida.
- Após a confirmação, o sistema registra automaticamente a imobiliária, o usuário, data, horário, CPF e tipo de ocorrência.

## 7. Excluir informações

- O usuário clica em EXCLUIR INFORMAÇÕES.
- Informa o CPF e consulta os registros que podem ser administrados pela imobiliária responsável.
- Seleciona o registro e confirma a retirada.
- Essa função será utilizada quando a situação tiver sido regularizada ou quando houver fundamento para retirar o registro da consulta, conforme as regras jurídicas e operacionais da plataforma.
- A imobiliária que inseriu o registro será responsável por administrá-lo, conforme as regras definidas.

## 8. Regra de simplicidade

- O sistema deve ser rápido e exigir o mínimo de preenchimento.
- Não haverá, inicialmente, cadastro de endereço, telefone, profissão, renda, patrimônio, dados familiares ou histórico financeiro completo.
- Não haverá score, ranking, lista negra ou aprovação/reprovação automática.
- A decisão final sobre a locação continuará sendo exclusivamente da imobiliária.

## 9. Rastreabilidade

- O sistema deverá registrar tecnicamente quem inseriu, consultou, alterou ou retirou informações, além de data e horário.
- Esses registros servem para segurança, controle e auditoria da plataforma.
- Os detalhes do acesso master do proprietário da plataforma serão definidos em uma etapa posterior do projeto.

## 10. Conceito final

**PLATAFORMA DE RISCO LOCATÍCIO**

Uma plataforma colaborativa de apoio às imobiliárias para consulta e registro objetivo de ocorrências relacionadas a experiências locatícias anteriores.

O foco é: CONSULTAR, INSERIR e EXCLUIR — de forma simples, rápida e com o mínimo necessário de dados.

> **Observação:** este documento é um resumo funcional inicial para orientar o desenvolvimento. Antes da operação com dados reais, o projeto deverá passar por validação jurídica específica de LGPD, governança, responsabilidades, retenção e compartilhamento de dados.
