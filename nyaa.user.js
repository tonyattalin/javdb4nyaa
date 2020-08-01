// ==UserScript==
// @name         javdb4nyaa
// @namespace    https://github.com/tonyattalin
// @version      0.1.1
// @description  jav links on sukebei.nyaa.si 
// @author       Tony Lin
// @match        https://sukebei.nyaa.si/?*
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.match(/view/)) {
        // TODO
    }

    var links = evaluate("//a[contains(@href, '/view')]");
    for(var i = 0; i < links.length; i++) {
        var found;
        if(found = episode(links[i].getAttribute('title'))) {
            links[i].parentElement.insertBefore(found, links[i])
        }
        
    }

    function javdb4_anchorTag(id) {
        var anchorTag = document.createElement('a');
        anchorTag.setAttribute('href', "https://javdb4.com/search?q=" + id);
        anchorTag.setAttribute('target', "_blank");
        anchorTag.setAttribute('onclick', "window.open(this.href, '_blank', 'location=yes,left=800,height=800,width=800,scrollbars=yes,status=yes');");
        anchorTag.innerHTML = "[" + id + "] ";
        return anchorTag;
    }

    function episode(title) {
        var re ;
        var episodes;

        // FC2
        re = new RegExp('\\s*FC2.*?(\\d+)', 'i');
        episodes = re.exec(title);
        if (episodes) {
            return javdb4_anchorTag(episodes[1]);
        }

        re = new RegExp('(\\w+-\\d+)\\s+', 'i');
        episodes = re.exec(title);
        if (episodes) {
            return javdb4_anchorTag(episodes[1]);
        }

        return;
    }

    function evaluate (xpath, doc = document.documentElement) {
        var evaluator = new XPathEvaluator();
        var result = evaluator.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
        var nodes = [];
        var node = undefined;

        while(node = result.iterateNext()) {
            var text;

            if (node instanceof Attr) {
                text = node.value
            } else {
                nodes.push(node);
            }
        }
        return nodes;
    }

    function evaluate_text (xpath, doc = document.documentElement) {
        var evaluator = new XPathEvaluator();
        var result = evaluator.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
        var node = undefined;
        var texts = [];

        while(node = result.iterateNext()) {
            var text;

            if (node instanceof Attr) {
                text = node.value
            } else {
                text = node.innerText;
            }
            if(text == undefined || text == 'null') {
                console.error(xpath + " not found on " + document.URL);
                continue;
            }
            // fixing up content
            texts.push(text);
        }
        return texts;
    }
})();