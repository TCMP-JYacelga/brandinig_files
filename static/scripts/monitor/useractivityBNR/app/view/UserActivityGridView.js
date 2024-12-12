Ext.define('GCP.view.UserActivityGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid'],
	xtype : 'userActivityGridView',
	cls : 'xn-ribbon',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function() {
		var me = this;
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				margin : '6 0 3 0',
				cls : 'ux_hide-image',
				flex : 1,
				items : [{
							xtype : 'label',
							text : '',
							flex : 1
						}, {
							xtype : 'container',
							layout : 'hbox',
							cls : 'rightfloating',
							items : [{
								xtype : 'button',
								border : 0,
								itemId : 'btnSearchOnPage',
								text : getLabel('searchOnPage',
										'Search on Page'),
								cls : 'xn-custom-button cursor_pointer',
								padding : '0 0 0 3',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'menu',
											items : [{
												xtype : 'radiogroup',
												itemId : 'matchCriteria',
												vertical : true,
												columns : 1,
												items : [{
													boxLabel : getLabel(
															'exactMatch',
															'Exact Match'),
													name : 'searchOnPage',
													inputValue : 'exactMatch'
												}, {
													boxLabel : getLabel(
															'anyMatch',
															'Any Match'),
													name : 'searchOnPage',
													inputValue : 'anyMatch',
													checked : true
												}]

											}]
										})
							}, {
								xtype : 'textfield',
								itemId : 'searchTxnTextField',
								cls : 'w10',
								padding : '0 0 0 5'
							}]
						}]
			}]
		}, {
			xtype : 'panel',
			collapsible : true,
			width : '100%',
			cls : 'xn-ribbon ux_no-border',
			bodyCls : 'x-portlet ux_no-padding',
			title : getLabel('lbluseractivity', 'User Activity'),
			itemId : 'usrActDtlView',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				cls : 'ux_panel-transparent-background ux_border-top',
				items : [{
							xtype : 'label',
							text : getLabel('lblaction', 'Action') + ':',
							cls : 'ux_font-size14',
							padding : '2 0 0 10'
						}, {
							xtype : 'button',
							itemId : 'killSession',							
							disabled : true,
							actionName : 'kill',
							maskPosition : 3,
							text : '<span class="button_underline thePointer">'
									+ getLabel('lblkillsession', 'Terminate Session')
									+ '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '2 0 5 0',
							handler : function() {
								me.fireEvent('performGroupAction', this);
							}
						}, {
							xtype : 'label',
							text : '',
							flex : 1
						}]

			}]
		}];
		this.callParent(arguments);
	}

});