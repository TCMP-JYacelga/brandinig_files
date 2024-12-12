Ext.define( 'GCP.view.FileUploadErrorPopUp',
{
	extend : 'Ext.window.Window',
	requires : [],
	xtype : 'fileUploadErrorPopUp',
	width : 700,
	height : 350,
	record : null,
	url:null,
	identifier:null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		var arrayData = me.loadErrorData(this.url,this.ahtskid);
		this.title = getLabel('fileUploadTitle', 'Error Report');
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				margin : '0 5 0 0',
				itemId : 'fileUploadErrorPopupDetailType',
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
								value : this.record.get("ahtskSrc"),
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
								value : this.record.get("ahtskStatus"),
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
								itemId : 'totalTransaction',
								fieldLabel : getLabel( 'totalTransaction', 'Total No of Txns' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("ahtskTotalInst"),
								readOnly : true
							},
							{
								xtype : 'textfield',
								itemId : 'totalControlAmount',
								fieldLabel : getLabel( 'totalControlAmount', 'Control Amount' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("ahtskTotalAmnt"),
								readOnly : true
							},
							{
								xtype : 'textfield',
								itemId : 'totalRejTransaction',
								fieldLabel : getLabel( 'totalRejTransaction', 'Total Rejected Transactions' ),
								labelWidth : 150,
								margin : '5 10 0 10',
								value : this.record.get("ahtskTotalInstRejected"),
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
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns :
				[
					{
						dataIndex : 'srNO',
						sortable : false,
						menuDisabled : true,
						width : 5,
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
		Ext.Ajax.request({
			url : errReportUrl,
			method : 'POST',
			jsonData : fileId,
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var count = data.d.fileUploadCenter.length ;
				var errorCode ;
				arrayData = new Ext.data.ArrayStore({
					fields : ['srNO', 'error']
				});
				for(var i= 0; i < count ;i++)
				{
					//data = data.d.fileUploadCenter[i];
					errorCode = data.d.fileUploadCenter[i].errorCode ;
					var errorData = [[1,errorCode]];
					arrayData.loadData(errorData);
				}
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
