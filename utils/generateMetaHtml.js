const generateMetaHtml = (product) => {
  const productImage = product.images.length > 0
    ? (product.images[0].url.startsWith('https') ? product.images[0].url : `https://elonatech.com.ng${product.images[0].url}`)
    : 'https://elonatech.com.ng/default-product-image.jpg';

  const sanitizedDescription = product.description.replace(/<[^>]*>/g, '');

  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${product.name} - Elonatech Nigeria</title>
          
          <!-- Open Graph Meta Tags -->
          <meta property="og:title" content="${product.name}" />
          <meta property="og:description" content="${sanitizedDescription}" />
          <meta property="og:image" content="${productImage}" />
          <meta property="og:url" content="${process.env.FRONTEND_URL}/product/${product._id}" />
          <meta property="og:type" content="product" />
          <meta property="og:site_name" content="Elonatech Nigeria" />
          
          <!-- Twitter Card Meta Tags -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${product.name}" />
          <meta name="twitter:description" content="${sanitizedDescription}" />
          <meta name="twitter:image" content="${productImage}" />
          
          <!-- Schema.org Markup -->
          <script type="application/ld+json">
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "${product.name}",
              "image": "${productImage}",
              "description": "${sanitizedDescription}",
              "brand": {
                "@type": "Brand",
                "name": "${product.brand}"
              },
              "offers": {
                "@type": "Offer",
                "url": "${process.env.FRONTEND_URL}/product/${product._id}",
                "priceCurrency": "NGN",
                "price": ${product.price},
                "availability": "${product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}"
              }
            }
          </script>
        </head>
        <body>
          <h1>${product.name}</h1>
          <img src="${productImage}" alt="${product.name}" />
          <p>${sanitizedDescription}</p>
          <p>Price: NGN ${product.price}</p>
        </body>
      </html>
    `;
};

module.exports = generateMetaHtml;