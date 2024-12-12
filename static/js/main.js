(function($, window, document, undefined1) {
	'use strict';

	// Namespaced events.
	var eventSidebar = 'hideShowSidebar';

	// ====================
	// Click on +/- icons.
	// ====================
	$(document).on('click', '.ft-accordion-exp-icon', function(e) {
				var li = $(e.target).closest('li[class*="-accordion-item"]');
				var arrWidgets = ["messageFormsWidget","quickpaylistWidget","actionlistWidget","favReportListWidget"];
				var wgt_map = {"messageFormsWidget":"Y","quickpaylistWidget":"Y","actionlistWidget":"Y","favReportListWidget":"Y"};
				var cookie_Wgt_Map = readCookie("sidemenu_widgets");
				if(cookie_Wgt_Map){
					wgt_map = JSON.parse(cookie_Wgt_Map); 
				}				
				var status = 'Y';				
				if (li.hasClass('ft-accordion-collapsed')) {
					li.removeClass('ft-accordion-collapsed');
					status = 'Y';
				} else {
					li.addClass('ft-accordion-collapsed');
					status = 'N';
				}
				if($.inArray(li.attr('id'),arrWidgets) > -1){													
					wgt_map[li.attr('id')] = status;					
					var stringObj = JSON.stringify(wgt_map);					
					createCookie("sidemenu_widgets",stringObj, 1);
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
				eraseCookie("sidemenu_state");
				createCookie("sidemenu_state",msg, 1);									
			});

	$.fn.navigation = function() {
		'use strict';

		$.mainNav = this;
		this.resetTimeout = null;
		var subNavMsg = null;
		
		
		var navCookie = $.cookie('nav-addr');
		if (!navCookie) {
			$.cookie('nav-addr', 'Home');
		}
		setActive();
		
		$(document).on("mouseover",'.ft-main-nav > li > a',function(e){
			if(e.target !== this){return;}
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
		//	this.resetTimeout = setTimeout(function(){
				setActive();
		//	}, 0);
		});

		$('.ft-main-nav > li > a[data-mainNavId="Home"]', $.mainNav).click(function(e) {
			e.preventDefault();
			var _target = $(e.target);
			if('I' == _target.prop('tagName'))
				_target = _target.parent();
			setNavDetailsToCookie();
			try { if (typeof $ == 'function') $.blockUI({message:$('#loadingMsg'), baseZ: 20000}); } catch (err) { }
			//window.location.href = _target.attr('href');
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
		});
		
		$('.ft-main-nav > li > a[data-mainnavid="Portal"],a[data-mainnavid="Product-Services"]', $.mainNav).click(function(e) {
			e.preventDefault();
			$('.ft-link-active', $.mainNav)
					.removeClass('ft-link-active');
			var _target = $(e.target);
			_target.closest('li').addClass('ft-link-active');
			setNavDetailsToCookie();
			if(_IsEmulationMode != true)
			{			
				if(_target.attr('href').indexOf(".json")  > -1)
				{
					$.ajax({
						url :"services/"+_target.attr('href'),
							contentType : "application/json",
							type : 'POST',
							data : {},
							success : function(data) {
								var urlParam = data["urlParameters"];						
								if((urlParam != undefined) || (urlParam != null && urlParam != '')){
									var win = window.open(urlParam, "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=780, height=500, top="+(screen.height-400)+", left="+(screen.width-840));							
								}
								else
										msgbox('Error Message', $('<div />').append('This request cannot be completed as you are in Emulation Mode'));
							}
						});
					
				}else{
					try { if (typeof $ == 'function') $.blockUI({message:$('#loadingMsg'), baseZ: 20000}); } catch (err) { }
					window.location.href = _target.attr('href');
				}
			}	
			else
			{
				msgbox('Error Message', $('<div />').append('This request cannot be completed as you are in Emulation Mode'));
			}
		});

		$('.ft-main-nav a', $.mainNav).click(function(e) {
			var _target = $(e.target);			
		
			var _id=e.target.getAttribute("data-mainNavId");
			if(!isEmptyVal(_id) && !(_id == 'Home' || _id == 'Portal' || _id == 'Product-Services'))
			{
				if(_target.attr('href') != '#')
				{
					setNavDetailsToCookie();
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

		$('.ft-sub-nav').delegate('a', 'click', function(e) {
			e.preventDefault();
			$('.ft-link-active', $.mainNav)
					.removeClass('ft-link-active');
			var _target = $(e.target);
			_target.closest('li').addClass('ft-link-active');
			setNavDetailsToCookie();
			if(!(_IsEmulationMode == true && _target.closest('ul').attr('data-subnavid') == 'sub_nav_Portal'))
			{
				if(_target.attr('href').indexOf(".json")  > -1)
				{
					$.ajax({
						url :"services/"+_target.attr('href'),
							contentType : "application/json",
							type : 'POST',
							data : {},
							success : function(data) {
								var urlParam = data["urlParameters"];						
									if((urlParam != undefined) || (urlParam != null && urlParam != '')){
										var win = window.open(urlParam, "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=780, height=500, top="+(screen.height-400)+", left="+(screen.width-840));							
									}
									else
										msgbox('Error Message', $('<div />').append('This request cannot be completed as you are in Emulation Mode'));
								}
						});
					
				}
				else
				{
					try {
							if (typeof $ == 'function' && _target.attr('href') != '#' )
							{	
								$.blockUI({message:$('#loadingMsg'), baseZ: 20000});								
							}
							
						}
						catch (err) { }
				//try { if (typeof $ == 'function' && _target.attr('href') != '#') $.blockUI({message:$('#loadingMsg'), baseZ: 20000}); } catch (err) { }
						if(_target.attr('href') != '#')
						{
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
			}
			else
			{
				msgbox('Error Message', $('<div />').append('This request cannot be completed as you are in Emulation Mode'));
			}
		});
		
		function setActive() {
			var mainNavItem, subNavItem;
			navCookie = $.cookie('nav-addr');
			if(null != navCookie) {
				mainNavItem = navCookie.split('^')[0]; 
				//subNavItem = navCookie.substr(navCookie.indexOf('^') + 1);
			}	
			// Hidding default subNav
			var headerDiv=document.getElementsByClassName("ft-header-nav")[0];
			var oldActiveMainLi=headerDiv.getElementsByClassName("ft-page-active");
			$(oldActiveMainLi).removeClass('ft-page-active');
			// Changing active item in mainNav from cookie
			$('a[data-mainNavId="' + mainNavItem + '"]', $('.ft-main-nav', $.mainNav)).closest('li').addClass('ft-page-active');
			// Showing subNav from cookie
			//var _newid = "sub_nav_"+ $('.ft-page-active a', $.mainNav).attr('data-mainNavId');
			var subMenu = document.getElementsByClassName("ft-sub-nav");
			for(var i=0; i < subMenu.length; i++) {		
				var subMenuAttrValue = subMenu[i].getAttribute("data-subNavId");
				/*if(subMenuAttrValue == _newid) {	
					subMenu[i].style.display = "none";
				} else {*/
					subMenu[i].style.display = "none";
				//}
			}
			// Showing active item in active subNav from cookie
			//if (subNavItem) {
				/*var level3_menu = $('a:contains(' + subNavItem + ')', $.mainNav).closest('ul')
				if ( level3_menu.hasClass('ft-sub-nav-3')) {
					var flyout = level3_menu.closest('li');
					flyout.addClass('ft-link-active');
					if(subNavMsg === null){
						subNavMsg = $('.ft-sub-nav .ft-link-active a:first', $.mainNav).text();
						$('.ft-sub-nav .ft-link-active a:first', $.mainNav).text(subNavMsg+'-->'+subNavItem);
					}
				} else {*/
			//		$('a:contains(' +subNavItem+ ')', $.mainNav).closest('li').addClass('ft-link-active');
				/*}	*/			
			//}
		}

		function setNavDetailsToCookie() {
			var mainNavItem = $('.ft-main-nav .ft-page-active > a', $.mainNav).attr('data-mainNavId');
			var subNavItem = $('.ft-sub-nav .ft-link-active a',	$.mainNav);
			if(subNavItem.length > 0)
			{ 
				var secNavItem = subNavItem.closest('ul');
				if(secNavItem.hasClass('ft-sub-nav-3')) {
					secNavItem = secNavItem.prev('a').text();
					if(secNavItem)
					mainNavItem = mainNavItem + "^" + secNavItem;
				}
				mainNavItem = mainNavItem + "^" + subNavItem.text();
			}
			$.cookie('nav-addr', mainNavItem);
		}
	};

	$.fn.directory = function(config) {
		var me = this;
		var div = $('<div class="row"><div class="col-sm-12"><label>'
				+ config.title + '</label></div></div>')
		var markers = $('<div class="col-sm-12 directory boldText ft-padding-b"></div>')
		var selectionMarker = $('<label class="directory-label-div"></label>');
		var directoryContent = $('<div class="col-sm-12 ft-padding-b"></div>');
		var allMarker = $('<a> All </a>')
		markers.append(allMarker);
		allMarker.click({
					selection : 'all'
				}, markerSelection);
		for (var i = 65; i <= 90; i++) {
			var code = String.fromCharCode(i);
			var marker = $('<a> ' + code + ' </a>');
			marker.click({
						selection : code
					}, markerSelection);
			markers.append(marker);
		}
		var otherMarker = $('<a> Other</a>')
		markers.append(otherMarker);
		otherMarker.click({
					selection : 'oth'
				}, markerSelection);
		div.append(markers);
		div.append($('<div class="col-sm-12"></div>').append(selectionMarker)
				.append($('<div class="blue-horizontal-line"></div>')));
		div.append(directoryContent);
		allMarker.trigger('click');
		me.append(div);
		function markerSelection(event) {
			var content = config.onChange(event.data.selection);
			selectionMarker.html(event.data.selection);
			directoryContent.html(content);
		};
	};

	$.fn.carousel = function(config) {
		var me = this;
		drawCarousel();

		$(document).on('hideShowSidebar', function() {
					drawCarousel();
				});
		function drawCarousel() {
			var configration = me.config;
			me.addClass('ft-carousel-slick-wrapper');
			var slickListDiv = document.createElement('div');
			$(slickListDiv).addClass('ft-carousel-slick-list');
			me.html(slickListDiv);

			$.each(config.data, function(index, value) {
						var summaryCaroItemDiv = document.createElement('div');
						$(summaryCaroItemDiv)
								.addClass("ft-carousel-slick-item");

						// title div
						var titleDiv = document.createElement('div');
						if (config.titleNode != undefined
								&& config.titleNode !== '') {
							$(titleDiv).html(value[config.titleNode]);
						} else {
							if (config.titleRenderer != undefined
									&& config.titleRenderer !== '') {
								$(titleDiv).html(config.titleRenderer.apply(
										this, [value]));
							}
						}
						$(titleDiv).prop('title', value[config.titleNode])
						if (config.transactionNode== undefined){
						 $(titleDiv).addClass("ft-carousel-slick-title");
						}
						$(titleDiv).appendTo(summaryCaroItemDiv);

						// amount div
						var amountDiv = document.createElement('div');
						if (config.contentNode != undefined
								&& config.contentNode !== '') {
							$(amountDiv).html(value[config.contentNode]);
							$(amountDiv).prop('title', value[config.contentNode]);
						} else {
							if (config.contentRenderer != undefined
									&& config.contentRenderer !== '') {
								$(amountDiv).html(config.contentRenderer.apply(
										this, [value]));
							}
							if (config.contentNodeTitle != undefined
									&& config.contentNodeTitle !== '') {
								$(amountDiv).prop('title', config.contentNodeTitle.apply(
										this, [value]));
									}
						}
						$(amountDiv).addClass("ft-carousel-slick-value");
						$(amountDiv).appendTo(summaryCaroItemDiv);
						if (config.transactionNode!= undefined){
						var transDiv = document.createElement('div');
						if (config.transactionNode != undefined
								&& config.transactionNode !== '') {
							$(transDiv).html(value[config.transactionNode]+'&nbsp;Transaction');
							$(transDiv).addClass("sleek-tansaction");
						   }
						 $(transDiv).appendTo(summaryCaroItemDiv);
						}
						$(summaryCaroItemDiv).appendTo(slickListDiv);
					});// end of for loop
			var numberOfSlideToShow = ((me.width()) / 216);
			numberOfSlideToShow = (numberOfSlideToShow - numberOfSlideToShow
					% 1)

			var list = $(slickListDiv);
			var event = 'click.slick_carousel';
			var str = '.ft-carousel-slick-item';
			var a = 'ft-carousel-slick-active';
			var options = {
				draggable : false,
				infinite : false,
				slidesToShow : numberOfSlideToShow,
				slidesToScroll : numberOfSlideToShow
			};

			list.each(function() {
				var el = $(this);
				// Remove the carousel.
				el.unslick();
				// Add the carousel.
				el.slick(options);

					// Watch for click events.
					/*
					 * el.off(event).on(event, str, function() { var item =
					 * $(this); var others = item.siblings(str); // Add active
					 * to this item. item.addClass(a); // Remove active from
					 * others. others.removeClass(a); });
					 */
				});
		}
	};

	$.fn.collapsiblePanel = function(collapsed) {
		return this.each(function() {
			var textWidth;
			var me = this,

			// Title div of the panel.
			titleDiv = $(".vertical-collapsible-titlebar", me),

			// Title text span.
			titleTextSpan = $(".vertical-collapsible-titlebar > span:first-child", me),

			// Content div of the panel.
			contentsDiv = $(".vertical-collapsible-contents", me),

			// container and Expand/Collapse span to be added.
			expandCollapseIcon = $('<span class="expand-vertical"></span>');
			var container = $('<div class="vertical-collapsible-panel"></div>');
			$(me).children().appendTo(container);
			$(me).append(container);
			me = container;
			$(titleTextSpan).addClass('vertical-collapsible-title');

			// Getting width of the text to be shown vertically. This is to set
			// the min-height when the text is vertical. Without this the text
			// overlaps other components.
			textWidth = $(titleTextSpan).text().length * 8;
			if (!collapsed) {
				$(titleDiv).attr("style",
						"min-height: " + (textWidth + 20) + "px !important");
				$(me).attr("style",
						"min-height: " + (textWidth + 20) + "px !important");
				$(contentsDiv).attr("style",
						"min-height: " + (textWidth + 20) + "px !important");
				// Changing the orientation of the header to vertical.
				$(titleDiv).addClass('col-sm-1');
				$(titleDiv).addClass('vt');
				$(titleTextSpan).addClass('vertical');
				$(titleTextSpan).css('top', textWidth - 10);
				$(expandCollapseIcon).addClass('fa fa-caret-down');
				$(expandCollapseIcon).prependTo(contentsDiv);
			} else {
				$(titleDiv).addClass('col-sm-12');
				$(contentsDiv).addClass("content-display-none");
				$(expandCollapseIcon).addClass('fa fa-caret-right');
				$(expandCollapseIcon).prependTo(titleDiv);
			}
			$(contentsDiv).addClass('col-sm-12');

			// Handling of the expand/collapse icon.
			$(expandCollapseIcon, me).click(function() {
				if ($(titleTextSpan).hasClass("vertical")) {
					$(titleDiv).height('auto');
					$(titleDiv).attr("style", "min-height: 38px !important");
					$(me).attr("style", "min-height: 38px !important");
					$(titleTextSpan).css('top', '8px');
				} else {
					$(titleDiv)
							.attr(
									"style",
									"min-height: " + (textWidth + 20)
											+ "px !important");
					$(me)
							.attr(
									"style",
									"min-height: " + (textWidth + 20)
											+ "px !important");
					$(titleTextSpan).css('top', textWidth - 10);
				}
				$(titleDiv).hide();
				$(titleTextSpan).toggleClass("vertical");
				$(titleDiv).toggleClass("col-sm-1");
				$(titleDiv).toggleClass("vt");
				$(titleDiv).toggleClass("col-sm-12");
				$(contentsDiv).toggleClass("content-display-none");
				$(expandCollapseIcon).toggleClass('fa fa-caret-down');
				$(expandCollapseIcon).toggleClass('fa fa-caret-right');
				if ($(titleTextSpan).hasClass("vertical")) {
					expandCollapseIcon.prependTo(contentsDiv);
				} else {
					expandCollapseIcon.prependTo(titleDiv);
				}
				$(titleDiv).show();
			});
		});
	}

	$.fn.charCountTextbox = function() {
		var maxCharCount = $(this).attr('maxlength'), parent = this.parent(), wrapperDiv = $("<div class='char-count-wrapper'></div>"), labelNumberIterations = parseInt(maxCharCount
				/ 10,10), remainder = maxCharCount % 10, remainderMarkerText = "", markerDivPart;

		$(this).addClass('char-count-input');

		$(wrapperDiv).insertAfter(this);

		for (var counter = 0; counter < labelNumberIterations; counter++) {
			markerDivPart = $("<div class='char-count-markers'>123456789</div><div class='char-count-markers highlight-marker'>"
					+ (counter + 1) + "</div>");
			$(wrapperDiv).append(markerDivPart);
		}

		for (var remainderCounter = 0; remainderCounter < remainder; remainderCounter++) {
			remainderMarkerText += (remainderCounter + 1);
		}

		markerDivPart = $("<div class='char-count-markers'>"
				+ remainderMarkerText + "</div>");
		$(wrapperDiv).append(markerDivPart);
		$(wrapperDiv).append(this);
	}

	$.fn.getDateRangePickerValue = function(format) {
		var dateValue = this.val();
		var dateSplit = dateValue.split(' to ');
		var dateValueObj;
		if (dateSplit.length == 2) {
			for (var i = 0; i < 2; i++) {
				dateSplit[i] = applyFormat(dateSplit[i]);
			}
			return dateSplit
		} else if (dateSplit.length == 1) {
			dateValue = applyFormat(dateValue);
			return dateValue;
		}
		function applyFormat(dateStr) {
			var dateValueObj = new Date(dateStr);
			var dateString = dateStr.trim();
			if (format)
				dateString = $.datepicker.formatDate(format, dateValueObj);
			return dateString;
		}
	}

	$.fn.setDateRangePickerValue = function(date) {
		if (Object.prototype.toString.call(date) === '[object Array]') {
			for (var i = 0; i < 2; i++) {
				date[i] = applyFormat(date[i]);
			}
		} else {
			date = applyFormat(date);
		}
		this.datepick('setDate', date);

		function applyFormat(dateStr) {
			var dateValueObj = new Date(dateStr);
			var dateString = $.datepicker.formatDate(format, dateValueObj);
			return dateString;
		}
	}
	
	$.fn.setDateRangeMode = function(mode) {
		if(mode === 'single') {
			this.datepick('option', {rangeText: 'Date Range>>'});
			this.datepick('option', {monthsToShow: 1});
			this.datepick('option', {rangeSelect: false});
			this.datepick('option', {multi: false});
		} else if (mode === 'multi') {
			this.datepick('option', {rangeText: '&lt;&lt;Single Date'});
			this.datepick('option', {monthsToShow: 2});
			this.datepick('option', {rangeSelect: true});
			this.datepick('option', {multi: true});
		}
	}

	$.fn.getMultiSelectValue = function() {
		var valueRawArray = this.multiselect('getChecked');
		var valueArray = [];
		for (var i = 0; i < valueRawArray.length; i++) {
			valueArray.push(valueRawArray[i].value)
		}
		return valueArray;
	}

	$.fn.getMultiSelectValueString = function() {
		var valueRawArray = this.multiselect('getChecked');
		var valueArray = [];
		for (var i = 0; i < valueRawArray.length; i++) {
			valueArray.push(valueRawArray[i].value)
		}
		var valueString = valueArray.join();
		return valueString;
	}

	$.fn.statusBar = function(config) {
		var bar = this;

		bar.each(function() {
					var el = $(this);
					var active = config;
					var index = 0;
					el.find('li').each(function() {
								index++;
								var li = $(this);
								li.removeClass('ft-status-bar-li-active');
								li.removeClass('ft-status-bar-li-done');
								if (active === index) {
									li.addClass('ft-status-bar-li-active');
								} else if (active > index) {
									li.addClass('ft-status-bar-li-done');
								}
							});
				});
	}

	$.ui.dialog.prototype.originalopen = $.ui.dialog.prototype.open;
	$.ui.dialog.prototype.open = function() {
		var dlgObj = $.ui.dialog.prototype.originalopen.call(this);
		var left=($(window).width()-this.uiDialog.width())/2;
    	this.uiDialog.css('left',left+'px');
		/*return originalDialogOpenFunction(this);*/
		/*return $.ui.dialog.prototype.originalopen.call(this);*/
	}
	$.fn.barTabs = function(config) {
		var tabs = $('#' + this[0].id).tabs();
		var headers = $(tabs[0].childNodes[1]);
		headers.addClass('ui-bar-tabs');
	}
	$.fn.verticalTabs = function(config) {
		var tabs = $('#' + this[0].id).tabs();
		tabs[0].classList.add('ui-vertical-tab');
		if (config.showArrowMarker) {
			var firstTabActive = true;
			tabs.find('li').each(function() {
				var li = $(this);
				var anchor = li.find('a')[0];

				anchor.onclick = function() {
					var allChilds = anchor.parentElement.parentElement.childNodes;
					for (var i = 0; i < allChilds.length; i++) {
						allChilds[i].className = '';
					}
					anchor.parentElement.className = 'ui-vertical-tabs-selected';
				};
				if (firstTabActive) {
					anchor.click();
					firstTabActive = false;
				}

			});
		}
	}

	$.fn.T7DataPipe = function(options) {
		return this.each(function() {
			var $wrappingElement = $(this);
			var $table = $('<table border="0" cellspacing="0" cellpadding="0" class="ft-datapipe" width="100%"></table>');
			var total, zeroCnt, actPerc, perc, cntr, perc1, perc2;
			var metaData = options.metaData;
			var $lblRow = $('<tr></tr>');
			var intStatusCount = 0;
			if (metaData && metaData.length <= 0)
				return;
			var $col = null;
			var strCls = 'right_border';
			if (metaData[0] && metaData[0].statusValues.length > 0) {
				if (metaData.length === 1)
					strCls = '';
				$col = $('<td colspan="' + metaData[0].statusValues.length
						+ '" class="ft-datapipe-blue-color ' + strCls
						+ '"style="font-weight:bold;">' + metaData[0].desc + '</td>');
				$col.appendTo($lblRow);
			}
			if (metaData[1] && metaData[1].statusValues.length > 0) {
				if (metaData.length === 2)
					strCls = '';
				$col = $('<td colspan="' + metaData[1].statusValues.length
						+ '" class="ft-datapipe-green-color ' + strCls
						+ '"style="font-weight:bold;">' + metaData[1].desc + '</td>');
				$col.appendTo($lblRow);
			}
			$lblRow.appendTo($table);

			zeroCnt = 0;
			total = 0;

			var $descRow = $('<tr class="ft-datapipe-labels"></tr>'), $dataRow = $('<tr></tr>'), val, strDesc = '', val2;
			$.each(metaData, function(index, obj) {
						$.each(obj.statusValues, function(indx, value) {
									val = value.count1 + value.count2;
									if(val != 0)
										strDesc = value.desc;
									else 	
										strDesc = "";
									intStatusCount++;
									if((index != 1 && indx != 4) || (index != 0 && indx != 0)) 
										var $colDesc = $('<td>'+ strDesc +'</td>');
									else
										var $colDesc = $('<td>'+ strDesc +'</td>');
									if (val === 0) {
										zeroCnt++;
									}
									total += val;

									if (indx === obj.statusValues.length - 1
											&& index < metaData.length - 1)
										$colDesc.addClass('right_border');

									$colDesc.appendTo($descRow);
								});
					});
			var $td = $('<td colspan="' + intStatusCount + '"></td>');
			actPerc = 100 - (zeroCnt * 0.001);
			var $pRow = $('<tr class="ft-datapipe-values"></tr>');
			var intCt = 0;
						
			$.each(metaData, function(index, obj) {
						intCt++;
						$.each(obj.statusValues, function(indx, value) {
									val = value.count1+value.count2;
									var displayValue = value.count1 + value.count2;
									perc = Math.abs(((val) * actPerc) / total);
									
									var statusString = value.key;		
									var batStringString = "\nTotal Batches : " + value.batches;
									var c1String = "\nTransactions in batches : " + (parseInt(value.count1,10)+parseInt(value.count2,10));
									var c2String = "\nTransactions requiring attention : " + value.count1;
									var tootltipString = "";
									if (intCt === 1)
										tootltipString = statusString + batStringString + c1String + c2String;
									else if (intCt === 2)
										tootltipString = statusString + batStringString + c1String;
										
									$col = $('<td id="' + value.key +'"'
											+' title="' + tootltipString + '"'
											+' onclick="javascript:navigateToPage('+ "\'"+ value.key+"\'" +')"'
											+' width="' + perc + '%">'+displayValue
											+ '</td>');
									if (intCt === 1)
										$col.addClass('ft-datapipe-blue-bg ft-pipeborder');
									else if (intCt === 2){
										if(value.key != 'Failed')
											$col.addClass('ft-datapipe-green-bg ft-pipeborder');
										else	
											$col.addClass('ft-datapipe-red-bg ft-pipeborder');
									}	
									$col.appendTo($pRow);

								});
					});

			// loop over items
			// if class found, count items in class, create gradients and
			// apply/distribute colors

			$pRow.appendTo($table);
			$descRow.appendTo($table);
			$dataRow.appendTo($table);
			$wrappingElement.html($table);

			if (typeof options !== 'undefined'
					&& typeof options.processColors !== 'undefined') {
				var matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/, aClasses = [
						'ft-datapipe-blue-bg', 'ft-datapipe-green-bg'];
				var $items, rgbColor, _bgcolor, _ci, rootColor, match;

				var count = 0;
				var darkFactor = 0.25;
				var processColors = function() {
					$items = $('.' + aClasses[count], $('.ft-datapipe-values',
									this));
					rootColor = $items.eq(0).css('background-color');
					match = matchColors.exec(rootColor);
					if (match !== null) {
						rgbColor = ('rgba(' + match[1] + ',' + match[2] + ','
								+ match[3] + ',');
					}

					$items.each(function(i, e) {
						_ci = parseInt(i,10);
						var divFactor = $items.length;
						if (divFactor === 1) {
							divFactor = 2;
						}
						if (_ci === 0) {
							_ci = 0.5;
						}
						_bgcolor = (rgbColor
								+ ((_ci / (divFactor - 1)) + darkFactor) + ')');
						if ($(e).attr('id') === 'BANK_REPAIR') {
							$(e).addClass('ft-datapipe-red-bg');
							$('.' + $(e).attr('id') + '_lgd')
									.addClass('ft-datapipe-red-bg');
						} else {
							$(e).css({
										'background-color' : _bgcolor
									});
							$('.' + $(e).attr('id') + '_lgd').css({
										'background-color' : _bgcolor
									});
						}
					});

					if (count < aClasses.length) {
						count++;
						processColors();
					} else {
						return;
					}
				};
				processColors();
			}

		});

	};

})(jQuery, this, this.document);

function navigateToPage(statusDesc) {
	var me = this;
	$(document).trigger("pipelineClicked", statusDesc);
}

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

function createCookie(name, value, days)
{
	if (days == undefined)
	{
		expires = "";
	}
	else
	{
    	var date = new Date();
    	date.setTime(date.getTime() + (days*24*60*60*1000));
    	var expires = "; expires=" + date.toGMTString();
  	}
	document.cookie = name + "=" + value+expires + "; path=/";
}

function readCookie(name)
{
  	var nameEQ = name + "=";
  	var ca = document.cookie.split(';');
  	for (var i=0;i < ca.length;i++)
	{
    	var c = ca[i];
    	while (c.charAt(0) == ' ') c = c.substring(1,c.length);
    	if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  	}
  	return null;
}

function eraseCookie(name)
{
	createCookie(name,"",-1);
}

$(function(){
	 var cookie = readCookie("sidemenu_state");
	 var doc = $(document.documentElement);
	 var _class = 'ft-sidebar-hidden';
	 var sidemenu_Wgt_Map = readCookie("sidemenu_widgets");
	 if(sidemenu_Wgt_Map)
	 {	  
			var mydata = JSON.parse(sidemenu_Wgt_Map);
			$.each( mydata, function( index, value ) {
			if(value == 'N'){
			$("#"+index).addClass('ft-accordion-collapsed');
			}
			else if(value == 'Y'){
			$("#"+index).removeClass('ft-accordion-collapsed');
			}
		});

	 }
	 
	 if(cookie){
			 if(cookie == 'SHOW'){
			  doc.addClass(_class);
			 }
			 else if(cookie == 'HIDE'){
			 doc.removeClass(_class);
			 }
			 $('.ft-accordion-header-txt').html(cookie);
	 }
});

$(document).on('click', '.ft-dropdown .ft-dropdown-toggle', function(event) {
	$(".ft-dropdown .ft-dropdown-toggle").each(function() {
		if ($(this).is($(event.target)) || $(this).is($(event.target).parent())) { //do nothing..
		} else
			($(this).closest('div.ft-dropdown')).find('div.ft-dropdown-menu')
					.hide();
	});
	($(this).closest('div.ft-dropdown')).find('div.ft-dropdown-menu')
			.toggle('show');
});
$(document).click(function(event) {
	if (!$(event.target).is(".ft-dropdown-toggle")
			&& !$(event.target).parent().is(".ft-dropdown-toggle")
			&& !($(event.target).attr('type') === 'checkbox')) {
				$('.ft-dropdown-menu').hide();
	}
});
$(document).on('click', '.panel-title .toggle-handler', function(e) {
	$(this).parents('div.panel-heading').siblings('div.panel-body').slideToggle();
	$(this).toggleClass('fa-caret-up fa-caret-down');
});

$(document).on('click', '.input-daterange .input-group-addon', function(e) {
	var inputElement = $(this).siblings('input.ft-datepicker');
	openDatePicker(inputElement);
});

$(document).on('click', '.icon-calendar', function(e) {
	var inputElement = $(this).parent().find('input.ft-datepicker');
	openDatePicker(inputElement);
});

function openDatePicker(inputElement) {
	if(typeof inputElement.data('datepick') === "undefined") {
		inputElement.datepicker().datepicker('show');
	} else {
		inputElement.datepick().datepick('show');
	}
}

function setNavigationCookie(strUrl) {
	var mainNavItem = $('.ft-header-nav .ft-main-nav > li:has(a[href="'+strUrl+'"])');
	if(mainNavItem.length > 0){
		var subNavItem = mainNavItem.find('a[href="'+strUrl+'"]');
			mainNavItem = mainNavItem.children('a').attr('data-mainNavId');
		if(subNavItem.length > 0){ 
			var secNavItem = subNavItem.closest('ul');
			if(secNavItem.hasClass('ft-sub-nav-3')){
				secNavItem = secNavItem.prev('a').text();
				if(secNavItem){
					mainNavItem = mainNavItem + "^" + secNavItem;
				}
			}
			mainNavItem = mainNavItem + "^" + subNavItem.text();
		}
		$.cookie('nav-addr', mainNavItem);
	}
}
function isEmptyVal(val) {
    if (typeof val == 'undefined') return true;
    if (null == val) return true;
    if (undefined == val) return true;
    if (typeof val == "string" && val.length <= 0) return true;
    if (typeof val == "string" && "null" == val) return true;
    return false;
};
 window.addEventListener('scroll', function(e){ 
	var target=e.target.className;
	if(target=='ft-content-pane-scroll')
	{
		 $(".ui-autocomplete-input").autocomplete("close");
		 $(".nice-select-list").hide();
	}
	if(target=='x-grid-view x-fit-item x-grid-view-default')
	{
		$(".x-menu").click();
		 $(".x-menu").css('visibility', 'hidden');
	}
}, true);
function msgbox(_title, _messageHtml) {
     $('<div></div>').appendTo('body')
                 .html(_messageHtml)
                 .dialog({
                     modal: true, title: _title, zIndex: 10000, autoOpen: true,
                     width: 'auto', resizable: false,
                     buttons: {
                         Ok: function () {
                             
                             $(this).dialog("close");
                         }
                     },
                     close: function (event, ui) {
                         $(this).remove();
                     }
                 });
 };