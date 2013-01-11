
// Next:
// - Panels automatically attach to class names
// - Namespace
//
// - Samples
// - Blog layout with header, content, sidebar, and footer (svbtle)
// - Mini layout of form items -- login page?
// - Interop with bootstrap's grid
//
// - base class for panels

// Other panels
// pinterest / masonry: http://masonry.desandro.com/
// http://www.wookmark.com/jquery-plugin


// TODO:
// - make StackPanel work on any element and in multiple places
// - ensure it only does layout when it has children live and connected
// - allow children to size to content (i.e. take up vertical space)
// - define vertical alignment somehow
// - handle clipping / scrolling


(function(){
  var Layer = window.Layer = {};

  //
  // Helpers
  //
  var Rect = (function(){
    function Rect(x, y, width, height){
      // TODO: default to 0
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    return Rect;
  })();

  function setOuterWidth(element, width){
    element.width(width - (element.outerWidth(true) - element.width()))
  }

  function setOuterHeight(element, height){
    element.height(height - (element.outerHeight(true) - element.height()))
  }


  var DockPanel = Layer.DockPanel = (function(){

    function DockPanel($el){
      // TODO: what if unspecified?
      this.$el = $el; // borrow from backbone
      this.layout();
    }

    DockPanel.prototype.children = function(){
      return this.$el.children();
    };

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
          position : 'absolute',
          transform: 'translate(' + offsetX + 'px, ' + offsetY + 'px)'
        });
      });

      // TODO: panel has to size properly... fix this later
      this.$el.width(contentWidth);
      this.$el.height(contentHeight);
    };

    return DockPanel;

  })();

  var WrapPanel = (function(){

    function WrapPanel(){
      this.$el = $('#container');   // borrow from backbone
    }

    WrapPanel.prototype.children = function(){
      return this.$el.children();
    };

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

    function StackPanel(horizontal){

      this.horizontal = (horizontal !== undefined ? horizontal : true)
      this.$el = $('#container');   // borrow from backbone
    }

    StackPanel.prototype.children = function(){
      return this.$el.children();
    };

    StackPanel.prototype.layout = function() {
      // run layout. maybe don't need measure and arrange just yet.

      
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
      'dockpanel' : DockPanel, 
      'stackpanel': StackPanel, 
      'wrappanel': WrapPanel };

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

      // todo: attach each panel to a resize event to rerun layout
      // $(window).resize(function(){
      //   x.layout();
      // });
    }



    return Controller;
  }).call(this);

  var controller = new Controller();
 
}).call(this);