var trash = document.getElementsByClassName("fa-trash");
const reminder = document.getElementById('reminder');

reminder.addEventListener('click', function onClick(event) {
  // 👇️ Change text color for clicked element only
  event.target.style.color = 'magenta';
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const msg = this.parentNode.parentNode.childNodes[1].innerText.trim()
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});