Ext.define('GCP.view.BroadcastMessageFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'broadcastMessageFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		var filterContainerArr = new Array();
		var me = this;	
		var singleSeller=false;	
		if('false'==multipleSellersAvailable)
		{
			singleSeller=true;
		}
	/*	var statusStore = Ext.create('Ext.data.Store', {
					fields : ['state', 'desc'],
					data : [{
								"state" : "",
								"desc" : getLabel('all', 'ALL')
							}, {
								"state" : "0",
								"desc" : getLabel('new', 'New')
							}, {
								"state" : "1",
								"desc" : getLabel('submitted', 'Submitted')
							}, {
								"state" : "1",
								"desc" : getLabel('modified', 'Modified')
							}, {
								"state" : "3",
								"desc" : getLabel('authorized', 'Authorized')
							}, {
								"state" : "4",
								"desc" : getLabel('enableRequest',
										'Enable Request')
							}, {
								"state" : "5",
								"desc" : getLabel('disableRequest',
										'Disable Request')
							}, {
								"state" : "7",
								"desc" : getLabel('newRejected', 'New Rejected')
							}, {
								"state" : "8",
								"desc" : getLabel('modifed Rejected',
										'Modifed Rejected')
							}, {
								"state" : "10",
								"desc" : getLabel('enableRequestReject',
										'Enable Request Reject')
							}, {
								"state" : "9",
								"desc" : getLabel('disableRequestReject',
										'Disable Request Reject')
							}, {
								"state" : "3",
								"desc" : getLabel('disabled', 'Disabled')
							}]
				});
*/
	/*	var sellerClientContainer = Ext.create('Ext.container.Container', {
					layout : 'hbox',
					itemId : 'sellerClientFilter',
					cls : 'xn-filter-toolbar',
					items : [{
								xtype : 'panel',
								layout : 'vbox',
								flex : 1,
								itemId : 'sellerFilter',
								items : []
							}]
				});
				*/
				me.items =
				[
			
					{
					xtype : 'container',
					layout : 'vbox',
					itemId : 'sellerClientFilter',
					cls : 'xn-filter-toolbar',
					/*flex : 1,*/
					align : 'stretch',
					hidden:singleSeller,
					items : [{
					
								xtype : 'panel',
								layout : 'vbox',
								itemId : 'sellerFilter',
								items : []
							}]
					
					},
					{
						xtype : 'panel',
						layout : 'vbox',
						flex : 1,
						margin : (singleSeller)?'0 0 0 10':'',
						align : 'stretch',
						itemId : 'specificFilter',
						items : []
					},
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						margin : '0 0 0 0',
						flex : 1,
						align : 'stretch',
						items : [{
									xtype : 'label',
									text : getLabel('status', 'Status'),
									cls : 'frmLabel'
								}, {
									xtype : 'combo',
									width : 150,
									displayField : 'value',
									valueField : 'name',
									value : getLabel('all','ALL'),
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'statusFilter',
									itemId : 'statusFilter',
									name : 'statusCombo',
									emptyText : 'All',
									editable : false,
									store : me.getStatusStore()
								}]
					},
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar ',
						layout : 'vbox',
						margin : '0 0 0 0',
						flex : 1,
						align : 'stretch',
						items : [{
							xtype : 'panel',
							layout : 'hbox',
							items : [{
										xtype : 'label',
										itemId : 'dateLabel',
										text : getLabel('latestStartDt', 'Start Date(Latest)'),
										cls : 'ux_font-size14',
										padding : '0 0 6 0'
									}, {
										xtype : 'button',
										border : 0,
										filterParamName : 'messageDate',
										itemId : 'messageDate',
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer ui-caret',
													listeners : {
														click:function(event){
																var menus=me.createDateFilterMenu(this)
																var xy=event.getXY();
																menus.showAt(xy[0],xy[1]+16);
																event.menu=menus;
														}
													}
										}
									]
								},
								{
										xtype : 'component',
										width:'200px',
										itemId : 'messageDatePicker',
										filterParamName : 'dueDate',
										html :'<input type="text"  id="entryDataPicker" class="ft-datepicker ui-datepicker-range-alignment">'
								}								
					
								]
					}
					
					];
		this.callParent(arguments);
	},
	createDateFilterMenu : function(buttonIns){
	var dropdownMenu = Ext.create( 'Ext.menu.Menu',
										{
											cls : 'ext-dropdown-menu',
											listeners : {
											hide:function(event) {
												buttonIns.addCls('ui-caret-dropdown');
												buttonIns.removeCls('action-down-hover');
												}
											},		
											items :
											[
												{
													text : getLabel('latest', 'Latest'),
													btnId : 'btnLatest',
													btnValue : '12',
													parent : this,
													handler : function(btn, opts) {
														this.parent.fireEvent('dateChange',
																btn, opts);
													}
												},
												{
													text : getLabel( 'today', 'Today' ),
													btnId : 'btnToday',
													btnValue : '1',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'yesterday', 'Yesterday' ),
													btnId : 'btnYesterday',
													btnValue : '2',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thisweek', 'This Week' ),
													btnId : 'btnThisweek',
													btnValue : '3',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastweektodate', 'Last Week To Date' ),
													btnId : 'btnLastweek',
													parent : this,
													btnValue : '4',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thismonth', 'This Month' ),
													btnId : 'btnThismonth',
													parent : this,
													btnValue : '5',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastMonthToDate', 'Last Month To Date' ),
													btnId : 'btnLastmonth',
													btnValue : '6',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thisquarter', 'This Quarter' ),
													btnId : 'btnLastMonthToDate',
													btnValue : '8',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
													btnId : 'btnQuarterToDate',
													btnValue : '9',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thisyear', 'This Year' ),
													btnId : 'btnLastQuarterToDate',
													btnValue : '10',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastyeartodate', 'Last Year To Date' ),
													btnId : 'btnYearToDate',
													parent : this,
													btnValue : '11',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												}
											/*	{
													text : getLabel( 'daterange', 'Date Range' ),
													btnId : 'btnDateRange',
													parent : this,
													btnValue : '7',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												}*/
											]
										}
										);
										return dropdownMenu;
		},
		getStatusStore : function(){
			var objStatusStore = null;
			if (!Ext.isEmpty(arrStatusFilterLst)) {
				
				arrStatusFilterLst.push({
					name : 'ALL',
					value : getLabel('all','ALL')
				});					
				objStatusStore = Ext.create('Ext.data.Store', {
							fields : ['name','value'],
							data : arrStatusFilterLst,
							autoLoad : true,
							listeners : {
								load : function() {
								}
							}
						});
				objStatusStore.load();
			}
			return objStatusStore;
		}
});