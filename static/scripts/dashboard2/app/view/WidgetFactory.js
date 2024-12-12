Ext.define('Cashweb.view.WidgetFactory', {
	createWidget : function(widgetCode, record) {
		var widgetName = "widget." + widgetCode;
		var widgetPortlet = null;
		var titleforwidget = null;
		var titleforsettings = null;
		var portletSettings = null;
		var expCollapseTool = null;
		var refreshTool = null;
		var draggableConfig = null;
		var closable = false;
		var header = true;
		var toolsPresent = false;
		var position = null;
		var collapsed = null;
		var minimumHeight = (widgetCode === 'paymentspipe') ? 180 : 280;
		var collapseCls = null;
		var tooltiptext = "";
		var toolTip = null;

		if (record.get('collapsedFlag') === "true") {
			collapsed = true;
			collapseCls = 'widgetcls fa fa-caret-down';
		} else {
			collapsed = false;
			collapseCls = 'widget-collapse-cls fa fa-caret-up';
		}
		widgetPortlet = Ext.create(widgetName, {
					record : record
				});

		titleforwidget = label_map[widgetCode];
		settingsTool = Ext.create('Ext.Button', {
							iconCls : 'fa fa-gear',
							arrowCls : '',
							tooltip: getLabel('settings', 'Settings'),
							menuAlign : 'tr-br?',
							height: 30,
							cls : 'widget-header-menu',
							record : record,
							allowDepress : false,
							menu : Ext.create('Ext.menu.Menu', {
									    width: 100,
									    cls : 'widget-header-menu',
									    plain: true,
									    items: [{
													text : getLabel('settings', 'Settings'),
													iconCls : 'fa fa-gear',
													disabled : !(typeof widgetPortlet.showSettingsPopup == 'function'),
													listeners : {
														click : function(tool, event, opt) {
															if(_IsEmulationMode == true)
															{
																Ext.MessageBox.show(
																		{
																			title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
																			msg : getLabel( 'emulationError', 'You are in emulation mode cannot perform save or update.' ),
																			buttons : Ext.MessageBox.OK,
																			cls : 'ux_popup',
																			icon : Ext.MessageBox.ERROR
																		} );
															}else
															{
																if (typeof widgetPortlet.showSettingsPopup == 'function') {
																	widgetPortlet.showSettingsPopup(widgetCode,
																			titleforsettings, record);
																} 
															}
														}
													}
												}, {
													text : getLabel('removeWdgt', 'Remove Widget'),
													iconCls : 'fa fa-times-circle',
													listeners: {
														click : function(tool, event, opt) {
															if(_IsEmulationMode == true)
															{
																Ext.MessageBox.show(
																		{
																			title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
																			msg : getLabel( 'emulationError', 'You are in emulation mode cannot perform save or update.' ),
																			buttons : Ext.MessageBox.OK,
																			cls : 'ux_popup',
																			icon : Ext.MessageBox.ERROR
																		} );
															}
															else
															{
																widgetPortlet.up('panel').close();
															}
														}
													}
												}]
									})
						});

		if ((record.get('widgetType') != "BANNER") && (record.get('widgetType') != "HALFBANNER")) {
			expCollapseTool = Ext.create('Cashweb.view.portlet.WidgetTool', {
						portlet : widgetPortlet,
						componentCls : 'widget-close',
						classCls : collapseCls,
						portletCollapsed : record.get('collapsedFlag')
								|| 'false'
					});

			refreshTool = Ext.create('Ext.panel.Tool', {
						type : 'refresh',
						itemId : widgetCode + '_refresh',
						tooltip : getLabel("refresh","Refresh"),
						record : record,
						renderTpl: [
							'<i class="x-tool-img x-tool-refresh"></i>'
						],
						listeners : {
							click : function(tool, event, opt) {
								widgetPortlet.fireEvent('refreshWidget');
							}
						}
					});
			closeTool = Ext.create('Ext.panel.Tool', {
				type: 'close',
				itemId: widgetCode + '_close',
				record: record,
				renderTpl: [
				            '<i class="x-tool-img x-tool-close"></i>'
				],
				listeners: {
					click : function(tool, event, opt) {
						widgetPortlet.up('panel').close();
					}
				}
			});
			draggableConfig = {
				moveOnDrag : false
			}
			closable = true;
			toolsPresent = true;
		}
		// for BANNER
		else if ((record.get('widgetType') === "BANNER" || record.get('widgetType') === "HALFBANNER")
				&& record.get('closable') === "Y") {
			expCollapseTool = Ext.create('Cashweb.view.portlet.WidgetTool', {
						portlet : widgetPortlet,
						componentCls : 'widget-close',
						cls : 'widget-collapse-cls',
						portletCollapsed : record.get('collapsedFlag')
								|| 'false'
					});
			minimumHeight = 200;
			collapsed = false;
			toolsPresent = false;
			draggableConfig = false;
			titleforwidget = 'Banner';
			closable = true;
			header = true;

		} else {
			draggableConfig = false;
			titleforwidget = '';
			closable = closable;
			header = false;
		}

		titleforsettings = titleforwidget + ' '+getLabel("settings","Settings");
		// setting CustomName from Widget if present
		if (!Ext.isEmpty(record.get('settings'))) {
			var settings = record.get('settings');
			for (i = 0; i < settings.length; i++) {
				fieldName = settings[i].field;
				fieldVal = settings[i].value1;

				if (fieldName === 'customname') {
					if (!Ext.isEmpty(fieldVal)) {
						titleforsettings = titleforwidget + ' '+getLabel("settings","Settings");
						titleforwidget = fieldVal;
					}
				}
			}
		} else
			titleforsettings = titleforwidget + ' '+getLabel("settings","Settings");

		// max chars for widgetname after that ellipses should come
		if (widgetPortlet.cols === 1) {
			var truncatedWidgetLabel = '';
			tooltiptext = titleforwidget;
			truncatedWidgetLabel = Ext.util.Format.ellipsis(titleforwidget, 13);
			titleforwidget = truncatedWidgetLabel;
			if (tooltiptext.length > 13) {
				toolTip = Ext.create('Ext.tip.ToolTip', {
							html : tooltiptext
						});
			}
			widgetPortlet.toolTip = toolTip
		}
		position = Math.floor((Math.random() * 100000));
		widgetPortlet.titleId = widgetCode.toLowerCase() + position,
		// var datalabelCmp=widgetCode+'dateLabel';		
		titleforwidget = titleforwidget + '<span id='
				+ widgetCode.toLowerCase() + position + '>&nbsp;&nbsp;</span> '
		var config = {
			title : titleforwidget,
			record : record,
			draggable : draggableConfig,
			portlet : widgetPortlet,
			widgetCode : widgetCode,
			minHeight : minimumHeight,
			overflowY : 'auto',
			autoScroll : true,
			header : header,
			colSize : widgetPortlet.cols,
			layout : 'card',
			items : [widgetPortlet],
			collapsed : collapsed
		};

		if (toolsPresent) {
			config.tools = [expCollapseTool, refreshTool, settingsTool];
		} else {
			if (!Ext.isEmpty(expCollapseTool))
				config.tools = [expCollapseTool];
		}
		return config;
	},
	createDynamicPanel : function(record) {
		var iframe = Ext.create("Ext.ux.IFrame", {
					src : record.get('defaultUrl'),
					autoScroll : true,
					layout : 'fit',
					maxHeight : 300
				});
		return iframe;

	}
});