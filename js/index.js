angular.module('navbarTest',['ngSanitize'])

.controller('navbarDirectiveTestCtrl',function($scope){
  //=== Variables ===//
  
  $scope.affixed = 'top';
  $scope.search = {
    show : true,
    terms : ''
  };
  $scope.brand = "<span class='glyphicon glyphicon-user'></span> Brand";
  $scope.inverse = true;
  $scope.menus = [
    {
      title : "Dropdown Menu",
      menu : [
        {
          title : "Menu Item One",
          action : "item.one"
        },
        {
          title : "Menu Item Two",
          action : "item.two"
        },
        {
          divider: true
        },
        {
          title : "Menu Item Three",
          action : "item.three"
        }
      ]
    },
    {
      title : "Singular Menu Item",
      action : "singular"
    }
  ]; // end menus
  
  $scope.item = '';
  $scope.styling = 'Inverse';
  $scope.searchDisplay = 'Visible';
  
  $scope.searchfn = function(){
    alert('Attempting search on: "' + $scope.search.terms + '"');
  }; // searchfn
  
  $scope.navfn = function(action){
    switch(action){
      case 'item.one':
        $scope.item = 'Item one selected.';
        break;
      case 'item.two':
        $scope.item = 'Item two selected.';
        break;
      case 'item.three':
        $scope.item = 'Item three selected.';
        break;
      case 'singular':
        $scope.item = 'Singular link item selected.';
        break;
      default:
        $scope.item = 'Default selection.';
        break;
    }; // end switch
  }; // end navfn
  
  $scope.toggleStyling = function(){
    $scope.inverse = !$scope.inverse;
    if(angular.equals($scope.inverse,true))
      $scope.styling = 'Inverse';
    else
      $scope.styling = 'Default';
  }; // end toggleStyling
  
  $scope.toggleSearchForm = function(){
    $scope.search.show = !$scope.search.show;
    if(angular.equals($scope.search.show,true))
      $scope.searchDisplay = 'Visible';
    else
      $scope.searchDisplay = 'Hidden';
  }; // end toggleSearchForm
  
  $scope.addMenu = function(){
    $scope.menus.push({
        title : "Added On The Fly!",
        action : "default"
    });
  }; // end test
  
  $scope.toggleAffixed = function(){
    switch($scope.affixed){
      case 'top':
        $scope.affixed = 'bottom';
        break;
      case 'bottom':
        $scope.affixed = 'none';
        break;
      case 'none':
        $scope.affixed = 'top';
        break;
    };
  }; // end toggleAffixed
}) // end navbarDirectiveTestCtrl

/**
 * Angled Navbar Directive
 *
 * @requires: ngSanitize, Bootstrap 3 (jQuery & Bootstrap's JS - responseive features require the inclusion of the Bootstrap JS)
 **/
