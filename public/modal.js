const open = document.getElementById('open');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');
const fileInput = document.querySelector('input[type="file"]');
const SocketIO = require('socket.io')


fileInput.addEventListener('change', function() {
    if (fileInput.files.length > 0) {
        modal_container.classList.add('show');
    }
  });


close.addEventListener('click', () => {
    modal_container.classList.remove('show');
});
