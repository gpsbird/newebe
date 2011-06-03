(function() {
  var ActivitiesView, Activity, ActivityCollection, ActivityRow, ConfirmationDialog, InfoDialog, LoadingIndicator, activitiesApp, confirmationDialog, loadingIndicator;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  InfoDialog = (function() {
    function InfoDialog() {
      var div;
      div = document.createElement('div');
      div.id = "info-dialog";
      div.className = "dialog";
      div.innerHTML = "Test";
      $("body").prepend(div);
      this.element = $("#info-dialog");
      this.element.hide();
    }
    InfoDialog.prototype.display = function(text) {
      this.element.empty();
      this.element.append(text);
      this.element.show();
      return this.element.fadeOut(4000);
    };
    return InfoDialog;
  })();
  ConfirmationDialog = (function() {
    function ConfirmationDialog(callback) {
      var div;
      div = document.createElement('div');
      div.id = "confirmation-dialog";
      div.className = "dialog";
      div.innerHTML = '<div id="confirmation-text"></div>';
      div.innerHTML += '<div id="confirmation-buttons">' + '<span href="" id="confirmation-yes">Yes</span>' + '<span href="" id="confirmation-no">No</span>' + '</div>';
      $("body").prepend(div);
      this.element = $("#confirmation-dialog");
      this.element.hide();
      this.setNoButton();
    }
    ConfirmationDialog.prototype.setNoButton = function() {
      var divElement;
      divElement = this.element;
      return $("#confirmation-no").click(function() {
        divElement.fadeOut();
        return false;
      });
    };
    ConfirmationDialog.prototype.display = function(text, callback) {
      $("#confirmation-text").empty();
      $("#confirmation-text").append('<span>' + text + '</span>');
      $("#confirmation-yes").click(callback);
      return this.element.show();
    };
    ConfirmationDialog.prototype.hide = function() {
      return this.element.fadeOut();
    };
    return ConfirmationDialog;
  })();
  LoadingIndicator = (function() {
    function LoadingIndicator() {
      var div;
      div = document.createElement('div');
      div.id = "loading-indicator";
      div.innerHTML = '<img src="/static/images/clock_32.png" />';
      $("body").prepend(div);
      this.element = $("#loading-indicator");
      this.element.hide();
    }
    LoadingIndicator.prototype.display = function() {
      return this.element.show();
    };
    LoadingIndicator.prototype.hide = function() {
      return this.element.hide();
    };
    return LoadingIndicator;
  })();
  Activity = (function() {
    __extends(Activity, Backbone.Model);
    Activity.prototype.url = '/activities/all/';
    function Activity(activity) {
      var activityDate, urlDate;
      Activity.__super__.constructor.apply(this, arguments);
      this.set('author', activity.author);
      this.set('authorKey', activity.authorKey);
      this.set('date', activity.date);
      this.set('docId', activity.docId);
      this.set('verb', activity.verb);
      this.set('docType', activity.docType);
      this.set('method', activity.method);
      this.set('errors', activity.errors);
      this.setDisplayDate();
      this.id = activity._id;
      if (activity.date) {
        activityDate = Date.parseExact(activity.date, "yyyy-MM-ddTHH:mm:ssZ");
        urlDate = activityDate.toString("yyyy-MM-dd-HH-mm-ss/");
        this.attributes['urlDate'] = urlDate;
      }
      this.attributes['errorNumber'] = "";
      if (activity.errors.length) {
        this.attributes['errorNumber'] = "(" + activity.errors.length + ")";
      }
    }
    /* Getters / Setters */
    Activity.prototype.getDisplayDate = function() {
      return this.attributes['displayDate'];
    };
    Activity.prototype.setDisplayDate = function() {
      var dateToSet;
      dateToSet = this.attributes["date"];
      return this.setDisplayDateFromDbDate(dateToSet);
    };
    Activity.prototype.setDisplayDateFromDbDate = function(date) {
      var postDate, stringDate;
      postDate = Date.parseExact(date, "yyyy-MM-ddTHH:mm:ssZ");
      stringDate = postDate.toString("dd MMM yyyy, HH:mm");
      this.attributes['displayDate'] = stringDate;
      return postDate;
    };
    Activity.prototype.getAuthor = function() {
      return this.get('author');
    };
    Activity.prototype.getDate = function() {
      return this.get('date');
    };
    Activity.prototype.getUrlDate = function() {
      return this.attributes['urlDate'];
    };
    Activity.prototype.getDocType = function() {
      return this.attributes['docType'];
    };
    Activity.prototype.getDocId = function() {
      return this.get('docId');
    };
    Activity.prototype.getAuthorKey = function() {
      return this.get('authorKey');
    };
    return Activity;
  })();
  ActivityCollection = (function() {
    function ActivityCollection() {
      ActivityCollection.__super__.constructor.apply(this, arguments);
    }
    __extends(ActivityCollection, Backbone.Collection);
    ActivityCollection.prototype.model = Activity;
    ActivityCollection.prototype.url = '/activities/all/';
    ActivityCollection.prototype.comparator = function(activity) {
      return activity.getDate();
    };
    ActivityCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return ActivityCollection;
  })();
  ActivityRow = (function() {
    __extends(ActivityRow, Backbone.View);
    ActivityRow.prototype.tagName = "div";
    ActivityRow.prototype.className = "activity-row";
    ActivityRow.prototype.template = _.template('<span class="activity-date">\n <%= displayDate %> -\n</span>\n<a href="#" class="activity-author"><%= author %></a>\n<span class="activity-verb"><%= verb %></span>\na\n<a href="#" class="doc-ref">\n<span class="activity-verb"><%= docType %></span>\n</a>\n<span class="activity-error-number">\n<%= errorNumber %>\n</span>\n<div class="activity-errors">\nErrors :\n<% _.each(errors, function(error) { %>\n  <div class="activity-error">\n    <%= error.contactUrl %> -> \n    <span id="error.contactKey">resend</span>\n</div>\n<% }); %>\n</div>');
    /* Events */
    ActivityRow.prototype.events = {
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut",
      "click .doc-ref": "onDocRefClicked",
      "click .activity-author": "onActivityAuthorClicked",
      "click .activity-error-number": "onErrorNumberClicked"
    };
    function ActivityRow(model) {
      this.model = model;
      ActivityRow.__super__.constructor.apply(this, arguments);
      this.id = this.model.id;
      this.model.view = this;
    }
    /* Listeners */
    ActivityRow.prototype.onMouseOver = function() {
      return this;
    };
    ActivityRow.prototype.onMouseOut = function() {
      return this;
    };
    ActivityRow.prototype.onDocRefClicked = function(event) {
      if (this.model.getDocType() === "micropost") {
        $.get("/news/microposts/" + this.model.getDocId() + "/html/", function(data) {
          return $("#activities-preview").html(data);
        });
      }
      event.preventDefault();
      return false;
    };
    ActivityRow.prototype.onActivityAuthorClicked = function(event) {
      $.get("/contacts/render/" + this.model.getAuthorKey() + "/", function(data) {
        return $("#activities-preview").html(data);
      });
      event.preventDefault();
      return false;
    };
    ActivityRow.prototype.onErrorNumberClicked = function(event) {
      return $(this.id + ".activity-errors").show();
    };
    /* Functions */
    ActivityRow.prototype.render = function() {
      if (!this.model.getDisplayDate()) {
        this.model.setDisplayDate();
      }
      $(this.el).html(this.template(this.model.toJSON()));
      return this.el;
    };
    return ActivityRow;
  })();
  ActivitiesView = (function() {
    __extends(ActivitiesView, Backbone.View);
    ActivitiesView.prototype.el = $("#activities");
    /* Events */
    ActivitiesView.prototype.events = {
      "click #activities-my-button": "onMineClicked",
      "click #activities-all-button": "onAllClicked",
      "click #activities-more": "onMoreActivitiesClicked"
    };
    function ActivitiesView() {
      ActivitiesView.__super__.constructor.apply(this, arguments);
    }
    ActivitiesView.prototype.initialize = function() {
      _.bindAll(this, 'appendOne', 'prependOne', 'addAll');
      _.bindAll(this, 'displayMyActivities', 'onMoreActivtiesClicked', 'addAllMore');
      _.bindAll(this, 'onDatePicked');
      this.tutorialOn = true;
      this.activities = new ActivityCollection;
      this.activities.bind('add', this.prependOne);
      this.activities.bind('refresh', this.addAll);
      this.moreActivities = new ActivityCollection;
      this.moreActivities.bind('refresh', this.addAllMore);
      return this.currentPath = '/activities/all/';
    };
    /* Listeners  */
    ActivitiesView.prototype.onMineClicked = function(event) {
      $("#activities-my-button").button("disable");
      $("#activities-all-button").button("enable");
      this.clearActivities(null);
      $("#activities-from-datepicker").val(null);
      this.currentPath = '/activities/mine/';
      this.reloadActivities(null);
      return event;
    };
    ActivitiesView.prototype.onAllClicked = function(event) {
      $("#activities-all-button").button("disable");
      $("#activities-my-button").button("enable");
      this.clearActivities(null);
      $("#activities-from-datepicker").val(null);
      this.currentPath = '/activities/all/';
      this.reloadActivities(null);
      return event;
    };
    ActivitiesView.prototype.onDatePicked = function(dateText, event) {
      var d, sinceDate;
      d = Date.parse(dateText);
      sinceDate = d.toString("yyyy-MM-dd");
      this.clearActivities();
      return this.reloadActivities(sinceDate);
    };
    /* Functions  */
    ActivitiesView.prototype.clearActivities = function() {
      $("#activity-list").empty();
      return $("#activities-more").show();
    };
    ActivitiesView.prototype.addAllMore = function() {
      var activitiesArray;
      activitiesArray = this.moreActivities.toArray().reverse();
      activitiesArray = _.rest(activitiesArray);
      _.each(activitiesArray, this.appendOne);
      this.lastDate = this.moreActivities.last().getUrlDate();
      if (activitiesArray.length < 30) {
        $("#activities-more").hide();
      }
      loadingIndicator.hide();
      return this.lastDate;
    };
    ActivitiesView.prototype.addAll = function() {
      if (this.activities.length > 0) {
        this.tutorialOn = false;
        this.lastDate = this.activities.first().getUrlDate();
        if (this.activities.length < 30) {
          $("#activities-more").hide();
        }
      } else {
        if (this.tutorialOn) {
          this.displayTutorial(1);
        } else {
          $("#tutorial").html(null);
        }
        $("#activities-more").hide();
      }
      this.activities.each(this.prependOne);
      loadingIndicator.hide();
      return this.activities.length;
    };
    ActivitiesView.prototype.appendOne = function(activity) {
      var el, row;
      row = new ActivityRow(activity);
      el = row.render();
      $("#activity-list").append(el);
      return row;
    };
    ActivitiesView.prototype.prependOne = function(activity) {
      var el, row;
      row = new ActivityRow(activity);
      el = row.render();
      $("#activity-list").prepend(el);
      loadingIndicator.hide();
      if (this.tutorialOn) {
        this.displayTutorial(2);
        this.tutorialOn = false;
      }
      return row;
    };
    ActivitiesView.prototype.displayTutorial = function(index) {
      return $.get("/activities/tutorial/" + index + "/", function(data) {
        return $("#tutorial-activities").html(data);
      });
    };
    ActivitiesView.prototype.reloadActivities = function(date, path) {
      loadingIndicator.display();
      this.activities.url = this.currentPath;
      if (date) {
        this.activities.url = this.currentPath + date + '-23-59-00/';
      }
      this.activities.fetch();
      return this.activities;
    };
    ActivitiesView.prototype.fetch = function() {
      this.activities.fetch();
      return this.activties;
    };
    ActivitiesView.prototype.onMoreActivitiesClicked = function() {
      loadingIndicator.display();
      if (this.lastDate) {
        this.moreActivities.url = this.currentPath + this.lastDate;
      } else {
        this.moreActivities.url = this.currentPath;
      }
      this.moreActivities.fetch();
      return this.moreActivities;
    };
    /* UI Builders  */
    ActivitiesView.prototype.setListeners = function() {
      return $("input#activities-from-datepicker").datepicker({
        onSelect: this.onDatePicked
      });
    };
    ActivitiesView.prototype.setWidgets = function() {
      $("#activities-my-button").button();
      $("#activities-all-button").button();
      $("#activities-all-button").button("disable");
      $("#activities-more").button();
      return $("#activities-from-datepicker").val(null);
    };
    return ActivitiesView;
  })();
  loadingIndicator = new LoadingIndicator;
  confirmationDialog = new ConfirmationDialog;
  activitiesApp = new ActivitiesView;
  activitiesApp.setWidgets();
  activitiesApp.setListeners();
  activitiesApp.fetch();
}).call(this);