Ext.define('GCP.view.FinanceSetupGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.FinanceSetupActionBarView','Ext.panel.Panel'],
	xtype : 'financeSetupGridView',
	width : '100%',
	cls: 'ux_panel-background',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.FinanceSetupActionBarView', {
					itemId : 'financeSetupActionBarView_clientDtl',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
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
							cls : 'rightfloating ux_hide-image',
							items : [{
								xtype : 'button',
								border : 0,
								itemId : 'btnSearchOnPage',
								text : getLabel('searchOnPage',
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
								padding : '0 0 0 5',
								margin : '0 10 0 0'
							}]
						
			}]
		}, {
			xtype : 'panel',
			width : '100%',
			cls : 'xn-ribbon gradiant_back',
			autoHeight : true,
			margin : '5 0 0 0',
			itemId : 'clientSetupDtlView',
			items : [{
							xtype : 'container',
							layout : 'hbox',
							itemId : 'gridHeader',
							items : []
						},{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'ux_ActionLabel',
									padding : '5 0 0 3'
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