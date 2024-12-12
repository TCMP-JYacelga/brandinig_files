/**
 * @class GCP.view.BankAdminCategoryInterfacePrivilegePopup
 * @extends Ext.window.Window
 * @author Naresh Mahajan
 */

var interfaceFieldJson = [];

Ext.define( 'GCP.view.CategoryInterfacePrivilegePopup',
{
	extend : 'Ext.window.Window',
	xtype : 'categoryInterfacePrivilegePopupType',
	width : 500,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	rowCount : 0,
	//resizable : false,
	title : getLabel('interfacePrivileges','Interface Privileges'),
	cls : 'xn-popup',
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

	getBankAdminInterfaceMenuList : function()
	{
	
		var me = this;
		var menuData;
            var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		var strUrl = 'services/userCategory/getCategoryServiceList.json?';
		strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
		strUrl = strUrl + "&$viewState="+ encodeURIComponent( parentkey );
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
		var strUrl = 'services/userCategory/getClientInterfacePrevilegeList.json?';
		strUrl = strUrl + "$moduleCode=" + moduleCode;
		strUrl = strUrl + "&" + "$viewState=" + encodeURIComponent( parentkey );
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
				if(null != featureData && null != featureData.d && null != featureData.d.details)
					featureData = featureData.d.details;
				else
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
			padding : '0 0 0 10',
			//width : 200,
			cls : 'boldText privilege-label privilege-grid-main-header privilege-grid-type-label'
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel("edit","Edit"),
			padding : '5 0 0 30',
			cls : 'boldText privilege-label privilege-grid-main-header' //panelHeaderText background
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel("execute","Execute"),
			padding : '5 0 0 30',
			cls : 'boldText privilege-label privilege-grid-main-header' //panelHeaderText background
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
			padding : '5 0 0 5',
			height : 25,
			cls : (me.rowCount%2) ? 'non-t7-privilege-grid-header privilege-grid-even' : 'non-t7-privilege-grid-header privilege-grid-odd'
		} );
		
		var data = this.loadFeaturs(moduleCode, categoryType);
		var filteredData = data;
		var allEdit = false;
		var allExecute = false;
		Ext.each( filteredData, function( feature, index )
		{
			allEdit = me.getBooleanvalue( feature.editFlag );
			//allExecute = me.getBooleanvalue( feature.executeFlag );
			if(allEdit === false){
				return false;
			}
		});
		Ext.each( filteredData, function( feature, index )
		{
			//allEdit = me.getBooleanvalue( feature.editFlag );
			allExecute = me.getBooleanvalue( feature.executeFlag );
			if(allExecute === false){
				return false;
			}
		});
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls :  'cellContent privilege-grid-odd',
		text: title,
		//height : 25,
		//padding:'5 0 0 10',
		
		items : [{
			xtype : 'checkbox',
			columnWidth : 1,
			width:'100%',
			//icon : "./static/images/icons/checkbox.png", //"./static/images/icons/icon_uncheckmulti.gif",
			//margin : '2 5 2 40',
			padding : '0 0 0 0',
			//width : 18,
			//height : 21,
			itemId : 'EDIT_MODULE_HEADER_'+moduleCode,
			border : 0,
			cls : 'cellContent privilege-grid-odd',
			disabled:(pagemode == "VIEW")?true:false,
			categoryType : categoryType,
			moduleCode : moduleCode,
			permissionType : 'EDIT',
			checked : allEdit,
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EDIT" , "MODULE_HEADER" );
			}
		}]
		});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls :  (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-grid-odd',
		text: title,
		height : 25,
		//padding:'5 0 0 10',
		items : [{
			xtype : 'checkbox',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png", //"./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 39',
			//padding : '5  5 2 38',
			width : 18,
			height : 21,
			itemId : 'EXECUTE_MODULE_HEADER_'+moduleCode,
			border : 0,
			cls : (me.rowCount%2) ? 'privilege-grid-even checkbox-col' : 'privilege-grid-odd checkbox-col',
			disabled:(pagemode == "VIEW")?true:false,
			categoryType : categoryType,
			moduleCode : moduleCode,
			permissionType : 'EXECUTE',
			checked : allExecute,
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EXECUTE" , "MODULE_HEADER" );
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
			disabled:(pagemode == "VIEW")?true:false,
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
			disabled:(pagemode == "VIEW")?true:false
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
			disabled:(pagemode == "VIEW")?true:false
		} );
		return featureItems;
	},

	setPriviligeMenu : function( feature, MODE, index, moduleCode, categoryType)
	{
		var obj = new Object();
		if( MODE == 'EDIT' )
		{
			obj.checked = this.getBooleanvalue( feature.editFlag );
		}
		else if( MODE == 'EXECUTE' )
		{
			obj.checked = this.getBooleanvalue( feature.executeFlag );
		}

		obj.xtype = "checkbox";
			if(index%2==0)
			obj.cls = 'cellContent privilege-grid-odd';
			else
			obj.cls = 'cellContent privilege-grid-even';
			//obj.cls = 'cellContent';
		obj.columnWidth = '0.20';
		obj.height = 25;
		obj.padding = '0 0 0 0';
		obj.itemId = feature.interfaceCode + "_" + MODE+"_"+feature.interfaceModelFlag;
		obj.rmWeight = feature.rmSerial;
		obj.moduleCode = feature.moduleCode;
		obj.mode = MODE;
		obj.rmSerial = feature.interfaceCode;
		//obj.border = 1;
		if( null != obj.checked && undefined != obj.checked )
		{
			obj.defVal = obj.checked;
		}
		if( pagemode === "VIEW" || pagemode === "verifySubmit" )
		{
			obj.readOnly = true;
		}
		obj.moduleCode = moduleCode;
		obj.categoryType = categoryType;
		obj.identifier = feature.identifier;
		obj.assigned = feature.isAssigned;
		obj.interfaceModelFlag = feature.interfaceModelFlag;
		// Handler Function
		obj.checkChange = function(){
			var panelPointer = this.up('panel');
			priviegeMenuCheckUncheck(this.value,panelPointer,obj);
		}
		interfaceFieldJson.push( obj );
		return obj;
	},

	setMenuRow : function( moduleCode, categoryType )
	{
		var self = this;
		var data = this.loadFeaturs( moduleCode, categoryType );
		var filteredData = data;
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
				text : feature.interfaceDesc,
				padding : '5 0 0 15',
				cls: 'privilege-grid-odd privilege-admin-rights'
			} );
			}
			else{
				panel.insert(
			{
				xtype : 'label',
				columnWidth : 0.60,
				height : 25,
				text : feature.interfaceDesc,
				padding : '5 0 0 15',
				cls: 'privilege-grid-even privilege-admin-rights'
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
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		//cls :  (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-grid-odd',
		text: title,
		height : 25,
		//padding:'5 0 0 10',
		items : [{
			xtype : 'checkbox',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png", //"./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 39',
			//padding : '5  5 2 38',
			width : 18,
			height : 21,
			itemId : id + "_editIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'privilege-grid-even checkbox-col' : 'privilege-grid-odd checkbox-col',
			disabled:(pagemode == "VIEW")?true:false,
			categoryType : id,
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EDIT","CATEGORY_HEADER" );
			}
		}]
		});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		//cls :  (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-grid-odd',
		text: title,
		height : 25,
		//padding:'5 0 0 10',
		items : [{
			xtype : 'checkbox',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png", //"./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 39',
			//padding : '5  5 2 38',
			width : 18,
			height : 21,
			itemId : id + "_executeIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'privilege-grid-even checkbox-col' : 'privilege-grid-odd checkbox-col',
			disabled:(pagemode == "VIEW")?true:false,
			categoryType : id,
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EXECUTE", "CATEGORY_HEADER" );
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
			disabled:(pagemode == "VIEW")?true:false,
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
		var sectionId = null
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
	
		Ext.each( menuData, function( moduleMenu, index )
		{
			servicesCount++;
			moduleCode = moduleMenu.moduleCode;
			headerName = getLabel('lbl.modules.'+moduleCode, moduleCode);
			//headerName = moduleMenu.moduleDesc;
			headerId = moduleCode + headerName + 'HeaderInterface_client';
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
				items : me.setPanelHeader( headerId, headerName, moduleCode,'CLIENT' )
			};
			menuItems.push( item );

			sectionId = moduleCode + headerName + 'SectionInterface_client';
			me.interfacesSectionIds[ servicesCount ] = sectionId;

			// insert item for menu
			item =
			{
				xtype : 'panel',
				titleAlign : "left",
				cls : 'xn-ribbon',
				collapseFirst : true,
				id : sectionId,
				layout : 'column',
				items : me.setMenuRow( moduleCode ,"CLIENT" )
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
								id : 'interfaceColumnHeader',
								layout : 'column',
								cls : 'non-t7-privilege-label', //alignCenter
								padding : '0 0 0 0',
								items : thisClass.setColumnHeader()
						}]
					},
					{
						xtype:'panel',
						overflowY:'auto',
						//height:350,
						maxHeight : 375,
						items:[{
								xtype : 'panel',
								itemId : 'interfacePrivilegePanelItemId',
								items : thisClass.getPanelItems()
						}]
					}
				]
			}
		];

		if( pagemode === "VIEW" || pagemode === "verifySubmit" )
		{
			thisClass.bbar =
			[
			'->',
				{
					text : getLabel('close','Close'),//'Ok',
					cls : 'ft-button-primary',
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
					cls : 'ft-button-light',
					handler : function( btn, opts )
					{
						thisClass.close();
					}
				}, '->',
				{
					text : getLabel('submit','Submit'),//'Ok',
					cls : 'ft-button-primary',
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

	changeHeaderIcon : function( btn, moduleCode, iconType, headerType )
	{
		if( pagemode === "EDIT" ||  pagemode == 'ADD')
		{
			var me = this;
			var flag = true;
			var iconImg = '';
			var btnCategoryType = btn.categoryType;
			Ext.each( interfaceFieldJson, function( field, index )
			{
				var featureId = field.itemId;
				var element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
				
				if(headerType == 'MODULE_HEADER')
				{
					
					if( element != null && element != undefined && !element.hidden )
					{
						if( moduleCode == field.moduleCode && iconType == element.mode)
						{
							element.setValue( btn.getValue() );
							element.defVal = btn.getValue();
						}
					}
				}
			} );
			
			
		}
	},

	saveItems : function()
	{

		var me = this;
		var selectedInterfaceCodes = {};
		var selectedInterfaceArray = new Array();
		Ext.each( interfaceFieldJson, function( field, index )
		{
			var featureId = field.itemId;
			var element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
			if( element != null && element != undefined && !element.hidden )
			{
				if(selectedInterfaceCodes[field.rmSerial +"_"+field.interfaceModelFlag] == undefined)
				{
					selectedInterfaceCodes[field.rmSerial +"_"+field.interfaceModelFlag] = {};
				}
				if( 'EDIT' == element.mode)
				{
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag].editPermission = element.getValue();
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].moduleCode = element.moduleCode;
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].identifier = element.identifier;
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].assigned = element.assigned;
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].interfaceModelFlag = element.interfaceModelFlag;
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].interfaceCode = element.rmSerial;
					//element.defVal = element.getValue();
				}
				if('EXECUTE' == element.mode)
				{
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].executePermission = element.getValue();
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].moduleCode = element.moduleCode;
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].identifier = element.identifier;
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].assigned = element.assigned;
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].interfaceModelFlag = element.interfaceModelFlag;
					selectedInterfaceCodes[ field.rmSerial +"_"+field.interfaceModelFlag ].interfaceCode = element.rmSerial;
					//element.defVal = element.getValue();
				}
			}
			
		} );
		
		$.each(selectedInterfaceCodes, function(key, objValue){
			
			var value = selectedInterfaceCodes[key];
			var obj = {};
			obj.editPermission = value.editPermission;
			obj.executePermission = value.executePermission;
			obj.moduleCode = value.moduleCode;
			obj.interfaceCode = value.interfaceCode;
			obj.assigned = value.assigned;
			obj.identifier = value.identifier;
			obj.interfaceModelFlag = value.interfaceModelFlag;
			
			if(!obj.assigned)
			{
				if(obj.editPermission  || obj.executePermission )
				{
					obj.assigned = true;
					selectedInterfaceArray.push(obj);
				}
			}
			else if(obj.assigned)
			{
				if(!obj.editPermission  && !obj.executePermission )
				{
					obj.assigned = false;
					selectedInterfaceArray.push(obj);
				}
				else if(!obj.editPermission || !obj.executePermission )
				{
					obj.assigned = true;
					selectedInterfaceArray.push(obj);
				}
			}
			
			
		});
		
		if( !Ext.isEmpty( me.fnCallback ) && typeof me.fnCallback == 'function' )
		{
			me.fnCallback( selectedInterfaceArray );
			me.close();
		}
		
		
	}
} );

function priviegeMenuCheckUncheck(isSelected,panelPointer,obj){
	var me = this;
	var moduleCode = obj.moduleCode
	var headerName = getLabel('lbl.modules.'+moduleCode, moduleCode);
	var headerId = moduleCode + headerName + 'HeaderInterface_client';
	if(null != panelPointer && undefined != panelPointer){
		var sectionInterfacePanel = panelPointer.up('panel');
		var interfacePrivilegePanel = sectionInterfacePanel.up('panel');
		var itemID = null;
		if(obj.mode === "EDIT"){
			itemID = 'EDIT_MODULE_HEADER_'+moduleCode;
		} else if(obj.mode === "EXECUTE"){
			itemID = 'EXECUTE_MODULE_HEADER_'+moduleCode;
		}
		
		if (isSelected == false){
			var element = interfacePrivilegePanel.down('checkboxfield[itemId=' +itemID+ ']');
			element.setRawValue(false);
			element.lastValue = false;
		}
	}
}
