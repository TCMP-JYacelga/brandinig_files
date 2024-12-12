Ext.define('CPON.view.CounterPartyAccMstGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','CPON.view.CounterPartyAccMstActionBarView','Ext.panel.Panel','Ext.menu.Menu',
	'Ext.container.Container','Ext.toolbar.Toolbar','Ext.button.Button','Ext.layout.container.HBox','Ext.form.RadioGroup',
	'Ext.form.field.Text','Ext.panel.Panel'],
	xtype : 'counterPartyAccMstGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('CPON.view.CounterPartyAccMstActionBarView', {
					itemId : 'accountActionBar',
					height : 21,
					width : '100%',
					margin : '1 0 0 0'
				});
		this.items = [{
				xtype : 'container',
				cls : 'ux_hide-image',
				layout : 'hbox',
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
			cls : 'xn-ribbon ux_border-bottom',
			autoHeight : true,
			bodyCls : 'x-portlet ux_no-padding',
			itemId : 'accountDtlView',
			collapsible : true,
			title :  getLabel('accountlist', 'Account List'),
			items : [
			{
							/*xtype : 'label',
							text : getLabel('accountlist', 'Account List'),
							cls : 'font_bold ux_font-size16',
							padding : '5 0 0 10'*/
							
						},{
						xtype : 'container',
						itemId:'groupActionContainer',
						hidden:true,
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'action_label ux_font-size14',
									padding : '5 0 0 10'
								},actionBar, {
									xtype : 'label',
									flex : 1
								}]

					}]
		}];
		this.callParent(arguments);
	}

});