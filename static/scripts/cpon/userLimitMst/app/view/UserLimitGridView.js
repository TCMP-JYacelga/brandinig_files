Ext.define('GCP.view.UserLimitGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.UserLimitActionBarView','Ext.panel.Panel'],
	xtype : 'userLimitGridView',
	width : '100%',
	cls:'xn-ribbon',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.UserLimitActionBarView', {
					itemId : 'clientGroupActionBarView_clientDtl',
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
						/*
						xtype : 'button',
						itemId : 'addNewProfileId',
						name : 'alert',
						text : '<span>'
								+ getLabel('limitProfile', 'Limit Profile')
								+ '</span>',
						cls : 'ux_button-background-color ux_button-padding ux_loan-center-button',
						glyph : 'xf055@fontawesome',
						handler : function() {
							me.parent.fireEvent('addAlertEvent', this);
						}*/
						xtype : 'toolbar',
						itemId : 'btnCreateNewToolBar',
						cls : ' ux_panel-background ux_extralargepadding-bottom',
						flex : 1,
						items : []
					}, {
						xtype : 'container',
						layout : 'hbox',
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
										padding : '4 0 0 3',
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
					}]
		}, {
			xtype : 'panel',
			width : '100%',
			collapsible : true,
			title : getLabel('limitProfile', 'Limit Profile'),
			cls : 'x-portlet ux_no-padding',
			autoHeight : true,
			bodyCls : 'x-portlet ux_no-padding',
			itemId : 'prfMstDtlView',
			items : [{
				xtype : 'panel',
				width : '100%',
				autoHeight : true,
				margin : '5 0 0 0',
				itemId : 'userLimitSetupDtlView',
				items : [{
							xtype : 'container',
							layout : 'hbox',
							cls: 'ux_largepaddinglr ux_border-top ux_panel-transparent-background',
							items : [{
										xtype : 'label',
										text : getLabel('actions', 'Actions') + ':',
										cls : 'font_bold ux-ActionLabel',
										padding : '4 0 0 3'
									}, actionBar, {
										xtype : 'label',
										text : '',
										flex : 1
									}]
	
						}]
			}]
		}];
		this.callParent(arguments);
	}
	

});