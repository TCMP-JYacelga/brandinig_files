Ext.define('Cashweb.view.portlet.HalfBanner1', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.halfbanner1',
	border : false,
	//padding : '0 0 0 5',
	taskRunner : null,
	cols : 2,
	config : {
		height : 250,
		layout : 'fit'
	},
	arrStrHtml : [],
	hideHeader : true,
	itemId : 'halfbannerPanel1',
	initComponent : function() {
		var thisClass = this;
		thisClass.on('resize',function(){
			var width = '675';
			if (jQuery(document).width() > 1400 || screen.width > 1280)
				width = '675';
			thisClass.loadImages(width);
		});
		thisClass.on('render', function() {
					var width = '675';
					thisClass.up('panel').removeCls('xn-portlet');
					thisClass.up('panel').addCls('banner-portlet');
					thisClass.up('panel').removeBodyCls('ux_bodyCls');
					if (jQuery(document).width() > 1400 || screen.width > 1280)
						width = '675';
					thisClass.loadImages(width);
				});

		thisClass.on('afterrender', function() {
					var header = thisClass.up('panel').getHeader();
					//Removed collpase and close icons from banner as of now ToDo
					if (thisClass.record.get('closable') === 'Y') {
						thisClass.mon(thisClass.getEl(), 'mouseenter',
								function() {
									$("#closeicon1").show();
								}, thisClass);
					}
					thisClass.mon(thisClass.getEl(), 'mouseleave', function() {
								$("#closeicon1").hide();
							}, thisClass);

					if (!Ext.isEmpty(thisClass.up('panel'))) {
						header = thisClass.up('panel').getHeader();
						if (header && !Ext.isEmpty(header)) {
							header.hide();
							thisClass.up('panel').show();
						}
					}
					//$(document).on('hideShowSidebar',
					//		function(event, actionName) {
					//			var doc = $(document.documentElement);
					//			var _class = 'ft-sidebar-hidden';
					//			var msg;
					//			// Is sidebar hidden?
					//			if (doc.hasClass(_class)) {
					//				var width = '1200';
					//				if (jQuery(document).width() > 1400 || screen.width > 1280)
					//					width = '1280';
					//				thisClass.loadImages(width);
					//			} else {
					//				var width = '980';
					//				if (jQuery(document).width() > 1400 || screen.width > 1280)
					//					width = '1060';
					//				thisClass.loadImages(width);
					//			}
					//		});
					//$(document).on('hidebanner', function(event) {
					//			header.show();
					//			if (!Ext.isEmpty(thisClass.up('panel')))
					//				thisClass.up('panel').collapse();
					//			else
					//				thisClass.collapse();
					//		});
					//$(document).on('showbanner', function(event) {
					//			if (!Ext.isEmpty(thisClass.up('panel'))) {
					//				thisClass.up('panel').toggleCollapse();
					//			} else {
					//				thisClass.toggleCollapse();
					//			}
					//		});
					$(document).on('closebanner2', function(event) {
								if (!Ext.isEmpty(thisClass.up('panel'))) {
									thisClass.up('panel').doClose();
								} else {
									thisClass.doClose();
								}
							});
				});
		thisClass.on('boxready', function() {
					$("#bannericons").hide();
					$('.jcarousel').jcarousel({
								wrap : 'circular'
							});
					$('.jcarousel-pagination').on('jcarouselpagination:active',
							'a', function() {
								$(this).addClass('activeSlide');
							}).on('jcarouselpagination:inactive', 'a',
							function() {
								$(this).removeClass('activeSlide');
							}).jcarouselPagination();
					$('.jcarousel').jcarouselAutoscroll({
								interval : 45000,
								autostart : true
							});
				});
		Ext.apply(this, {
					items : [{
								itemId : 'bannerParentPanel',
								height : 200,
								width : '100%',
								items : [{
											xtype : 'panel',
											height : 200,
											width : '100%',
											itemId : 'bannerPanel',
											items : []
										}]
							}]
				});
		this.callParent(arguments);
	},
	loadImages : function(width) {
		var me = this;

		Ext.Ajax.request({
			url : 'services/getHalfBannerImages.json',
			method : 'POST',
			async : false,
			success : function(response) {
				obj = Ext.decode(response.responseText);
				var arrPaths = obj.summary;
				var arrUrls = obj.urls;
				var arrStrHtml = [];
				arrStrHtml.push("<div class='jcarousel-wrapper' style='width="
						+ width + "'>");
				arrStrHtml.push("<div class='jcarousel'>");
				arrStrHtml.push("<ul>");
				for (var i = 0; i < arrPaths.length; i++) {
					arrStrHtml.push("<li><img src='" + arrPaths[i]
							+ "'  width=" + width
							+ " height='200' "
							//Temporary navigation from banner disabled for 4.4 changes.
							//+ " onclick='navigateTo(\""
							//+ arrUrls[i]
							//+ "\");' " 
							+ "style='position:relative;'></li>");
				}
				arrStrHtml.push("</ul>");
				//Removed collpase and close icons from banner as of now ToDo
				/*arrStrHtml
						.push("<div id='bannericons'><img src='static/images/T7/row-expander-minus.png' style='position:absolute; padding: 8px 0px 0px 6px;'  onclick='toggleBannerCollapse()'></img>a");*/
				arrStrHtml
						.push("<div id='closeicon1' style='display:none'><img src='static/images/T7/close-circle.png' style='position:absolute; top:7px; left:97%;'  onclick='closeBanner(2)'></img></div>");
				arrStrHtml
						.push("<div id='bannerrotateicons'><i class='fa fa-chevron-left banner-prev' onclick='prevImage()' style='margin-left: 35px;'></i>a");
				arrStrHtml
						.push("<i class='fa fa-chevron-right banner-next' onclick='nextImage()' style='left: 95%;'></i></div>");		
				arrStrHtml.push("</div>");
				arrStrHtml.push("<p class='jcarousel-pagination'></p>");
				arrStrHtml.push("</div>");
				me.createImagePanel(arrStrHtml);
			},
			failure : function(response) {
				if (response.status === 400) {
					me.setLoading(false);
				}
				if (response.status === 500) {
					me.setLoading(false);
				}
			}
		});
	},
	createImagePanel : function(arrStrHtml) {
		var me = this, imagePanel = null;
		imagePanel = Ext.create('Ext.panel.Panel', {
					html : arrStrHtml.join("\n")
				});
		var bannerPanel = me.down('panel[itemId="bannerPanel"]');
		if (!Ext.isEmpty(bannerPanel)) {
			bannerPanel.removeAll();
			bannerPanel.add(imagePanel);
		}
		$('.jcarousel').jcarousel({
					wrap : 'circular'
				});
		$('.jcarousel-pagination').on('jcarouselpagination:active', 'a',
				function() {
					$(this).addClass('activeSlide');
				}).on('jcarouselpagination:inactive', 'a', function() {
					$(this).removeClass('activeSlide');
				}).jcarouselPagination();
		$('.jcarousel').jcarouselAutoscroll({
					interval : 45000,
					autostart : true
				});
	},
	getSettingsPanel : function() {
		var settingsPanel = Ext.create('Ext.panel.Panel', {
					getSettings : function() {
						var me = this;
						var jsonArray = [];
						return jsonArray;
					}
				});
		return settingsPanel;
	},
	getDataPanel : function() {
		return this;
	}
});