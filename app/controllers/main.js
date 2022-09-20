getProducts();
let productList = [];

// Viết function getProducts
function getProducts(searchTerm) {
    apiGetProducts(searchTerm)
        .then((response) => {
            productList = response.data.map((product) => {
                return new Product(
                    product.id,
                    product.name,
                    product.price,
                    product.screen,
                    product.backCamera,
                    product.frontCamera,
                    product.img,
                    product.desc,
                    product.type
                );
            });
            // Hiển thị danh sách sản phẩm ra giao diện
            display(productList);
        })
        .catch((error) => {
            console.log(error);
        });
}

function filterByType(type) {
    apiGetType(type)
        .then((response) => {
            let newProducts = response.data.filter((product) => {
                return (product.type = type);
            });

            if (newProducts.length > 0) {
                display(newProducts);
            } else {
                display(productList);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}


let cartList = [];

// // Lấy dữ liệu giỏ hàng từ localStorage
cartList = JSON.parse(localStorage.getItem("cartList")) || [];

// // hiển thị danh sách giỏ hàng đã lưu ở localStorage
renderCart(cartList);

// Lắng nghe sự kiện add to card
dom("#divproduct").addEventListener("click", (evt) => {
    let id = evt.target.getAttribute("data-id");
    let elType = evt.target.getAttribute("data-type");

    if (elType == "add") {
        // duyệt qua List sản phẩm, trả về sản phẩm có id trùng với id lấy đc
        let product = productList.filter((product) => {
            return product.id === id;
        });
        // tạo đối tượng mới
        let cartItem = {
            product: { ...product },
            quantity: 1,
        };

        //duyệt qua List giỏ hàng, kiểm tra xem có sản phẩm nào trùng id với id vừa lấy đc
        let stamp = cartList.find((cartItem) => {
            return cartItem.product[0].id === id;
        });


        if (stamp === undefined) {
            cartList.push(cartItem); // nếu ko có thì undefined => push vào giỏ hàng
        } else {
            stamp.quantity++; // nếu có trùng thì trả về object trùng => +1 số lượng SP trong giỏ lên
        }

        total();

        // lưu vào local Storage mỗi khi thêm sản phẩm
        window.localStorage.setItem("cartList", JSON.stringify(cartList));
        // hiển thị giỏ hàng lên giao diện
        renderCart(cartList);
    }
});

//hàm tính tổng tiền & tính tổng số lượng sản phẩm trong cartList
function total() {
    let total = 0;
    let totalQuantity = 0;
    cartList.forEach((cartItem) => {
        let stamp = +cartItem.product[0].price * + cartItem.quantity;
        total += stamp;
        totalQuantity += +cartItem.quantity;
    })

    // tổng số lượng sản phẩm trong cartList
    dom('.total__quantity').innerHTML = totalQuantity;
    // tổng tiền trong cartList
    dom('.card__total strong span').innerHTML = total.toLocaleString();

}
total()

// Xử lý nút tăng, giảm, xóa
document.querySelector('.cart__item').addEventListener('click', (evt) => {
    let elementType = evt.target.getAttribute('data-type');
    let id = evt.target.getAttribute('data-id');

    let stamp = cartList.find((cartItem) => {
        return cartItem.product[0].id === id;
    })

    let stampIndex = cartList.findIndex((cartItem) => {
        return cartItem.product[0].id === id;
    })

    if (elementType === 'down') {
        stamp.quantity--;
        if (stamp.quantity === 0) {
            cartList.splice(stampIndex, 1);
        }
    } else if (elementType === 'up') {
        stamp.quantity++;
    } else if (elementType === 'delete') {
        if (stampIndex != -1) {
            cartList.splice(stampIndex, 1);
        }
    }
    total();
    window.localStorage.setItem('cartList', JSON.stringify(cartList));
    renderCart(cartList);
})

// Xử lý nút CLEAR, Purchase
dom('.btn__card').addEventListener('click', (evt) => {
    let elementType = evt.target.getAttribute('data-type');

    if (elementType === 'clear' || elementType === 'purchase') {
        cartList.splice(0);
    }
    total();

    window.localStorage.setItem('cartList', JSON.stringify(cartList));

    renderCart(cartList);
})
// Hàm hiển thị giỏ hàng
function renderCart(cartList) {
    let content = `
    <div>
        <p>Không có sản phẩm trong giỏ hàng</p>
    </div>`;
    content = cartList.reduce((result, cartItem) => {

        return (
            result +
            `
            <div class="row rule">
                <div class="col-2"><img src="${cartItem.product[0].img}" width ="50px" height = "50px"></div>
                <div class="col-4">${cartItem.product[0].name}</div>
                <div class="col-3">
                    <span>
                        <i class="fa-solid fa-angle-left" data-id="${cartItem.product[0].id}" data-type="down"></i>
                            ${cartItem.quantity}
                        <i class="fa-solid fa-angle-right" data-id="${cartItem.product[0].id}" data-type="up"></i>
                    </span>
                </div>
                <div class="col-2">${(+cartItem.product[0].price).toLocaleString()}</div>
                <div class="col-1"><i class="fa-solid fa-trash" data-id="${cartItem.product[0].id}" data-type="delete"></i></div>
            </div>     
      `);
    }, "");
    dom(".cart__item").innerHTML = content;
}
// Hàm hiển thị thông tin trang index
function display(productList) {
    let output = productList.reduce((result, product, index) => {
        return (
            result +
            `
        <div class="product__item col-md-6 col-xl-3" >
            <div class="card">
                <div class="card__img">
                    <img src="${product.img}" alt="Card image">
                </div>
                <div class="card-body">
                    <h2 class="card-title">${product.name}</h2>
                    <p class="card-text">Price: $${product.price}</p>
                    <button class="btn btn-add" data-type="add" data-id="${product.id}">Add <i class="fa-solid fa-angle-right"></i></button>
                </div>
                <div class="card-body card__info">
                    <h3>-Thông Số Kỹ Thuật-</h3>
                    <ul>
                    <li>- Screen: <span>${product.screen}</span></li>
                    <li>- BackCamera: <span>${product.backCamera}</span></li>
                    <li>- FrontCamera: <span>${product.frontCamera}</span></li>
                    <li>- Desc: <span>${product.desc}</span></li>
                    </ul>
                </div>
            </div>
            
        </div>
        `
        );
    }, "");

    dom("#divproduct .row").innerHTML = output;
}

dom("#onChange").addEventListener("change", (evt) => {
    const { value } = evt.target; // Lấy value từ trong object target gán đến biến value
    filterByType(value);
});

// Lắng nghe sự kiện keydown của input search
dom("#search").addEventListener("keydown", (evt) => {
    console.log(evt.key);
    // Kiểm tra không phải ký tự Enter => Kết thúc hàm
    if(evt.key !== "Enter") return;
    getProducts(evt.target.value);
});


function dom(selector) {
    return document.querySelector(selector);
}

dom('.header__cart').addEventListener('click' , () => {
    dom('.body__card').classList.remove('hide');
})
dom('.close').addEventListener('click',()=>{
    dom('.body__card').classList.add('hide');
})
