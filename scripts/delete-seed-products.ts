
import { storage } from "../server/storage";

async function deleteSeedProducts() {
  const productsToDelete = [
    "Honda CBR 650R Ön Fren Balatası",
    "Yamaha MT-07 Spor Egzoz",
    "Motosiklet GPS Takip Cihazı",
    "Michelin Pilot Road 4 Lastik Seti"
  ];

  console.log("Deleting seed products...");

  try {
    const allProducts = await storage.getProducts();
    
    for (const productName of productsToDelete) {
      const product = allProducts.find(p => p.name === productName);
      if (product) {
        await storage.deleteProduct(product.id);
        console.log(`Deleted: ${productName} (ID: ${product.id})`);
      } else {
        console.log(`Not found: ${productName}`);
      }
    }
    console.log("Deletion complete.");
  } catch (error) {
    console.error("Error deleting products:", error);
  }
}

deleteSeedProducts().catch(console.error);
