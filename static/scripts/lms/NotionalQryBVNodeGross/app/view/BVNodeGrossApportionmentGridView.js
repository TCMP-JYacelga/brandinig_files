Ext.define( 'GCP.view.BVNodeGrossApportionmentGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'bVNodeGrossApportionmentGridViewType',
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

			var strUrl = 'getBVNodeGrossApportionment.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
				+ encodeURIComponent( document.getElementById( 'viewState' ).value ) + "&$changeId=" + changeId;
			this.enableColumnHide = false;
			this.store = Ext.create( 'Ext.data.Store',
			{
				storeId : 'detailStore',
				autoLoad : viewName == 'APPORTIONMENT',
				fields :
				[
				 	'COMPUTATION_DATE', 'NODE', 'BEFORE_GROSS_CREDIT_BAL', 'BEFORE_GROSS_DEBIT_BAL', 'BEFORE_PAIRED_NODE', 'BEFORE_CREDIT_APPORT_RATE',
					'BEFORE_CREDIT_APPORT_AMNT', 'BEFORE_DEBIT_APPORT_RATE', 'BEFORE_DEBIT_APPORT_AMNT', 'AFTER_GROSS_CREDIT_BALANCE',
					'AFTER_GROSS_DEBIT_BALANCE', 'AFTER_PAIRED_NODE', 'AFTER_CREDIT_APPORT_RATE', 'AFTER_CREDIT_APPORT_AMNT',
					'AFTER_DEBIT_APPORT_RATE', 'AFTER_DEBIT_APPORT_AMNT', 'CHANGE_IN_CREDIT_APPORT', 'CHANGE_IN_DEBIT_APPORT',
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
							text : getLabel( 'lblBeforeGrossCreditBal', 'Gross Credit Balance' ),
							dataIndex : 'BEFORE_GROSS_CREDIT_BAL',
							align : 'right',
							width : 160,
							sortable:false,
							renderer : function( value, metaData, record, rowIndex )
		        			{
		        				var nodeDate = record.get('COMPUTATION_DATE');
		        				var poolBalance = record.get('BEFORE_GROSS_CREDIT_BAL');
		        				if(nodeDate == null || nodeDate == '')
		        				{
		        					metaData.style = "background-color:#f0f4dd;";
		        				}
		        				return poolBalance;
		        			}
						},
						{
							text : getLabel( 'lblBeforeGrossDebitBal', 'Gross Debit Balance' ),
							dataIndex : 'BEFORE_GROSS_DEBIT_BAL',
							align : 'right',
							width : 160,
							sortable:false,
							renderer : function( value, metaData, record, rowIndex )
		        			{
		        				var nodeDate = record.get('COMPUTATION_DATE');
		        				var poolBalance = record.get('BEFORE_GROSS_DEBIT_BAL');
		        				if(nodeDate == null || nodeDate == '')
		        				{
		        					metaData.style = "background-color:#f0f4dd;";
		        				}
		        				return poolBalance;
		        			}
						},
						{
							text : getLabel( 'lblBeforePairedNode', 'Paired Node' ),
							dataIndex : 'BEFORE_PAIRED_NODE',
							align : 'left',
							width : 145,
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
							width : 230,
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
						},
						{
							text : getLabel( 'lblBeforeDebitApportRate', 'Debit Apportionment Rate' ),
							dataIndex : 'BEFORE_DEBIT_APPORT_RATE',
							align : 'right',
							width : 195,
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
							text : getLabel( 'lblBeforeDebitApportAmnt', 'Debit Apportionment Amount' ),
							dataIndex : 'BEFORE_DEBIT_APPORT_AMNT',
							align : 'right',
							width : 230,
							sortable:false,
							renderer : function( value, metaData, record, rowIndex )
	        				{
	        					var nodeDate = record.get('COMPUTATION_DATE');
	        					var intAmount = record.get('BEFORE_DEBIT_APPORT_AMNT');
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
							width : 180,
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
							text : getLabel( 'lblAfterGrossDebitBal', 'Gross Debit Balance' ),
							dataIndex : 'AFTER_GROSS_DEBIT_BALANCE',
							align : 'right',
							width : 160,
							sortable:false,
							renderer : function( value, metaData, record, rowIndex )
		        			{
		        				var nodeDate = record.get('COMPUTATION_DATE');
		        				var balance = record.get('AFTER_GROSS_DEBIT_BALANCE');
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
							align : 'right',
							width : 145,
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
		                       			strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'AFTER_CRDIT_PROFILE' ) + "', '" + record.get( 'COMPUTATION_DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
							width : 230,
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
						},
						{
							text :getLabel( 'lblAfterDebitApportRate', 'Debit Apportionment Rate' ),
							dataIndex : 'AFTER_DEBIT_APPORT_RATE',
							align : 'right',
							width : 195,
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
							text :getLabel( 'lblAfterDebitApportAmnt', 'Debit Apportionment Amount' ),
							dataIndex : 'AFTER_DEBIT_APPORT_AMNT',
							align : 'right',
							width : 230,
							sortable:false,
							renderer : function( value, metaData, record, rowIndex )
	        				{
	        					var nodeDate = record.get('COMPUTATION_DATE');
	        					var intAmount = record.get('AFTER_DEBIT_APPORT_AMNT');
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
					height : 80,
					columns :
					[
						{
							text : getLabel( 'lblChangeInCreditApport', 'Change In Credit Apportionment' ),
							dataIndex : 'CHANGE_IN_CREDIT_APPORT',
							align : 'right',
							width : 240,
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
						},
						{
							text : getLabel( 'lblChangeInDebitApport', 'Change In Debit Apportionment' ),
							dataIndex : 'CHANGE_IN_DEBIT_APPORT',
							align : 'right',
							width : 240,
							sortable:false,
							renderer : function( value, metaData, record, rowIndex )
	        				{
	        					var nodeDate = record.get('COMPUTATION_DATE');
	        					var debitApportionment = record.get('CHANGE_IN_DEBIT_APPORT');
	        					if(nodeDate == null || nodeDate == '')
	        					{
	        						debitApportionment = '<font style="color:black;">'+debitApportionment+'</font>';
	        						metaData.style = "background-color:#f0f4dd;";
	        					}
	        					return debitApportionment;
	        				}
						}
					]
				}

			];
			this.callParent( arguments );
		}
	} );
