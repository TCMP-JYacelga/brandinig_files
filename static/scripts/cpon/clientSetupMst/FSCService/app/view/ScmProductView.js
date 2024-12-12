Ext.define('CPON.view.ScmProductView', {
	extend : 'Ext.container.Container',
	xtype : 'scmProductView',
	requires : ['Ext.ux.gcp.SmartGrid','CPON.view.ScmProductActionBarView','Ext.panel.Panel'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('CPON.view.ScmProductActionBarView', {
					itemId : 'scmPrdActionBar',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		me.items = [{
			xtype : 'container',
			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'toolbar',
						itemId : 'btnCreateNewToolBar',
						cls : '',
						flex : 1,
						items : [{
							xtype : 'button',
							border : 0,
							text : '<span class="button_underline">'
									+ getLabel('attachScmProduct', 'Attach SCF Package') + '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '5 0 0 0',
							itemId : 'btnAccountGrid',
							handler : function(){
								//var rulepopup= Ext.create('CPON.view.AddEditViewRulePopup');
								//rulepopup.show();
							}
						}, actionBar, {
							xtype : 'label',
							text : '',
							flex : 1
						}]
						 
					}, {
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating ux_hide-image',
						items : [{
							xtype : 'button',
							border : 0,
							itemId : 'btnSearchOnPage',
							text : getLabel('btnSearchOnPage',
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
		cls : 'xn-panel',
		autoHeight : true,
		margin : '5 0 0 0',
		itemId : 'clientAccountDtlView',
		items : [{
						xtype : 'container',
						layout : 'hbox',
						itemId : 'gridHeader',
						items : []
					},{
					xtype : 'container',
					itemId : 'actionBarContainer',
					layout : 'hbox',
					items : [{
								xtype : 'label',
								text : getLabel('actions', 'Actions') + ':',
								cls : 'font_bold ux_font-size14',
								padding : '5 0 0 10'
							},
							actionBar, 
							{
								xtype : 'label',
								text : '',
								flex : 1
							}]

				}]
	}];
		me.callParent(arguments);
	}

});