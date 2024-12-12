Ext.define( 'GCP.view.BVNodeCRGrossApportionGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'bVNodeCRGrossApportionGridViewType',
	cls: 'ft-grid',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.window.MessageBox'
	],
	//modal : true,
	//height : 'auto',
	//overflow : 'auto',
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

		var strUrl = 'getBVNodeCRGrossApportionment.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
			+ encodeURIComponent( document.getElementById( 'viewState' ).value ) + "&$changeId=" + changeId;

		this.store = Ext.create( 'Ext.data.Store',
		{
			storeId : 'detailStore',
			autoLoad : viewName == 'APPORTIONMENT',
			fields :
			[
				'NODE', 'COMPUTATION_DATE', 'BEFORE_GROSS_CREDIT_BALANCE', 'BEFORE_PAIRED_NODE', 'BEFORE_CREDIT_APPORT_RATE', 
				'BEFORE_CREDIT_APPORT_AMNT', 'AFTER_GROSS_CREDIT_BALANCE','AFTER_PAIRED_NODE','AFTER_CREDIT_APPORT_RATE',
				'AFTER_CREDIT_APPORT_AMNT','CHANGE_IN_CREDIT_APPORT', 'BEFORE_CREDIT_PROFILE', 'AFTER_CREDIT_PROFILE' 
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
				width : 120,
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
						text : getLabel( 'lblBeforeGrossCreditBalance', 'Gross Credit Balance' ),
						dataIndex : 'BEFORE_GROSS_CREDIT_BALANCE',
						align : 'right',
						width : 165,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var balance = record.get('BEFORE_GROSS_CREDIT_BALANCE');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return balance;
	        			}
					},
					{
						text : getLabel( 'lblBeforePairedNode', 'Paired Node' ),
						dataIndex : 'BEFORE_PAIRED_NODE',
						align : 'right',
						width : 160,
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
						text : getLabel( 'lblBeforeCreditApportRate', 'Credit Apportionment Rate' ),
						dataIndex : 'BEFORE_CREDIT_APPORT_RATE',
						align : 'right',
						width : 200,
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
						text : getLabel( 'lblBeforeCreditApportAmnt', 'Credit Apportionment Amount' ),
						dataIndex : 'BEFORE_CREDIT_APPORT_AMNT',
						align : 'right',
						width : 225,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var intAmount = record.get('BEFORE_CREDIT_APPORT_AMNT');
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
				height : 80,
				columns :
				[
					{
						text : getLabel( 'lblAfterGrossCreditBal', 'Gross Credit Balance' ),
						dataIndex : 'AFTER_GROSS_CREDIT_BALANCE',
						align : 'right',
						width : 165,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var balance = record.get('AFTER_GROSS_CREDIT_BALANCE');
	        				if(nodeDate == null || nodeDate == '')
	        				{
	        					metaData.style = "background-color:#f0f4dd;";
	        				}
	        				return balance;
	        			}
					},
					{
						text : getLabel( 'lblAfterPairedNode', 'Paired Node' ),
						dataIndex : 'AFTER_PAIRED_NODE',
						align : 'left',
						width : 160,
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
						text : getLabel( 'lblAfterCreditApportRate', 'Credit Apportionment Rate' ),
						dataIndex : 'AFTER_CREDIT_APPORT_RATE',
						align : 'right',
						width : 200,
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
						text : getLabel( 'lblAfterCreditApportAmnt', 'Credit Apportionment Amount' ),
						dataIndex : 'AFTER_CREDIT_APPORT_AMNT',
						align : 'right',
						width : 225,
						sortable:false,
						renderer : function( value, metaData, record, rowIndex )
	        			{
	        				var nodeDate = record.get('COMPUTATION_DATE');
	        				var intAmount = record.get('AFTER_CREDIT_APPORT_AMNT');
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
				text : getLabel( 'lblChangeInCreditApport', 'Change in Credit Apportionment' ),
				dataIndex : 'CHANGE_IN_CREDIT_APPORT',
				//flex : 1,
				align : 'right',
				width : 240,
				height : 50,
				sortable:false,
				renderer : function( value, metaData, record, rowIndex )
    			{
    				var nodeDate = record.get('COMPUTATION_DATE');
    				var creditApportionment = record.get('CHANGE_IN_CREDIT_APPORT');
    				if(nodeDate == null || nodeDate == '')
    				{
    					creditApportionment = '<font style="color:black;">'+creditApportionment+'</font>';
    					metaData.style = "background-color:#f0f4dd;";
    				}
    				return creditApportionment;
    			}
			}
		];
		this.callParent( arguments );
	}
} );
