/**
 * @class GCP.view.BankScheduleView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 */
Ext.define('GCP.view.BankScheduleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankScheduleView',
	requires : ['Ext.ux.gcp.GroupView',
			'GCP.view.BankScheduleTitleView',
			'GCP.view.BankScheduleFilterView',
			'GCP.view.BankScheduleGridInformationView'],
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	widgetType : null,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [{
					xtype : 'bankScheduleTitleView',
					cls : 'ux_no-border ux_largepaddingtb ux_panel-background'
				},{
					xtype : 'bankScheduleFilterView',
					margin : '0 0 12 0'
				},
				/*{
					xtype : 'bankScheduleGridInformationView',
					margin : '0 0 12 0'		
				}
				*/
				, groupView];
		
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {};
		var cfgGroupByUrl = 'services/grouptype/bankScheduleNewUX/groupBy.srvc';
		var strWidgetFilter = cfgGroupByUrl+ '?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+strSeller+'\'' + ' and seller eq '+'\''+strSeller+'\''
		 + '&$filterscreen=BANKSCHEDULE';
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : getLabel('schedules', 'Schedules'),
					cfgGroupByLabel : getLabel('groupBy', 'Group By'),
					cfgGroupCode : objGroupByPref.groupCode || null,
					cfgSubGroupCode : objGroupByPref.subGroupCode || null,
					cfgParentCt : me,
					enableQueryParam:false,
					cfgGridModel : {
						pageSize : _GridSizeTxn,
						rowList : _AvailableGridSize,
						stateful : false,
						hideRowNumbererColumn : true,
						showCheckBoxColumn : false,
						showSummaryRow : false,
						showEmptyRow : false,
						showPager : true,
						minHeight : 100,
						storeModel : {
							fields :
							[
								'entityCode','reportCode','reportName', 'reportDesc', 'reportType','reportTypeDesc','srcType', 'schCnt', 'pregen', 'reportStatus',
								'isFavorite','securityProfile','securityProfileId','__metadata','identifier','version','recordKeyNo','delInfo','entityDesc','isAllowSchdule','isReportAllowSchdule',
								'medium','moduleCode','sellerId','moduleName','entityType','channelName','delOutput','intRecordKeyNmbr','allowSecurityProfileUpdate','allowSchduleAdd','securityProfileId','executeFlag'
							],
							proxyUrl : 'loadBankScheduleWidgetsData/',
							rootNode : 'd.reportCenter',
							totalRowsNode : 'd.__count'
						},
						defaultColumnModel : me.getDefaultColumnModel(),
						groupActionModel : [],
						/**
						 * @cfg{Function} fnColumnRenderer Used as default
						 *                column renderer for all columns if
						 *                fnColumnRenderer is not passed to the
						 *                grids column model
						 */
						fnColumnRenderer : me.columnRenderer,
						fnRowIconVisibilityHandler : me.isRowIconVisible
					}
				});			
		return groupView;
	},
	getDefaultColumnModel : function() {
		var me = this, columnModel = null;
		columnModel = me.getColumns( BANK_GENERIC_COLUMN_MODEL|| []);
		return columnModel;
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push( me.createFavoriteColumn() );
		arrCols.push( me.createGenerateActionColumn() );
		//arrCols.push( me.createActionColumn() );
		if( !Ext.isEmpty( arrColsPref ) )
		{
			for( var i = 0 ; i < arrColsPref.length ; i++ )
			{
				objCol = arrColsPref[ i ];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				if(cfgCol.colId === 'schCnt' || cfgCol.colId === 'pregen')
				{
					cfgCol.align = "right";
				}
				if( !Ext.isEmpty( objCol.colType ) )
				{
					cfgCol.colType = objCol.colType;
				}

				if( objCol.hidden === true )
				{
					cfgCol.hideable = objCol.hidden;
					cfgCol.hidden = objCol.hidden;
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				cfgCol.width = !Ext.isEmpty( objGridWidthMap[ objCol.colId ] ) ? objGridWidthMap[ objCol.colId ] : 200;
				//cfgCol.width =  200;
				arrCols.push( cfgCol );
			}
		}
		return arrCols;
	},	
	createFavoriteColumn : function()
	{
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'favourite',
			width : 40,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : [{
				itemId : 'btnfavorite',
				id : 'btnfavorite',
				itemCls : 'grey cursor_pointer action-link-align linkbox misc-icon icon-misc-nonfavorite'
			}]
		};
		objActionCol.fnColumnRenderer = me.columnRenderer;
		return objActionCol;
	},
	createGenerateActionColumn : function()
	{
		var me = this;
		var objActionCol =
		{
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 70,
			locked : true,
			sortable : false,
			items :
			[
				{
					itemId : 'btnGenrate',
					text : 	getLabel( 'generate', 'Generate' ),
					id : 'btnGenerate',
					itemLabel : getLabel( 'generate', 'Generate' ),
					maskPosition : 1
				}
			]

		};
		return objActionCol;
	},
	
	createActionColumn : function( widgetCodeVal )
	{
		var me = this;
		var objActionCol;
		if( widgetCodeVal == '15' )
		{
			objActionCol =
			{
				colType : 'actioncontent',
				colId : 'actionId',
				width : 40,
				locked : true,
				sortable : false,
				items : []
	
			};
		}
		else
		{
			objActionCol =
			{
				colType : 'actioncontent',
				colId : 'actionId',
				width : 40,
				locked : true,
				sortable : false,
				items :
				[
					/*{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel( 'viewToolTip', 'Edit' ),
						maskPosition : 2
					}*/
				]
	
			};
		}
		return objActionCol;
	},
	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
	    var canedit = canEdit;
		strRetValue = '';		
		if( colId === 'col_schCnt')
		{
			if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
				return;
			else if(record.get("allowSchduleAdd") == "Y" && record.get("executeFlag") == 'Y' && canedit)
			{
				if(value != '0' && value != '')
				{
					strRetValue = '<a class="button_underline thePointer ux_font-size14-normal" href="#" id="seeSchedule">'+ getLabel( 'see', 'See' ) +'</a>';
				}
				else
				{
					strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="addSchedule">'+ getLabel( 'add', 'Add' ) +'</a>';
				}
			}
			else if (record.get("allowSchduleAdd") == "Y" && record.get("executeFlag") == 'Y' && !canedit && canView) {
				strRetValue = '<a class="button_underline thePointer ux_font-size14-normal" href="#" id="seeSchedule">'+ getLabel( 'see', 'See' ) +'</a>';
			}
			else if(record.get("allowSchduleAdd") == "N" && canedit)
				{
				strRetValue = '<a class="button_underline ux_font-size14-normal" id="seeSchedule1">'+ getLabel( 'add', 'Add' ) +'</a>';
				}
			if(record.get("isAllowSchdule") == "N" )
			{
				strRetValue = '';
			}
			else if(record.get("srcType") == 'R' && record.get("isReportAllowSchdule") == "N")
			{
				strRetValue = '';
			}
		}
		else if( colId === 'col_pregen')
		{
			if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
				return;
			else if(value != '0' && value != '' && record.data.srcType != 'U')
			{
				//strRetValue = value;
				strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="seePregenerated">'+ getLabel( 'seeEli', '..See' ) +'</a>';
			}
		}
		else if( colId === 'col_securityProfile')
		{
			//commented for testing 
			if(record.get("srcType") == 'R' && canedit)
			{
				if(value != null && value != '')
				{
					strRetValue = value;
					if(record.get("allowSecurityProfileUpdate") == "Y")
					strRetValue += '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="securityProfile">'+ getLabel( 'editEli', '..Edit' ) +'</a>';
				}
				else
				{
					strRetValue = value;
					if(record.get("allowSecurityProfileUpdate") == "Y")
					strRetValue += '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="securityProfile">'+ getLabel( 'selectEli', '..Select' ) +'</a>';
				}
			}
			else
			{
				strRetValue = value;
			}
		}
		else if( colId == 'col_favourite' )
			{
				var me = this;
				if( !record.get( 'isEmpty' ) )
				{
					
					if( record.data.isFavorite === 'Y' )
					{
						strRetValue = '<a title="'
											+ '" class="linkbox misc-icon icon-misc-favorite"  name="btnfavorite"></a>';
					}
					else
					{
						strRetValue = '<a title="' 
											+ '"class="grey cursor_pointer action-link-align linkbox misc-icon icon-misc-nonfavorite"  name="btnfavorite"></a>';
					}
				}
			}
		/*else if(colId == 'col_genrateId')
		{
			if( record.get("isAllowOndemand") === 'N' )
			{
				strRetValue = 'isAllowOndemand';
			}
		}*/
		else if( colId === 'col_reportName' )
		{
			/*var me = this;
			if( 'R' == record.get( 'srcType' ) )
			{
				strRetValue = record.get( 'reportCode' );
			}
			else
			{
				strRetValue = value;
			}*/
			strRetValue = value;
		}
			else
				strRetValue = value;
					
		return strRetValue;
	},

	/*getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Submit','Discard','Enable','Disable'];
		var objActions = {
			'Submit' : {
				actionName : 'reportCenterSubmit',
				// itemCls : 'icon-button icon-discard',
				disabled : false,
				itemText : getLabel('reportCenterActionSubmit', 'Submit'),
				maskPosition : 3
			},
			'Discard' : {
				actionName : 'reportCenterDiscard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('reportCenterActionDiscard', 'Discard'),
				disabled : false,
				maskPosition : 4
			},
			'Enable' : {
				actionName : 'reportCenterEnable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('reportCenterActionEnable', 'Enable'),
				disabled : false,
				maskPosition : 5
			},
			'Disable' : {
				actionName : 'reportCenterDisable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('reportCenterActionDisable', 'Disable'),
				disabled : false,
				maskPosition : 6
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},*/
	isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
	{
		var maskSize = 2;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if( !Ext.isEmpty( maskPosition ) )
		{
			bitPosition = parseInt( maskPosition,10 ) - 1;
			maskSize = maskSize;
		}
		if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push( buttonMask );
		maskArray.push( rightsMap );
		actionMask = doAndOperation( maskArray, maskSize );
		
		var isSameUser = true;
		if( record.raw.makerId === USER )
		{
			isSameUser = false;
		}
		if( Ext.isEmpty( bitPosition ) )
			return retValue;
		retValue = isActionEnabled( actionMask, bitPosition );
		return retValue;
	
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
});