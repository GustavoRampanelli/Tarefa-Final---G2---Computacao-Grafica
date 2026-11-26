# Computação Gráfica - Trabalho Final G2

**Projeto Three.js + Rapier3D (Cena Obrigatória + Opção 2 + Cena de Estudo: O Alquimista)**  
Prof. Fahad Kalil

---

## 👥 Integrantes do Grupo
* **Integrante 1:** [Nome Completo]
* **Integrante 2:** [Nome Completo]
* **Integrante 3:** [Nome Completo]

---

## 🚀 Como Executar o Projeto

Como o projeto segue estritamente a arquitetura modular em **Vanilla JavaScript** com ES Modules e Import Maps, **nenhum build/npm é obrigatório**.

### Método 1: Servidor HTTP Python (Recomendado)
1. Abra o terminal na pasta do projeto:
   ```bash
   cd Introducing_the_World_App-main
   ```
2. Inicie o servidor local:
   ```bash
   python -m http.server -b 127.0.0.1 8000
   ```
3. Abra seu navegador em: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

### Método 2: VS Code Live Server
* Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

---

## 📋 Cenas Implementadas

### 1. 🏠 Cena Obrigatória (70% da Nota)
* **Luminária Procedural (Feita do Zero):** Desenvolvida em Three.js nativo (`Lamp.js`) com geometria tubular diagonal no teto, acabamento emissivo intenso e `PointLight` central com projeção de sombras realistas.
* **Física da Cortina com Rapier3D:** A cortina rolô cinza possui sincronização física contínua com RigidBody e colisor através de interpolação cinemática senoidal em loop (`Curtain.js`).
* **Mobiliário e Decoração:** Sofá preto em gomos acolchoados com almofadas coloridas fiéis à foto contendo as estampas em Canvas (*"Inovação"*, *"Colaboração"*, *"Agilidade"*, *"Autonomia"*), poltrona individual de camurça marrom, vaso cônico com folhagem verde e ar-condicionado split.
* **Omissões Respeitadas:**
  * ✅ Sem mesa de centro de vidro;
  * ✅ Sem letras na parede escura;
  * ✅ Sem tubulações descendo do teto até o ar-condicionado.

### 2. 🎨 Opção 2 (30% da Nota)
* **Paredes e Teto Terracota PBR:** Acabamento acetinado no teto com propriedades calibradas (`MeshPhysicalMaterial` com clearcoat) para refletir nitidamente a linha contínua de luz.
* **Fita de LED Linear no Teto:** Barra contínua de alta emissividade combinada com luz descendente gerando a faixa de reflexo horizontal característica no teto e na parte superior das janelas.
* **Janelas e Piso:** Janelão 4 colunas x 2 linhas (8 painéis com vidro noturno escuro e puxadores pretos basculantes) e piso cerâmico claro com reflexão do tom quente da sala.
* **Arquibancada & Puff:** Degraus de madeira escalonados em corte poligonal (chanfros a 45 graus) com tomadas embutidas e puff estofado cilíndrico em primeiro plano.
* **Omissões Respeitadas:**
  * ✅ Sem mesa à esquerda;
  * ✅ Sem almofadas sobre os degraus da arquibancada.

### 3. 🌙 Cena de Estudo: O Alquimista (Paulo Coelho)
* **Grande Lua Cheia:** Textura procedural de alta definição com mares e crateras lunares, envolta por halo de luz aditiva.
* **Céu Estrelado Estilo Van Gogh:** Sistema de partículas (`THREE.Points`) com distribuição em vórtice espiral ao redor da Lua.
* **Pirâmides de Gizé:** As três pirâmides no horizonte com iluminação lunar contrastante (face esquerda intensamente iluminada e face direita sombreada com arestas vivas).
* **Terreno Rochoso do Deserto:** Plano com textura de pedras e pontilhismo com dezenas de seixos 3D espalhados pelo chão.
* **O Viajante com Cajado:** Figura estilizada do viajante de costas com chapéu de abas largas, alforje transversal e cajado fincado no chão, projetando longa sombra em direção ao observador.

---

## 🎮 Interatividade
* **Alternador de Cenas:** Botões no topo da tela para trocar instantaneamente entre a **Cena Obrigatória**, a **Opção 2** e **O Alquimista**.
* **📸 Captura de Tela:** Botão verde dedicado na barra superior que baixa instantaneamente a imagem PNG renderizada em resolução nativa para análise.
* **Menu de Depuração (dat.GUI):** Permite alterar a velocidade do loop da cortina Rapier, pausar a física, reposicionar a câmera e inspecionar fontes de luz e sombras em tempo real.
