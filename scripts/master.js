var EO = {
  anchors: document.getElementsByTagName('a'),
  historyController: function (event) {
    event.preventDefault();
    var page = event.target.href;
    page = page.replace(window.location.origin, '');
    page = page.replace(/\//g, '');

    if (!page) page = 'home';

    EO.pageSet(page);

    var url = page != 'home' ? '/' + page + '/' : '/';
    history.pushState({ page: page }, page + 'TTT', url);
  },
  pageSet: function (page) {

    window.scrollTo(0, 0);

    var content = document.getElementById('content');

    var current_page = window.location.pathname;
    current_page = current_page.replace(/\//g, '');
    if (!current_page) current_page = 'home';

    var current_content = document.getElementById(current_page);

    // remove anything in the page container
    while (current_content.childNodes.length > 0) {
      current_content.removeChild(current_content.firstChild);
    }

    // move current content to page container
    while (content.childNodes.length > 0) {
      current_content.appendChild(content.childNodes[0]);
    }

    // move new content to content container
    var new_content = document.getElementById(page);
    while (new_content.childNodes.length > 0) {
      content.appendChild(new_content.childNodes[0]);
    }

    var active = document.querySelector('body > header nav .active');
    if (active) active.classList.remove('active');
    active = document.querySelector('body > header nav a[href="/' + page + '/"]');
    if (active) active.classList.add('active');

    var header = document.querySelector('body > header');
    header.classList.remove('hover');
  },
  getEverything: function() {
    console.log("loading everything");
    EO.request = new XMLHttpRequest();
    if (!EO.request) return;

    EO.request.onreadystatechange = EO.loadEverything;
    EO.request.open('GET', '/everything/');
    EO.request.send();
  },
  loadEverything: function() {
    if (EO.request.readyState !== EO.request.DONE) return;
    if (EO.request.status !== 200) return;

    var everything = document.createElement('div');
    everything.style.display = 'none';
    everything.innerHTML = EO.request.responseText;
    document.body.appendChild(everything);

    for (var i = 0; i < EO.anchors.length; i++) {
      if (EO.anchors[i].href.includes('eaglenet.online')) {
        EO.anchors[i].addEventListener('click', EO.historyController);
      }
    }

    window.onpopstate = function (event) {
      var page = event.state.page || 'home';
      EO.pageSet(page);
    }
  },
}

var header = document.querySelector('body > header');
header.onmouseenter = function() {
  header.classList.add('hover');
}
header.onmouseleave = function() {
  header.classList.remove('hover');
}

// load everything
setTimeout(EO.getEverything, 750);
