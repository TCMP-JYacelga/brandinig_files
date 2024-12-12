Ext.define('Cashweb.view.WidgetFactory', { 

	createWidget: function(widgetCode, record) {
		var widgetName = "widget."+widgetCode;
		var widgetPortlet = null;
		var titleforwidget = null;
		var expCollapseTool = null;
		var refreshTool = null;
		var draggableConfig = null;
		var closable = false;
		var header = true;
		var toolsPresent = false;
		
		if(record.get('widgetType') === "CONTENT")
		{
			widgetPortlet = this.createDynamicPanel(record);
		}
		else
		{
		 widgetPortlet = Ext.create(widgetName, {record : record });
		}	
		 		
		if(widgetCode === "pay_excptn")
			titleforwidget = label_map[widgetCode] +" "+ label_map.titleOfPayException;
		else if(record.get('widgetType') === "CONTENT")
			titleforwidget = record.get('widgetName');
		else
			titleforwidget = label_map[widgetCode] ;
		if((record.get('widgetType') != "BANNER") && (record.get('widgetType') != "CONTENT") ) {
			expCollapseTool = Ext.create('Cashweb.view.portlet.WidgetTool', {
								portlet : widgetPortlet,
								componentCls : 'widget-close'
							});
						
			refreshTool = Ext.create('Ext.panel.Tool', {
								type : 'refresh',
								itemId : widgetCode + '_refresh',
								record : record,
								listeners : {
									click : function(tool, event, opt) {
										if (widgetPortlet.handleRefresh == true)
											widgetPortlet.portletRefresh();
									}
								}
							});
			draggableConfig = {
				moveOnDrag : false
			}
			if(record.get('closable') == "Y")
				closable = true;
			toolsPresent = true;
		} 
		else if(record.get('widgetType') === "CONTENT")
		{
			expCollapseTool = Ext.create('Cashweb.view.portlet.WidgetTool', {
								portlet : widgetPortlet,
								componentCls : 'widget-close'
							});
			draggableConfig = {
				moveOnDrag : false
			}
			
			if(record.get('closable') == "Y")
				closable = true;
			toolsPresent = true;
		}
		else {
			draggableConfig = false;
			titleforwidget = '';
			closable = closable;
			header = false;
		}
		//var datalabelCmp=widgetCode+'dateLabel';
		titleforwidget=titleforwidget+'<span id='+widgetCode+'>&nbsp;&nbsp;</span> '
		
		var config = {
			title : titleforwidget,
			record : record,
			draggable : draggableConfig,
			portlet : widgetPortlet,
			widgetCode : widgetCode,
			closable : closable,
			header: header,
			items : [ widgetPortlet ]
		};
		
		if(toolsPresent){
			config.tools=[expCollapseTool, refreshTool];
		}
		
		return config;
		
	},
	createDynamicPanel : function(record)
	{
		var iframe = Ext.create("Ext.ux.IFrame", {
			src: record.get('defaultUrl'),
			autoScroll : true,
			layout : 'fit',
			maxHeight :300
		});
		return iframe;
		
	}
});