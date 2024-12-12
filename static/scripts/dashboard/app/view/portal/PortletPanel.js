Ext.define('Cashweb.view.portal.PortletPanel', {
	extend : 'Ext.ux.portal.PortalPanel',
	requires: ['Ext.ux.portal.PortalPanel'],
	alias : 'widget.portletpanel',

	config : {
		portletItems : null
	},

	initComponent : function() {

		var headerCls = "header";
		Ext.apply(this, {
			border : false,
			defaults : {

				border : false,
				bubbleEvents : [ "add", "remove", "resize" ]
			},
			items : [ {
				// this is a portal column
				defaults : {
					//cls : 'x-portlet-container',
					cls : 'xn-ribbon xn-portlet',
					margin : '0 0 12 0',
//					closable : false,
					collapsible : false,
					animCollapse : false,
					//padding : "2.5 0 2.5 0",
					border : false,
					bubbleEvents : ["add","remove","resize"]
				},

				items : this.portletItems

			} ]

		});

		this.callParent(arguments);
	}
});
