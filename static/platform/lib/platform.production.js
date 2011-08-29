(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p=Object.prototype.hasOwnProperty,q=function(a,b){function d(){this.constructor=a}for(var c in b)p.call(b,c)&&(a[c]=b[c]);d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype;return a},r=function(a,b){return function(){return a.apply(b,arguments)}};e=function(){function a(){a.__super__.constructor.apply(this,arguments)}q(a,Backbone.Router),a.prototype.routes={contact:"displayContact",news:"displayNews",activities:"displayActivities",profile:"displayProfile",notes:"displayNotes"},a.prototype.displayContact=function(){return this.view.onContactClicked()},a.prototype.displayNews=function(){return this.view.onNewsClicked()},a.prototype.displayProfile=function(){return this.view.onProfileClicked()},a.prototype.displayActivities=function(){return this.view.onActivitiesClicked()},a.prototype.displayNotes=function(){return this.view.onNotesClicked()},a.prototype.registerView=function(a){return this.view=a};return a}(),f=function(){function a(b){this.controller=b,b.registerView(this),a.__super__.constructor.apply(this,arguments)}q(a,Backbone.View),a.prototype.el=$("body"),a.prototype.events={"click #news-a":"onNewsClicked","click #profile-a":"onProfileClicked","click #contact-a":"onContactClicked","click #activities-a":"onActivitiesClicked","click #notes-a":"onNotesClicked"},a.prototype.initialize=function(){_.bindAll(this,"onNewsClicked","onProfileClicked","switchTo","onContactClicked","onActivitiesClicked","onLogoutClicked"),$("#news").length!==0?this.lastPage="#news":$("#contact").length!==0?this.lastPage="#contact":$("#activities").length!==0?this.lastPage="#activities":$("#notes").length!==0?this.lastPage="#notes":this.lastPage="#profile",$("#platform-user-text-field").val(null);return $("#platform-user-text-field").focus()},a.prototype.onNewsClicked=function(a){a&&a.preventDefault(),document.title="Newebe | News",this.switchTo("#news","/news/content/");return!1},a.prototype.onProfileClicked=function(a){a&&a.preventDefault(),document.title="Newebe | Profile",this.switchTo("#profile","/profile/content/");return!1},a.prototype.onContactClicked=function(a){a&&a.preventDefault(),document.title="Newebe | Contact",this.switchTo("#contact","/contact/content/");return!1},a.prototype.onActivitiesClicked=function(a){a&&a.preventDefault(),document.title="Newebe | Activities",this.switchTo("#activities","/activities/content/");return!1},a.prototype.onNotesClicked=function(a){a&&a.preventDefault(),document.title="Newebe | Notes",this.switchTo("#notes","/notes/content/");return!1},a.prototype.switchTo=function(a,b){$(this.lastPage+"-a").removeClass("disabled"),$(a+"-a").addClass("disabled"),this.controller.navigate(a),this.lastPage!==a&&$(this.lastPage).fadeOut(this.onLastPageFadeOut(a,b));return this.lastPage},a.prototype.onLastPageFadeOut=function(a,b){$(this.lastPage).hide(),this.lastPage=a,$(a).length===0?$.get(b,function(b){$("#apps").prepend(b);return $(a).fadeIn()}):$(a).fadeIn();return!1};return a}(),h=function(){function a(){a.__super__.constructor.apply(this,arguments)}q(a,Backbone.View),a.prototype.el=$("body"),a.prototype.initialize=function(){_.bindAll(this,"onUserFieldKeyUp"),this.isPosting=!1,$("#platform-user-text-field").val(null),$("#platform-user-text-field").focus();return $("#platform-user-text-field").keyup(this.onUserFieldKeyUp)},a.prototype.onUserFieldKeyUp=function(a){var b,c;if(a.keyCode===13&&!this.isPosting){b='{ "name":"'+$("#platform-user-text-field").val()+'"}',this.isPosting=!0,c="/register/";return $.post(c,b,function(a){return $("#register").fadeOut(1600,function(){$("body").hide();return $.get("/register/password/content/",function(a){var b;$("body").prepend(a),$("#menu").hide(),$("#apps").hide(),$("body").show(),$("#menu").fadeIn(),$("#apps").fadeIn();return b=new g})})},"json")}};return a}(),g=function(){function a(){a.__super__.constructor.apply(this,arguments)}q(a,Backbone.View),a.prototype.el=$("body"),a.prototype.initialize=function(){_.bindAll(this,"onUserFieldKeyUp"),this.isPosting=!1,$("#platform-password-text-field").val(null),$("#platform-password-text-field").focus();return $("#platform-password-text-field").keyup(this.onUserFieldKeyUp)},a.prototype.onUserFieldKeyUp=function(a){var b,c;if(a.keyCode===13&&!this.isPosting){b='{ "password":"'+$("#platform-password-text-field").val()+'"}',this.isPosting=!0,c="/register/password/";return $.post(c,b,function(a){return $("#register").fadeOut(1600,function(){$("body").hide();return $.get("/profile/menu-content/",function(a){$("body").prepend(a),$("#menu").hide(),$("#apps").hide(),$("body").show(),$("#menu").fadeIn();return $("#apps").fadeIn()})})},"json")}};return a}(),d=function(){function a(){a.__super__.constructor.apply(this,arguments)}q(a,Backbone.View),a.prototype.el=$("body"),a.prototype.initialize=function(){_.bindAll(this,"onPasswordFieldKeyUp"),this.isPosting=!1,$("#login-password-text-field").val(null),$("#login-password-text-field").focus();return $("#login-password-text-field").keyup(this.onPasswordFieldKeyUp)},a.prototype.onPasswordFieldKeyUp=function(a){var b,c;if(a.keyCode===13&&!this.isPosting){this.isPosting=!0,c="/login/json/",b='{ "password":"'+$("#login-password-text-field").val()+'"}';return $.ajax({type:"POST",url:c,data:b,datatype:"json",success:r(function(a){return $("#login-form").fadeOut(1600,r(function(){$("body").hide();return $.get("/profile/menu-content/",r(function(a){$("body").prepend(a),$("#menu").hide(),$("#apps").hide(),$("body").show(),$("#menu").fadeIn(),$("#apps").fadeIn();return this.isPosting=!1},this))},this))},this),error:r(function(){$("#login-password-text-field").val(null);return this.isPosting=!1},this)})}};return a}(),b=function(){function a(){var a;$("#info-dialog").length===0&&(a=document.createElement("div"),a.id="info-dialog",a.className="dialog",a.innerHTML="Test",$("body").prepend(a)),this.element=$("#info-dialog"),this.element.hide()}a.prototype.display=function(a){this.element.empty(),this.element.append(a),this.element.show();return this.element.fadeOut(4e3)};return a}(),a=function(){function a(a){var b;$("#confirmation-dialog").length===0&&(b=document.createElement("div"),b.id="confirmation-dialog",b.className="dialog",b.innerHTML='<div id="confirmation-text"></div>',b.innerHTML+='<div id="confirmation-buttons"><span href="" id="confirmation-yes">Yes</span><span href="" id="confirmation-no">No</span></div>',$("body").prepend(b)),this.element=$("#confirmation-dialog"),this.element.hide(),this.setNoButton()}a.prototype.setNoButton=function(){var a;a=this.element;return $("#confirmation-no").click(function(){a.fadeOut();return!1})},a.prototype.display=function(a,b){$("#confirmation-text").empty(),$("#confirmation-text").append("<span>"+a+"</span>"),$("#confirmation-yes").click(b);return this.element.show()},a.prototype.hide=function(){return this.element.fadeOut()};return a}(),c=function(){function a(){var a;$("#loading-indicator").length===0&&(a=document.createElement("div"),a.id="loading-indicator",a.innerHTML='<img src="/static/images/clock_32.png" />',$("body").prepend(a)),this.element=$("#loading-indicator"),this.element.hide()}a.prototype.display=function(){return this.element.show()},a.prototype.hide=function(){return this.element.hide()};return a}(),i=new b,l=new e,m=new f(l),j=new c,o=new h,n=new g,k=new d,Backbone.history.start()}).call(this)