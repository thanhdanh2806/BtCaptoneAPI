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
            newProductList = [...productList];
            
            display(productList);
        })
        .catch((error) => {
            console.log(error);
        });
}

function addProduct(product) {
    apiAddProduct(product)
        .then(() => {
            getProducts();
        })
        .catch((error) => {
            console.log(error);
        })
}

function deleteProduct(productID) {
    apiDeleteProduct(productID)
        .then(() => {
            getProducts();
        })
        .catch((error) => {
            console.log(error);
        })
}

function updateProduct(productID, product) {
    apiUpdateProduct(productID, product)
        .then(() => {
            getProducts();
        })
        .catch((error) => {
            console.log(error);
        })
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

function resetForm() {
    dom("#maID").value ="";    
    dom("#tenSP").value ="";
    dom("#loaiSP").value ="";
    dom("#giaSP").value ="";
    dom("#manHinh").value ="";
    dom("#cameraTruoc").value ="";
    dom("#cameraSau").value ="";
    dom("#hinhSP").value ="";
    dom("#moTaSP").value ="";
    dom("#maID").disabled = false;
}

function display(productList) {
    let output = productList.reduce((result, product, index) => {
        return (
            result +
            `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.screen}</td>
                <td>${product.frontCamera}</td>
                <td>${product.backCamera}</td>
                <td>
                    <img src="${product.img}" width ="50px" height = "50px" />
                </td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td>
                    
                    <button class="btn btn-success"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    data-id="${product.id}" 
                    data-type="edit">Sửa</button>

                    <button class="btn btn-danger"
                    data-id="${product.id}" 
                    data-type="delete">Xóa</button>
                </td>
            </tr>
        `
        );
    }, "");

    dom("#tbodyMobile").innerHTML = output;
}

dom("#btnThem").addEventListener("click", ()=>{
    
    
    // 1. Thay đổi heading  và hiển thị footer
    dom(".modal-title").innerHTML = "Thêm Người Dùng";
    dom(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class="btn btn-primary" data-type="add">Thêm</button>
    `; 
    resetForm()
});

dom(".modal-footer").addEventListener("click", (evt) => {
    let elementType = evt.target.getAttribute("data-type")

    let id = dom("#maID").value;
    let name = dom("#tenSP").value;
    let type = dom("#loaiSP").value;
    let price = +dom("#giaSP").value;
    let screen = dom("#manHinh").value;
    let backCamera = dom("#cameraTruoc").value;
    let frontCamera = dom("#cameraSau").value;
    let img = dom("#hinhSP").value;
    let desc = dom("#moTaSP").value;

    // Tạo object từ lớp đối tượng Product
    let product = new Product(id, name, price, screen, backCamera, frontCamera, img, desc, type)

    if (elementType === "add") {
        let isValid = validateForm();
        // Kiểm tra nếu form không hợp lệ => Kết thúc hàm
        if (!isValid) {
            return;
        }
        addProduct(product);
        resetForm();
        
    } else if (elementType === "update") {
        let isValid = validateFormByID();
        // Kiểm tra nếu form không hợp lệ => Kết thúc hàm
        if (!isValid) {
            return;
        }
        updateProduct(id, product)
    }
    resetForm();
});

dom("#tbodyMobile").addEventListener("click", (evt) => {
    let id = evt.target.getAttribute("data-id");
    let elType = evt.target.getAttribute("data-type");

    if (elType === "delete") {
        deleteProduct(id);
    } else if (elType === "edit") {

        dom(".modal-title").innerHTML = "Cập nhật Sản Phẩm";
        dom(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class="btn btn-primary" data-type="update">Cập nhật</button>
    `;

        apiGetProductById(id)
            .then((response) => {
                let product = response.data;

                dom("#maID").value = product.id;
                dom("#tenSP").value = product.name;
                dom("#loaiSP").value = product.type;
                dom("#giaSP").value = product.price;
                dom("#manHinh").value = product.screen;
                dom("#cameraTruoc").value = product.frontCamera;
                dom("#cameraSau").value = product.backCamera;
                dom("#hinhSP").value = product.img;
                dom("#moTaSP").value = product.desc;
                dom("#maID").disabled = true;

                let isValid = validateFormByID();
        // Kiểm tra nếu form không hợp lệ => Kết thúc hàm
        if (!isValid) {
            return;
        }
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

dom("#onChange").addEventListener("change", (evt) => {
    const { value } = evt.target; // Lấy value từ trong object target gán đến biến value
    console.log("value",value);
    filterByType(value);
});

dom("#search").addEventListener("keydown", (evt) => {
    console.log(evt.key);
    if (evt.key !== "Enter") return;
    getProducts(evt.target.value);
});

function dom(selector) {
    return document.querySelector(selector);
}

//======== Validation ========

// Hàm kiểm tra id
function validateID(){
    let id = dom("#maID").value;
    let spanEl = dom("#invalidID");
     if (!id) {
                   spanEl.style.display = "Block"
                   spanEl.innerHTML = "Mã sản phẩm không được để trống!";
                   return false;
                }
               
    let checkId = newProductList.filter((product) => {
        return product.id === id;  
     });     
    if(checkId.length>0){
        spanEl.style.display = "Block"
                   spanEl.innerHTML = "Mã sản phẩm đã tồn tại!";
                   return false;
    }
     spanEl.style.display = "none";
     spanEl.innerHTML = "";
     return true;   
}

// Hàm kiểm tra tên sản phẩm
function validateName() {
let name = dom("#tenSP").value;
let spanEl = dom("#invalidTen");
// Kiểm tra rỗng
if (!name) {
    spanEl.style.display = "Block"
    spanEl.innerHTML = " Tên sản phẩm không được để trống"
    return false;
}
spanEl.style.display = "none";
spanEl.innerHTML = ""
return true;
}

// Hàm kiểm tra dòng sản phẩm
function validateType() {
    let type = dom("#loaiSP").value;
    let spanEl = dom("#invalidLoai");
    // Kiểm tra người dùng
    if (!type) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Dòng sản phẩm phải chọn hợp lệ, không được để trống"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
    }
// Hàm kiểm tra giá
function validatePrice() {
let price = dom("#giaSP").value;
let spanEl = dom("#invalidGia");
// Kiểm tra rỗng
if (!price) {
    spanEl.style.display = "Block"
    spanEl.innerHTML = " Giá sản phẩm không được để trống"
    return false;
}
spanEl.style.display = "none";
spanEl.innerHTML = ""
return true;
}

// Hàm kiểm tra màn hình
function validateScreen() {
    let screen = dom("#manHinh").value;
    let spanEl = dom("#invalidMH");
    // Kiểm tra rỗng
    if (!screen) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Màn hình không được để trống"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
    }

// Hàm kiểm tra camera trước
function validateFrontCamera() {
    let frontCamera = dom("#cameraTruoc").value;
    let spanEl = dom("#invalidCT");
    // Kiểm tra rỗng
    if (!frontCamera) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Camera trước không được để trống"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
    }

// Hàm kiểm tra camera sau
function validateBackCamera() {
    let backCamera = dom("#cameraSau").value;
    let spanEl = dom("#invalidCS");
    // Kiểm tra rỗng
    if (!backCamera) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Camera sau không được để trống"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
    }

// Hàm kiểm tra Hình Ảnh
function validateImage() {
let image = dom("#hinhSP").value;
let spanEl = dom("#invalidHinh");
// Kiểm tra rỗng
if (!image) {
    spanEl.style.display = "Block"
    spanEl.innerHTML = " Hình ảnh không được để trống"
    return false;
}

spanEl.style.display = "none";
spanEl.innerHTML = ""
return true;
}

// Hàm kiểm tra Mô tả
function validateDescribe() {
let describe = dom("#moTaSP").value;
let spanEl = dom("#invalidMoTa");
// Kiểm tra rỗng
if (!describe) {
    spanEl.style.display = "Block"
    spanEl.innerHTML = "Mô tả không được để trống"
    return false;
}
// Kiểm tra ký tự
if (describe.length >= 120) {
    spanEl.style.display = "Block"
    spanEl.innerHTML = "Tên tài khoản không vượt quá 120 ký tự"
    return false;
}
spanEl.style.display = "none";
spanEl.innerHTML = ""
return true;
}

function validateForm() {
// Kĩ thuật Đặt cờ hiệu, mặc định ban đầu xem như form hợp lệ
let isValid = true;
isValid = validateID() & validateName() & validateType() & validatePrice() & validateScreen() & validateFrontCamera() & validateBackCamera() & validateImage() & validateDescribe() ;

if (!isValid) {
   // alert("Form không hợp lệ");
    return false;
}
return true;
}
function validateFormByID() {
// Kĩ thuật Đặt cờ hiệu, mặc định ban đầu xem như form hợp lệ
let isValid = true;
isValid =  validateName() & validateType() & validatePrice() & validateScreen() & validateFrontCamera() & validateBackCamera() & validateImage() & validateDescribe();

if (!isValid) {
   // alert("Form không hợp lệ");
    return false;
}
return true;
}