//criar atalho para document.querySelector e document.querySelectorAll//
const qs = (el) => document.querySelector(el);
const qa = (el) => document.querySelectorAll(el);

let modalQt = 1;
let cart = [];
let modalKey = 0;

//Listagem das Pizzas//
pizzaJson.map((item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);
    //cloneNode(booleano)pega o item e tudo que tem dentro dele para clonar

    //inserir em pizzaItem qual chave daquela pizza especifica .setAttribute
    pizzaItem.setAttribute('data-key', index);
    //preencher as informações em pizza-item//
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).toString().replace(".", ",")}`;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    //função para abrir o modal.evento de ('click')
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        //especificando para modal qual a pizza que está sendo clicada.getAttribute.
        //ache o elemento mais próximo (closest) - no caso pizzaitem
        //pega a pizza
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        //reseta a quantidade
        modalQt = 1;
        //dizer qual a pizza
        modalKey = key;

        //preencher as informações no modal
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).toString().replace(".", ",")}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });
        qs('.pizzaInfo--qt').innerHTML = modalQt;

        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';

        setTimeout(() => {
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    })

    //saber qual item que está no modal
    //preencher informações de qual pizza

    qs('.pizza-area').append(pizzaItem);
    //append, pega o conteúdo que já tem em pizza-area e adiciona mais um conteúdo na tela(NÃO SUBSTITUI(innet.HTML))
});

//Eventos do Modal//
//evento cancelar e fechar o modal
function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

qa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
});

// Evento de Quantidade de Pizza + - //
qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});
qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        qs('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
//Evento de escolher o tamanho da pizza
qa('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', (e) => {
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

qs('.pizzaInfo--addButton').addEventListener('click', () => {
    //Qual a pizza?

    //Qual o tamanho? 

    //Qual a quantidade?
    //parseInt converte string para inteiro

    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size: size,
            qt: modalQt
        });
    };

    closeModal();
    updateCart();
});

qs('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        qs('aside').style.left = '0';
    }
});

qs('.menu-closer').addEventListener('click', ()=>{
    qs('aside').style.left = '100vw';
});

function updateCart() {
    qs('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = qs('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;

            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                    
                }else{
                    cart.splice(i,1)
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            console.log(pizzaItem)
            qs('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).toString().replace(".",",")}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).toString().replace(".",",")}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).toString().replace(".",",")}`;
    } else {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
}