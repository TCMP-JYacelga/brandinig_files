Ext.define( 'GCP.view.BVNodeNetApportionmentGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'bVNodeNetApportionmentGridViewType',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.window.MessageBox'
	],
	//modal : true,
	
	//height : 'auto',
	//overflowX : 'auto',
	closeAction : 'hide',
	//width : '100%',
	//layout : 'fit',
	//padding : 16,
	minHeight : 100,
	//auroHeight : true,
	maxHeight : 380,
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
		var strUrl = 'getBVNodeNetApportionment.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
		+ encodeURIComponent( document.getElementById( 'viewState' ).value) + "&$changeId=" + changeId ;
			
		
	this.store = Ext.create( 'Ext.data.Store',
		{
			storeId : 'detailStore',
			autoLoad : true,
			fields :
			[
				'COMPUTATION_DATE', 'NODE', 'BEFORE_NET_POOL_BAL', 'BEFORE_PAIRED_NODE', 'BEFORE_NET_APPORT_RATE', 'BEFORE_NET_APPORT_AMOUNT',
				'AFTER_NET_POOL_BALANCE', 'AFTER_PAIRED_NODE', 'AFTER_NET_APPORT_RATE', 'AFTER_NET_APPORT_AMOUNT','BEFORE_INTEREST_PROFILE','AFTER_INTEREST_PROFILE',
				'CHANGE_IN_APPORT'
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
						text: getLabel( 'lblBeforeNetBalance', 'Net Balance' ),
                        dataIndex: 'BEFORE_NET_POOL_BAL',
                        align: 'right',
                        width:140,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var poolBalance = record.get('BEFORE_NET_POOL_BAL');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return poolBalance;
        				}
					},
					{
						text: getLabel( 'lblPairNode', 'Paired Node' ),
                        dataIndex: 'BEFORE_PAIRED_NODE',
                        align: 'left',
                        width:120,
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
						text: getLabel( 'lblNetApportRate', 'Net Apportion Rate' ),
                        dataIndex: 'BEFORE_NET_APPORT_RATE',
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
						text: getLabel( 'lblNetApportAmnt', 'Net Apportion Amount' ),
                        dataIndex: 'BEFORE_NET_APPORT_AMOUNT',
                        align: 'right',
                        width:190,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var apportAmount = record.get('BEFORE_NET_APPORT_AMOUNT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        						apportAmount = '<font style="color:black;">'+apportAmount+'</font>';
        					}
        					return apportAmount;
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
						text: getLabel( 'lblBeforeNetBalance', 'Net Balance' ),
                        dataIndex: 'AFTER_NET_POOL_BALANCE',
                        align: 'right',
                        width:140,
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
						text: getLabel( 'lblPairNode', 'Paired Node' ),
                        dataIndex: 'AFTER_PAIRED_NODE',
                        align: 'left',
                        width:120,
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
						text:  getLabel( 'lblNetApportRate', 'Net Apportion Rate' ),
                        dataIndex: 'AFTER_NET_APPORT_RATE',
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
						text: getLabel( 'lblNetApportAmnt', 'Net Apportion Amount' ),
                        dataIndex: 'AFTER_NET_APPORT_AMOUNT',
                        align: 'right',
                        width:190,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var apportAmount = record.get('AFTER_NET_APPORT_AMOUNT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        						apportAmount = '<font style="color:black;">'+apportAmount+'</font>';
        					}
        					return apportAmount;
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
						text: getLabel( 'lblChangeInApportionment', 'Change In Apportionment' ),
                        dataIndex: 'CHANGE_IN_APPORT',
                        align: 'right',
                        width:210,
                        sortable:false,
                        renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var changeApportionment = record.get('CHANGE_IN_APPORT');
        					if(nodeDate == null || nodeDate == '')
        					{
        						metaData.style = "background-color:#f0f4dd;";
        						changeApportionment = '<font style="color:black;">'+changeApportionment+'</font>';
        					}
        					return changeApportionment;
        				}
					}
				]
			}
			
		];
		this.callParent( arguments );
	}
} );
