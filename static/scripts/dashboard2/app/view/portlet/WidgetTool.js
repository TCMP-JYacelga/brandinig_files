Ext.define('Cashweb.view.portlet.WidgetTool', {
	extend : 'Ext.panel.Panel',
	portlet : null,
	portletCollapsed : null,
	classCls : null,

	initComponent : function() {
		var thisClass = this;
		this.items = [{
			xtype : 'container',
			cls : this.classCls,
			listeners : {
				render : function(c) {
					var widget = thisClass.portlet.up('portlet2');
					widget.getHeader().addCls('widget-header');
					c.getEl().on('click', function() {
						var widgetToCollapse = thisClass.portlet.up('portlet2');
						if (widgetToCollapse.record.get('widgetType') === 'BANNER' || widgetToCollapse.record.get('widgetType') === 'HALFBANNER'){
							if(widgetToCollapse.record.get('widgetType') != 'HALFBANNER')
								$(document).trigger('showbanner');
							widgetToCollapse.getHeader().hide();
						}	
						else {
							if (thisClass.portletCollapsed == "false") {
								c.getEl().removeCls("widget-collapse-cls fa fa-caret-up");
								//thisClass.removeCls("widgetcls fa fa-caret-down");
								c.getEl().addCls("widgetcls fa fa-caret-down");
								//thisClass.addCls("widget-collapse-cls fa fa-caret-up");
								thisClass.portletCollapsed = "true";
								thisClass.portlet.state = 'collapsed';
							} else {
								c.getEl().removeCls("widgetcls fa fa-caret-down");
								//thisClass.removeCls("widget-collapse-cls fa fa-caret-up");
								c.getEl().addCls("widget-collapse-cls fa fa-caret-up");
								//thisClass.addCls("widgetcls fa fa-caret-down");
								thisClass.portletCollapsed = "false";
								thisClass.portlet.state = 'expanded';
							}
							widgetToCollapse.toggleCollapse();
							if(thisClass.portlet.state == 'expanded'){
								var aliasVar = "widget." + widgetToCollapse.widgetCode;
								if(null != widgetToCollapse.down('panel[alias='+aliasVar+']')  && undefined != widgetToCollapse.down('panel[alias='+aliasVar+']')){
									widgetToCollapse.down('panel[alias='+aliasVar+']').getTargetEl().unmask();
									widgetToCollapse.down('panel[alias='+aliasVar+']').setLoading(false);									
								}
							}
							widgetToCollapse.fireEvent("collpaseClick",
									widgetToCollapse.record,
									thisClass.portletCollapsed);
						}
					});
				}
			}
		}];
		this.callParent();
	}
});