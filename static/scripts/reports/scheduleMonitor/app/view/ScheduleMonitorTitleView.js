/**
 * @class GCP.view.summary.ScheduleMonitorTitleView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 */
Ext.define('GCP.view.ScheduleMonitorTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'scheduleMonitorTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button',
			'Ext.toolbar.Toolbar'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'label',
					text : getLabel('reportsInterfaceScheduleMonitor', 'Schedules'),
					itemId : 'pageTitle',
					cls : 'page-heading',
					padding : '0 0 0 10'
				},
				{
					xtype : 'label',
					text : ' | ',
					cls : 'page-heading ',
					margin : '0 10 0 10'
				},
				{
					xtype : 'label',
					text : getLabel('jobmonitortitle', 'Job Monitoring'),
					itemId : 'pageTitleNavigation',
					cls : 'page-heading thePointer page-heading-inactive',
					padding : '0 0 0 10',
					listeners : {
						'render' : function(lbl) {
								lbl.getEl().on('click', function() {
											submitForm('jobMonitoringCenter.srvc');
									});
								}
							}
				}]
		me.callParent(arguments);		
	}

});