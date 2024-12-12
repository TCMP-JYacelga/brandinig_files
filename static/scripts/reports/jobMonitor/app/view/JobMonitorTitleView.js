/**
 * @class GCP.view.summary.JobMonitorTitleView
 * @extends Ext.panel.Panel
 * @author Naresh Mahajan
 */
Ext.define('GCP.view.JobMonitorTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'jobMonitorTitleView',
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
					itemId : 'pageTitleNavigation',
					cls : 'page-heading thePointer page-heading-inactive',
					padding : '0 0 0 10',
					listeners : {
						'render' : function(lbl) {
								lbl.getEl().on('click', function() {
											submitForm('scheduleMonitorCenter.srvc');
									});
								}
							}
		
				},
				{
					xtype : 'label',
					text : ' | ',
					cls : 'page-heading ',
					margin : '0 10 0 10'
				},
				{
					xtype : 'label',
					text : getLabel('reportsInterfaceJobMonitor', 'Job Monitoring'),
					itemId : 'pageTitle',
					cls : 'page-heading',
					padding : '0 0 0 10'
				}]
		me.callParent(arguments);		
	}

});