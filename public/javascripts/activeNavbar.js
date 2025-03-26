document.addEventListener('DOMContentLoaded', function () {
  var path = window.location.pathname
  var links = document.querySelectorAll('.nav-link:not(.chooseLvlLink)')
  links.forEach(function (link) {
    var href = link.getAttribute('href')

    // Check if the path exactly matches the href value
    if (path === href) {
      link.classList.add('active')
    } else {
      link.classList.remove('active')
    }
  })
})

