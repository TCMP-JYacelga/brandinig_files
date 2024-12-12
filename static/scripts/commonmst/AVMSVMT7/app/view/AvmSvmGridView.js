Ext.define('GCP.view.AvmSvmGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'GCP.view.AvmSvmGroupActionBar',
			'Ext.panel.Panel'],
	xtype : 'avmSvmGridView',
	width : '100%',
	cls:'xn-ribbon',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.AvmSvmGroupActionBar', {
					itemId : 'avmSvmGroupActionBar_Dtl',
					height : 21,
					width : '100%',
					cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
					parent : me
				});
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'toolbar',
						itemId : 'btnCreateNewToolBar',
						cls : 'ux_panel-background ux_extralargepadding-bottom',
						flex : 1,
						items : []
					}, {
						xtype : 'container',
						layout : 'hbox',
						hidden:true,
						cls : 'rightfloating',
						items : [{
							xtype : 'button',
							border : 0,
							itemId : 'btnSearchOnPage',
							text : getLabel('searchOnPage', 'Search on Page'),
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
												boxLabel : getLabel('anyMatch',
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
			collapsible : true,	
			title : getLabel('matrixSummaryList', 'Matrix List'),			
			autoHeight : true,
			cls:'ux_panel-background',
			componentCls: 'x-portlet ux_no-padding',
			itemId : 'avmSvmDtlView',
			items : [ {
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_largepaddinglr ux_border-top ux_panel-transparent-background',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ' :',
									cls : 'font_bold ux-ActionLabel',
									padding : '4 0 2 3'
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