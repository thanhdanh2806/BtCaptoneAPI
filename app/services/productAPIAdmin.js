function apiGetProducts(searchTerm) {
    return axios({
           url: "https://62f50939535c0c50e76847f6.mockapi.io/mobiles",
           method: "GET",
           params: {
               name: searchTerm
           }
       });
   }
   
   function apiAddProduct(product) {
       return axios({
              url: "https://62f50939535c0c50e76847f6.mockapi.io/mobiles",
              method: "POST",
              data: product,
          });
      }
   
      function apiDeleteProduct(productID) {
       return axios({
              url: `https://62f50939535c0c50e76847f6.mockapi.io/mobiles/${productID}`,
              method: "DELETE",
          });
      }
   
      function apiGetProductById(productID) {
       return axios({
              url: `https://62f50939535c0c50e76847f6.mockapi.io/mobiles/${productID}`,
              method: "GET",
          });
      }
   
      function apiUpdateProduct(productID, product) {
       return axios({
              url: `https://62f50939535c0c50e76847f6.mockapi.io/mobiles/${productID}`,
              method: "PUT",
              data: product,
          });
      }

      function apiGetType(type) {
        return axios({
               url: "https://62f50939535c0c50e76847f6.mockapi.io/mobiles",
               method: "GET",
               params: {
               type: type
            }
           });
       }
   
   