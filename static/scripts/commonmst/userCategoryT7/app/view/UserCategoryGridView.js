Ext.define('GCP.view.UserCategoryGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['GCP.view.UserCategoryGroupActionBarView', 'Ext.ux.gcp.SmartGrid'],
	xtype : 'userCategoryGridView',
	//bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '100%',
	parent : null,

	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.UserCategoryGroupActionBarView', {
					itemId : 'userCategoryGroupActionBarView',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
					xtype : 'panel',
					width : '100%',
					collapsible : true,
					cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
					title : getLabel("categorylist", "Role List"),
					itemId : 'userCategoryGridDtlView',
					items : [{
								xtype : 'container',
								itemId : 'actionToolBar',
								cls: 'ux_largepaddinglr ux_border-top',
								componentCls: 'x-portlet ux_no-margin ux_no-padding',
								layout : 'hbox',
								items : [{
											xtype : 'label',
											text : getLabel('actions', 'Action')
													+ ':',
											cls : 'font_bold ux-ActionLabel',
											padding : '5 0 0 3'
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