Ext.define('Cashweb.view.portal.PortletPanel', {
			extend : 'Ext.ux.portal2.PortalPanel',
			requires : ['Ext.ux.portal2.PortalPanel'],
			alias : 'widget.portletpanel2',
			config : {
				portletItems : null
			},
			initComponent : function() {
				var bodyCls = Ext.isIE9 ? 'ux_bodyCls' : '';
				var headerCls = "header";
				Ext.apply(this, {
							border : false,
							defaults : {
								border : false,
								bubbleEvents : ["add", "remove", "resize"]
							},
							items : [{
										// this is a portal column
										defaults : {
											//These are portlets
											cls : 'xn-ribbon xn-portlet',
											margin : '20 15 20 15',
											bodyCls : bodyCls,
											collapsible : false,
											animCollapse : false,
											border : false,
											bubbleEvents : ["add", "remove",
													"resize"]
										},
										items : this.portletItems
									}]
						});
				this.callParent(arguments);
			}
		});
