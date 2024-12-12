// JavaScript Document
var prevTitle;

function showTooltip(el, title)
{
    if (!document.getElementById || !document.getElementsByTagName) return;
    //addCss("bt.css", "/static/styles/portlet/");
    addBaloon();
    var tooltip = CreateEl("span", "tooltip");
    tooltip.setAttribute("title", title);
    var top = CreateEl("span", "top");
    var bottom = CreateEl("b", "bottom");
    top.appendChild(document.createTextNode(title));
    tooltip.appendChild(top);
    tooltip.appendChild(bottom);
    //setOpacity(tooltip);
    el.tooltip = tooltip;
    el.onmousemove = locate;
    document.getElementById("btc").appendChild(tooltip);
}

function hideTooltip(e)
{
    var d = document.getElementById("btc");
    if (d.childNodes.length > 0) d.removeChild(d.firstChild);
}

function addCss(strCss, strPath)
{
    for (css in document.stylesheets)
        if (css.href.endsWith(strCss)) return;

    var lnk = CreateEl("link");
    lnk.setAttribute("type", "text/css");
    lnk.setAttribute("rel", "stylesheet");
    lnk.setAttribute("href", (strPath + strCss));
    lnk.setAttribute("media", "screen");
    document.getElementsByTagName("head")[0].appendChild(lnk);
}

function addBaloon()
{
    var span = document.getElementById("btc");
    if (span) return;
    span = document.createElement("span");
    span.id = "btc";
    span.setAttribute("id", "btc");
    span.style.position = "absolute";
    document.getElementsByTagName("body")[0].appendChild(span);
}

function CreateEl(t, c)
{
    var x = document.createElement(t);
    x.className = c;
    x.style.display = "block";
    return(x);
}

function setOpacity(el)
{
    el.style.filter = "alpha(opacity:95)";
    el.style.KHTMLOpacity = "0.95";
    el.style.MozOpacity = "0.95";
    el.style.opacity = "0.95";
}

function locate(e)
{
    var posx = 0, posy = 0;
    if (e == null) e = window.event;
    if (e.pageX || e.pageY)
    {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)
    {
        if(document.documentElement.scrollTop)
        {
            posx = e.clientX + document.documentElement.scrollLeft;
            posy = e.clientY + document.documentElement.scrollTop;
        }
        else
        {
            posx = e.clientX + document.body.scrollLeft;
            posy = e.clientY + document.body.scrollTop;
        }
    }
    document.getElementById("btc").style.top = (posy + 10) + "px";
    document.getElementById("btc").style.left = posx + "px";
}
