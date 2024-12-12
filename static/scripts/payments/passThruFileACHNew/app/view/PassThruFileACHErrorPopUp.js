Ext.define( 'GCP.view.PassThruFileACHErrorPopUp',
{
	extend : 'Ext.window.Window',
	requires : [],
	xtype : 'passThruFileACHErrorPopUpType',
	width : 700,
	height : 450,
	record : null,
	url:null,
	identifier:null,
	fileId:null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		var arrayData = me.loadErrorData(this.url,this.fileId);
		this.title = getLabel('passThruTitle', 'Error Report');
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				margin : '0 5 0 0',
				itemId : 'passThruFileACHErrorPopupDetailType',
				layout : 'hbox',
				items :
				[
					{
						xtype : 'container',
						layout : 'vbox',
						items :
						[
							{
								xtype : 'textfield',
								itemId : 'fileNameTxt',
								fieldLabel : getLabel( 'fileName', 'File Name' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("fileName"),
								readOnly : true
							},
							{
								xtype : 'textfield',
								itemId : 'uploadDateTxt',
								fieldLabel : getLabel( 'uploadDate', 'Import Date' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("uploadDate"),
								readOnly : true
							},
							{
								xtype : 'textfield',
								itemId : 'statusTxt',
								fieldLabel : getLabel( 'status', 'Status' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("status"),
								readOnly : true
							},
							{
								xtype : 'textfield',
								itemId : 'totalBatchTxt',
								fieldLabel : getLabel( 'totalBatch', 'Total Batches' ),
								labelWidth : 150,
								value : this.record.get("batchCount"),
								margin : '5 10 0 10',
								readOnly : true
							}
						]
					},
					{
						xtype : 'container',
						layout : 'vbox',
						items :
						[
							{
								xtype : 'textfield',
								itemId : 'totalCrTransaction',
								fieldLabel : getLabel( 'totalCrTransaction', 'Total Credit Transactions' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("totalCrCount"),
								readOnly : true
							},
							{
								xtype : 'textfield',
								itemId : 'totalCrAmount',
								fieldLabel : getLabel( 'totalCrAmount', 'Total Credit Amount' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("totalCrAmt"),
								readOnly : true
							},
							{
								xtype : 'textfield',
								itemId : 'totalDrTransaction',
								fieldLabel : getLabel( 'totalDrTransaction', 'Total Debit Transactions' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("totalDrCount"),
								readOnly : true
							},
							{
								xtype : 'textfield',
								itemId : 'totalDrAmount',
								fieldLabel : getLabel( 'totalDrAmount', 'Total Debit Amount' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("totalDrAmt"),
								readOnly : true
							}
						]
					}
				]
			},
			{
				xtype : 'grid',
				margin : '15 0 0 0',
				autoScroll : true,
				maxHeight : 200,
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns :
				[
					{
						dataIndex : 'srNO',
						sortable : false,
						menuDisabled : true,
						width : 8,
						text : getLabel( 'srNO', 'Sr No' )
					},
					{
						dataIndex : 'error',
						sortable : false,
						menuDisabled : true,
						width : 90,
						text : getLabel( 'description', 'Description' )
					}
				]
			}
		];
		this.buttons =
		[
			{
				text : getLabel( 'btnOk', 'Ok' ),
				cls : 'ux_button-padding ux_button-background-color',
				handler : function()
				{
					me.close();
				}
			}
		];
		this.callParent( arguments );
	},
	loadErrorData : function(errReportUrl,fileId) {
		var me = this;
		var errorData = new Array();
		var arrayData = new Array();
		var errorMsgData = new Array();
		var passthruData = null;
		Ext.Ajax.request({
			url : errReportUrl,
			method : 'POST',
			jsonData : fileId,
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var count = data.d.passThruFileACH.length ;
				var errorCode ;
				arrayData = new Ext.data.ArrayStore({
					fields : ['srNO', 'error']
				});
				for(var i= 0; i < count ;i++)
				{
					passthruData = data.d.passThruFileACH[i];
					errorCode = passthruData.errorCode ;
					//var errorData = [[i+1,errorCode]];
					//errorMsgData.push([i+1,errorCode]);
					errorMsgData.push({srNO:i+1, error:errorCode});
				}
				arrayData.loadData(errorMsgData);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('HistoryPopUpTitle', 'Error'),
							msg : getLabel('HistoryErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}

} );
