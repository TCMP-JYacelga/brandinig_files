Ext.define('CPON.view.ViewFieldDetailsGrid', {
	extend : 'Ext.grid.Panel',
	requires:['Ext.grid.column.Action'],
	xtype : 'viewFieldDetailsGrid',
	selType : 'rowmodel',
	config : {bankReportCode : null},
	itemId : "viewFieldDetailsGrid",
	//padding : '10 0 0 0',
	autoHeight : true,
	minHeight : 40,//200,
	maxHeight : 375,
	scroll : 'vertical',
	//height : 200,
	width : '100%',
	cls : 'xn-grid-cell-inner',
	listeners : {
		cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e,
				eOpts) {
		var IconLinkClicked = (e.target.tagName == 'A');
           if(IconLinkClicked){
				var parent = this;
		        var className = e.target.className;
				if(className=='grid-row-delete-icon cursor_pointer'){
					if (!Ext.isEmpty(grid)) {
							var fieldGrid=grid;
							record = grid.getStore().getAt(rowIndex);
							var arrayJson = new Array();
							var records = {
    								fieldName : record.data.fieldId,
    								fieldDescription : record.data.description,
    								distributionMethod : 'F'
    							};
							var jsonData = {
    								identifier : parentkey,
    								userMessage : records
    							};

							Ext.Ajax.request({
										url : 'cpon/clientBankReport/discard',
										method : 'POST',
										jsonData : Ext.encode(jsonData),
										success : function(response) {
											// TODO : Action Result handling to be done here
											var errorMessage = '';
											if (!Ext.isEmpty(response.responseText)) {
												var data = Ext.decode(response.responseText);
												if (!Ext.isEmpty(data))
												{
													if(!Ext.isEmpty(data.parentIdentifier))
													{
														parentkey = data.parentIdentifier;
														document.getElementById('viewState').value = data.parentIdentifier;
													}
													if(!Ext.isEmpty(data.listActionResult))
													{
												        Ext.each(data.listActionResult[0].errors, function(error, index) {
													         errorMessage = errorMessage + error.errorMessage +"<br/>";
													        });
													}
												}
											}
											if(!Ext.isEmpty(errorMessage))
									        {
									        	Ext.MessageBox.show({
													title : "Error",
													msg : errorMessage,
													buttons : Ext.MessageBox.OK,
													cls : 'ux_popup',
													icon : Ext.MessageBox.ERROR
												});
									        }
											fieldGrid.getStore().reload();
											bankReportTempGrid.refreshData();
										},
										failure : function() {
											var errMsg = "";
											Ext.MessageBox.show({
														title : getLabel(
																'instrumentErrorPopUpTitle',
																'Error'),
														msg : getLabel(
																'instrumentErrorPopUpMsg',
																'Error while fetching data..!'),
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.ERROR
													});
										}
									});
							}
				   
				}else  if(className=='linkbox seeklink'){
					var record = grid.getStore().getAt(rowIndex);
					var tabPanel = parent.up('tabpanel');
					tabPanel.setActiveTab(1);
					tabPanel.getActiveTab().down('textfield[itemId=fieldName]')
					.setValue(record.data.fieldId);
					tabPanel.getActiveTab().down('textfield[itemId=fieldDescription]')
					.setValue(record.data.description);
					
					tabPanel.getActiveTab().down('textfield[itemId=fieldName]')
					.setReadOnly(true);
					tabPanel.getActiveTab().down('textfield[itemId=fieldDescription]')
					.setReadOnly(true);
					tabPanel.up('window').down('button[itemId="savebtn"]').hide(true);
					tabPanel.up('window').down('button[itemId="closebtn"]').addCls('company-id-xbtn-left-view');
					tabPanel.up('window').down('button[itemId="closebtn"]').addCls('ft-button-primary-paddingBsmall');
				}else if(className=='grid-row-action-icon icon-edit topAlign thePointer'){
					var record = grid.getStore().getAt(rowIndex);
					var tabPanel = parent.up('tabpanel');
					tabPanel.up('window').down('button[itemId=savebtn]')
					.setText('Update');
					tabPanel.setActiveTab(1);
					tabPanel.getActiveTab().down('textfield[itemId=fieldName]')
					.setValue(record.data.fieldId);
					tabPanel.getActiveTab().down('textfield[itemId=fieldDescription]')
					.setValue(record.data.description);
					tabPanel.getActiveTab().down('textfield[itemId=fieldName]')
					.setReadOnly(true);
					tabPanel.getActiveTab().down('textfield[itemId=fieldDescription]')
					.setReadOnly(false);
				}
			}
		}
	},
	initComponent : function() {
		var me = this; 
		var myStore = Ext.create('Ext.data.Store', {
			  fields:['description','fieldId','identifier'],
			     proxy: {
			         type: 'ajax',
					 url : 'cpon/clientServiceSetup/bankReportsFields.json?id='+ encodeURIComponent(parentkey),
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
			header : getLabel('actions', 'Actions'),
			width : 120,
			parent : this,
			align : 'center',
			sortable : false,
			renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
					          return '<a class="linkbox seeklink" title="View"></a>'
							  +' '+'<a class="grid-row-action-icon icon-edit topAlign thePointer" title="'+getLabel('edit', 'Edit')+'"></a>'
							  +' '+ '<a class="grid-row-delete-icon cursor_pointer" title="Delete" style="margin-left:20px;"></a>';
						  }
		}, {
			header : getLabel('fieldName', 'Field Name'),
			dataIndex : 'fieldId',
			width : 150
		}, {
			header : getLabel('fieldDescription', 'Field Description'),
			dataIndex : 'description',
			width : 200
		}];
		this.callParent(arguments);
	}
	
});