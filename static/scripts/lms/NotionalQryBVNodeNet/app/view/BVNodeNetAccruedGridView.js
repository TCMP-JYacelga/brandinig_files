Ext.define( 'GCP.view.BVNodeNetAccruedGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'bVNodeNetAccruedGridViewType',
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
		
		var strUrl = 'getBVNodeNetAccrued.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
		+ encodeURIComponent( document.getElementById( 'viewState' ).value) + "&$changeId=" + changeId+"&$viewName=GROUP" ;
		
		this.store = Ext.create( 'Ext.data.Store',
		{
			storeId : 'detailStore',
			autoLoad : viewName == 'INTEREST_ACCRUED',
			fields :
			[
				'COMPUTATION_DATE', 'NODE', 'BEFORE_NET_POOL_BALANCE', 'BEFORE_INTEREST_RATE', 'BEFORE_INTEREST_AMOUNT', 'AFTER_NET_POOL_BALANCE',
				'AFTER_INTEREST_RATE','AFTER_INTEREST_AMOUNT','CHANGE_IN_INTEREST','BEFORE_INTEREST_PROFILE','AFTER_INTEREST_PROFILE'
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
						text: getLabel( 'lblBeforeNetPoolBalance', 'Net Pool Balance' ),
                        dataIndex: 'BEFORE_NET_POOL_BALANCE',
                        align: 'right',
                        width:165,
                        sortable:false,
        				renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var poolBalance = record.get('BEFORE_NET_POOL_BALANCE');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return poolBalance;
        				}
					},
					{
						text: getLabel( 'lblBeforeInterestRate', 'Interest Rate' ),
                        dataIndex: 'BEFORE_INTEREST_RATE',
                        align: 'right',
                        width:150,
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
                        			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'BEFORE_INTEREST_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
						text: getLabel( 'lblAmount', 'Interest Amount' ),
                        dataIndex: 'BEFORE_INTEREST_AMOUNT',
                        align: 'right',
                        width:165,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var intAmount = record.get('BEFORE_INTEREST_AMOUNT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						intAmount = '<font style="color:black;">'+intAmount+'</font>';
        						metaData.style = "background-color:#f0f4dd;";
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
						text: getLabel( 'lblBeforeNetPoolBalance', 'Net Pool Balance' ),
                        dataIndex: 'AFTER_NET_POOL_BALANCE',
                        align: 'right',
                        width:165,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var poolBalance = record.get('AFTER_NET_POOL_BALANCE');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return poolBalance;
        				}
					},
					{
						text: getLabel( 'lblBeforeInterestRate', 'Interest Rate' ),
                        dataIndex: 'AFTER_INTEREST_RATE',
                        align: 'right',
                        width:150,
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
                        			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'AFTER_INTEREST_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
						text: getLabel( 'lblPairedNode', 'Interest Amount' ),
                        dataIndex: 'AFTER_INTEREST_AMOUNT',
                        align: 'right',
                        width:165,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var intAmount = record.get('AFTER_INTEREST_AMOUNT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						intAmount = '<font style="color:black;">'+intAmount+'</font>';
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return intAmount;
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
						text: getLabel( 'lblChangeInInterest', 'Change In Interest' ),
                        dataIndex: 'CHANGE_IN_INTEREST',
                        align: 'right',
                        width:210,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var changeInInterest = record.get('CHANGE_IN_INTEREST');
        					if(nodeDate == null || nodeDate == '')
        					{
        						changeInInterest = '<font style="color:black;">'+changeInInterest+'</font>';
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return changeInInterest;
        				}
					}
				]
			}
			
		];
		this.callParent( arguments );
	}
} );
