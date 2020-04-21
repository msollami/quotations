var queries = {};


// init
var queryString = window.location.search.substring(1);
var queryComponents = queryString ? queryString.split(/&/) : [];
queryComponents.forEach(function (c) {
    var pair = c.split(/=/,2);
    queries[pair[0]] = decodeURIComponent(pair[1] || "");
});

if (Object.keys(queries).length > 0) {
    document.styleSheets[0].insertRule(".entry { display:none; }");
}

function onload () {
    var authors = [].slice.call(document.querySelectorAll(".author"));
    authors.forEach(function (link) { link.onclick = authorClicked; });

    var toplinks = [].slice.call(document.querySelectorAll(".toplink"));
    toplinks.forEach(function (link) { link.onclick = toplinkClicked; });

    document.getElementById("search").innerText = queries["search"] || "";
    if (Object.keys(queries).length > 0) { updateSearch(); }

}

// filter
function updateSearch () {
    var entries = [].slice.call(document.querySelectorAll(".entry"));
    entries.forEach(function (entry) {
        entry.style.display = entryMatchesQueries(entry) ? "block" : "none";
    });
}

function entryMatchesQueries (entry) {
    return Object.keys(queries).every(function (key) {
        var matcher = queryMatchers[key];
        return matcher ? matcher(entry, queries[key]) : true;
    });
}

var queryMatchers = {
    "author": function (entry, author) {
        return entry.getAttribute("data-author") == author;
    },
    "match": function (entry, regex) {
        return entry.innerText.search(new RegExp(regex)) >= 0;
    },
    "search": function (entry, string) {
        return entry.innerText.toLowerCase().indexOf(string.toLowerCase()) >= 0;
    },
};


// URL
function updateURL () {
    window.history.replaceState({}, "", getQueryURL());
}

function getQueryURL () {
    var keys = Object.keys(queries);
    return "/" + (keys.length == 0 ? "" : ( "?" + keys.map(function (key) {
        return key + "=" + encodeURIComponent(queries[key]);
    }).join("&")));
}


// search field
function searchChanged () {
    queries.search = document.getElementById("search").innerText;
    if (queries.search.substr(-1,1)=='\n') {
        clearSearch() }
    if (!queries.search.match(/\S/)) { delete queries.search; }
    updateURL();
    updateSearch();
}


// author link
function authorClicked (e) {
    for (var el = e.target; el && el.getAttribute; el = el.parentNode) {
        var author = el.getAttribute("data-author");
        if (author) { setAuthor(author); e.preventDefault(); break; }
    }
}

function setAuthor (author) {
    queries.author = author;
    updateURL();
    updateSearch();
    window.scrollTo(0,0);
}


// clear link
function toplinkClicked (e) {
    clearSearch();
    e.preventDefault();
}

function clearSearch () {
    document.getElementById("search").innerText = "";
    Object.keys(queries).forEach(function (key) { delete queries[key]; });
    updateURL();
    updateSearch();
}
