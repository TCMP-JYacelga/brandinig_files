Ext.define('GCP.view.IncomingWiresGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid'],
	xtype : 'incomingWiresGridView',
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
			cls : 'xn-ribbon',
			title : getLabel('transactions', 'Transactions'),
			itemId : 'incomingWiresDtlView'
		}];
		this.callParent(arguments);
	}

});