/**
 * @class GCP.view.BankAdminCategoryInterfacePrivilegePopup
 * @extends Ext.window.Window
 * @author Naresh Mahajan
 */

var interfaceFieldJson = [];

Ext.define( 'GCP.view.BankAdminInterfacePrivililegeView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankAdminCategoryInterfacePrivilegePopupType',
	width : 700,
	height : 400,
	//resizable : false,
	
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
		interfacesSectionIds : []
	},

	getBankAdminInterfaceMenuList : function()
	{
	
		var me = this;
		var menuData;
            var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		var strUrl = 'getBankAdminInterfaceMenuList.srvc?';
		strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
		strUrl = strUrl + "&$viewState="+ encodeURIComponent( viewState );
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

	loadFeaturs : function( moduleCode, categoryType )
	{
		var me = this;
		var featureData;
      var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		var strUrl = 'getBankAdminInterfacePrevilegeList.srvc?';
		strUrl = strUrl + "$moduleCode=" + moduleCode;
		strUrl = strUrl + "&" + "$viewState=" + viewState ;
		strUrl = strUrl + "&" + "$categoryType=" + categoryType;
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
			columnWidth : 0.60,
			text : getLabel("interfaceName","Interface Name"),
			padding : '5 0 0 0',
			//width : 200,
			cls : 'panelHeaderText background'
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel("edit","Edit"),
			padding : '5 0 0 0',
			cls : 'panelHeaderText background' //panelHeaderText background
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel("execute","Execute"),
			padding : '5 0 0 10',
			cls : 'panelHeaderText background' //panelHeaderText background
		} );
		return featureItems;
	},

	setPanelHeader : function( id, title, moduleCode, categoryType )
	{
		var me = this;
		var featureItems = [];
		me.rowCount++;
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.60,
			text : title,
			padding : '5 0 0 20',
			height : 25,
			cls : 'panelHeaderText'
		} );
		
		featureItems.push({
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '5 5 2 59',
			//padding : '5  5 2 38',
			width : 18,
			height : 21,
			itemId : categoryType+'_EDIT_MODULE_HEADER_'+moduleCode,
			border : 0,
			cls : 'btn',
			disabled:(pageMode == "VIEW")?true:false,
			categoryType : categoryType,
			moduleCode : moduleCode,
			permissionType : 'EDIT',
			moduleHeaderId : categoryType+'_EDIT_MODULE_HEADER',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EDIT" , "MODULE_HEADER" );
			}
		});
		
		featureItems.push({
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '5 5 2 118',
			
			width : 18,
			height : 21,
			itemId : categoryType+'_EXECUTE_MODULE_HEADER_'+moduleCode,
			border : 0,
			cls : 'btn',
			disabled:(pageMode == "VIEW")?true:false,
			categoryType : categoryType,
			moduleCode : moduleCode,
			permissionType : 'EXECUTE',
			moduleHeaderId : categoryType+'_EXECUTE_MODULE_HEADER',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EXECUTE" , "MODULE_HEADER" );
			}
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
			columnWidth : 0.60,
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
			itemId : id + "_editIcon",
			border : 0,
			cls : 'btn',
			disabled:(pageMode == "VIEW")?true:false
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '5 5 2 55',
			width : 18,
			height : 21,
			itemId : id + "_executeIcon",
			border : 0,
			cls : 'btn',
			disabled:(pageMode == "VIEW")?true:false
		} );
		return featureItems;
	},

	setPriviligeMenu : function( feature, MODE, index, moduleCode, categoryType)
	{
		var obj = new Object();
		if( MODE == 'EDIT' )
		{
			var i = !this.getBooleanvalue( feature.rmForEdit );
			//obj.hidden = !this.getBooleanvalue(feature.rmForView);
			obj.checked = this.getBooleanvalue( feature.canEdit );
		}
		else if( MODE == 'EXECUTE' )
		{
			var i = !this.getBooleanvalue( feature.rmForExecute );
			//obj.hidden = !this.getBooleanvalue(feature.rmForView);
			obj.checked = this.getBooleanvalue( feature.canExecute );
		}

		if( i === false )
		{
			obj.xtype = "checkbox";
			if(index%2==0)
			obj.cls = 'cellContent';
			else
			obj.cls = 'cellContent';
			//obj.cls = 'cellContent';
		}
		else
		{
			obj.xtype = "label";
			obj.text = ".";
			if(index%2==0)
			obj.cls = 'whitetext';
			else
			obj.cls = 'whitetext';
			//obj.cls = 'whitetext';
			//obj.hidden = true;
		}
		obj.columnWidth = '0.20';
		obj.height = 25;
		obj.padding = '0 0 0 0';
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
		obj.moduleCode = moduleCode;
		obj.categoryType = categoryType;
		interfaceFieldJson.push( obj );
		return obj;
	},

	setMenuRow : function( moduleCode, categoryType )
	{
		var self = this;
		var filteredData = featuresData;;
		var featureItems = [];
		Ext.each( filteredData, function( feature, index )
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
				columnWidth : 0.60,
				height : 25,
				text : feature.interfaceName,
				//text : getLabel(feature.srcName,feature.interfaceName),
				padding : '5 0 0 25'
				//cls: 'privilege-grid-odd privilege-admin-rights'
			} );
			}
			else{
				panel.insert(
			{
				xtype : 'label',
				columnWidth : 0.60,
				height : 25,
				text : feature.interfaceName,
				//text : getLabel(feature.srcName,feature.interfaceName),
				padding : '5 0 0 25'
				//cls: 'privilege-grid-even privilege-admin-rights'
			} );
			}
			
			panel.insert( self.setPriviligeMenu( feature, "EDIT", index, moduleCode, categoryType ) );
			panel.insert( self.setPriviligeMenu( feature, "EXECUTE", index, moduleCode, categoryType ) );
			//panel.insert( self.setPriviligeMenu( feature, "AUTH" ) );
			featureItems.push( panel );
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
		var services = $("#moduleCodeMask").val().split(",");
		var allServices = new Array();
		var disabledServices = new Array();
		for(var i = 0; i < services.length; i++)
		{
			var service = services[i].split("|");
			if(service[1] == "0")
			{
				disabledServices.push(service[0]);
			}
			
		}
		// sectionId = 'both_section_header_'+moduleCode;
		var element = null, sectionElement = null;
		Ext.each( disabledServices, function( module, index )
		{
			element = me.down( 'panel[itemId=bank_moduleHeader_'+module+']' );
			if(null != element){
				element.hide();
			}
			sectionElement = me.down( 'panel[id=bank_section_header_'+module+']' );
			if(null != sectionElement){
				sectionElement.hide();
			}
			
			element = me.down( 'panel[itemId=client_moduleHeader_'+module+']' );
			if(null != element){
				element.hide();
			}
			sectionElement = me.down( 'panel[id=client_section_header_'+module+']' );
			if(null != sectionElement){
				sectionElement.hide();
			}
			
			element = me.down( 'panel[itemId=both_moduleHeader_'+module+']' );
			if(null != element){
				element.hide();
			}
			sectionElement = me.down( 'panel[id=both_section_header_'+module+']' );
			if(null != sectionElement){
				sectionElement.hide();
			}
		} );
		
		
	},
	
	setInterfaceCategoryHeader : function( id, title, moduleCode )
	{
		var me = this;
		var featureItems = [];
		me.rowCount++;
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.60,
			text : title,
			padding : '5 0 0 10',
			height : 25
			//cls : (me.rowCount%2) ? 'non-t7-privilege-grid-header privilege-grid-even' : 'non-t7-privilege-grid-header privilege-grid-odd'
		} );
		
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 60',
			width : 10,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : 'btn-header',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "VIEW" );
			}
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 115',
			width : 15,
			height : 21,
			itemId : id + "_editIcon",
			border : 0,
			cls : 'btn-header',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EDIT" );
			}
		} );
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
	
	
	getPanelItems : function()
	{
		var me = this;
		var item;
		var menuItems = [];
		var menuData = null;
		var moduleCode = -1;
		var headerId = null;
		var headerName = null;
		var sectionId = null;
		var servicesCount = -1;

		// insert item for main header
	/*	item =
		{
			xtype : 'panel',
			id : 'interfaceColumnHeader',
			layout : 'column',
			cls : 'alignCenter',
			margin : '5 5 5 5',
			padding : '5 5 5 5',
			items : me.setColumnHeader()
		};
		menuItems.push( item );*/

		// get module menus
		menuData = this.getBankAdminInterfaceMenuList();
		me.menuData = menuData;
		item =
			{
				xtype : 'panel',
				id : 'bankInterfaces',
				layout : 'column',
				cls : 'red-bg-header',
				//cls : 'non-t7-privilege-sub-label',
				//margin : '4 0 0 0',
				items : me.setInterfaceCategoryHeader( 'BANK', 'Bank', null )
		};
		menuItems.push( item );
		featuresData = this.loadFeaturs( '02', 'BANK' );
		Ext.each( menuData, function( moduleMenu, index )
		{
			servicesCount++;
			moduleCode = moduleMenu.moduleCode;
			headerName = moduleMenu.moduleName;
			headerId = moduleCode+'_HeaderInterface';
			me.servicesImgIds[ servicesCount ] = moduleCode + headerName;
			me.servicesHeaderIds[ servicesCount ] = headerId;
			// insert item for panel header
			item =
			{
				xtype : 'panel',
				id : headerId,
				layout : 'column',
				type : 'moduleHeader',
				moduleCode : moduleCode,
				itemId : 'bank_moduleHeader_'+moduleCode,
				cls : 'red-bg',
				margin : '4 0 0 0',
				items : me.setPanelHeader( headerId, headerName, moduleCode,'BANK' )
			};
			menuItems.push( item );

			sectionId = 'bank_section_header_'+moduleCode;
			me.interfacesSectionIds[ servicesCount ] = sectionId;

			// insert item for menu
			item =
			{
				xtype : 'panel',
				titleAlign : "left",
				cls : 'xn-ribbon',
				collapseFirst : true,
				id : sectionId,
				itemId : sectionId,
				layout : 'column',
				items : me.setMenuRow( moduleCode,"BANK" )
			};
			menuItems.push( item );
		} );
		
		
		
		// For client,
		item =
			{
				xtype : 'panel',
				id : 'clientInterfaces',
				layout : 'column',
				cls : 'red-bg-header',
				//cls : 'non-t7-privilege-sub-label',
				//margin : '4 0 0 0',
				items : me.setInterfaceCategoryHeader( 'CLIENT', 'Client', null )
		};
		menuItems.push( item );
		
		Ext.each( menuData, function( moduleMenu, index )
		{
			servicesCount++;
			moduleCode = moduleMenu.moduleCode;
			headerName = moduleMenu.moduleName;
			headerId = moduleCode + headerName + 'HeaderInterface_client';
			me.servicesImgIds[ servicesCount ] = moduleCode + headerName;
			me.servicesHeaderIds[ servicesCount ] = headerId;
			// insert item for panel header
			item =
			{
				xtype : 'panel',
				id : headerId,
				layout : 'column',
				type : 'moduleHeader',
				moduleCode : moduleCode,
				itemId : 'client_moduleHeader_'+moduleCode,
				cls : 'red-bg',
				//margin : '4 0 0 0',
				items : me.setPanelHeader( headerId, headerName, moduleCode,'CLIENT' )
			};
			menuItems.push( item );

			sectionId = 'client_section_header_'+moduleCode;
			me.interfacesSectionIds[ servicesCount ] = sectionId;

			// insert item for menu
			item =
			{
				xtype : 'panel',
				titleAlign : "left",
				cls : 'xn-ribbon',
				collapseFirst : true,
				id : sectionId,
				itemId : sectionId,
				layout : 'column',
				items : me.setMenuRow( moduleCode ,"CLIENT" )
			};
			menuItems.push( item );
		} );
		
		// For Both,
		item =
			{
				xtype : 'panel',
				id : 'bothInterfaces',
				layout : 'column',
				cls : 'red-bg-header',
				//cls : 'non-t7-privilege-sub-label',
				//margin : '4 0 0 0',
				items : me.setInterfaceCategoryHeader( 'BOTH', 'Both', null )
		};
		menuItems.push( item );
		
		Ext.each( menuData, function( moduleMenu, index )
		{
			servicesCount++;
			moduleCode = moduleMenu.moduleCode;
			headerName = moduleMenu.moduleName;
			headerId = moduleCode + headerName + 'HeaderInterface_both';
			me.servicesImgIds[ servicesCount ] = moduleCode + headerName;
			me.servicesHeaderIds[ servicesCount ] = headerId;
			// insert item for panel header
			item =
			{
				xtype : 'panel',
				id : headerId,
				layout : 'column',
				type : 'moduleHeader',
				itemId : 'both_moduleHeader_'+moduleCode,
				moduleCode : moduleCode,
				cls : 'red-bg',
				//margin : '4 0 0 0',
				items : me.setPanelHeader( headerId, headerName, moduleCode,'BOTH' )
			};
			menuItems.push( item );

			sectionId = 'both_section_header_'+moduleCode;
			me.interfacesSectionIds[ servicesCount ] = sectionId;

			// insert item for menu
			item =
			{
				xtype : 'panel',
				titleAlign : "left",
				cls : 'xn-ribbon',
				collapseFirst : true,
				id : sectionId,
				itemId : sectionId,
				layout : 'column',
				items : me.setMenuRow( moduleCode ,"BOTH" )
			};
			menuItems.push( item );
		} );
		return menuItems;
	},

	initComponent : function()
	{
		var thisClass = this;
		this.priviligeList = 
		thisClass.items =
		[
			{
				xtype : 'container',
				cls : 'brprivilege border',
				items :
				[
					{
						xtype:'panel',
						items:[{
								xtype : 'panel',
								id : 'interfaceColumnHeader',
								layout : 'column',
								cls : 'alignCenter', //alignCenter
								padding : '0 0 0 10',
								items : thisClass.setColumnHeader()
						}]
					},
					{
						xtype:'panel',
						overflowY:'auto',
						height:350,
						//maxHeight : 390,
						items:[{
								xtype : 'panel',
								itemId : 'interfacePrivilegePanelItemId',
								items : thisClass.getPanelItems()
						}]
					}
				]
			}
		];

		this.callParent( arguments );
	},

	changeHeaderIcon : function( btn, moduleCode, iconType, headerType )
	{
		if( pageMode === "EDIT" )
		{
			var me = this;
			var flag = true;
			var iconImg = '';
			if( btn.icon.match( 'checkbox.png' ) )
			{
				btn.setIcon( "./static/images/icons/checked_nont7.png" );
				iconImg = './static/images/icons/checked_nont7.png';
				flag = true;
			}
			else
			{
				btn.setIcon( "./static/images/icons/checkbox.png" );
				iconImg = './static/images/icons/checkbox.png';
				flag = false;
			}
			var btnCategoryType = btn.categoryType;
			Ext.each( interfaceFieldJson, function( field, index )
			{
				var featureId = field.itemId;
				var element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
				
				if(headerType == 'MODULE_HEADER')
				{
					console.log(btn);
					if( element != null && element != undefined && !element.hidden )
					{
						if( moduleCode == field.moduleCode && iconType == element.mode && btnCategoryType == element.categoryType)
						{
							element.setValue( flag );
							element.defVal = element.getValue();
						}
					}
				}
				else if(headerType == 'CATEGORY_HEADER')
				{
					if( element != null && element != undefined && !element.hidden  && btnCategoryType == element.categoryType)
					{
						if( iconType == element.mode)
						{
							element.setValue( flag );
							element.defVal = element.getValue();
						}
					}
				}
				
			} );
			
			if(headerType == 'CATEGORY_HEADER')
			{
				Ext.each(me.menuData,function(child){
					var moduleHeader = me.down( 'button[itemId=' + btnCategoryType+'_'+iconType+'_MODULE_HEADER_'+child.moduleCode+']' );
					if(undefined != moduleHeader && null != moduleHeader)
						moduleHeader.setIcon(iconImg);
				});
			}
		}
	},

	saveItems : function()
	{
		var me = this;
		var selectedInterfaceCodes = {};
		
		Ext.each( interfaceFieldJson, function( field, index )
		{
			var featureId = field.itemId;
			var element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
			if( element != null && element != undefined && !element.hidden )
			{
				if(selectedInterfaceCodes[field.rmSerial] == undefined)
				{
					selectedInterfaceCodes[field.rmSerial] = {};
				}
				if( 'EDIT' == element.mode)
				{
					selectedInterfaceCodes[ field.rmSerial ].editPermission = element.getValue();
					selectedInterfaceCodes[ field.rmSerial ].moduleCode = element.moduleCode;
					//element.defVal = element.getValue();
				}
				if('EXECUTE' == element.mode)
				{
					selectedInterfaceCodes[ field.rmSerial ].executePermission = element.getValue();
					selectedInterfaceCodes[ field.rmSerial ].moduleCode = element.moduleCode;
					//element.defVal = element.getValue();
				}
			}
			
		} );
		if( !Ext.isEmpty( me.fnCallback ) && typeof me.fnCallback == 'function' )
		{
			me.fnCallback( selectedInterfaceCodes );
			me.close();
		}
	}
} );
