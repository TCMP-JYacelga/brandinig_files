function setActiveStyleSheet(title) {
	var i, a, main, blnSet;
	blnSet = false;
	for (i = 0; (a = document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
			if (a.getAttribute("title") == title) {
				a.disabled = false;
				blnSet = true;
			}
		}
	}
	return blnSet;
}

function getActiveStyleSheet() {
	var i, a;
	for (i = 0; (a = document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) 
			return a.getAttribute("title");
	}
	return null;
}

function getPreferredStyleSheet() {
	var i, a;
	for (i = 0; (a = document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel").indexOf("style") != -1
				&& a.getAttribute("rel").indexOf("alt") == -1
				&& a.getAttribute("title"))
			return a.getAttribute("title");
	}
	return "corporate";
}

// Save the current theme just before the window gets closed.
window.onunload = function(e) {
  var title = getActiveStyleSheet();
  if (title != null)
	createCookie("style", title, 365);
}

$(document).ready(function() {
	var cookie = readCookie("style");
	var title = cookie ? cookie : getPreferredStyleSheet();
	if (!setActiveStyleSheet(title))
		setActiveStyleSheet(getPreferredStyleSheet());
});

function selectTheme()
{
	var cbPtr = applyTheme;
	$('#themeGallary').dialog({autoOpen:false,resizable:false,width:236,height:220, 
		modal:true, position: ['right','top'], 
		open:function() {
			var dlgRef = $(this);
			$(this).find('.image-box').each(function() {
				$(this).bind('click', function() {
					dlgRef.dialog("close");
					cbPtr.call(dlgRef, $(this).attr('id'));
				});
			});
		}
	});
	$('#themeGallary').dialog("open");
}

function applyTheme(strTheme)
{
	this.dialog("destroy");
	setActiveStyleSheet(strTheme);
}
