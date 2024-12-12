Ext.define( 'GCP.view.BVNodeGrossSettledGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'bVNodeGrossSettledGridViewType',
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
	plugins : [

	],
	selModel :
	{
		selType : 'cellmodel'
	},
	initComponent : function()
	{
		var me = this;

		var strUrl = 'getBVNodeGrossSettled.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
			+ encodeURIComponent( document.getElementById( 'viewState' ).value ) + "&$changeId=" + changeId +"&$viewName=GROUP";

		this.store = Ext.create( 'Ext.data.Store',
		{
			storeId : 'detailStore',
			autoLoad : viewName == 'INTEREST_SETTLED',
			fields :
			[
			 	'COMPUTATION_DATE', 'NODE', 'BEFORE_GROSS_CR_POOL_BAL', 'BEFORE_GROSS_DR_POOL_BAL', 'BEFORE_CREDIT_INTEREST_RATE',
				'BEFORE_CREDIT_INTEREST_AMNT', 'BEFORE_DEBIT_INTEREST_RATE', 'BEFORE_DEBIT_INTEREST_AMNT',
				'AFTER_GROSS_CR_POOL_BAL', 'AFTER_GROSS_DR_POOL_BAL', 'AFTER_CREDIT_INTEREST_RATE',
				'AFTER_CREDIT_INTEREST_AMNT', 'AFTER_DEBIT_INTEREST_RATE', 'AFTER_DEBIT_INTERST_AMNT',
				'CHANGE_GROSS_CREDIT_INTEREST', 'CHANGE_GROSS_DEBIT_INTEREST',
				'BEFORE_CREDIT_PROFILE', 'BEFORE_DEBIT_PROFILE', 'AFTER_CREDIT_PROFILE', 'AFTER_DEBIT_PROFILE'
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
				text : getLabel( 'lblDate', 'Date' ),
				dataIndex : 'COMPUTATION_DATE',
				//flex : 1,
				align : 'left',
				width : 140,
				height : 50,
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
				text : getLabel( 'lblNode', 'Node' ),
				dataIndex : 'NODE',
				//flex : 1,
				align : 'left',
				width : 140,
				height : 50,
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
				height : 80,
				columns :
				[
					{
						text : getLabel( 'lblBeforeGrossCreditPoolBalance', 'Gross Credit Pool Balance' ),
						dataIndex : 'BEFORE_GROSS_CR_POOL_BAL',
						align : 'right',
						width : 200,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var poolBalance = record.get('BEFORE_GROSS_CR_POOL_BAL');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return poolBalance;
	        			}
					},
					{
						text : getLabel( 'lblBeforeGrossDebitPoolBalance', 'Gross Debit Pool Balance' ),
						dataIndex : 'BEFORE_GROSS_DR_POOL_BAL',
						align : 'right',
						width : 200,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var poolBalance = record.get('BEFORE_GROSS_DR_POOL_BAL');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return poolBalance;
	        			}
					},
					{
						text : getLabel( 'lblBeforeCreditIntRate', 'Credit Interest Rate' ),
						dataIndex : 'BEFORE_CREDIT_INTEREST_RATE',
						align : 'right',
						width : 155,
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
	                       			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'BEFORE_CREDIT_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
						text : getLabel( 'lblBeforeCreditInterestAmnt', 'Credit Interest Amount' ),
						dataIndex : 'BEFORE_CREDIT_INTEREST_AMNT',
						align : 'right',
						width : 175,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var amount = record.get('BEFORE_CREDIT_INTEREST_AMNT');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					amount = '<font style="color:black;">'+amount+'</font>';
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return amount;
	        			}
					},
					{
						text : getLabel( 'lblBeforeDebitIntRate', 'Debit Interest Rate' ),
						dataIndex : 'BEFORE_DEBIT_INTEREST_RATE',
						align : 'right',
						width : 155,
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
	                       			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'BEFORE_DEBIT_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
						text : getLabel( 'lblDebitInterestAmnt', 'Debit Interest Amount' ),
						dataIndex : 'BEFORE_DEBIT_INTEREST_AMNT',
						align : 'right',
						width : 175,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var amount = record.get('BEFORE_DEBIT_INTEREST_AMNT');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					amount = '<font style="color:black;">'+amount+'</font>';
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return amount;
	        			}
					}
				]
			},
			{
				text : getLabel('afterlbl', 'After'),
				height : 80,
				columns :
				[
					{
						text : getLabel( 'lblAfterGrossCreditPoolBal', 'Gross Credit Pool Balance' ),
						dataIndex : 'AFTER_GROSS_CR_POOL_BAL',
						align : 'right',
						width : 200,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var poolBalance = record.get('AFTER_GROSS_CR_POOL_BAL');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return poolBalance;
	        			}
					},
					{
						text : getLabel( 'lblAfterGrossDebitPoolBal', 'Gross Debit Pool Balance' ),
						dataIndex : 'AFTER_GROSS_DR_POOL_BAL',
						align : 'right',
						width : 200,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var poolBalance = record.get('AFTER_GROSS_DR_POOL_BAL');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return poolBalance;
	        			}
					},
					{
						text : getLabel( 'lblAfterCreditInterestRate', 'Credit Interest Rate' ),
						dataIndex : 'AFTER_CREDIT_INTEREST_RATE',
						align : 'right',
						width : 155,
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
	                       			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'AFTER_CREDIT_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
						text : getLabel( 'lblAfterCreditInterestAmount', 'Credit Interest Amount' ),
						dataIndex : 'AFTER_CREDIT_INTEREST_AMNT',
						align : 'right',
						width : 175,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var amount = record.get('AFTER_CREDIT_INTEREST_AMNT');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					amount = '<font style="color:black;">'+amount+'</font>';
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return amount;
	        			}
					},
					{
						text : getLabel( 'lblAfterDebitInterestRate', 'Debit Interest Rate' ),
						dataIndex : 'AFTER_DEBIT_INTEREST_RATE',
						align : 'right',
						width : 155,
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
	                       			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'AFTER_DEBIT_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
						text : getLabel( 'lblAfterDebitInterestAmnt', 'Debit Interest Amount' ),
						dataIndex : 'AFTER_DEBIT_INTERST_AMNT',
						align : 'right',
						width : 175,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var amount = record.get('AFTER_DEBIT_INTERST_AMNT');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					amount = '<font style="color:black;">'+amount+'</font>';
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return amount;
	        			}
					}
				]
			},
			{
				text : getLabel('changelbl', 'Change'),
				height : 80,
				columns :
				[
					{
						text : getLabel( 'lblChangeGrossCreditInterest', 'Change Gross Credit Interest' ),
						dataIndex : 'CHANGE_GROSS_CREDIT_INTEREST',
						align : 'right',
						width : 230,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var creditInterest = record.get('CHANGE_GROSS_CREDIT_INTEREST');
        					if(nodeDate == null || nodeDate == '')
        					{
        						creditInterest = '<font style="color:black;">'+creditInterest+'</font>';
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return creditInterest;
        				}
						
					},
					{
						text : getLabel( 'lblChangeGrossDebitInterest', 'Change Gross Debit Interest' ),
						dataIndex : 'CHANGE_GROSS_DEBIT_INTEREST',
						align : 'right',
						width : 230,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
        				{
        					var nodeDate = record.get('COMPUTATION_DATE');
        					var debitInterest = record.get('CHANGE_GROSS_DEBIT_INTEREST');
        					if(nodeDate == null || nodeDate == '')
        					{
        						debitInterest = '<font style="color:black;">'+debitInterest+'</font>';
        						metaData.style = "background-color:#f0f4dd;";
        					}
        					return debitInterest;
        				}
						
					}
				]
			}

		];
		this.callParent( arguments );
	}
} );