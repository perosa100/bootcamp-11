# Recuperação de senha

**RF**
Funcionalidades da recuperação da senha:

- o usuário deve poder recuperar sua senha informando o seu e-mail;
- o usuário deve receber um e-mail com recuperação de senha;
- o usuário deve poder resetar sua senha;

**RNF**
São coisas que não são ligadas a regra de negócios:

- usar mailtrap pra testar envios em ambiente de dev;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve açontecer em segundo plano(BackGround job)

**RN**

- o link enviado para e-mail para resetar a senha, deve expirar em 2h;
- o usuário precisa confirmar a nova senha ao resetar a sua senha;

# Atualização do perfil

**RF**

- o usuário deve poder atualizar seu nome,email e senha;
  **RNF**

**RN**

- o usuário não pode alterar seu email para um email já utilizado;
- Para Atualizar sua senha, o usuário deve inserir a senha antiga;
- Para atualizar a senha, o usuário deve precisar informar a senha nova;

# Painel do prestador

**RF**

- O Prestador deve poder listar o seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamendo;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenadas em cache;
- As notificações do prestador deve ser armazenada no MongoDb;
- As notificações do prestador deve ser enviadas em tempo real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

# Agendamendo de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponivel de um prestador;
- O usuário deve poder listar horários disponíveis em um dia espeficio de um prestador;
- O usuário deve poder fazer um agendamento com um prestador;

**RNF**

- A Listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os Agendamentos deve estar disponivéis entre 8h ás 18h (primeiro as 8:00 e o ultimo as 17:00)
- O Usuário não pode agendar em um horário já ocupado;
- O Usuário não pode agendar um horário no passado;
- O Usuário não pode agendar serviços consigo mesmo;
