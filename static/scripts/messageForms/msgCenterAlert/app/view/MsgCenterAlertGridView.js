Ext.define('GCP.view.MsgCenterAlertGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['GCP.view.MsgCenterAlertGroupActionBarView','Ext.ux.gcp.SmartGrid'],
	xtype : 'msgCenterAlertGridView',
	componentCls : 'gradiant_back',
	padding : '12 0 0 0',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.MsgCenterAlertGroupActionBarView', {
			itemId : 'msgCenterAlertGroupActionBarView_summDtl',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		});
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			cls : 'ux_hide-image',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						margin : '6 0 3 0',
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
			width : '100%',
			cls : 'xn-panel',
			autoHeight : true,
			margin : '5 0 0 0',			
			itemId : 'msgCenterAlertDtlView',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				items : [{
							xtype : 'label',
							text : getLabel('actions', 'Actions') + ':',
							cls : 'ux_font-size14',
							padding : '5 0 0 10'
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