.directive('angledNavbar',function(){
  return {
    restrict : 'AE',
    scope : {
      brand : '=',
      menus : '=',
      affixed : '=',
      search : '=',
      searchfn : '&',
      navfn : '&',
      inverse : '='
    },
    templateUrl : 'tmpls/nav/navbar.html',
    controller : function($scope,$element,$attrs){
      //=== Scope/Attributes Defaults ===//
      
      $scope.defaults = {
        brand : '<span class="glyphicon glyphicon-certificate"></span>',
        menus : [],
        search : {
          show : false
        }
      }; // end defaults
      
      // if no parent function was passed to directive for navfn, then create one to emit an event
      if(angular.isUndefined($attrs.navfn)){
        $scope.navfn = function(action){
          if(angular.isObject(action))
            $scope.$emit('nav.menu',action);  
          else
            $scope.$emit('nav.menu',{'action' : action});
        }; // end navfn
      }
      
      // if no parent function was passed to directive for searchfn, then create one to emit a search event
      if(angular.isUndefined($attrs.searchfn)){
        $scope.searchfn = function(){
          $scope.$emit('nav.search.execute');
        }; // end searchfn
      }
      
      //=== Observers & Listeners ===//
      
      $scope.$watch('affixed',function(val,old){
        var b = angular.element('body');
        // affixed top
        if(angular.equals(val,'top') && !b.hasClass('navbar-affixed-top')){
          if(b.hasClass('navbar-affixed-bottom'))
            b.removeClass('navbar-affixed-bottom');
          b.addClass('navbar-affixed-top');
        //affixed bottom
        }else if(angular.equals(val,'bottom') && !b.hasClass('navbar-affixed-bottom')){
          if(b.hasClass('navbar-affixed-top'))
            b.removeClass('navbar-affixed-top');
          b.addClass('navbar-affixed-bottom');
        // not affixed
        }else{
          if(b.hasClass('navbar-affixed-top'))
            b.removeClass('navbar-affixed-top');
          if(b.hasClass('navbar-affixed-bottom'))
            b.removeClass('navbar-affixed-bottom');
        }
      }); // end watch(affixed)
      
      //=== Methods ===//
      
      $scope.noop = function(){
        angular.noop();
      }; // end noop
      
      $scope.navAction = function(action){
        $scope.navfn({'action' : action});
      }; // end navAction
      
      /**
       * Have Branding
       * Checks to see if the "brand" attribute was passed, if not use the default
       * @result  string
       */
      $scope.haveBranding = function(){
        return (angular.isDefined($attrs.brand)) ? $scope.brand : $scope.defaults.brand;
      }; 
      
      /**
       * Has Menus
       * Checks to see if there were menus passed in for the navbar.
       * @result  boolean
       */
      $scope.hasMenus = function(){
        return (angular.isDefined($attrs.menus));
      };
      
      /**
       * Has Dropdown Menu
       * Check to see if navbar item should have a dropdown menu
       * @param  object  menu
       * @result  boolean
       */
      $scope.hasDropdownMenu = function(menu){
        return (angular.isDefined(menu.menu) && angular.isArray(menu.menu));
      }; // end hasDropdownMenu
      
      /**
       * Is Divider
       * Check to see if dropdown menu item is to be a menu divider.
       * @param  object  item
       * @result  boolean
       */
      $scope.isDivider = function(item){
        return (angular.isDefined(item.divider) && angular.equals(item.divider,true));
      }; // end isDivider
    }
  };
}) // end navbar

.run(function($templateCache){
  $templateCache.put('tmpls/nav/navbar.html','<nav class="navbar" ng-class="{\'navbar-inverse\': inverse,\'navbar-default\': !inverse,\'navbar-fixed-top\': affixed == \'top\',\'navbar-fixed-bottom\': affixed == \'bottom\'}" role="navigation"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu"><span class="sr-only">Toggle Navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" ng-click="noop()" ng-bind-html="haveBranding()"></a></div><div class="collapse navbar-collapse" id="navbar-menu"><ul class="nav navbar-nav" ng-if="hasMenus()"><li ng-repeat="menu in menus" ng-class="{true: \'dropdown\'}[hasDropdownMenu(menu)]"><a ng-if="!hasDropdownMenu(menu)" ng-click="navAction(menu.action)">{{menu.title}}</a><a ng-if="hasDropdownMenu(menu)" class="dropdown-toggle" data-toggle="dropdown">{{menu.title}} <b class="caret"></b></a><ul ng-if="hasDropdownMenu(menu)" class="dropdown-menu"><li ng-repeat="item in menu.menu" ng-class="{true: \'divider\'}[isDivider(item)]"><a ng-if="!isDivider(item)" ng-click="navAction(item.action)">{{item.title}}</a></li></ul></li></ul><form ng-if="search.show" class="navbar-form navbar-right" role="search"><div class="form-group"><input type="text" class="form-control" placeholder="Search" ng-model="search.terms"><button class="btn btn-default" type="button" ng-click="searchfn()"><span class="glyphicon glyphicon-search"></span></button></div></form></div></div></nav>');
});