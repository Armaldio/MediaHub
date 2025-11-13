import 'cordova-plugin-purchase';

export const setupPurchase = () => {
  if (!window.CdvPurchase) {
    console.error('CdvPurchase is not available');
    return null;
  }

  const store = window.CdvPurchase.store;

  // Initialize the store
  store.initialize([{
    platform: window.CdvPurchase.Platform.GOOGLE_PLAY
  }]);

  // Register the subscription product
  store.register([{
    id: 'basic_subscription',
    platform: window.CdvPurchase.Platform.GOOGLE_PLAY,
    type: window.CdvPurchase.ProductType.PAID_SUBSCRIPTION
  }]);

  // Event listeners for purchase states
  store.when()
    .productUpdated((product) => {
      console.log('Product updated:', product);
    })
    .receiptUpdated((receipt) => {
      console.log('Receipt updated:', receipt);
    })
    .approved((transaction) => {
      console.log('Purchase approved:', transaction);
      // Finish the transaction
      transaction.finish();
    })
    .verified((receipt) => {
      console.log('Purchase verified:', receipt);
    })
    .finished((transaction) => {
      console.log('Transaction finished:', transaction);
    });

  // Register error handler separately
  store.error((error) => {
    console.error('Purchase error:', error);
  });

  // Subscription validation function
  const validateSubscription = async () => {
    try {
      const product = await store.get('basic_subscription');
      if (!product) {
        throw new Error('Product not found');
      }

      const owned = product.owned;

      console.log('Subscription validation:', { owned });

      return {
        isSubscribed: owned,
        product
      };
    } catch (error) {
      console.error('Error validating subscription:', error);
      throw error;
    }
  };

  // Purchase subscription function
  const purchaseSubscription = async () => {
    try {
      const product = await store.get('basic_subscription');
      if (!product) {
        throw new Error('Product not found');
      }

      const offer = product.getOffer();
      if (!offer) {
        throw new Error('No offer available for this product');
      }
      if (offer.canPurchase) {
        await store.order(offer);
      } else {
        throw new Error('Cannot purchase this product');
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      throw error;
    }
  };

  // Restore purchases function
  const restorePurchases = async () => {
    try {
      await store.restorePurchases();
      console.log('Purchases restored successfully');
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  };

  // Get product details
  const getProductDetails = async () => {
    try {
      const product = await store.get('basic_subscription');
      return product;
    } catch (error) {
      console.error('Error getting product details:', error);
      throw error;
    }
  };

  return {
    validateSubscription,
    purchaseSubscription,
    restorePurchases,
    getProductDetails
  };
};