Ext.define('GCP.view.InvestmentCenterGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['GCP.view.InvestmentCenterGroupActionBarView', 'Ext.ux.gcp.SmartGrid'],
	xtype : 'investmentCenterGridView',
	cls : 'xn-ribon',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.InvestmentCenterGroupActionBarView', {
					itemId : 'investmentCenterGroupActionBarView_summDtl',
					height : 21,
					width : '100%',
					margin : '2 0 0 0',
					parent : me
				});
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [ {
						xtype : 'container',
						cls : 'ux_hide-image',
						layout : 'hbox',
						//margin : '6 0 3 0',
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
			title : getLabel('investmentTransactions', 'Transactions'),
			itemId : 'investmentCenterDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						cls : 'ux_panel-transparent-background ux_border-top',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'font_bold ux-ActionLabel',
									padding : '7 0 0 10'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}];
		this.callParent(arguments);
	}

});