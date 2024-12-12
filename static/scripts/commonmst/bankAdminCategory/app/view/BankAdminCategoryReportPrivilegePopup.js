/**
 * @class GCP.view.BankAdminCategoryReportPrivilegePopup
 * @extends Ext.window.Window
 * @author Nilesh Shinde
 */

var reportFieldJson = [];

Ext.define( 'GCP.view.BankAdminCategoryReportPrivilegePopup',
{
	extend : 'Ext.window.Window',
	xtype : 'bankAdminCategoryReportPrivilegePopupType',
	width : 500,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	rowCount : 0,
	//resizable : false,
	title : getLabel('reportPrivileges','Report Privileges'),
	cls : 'non-xn-popup',
	//layout : 'fit',
//	overflowY : 'auto',
	config :
	{
	//	layout : 'fit',
		modal : true,
		draggable : false,
		resizable:false,
		closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null,
		servicesImgIds : [],
		servicesHeaderIds : [],
		reportsSectionIds : []
	},

	listeners :
	{
		resize : function(){
			this.center();
		},
		show : function()
		{
			this.showCheckedSection();
			//this.render();
		}
	},

	getBankAdminReportMenuList : function()
	{
	
		var me = this;
		var menuData;
            var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		var strUrl = 'getBankAdminReportMenuList.srvc?';
		strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
           while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
				strUrl = strGeneratedUrl;

		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			async : false,
			params:objParam,
			success : function( response )
			{
				menuData = Ext.JSON.decode( response.responseText );
				return menuData;
			},
			failure : function()
			{
				var errMsg = "";
				Ext.MessageBox.show(
				{
					title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
					msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
		return menuData;
	},

	loadFeaturs : function( moduleCode )
	{
		var me = this;
		var featureData;
      var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		var strUrl = 'getBankAdminReportPrevilegeList.srvc?';
		strUrl = strUrl + "$moduleCode=" + moduleCode;
		strUrl = strUrl + "&" + "$viewState=" +  viewState ;
		strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
       while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
				strUrl = strGeneratedUrl;

		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			async : false,
			params:objParam,
			success : function( response )
			{
				featureData = Ext.JSON.decode( response.responseText );
				return featureData;
			},
			failure : function()
			{
				var errMsg = "";
				Ext.MessageBox.show(
				{
					title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
					msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
		return featureData;
	},

	filterFeatures : function( data, subsetCode )
	{
		var allFeatures = new Ext.util.MixedCollection();
		allFeatures.addAll( data );
		var featureFilter = new Ext.util.Filter(
		{
			filterFn : function( item )
			{
				//console.log( 'item.rmSerial= ' + item.rmSerial );
				//return item.rmDescription == subsetCode;
				return true;
			}
		} );
		var featurs = allFeatures.filter( featureFilter );
		return featurs.items;
	},

	getBooleanvalue : function( strValue )
	{
		if( strValue == 'Y' || strValue == true )
		{
			return true;
		}
		else
		{
			return false;
		}
	},

	setColumnHeader : function()
	{
		var featureItems = [];
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.80,
			text : getLabel("reportName","Report Name"),
			padding : '5 0 0 0',
			width : 370,
			cls : 'non-t7-privilege-label non-t7-privilege-grid-main-header br-privilege-type'
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel("view","View"),
			padding : '5 0 0 30',
			cls : 'non-t7-privilege-label report-privilege-type' //panelHeaderText background
		} );
		return featureItems;
	},

	setPanelHeader : function( id, title, moduleCode )
	{
		var me = this;
		var featureItems = [];
		me.rowCount++;
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.80,
			text : title,
			padding : '5 0 0 10',
			height : 25,
			cls : (me.rowCount%2) ? 'non-t7-privilege-grid-header privilege-grid-even' : 'non-t7-privilege-grid-header privilege-grid-odd'
		} );
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls :  (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-grid-odd',
		text: title,
		height : 25,
		//padding:'5 0 0 10',
		items : [{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png", //"./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 39',
			//padding : '5  5 2 38',
			width : 18,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'privilege-grid-even checkbox-col' : 'privilege-grid-odd checkbox-col',
			disabled:(pageMode == "VIEW")?true:false,
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "VIEW" );
			}
		}]
		});
		
		/*featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png", //"./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 39',
			//padding : '5  5 2 38',
			width : 10,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'privilege-grid-even checkbox-col' : 'privilege-grid-odd checkbox-col',
			disabled:(pageMode == "VIEW")?true:false,
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "VIEW" );
			}
		} );*/
		return featureItems;
	},

	setSubPanelHeader : function( id, title )
	{
		var featureItems = [];
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.80,
			text : title,
			padding : '5 0 0 20',
			height : 25,
			cls : 'subPanelHeaderText'
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '5 5 2 55',
			width : 18,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : 'btn',
			disabled:(pageMode == "VIEW")?true:false
		} );
		return featureItems;
	},

	setPriviligeMenu : function( feature, MODE, index)
	{
		var obj = new Object();
		if( MODE == 'VIEW' )
		{
			var i = !this.getBooleanvalue( feature.rmForView );
			//obj.hidden = !this.getBooleanvalue(feature.rmForView);
			obj.checked = this.getBooleanvalue( feature.canView );
		}

		if( i === false )
		{
			obj.xtype = "checkbox";
			if(index%2==0)
			obj.cls = 'cellContent privilege-grid-odd';
			else
			obj.cls = 'cellContent privilege-grid-even';
			//obj.cls = 'cellContent';
		}
		else
		{
			obj.xtype = "label";
			obj.text = ".";
			if(index%2==0)
			obj.cls = 'whitetext privilege-grid-odd';
			else
			obj.cls = 'whitetext privilege-grid-even';
			//obj.cls = 'whitetext';
			//obj.hidden = true;
		}
		obj.columnWidth = '0.20';
		obj.height = 25;
		obj.padding = '0 0 0 0';
        obj.id = "checkbox_" + feature.rmSerial + "_" + feature.moduleCode +  "_" + MODE;
		obj.itemId = feature.rmSerial + "_" + MODE;
		obj.rmWeight = feature.rmSerial;
		obj.moduleCode = feature.moduleCode;
		obj.mode = MODE;
		obj.rmSerial = feature.rmSerial;
		//obj.border = 1;
		if( null != obj.checked && undefined != obj.checked )
		{
			obj.defVal = obj.checked;
		}
		if( pageMode === "VIEW" || pageMode === "verifySubmit" )
		{
			obj.readOnly = true;
		}
		reportFieldJson.push( obj );
		return obj;
	},

	setMenuRow : function( moduleCode )
	{
		var self = this;
		var filteredData = featuresData;
		var featureItems = [];
		Ext.each( filteredData, function( feature, index )
		{
			if(feature.moduleCode === moduleCode)
			{
			var panel = Ext.create( 'Ext.panel.Panel',
			{
				columnWidth : 1,
				layout : 'column',
				bodyStyle :
				{
					background : ' #FAFAFA '
				}
			} );

			if(index%2 == 0){
			panel.insert(
			{
				xtype : 'label',
				columnWidth : 0.80,
				height : 25,
				//text : feature.reportName,
				text : getLabel(feature.reportCode,feature.reportName),
				padding : '5 0 0 20',
				cls: 'privilege-grid-odd privilege-admin-rights'
			} );
			}
			else{
				panel.insert(
			{
				xtype : 'label',
				columnWidth : 0.80,
				height : 25,
				//text : feature.reportName,
				text : getLabel(feature.reportCode,feature.reportName),
				padding : '5 0 0 20',
				cls: 'privilege-grid-even privilege-admin-rights'
			} );
			}
			
			panel.insert( self.setPriviligeMenu( feature, "VIEW", index ) );
			//panel.insert( self.setPriviligeMenu( feature, "EDIT" ) );
			//panel.insert( self.setPriviligeMenu( feature, "AUTH" ) );
			featureItems.push( panel );
			}
		} );

		return featureItems;
	},

	showCheckedSection : function()
	{
		var me = this;
		var chkServicesImgId = null;
		var headerId = null;
		var sectionId = null;

		/*
		 * Check for check/uncheck of Services checkboxes
		 */
		for( var i = 0 ; i < me.servicesImgIds.length ; i++ )
		{
			headerImgId = me.servicesImgIds[ i ];
			chkServicesImgId = document.getElementById( "chkServicesImg_" + headerImgId );
			headerId = Ext.getCmp( me.servicesHeaderIds[ i ] );
			sectionId = Ext.getCmp( me.reportsSectionIds[ i ] );

			headerId.show();
			sectionId.show();

			if( chkServicesImgId )
			{
				if( chkServicesImgId.src.indexOf( "icon_unchecked.gif" ) > -1 || chkServicesImgId.src.indexOf( "icon_unchecked_grey.gif" ) > -1)
				{
					headerId.hide();
					sectionId.hide();
				}
			}
		}
	},

	getPanelItems : function()
	{
		var me = this;
		var item;
		var menuItems = [];
		var menuData = null;
		var moduleCode = -1;
		var headerId = null;
		var headerName = null;
		var sectionId = null
		var servicesCount = -1;

		// insert item for main header
	/*	item =
		{
			xtype : 'panel',
			id : 'reportColumnHeader',
			layout : 'column',
			cls : 'alignCenter',
			margin : '5 5 5 5',
			padding : '5 5 5 5',
			items : me.setColumnHeader()
		};
		menuItems.push( item );*/

		// get module menus
		menuData = this.getBankAdminReportMenuList();
		featuresData = this.loadFeaturs( '02' );
		Ext.each( menuData, function( moduleMenu, index )
		{
			servicesCount++;
			moduleCode = moduleMenu.moduleCode;
			headerName = moduleMenu.moduleName;
			headerId = moduleCode + headerName + 'HeaderReport';
			me.servicesImgIds[ servicesCount ] = moduleCode + headerName;
			me.servicesHeaderIds[ servicesCount ] = headerId;
			// insert item for panel header
			item =
			{
				xtype : 'panel',
				id : headerId,
				layout : 'column',
				//cls : 'non-t7-privilege-sub-label',
				//margin : '4 0 0 0',
				items : me.setPanelHeader( headerId, headerName, moduleCode )
			};
			menuItems.push( item );

			sectionId = moduleCode + headerName + 'SectionReport';
			me.reportsSectionIds[ servicesCount ] = sectionId;

			// insert item for menu
			item =
			{
				xtype : 'panel',
				titleAlign : "left",
				cls : 'xn-ribbon',
				collapseFirst : true,
				id : sectionId,
				layout : 'column',
				items : me.setMenuRow( moduleCode )
			};
			menuItems.push( item );
		} );

		return menuItems;
	},

	initComponent : function()
	{
		var thisClass = this;
		thisClass.items =
		[
			{
				xtype : 'container',
				//cls : 'border',
				cls : 'brprivilege',
				items :
				[
					{
						xtype:'panel',
						items:[{
								xtype : 'panel',
								id : 'reportColumnHeader',
								layout : 'column',
								cls : 'non-t7-privilege-label', //alignCenter
								padding : '0 0 0 10',
								items : thisClass.setColumnHeader()
						}]
					},
					{
						xtype:'panel',
						overflowY:'auto',
						//height:350,
						maxHeight : 390,
						items:[{
								xtype : 'panel',
								itemId : 'reportPrivilegePanelItemId',
								items : thisClass.getPanelItems()
						}]
					}
				]
			}
		];

		if( pageMode === "VIEW" || pageMode === "verifySubmit" )
		{
			thisClass.bbar =
			[
			'->',
				{
					text : getLabel('close','Close'),//'Ok',
					handler : function( btn, opts )
					{
						thisClass.close();
					}
				}
			];
		}
		else
		{
			thisClass.bbar =
			[
				{
					text : getLabel('cancel','Cancel'),
					handler : function( btn, opts )
					{
						thisClass.close();
					}
				}, '->',
				{
					text : getLabel('submit','Submit'),//'Ok',
					handler : function( btn, opts )
					{
						thisClass.saveItems();
						thisClass.close();
					}
				}
			];
		}
		this.callParent( arguments );
	},

	changeHeaderIcon : function( btn, moduleCode, iconType )
	{
		setDirtyBit();
		if( pageMode === "EDIT" )
		{
			var me = this;
			var flag = true;

			if( btn.icon.match( 'checkbox.png' ) )
			{
				btn.setIcon( "./static/images/icons/checked_nont7.png" );
				flag = true;
			}
			else
			{
				btn.setIcon( "./static/images/icons/checkbox.png" );
				flag = false;
			}

			Ext.each( reportFieldJson, function( field, index )
			{
				var featureId = field.itemId;
				var element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
				if( element != null && element != undefined && !element.hidden )
				{
					if( moduleCode == field.moduleCode && iconType == element.mode )
					{
						element.setValue( flag );
						element.defVal = element.getValue();
					}
				}
			} );
		}
	},

	saveItems : function()
	{
		var me = this;
		var selectedReportCodes = {};
		setDirtyBit();
		Ext.each( reportFieldJson, function( field, index )
		{
			var featureId = field.itemId;
			var element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
			if( element != null && element != undefined && !element.hidden )
			{
				if( 'VIEW' == element.mode )
				{
					selectedReportCodes[ field.rmSerial ] = element.getValue();
					element.defVal = element.getValue();
				}
			}
		} );
		if( !Ext.isEmpty( me.fnCallback ) && typeof me.fnCallback == 'function' )
		{
			me.fnCallback( selectedReportCodes );
			me.close();
		}
	}
} );
