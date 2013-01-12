
// Next:
//
// - Samples
// - Blog layout with header, content, sidebar, and footer (svbtle)
// - Mini layout of form items -- login page?
// - Interop with bootstrap's grid
//

// Other panels
// pinterest / masonry: http://masonry.desandro.com/
// http://www.wookmark.com/jquery-plugin


// svbtle layout: 
// Need a dockpanel that fills entire window. 
// Depending on size sometimes the sidebar scrolls w/ content and sometimes it doesn't.


// TODO:
// - fix DockPanel's sizing
// - make same panel type available in multiple places on the page
// - ensure it only does layout when it has children live and connected
// - allow children to size to content (i.e. take up vertical space)
// - define vertical alignment somehow
// - handle clipping / scrolling


(function(){
  var Layer = window.Layer = {};

  //
  // Classes
  //

  // Common base class. Meant to be abstract
  var Panel = (function(){
    function Panel($el){
      this.$el = $el;
      this.layout();

      // TODO: is this overkill?
      self = this;
      $(window).resize(function(){
        self.layout();
      });
    }

    Panel.prototype.children = function(){
      return this.$el.children();
    };

    return Panel;
  })();

  var DockPanel = Layer.DockPanel = (function(){
    __extends(DockPanel, Panel);

    function DockPanel($el){
      return this.base($el);
    }

    DockPanel.prototype.layout = function() {

      // TODO: what if children don't specify how they dock?
      // TODO: deal with what happens when we run out of space.
      // TODO: implement bottom and right
      
      var numChildren = this.children().length;
      var contentWidth = this.$el.width();
      var contentHeight = this.$el.height();

      var contentArea = new Rect(0, 0, contentWidth, contentHeight);

      this.children().each(function(index, item) {

        var $child = $(item);
        $child.css('position','absolute'); // otherwise width measurements could take up whole client area
        var width = $child.outerWidth(true);
        var height = $child.outerHeight(true);

        var offsetX = 0;
        var offsetY = 0;

        if ($child.hasClass('dock-top')){

          setOuterWidth($child, contentArea.width);
          offsetX = contentArea.x;
          offsetY = contentArea.y;

          contentArea.y += height;
          contentArea.height -= height;
        }
        else if ($child.hasClass('dock-left')){

          setOuterHeight($child, contentArea.height);
          offsetX = contentArea.x;
          offsetY = contentArea.y;

          contentArea.x += width;
          contentArea.width -= width;
        }
        else if ($child.hasClass('dock-right')){

        }
        else if ($child.hasClass('dock-bottom')){
          
        }
        else if (index + 1 == numChildren){
          // last child with nothing specified fills the remaining space
          setOuterWidth($child, contentArea.width);
          setOuterHeight($child, contentArea.height);
          offsetX = contentArea.x;
          offsetY = contentArea.y;

          contentArea.width = 0;
          contentArea.height = 0;
        }


        // Lay out the children
        $child.css({
          transform: 'translate(' + offsetX + 'px, ' + offsetY + 'px)'
        });
      });

      // TODO: panel has to size properly... fix this later
      // Default is size to content. Handle when someone sets the size.
      this.$el.width(contentWidth);
      this.$el.height(contentHeight);
    };

    return DockPanel;

  })();

  var WrapPanel = (function(){
    __extends(WrapPanel, Panel);

    function WrapPanel($el){
      return this.base($el);
    }


    WrapPanel.prototype.layout = function() {
      
      var availableWidth = this.$el.width();
      var offsetX = 0;
      var offsetY = 0;
      var rowHeight = 0;

      this.children().each(function(index, item) {

        var $child = $(item);
        var width = $child.outerWidth(true);
        var height = $child.outerHeight(true);

        rowHeight = rowHeight < height ? height : rowHeight;

        if (offsetX + width > availableWidth && offsetX > 0) // offsetX > 0: if first element in a row is too big for the row, place it anyway.
        {
          offsetY += rowHeight;
          rowHeight = height;  // reset row height for the new row
          offsetX = 0;
        }

        // Lay out the children
        $child.css({
          position : 'absolute',
          transform: 'translate(' + offsetX + 'px, ' + offsetY + 'px)'
        });

        offsetX += width;

      });

      // Give the panel a height based on the children
      this.$el.height(offsetY + rowHeight);
    };

    return WrapPanel;

  })();


  var StackPanel = (function(){
    __extends(StackPanel, Panel);

    function StackPanel($el, horizontal){
      this.base($el);
      this.horizontal = (horizontal !== undefined ? horizontal : true)
    }

    StackPanel.prototype.layout = function() {      
      var totalWidth = 0;
      var maxHeight = 0;

      this.children().each(function(index, item) {

        var $child = $(item);
        var width = $child.outerWidth(true);
        var height = $child.outerHeight(true);


        // Lay out the children
        $child.css('position', 'absolute');
        $child.css("transform","translateX(" + totalWidth + "px)");
        totalWidth += width;

        maxHeight = maxHeight < height ? height : maxHeight;

      });

      // Give the panel a width and height based on the children
      this.$el.width(totalWidth);
      this.$el.height(maxHeight);
    };

    return StackPanel;

  })();


  // Manages the instances of the panels on a page
  var Controller = (function(){

    var panelClasses = { 
      dockpanel : DockPanel, 
      stackpanel : StackPanel, 
      wrappanel : WrapPanel };

    function Controller(){
      $(function(){

        // On document.ready instantiate and attach the panels.
        // TODO: handle multiple of the same type on the page
        for (var cssClass in panelClasses) {
          var $element = $('.' + cssClass);
          if ($element.length) {
            var x = new panelClasses[cssClass]($element);
          }
        }
      });
    }

    return Controller;
  })();

  var controller = new Controller();

  //
  // Utilities
  //

  function Rect(x, y, width, height){
    // TODO: default to 0
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  function setOuterWidth($element, width){
    $element.width(width - ($element.outerWidth(true) - $element.width()))
  }

  function setOuterHeight($element, height){
    $element.height(height - ($element.outerHeight(true) - $element.height()))
  }

  // Prototypical inheritance.
  function __extends(child, parent){
    function ctor() { 
      this.constructor = child; 
    } 

    // instance variables (properties)
    $.extend(child, parent);  

    ctor.prototype = parent.prototype; 
    child.prototype = new ctor(); 
    child.__super__ = parent.prototype; 

    // Add function for the child to call the parent constructor
    parent.prototype.base = function(){
      return parent.apply(this, arguments);
    }

    return child;
  } 
}).call(this);