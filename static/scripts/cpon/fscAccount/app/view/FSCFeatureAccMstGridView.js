Ext.define('CPON.view.FSCFeatureAccMstGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','CPON.view.FSCFeatureAccMstActionBarView','Ext.panel.Panel','Ext.menu.Menu',
	'Ext.container.Container','Ext.toolbar.Toolbar','Ext.button.Button','Ext.layout.container.HBox','Ext.form.RadioGroup',
	'Ext.form.field.Text','Ext.panel.Panel'],
	xtype : 'fscFeatureAccMstGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('CPON.view.FSCFeatureAccMstActionBarView', {
					itemId : 'accountActionBar',
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
							xtype : 'label',
							text : '',
							flex : 1
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
			cls : 'xn-ribbon ux_border-bottom ux_panel-transparent-background',
			bodyCls : 'x-portlet ux_no-padding',
			autoHeight : true,
			collapsible : true,
			title : getLabel('accountlist', 'Account List'),			
			itemId : 'clientAccountDtlView',
			items : [/*{
							xtype : 'label',
							text : getLabel('accountlist', 'Account List'),
							cls : 'font_bold',
							padding : '5 0 0 3'
							
						},*/{
						xtype : 'container',
						itemId:'groupActionContainer',
						hidden:true,
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'action_label',
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