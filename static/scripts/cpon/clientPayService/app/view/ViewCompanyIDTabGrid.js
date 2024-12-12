Ext.define('GCP.view.ViewCompanyIDTabGrid', {
	extend : 'Ext.grid.Panel',
	requires:['Ext.grid.column.Action'],
	xtype : 'viewCompanyIDTabGrid',
	selType : 'rowmodel',
	itemId : "viewCompanyIDTabGrid",
	padding : '10 0 0 0',
	maxHeight : 300,
	width : '100%',
	overflowY : 'auto',
	cls : 'xn-grid-cell-inner',
	initComponent : function() {
		var me = this; 
		var myStore = Ext.create('Ext.data.Store', {
			  fields:['companyName','companyId','defaultAccNumber'],
			     proxy: {
			         type: 'ajax',
					 url : 'cpon/clientServiceSetup/companyList.json?id='+encodeURIComponent(parentkey),
			        // extraParams : {id : parentkey},
					 reader: {
			             type: 'json',
						 root: 'd.accounts'
			         },
					 actionMethods:  {
						create: "POST", 
						read: "POST", 
						update: "POST", 
						destroy: "POST"
					} 
			     },
				 autoLoad: true
			 });
		me.store=myStore;
		this.columns = [{
				xtype : 'actioncolumn',
				header : getLabel('action', 'Action'),
				width : 80,
				itemId : 'editactioncolumn',
				parent : this,
				align : 'center',
				sortable : false,
				items : [{
							iconCls : 'linkbox seeklink',
							tooltip : getLabel('view', 'View'),
							handler : function(grid, rowIndex, colIndex) {
								var record = grid.getStore().getAt(rowIndex);
								var tabPanel = this.parent.up('tabpanel');
								//tabPanel.up('window').down('button[itemId=savebtn]').hide();
								tabPanel.setActiveTab(1);
								tabPanel.getActiveTab().down('textfield[itemId=companyIdField]')
								.setValue(record.data.companyId);
								tabPanel.getActiveTab().down('textfield[itemId=companyNameField]')
								.setValue(record.data.companyName);
								tabPanel.getActiveTab().down('combo[itemId=defaultAccountCombo]')
								.setValue(record.data.defaultAccNumber);
								tabPanel.getActiveTab().down('textfield[itemId=companyIdField]').setReadOnly(true);
								tabPanel.getActiveTab().down('textfield[itemId=companyNameField]').setReadOnly(true);
								tabPanel.getActiveTab().down('combo[itemId=defaultAccountCombo]').setReadOnly(true);
								//tabPanel.suspendEvent('tabchange');
								tabPanel.up('window').down('button[itemId="savebtn"]').setDisabled(true);
								//tabPanel.resumeEvent('tabchange');
							}
						},{
							iconCls : 'grid-row-action-icon icon-edit',
							tooltip : getLabel('edit', 'Edit'),
							handler : function(grid, rowIndex, colIndex) {
								var record = grid.getStore().getAt(rowIndex);
								var tabPanel = this.parent.up('tabpanel');
								tabPanel.up('window').down('button[itemId=savebtn]').setText('Update');
								tabPanel.setActiveTab(1);
								tabPanel.getActiveTab().down('textfield[itemId=companyIdField]')
								.setValue(record.data.companyId);
								tabPanel.getActiveTab().down('textfield[itemId=companyNameField]')
								.setValue(record.data.companyName);
								tabPanel.getActiveTab().down('textfield[itemId=companyIdField]').setReadOnly(true);
								tabPanel.getActiveTab().down('textfield[itemId=companyNameField]').setReadOnly(false);
								tabPanel.getActiveTab().down('combo[itemId=defaultAccountCombo]').setReadOnly(false);
							}
						}]

		}, {
			header : getLabel('companyid', 'Company ID'),
			dataIndex : 'companyId',
			width : 320
		}];
		this.callParent(arguments);
	}
	
});