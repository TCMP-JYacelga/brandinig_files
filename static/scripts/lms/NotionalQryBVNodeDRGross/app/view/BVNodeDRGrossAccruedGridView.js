Ext.define( 'GCP.view.BVNodeDRGrossAccruedGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'bVNodeDRGrossAccruedGridViewType',
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
	parent : this,
	autoScroll: true,
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
		
		var strUrl = 'getBVNodeDRGrossAccrued.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
		+ encodeURIComponent( document.getElementById( 'viewState' ).value) + "&$changeId=" + changeId+"&$viewName=GROUP" ;
		
		this.store = Ext.create( 'Ext.data.Store',
		{
			storeId : 'detailStore',
			autoLoad : viewName == 'INTEREST_ACCRUED',
			fields :
			[
				'NODE', 'COMPUTATION_DATE', 'BEFORE_GROSS_DR_POOL_BALANCE', 'BEFORE_DEBIT_INTEREST_RATE', 'BEFORE_DEBIT_INTEREST_AMNT', 
				'AFTER_GROSS_DR_POOL_BALANCE', 'AFTER_DEBIT_INTEREST_RATE','AFTER_DEBIT_INTEREST_AMNT', 'BEFORE_DEBIT_INTEREST_PROFILE',
				'AFTER_DEBIT_INTEREST_PROFILE','CHANGE_GROSS_DEBIT_INTEREST'
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
				align: 'left',
				width:120,
				//flex :1,
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
						text: getLabel( 'lblGrossDebitPoolBalance', 'Gross Debit Pool Balance' ),
                        dataIndex: 'BEFORE_GROSS_DR_POOL_BALANCE',
                        align: 'right',
                        width:200,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var poolBalance = record.get('BEFORE_GROSS_DR_POOL_BALANCE');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return poolBalance;
        				}
					},
					{
						text: getLabel( 'lblDebitInterestRate', 'Debit Interest Rate' ),
                        dataIndex: 'BEFORE_DEBIT_INTEREST_RATE',
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
                        			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'BEFORE_DEBIT_INTEREST_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
						text: getLabel( 'lblDebitInterestAmount', 'Debit Interest Amount' ),
                        dataIndex: 'BEFORE_DEBIT_INTEREST_AMNT',
                        align: 'right',
                        width:170,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var intAmount = record.get('BEFORE_DEBIT_INTEREST_AMNT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        						intAmount = '<font style="color:black;">'+intAmount+'</font>';
        					}
        					return intAmount;
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
						text: getLabel( 'lblGrossDebitPoolBalance', 'Gross Debit Pool Balance' ),
                        dataIndex: 'AFTER_GROSS_DR_POOL_BALANCE',
                        align: 'right',
                        width:200,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var poolBalance = record.get('AFTER_GROSS_DR_POOL_BALANCE');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return poolBalance;
        				}
					},
					{
						text: getLabel( 'lblDebitInterestRate', 'Debit Interest Rate' ),
                        dataIndex: 'AFTER_DEBIT_INTEREST_RATE',
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
                        			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'AFTER_DEBIT_INTEREST_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
						text: getLabel( 'lblDebitInterestAmount', 'Debit Interest Amount' ),
                        dataIndex: 'AFTER_DEBIT_INTEREST_AMNT',
                        align: 'right',
                        width:170,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var intAmount = record.get('AFTER_DEBIT_INTEREST_AMNT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        						metaData.width = 160;
        						intAmount = '<font style="color:black;">'+intAmount+'</font>';
        					}
        					return intAmount;
        				}
					}
				]
			},
			{
				
						text: getLabel( 'lblChangeInGrossDrInterest', 'Change in Gross Debit Interest' ),
                        dataIndex: 'CHANGE_GROSS_DEBIT_INTEREST',
                        align: 'right',
                        width:230,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var changeInterest = record.get('CHANGE_GROSS_DEBIT_INTEREST');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        						changeInterest = '<font style="color:black;">'+changeInterest+'</font>';
        					}
        					return changeInterest;
        				}
					
			}
			
		];
		this.callParent( arguments );
	}
} );
