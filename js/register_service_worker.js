/*** Register Service Worker Script ***/

/* Declare function which registers the Service Worker */
registerSW = () => {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/service_worker.js').then(() => {
    console.log('Service Worker Registered');
  }).catch((err) => {
    console.log(`Failure: Service Worker Registration Failed \n ${err}`);
  });
};

/* Register Service Worker */
registerSW();
