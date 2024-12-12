Ext.define('GCP.view.UploadSummaryFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'uploadSummaryFilterView',
	requires : [],
	width : '100%',
	margin : '0 0 10 0',
	componentCls : 'gradiant_back',
	collapsible : true,
	cls : 'xn-ribbon',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'panel',
			layout : 'hbox',
			items : [{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.8,
				layout :
				{
					type : 'vbox'
				},
				items :[{
						xtype  : 'panel',
						layout : 'hbox',
						itemId : 'modelTypeToolBar',
						items  : []
					},
					{
						xtype : 'panel',
						layout : 'hbox',
						padding : '6 0 0 5',
						items :
						[
							{
								xtype : 'toolbar',
								itemId : 'modelToolBar',
								cls : 'xn-toolbar-small',
								padding : '2 0 0 1',
								items :
								[
									{
										xtype : 'label',
										itemId : 'strModelValue',
										text : 'All'
									}
								]
							}
						]
					}
				]
			},{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.8,
				items : [{
					xtype  : 'panel',
					layout : 'hbox',
					itemId : 'dataStoreTypeToolBar',
					items  : []
				}, {
					xtype : 'panel',
					layout : 'hbox',
					padding : '6 0 0 5',
					items :
					[
						{
							xtype : 'toolbar',
							itemId : 'dataStoreToolBar',
							cls : 'xn-toolbar-small',
							padding : '2 0 0 1',
							items :
							[
								{
									xtype : 'label',
									itemId : 'strDataStoreValue',
									text : 'All'
								}
							]
						}
					]
				}]
			},{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.8,
				items : [{
					xtype  : 'panel',
					layout : 'hbox',
					itemId : 'categoryTypeToolBar',
					items  : []
				}, {
					xtype : 'panel',
					layout : 'hbox',
					padding : '6 0 0 5',
					items :
					[
						{
							xtype : 'toolbar',
							itemId : 'categoryToolBar',
							cls : 'xn-toolbar-small',
							padding : '2 0 0 1',
							items :
							[
								{
									xtype : 'label',
									itemId : 'strCategoryValue',
									text : 'All'
								}
							]
						}
					]
				}]
			}]
			
		}];
		this.callParent(arguments);
	},
	tools : [{
				xtype : 'button',
				itemId : 'btnSavePreferences',
				icon : 'static/images/icons/save.gif',
				disabled : true,
				text : getLabel('saveFilter', 'Save Preferences'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 110
			}]
	
});