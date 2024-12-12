Ext.define( 'GCP.view.BVNodeDRGrossApportionmentGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'bVNodeDRGrossApportionmentGridViewType',
	cls: 'ft-grid',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.window.MessageBox'
	],
	//modal : true,
	//height : 'auto',
	overflow : 'auto',
	closeAction : 'hide',
	//width : '100%',
	//layout : 'fit',
	//padding : 16,
	autoScroll: true,
	parent : this,
	plugins :
		[
			
		],
	selModel :
	{
		selType : 'cellmodel'
	},
	initComponent : function()
	{
		var me = this;
		
		var strUrl = 'getBVNodeDRGrossApportionment.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
		+ encodeURIComponent( document.getElementById( 'viewState' ).value) + "&$changeId=" + changeId ;
		
		this.store = Ext.create( 'Ext.data.Store',
		{
			storeId : 'detailStore',
			autoLoad : viewName == 'APPORTIONMENT',
			fields :
			[
				'NODE', 'COMPUTATION_DATE', 'BEFORE_GROSS_DEBIT_BAL', 'BEFORE_PAIRED_NODE', 'BEFORE_DEBIT_APPORT_RATE', 
				'BEFORE_DEBIT_APPORT_AMNT', 'AFTER_GROSS_DEBIT_BAL','AFTER_PAIRED_NODE','AFTER_DEBIT_APPORT_RATE',
				'AFTER_DEBIT_APPORT_AMNT','CHANGE_IN_DEBIT_APPORT',
				'BEFORE_DEBIT_APPORTION_PROFILE','AFTER_DEBIT_APPORTION_PROFILE'
				
			],
			remoteSort : false,
			proxy :
			{
				type : "ajax",
				method : 'POST',
				url : strUrl,
				reader :
				{
					type : 'json',
					root : 'd.commonDataTable',
					totalProperty : "count"
				}
			},
			filterOnLoad : true,
			listeners : {
				load : function() {
					var noOfRecords = (this.getCount() >= 4) ? 4 :this.getCount();
					me.setHeight(51*noOfRecords+85);
					me.doLayout();
				}
			}
		} );

		this.columns =
		[
			{
				text: getLabel( 'lblDate', 'Date' ),
				dataIndex: 'COMPUTATION_DATE',
				//flex: 1,
				align: 'left',
				width:120,
				height:50,
				sortable:false,
				renderer : function( value, metaData, record, rowIndex )
				{
					var nodeDate = record.get('COMPUTATION_DATE');
					if(nodeDate == null || nodeDate == '')
					{
						metaData.style = "background-color:#f0f4dd;";
					}
					return nodeDate;
				}
			},
			{
				text: getLabel( 'lblNode', 'Node' ),
				dataIndex: 'NODE',
				//flex: 1,
				align: 'left',
				width:140,
				height:50,
				sortable:false,
				renderer : function( value, metaData, record, rowIndex )
				{
					var nodeDate = record.get('COMPUTATION_DATE');
					var nodeName = record.get('NODE');
					if(nodeDate == null || nodeDate == '')
					{
						nodeName = '<font style="color:black;">'+nodeName+'</font>';
						metaData.style = "background-color:#f0f4dd;";
					}
					return nodeName;
				}
			},
			{
				text : getLabel('beforelbl', 'Before'),
				height:80,
				columns: 
				[
					{
						text: getLabel( 'lblGrossDebitBalance', 'Gross Debit Balance' ),
                        dataIndex: 'BEFORE_GROSS_DEBIT_BAL',
                        align: 'right',
                        width:165,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var debitBalance = record.get('BEFORE_GROSS_DEBIT_BAL');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return debitBalance;
        				}
					},
					{
						text: getLabel( 'lblPairNode', 'Paired Node' ),
                        dataIndex: 'BEFORE_PAIRED_NODE',
                        align: 'right',
                        width:130,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var pairedNode = record.get('BEFORE_PAIRED_NODE');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return pairedNode;
        				}
					},
					{
						text: getLabel( 'lblDebitApportionmentRate', 'Debit Apportion Rate' ),
                        dataIndex: 'BEFORE_DEBIT_APPORT_RATE',
                        align: 'right',
                        width:165,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
                        	var strRetValue = value;
                        	var nodeDate = record.get('COMPUTATION_DATE');
                        	if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
                        	if( !Ext.isEmpty(value) && value != 'null')
                        	{
                        		if ('0' == entityType)
                        		{
                        			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'BEFORE_DEBIT_APPORTION_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
                        		}
                        	}
                        	else
                        	{
                        		strRetValue = '';
                        	}
    					    return strRetValue;
        				}
					},
					{
						text: getLabel( 'lblDebitApportionmentAmt', 'Debit Apportion Amount' ),
                        dataIndex: 'BEFORE_DEBIT_APPORT_AMNT',
                        align: 'right',
                        width:185,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var apportAmnt = record.get('BEFORE_DEBIT_APPORT_AMNT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        						apportAmnt = '<font style="color:black;">'+apportAmnt+'</font>';
        					}
        					return apportAmnt;
        				}
					}
				]
			},
			{
				text : getLabel('afterlbl', 'After'),
				height:80,
				columns: 
				[
					{
						text: getLabel( 'lblGrossDebitBalance', 'Gross Debit Balance' ),
                        dataIndex: 'AFTER_GROSS_DEBIT_BAL',
                        align: 'right',
                        width:165,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var debitBalance = record.get('AFTER_GROSS_DEBIT_BAL');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return debitBalance;
        				}
					},
					{
						text: getLabel( 'lblPairNode', 'Paired Node' ),
                        dataIndex: 'AFTER_PAIRED_NODE',
                        align: 'right',
                        width:130,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var pairedNode = record.get('AFTER_PAIRED_NODE');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return pairedNode;
        				}
					},
					{
						text: getLabel( 'lblDebitApportionmentRate', 'Debit Apportion Rate' ),
                        dataIndex: 'AFTER_DEBIT_APPORT_RATE',
                        align: 'right',
                        width:165,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
                        	var strRetValue = value;
                        	var nodeDate = record.get('COMPUTATION_DATE');
                        	if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
                        	if( !Ext.isEmpty(value) && value != 'null')
                        	{
                        		if ('0' == entityType)
                        		{
                        			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'AFTER_DEBIT_APPORTION_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
                        		}
                        	}
                        	else
                        	{
                        		strRetValue = '';
                        	}
    					    return strRetValue;
        				}
					},
					{
						text: getLabel( 'lblDebitApportionmentAmt', 'Debit Apportion Amount' ),
                        dataIndex: 'AFTER_DEBIT_APPORT_AMNT',
                        align: 'right',
                        width:185,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var apportAmnt = record.get('AFTER_DEBIT_APPORT_AMNT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        						apportAmnt = '<font style="color:black;">'+apportAmnt+'</font>';
        					}
        					return apportAmnt;
        				}
					}
				]
			},
			{
				text : getLabel('changelbl', 'Change'),
				height:80,
				columns: 
				[
					{
						text: getLabel( 'lblChangeInDebitApportionment', 'Change in Debit Apportionment' ),
                        dataIndex: 'CHANGE_IN_DEBIT_APPORT',
                        align: 'right',
                        width:240,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var changeApport = record.get('CHANGE_IN_DEBIT_APPORT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        						changeApport = '<font style="color:black;">'+changeApport+'</font>';
        					}
        					return changeApport;
        				}
					}
				]
			}
			
		];
		this.callParent( arguments );
	}
} );
