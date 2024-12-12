Ext.define('CPON.view.ViewCompanyIDTabGrid', {
	extend : 'Ext.grid.Panel',
	requires:['Ext.grid.column.Action'],
	xtype : 'viewCompanyIDTabGrid',
	selType : 'rowmodel',
	itemId : "viewCompanyIDTabGrid",
	padding : '10 0 0 0',
	maxHeight : 360,
	minHeight : 50,
	width : '100%',
	//overflowY : 'auto',
	cls : 'xn-grid-cell-inner',
	listeners: {
		cellclick: function(grid, td, cellIndex, record,tr, rowIndex, e, eOpts) {
					var IconLinkClicked = (e.target.tagName == 'A');	
					if(IconLinkClicked){
						var parent = this;
						var className = e.target.className;
						if(className=='grid-row-action-icon icon-edit topAlign thePointer'){
							var record = grid.getStore().getAt(rowIndex);
							var tabPanel = parent.up('tabpanel');
							tabPanel.up('window').down('button[itemId=savebtn]')
							.setText('Update');
							tabPanel.setActiveTab(2);
							tabPanel.getActiveTab().down('textfield[itemId=companyIdField]')
							.setValue(record.data.companyId);
							tabPanel.getActiveTab().down('textfield[itemId=companyNameField]')
							.setValue(record.data.companyName);
							tabPanel.getActiveTab().down('textfield[itemId=companyIdField]')
							.setReadOnly(true);
							tabPanel.getActiveTab().down('textfield[itemId=companyNameField]')
							.setReadOnly(false);							
							tabPanel.recordKey = record.data.recordKeyNo;
						}else if(className=='linkbox seeklink'){
							var record = grid.getStore().getAt(rowIndex);
							var tabPanel = parent.up('tabpanel');
							tabPanel.setActiveTab(2);
							tabPanel.getActiveTab().down('textfield[itemId=companyIdField]')
							.setValue(record.data.companyId);
							tabPanel.getActiveTab().down('textfield[itemId=companyNameField]')
							.setValue(record.data.companyName);
							
							tabPanel.getActiveTab().down('textfield[itemId=companyIdField]')
							.setReadOnly(true);
							tabPanel.getActiveTab().down('textfield[itemId=companyNameField]')
							.setReadOnly(true);
							tabPanel.up('window').down('button[itemId="savebtn"]').hide(true);
							tabPanel.up('window').down('button[itemId="closebtn"]').addCls('company-id-xbtn-left-view');
							tabPanel.up('window').down('button[itemId="closebtn"]').addCls('ft-button-primary-paddingBsmall');
							tabPanel.recordKey = record.data.recordKeyNo;
						}else if(className=='grid-row-action-icon icon_discard topAlign thePointer'){
							this.fireEvent('deleteCompanyId',grid,rowIndex);
						}else{ }
					}
				}
	},
		
	initComponent : function() {
		var me = this; 
		var iconEditViewStr = null;
		var arrActionColumnItems = new Array();
		var myStore = Ext.create('Ext.data.Store', {
			  fields:['companyName','companyId','defaultAccNumber','recordKeyNo'],
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
		if ((viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")) 
		{
			iconEditViewStr = '<a class="linkbox seeklink" href="#" title="view"></a>';
		}
		else
		{
			iconEditViewStr = '<a class="linkbox seeklink" title="View"></a>'
			+' '+'<a class="grid-row-action-icon icon-edit topAlign thePointer" title="'+getLabel('edit', 'Edit')+'"></a>'
			+' '+'<a class="grid-row-action-icon icon_discard topAlign thePointer" title="'+getLabel('delete', 'Delete')+'"></a>';
		}
		
		this.columns = [{
				xtype : 'actioncolumn',
				colId : 'action',
				colType : 'actioncontent',
				header : getLabel('action', 'Action'),
				width : 110,
				itemId : 'editactioncolumn',
				parent : this,
				align : 'center',
				sortable : false,
				renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
								return iconEditViewStr;
							}

		}, {
			header : getLabel('companyid', 'Company ID'),
			dataIndex : 'companyId',
			width : 180
		},
		{
			header : getLabel('companyName', 'Company Name'),
			dataIndex : 'companyName',
			width : 180
		}
		];
		this.callParent(arguments);
	}	
});