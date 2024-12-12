/**
 * @summary     Navigation
 * @description create navigation as per UI/UX guidline
 * @version     1.0
 * @file        navigation.js
 * @author      Nishant Choudhary
 * @copyright   Copyright 2020 Finastra.
 */
 (function($){
	 
	 jQuery.fn.extend({
		fcmNav: function(_objParam){
			if(!_objParam.data)
			{
				console.log('Navigation not found');
				return;
			}
		    $('#sideMenuDrawer').click(function(){
		         $('#side-menu').toggle();
		         $('body').append('<div class="modal-backdrop show"></div>');
		         $('.modal-backdrop').click(function(e){
			            if($('#side-menu').is(':visible')) {
			              $('#side-menu').toggle();
			              $('body').find('.modal-backdrop').remove();
			             }

		             });
		    });
			SideNav(this, _objParam);
		}
	});
	
	var SideNav = function(_objNavSection, _objParam){
		
		let navId;		
		let icons = {}
		
		let defaultConfig = {
			sortable	: true
		}
		
		construct = function(){
			navId	: 'sidenavDrawer';			
			createNav();			
			if(defaultConfig.sortable) setSortable();
		}
		
		setSortable = function(){
			$( ".section-sortable" ).sortable(
				{connectWith: ".section-sortable"}
			 ).disableSelection();
		}
		
		createNav = function(){
            let hashMenu = window.location.href.split('#');
            if(hashMenu.length == 2 && hashMenu[1] != 'home' && hashMenu[1] != '')
			{
				changeNavLavels('subitem', hashMenu[1]);
			}	
            else
			{
				changeNavLavels('parent');
			}		
			
		}
		
		changeNavLavels = function(lavel, group){
			$(_objNavSection).empty();
			$(_objNavSection).append(createheader().outerHTML);
			
			$('#collapse-sideMenu-btn').click(function(e){
	            if($('#side-menu').is(':visible')) {
	              $('body').find('.modal-backdrop').remove();
	              $('#side-menu').toggle();
	             }
             });		
			if(lavel == 'parent')
			{
				
				$(_objNavSection).append(createParentNavItem().outerHTML);
				$('.sidenav-parent-item').unbind('click');
				$('.sidenav-parent-item').click(function(){
					changeNavLavels('subitem',$(this).attr('group'));					
				});				
			}
			else
			{
				$(_objNavSection).append(createSubNavItem(group).outerHTML);
				$('#sideMenuShowParent').unbind('click');
				$('#sideMenuShowParent').click(function(){
					changeNavLavels('parent');
				});
			}
            $("#side-menu a[data-toggle='collapse']").click(function(){ 
		        $(this).parent().find('ul').each(function(){
					if($(this).hasClass('collapse') && !$(this).hasClass('show')){
						$(this).addClass('show')} 
					else {
						$(this).removeClass('show')}
				})
			});	
			$(_objNavSection).append(createfooter().outerHTML);
		}
				
		createheader = function(){
			let logo = document.createElement('div');
				logo.className = 'uxg-logo';
				logo.setAttribute('large', '');

            let collapseBtn= document.createElement('button');
			    collapseBtn.setAttribute('id', 'collapse-sideMenu-btn');
				collapseBtn.className = 'btn bmd-btn-fab';
				collapseBtn.innerHTML = '<i class="material-icons">menu</i>';
						
			let header = document.createElement('header');
				header.appendChild(collapseBtn);	
				header.appendChild(logo);
				
			return 	header;
		}
		
		createParentNavItem = function(){
			
			//default nevigation
			let homeLink = document.createElement('a');
				homeLink.setAttribute('href', './showWelcome2.form');
				homeLink.innerHTML = '<span class="nav-item-border"></span> <i class="material-icons">home</i>' + getDashLabel('sidenav.home','Home');
				
			let homeNav = document.createElement('li');
				homeNav.className = 'uxg-list-item-selected';
				homeNav.appendChild(homeLink);
				
			let navList = document.createElement('ul');
				navList.id = 'parentSidenavMenu';
				navList.className = 'list-unstyled uxg-nav-list';				
				navList.appendChild(homeNav);
				
			var navJson = jQuery.parseJSON(_objParam.data);	
			$(navJson.menu).each(function(index, item){
				let group_id = item.group_id;
				let group_ele_id = item.group_id.replace(/\s+/g, '-');
				let stLevelNav;
				let ndNavList;		
				let parentNavItem = group_id.charAt(0).toLowerCase() + group_id.substring(1) ;
					parentNavItem = parentNavItem.replace(/\s+/g, "");
				//First level
				let stLevelLink = document.createElement('a');
				stLevelLink.className = 'dropdown-toggle sidenav-parent-item';	
				stLevelLink.setAttribute('group', item.group_id);				
				stLevelLink.setAttribute('data-toggle', 'collapse');
				stLevelLink.setAttribute('aria-expanded', false);
				stLevelLink.innerHTML = '<span class="nav-item-border"></span> '+getModuleIcon(group_id)  + group_id;
				
				if(!$(navList).find('#navGrp-'+group_ele_id).length)
				{
					stLevelNav = document.createElement('li');
					stLevelNav.id = 'navGrp-'+group_ele_id;
					stLevelNav.className = 'nav-grp-'+group_ele_id;
					stLevelNav.appendChild(stLevelLink);
				}
				else
				{
					stLevelNav = $(navList).find('#navGrp-'+group_ele_id)[0];
				}
				navList.appendChild(stLevelNav); 
			});	
			return navList;
		}
		
		createSubNavItem = function(activeGroup){	
			
			let activeGroupItem = activeGroup.charAt(0).toLowerCase() + activeGroup.substring(1) ;
				activeGroupItem = activeGroupItem.replace(/\s+/g,"");
					
			let navSubItems = document.createElement('div');
			
			let navBreadcrumbs = document.createElement('div');
			let navBreadcrumbsItem = '<ul class="breadcrumb uxg-breadcrumb uxg-breadcrumb-responsive ml-4">';
				navBreadcrumbsItem += '<li class="breadcrumb-item"><a id="sideMenuShowParent" href="#home" title="'+getDashLabel('sidenav.all','All')+'">'+getDashLabel('sidenav.all','All')+'</a></li>';
				navBreadcrumbsItem += '<li class="breadcrumb-item active" aria-current="page">' + activeGroup + '</li>';
				navBreadcrumbsItem += '</ul>';
				
				navBreadcrumbs.innerHTML = navBreadcrumbsItem;
			    
			let navList = document.createElement('ul');
				navList.id = 'subSidenavMenu';
				navList.className = 'list-unstyled uxg-nav-list';
				
			var navJson = jQuery.parseJSON(_objParam.data);	
			$(navJson.menu).each(function(index, item){
				if(item.group_id == activeGroup)
				{
					let group_id = item.name;
					let group_ele_id = item.name.replace(/\s+/g, '-');
					group_ele_id = (item.name == activeGroup) ? group_ele_id+'_1' : group_ele_id;
					let stLevelNav;
					let ndNavList;		
					let SubNavItem = item.name.charAt(0).toLowerCase() + item.name.substring(1) ;
					    SubNavItem = SubNavItem.replace(/\s+/g, '');
					//First level
					let stLevelLink = document.createElement('a');	
					if(item.group_id == 'Portal')
					{
					  stLevelLink.setAttribute('href', item.description == 0 ? '#' : 'javascript:portalChildWindow("'+item.description+'")');
					}
					else
					{
					  stLevelLink.setAttribute('href', item.description == 0 ? '#' : 'javascript:submitAction("'+item.description+'")');
					}					

					if(item.submenus){
					  stLevelLink.className = 'dropdown-toggle';					
					  stLevelLink.setAttribute('data-toggle', 'collapse');
					  stLevelLink.setAttribute('aria-expanded', false);	
					}
					 
					stLevelLink.innerHTML = '<span class="nav-item-border"></span> '+getModuleIcon(group_id)  + item.name;
					
					if(!$(navList).find('#navGrp-'+group_ele_id).length)
					{
						stLevelNav = document.createElement('li');
						stLevelNav.id = 'navGrp-'+group_ele_id;
						stLevelNav.className = 'nav-grp-'+group_ele_id;
						stLevelNav.appendChild(stLevelLink);
					}
					else
					{
						stLevelNav = $(navList).find('#navGrp-'+group_ele_id)[0];
					}
					
					if(item.submenus)
					{
						$(item.submenus).each(function(subindex, subitem){
							//second level
							let mySubItem = subitem.name.charAt(0).toLowerCase() + subitem.name.substring(1);
								mySubItem = mySubItem.replace(/\s+/g, '');
							let ndLevelLink = document.createElement('a');
							if(subitem.group_id == 'Portal')
							{
							  ndLevelLink.setAttribute('href', subitem.description == 0 ? '#' : 'javascript:portalChildWindow("'+subitem.description+'")');
							}
							else
							{
							  ndLevelLink.setAttribute('href', subitem.description == 0 ? '#' : 'javascript:submitAction("'+subitem.description+'")');
							}
							ndLevelLink.innerHTML = subitem.name;
							
							let ndLevelNav = document.createElement('li');
							ndLevelNav.appendChild(ndLevelLink);
							
							if(!$(navList).find('#navGrpSub-'+group_ele_id).length)
							{
								ndNavList = document.createElement('ul');
								ndNavList.id = 'navGrpSub-'+group_ele_id;
								ndNavList.className = 'collapse list-unstyled';	
							}
							else
							{
								ndNavList = $(navList).find('#navGrpSub-'+group_ele_id)[0];
							}
							ndNavList.appendChild(ndLevelNav);
							
							stLevelNav.appendChild(ndNavList);	
						});	
					}									
					navList.appendChild(stLevelNav);
				}										
			});
			navSubItems.appendChild(navBreadcrumbs);
			navSubItems.appendChild(navList);
			return navSubItems;
		}
		
		createfooter = function(){
			let settingsI = document.createElement('i');
				settingsI.className = 'material-icons';
				settingsI.innerText = 'settings';
				
			let	settingsA = document.createElement('a');
				settingsA.title = 'Settings';
				settingsA.setAttribute('onclick','handlePageSettingClick()');	
				settingsA.appendChild(settingsI);
				settingsA.appendChild(settingsI);
				settingsA.appendChild(document.createTextNode("Settings"));
				//settingsA.innerText = 'Settings';
				
			let	SettingsNav = document.createElement('div');
				SettingsNav.id =  'pageSettingAnchor1';
				
				if(typeof doHandlePageSettingClick != 'undefined'){
					
					SettingsNav.appendChild(settingsA);
				}
				
			let footer = document.createElement('footer');
				footer.appendChild(SettingsNav);
				
				return	footer			
		}

		getModuleIcon = function(module){
		   let iconValue = icons.module;
		   switch (module){
  			case 'Payments':
    				iconValue = icons.payments;
    				break;
  			case 'Accounts':
    				iconValue = icons.accounts;
    				break;
			case 'Messages':
    				iconValue = icons.messages;
    				break;
			case 'Reports':
    				iconValue = icons.reports;
    				break;
			case 'Security':
    				iconValue = icons.security;
    				break;
		   }
		   if(!iconValue) iconValue = '<i class="material-icons">dashboard</i>';
		   return iconValue;
		}
		
		
		construct();
	}
	
 })(jQuery);
 
 var submitAction = function(url){
	 var form = $('<form></form>');

    form.attr("method", "POST");
    form.attr("action", url);

    var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", csrfTokenName);
	field.attr("value", csrfTokenValue);

	form.append(field);
	
    $(document.body).append(form);
    form.submit();
 }
 
 var portalChildWindow = function(url){
	 var myWindow = window.open(url, "myWindow", "width=700,height=500");
 }
 
$(document).ready(function() {
	if(window._strMenuData !== undefined){
		$('#side-menu').fcmNav({'data' : window._strMenuData});
	} 
});

 var handlePageSettingClick = function(){
	if(typeof doHandlePageSettingClick != 'undefined')
	{
		doHandlePageSettingClick();
	}
}