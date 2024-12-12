var g_mnuSelected;

function menuSelect(id, isOnLoad) {
	var mnuItem;

	if (!isEmpty(g_mnuSelected))
		$('#mbar_' + g_mnuSelected).removeClass('on');

	$('#mbar_' + id).addClass('on');
	if (id == g_mnuSelected) return;

	if (!isEmpty(g_mnuSelected))
		$('#acord_' + g_mnuSelected).addClass('hidden');

	$('#acord_' + id).removeClass('hidden');

    g_mnuSelected = id;
	createCookie('menubar_index', id);
	if (!isOnLoad)
		location.replace("mod_" + id + ".form");
};

function navigateTo(elm, url) {
	var loc = window.location;
	var id = $(elm).attr('id');
	createCookie('menubar_index', id);
	var strTmp = loc.pathname;
	var ctx = str.substr(0, strTmp.indexOf("/", 1));
	if (isEmpty(loc.port))
		loc.replace(loc.protocol + "//" + loc.hostname + ctx + "/" + url);
	else
		loc.replace(loc.protocol + "//" + loc.hostname + ":" + loc.port + ctx + "/" + url);
}


(function($, window, document, undefined1) {
	'use strict';

	// Namespaced events.
	var eventSidebar = 'hideShowSidebar';

	// ====================
	// Click on +/- icons.
	// ====================
	$(document).on('click', '.ft-accordion-exp-icon', function(e) {
				var li = $(e.target).closest('li[class*="-accordion-item"]');
				if (li.hasClass('ft-accordion-collapsed')) {
					li.removeClass('ft-accordion-collapsed');
				} else {
					li.addClass('ft-accordion-collapsed');
				}
			});

	// ==========================
	// Hide or show the sidebar.
	// ==========================
	$(document).on('click', '.ft-accordion-toggle-trigger', function() {
				var doc = $(document.documentElement);
				var _class = 'ft-sidebar-hidden';
				var msg;
				// Is sidebar hidden?
				if (doc.hasClass(_class)) {
					// Show sidebar.
					doc.removeClass(_class);
					msg = 'HIDE';
				} else {
					// Hide sidebar.
					doc.addClass(_class);
					msg = 'SHOW';
				}
				// Replace the header text.
				$('.ft-accordion-header-txt').html(msg);
				// Emit event, allowing others to know
				// the sidebar has been hidden / shown.
				$(document).trigger(eventSidebar);
			});

	$.fn.navigation = function() {
		'use strict';

		$.mainNav = this;
		this.resetTimeout = null;
		var subNavMsg = null;

		var navCookie = $.cookie('nav-addr');
		if (navCookie) {
			setActive();
		}
		
		$(document).on("mouseover",'.ft-main-nav a',function(e){
			e.preventDefault();
			var headerDiv=document.getElementsByClassName("ft-header-nav")[0];
			var oldActiveMainLi=headerDiv.getElementsByClassName("ft-page-active");
			if(oldActiveMainLi.length>0){
				$(oldActiveMainLi).removeClass('ft-page-active');
			}
			var _target=e.target;var _id=_target.getAttribute("data-mainNavId");
			
			$(_target).closest('li').addClass('ft-page-active');
			$('.ft-link-active', $.mainNav).removeClass('ft-link-active');
			var subMenu=headerDiv.getElementsByClassName("ft-sub-nav");
			var subNav="sub_nav_"+_id;
			for(var i=0;i<subMenu.length;i++){		
				var subMenuAttrValue=subMenu[i].getAttribute("data-subNavId");
				if(subMenuAttrValue==subNav)
				{	
					subMenu[i].style.display="block";
				}else{
					subMenu[i].style.display="none";
				}
			}
		});
		
		$(document).on("mouseenter",'.ft-header-nav',function(e) {
			clearTimeout(this.resetTimeout);
		});
		
		$(document).on("mouseleave",'.ft-header-nav',function(e) {
			this.resetTimeout = setTimeout(function(){
				setActive();
			}, 2000);
		});

		$('.ft-main-nav a', $.mainNav).click(function(e) {
			var _target = $(e.target);
			setNavDetailsToCookie();
			//window.location.href = _target.attr('href');
			var _id=e.target.getAttribute("data-mainNavId");
			if(!isEmpty(_id) && !(_id == 'Home' || _id == 'Portal' || _id == 'Product-Services'))
			{
				if(_target.attr('href') != '#')
				{
					e.preventDefault();
					var form = document.createElement("form");
					form.setAttribute("action", _target.attr('href'));
					form.setAttribute("method", "post");
					form.setAttribute("target", "_self");
					var input = document.createElement('input');
					input.type = 'hidden';
					input.name = csrfTokenName;
					input.value = csrfTokenValue;
					form.appendChild(input);
					document.body.appendChild(form);
					form.submit();
				}
				else
					window.location.href = _target.attr('href');
			}
						
		});

		$('.ft-sub-nav', $.mainNav).delegate('a', 'click', function(e) {
			e.preventDefault();
			$('.ft-link-active', $.mainNav)
					.removeClass('ft-link-active');
			var _target = $(e.target);
			_target.closest('li').addClass('ft-link-active');
			setNavDetailsToCookie();
			if(_target.attr('href') != '#')
			{
				 var form = document.createElement("form");
		         form.setAttribute("method", "post");
		         form.setAttribute("action", _target.attr('href'));
		         form.setAttribute("target", "_self");
		         var input = document.createElement('input');
		         input.type = 'hidden';
		         input.name = csrfTokenName;
		         input.value = csrfTokenValue;
		         form.appendChild(input);
		         document.body.appendChild(form);
		         form.submit();
			}
			else
				window.location.href = _target.attr('href');
		});
		
		function setActive() {
			navCookie = $.cookie('nav-addr');
			var mainNavItem = navCookie.substr(0, navCookie.indexOf('^')); 
			var subNavItem = navCookie.substr(navCookie.indexOf('^') + 1);
			// Hidding default subNav
			var headerDiv=document.getElementsByClassName("ft-header-nav")[0];
			var oldActiveMainLi=headerDiv.getElementsByClassName("ft-page-active");
			$(oldActiveMainLi).removeClass('ft-page-active');
			// Changing active item in mainNav from cookie
			if("" != mainNavItem) {
			$('a:contains(' + mainNavItem + ')', $('.ft-main-nav', $.mainNav)).closest('li').addClass('ft-page-active');
			}
			// Showing subNav from cookie
			var _newid = "sub_nav_"+ $('.ft-page-active a', $.mainNav).attr('data-mainNavId');
			var subMenu = document.getElementsByClassName("ft-sub-nav");
			for(var i=0; i < subMenu.length; i++) {		
				var subMenuAttrValue = subMenu[i].getAttribute("data-subNavId");
				if(subMenuAttrValue == _newid) {	
					subMenu[i].style.display = "block";
				} else {
					subMenu[i].style.display = "none";
				}
			}
			// Showing active item in active subNav from cookie
			if (subNavItem) {
				var level3_menu = $('a:contains(' + subNavItem + ')', $.mainNav).closest('ul')
				if ( level3_menu.hasClass('ft-sub-nav-3')) {
					var flyout = level3_menu.closest('li');
					flyout.addClass('ft-link-active');
					if(subNavMsg === null){
						subNavMsg = $('.ft-sub-nav .ft-link-active a:first', $.mainNav).text();
						$('.ft-sub-nav .ft-link-active a:first', $.mainNav).text(subNavMsg+'-->'+subNavItem);
					}
				} else {
					$('a:contains(' +subNavItem+ ')', $.mainNav).closest('li').addClass('ft-link-active');
				}				
			}
		}

		function setNavDetailsToCookie() {
			var mainNavItem = $('.ft-main-nav .ft-page-active a', $.mainNav).text();
			var subNavItem = $('.ft-sub-nav .ft-link-active a',	$.mainNav).text();
			$.cookie('nav-addr', mainNavItem + "^" + subNavItem);
		}
	};
})(jQuery, this, this.document);

function pageLoadingMaskT7() {
	var divToMask = $('.ft-layout-primary');
	divToMask.block({
		overlayCSS : {
			opacity : .2
		},
		baseZ : 2000,
		message : '<div style="z-index: 1"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
		css : {
			height : '32px',
			padding : '8px 0 0 0'
		}
	});
}