  
// Positioning
// position:relative means 'activate top, left'. You can then move it relative to where it would have been in layout already
// position:absolute means 'don't give me space in layout'.
// top and left, if set, are relative to the window or the first parent that's also relative or absolute
// If all children of an are absolute, then element now has no height.

// Size Constraints
// Seems to work as expected by default, including width, height.
// Width, height are always size of content area. outerWidth(true) is everything, with margin

// Overflow
// Doesn't work. Part of layout, and we've turned it off with absolute. 
// My panel's overflow property is now useless

// clipping -- for the elment that's absolutely positioned
// apply clip to child if necessary. clip is relative to child's space.
// $child.css('clip', 'rect(0px,60px,200px,0px)');


// Alternative
// Just set proper css classes. 
// Can this all be done in CSS with no JS? What's the benefit then?


// Next:
// Think of a real-world case. Create a panel to support it
// - Blog layout with header, content, sidebar, and footer
// - Mini layout of form items

// Other panels
// pinterest / masonry: http://masonry.desandro.com/



// TODO: 
// - How to be notified for all cases where layout might change? 
//   - resize of container, added / removed elements
// - make StackPanel work on any element and in multiple places
// - ensure it only does layout when it has children live and connected
// - allow children to size to content (i.e. take up vertical space)
// - define vertical alignment somehow
// - handle clipping / scrolling

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



(function(){


  var DockPanel = (function(){

    function DockPanel(){
      this.$el = $('#container');   // borrow from backbone
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
        $child.css('position', 'absolute');
        $child.css('transform','translate(' + offsetX + 'px, ' + offsetY + 'px)');

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
        $child.css('position', 'absolute');
        $child.css('transform','translate(' + offsetX + 'px, ' + offsetY + 'px)');
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

  var x;
  $(function(){
  //  x = new StackPanel(true);
    x = new DockPanel();
    x.layout();
  });

  $(window).resize(function(){
    x.layout();
  });


 
})();