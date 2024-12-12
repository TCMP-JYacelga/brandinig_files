Ext.define('GCP.view.NonCMSStopPayGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['GCP.view.NonCMSStopGroupActionBarView', 'Ext.ux.gcp.SmartGrid'],
	xtype : 'nonCMSGridView',
	//cls : 'xn-panel',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.NonCMSStopGroupActionBarView', {
					itemId : 'nonCMSGroupActionBarView_summDtl',
					height : 21,
					width : '50%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						//margin : '6 0 3 0',
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
			cls : 'xn-ribbon ux_border-bottom ux_panel-transparent-background',
			bodyCls : 'x-portlet ux_no-padding',
			title : getLabel('lbltransactions', 'Check Details'),
			itemId : 'nonCMSDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						flex : 1,
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