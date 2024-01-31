/* Hides the main page article TOC from appearing on the page */
function hideArticleTOCTree() {
    let article = document.querySelector("article");

    const tocTreeDOM = article.getElementsByClassName("toctree-wrapper");

    for (var i=0;i<tocTreeDOM.length;i++) {
        tocTreeDOM[i].style.display = "none";
    }
}

var myFontLink = document.createElement('link');
myFontLink.setAttribute("href", "https://fonts.googleapis.com/css?family=Inter:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i");
myFontLink.setAttribute("rel", "stylesheet");

document.getElementsByTagName('head')[0].appendChild(myFontLink);

myFontLink = document.createElement('link');
myFontLink.setAttribute("href", "https://fonts.googleapis.com/css?family=Lora:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i");
myFontLink.setAttribute("rel", "stylesheet");

document.getElementsByTagName('head')[0].appendChild(myFontLink);

