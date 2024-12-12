Ext.define('GCP.view.ReportDefinitionGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.ReportDefinitionGroupActionBarView','Ext.panel.Panel'],
	xtype : 'reportDefinitionGridView',
	width : '100%',
	cls:'xn-ribbon',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.ReportDefinitionGroupActionBarView', {
					itemId : 'ReportGroupActionBarView_subcriptionDtl',
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
							cls : '',
							flex : 1,
							items : []
						}]
		}, {
			xtype : 'panel',
			width : '100%',
			collapsible : true,	
			title : getLabel('lblReportDefList', 'Report Definition List'),
			autoHeight : true,
			cls:'ux_extralargemargin-top xn-ribbon ux_panel-transparent-background',
		//	margin : '5 0 0 0',
			itemId : 'clientSetupDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_largepaddinglr ux_border-top ux_panel-transparent-background',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ' :',
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