import css from './public/css/materialize.min.css'
import media from './media.js'
import jquery from './public/js/materialize.min.js'

if ('serviceWorker' in navigator && 'SyncManager' in window && 'BackgroundFetchManager' in self) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').then(function(reg) {
            return reg.sync.getTags();
          }).then(function(tags) {
            if (tags.includes('syncTest')) log("There's already a background sync pending");
          }).catch(function(err) {
            console.log('It broke (probably sync not supported or flag not enabled)');
            console.log(err.message);
          });
    });
}