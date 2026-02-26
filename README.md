# 🛡️ Sistema de Monitoramento e Bloqueio de Conteúdo para Controle Parental

## 📌 Sobre o Projeto

Este projeto foi desenvolvido como **Trabalho de Conclusão de Curso (TCC) em Ciência da Computação** com o objetivo de criar um sistema de monitoramento de tráfego de rede com capacidade de:

- Monitorar domínios acessados por um dispositivo específico  
- Agrupar dispositivos por responsáveis  
- Exibir histórico de acessos  
- Permitir bloqueio e desbloqueio de sites em tempo real  
- Funcionar mesmo fora da rede local, utilizando infraestrutura em nuvem  

A solução foi projetada para auxiliar pais e responsáveis no acompanhamento da vida digital de crianças e adolescentes, oferecendo maior transparência e controle sobre conteúdos acessados.

---

## 🏗️ Arquitetura da Solução

A arquitetura integra dispositivos locais e serviços em nuvem:

### 🔹 Dispositivo Local

- Raspberry Pi  
- Pi-hole (monitoramento via DNS)  
- Identificação por MAC Address  
- Organização por Grupos  

### 🔹 Backend em Nuvem (AWS)

- AWS API Gateway – comunicação entre app e backend  
- AWS Lambda – processamento das requisições  
- AWS IoT Core – comunicação com o Raspberry Pi via 4G  
- Comunicação segura e em tempo real  

### 🔹 Aplicativo Mobile

Desenvolvido com:

- React Native  
- TypeScript  

Funcionalidades:

- Cadastro de grupos  
- Associação de MAC Address  
- Visualização de histórico de acessos  
- Bloqueio e desbloqueio de domínios  

---

## 🔄 Fluxo do Sistema

1. O Raspberry Pi monitora as requisições DNS via Pi-hole.  
2. Os acessos são associados a um grupo específico (via MAC Address).  
3. O aplicativo consome os dados através da API.  
4. O responsável visualiza os domínios acessados.  
5. Ao bloquear um domínio, a requisição é enviada para a AWS.  
6. O IoT Core envia a instrução ao Raspberry Pi para atualização da blocklist.

### Arquitetura: Coleta de Logs
   <img width="713" height="399" alt="image" src="https://github.com/user-attachments/assets/ff5b3a7f-eec4-48ff-ae16-2e302656e15f" />

### Arquitetura: Eventos
   <img width="1692" height="647" alt="image" src="https://github.com/user-attachments/assets/31592f15-dd72-4bca-a985-a6094a857590" />

---

## 🛠️ Tecnologias Utilizadas

### 📱 Mobile

- React Native  
- TypeScript  

### ☁️ Backend / Cloud

- AWS Lambda  
- AWS API Gateway (REST e WebSockets)
- AWS IoT Core
- Python

### 🖥️ Infraestrutura

- Raspberry Pi  
- Pi-hole  
- DNS Filtering  

---

## 🎯 Principais Desafios Técnicos

- Comunicação segura entre aplicativo e Raspberry Pi via 4G  
- Integração entre IoT Core e backend serverless  
- Identificação de dispositivos via IP e Mac Address
- Estruturação de grupos de controle  
- Sincronização de bloqueios em tempo real  

---

## 📊 Objetivo Acadêmico

O projeto explora conceitos de:

- Internet das Coisas (IoT)  
- Arquitetura Serverless  
- Monitoramento de tráfego DNS  
- Integração Cloud

---

## 👩🏻‍💻 Autores

**Júlia Schmidt** - https://github.com/byJuh
**João Pedro Figols** - https://github.com/Jpfigols
**João Pedro de Souza Oliveira** - https://github.com/Joao-Oliveira9
