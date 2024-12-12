Ext.define('Cashweb.view.portlet.WidgetTool', {
	extend: 'Ext.panel.Panel',
	portlet: null,
	portletCollapsed: false,
	
	initComponent: function() {
		var thisClass = this;
		this.items = [{
			xtype : 'container',
			cls : 'widgetcls',
			listeners: {
				render: function(c) {
					c.getEl().on('click', function() {
						var widgetToCollapse = thisClass.portlet.up('portlet');
						if(thisClass.portletCollapsed == false) {
							c.getEl().removeCls("widgetcls");
							c.getEl().addCls("widget-collapse-cls");
							thisClass.portletCollapsed = true;
							thisClass.portlet.state = 'collapsed';
						} else {
							c.getEl().removeCls("widget-collapse-cls");
							c.getEl().addCls("widgetcls");
							thisClass.portletCollapsed = false;
							thisClass.portlet.state = 'expanded';
						}
						
						widgetToCollapse.toggleCollapse();
					});
				}
			}
		}];
		this.callParent();
	}
});