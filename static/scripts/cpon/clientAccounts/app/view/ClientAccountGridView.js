Ext.define('GCP.view.ClientAccountGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.ClientAccountActionBarView','Ext.panel.Panel'],
	xtype : 'clientAccountGridView',
	width : '100%',
	componentCls : 'ux_panel-background  x-portlet',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.ClientAccountActionBarView', {
					itemId : 'accountActionBar',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
				xtype : 'container',
				layout : 'hbox',
				cls : 'ux_extralargepadding-bottom',
				flex : 1,
				items : [{
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
			collapsible : true,
			title : getLabel('accountlist', 'Account List'),
			cls : 'xn-ribbon ux_panel-transparent-background ux_border-bottom',
			autoHeight : true,
			itemId : 'clientAccountDtlView',
			items : [{
							xtype : 'label',
							text : getLabel('accountlist', 'Account List'),
							cls : 'font_bold ux_hide-image',
							padding : '5 0 0 3'
							
						},{
						xtype : 'container',
						itemId : 'actionBarContainer',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ' :',
									cls : 'action_label ux_font-size14',
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