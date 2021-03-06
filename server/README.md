# Recuperação de senha

**RF** - Requisitos funcionais:

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF** - Requisitos não-funcionais:

- Utilizar MailTrap para testar envios em ambiente de desenvolvimento;
- Utilizar o Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN** - Regras de negócio:

- O link enviado por e-mail para resetar senha deve expirar em duas horas;
- O usuário precisa confirmar a senha ao resetá-la;

# Atualização do perfil

**RF**

- O usuário deve porder atualizar seu e-mail, nome e senha;

**RN**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário deve confirmar a nova senha;

# Painel do prestador

**RF**

- O usuário deve poder ver todos os seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em *cache*;
- As notificações devem ser armazenadas no *MongoDB*;
- As notificações do prestador devem ser enviadas em tempo real utilizando *Socket.io*;

**RF**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prstadores de serviço cadastrados;
- O usuário deve poder listar, para um prestador, os dias do mês com pelo menos um horário disponível;
- O usuário deve poder listar, para um prestador, os horários disponíveis em um dia;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h *exatamente*;
- Os agendamentos deve estar disponíveis das 8h às 18h (primeiro agendamento às 8h e o último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo;
