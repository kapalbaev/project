//////////CRUD
let productsContainer = $('.products');
let input = $('#username')

async function render() {
    productsContainer.html('')  
    let result = await fetch('http://localhost:8000/products')
    let data = await result.json();

    data.forEach(item => {
        console.log(item)
        productsContainer.append(`
            <div class=card>
                <h1>${item.name}</h1>
                <img src=${item.image}>
                <h3>${item.position}</h3>
                <p>${item.description.slice(0, 120)}...</p>
                <button id=${item.id} class=edit-product>Изменить</button>
                <button id=${item.id} class=delete-product>Удалить</button>
            </div>
            
            `)
    });
}

$('.add-product').on('click', function () {
    let newProduct = {
        name: $('.name').val(),
        position: $('.position').val(),
        description: $('.description').val(),
        image: $('.image').val()
    };

    fetch('http://localhost:8000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    }).then(() => render())
})


let idToEdit = 0;
$('body').on('click', '.edit-product', function (event) {
    fetch(`http://localhost:8000/products/${event.target.id}`)
        .then(res => res.json())
        .then(data => {
            idToEdit = data.id
            $('.edit-name').val(data.name)
            $('.edit-position').val(data.position)
            $('.edit-desc').val(data.description)
            $('.edit-image').val(data.image)
        })
    $('.modal-wrapper').css('display', 'flex')
})

$('.modal button').on('click', function () {
    let productToEdit = {
        name: $('.edit-name').val(),
        price: $('.edit-position').val(),
        description: $('.edit-desc').val(),
        image: $('.edit-image').val()
    }
    fetch(` /${idToEdit}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productToEdit)
    })
        .then(() => render())
    $('.modal-wrapper').css('display', 'none')
})

$('body').on('click', '.delete-product', function (event) {
    fetch(`http://localhost:8000/products/${event.target.id}`, {
        method: 'DELETE'
    })
        .then(() => render())
})
///////////Поиск
input.on('input', function (event) {
    fetch(`http://localhost:8000/products?q=${event.target.value}`)
        .then((res) => res.json())
        .then((data) => {
            productsContainer.html('');
            poisk(data)
        })
})

function poisk(data) {
    data.forEach(item => {
        productsContainer.append(`
         <div class=card>
                <h3>${item.name}</h3>
                <img src=${item.image}>
                <h3>${item.position}</h3>
                <p>${item.description.slice(0, 120)}...</p>
                <button id=${item.id} class=edit-product>Изменить</button>
                <button id=${item.id} class=delete-product>Удалить</button>
            </div>
          `)
    });
    if (data.length < 1) {
        productsContainer.append('<h2>User was not foud!</h2>')
        alert('Пользователь не найден')
        return
    }
}












///Пагинация
// const API = "http://localhost:8000/products";
// let currentPage = 1;
// const paginateContainer = $(".pagination")

// const fetchProducts = async (url) => {
//     try {
//         let response = await fetch(url)
//         let data = await response.json()
//         const total = response.headers.get('X-Total-Count')
//         renderProducts(data)
//         return total
//     } catch (e) {
//         console.log(e);
//     }
// };

// const renderPagination = (total) => {
//     const pages = Math.ceil(total / 3)
//     productsContainer.empty()
//     for (let i = 1; i <= pages; i++) {
//         productsContainer.append(`
//         <a href="#" class="page-item ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</a>
//         `)
//     }
// }

// $("body").on("click", ".page-item", function (e) {
//     currentPage = e.target.dataset.page;
//     $(this).siblings().removeClass("active")
//     $(this).addClass("active")
//     fetchProducts(`${ API } ? _page = ${ currentPage } & _limit=3`)
// });

// $(document).ready(() => {
//     fetchProducts(`${ API } ? _page = ${ currentPage } & _limit=3`).then(total => {
//         renderPagination(total)
//     })
// })






render()
