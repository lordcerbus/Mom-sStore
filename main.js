 // Dados dos produtos
    const produtos = [
      { 
        id: 1, 
        nome: "Colar Dourado Elegance", 
        preco: 120.00, 
        categoria: "Colares", 
        imagem: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        descricao: "Colar em dourado 18k com pingente em formato de coração. Perfeito para ocasiões especiais."
      },
      { 
        id: 2, 
        nome: "Anel Rosa Luxo", 
        preco: 95.50, 
        categoria: "Anéis", 
        imagem: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        descricao: "Anel em prata rosé com detalhes em zircônia. Disponível nos tamanhos 15 a 20."
      },
      { 
        id: 3, 
        nome: "Brincos Pérola Clássica", 
        preco: 70.00, 
        categoria: "Brincos", 
        imagem: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        descricao: "Brincos clássicos com pérolas cultivadas. Ideal para looks sofisticados."
      },
      { 
        id: 4, 
        nome: "Pulseira Charme", 
        preco: 49.90, 
        categoria: "Pulseiras", 
        imagem: "https://images.unsplash.com/photo-1608042314453-ae33882e6da1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        descricao: "Pulseira em prata 925 com diversos charms intercambiáveis."
      },
      { 
        id: 5, 
        nome: "Tornozeleira Fina", 
        preco: 39.90, 
        categoria: "Tornozeleiras", 
        imagem: "https://images.unsplash.com/photo-1605106715994-18d3fecffb98?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        descricao: "Tornozeleira delicada em ouro banhado a prata. Ajustável para todos os tamanhos."
      },
    ];

    // Elementos do DOM
    const catalogo = document.getElementById("catalogo");
    const listaCarrinho = document.getElementById("lista-carrinho");
    const totalSpan = document.getElementById("total");
    const busca = document.getElementById("busca");
    const filtroPreco = document.getElementById("preco");
    const filtroCategoria = document.getElementById("categoria");
    const cartBtn = document.getElementById("cart-btn");
    const closeCartBtn = document.getElementById("close-cart");
    const carrinhoElement = document.getElementById("carrinho");
    const cartCount = document.getElementById("cart-count");
    const loginBtn = document.getElementById("login-btn");
    const favoritesBtn = document.getElementById("favorites-btn");
    const whatsappBtn = document.getElementById("whatsapp-btn");
    
    // Modais
    const loginModal = document.getElementById("login-modal");
    const productModal = document.getElementById("product-modal");
    const checkoutModal = document.getElementById("checkout-modal");
    const favoritesModal = document.getElementById("favorites-modal");
    const closeModalBtns = document.querySelectorAll(".close-modal");
    
    // Formulários
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const switchToRegister = document.getElementById("switch-to-register");
    const switchToLogin = document.getElementById("switch-to-login");
    const doLogin = document.getElementById("do-login");
    const doRegister = document.getElementById("do-register");
    const checkoutForm = document.getElementById("checkout-form");
    
    // Estado da aplicação
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || {};
    
    // Inicialização
    document.addEventListener("DOMContentLoaded", () => {
      renderizarCatalogo();
      atualizarCarrinho();
      verificarLogin();
      
      // Event Listeners
      cartBtn.addEventListener("click", toggleCarrinho);
      closeCartBtn.addEventListener("click", toggleCarrinho);
      busca.addEventListener("input", filtrarProdutos);
      filtroPreco.addEventListener("change", filtrarProdutos);
      filtroCategoria.addEventListener("change", filtrarProdutos);
      loginBtn.addEventListener("click", () => abrirModal(loginModal));
      favoritesBtn.addEventListener("click", () => {
        abrirModal(favoritesModal);
        renderizarFavoritos();
      });
      
      // Checkout
      document.getElementById("checkout-btn").addEventListener("click", () => {
        if (carrinho.length === 0) {
          alert("Seu carrinho está vazio!");
          return;
        }
        abrirModal(checkoutModal);
        atualizarWhatsAppButton();
      });
      
      // Atualizar botão do WhatsApp quando os dados mudam
      checkoutForm.addEventListener("input", atualizarWhatsAppButton);
      
      // Fechar modais
      closeModalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const modal = btn.closest(".modal");
          fecharModal(modal);
        });
      });
      
      // Login/Registro
      switchToRegister.addEventListener("click", () => {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        document.getElementById("login-modal-title").textContent = "Criar Conta";
      });
      
      switchToLogin.addEventListener("click", () => {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        document.getElementById("login-modal-title").textContent = "Entrar";
      });
      
      doLogin.addEventListener("click", fazerLogin);
      doRegister.addEventListener("click", fazerRegistro);
      
      // Fechar modal ao clicar fora
      document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            fecharModal(modal);
          }
        });
      });
    });
    
    // Adicionar máscara para o telefone
    document.getElementById('checkout-phone').addEventListener('input', function(e) {
      const x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
      
      // Validar enquanto digita
      validarWhatsApp();
    });

    // Função para validar WhatsApp
    function validarWhatsApp() {
      const phoneInput = document.getElementById('checkout-phone');
      const phoneValidation = document.getElementById('phone-validation');
      const phoneNumber = phoneInput.value.replace(/\D/g, '');
      
      // WhatsApp deve ter pelo menos 10 dígitos (DDD + número)
      if (phoneNumber.length >= 11) {
        phoneInput.classList.remove('invalid');
        phoneValidation.style.display = 'none';
        return true;
      } else {
        phoneInput.classList.add('invalid');
        phoneValidation.style.display = 'block';
        return false;
      }
    }

    // Função para validar todos os campos
    function validarFormulario(event) {
      const nameInput = document.getElementById('checkout-name');
      const addressInput = document.getElementById('checkout-address');
      let isValid = true;
      
      // Validar nome
      if (nameInput.value.trim() === '') {
        nameInput.classList.add('invalid');
        document.getElementById('name-validation').style.display = 'block';
        isValid = false;
      } else {
        nameInput.classList.remove('invalid');
        document.getElementById('name-validation').style.display = 'none';
      }
      
      // Validar WhatsApp
      const phoneValid = validarWhatsApp();
      if (!phoneValid) isValid = false;
      
      // Validar endereço
      if (addressInput.value.trim() === '') {
        addressInput.classList.add('invalid');
        document.getElementById('address-validation').style.display = 'block';
        isValid = false;
      } else {
        addressInput.classList.remove('invalid');
        document.getElementById('address-validation').style.display = 'none';
      }
      
      // Se não for válido, prevenir o envio
      if (!isValid) {
        event.preventDefault();
        alert('Por favor, preencha todos os campos obrigatórios corretamente.');
        return false;
      }
      
      // Se tudo estiver válido, atualizar o link do WhatsApp
      atualizarWhatsAppButton();
      return true;
    }

    // Função para atualizar o botão do WhatsApp
    function atualizarWhatsAppButton() {
      const nome = document.getElementById("checkout-name").value || "Cliente";
      const telefone = document.getElementById("checkout-phone").value.replace(/\D/g, '') || "";
      const email = document.getElementById("checkout-email").value || "";
      const endereco = document.getElementById("checkout-address").value || "";
      const observacoes = document.getElementById("checkout-notes").value || "";
      
      // Formatar mensagem do pedido
      let mensagem = `Olá Cerbu's Semi Jóias! Gostaria de fazer um pedido:\n\n`;
      mensagem += `*Itens do Pedido:*\n`;
      
      let total = 0;
      carrinho.forEach(item => {
        const produto = produtos.find(p => p.id === item.id);
        if (produto) {
          mensagem += `- ${produto.nome}: R$ ${produto.preco.toFixed(2)}\n`;
          total += produto.preco;
        }
      });
      
      mensagem += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
      mensagem += `*Dados do Cliente:*\n`;
      mensagem += `Nome: ${nome}\n`;
      mensagem += `WhatsApp: ${telefone}\n`;
      if (email) mensagem += `Email: ${email}\n`;
      mensagem += `Endereço: ${endereco}\n`;
      if (observacoes) mensagem += `Observações: ${observacoes}\n`;
      
      mensagem += `\nPor favor, confirme meu pedido e informe as formas de pagamento disponíveis. Obrigada!`;
      
      const numeroWhatsAppLoja = "5532999182852"; 
      
      // Codificar a mensagem para URL
      const mensagemCodificada = encodeURIComponent(mensagem);
      
      // Atualizar o link do WhatsApp
      const whatsappBtn = document.getElementById("whatsapp-btn");
      whatsappBtn.href = `https://wa.me/${numeroWhatsAppLoja}?text=${mensagemCodificada}`;
    }

    // Atualizar o evento do formulário
    checkoutForm.addEventListener("submit", function(e) {
      e.preventDefault();
      if (validarFormulario(e)) {
        // O link do WhatsApp já foi atualizado pela função validarFormulario
        // O clique no botão já abre o WhatsApp
      }
    });
    
    // Funções do catálogo
    function filtrarProdutos() {
      renderizarCatalogo(
        busca.value,
        filtroPreco.value,
        filtroCategoria.value
      );
    }
    
    function renderizarCatalogo(filtroNome = "", precoMax = null, categoria = "") {
      catalogo.innerHTML = "";
      
      const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
        (!precoMax || p.preco <= precoMax) &&
        (!categoria || p.categoria === categoria)
      );
      
      if (produtosFiltrados.length === 0) {
        catalogo.innerHTML = `<p style="text-align: center; width: 100%;">Nenhum produto encontrado.</p>`;
        return;
      }
      
      produtosFiltrados.forEach(produto => {
        const isFavorito = usuarioLogado && favoritos[usuarioLogado.email]?.includes(produto.id);
        
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <div class="favorite ${isFavorito ? 'active' : ''}" onclick="alternarFavorito(${produto.id}, this)">
            <i class="fas fa-heart"></i>
          </div>
          <img src="${produto.imagem}" alt="${produto.nome}" onclick="abrirPaginaProduto(${produto.id})">
          <h3>${produto.nome}</h3>
          <p class="price">R$ ${produto.preco.toFixed(2)}</p>
          <button onclick="adicionarAoCarrinho(${produto.id})">Comprar</button>
        `;
        catalogo.appendChild(card);
      });
    }
    
    // Funções do carrinho
    function toggleCarrinho() {
      carrinhoElement.classList.toggle("ativo");
    }
    
    function atualizarCarrinho() {
      listaCarrinho.innerHTML = "";
      let total = 0;
      
      carrinho.forEach((item, index) => {
        const produto = produtos.find(p => p.id === item.id);
        if (!produto) return;
        
        const li = document.createElement("li");
        li.innerHTML = `
          ${produto.nome} - R$ ${produto.preco.toFixed(2)}
          <button class="cart-item-remove" onclick="removerDoCarrinho(${index})">
            <i class="fas fa-trash"></i>
          </button>
        `;
        listaCarrinho.appendChild(li);
        total += produto.preco;
      });
      
      totalSpan.textContent = total.toFixed(2);
      cartCount.textContent = carrinho.length;
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }
    
    function adicionarAoCarrinho(produtoId) {
      const produto = produtos.find(p => p.id === produtoId);
      if (!produto) return;
      
      carrinho.push({ id: produto.id });
      atualizarCarrinho();
      
      // Feedback visual
      const cartIcon = cartBtn.querySelector("i");
      cartIcon.classList.add("animate__animated", "animate__bounce");
      setTimeout(() => {
        cartIcon.classList.remove("animate__animated", "animate__bounce");
      }, 1000);
    }
    
    function removerDoCarrinho(index) {
      carrinho.splice(index, 1);
      atualizarCarrinho();
    }
    
    // Funções de login/registro
    function verificarLogin() {
      if (usuarioLogado) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${usuarioLogado.nome.split(" ")[0]}`;
        favoritesBtn.style.display = "block";
      } else {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> Entrar`;
        favoritesBtn.style.display = "none";
      }
    }
    
    function fazerLogin() {
      const email = document.getElementById("login-email").value;
      const senha = document.getElementById("login-password").value;
      
      if (!email || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
      }
      
      // Simulação de login - em uma aplicação real, isso seria uma chamada ao servidor
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const usuario = usuarios.find(u => u.email === email && u.senha === senha);
      
      if (usuario) {
        usuarioLogado = { email: usuario.email, nome: usuario.nome };
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
        fecharModal(loginModal);
        verificarLogin();
        renderizarCatalogo();
        alert(`Bem-vindo(a) de volta, ${usuario.nome.split(" ")[0]}!`);
      } else {
        alert("Email ou senha incorretos!");
      }
    }
    
    function fazerRegistro() {
      const nome = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const senha = document.getElementById("register-password").value;
      
      if (!nome || !email || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
      }
      
      // Simulação de registro
      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      
      if (usuarios.some(u => u.email === email)) {
        alert("Este email já está cadastrado!");
        return;
      }
      
      const novoUsuario = { nome, email, senha };
      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      
      usuarioLogado = { email, nome };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      
      // Inicializa favoritos para o novo usuário
      if (!favoritos[email]) {
        favoritos[email] = [];
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
      }
      
      fecharModal(loginModal);
      verificarLogin();
      renderizarCatalogo();
      alert(`Cadastro realizado com sucesso, ${nome.split(" ")[0]}!`);
    }
    
    function fazerLogout() {
      usuarioLogado = null;
      localStorage.removeItem("usuarioLogado");
      verificarLogin();
      renderizarCatalogo();
    }
    
    // Funções de favoritos
    function alternarFavorito(produtoId, elemento) {
      if (!usuarioLogado) {
        alert("Por favor, faça login para adicionar aos favoritos!");
        abrirModal(loginModal);
        return;
      }
      
      const usuarioEmail = usuarioLogado.email;
      
      if (!favoritos[usuarioEmail]) {
        favoritos[usuarioEmail] = [];
      }
      
      const index = favoritos[usuarioEmail].indexOf(produtoId);
      
      if (index === -1) {
        favoritos[usuarioEmail].push(produtoId);
        elemento.classList.add("active");
      } else {
        favoritos[usuarioEmail].splice(index, 1);
        elemento.classList.remove("active");
      }
      
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }
    
    function renderizarFavoritos() {
      const favoritesList = document.getElementById("favorites-list");
      favoritesList.innerHTML = "";
      
      if (!usuarioLogado || !favoritos[usuarioLogado.email] || favoritos[usuarioLogado.email].length === 0) {
        favoritesList.innerHTML = `<p style="text-align: center; padding: 20px;">Nenhum produto favoritado ainda.</p>`;
        return;
      }
      
      favoritos[usuarioLogado.email].forEach(produtoId => {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) return;
        
        const item = document.createElement("div");
        item.className = "product-card";
        item.style.margin = "10px 0";
        item.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" style="height: 120px;">
          <h3>${produto.nome}</h3>
          <p class="price">R$ ${produto.preco.toFixed(2)}</p>
          <button onclick="adicionarAoCarrinho(${produto.id})">Comprar</button>
        `;
        favoritesList.appendChild(item);
      });
    }
    
    // Funções de produto
    function abrirPaginaProduto(produtoId) {
      const produto = produtos.find(p => p.id === produtoId);
      if (!produto) return;
      
      document.getElementById("product-modal-title").textContent = produto.nome;
      document.getElementById("product-modal-name").textContent = produto.nome;
      document.getElementById("product-modal-image").src = produto.imagem;
      document.getElementById("product-modal-category").textContent = produto.categoria;
      document.getElementById("product-modal-price").textContent = `R$ ${produto.preco.toFixed(2)}`;
      document.getElementById("product-modal-description").textContent = produto.descricao;
      document.getElementById("add-to-cart-from-modal").onclick = () => {
        adicionarAoCarrinho(produto.id);
        fecharModal(productModal);
      };
      
      abrirModal(productModal);
    }
    
    // Funções auxiliares
    function abrirModal(modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
    
    function fecharModal(modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
    
    // Adicionando logout ao botão de login quando logado
    loginBtn.addEventListener("click", function() {
      if (usuarioLogado) {
        if (confirm(`Deseja sair da conta ${usuarioLogado.nome.split(" ")[0]}?`)) {
          fazerLogout();
        }
      }
    });
