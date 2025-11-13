import 'cordova-plugin-purchase';

export const setupPurchase = () => {
  // Basic configuration for the purchase plugin
  if (window.CdvPurchase) {
    window.CdvPurchase.store.initialize([{
      platform: window.CdvPurchase.Platform.GOOGLE_PLAY
    }]);

    // Register a product
    window.CdvPurchase.store.register([{
      id: 'your_product_id_here',
      platform: window.CdvPurchase.Platform.GOOGLE_PLAY,
      type: window.CdvPurchase.ProductType.PAID_SUBSCRIPTION
    }]);

    // Simple test function to verify the plugin works
    const testPurchase = async () => {
      try {
        const products = await window.CdvPurchase.store.get('your_product_id_here');
        console.log('Available products:', products);
        return products;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    };

    return {
      testPurchase
    };
  } else {
    console.error('CdvPurchase is not available');
    return {
      testPurchase: async () => {
        throw new Error('CdvPurchase is not available');
      }
    };
  }
};