Ext.define('GCP.view.SCMProductGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.SCMProductActionBarView','Ext.panel.Panel'],
	xtype : 'scmProductGridView',
	width : '100%',
	cls : 'ux_largepaddingtb',
	
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.SCMProductActionBarView', {
					itemId : 'clientGroupActionBarView_clientDtl',
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
								cls : 'xn-custom-button cursor_pointer ',
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
			cls : 'xn-ribbon ux_panel-transparent-background',
			bodyCls : 'x-portlet ux_no-padding',
			autoHeight : true,
			collapsible: true,
			title: getLabel('scmProduct', 'SCF Package'),
			margin : '12 0 0 0',
			itemId : 'clientSetupDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_border-top ux_panel-transparent-background',
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