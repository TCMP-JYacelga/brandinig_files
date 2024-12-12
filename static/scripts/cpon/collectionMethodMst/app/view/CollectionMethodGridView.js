Ext.define('GCP.view.CollectionMethodGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.CollectionMethodActionBarView','Ext.panel.Panel'],
	xtype : 'collectionMethodGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.CollectionMethodActionBarView', {
					itemId : 'clientGroupActionBarView_clientDtl',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
			xtype : 'container',
			cls : 'ux_extralargepaddingtb ux_panel-background',
			layout : 'hbox',
			width : '100%',
			items : [ {
						xtype : 'button',
						itemId : 'addNewProfileId',
						name : 'alert',
						text : '<span>'
							+ getLabel('collectionmethod', 'Receivable Method')
							+ '</span>',
						cls : 'ux_button-background-color ux_button-padding ux_loan-center-button',
						glyph : 'xf055@fontawesome',
						hidden:!ACCESSNEW,
						handler : function() {
							me.parent.fireEvent('addAlertEvent', this);
						}
					}, {
						xtype : 'container',
						cls : 'ux_hide-image',
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
			collapsible : true,
			width : '100%',
			cls : 'xn-ribbon ux_border-bottom gradiant_back',
			bodyCls : 'x-portlet ux_no-padding',
			title : getLabel('collectionmethod', 'Receivable Method'),
			itemId : 'prfMstDtlView',
			items : [{
				xtype : 'container',
				itemId : 'collectionMethodButContainer',
				layout : 'hbox',
				items : [{
					xtype : 'panel',
					width : '100%',
					layout : 'hbox',
					items : [{
						xtype : 'button',
						margin : '5 0 0 3',
						itemId : 'btnPkgList',
						text : getLabel('showAllMethodNames', 'Show All Receivable Methods Names'),
						cls : 'xn-account-filter-btnmenu font_bold',
						handler : function() {
							me.parent.fireEvent('changePkgProductList', this,
									'showpackage')
						}
					},{
						xtype : 'button',
						margin : '5 0 0 3',
						itemId : 'btnProductList',
						text :  getLabel('showAllProduct', 'Show All Product'),
						cls : 'xn-account-filter-btnmenu font_bold',
						handler : function() {
							me.parent.fireEvent('changePkgProductList', this,
									'showproduct')
						}
					}]
				}]

			}, {
			xtype : 'panel',
			width : '100%',
			autoHeight : true,
			margin : '5 0 0 0',
			itemId : 'clientSetupDtlView',
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
		}]
		}];
		this.callParent(arguments);
	}
	

});