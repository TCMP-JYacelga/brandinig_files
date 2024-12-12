/**
 * @class GCP.view.BankAdminCategoryOnBehalfPrivilegePopup
 * @extends Ext.window.Window
 * @author Nilesh Shinde
 */

Ext.define( 'GCP.view.BankAdminCategoryOnBehalfPrivilegePopup',
{
	extend : 'Ext.window.Window',
	xtype : 'bankAdminCategoryOnBehalfPrivilegePopupType',
	width : 700,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	title : getLabel('onBehalfPrivileges','On Behalf Privileges'),
	rowCount : 0,
	cls : 'non-xn-popup',
	//layout : 'fit',
//	overflowY : 'auto',
	config :
	{
	//	layout : 'fit',
		modal : true,
		draggable : false,
		resizable : false,
		closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null,
		allOnBehalfPrivileges : null,
		servicesImgIds : [],
		servicesHeaderIds : [],
		accessTypesImgIds : [],
		accessTypesHeaderIds : [],
		accessTypesSectionIds : []
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

	/*getBankAdminMenuList : function( accessType )
	{
		var me = this;
		var menuData;
         	var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		var strUrl = 'getBankAdminMenuList.srvc?';
		strUrl = strUrl + "$accessType=" + accessType;
		strUrl = strUrl + "&" +'$menuMode=CW';
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
	},*/

	/*loadFeaturs : function( accessType, moduleCode, accessTypeCode )
	{
		var featureData;
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		var strUrl = 'getBankAdminPrevilegeList.srvc?';
		strUrl = strUrl + "$accessType=" + accessType;
		strUrl = strUrl + "&" + "$moduleCode=" + moduleCode;
		strUrl = strUrl + "&" + "$menuMode=CW";
		strUrl = strUrl + "&" + "$accessTypeCode=" + accessTypeCode;
		strUrl = strUrl + "&" + "$viewState=" + encodeURIComponent( viewState );
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
	},*/

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
			columnWidth : 0.40,
			text : getLabel("type","Type"),
			padding : '5 0 0 0',
			cls : 'non-t7-privilege-label non-t7-privilege-grid-main-header'
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel("view","View"),
			padding : '5 0 0 0',
			cls : 'non-t7-privilege-label non-t7-privilege-grid-main-header non-t7-alignCenter'
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel('edit','Edit'),
			padding : '5 0 0 0',
			cls : 'non-t7-privilege-label non-t7-privilege-grid-main-header non-t7-alignCenter'
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel('auth','Auth'),
			padding : '5 0 0 0',
			cls : 'non-t7-privilege-label non-t7-alignCenter'
		} );
		return featureItems;
	},

	setPanelHeader : function( id, title, moduleCode )
	{
		var me = this;
		me.rowCount++;
		var featureItems = [];
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.40,
			text : title,
			padding : '5 0 0 10',
			height : 30,
			cls : (me.rowCount%2) ? 'non-t7-privilege-grid-main-header non-t7-privilege-type privilege-grid-even' : 'non-t7-privilege-grid-main-header non-t7-privilege-type privilege-grid-odd'
		} );
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls : (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-odd',
		text: title,
		padding:'5 0 0 10',
		items : [{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 49',
			width : 18,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'privilege-grid-even' : 'privilege-grid-odd',
			disabled:(pageMode == "VIEW")?true:false,
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "VIEW" );
			}
		}]
		});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls : (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-odd',
		text: title,
		padding:'5 0 0 10',
		items : [{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 49',
			width : 18,
			height : 21,
			itemId : id + "_editIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'privilege-grid-even' : 'privilege-grid-odd',
			disabled:(pageMode == "VIEW")?true:false,
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EDIT" );
			}
		}]
		});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls : (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-odd',
		text: title,
		padding:'5 0 0 10',
		items : [{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 49',
			width : 18,
			height : 21,
			itemId : id + "_authIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'privilege-grid-even' : 'privilege-grid-odd',
			disabled:(pageMode == "VIEW")?true:false,
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "AUTH" );
			}
		}]
		});
		/*featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 58',
			width : 10,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : 'non-t7-privilege-sub-label',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "VIEW" );
			}
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 58',
			width : 15,
			height : 21,
			itemId : id + "_editIcon",
			border : 0,
			cls : 'non-t7-privilege-sub-label',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EDIT" );
			}
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 58',
			width : 15,
			height : 21,
			itemId : id + "_authIcon",
			border : 0,
			cls : 'non-t7-privilege-sub-label',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "AUTH" );
			}
		} );*/
		return featureItems;
	},

	setSubPanelHeader : function( id, title, moduleCode, accessTypeCode )
	{
		var me = this;
		var featureItems = [];
		me.rowCount++;
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.40,
			text : title,
			padding : '5 0 0 20',
			height : 30,
			cls : (me.rowCount%2) ? 'non-t7-privilege-grid-main-header non-t7-privilege-type privilege-grid-even' : 'non-t7-privilege-grid-main-header non-t7-privilege-type privilege-grid-odd'
		} );
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls : (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-odd',
		text: title,
		padding:'5 0 0 10',
		items : [{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 49',
			width : 10,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'non-t7-privilege-sub-label-btn privilege-grid-even' : 'non-t7-privilege-sub-label-btn privilege-grid-odd',
			disabled:(pageMode == "VIEW")?true:false,
			text : moduleCode + "-"+accessTypeCode,
			handler : function( btn, e, opts )
			{
				me.changeSubHeaderIcon( btn, moduleCode, accessTypeCode, "VIEW" );
			}
		}]
		});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls : (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-odd',
		text: title,
		padding:'5 0 0 10',
		items : [{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 49',
			width : 15,
			height : 21,
			itemId : id + "_editIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'non-t7-privilege-sub-label-btn privilege-grid-even' : 'non-t7-privilege-sub-label-btn privilege-grid-odd',
			disabled:(pageMode == "VIEW")?true:false,
			text : moduleCode + "-"+accessTypeCode,
			handler : function( btn, e, opts )
			{
				me.changeSubHeaderIcon( btn, moduleCode, accessTypeCode, "EDIT" );
			}
		}]
		});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls : (me.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-privilege-view-edit privilege-grid-odd',
		text: title,
		padding:'5 0 0 10',
		items : [{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 49',
			width : 15,
			height : 21,
			itemId : id + "_authIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'non-t7-privilege-sub-label-btn privilege-grid-even' : 'non-t7-privilege-sub-label-btn privilege-grid-odd',
			disabled:(pageMode == "VIEW")?true:false,
			text : moduleCode + "-"+accessTypeCode,
			handler : function( btn, e, opts )
			{
				me.changeSubHeaderIcon( btn, moduleCode, accessTypeCode, "AUTH" );
			}
		}]
		});
		/*featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 58',
			width : 10,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : 'non-t7-privilege-sub-label-btn',
			text : moduleCode + "-"+accessTypeCode,
			handler : function( btn, e, opts )
			{
				me.changeSubHeaderIcon( btn, moduleCode, accessTypeCode, "VIEW" );
			}
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 108',
			width : 15,
			height : 21,
			itemId : id + "_editIcon",
			border : 0,
			cls : 'non-t7-privilege-sub-label-btn',
			text : moduleCode + "-"+accessTypeCode,
			handler : function( btn, e, opts )
			{
				me.changeSubHeaderIcon( btn, moduleCode, accessTypeCode, "EDIT" );
			}
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/checkbox.png",
			margin : '2 5 2 108',
			width : 15,
			height : 21,
			itemId : id + "_authIcon",
			border : 0,
			cls : 'non-t7-privilege-sub-label-btn',
			text : moduleCode + "-"+accessTypeCode,
			handler : function( btn, e, opts )
			{
				me.changeSubHeaderIcon( btn, moduleCode, accessTypeCode, "AUTH" );
			}
		} );*/
		return featureItems;
	},

	setPriviligeMenu : function( feature, MODE,index)
	{
		var me = this;
		var obj = new Object();
		if( MODE == 'VIEW' )
		{
			var i = !this.getBooleanvalue( feature.rmForView );
			//obj.hidden = !this.getBooleanvalue(feature.rmForView);
			obj.checked = this.getBooleanvalue( feature.canView );
		}
		else if( MODE == 'EDIT' )
		{
			var i = !this.getBooleanvalue( feature.rmForEdit );
			//obj.hidden = !this.getBooleanvalue(feature.rmForEdit);
			obj.checked = this.getBooleanvalue( feature.canEdit );
		}
		else if( MODE == 'AUTH' )
		{
			var i = !this.getBooleanvalue( feature.rmForAuth );
			//obj.hidden = !this.getBooleanvalue(feature.rmForAuth);
			obj.checked = this.getBooleanvalue( feature.canAuth );
		}
		if( i === false )
		{
			obj.xtype = "checkbox";
			obj.cls = (me.rowCount%2)  ? 'cellContent privilege-grid-even non-t7-privilege-checkbox-col' : 'cellContent privilege-grid-odd non-t7-privilege-checkbox-col';
			//obj.cls = 'cellContent';
		}
		else
		{
			obj.xtype = "label";
			//obj.text = ".";
			obj.cls = (me.rowCount%2)  ? 'whitetext privilege-grid-even non-t7-privilege-checkbox-col' : 'whitetext privilege-grid-odd non-t7-privilege-checkbox-col';
			//obj.cls = 'whitetext';
			//obj.hidden = true;
		}
		obj.columnWidth = '0.20';
		obj.padding = '0 0 0 0';
        obj.id = "checkbox_" + feature.rmSerial + "_" + feature.moduleCode +  "_" + MODE;
		obj.itemId = feature.rmSerial + "_" + feature.rmWeight + "_" + MODE;
		obj.rmWeight = feature.rmWeight;
		obj.moduleCode = feature.moduleCode;
		obj.accessTypeCode = feature.accessTypeCode;
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

		if( pageMode === "EDIT" )
		{
			obj.handler = function( btn, e, opts )
			{
				me.checkRowIcon( btn, MODE, feature.rmSerial, feature.rmWeight );
			}
		}

		fieldJson.push( obj );
		return obj;
	},

	setMenuRow : function( moduleCode, accessTypeCode )
	{
		var self = this;
		//var data = this.loadFeaturs( 'B', moduleCode, accessTypeCode );
		//var filteredData = data;
		var featureItems = [];
		Ext.each( self.allOnBehalfPrivileges, function( feature, index )
		{
			if( feature.moduleCode == moduleCode && feature.accessTypeCode == accessTypeCode )
			{
				self.rowCount++;		
				var panel = Ext.create( 'Ext.panel.Panel',
				{
					columnWidth : 1,
					layout : 'column',
					bodyStyle :
					{
						background : ' #FAFAFA '
					}
				} );
	
				panel.insert(
				{
					xtype : 'label',
					columnWidth : 0.40,
					//text : feature.rmDescription,
					text : getLabel(feature.tciRmParent,feature.rmDescription),
					padding : '5 0 0 30',
					cls : (self.rowCount%2) ? 'privilege-grid-even privilege-admin-rights non-t7-privilege-row' : 'privilege-grid-odd privilege-admin-rights non-t7-privilege-row'
				} );
	
				panel.insert( self.setPriviligeMenu( feature, "VIEW", index) );
				panel.insert( self.setPriviligeMenu( feature, "EDIT",index) );
				panel.insert( self.setPriviligeMenu( feature, "AUTH",index) );
				featureItems.push( panel );
			}
		} );

		return featureItems;
	},

	showCheckedSection : function()
	{
		var me = this;
		var chkServicesImgId = null;
		var chkaccessTypesImgId = null;
		var headerId = null;
		var headerImgId = null;
		var subHeaderId = null;
		var subHeaderImgId = null;
		var sectionId = null;

		/*
		 * Check for check/uncheck of Access Types checkboxes
		 */

		for( var i = 0 ; i < me.accessTypesImgIds.length ; i++ )
		{
			subHeaderImgId = me.accessTypesImgIds[ i ];
			chkaccessTypesImgId = document.getElementById( "chkAccessTypesImg_" + subHeaderImgId );

			subHeaderId = Ext.getCmp( me.accessTypesHeaderIds[ i ] );
			subHeaderId.show();
			sectionId = Ext.getCmp( me.accessTypesSectionIds[ i ] );
			sectionId.show();

			if( chkaccessTypesImgId.src.indexOf( "icon_unchecked.gif" ) > -1 || chkaccessTypesImgId.src.indexOf( "icon_unchecked_grey.gif" ) > -1)
			{
				subHeaderId.hide();
				sectionId.hide();
			}
		}

		/*
		 * Check for check/uncheck of Services checkboxes
		 */
		for( var i = 0 ; i < me.servicesImgIds.length ; i++ )
		{
			headerImgId = me.servicesImgIds[ i ];
			chkServicesImgId = document.getElementById( "chkServicesImg_" + headerImgId );

			headerId = Ext.getCmp( me.servicesHeaderIds[ i ] );
			headerId.show();

			if( chkServicesImgId.src.indexOf( "icon_unchecked.gif" ) > -1 || chkServicesImgId.src.indexOf( "icon_unchecked_grey.gif" ) > -1)
			{
				headerId.hide();
				for( var j = 0 ; j < me.accessTypesImgIds.length ; j++ )
				{
					subHeaderId = Ext.getCmp( me.accessTypesHeaderIds[ j ] );
					sectionId = Ext.getCmp( me.accessTypesSectionIds[ j ] );
					if( subHeaderId.id.indexOf( headerImgId ) > -1 )
					{
						subHeaderId.hide();
						sectionId.hide();
					}
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
		var accessTypeCode = -1;
		var headerId = null;
		var headerName = null;
		var subHeaderId = null;
		var subHeaderName = null;
		var sectionId = null
		var servicesCount = -1;
		var accessTypesCount = -1;

		// insert item for main header
	/*	item =
		{
			xtype : 'panel',
			id : 'onBehalfColumnHeader',
			layout : 'column',
			cls : 'alignCenter',
			margin : '5 5 5 5',
			padding : '5 5 5 5',
			items : me.setColumnHeader()
		};
		menuItems.push( item );*/

		// get module menus
		menuData = menuDataa;
		Ext.each( menuData, function( moduleAccessMenu, index )
		{
			if(moduleAccessMenu.rmaccesstype === 'B' && Ext.isEmpty(moduleAccessMenu.formId) && Ext.isEmpty(moduleAccessMenu.typeId))
			{
			// if same level module menu
			if( moduleCode == moduleAccessMenu.moduleCode )
			{
				if( accessTypeCode == moduleAccessMenu.accessTypeCode )
				{
					// this case will not come
				}
				else
				{
					accessTypesCount++;
					accessTypeCode = moduleAccessMenu.accessTypeCode;
					subHeaderName = moduleAccessMenu.accessTypeName;
					subHeaderId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName
						+ moduleAccessMenu.accessTypeCode + moduleAccessMenu.accessTypeName + 'SubHeaderOnBehalf';

					me.accessTypesImgIds[ accessTypesCount ] = accessTypeCode + subHeaderName;
					me.accessTypesHeaderIds[ accessTypesCount ] = subHeaderId;
					// insert item for sub panel header
					item =
					{
						xtype : 'panel',
						id : subHeaderId,
						layout : 'column',
						//cls : 'non-t7-privilege-sub-label',
						items : me.setSubPanelHeader( subHeaderId, subHeaderName, moduleCode, accessTypeCode )
					};
					menuItems.push( item );

					sectionId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName
						+ moduleAccessMenu.accessTypeCode + moduleAccessMenu.accessTypeName + 'SectionOnBehalf';
					me.accessTypesSectionIds[ accessTypesCount ] = sectionId;
					// insert item for menu
					item =
					{
						xtype : 'panel',
						titleAlign : "left",
						//cls : 'xn-ribbon',
						collapseFirst : true,
						id : sectionId,
						layout : 'column',
						items : me.setMenuRow( moduleAccessMenu.moduleCode, moduleAccessMenu.accessTypeCode )
					};
					menuItems.push( item );
				}
			}
			else
			{
				servicesCount++;
				accessTypesCount++;
				moduleCode = moduleAccessMenu.moduleCode;
				headerName = moduleAccessMenu.moduleName;
				headerId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName + 'HeaderOnBehalf';
				me.servicesImgIds[ servicesCount ] = moduleCode + headerName;
				me.servicesHeaderIds[ servicesCount ] = headerId;
				// insert item for panel header
				item =
				{
					xtype : 'panel',
					id : headerId,
					layout : 'column',
					//cls : 'red-bg-header',
					items : me.setPanelHeader( headerId, headerName, moduleCode )
				};
				menuItems.push( item );

				accessTypeCode = moduleAccessMenu.accessTypeCode;
				subHeaderName = moduleAccessMenu.accessTypeName;
				subHeaderId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName
					+ moduleAccessMenu.accessTypeCode + moduleAccessMenu.accessTypeName + 'SubHeaderOnBehalf';

				me.accessTypesImgIds[ accessTypesCount ] = accessTypeCode + subHeaderName;
				me.accessTypesHeaderIds[ accessTypesCount ] = subHeaderId;
				// insert item for sub panel header
				item =
				{
					xtype : 'panel',
					id : subHeaderId,
					layout : 'column',
					//cls : 'red-bg',
					items : me.setSubPanelHeader( subHeaderId, subHeaderName, moduleCode, accessTypeCode )
				};
				menuItems.push( item );

				sectionId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName + moduleAccessMenu.accessTypeCode
					+ moduleAccessMenu.accessTypeName + 'SectionOnBehalf';
				me.accessTypesSectionIds[ accessTypesCount ] = sectionId;
				// insert item for menu
				item =
				{
					xtype : 'panel',
					titleAlign : "left",
					//cls : 'xn-ribbon',
					collapseFirst : true,
					id : sectionId,
					layout : 'column',
					items : me.setMenuRow( moduleAccessMenu.moduleCode, moduleAccessMenu.accessTypeCode )
				};
				menuItems.push( item );
			}
			}
		} );

		return menuItems;
	},

	initComponent : function()
	{
		var thisClass = this;
		
		thisClass.allOnBehalfPrivileges = (featureDataa).filter(function(v) {
					if(v.rmaccesstype === 'B' && Ext.isEmpty(v.formId) && Ext.isEmpty(v.typeId)){
					  return  v;
					  }
					});
		GCP.getApplication().on(
		{
			callOnBehalfSaveItems : function( moduleCode, accessTypeCode, checkBoxValue )
			{
				thisClass.saveItems( moduleCode, accessTypeCode, checkBoxValue );
			}
		} );

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
								id : 'onBehalfColumnHeader',
								layout : 'column',
								cls : 'non-t7-privilege-label',
								padding : '0 0 0 10',
								items : thisClass.setColumnHeader()
						}]
					},
					{
						xtype:'panel',
						overflowY:'auto',
						maxHeight : 400,
						//height:390,
						items:[{
								xtype : 'panel',
								itemId : 'onBehalfPrivilegePanelItemId',
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
					text : getLabel('close','Close'),
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
					text : getLabel('submit','Submit'),
					handler : function( btn, opts )
					{
						thisClass.saveItems( null, null, null );
						thisClass.close();
					}
				}
			];
		}
		this.callParent( arguments );
	},

	checkRowIcon : function( btn, mode, rmSerial, rmWeight )
	{
		var me = this;
		var rmWeightSerialArray;
		var otherIconItemId;
		var lIconType = mode.toLowerCase()+"Icon";
		var allOtherSubHeaderCheckedCount = 0;
		var allSubHeaderCount = 0;
		var isAllOtherSubHeaderChecked = false;
		var allOtherRowCheckedCount = 0;
		var allRowCount = 0;
		var isAllOtherRowChecked = false;
		var accessTypeHeaderId = null;
		var servicesHeaderId = null;
		var indoxOfModuleCode = null;
		var indoxOfAccessCode = null;
		var headerId = null;
		var allItems = null;
		var field  = null;
		var featureId = null;
		var element = null;
		setDirtyBit();
		if( btn.checked )
		{
			if( mode == 'EDIT' || mode == 'AUTH' )
			{
				var viewIconItemId = me.down( 'checkboxfield[itemId=' + rmSerial + '_' + rmWeight + '_VIEW' + ']' );
				if( viewIconItemId )
				{
					viewIconItemId.setValue( true );
					viewIconItemId.defVal = true;
				}
			}
			if( onBehalfDupWeights[ rmWeight ] )
			{
				rmWeightSerialArray = onBehalfDupWeights[ rmWeight ];
				for( i = 0 ; i < rmWeightSerialArray.length ; i++ )
				{
					if( rmSerial != rmWeightSerialArray[ i ] )
					{
						otherIconItemId = me.down( 'checkboxfield[itemId=' + rmWeightSerialArray[ i ] + '_' + rmWeight
							+ '_' + mode + ']' );
						otherIconItemId.setValue( true );
						otherIconItemId.defVal = true;
					}
				}
			}
		}
		else
		{
			if( mode == 'VIEW' )
			{
				var editIconItemId = me.down( 'checkboxfield[itemId=' + rmSerial + '_' + rmWeight + '_EDIT' + ']' );
				if( editIconItemId )
				{
					editIconItemId.setValue( false );
					editIconItemId.defVal = false;
				}
				var authIconItemId = me.down( 'checkboxfield[itemId=' + rmSerial + '_' + rmWeight + '_AUTH' + ']' );
				if( authIconItemId )
				{
					authIconItemId.setValue( false );
					authIconItemId.defVal = false;
				}
			}
			if( onBehalfDupWeights[ rmWeight ] )
			{
				rmWeightSerialArray = onBehalfDupWeights[ rmWeight ];
				for( i = 0 ; i < rmWeightSerialArray.length ; i++ )
				{
					if( rmSerial != rmWeightSerialArray[ i ] )
					{
						otherIconItemId = me.down( 'checkboxfield[itemId=' + rmWeightSerialArray[ i ] + '_' + rmWeight
							+ '_' + mode + ']' );
						otherIconItemId.setValue( false );
						otherIconItemId.defVal = false;
					}
				}
			}
			//uncheck subheader for rowIcon
			for( var j = 0 ; j < me.accessTypesHeaderIds.length ; j++ )				
			{
				indoxOfModuleCode = me.accessTypesHeaderIds[ j ].indexOf(btn.moduleCode);
				indoxOfAccessCode = me.accessTypesHeaderIds[ j ].indexOf(btn.accessTypeCode);
				if(me.accessTypesHeaderIds[ j ].startsWith(btn.moduleCode) 
						&& indoxOfModuleCode>=0 && indoxOfAccessCode >=0 
						&& indoxOfAccessCode >indoxOfModuleCode )
				{
					//sub header uncheck gif
					headerId = Ext.getCmp( me.accessTypesHeaderIds[ j ] );
					allItems = headerId.items.items;
					for( var k = 0 ; k <allItems.length ; k++ )
					{	field  = allItems[k];
						featureId = field.itemId;
						if( featureId != null && featureId != undefined && featureId.endsWith(lIconType))
						{
							element = me.down( 'button[itemId=' + featureId + ']' );
							if( element != null && element != undefined && !element.hidden )
							{
								element.setIcon( "./static/images/icons/checkbox.png" );
								//me.uncheckMultiIcon(element, mode);
							}
						}
					}
				}
			}
			//uncheck header for rowIcon
			for( var j = 0 ; j < me.servicesHeaderIds.length ; j++ )
			{
				if(me.servicesHeaderIds[ j ].startsWith(btn.moduleCode))
				{
					//header uncheck gif				
					headerId = Ext.getCmp( me.servicesHeaderIds[ j ] );
					allItems = headerId.items.items;
					for( var k = 0 ; k <allItems.length ; k++ )
					{	field  = allItems[k];
						featureId = field.itemId;
						if( featureId != null && featureId != undefined && featureId.endsWith(lIconType))
						{
							element = me.down( 'button[itemId=' + featureId + ']' );
							if( element != null && element != undefined && !element.hidden )
							{								
								element.setIcon( "./static/images/icons/checkbox.png" );
								//me.uncheckMultiIcon(element, mode);
							}
						}
					}
				}
			}
		}
	},

	changeHeaderIcon : function( btn, moduleCode, iconType )
	{
		if( pageMode === "EDIT" )
		{
			var me = this;
			var flag = true;
			var lIconType = iconType.toLowerCase()+"Icon";
			var serviceHeader = null;
			var allItems = null;
			var element = null;
			var field  = null;
			var featureId = null;
			var subHeaderId = null;

			if( btn.icon.match( 'checkbox.png' ) )
			{
				btn.setIcon( "./static/images/icons/checked_nont7.png" );
				flag = true;
				//me.checkMultiIcon(btn, iconType);
			}
			else
			{
				btn.setIcon( "./static/images/icons/checkbox.png" );
				flag = false;
				//me.uncheckMultiIcon(btn, iconType);
			}
			Ext.each( fieldJson, function( field, index )
			{
				featureId = field.itemId;
				element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
				if( element != null && element != undefined && !element.hidden )
				{
					if( moduleCode == field.moduleCode && iconType == element.mode )
					{
						for( var i = 0 ; i < accessTypeCodeMaskArrVar.length ; i++ )
						{
							innerArrCode = accessTypeCodeMaskArrVar[ i ].split( "|" );
							if( innerArrCode[ 0 ] == field.accessTypeCode && innerArrCode[ 1 ] == '1' )
							{
						element.setValue( flag );
						element.defVal = element.getValue();
					}
				}
					}
				}
			} );
			// changes for subheader check/uncheck
			serviceHeader = btn.itemId.substr(0,btn.itemId.indexOf( "HeaderOnBehalf_"));
			for( var j = 0 ; j < me.accessTypesHeaderIds.length ; j++ )
			{
				if(me.accessTypesHeaderIds[ j ].startsWith(serviceHeader))
				{
					subHeaderId = Ext.getCmp( me.accessTypesHeaderIds[ j ] );
					allItems = subHeaderId.items.items;
					for( var k = 0 ; k <allItems.length ; k++ )
					{
						field  = allItems[k];
						featureId = field.itemId;
						if( featureId != null && featureId != undefined && featureId.endsWith(lIconType))
						{
							element = me.down( 'button[itemId=' + featureId + ']' );
							if( element != null && element != undefined && !element.hidden )
							{
								if( flag )
								{
									element.setIcon( "./static/images/icons/checked_nont7.png" );
									//me.checkMultiIcon(element, iconType);
								}
								else
								{
									element.setIcon( "./static/images/icons/checkbox.png" );
									//me.uncheckMultiIcon(element, iconType);
								}
							}
						}
					}
				}
			}
		}
	},

	changeSubHeaderIcon : function( btn, moduleCode, accessTypeCode, iconType )
	{
		setDirtyBit();
		if( pageMode === "EDIT" )
		{
			var me = this;
			var flag = true;
			var lIconType = iconType.toLowerCase()+"Icon";
			var subHeaderCheckedViewCount = 0;
			var subHeaderTotalViewCount = 0;
			var allOtherSubHeaderCheckedCount = 0;
			var allSubHeaderCount = 0;
			var isAllOtherSubHeaderChecked = false;
			var accessTypeHeaderId = null;
			var servicesHeaderId = null;
			var allItems = null;
			var element = null;
			var field  = null;
			var featureId = null;
			if( btn.icon.match( 'checkbox.png' ) )
			{
				btn.setIcon( "./static/images/icons/checked_nont7.png" );
				flag = true;
				//me.checkMultiIcon(btn, iconType);
			}
			else
			{
				btn.setIcon( "./static/images/icons/checkbox.png" );
				flag = false;
				//me.uncheckMultiIcon(btn, iconType);
			}
			Ext.each( fieldJson, function( field, index )
			{
				featureId = field.itemId;
				element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
				if( element != null && element != undefined && !element.hidden )
				{
					if( moduleCode == field.moduleCode && accessTypeCode == field.accessTypeCode )
					{
						if( iconType == element.mode )
						{
							element.setValue( flag );
							element.defVal = element.getValue();
						}
					}
				}
			} );

			if( flag )
			{
				if( iconType == 'EDIT' || iconType == 'AUTH' )
				{
					Ext.each( fieldJson, function( field, index )
					{
						featureId = field.itemId;
						element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
						if( element != null && element != undefined && !element.hidden )
						{
							if( moduleCode == field.moduleCode && accessTypeCode == field.accessTypeCode )
							{
								if( 'VIEW' == element.mode )
								{
									subHeaderTotalViewCount++;
									//console.log(element.getValue());
									if( element.getValue() )
									{
										subHeaderCheckedViewCount++;
									}
								}
							}
						}
					} );
					if( subHeaderCheckedViewCount == subHeaderTotalViewCount )
					{
						me.checkMultiIcon( btn, iconType );
					}
				}
				
				// check for all other subheader check/uncheck within the header
				for( var j = 0 ; j < me.accessTypesHeaderIds.length ; j++ )
				{
					if( me.accessTypesHeaderIds[ j ].startsWith( moduleCode ) )
					{
						accessTypeHeaderId = Ext.getCmp( me.accessTypesHeaderIds[ j ] );
						allItems = accessTypeHeaderId.items.items;
						for( var k = 0 ; k < allItems.length ; k++ )
						{
							field  = allItems[k];
							featureId = field.itemId;
							if( featureId != null && featureId != undefined && featureId.endsWith( lIconType ) )
							{
								element = me.down( 'button[itemId=' + featureId + ']' );
								if( element != null && element != undefined && !element.hidden )
								{
									if( element.icon.match( 'checked_nont7.png' ) )
									{
										allOtherSubHeaderCheckedCount++;
									}
								}
							}
							
							if( iconType == 'EDIT' || iconType == 'AUTH' )
							{
								if( subHeaderCheckedViewCount == subHeaderTotalViewCount )
								{
									if( featureId != null && featureId != undefined && featureId.endsWith( "viewIcon" ) )
									{
									}
								}
							}							
						}
						allSubHeaderCount++;
					}
				}
				if( allSubHeaderCount != allOtherSubHeaderCheckedCount )
				{
					flag = false;
				}
			}
			
			// changes for header check/uncheck
			for( var j = 0 ; j < me.servicesHeaderIds.length ; j++ )
			{
				if( me.servicesHeaderIds[ j ].startsWith( moduleCode ) )
				{
					servicesHeaderId = Ext.getCmp( me.servicesHeaderIds[ j ] );
					allItems = servicesHeaderId.items.items;
					for( var k = 0 ; k <allItems.length ; k++ )
					{
						field  = allItems[k];
						featureId = field.itemId;
						if( featureId != null && featureId != undefined && featureId.endsWith( lIconType ) )
						{
							element = me.down( 'button[itemId=' + featureId + ']' );
							if( element != null && element != undefined && !element.hidden )
							{
								if( flag )
								{
									element.setIcon( "./static/images/icons/checked_nont7.png" );
									//me.checkMultiIcon(element, iconType);
								}
								else
								{
									element.setIcon( "./static/images/icons/checkbox.png" );
									//me.uncheckMultiIcon(element, iconType);
								}
							}
						}
					}
				}
			}
		}
	},

	saveItems : function( moduleCode, accessTypeCode, checkBoxValue )
	{
		var me = this;
		setDirtyBit();
		Ext.each( fieldJson, function( field, index )
		{
			var featureId = field.itemId;
			var element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
			if( element != null && element != undefined && !element.hidden )
			{
				//element.boxLabelCls =element.boxLabelCls+" newFieldValue";

				// if any service or access type is unchecked
				if( moduleCode == field.moduleCode || accessTypeCode == field.accessTypeCode )
				{
					if( !checkBoxValue )
					{
						element.setValue( false );
					}
				}
				else
				{
					element.defVal = element.getValue();
				}

				if( 'VIEW' == element.mode )
				{
					viewSerials[ field.rmSerial ] = element.getValue();
				}
				if( 'EDIT' == element.mode )
				{
					editSerials[ field.rmSerial ] = element.getValue();
				}
				if( 'AUTH' == element.mode )
				{
					authSerials[ field.rmSerial ] = element.getValue();
				}
			}
		} );
		if( !Ext.isEmpty( me.fnCallback ) && typeof me.fnCallback == 'function' )
		{
			me.fnCallback( viewSerials, authSerials, editSerials );
			me.close();
		}
	},

	checkMultiIcon: function( btn, iconType )
	{
		var me = this;
		var vfeatureId = null;
		var iconItemId = null;
		var lIconType = iconType.toLowerCase()+"Icon";
		if( iconType == 'EDIT' || iconType == 'AUTH' )
		{
			//viewIcon
			vfeatureId = btn.itemId.substr(0,btn.itemId.indexOf(lIconType)) +"viewIcon";
			iconItemId = me.down( 'button[itemId=' + vfeatureId + ']' );
			iconItemId.setIcon( "./static/images/icons/checked_nont7.png" );
		}
	},
	
	uncheckMultiIcon: function( btn, iconType )
	{
		var me = this;
		var vfeatureId = null;
		var iconItemId = null;
		var lIconType = iconType.toLowerCase()+"Icon";
		if( iconType == 'VIEW' )
		{
			//editIcon
			vfeatureId = btn.itemId.substr(0,btn.itemId.indexOf(lIconType)) +"editIcon";
			iconItemId = me.down( 'button[itemId=' + vfeatureId + ']' );
			iconItemId.setIcon( "./static/images/icons/checkbox.png" );
			//authIcon
			vfeatureId = btn.itemId.substr(0,btn.itemId.indexOf(lIconType)) +"authIcon";
			iconItemId = me.down( 'button[itemId=' + vfeatureId + ']' );
			iconItemId.setIcon( "./static/images/icons/checked_nont7.png" );
		}
	}
} );

function callInnerOnBehalfSaveItems( moduleCode, accessTypeCode, checkBoxValue )
{
	GCP.getApplication().fireEvent( 'callOnBehalfSaveItems', moduleCode, accessTypeCode, checkBoxValue );
}
