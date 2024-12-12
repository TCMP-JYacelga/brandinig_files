Ext.define('GCP.view.LiquidityRefTimeGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.LiquidityRefTimeActionBarView','Ext.panel.Panel'],
	xtype : 'liquidityRefTimeGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.LiquidityRefTimeActionBarView', {
					itemId : 'groupActionBarView',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
				xtype : 'container',
				layout : 'hbox',
				cls : 'ux_panel-background',
				flex : 1,
				items : [{
							xtype : 'toolbar',
							itemId : 'btnCreateNewToolBar',
							cls : ' ux_panel-background ux_extralargepadding-bottom',
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
								padding : '0 0 0 5'
							}]
						
			}]
		}, {
			xtype : 'panel',
			width : '100%',
			cls : 'xn-ribbon',
			bodyCls : 'x-portlet ux_no-padding ux_panel-transparent-background',
			autoHeight : true,		
			margin: '12 0 0 0',
			collapsible : true,
			title : getLabel('referenceTimes', 'Reference Times'),
			itemId : 'liquidityRefTimeDtlView',
			items : [
			         {
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_border-top',
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