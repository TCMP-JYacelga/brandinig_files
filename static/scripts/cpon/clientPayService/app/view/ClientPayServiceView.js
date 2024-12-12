Ext.define('GCP.view.ClientPayServiceView', {
	extend : 'Ext.container.Container',
	xtype : 'clientPayServiceView',
	requires : ['Ext.container.Container','GCP.view.ClientPayActionBarView'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.ClientPayActionBarView', {
					itemId : 'gridActionBar',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		me.items = [{
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				items : [{
							xtype : 'toolbar',
							itemId : 'btnCreateNewToolBar',
							cls : '',
							flex : 1,
							items : []
						}, {
							xtype : 'container',
							layout : 'hbox',
							cls : 'rightfloating',
							items : [{
								xtype : 'button',
								border : 0,
								itemId : 'btnSearchOnPage',
								text : getLabel('btnSearchOnPage',
										'Search on Page'),
								cls : 'xn-custom-button cursor_pointer',
								padding : '5 0 0 3',
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
								itemId : 'searchTextField',
								cls : 'w10',
								padding : '0 0 0 5'
							}]
						
			}]
		}, {
			xtype : 'panel',
			width : '100%',
			cls : 'xn-panel',
			autoHeight : true,
			margin : '5 0 0 0',
			itemId : 'payServiceDtlView',
			items : [{
							xtype : 'container',
							layout : 'hbox',
							itemId : 'gridHeader',
							items : []
						},{
						xtype : 'container',
						itemId : 'actionBarContainer',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'font_bold ux_font-size14',
									padding : '5 0 0 10'
								},
								actionBar, 
								{
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});